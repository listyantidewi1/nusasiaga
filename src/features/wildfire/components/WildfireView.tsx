import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { LocalAiMode } from "@/features/dashboard/components/LocalAiMode";
import { DemoReadinessPanel } from "@/features/demo/components/DemoReadinessPanel";
import { EnvironmentStats } from "@/features/environment/components/EnvironmentStats";
import { HazardAnalysisPanel } from "@/features/hazard-analysis/components/HazardAnalysisPanel";
import { IncidentFeed } from "@/features/incidents/components/IncidentFeed";
import { IncomingReportsPanel } from "@/features/live-reports/components/IncomingReportsPanel";
import { DisasterMap } from "@/features/maps/components/DisasterMap";
import { ReportGrid } from "@/features/reports/components/ReportGrid";
import type { DashboardHotspotsPayload } from "@/lib/dashboard-hotspots";
import { reports } from "@/lib/reports";

type WildfireViewProps = {
  hotspotData: DashboardHotspotsPayload;
};

/**
 * The Wildfire Monitoring tab: live NASA FIRMS satellite hotspots across
 * Indonesia, with the original NusaSiaga dashboard components.
 */
export function WildfireView({ hotspotData }: WildfireViewProps) {
  return (
    <>
      <DashboardOverview />
      <DisasterMap data={hotspotData} />
      <HazardAnalysisPanel />
      <IncomingReportsPanel />
      <EnvironmentStats />
      <IncidentFeed />
      <DemoReadinessPanel />
      <ReportGrid reports={reports} />
      <LocalAiMode />
    </>
  );
}
