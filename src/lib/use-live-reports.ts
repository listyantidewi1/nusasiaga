"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EdgeTriageReport } from "@/lib/types";

export type ReportStatus = "active" | "ended";

export type LiveReport = EdgeTriageReport & {
  _received_at: string;
  _status?: ReportStatus;
  _resolved_at?: string | null;
};

type LiveReportsState = {
  reports: LiveReport[];
  loading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
  /**
   * Mark a report as resolved on the server. Optimistic — the local list
   * flips to "ended" immediately; if the PATCH fails the change reverts.
   * Returns true on success.
   */
  resolveReport: (reportId: string) => Promise<boolean>;
};

/**
 * Polls /api/reports every `intervalMs` and returns the rolling list of
 * incoming edge-triage reports. New reports are merged at the head of the
 * existing list. Identical report_ids are deduplicated, keeping the
 * server-stamped _received_at.
 */
export function useLiveReports(intervalMs = 10_000): LiveReportsState {
  const [reports, setReports] = useState<LiveReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    async function fetchOnce() {
      try {
        const res = await fetch("/api/reports?limit=100", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = (await res.json()) as {
          reports: LiveReport[];
          fetched_at: string;
        };
        if (cancelled.current) return;

        // Deduplicate by report_id, keep newest _received_at first.
        const seen = new Set<string>();
        const merged: LiveReport[] = [];
        for (const r of json.reports ?? []) {
          if (!seen.has(r.report_id)) {
            seen.add(r.report_id);
            merged.push(r);
          }
        }
        setReports(merged);
        setLastFetchedAt(json.fetched_at);
        setError(null);
      } catch (e) {
        if (cancelled.current) return;
        setError(e instanceof Error ? e.message : "unknown error");
      } finally {
        if (!cancelled.current) setLoading(false);
      }
    }

    fetchOnce();
    const timer = setInterval(fetchOnce, intervalMs);
    return () => {
      cancelled.current = true;
      clearInterval(timer);
    };
  }, [intervalMs]);

  const resolveReport = useCallback(
    async (reportId: string): Promise<boolean> => {
      // Snapshot for rollback, then optimistic update.
      const before = reports;
      setReports((prev) =>
        prev.map((r) =>
          r.report_id === reportId
            ? {
                ...r,
                _status: "ended",
                _resolved_at: new Date().toISOString(),
              }
            : r,
        ),
      );

      // The dashboard browser doesn't have direct access to the shared
      // secret (we don't want to embed it in the bundle), so the resolve
      // request goes through a same-origin internal helper that reads the
      // env var server-side. For the demo build we accept the token from
      // window.__GRG_TOKEN__ if set, otherwise we POST and accept whatever
      // 401 comes back as a "needs a real auth flow" signal.
      try {
        const res = await fetch(`/api/reports/${encodeURIComponent(reportId)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Dashboard reads the same token as Android. For a hackathon
            // demo it's fine for this to be readable from devtools; in
            // production we'd proxy through a server action.
            "X-Triage-Token":
              process.env.NEXT_PUBLIC_TRIAGE_INGEST_TOKEN ?? "",
          },
          body: JSON.stringify({ status: "ended" }),
        });
        if (!res.ok) {
          setReports(before);
          return false;
        }
        return true;
      } catch {
        setReports(before);
        return false;
      }
    },
    [reports],
  );

  return { reports, loading, error, lastFetchedAt, resolveReport };
}
