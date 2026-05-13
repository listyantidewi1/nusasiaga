import { AppHeader } from "@/components/shared/AppHeader";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { LocalAiMode } from "@/features/dashboard/components/LocalAiMode";
import { DemoReadinessPanel } from "@/features/demo/components/DemoReadinessPanel";
import { EnvironmentStats } from "@/features/environment/components/EnvironmentStats";
import { HazardAnalysisPanel } from "@/features/hazard-analysis/components/HazardAnalysisPanel";
import { IncidentFeed } from "@/features/incidents/components/IncidentFeed";
import { DisasterMap } from "@/features/maps/components/DisasterMap";
import { OfflineResiliencePanel } from "@/features/offline/components/OfflineResiliencePanel";
import { ReportGrid } from "@/features/reports/components/ReportGrid";
import { reports } from "@/lib/reports";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <AppHeader />
        <DashboardOverview />
        <DisasterMap />
        <HazardAnalysisPanel />
        <EnvironmentStats />
        <IncidentFeed />
        <OfflineResiliencePanel />
        <DemoReadinessPanel />
        <ReportGrid reports={reports} />
        <LocalAiMode />
      </section>
    </main>
  );
}
