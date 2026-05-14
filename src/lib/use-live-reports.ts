"use client";

import { useEffect, useRef, useState } from "react";
import type { EdgeTriageReport } from "@/lib/types";

export type LiveReport = EdgeTriageReport & { _received_at: string };

type LiveReportsState = {
  reports: LiveReport[];
  loading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
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

  return { reports, loading, error, lastFetchedAt };
}
