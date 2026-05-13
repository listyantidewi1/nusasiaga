import { AlertTriangle } from "lucide-react";

export function HazardAnalyzer() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-red-950/70 to-slate-900 p-6">
      <h3 className="mb-4 text-xl font-bold">AI Hazard Analyzer</h3>
      <div className="rounded-2xl border border-red-400/20 bg-black/30 p-5">
        <div className="mb-4 flex items-center gap-3 text-red-300">
          <AlertTriangle />
          <span className="font-semibold">Critical Field Report</span>
        </div>
        <p className="text-slate-300">
          “Dense smoke seen near peatland. Visibility below 200 meters. Several
          residents report breathing difficulty.”
        </p>
        <div className="mt-5 rounded-xl bg-red-500/10 p-4 text-sm text-red-100">
          Severity: HIGH · Recommended action: distribute masks, avoid outdoor
          activity, prepare evacuation route, notify local response team.
        </div>
      </div>
    </div>
  );
}
