import { HazardAnalyzer } from "@/features/dashboard/components/HazardAnalyzer";
import { EnvironmentStats } from "@/features/environment/components/EnvironmentStats";
import { IncidentFeed } from "@/features/incidents/components/IncidentFeed";
import { IncomingReportsPanel } from "@/features/live-reports/components/IncomingReportsPanel";
import { DisasterMap } from "@/features/maps/components/DisasterMap";
import type { DashboardHotspotsPayload } from "@/lib/dashboard-hotspots";

type WildfireViewProps = {
  hotspotData: DashboardHotspotsPayload;
};

/**
 * Wildfire monitoring view — passive satellite intelligence layer.
 *
 * Top: the single worst FIRMS-detected hazard near the viewer's
 * geolocation, with a recommended action. Then the map, the live
 * field-reports feed (so phone uploads with disaster_type="fire"
 * surface here), real-time AQI + wind from Open-Meteo anchored at
 * the viewer's location, and the proximity-ranked incident feed.
 *
 * Nothing here is hardcoded — every value flows from a live source
 * (NASA FIRMS, Open-Meteo, the dashboard's /api/reports endpoint).
 */
export function WildfireView({ hotspotData }: WildfireViewProps) {
  return (
    <div className="mt-10 space-y-6">
      <HazardAnalyzer hotspots={hotspotData.hotspots} />
      <DisasterMap data={hotspotData} />
      <IncomingReportsPanel
        title="Live field reports (fire-related)"
      />
      <EnvironmentStats hotspots={hotspotData.hotspots} />
      <IncidentFeed hotspots={hotspotData.hotspots} />
    </div>
  );
}
