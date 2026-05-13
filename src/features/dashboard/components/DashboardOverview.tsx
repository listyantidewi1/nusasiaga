import { DashboardHero } from "./DashboardHero";
import { HazardAnalyzer } from "./HazardAnalyzer";

export function DashboardOverview() {
  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <DashboardHero />
      <HazardAnalyzer />
    </div>
  );
}
