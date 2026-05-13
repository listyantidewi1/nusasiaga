import {
  Activity,
  CloudFog,
  Flame,
  Gauge,
  RadioTower,
  Wind,
} from "lucide-react";
import { EnvironmentStatCard } from "./EnvironmentStatCard";

const stats = [
  {
    icon: Gauge,
    label: "Live AQI",
    value: "188",
    detail: "Very unhealthy field estimate near active hotspot cluster.",
    tone: "red" as const,
  },
  {
    icon: Wind,
    label: "Wind Direction",
    value: "SE 18 km/h",
    detail: "Smoke plume drifting toward nearby residential corridors.",
    tone: "sky" as const,
  },
  {
    icon: CloudFog,
    label: "Smoke Spread Risk",
    value: "High",
    detail: "Low visibility and dense particulate concentration reported.",
    tone: "orange" as const,
  },
  {
    icon: Flame,
    label: "Carbon Release Estimate",
    value: "12.4 kt",
    detail: "Modeled from peatland fire intensity and affected area.",
    tone: "amber" as const,
  },
  {
    icon: RadioTower,
    label: "Emergency Priority",
    value: "P1",
    detail: "Immediate response recommended for vulnerable communities.",
    tone: "red" as const,
  },
  {
    icon: Activity,
    label: "Response Readiness",
    value: "72%",
    detail: "Volunteer coordination and supply staging partially ready.",
    tone: "emerald" as const,
  },
];

export function EnvironmentStats() {
  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">
          Environmental Intelligence Stats
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Operational metrics for disaster monitoring workflows.
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
