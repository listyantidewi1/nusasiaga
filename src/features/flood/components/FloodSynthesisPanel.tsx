import {
  AlertOctagon,
  CheckCircle2,
  Layers,
  ShieldAlert,
  Users,
} from "lucide-react";
import { scenarioASynthesis } from "@/lib/synthesis-scenario-a";

const evacBadgeClasses: Record<string, string> = {
  immediate: "border-red-400/40 bg-red-500/20 text-red-100",
  urgent: "border-orange-400/40 bg-orange-500/20 text-orange-100",
  standby: "border-amber-300/40 bg-amber-300/20 text-amber-100",
};

const severityRowColor: Record<number, string> = {
  5: "bg-red-600",
  4: "bg-red-500",
  3: "bg-orange-500",
  2: "bg-amber-500",
  1: "bg-emerald-500",
};

export function FloodSynthesisPanel() {
  const s = scenarioASynthesis;
  const sd = s.severity_distribution;
  const maxCount = Math.max(sd["5"], sd["4"], sd["3"], sd["2"], sd["1"], 1);

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Command Center Synthesis
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Gemma 4 31B consolidated {s.report_count} field reports into one
            operational picture. {s.geographic_scope}
          </p>
        </div>
        <div className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
          Confidence {(s.primary_disaster_classification.confidence * 100).toFixed(0)}%
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
            <Layers size={16} />
            <span className="font-semibold">Severity distribution</span>
          </div>
          <div className="space-y-2 font-mono text-sm">
            {([5, 4, 3, 2, 1] as const).map((lvl) => {
              const count = sd[String(lvl) as "1" | "2" | "3" | "4" | "5"];
              const widthPct = (count / maxCount) * 100;
              return (
                <div key={lvl} className="flex items-center gap-3">
                  <span className="w-12 text-slate-400">sev {lvl}</span>
                  <div className="relative h-6 flex-1 rounded bg-white/5">
                    <div
                      className={`absolute inset-y-0 left-0 rounded ${severityRowColor[lvl]}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-300">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
            <Users size={16} />
            <span className="font-semibold">Vulnerable groups</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {s.vulnerable_groups_summary}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-slate-400">Reports</div>
              <div className="mt-1 text-xl font-bold">{s.report_count}</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-slate-400">Zones</div>
              <div className="mt-1 text-xl font-bold">{s.priority_zones.length}</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-slate-400">Actions</div>
              <div className="mt-1 text-xl font-bold">{s.recommended_actions.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          <AlertOctagon size={16} />
          <span className="font-semibold">Priority zones</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {s.priority_zones.map((zone) => {
            const evacClass =
              evacBadgeClasses[zone.evacuation_priority] ?? evacBadgeClasses.standby;
            return (
              <div
                key={zone.label}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white">{zone.label}</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {zone.report_ids.length} report
                      {zone.report_ids.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${evacClass}`}
                  >
                    {zone.evacuation_priority} · sev {zone.max_severity}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{zone.rationale}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {zone.dominant_hazards.slice(0, 4).map((h) => (
                    <span
                      key={h}
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          <ShieldAlert size={16} />
          <span className="font-semibold">Recommended actions</span>
        </div>
        <ol className="space-y-2">
          {[...s.recommended_actions]
            .sort((a, b) => a.priority - b.priority)
            .map((action) => (
              <li
                key={action.action}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 rounded-md border border-red-400/30 bg-red-500/10 px-2 py-1 text-xs font-bold text-red-200">
                    P{action.priority}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{action.action}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Responsible: {action.responsible_party}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      {action.rationale}
                    </p>
                  </div>
                </div>
              </li>
            ))}
        </ol>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
            <CheckCircle2 size={14} />
            <span className="font-semibold">Report validity flags</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {s.report_validity_notes.map((n) => (
              <li key={n.report_id} className="flex gap-2">
                <span className="shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                  {n.flag}
                </span>
                <span className="font-mono text-slate-500">
                  {n.report_id.slice(-12)}
                </span>
                <span className="text-slate-400">— {n.rationale}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-2 text-sm font-semibold text-slate-300">
            Data confidence notes
          </div>
          <p className="text-sm text-slate-300 italic leading-relaxed">
            {s.data_confidence_notes}
          </p>
        </div>
      </div>
    </section>
  );
}
