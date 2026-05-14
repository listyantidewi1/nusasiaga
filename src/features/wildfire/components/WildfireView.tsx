import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { LocalAiMode } from "@/features/dashboard/components/LocalAiMode";
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
 * Wildfire monitoring view: global NASA FIRMS VIIRS satellite hotspots,
 * environmental impact stats, regional incident feed, plus the live
 * field-reports panel so phone uploads with disaster_type="fire" surface
 * here alongside the satellite signal.
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
      <ReportGrid reports={reports} />
      <LocalAiMode />
    </>
  );
}
