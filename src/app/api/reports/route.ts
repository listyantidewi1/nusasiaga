/**
 * /api/reports — the bridge between the Android edge tier and the
 * NusaSiaga dashboard.
 *
 *   POST  /api/reports          ingest one EdgeTriageReport (phone -> here)
 *   GET   /api/reports          read recent reports (here -> dashboard)
 *   GET   /api/reports?since=…  only reports received after a given ISO time
 *
 * Storage: Upstash Redis (provisioned via Vercel Marketplace, env vars
 * auto-injected). Reports are stored as a list keyed by REPORTS_KEY; newest
 * at index 0, trimmed to MAX_REPORTS.
 *
 * Auth: POST requires an `x-triage-token` header matching the server-side
 * TRIAGE_INGEST_TOKEN env var. GET is public — the dashboard browser would
 * leak any header anyway, and triage reports are not sensitive data.
 */

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import type { EdgeTriageReport } from "@/lib/types";

const REPORTS_KEY = "grg:reports";
const MAX_REPORTS = 500;

type StoredReport = EdgeTriageReport & { _received_at: string };

// Lazy-init so local dev without Redis env vars doesn't crash.
let cached: Redis | null | undefined = undefined;
function getRedis(): Redis | null {
  if (cached !== undefined) return cached;
  try {
    cached = Redis.fromEnv();
  } catch {
    cached = null;
  }
  return cached;
}

function isValidReport(obj: unknown): obj is EdgeTriageReport {
  if (typeof obj !== "object" || obj === null) return false;
  const r = obj as Record<string, unknown>;
  if (typeof r.report_id !== "string" || !r.report_id) return false;
  if (typeof r.disaster_type !== "string") return false;
  if (typeof r.severity !== "number" || r.severity < 1 || r.severity > 5) {
    return false;
  }
  if (typeof r.severity_rationale !== "string") return false;
  if (typeof r.immediate_action !== "string") return false;
  if (typeof r.routing_recommendation !== "string") return false;
  if (!Array.isArray(r.hazards_visible)) return false;
  if (typeof r.people_visible !== "object" || r.people_visible === null) {
    return false;
  }
  return true;
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const expectedToken = process.env.TRIAGE_INGEST_TOKEN ?? "";
  if (!expectedToken) {
    return NextResponse.json(
      { error: "server misconfigured: TRIAGE_INGEST_TOKEN not set" },
      { status: 500 },
    );
  }

  const providedToken = req.headers.get("x-triage-token");
  if (providedToken !== expectedToken) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!isValidReport(body)) {
    return NextResponse.json(
      { error: "schema mismatch — does not match EdgeTriageReport" },
      { status: 422 },
    );
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { error: "storage not configured (Redis env vars missing)" },
      { status: 503 },
    );
  }

  const report = body;
  const received_at = new Date().toISOString();
  const stored: StoredReport = { ...report, _received_at: received_at };

  try {
    await redis.lpush(REPORTS_KEY, JSON.stringify(stored));
    await redis.ltrim(REPORTS_KEY, 0, MAX_REPORTS - 1);
  } catch (e) {
    console.error("Redis write failed", e);
    return NextResponse.json({ error: "storage write failed" }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    report_id: report.report_id,
    received_at,
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limitParam = parseInt(url.searchParams.get("limit") ?? "100", 10);
  const limit = Math.min(
    Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 100,
    MAX_REPORTS,
  );
  const since = url.searchParams.get("since");

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({
      reports: [],
      count: 0,
      fetched_at: new Date().toISOString(),
      note: "storage not configured",
    });
  }

  let items: StoredReport[] = [];
  try {
    const raw = await redis.lrange(REPORTS_KEY, 0, limit - 1);
    items = raw
      .map((s): StoredReport | null => {
        if (typeof s === "string") {
          try {
            return JSON.parse(s) as StoredReport;
          } catch {
            return null;
          }
        }
        // Upstash REST occasionally returns parsed objects already.
        return s as StoredReport;
      })
      .filter((r): r is StoredReport => r !== null);
  } catch (e) {
    console.error("Redis read failed", e);
    return NextResponse.json(
      { error: "storage read failed", reports: [], count: 0 },
      { status: 503 },
    );
  }

  if (since) {
    items = items.filter((r) => r._received_at > since);
  }

  return NextResponse.json({
    reports: items,
    count: items.length,
    fetched_at: new Date().toISOString(),
  });
}
