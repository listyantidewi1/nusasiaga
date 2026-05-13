"use client";

import { useFloodScenario } from "./FloodScenarioContext";
import { FloodReportCard } from "./FloodReportCard";

export function FloodReportFeed() {
  const { scenario } = useFloodScenario();
  const ordered = [...scenario.reports].sort((a, b) =>
    b.timestamp_iso.localeCompare(a.timestamp_iso),
  );

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Field Reports — Live Feed
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Triage produced by Gemma 4 E2B on responder phones, fully
            offline. Each card is one EdgeTriageReport from {scenario.shortLabel}.
          </p>
        </div>
        <div className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
          {ordered.length} reports {scenario.synthesis ? "synced" : "queued"}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {ordered.map((report) => (
          <FloodReportCard key={report.report_id} report={report} />
        ))}
      </div>
    </section>
  );
}
