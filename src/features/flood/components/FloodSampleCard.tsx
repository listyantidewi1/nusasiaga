import { AlertTriangle } from "lucide-react";
import { floodReports } from "@/lib/flood-reports";

export function FloodSampleCard() {
  // The most demonstrative report in Scenario A: trapped elderly + downed
  // power line at Tegal Sari Block 5 (severity 4, immediate evacuation).
  const featured =
    floodReports.find(
      (r) => r.severity === 4 && r.people_visible.trapped_apparent > 0,
    ) ?? floodReports[0];

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/70 to-slate-900 p-6">
      <h3 className="mb-4 text-xl font-bold">Field Triage · sample report</h3>
      <div className="rounded-2xl border border-red-400/20 bg-black/30 p-5">
        <div className="mb-4 flex items-center gap-3 text-red-300">
          <AlertTriangle />
          <span className="font-semibold">
            Sev {featured.severity} · {featured.location.label}
          </span>
        </div>
        <p className="text-slate-300">&ldquo;{featured.severity_rationale}&rdquo;</p>
        <div className="mt-5 rounded-xl bg-red-500/10 p-4 text-sm text-red-100">
          <span className="font-semibold">Immediate action:</span>{" "}
          {featured.immediate_action}
        </div>
        <div className="mt-3 text-[11px] text-slate-500">
          Produced on-device by Gemma 4 E2B via Google AI Edge LiteRT.
        </div>
      </div>
    </div>
  );
}
