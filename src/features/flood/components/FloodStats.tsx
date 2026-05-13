import {
  Activity,
  AlertOctagon,
  ClipboardList,
  MapPin,
  ShieldAlert,
  Users,
} from "lucide-react";
import { scenarioASynthesis } from "@/lib/synthesis-scenario-a";
import { EnvironmentStatCard } from "@/features/environment/components/EnvironmentStatCard";

export function FloodStats() {
  const s = scenarioASynthesis;

  const immediateZones = s.priority_zones.filter(
    (z) => z.evacuation_priority === "immediate",
  ).length;

  const stats = [
    {
      icon: ClipboardList,
      label: "Reports synthesized",
      value: String(s.report_count),
      detail: "Field reports consolidated by Gemma 4 31B in the command center.",
      tone: "sky" as const,
    },
    {
      icon: AlertOctagon,
      label: "Priority zones",
      value: String(s.priority_zones.length),
      detail: `${immediateZones} require immediate evacuation; remainder are urgent.`,
      tone: immediateZones > 0 ? ("red" as const) : ("orange" as const),
    },
    {
      icon: Users,
      label: "People affected (est.)",
      value: `${s.estimated_affected.people_count_min}-${s.estimated_affected.people_count_max}`,
      detail: s.estimated_affected.method,
      tone: "amber" as const,
    },
    {
      icon: ShieldAlert,
      label: "Hazards consolidated",
      value: String(s.consolidated_hazards.length),
      detail: `Cross-report aggregation; ${s.consolidated_hazards[0]?.hazard ?? "none"} most frequent.`,
      tone: "orange" as const,
    },
    {
      icon: Activity,
      label: "Recommended actions",
      value: String(s.recommended_actions.length),
      detail: "Ranked by life-safety priority across all zones.",
      tone: "red" as const,
    },
    {
      icon: MapPin,
      label: "Geographic scope",
      value: "Jakarta",
      detail: s.geographic_scope.slice(0, 120) + "...",
      tone: "emerald" as const,
    },
  ];

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">
          Operational Intelligence
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Live metrics derived from the consolidated Gemma 4 synthesis.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <EnvironmentStatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
