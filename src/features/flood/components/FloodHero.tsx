import { AlertOctagon, Layers, Radio, Users } from "lucide-react";
import { Metric } from "@/components/shared/Metric";
import { floodReports } from "@/lib/flood-reports";
import { scenarioASynthesis } from "@/lib/synthesis-scenario-a";

export function FloodHero() {
  const sd = scenarioASynthesis.severity_distribution;
  const sev4plus = sd["4"] + sd["5"];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm text-red-300">
        <Radio size={16} /> Active Incident · Central Jakarta
      </div>
      <h2 className="max-w-3xl text-5xl font-black leading-tight">
        Same Gemma 4 family, from the responder&rsquo;s phone to the command
        center.
      </h2>
      <p className="mt-5 max-w-2xl text-lg text-slate-300">
        Field responders capture photos and voice notes on phones running
        Gemma 4 E2B fully offline. Reports queue locally and sync when
        connectivity returns. Gemma 4 31B consolidates them into one
        operational picture.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric
          icon={<Layers />}
          label="Reports synthesized"
          value={String(floodReports.length)}
        />
        <Metric
          icon={<AlertOctagon />}
          label="Severe (sev 4+)"
          value={String(sev4plus)}
        />
        <Metric
          icon={<Users />}
          label="People affected"
          value={`~${scenarioASynthesis.estimated_affected.people_count_min}-${scenarioASynthesis.estimated_affected.people_count_max}`}
        />
      </div>
    </div>
  );
}
