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
import { loadDashboardHotspots } from "@/lib/dashboard-hotspots";
import { reports } from "@/lib/reports";

async function fetchLiveHotspots() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/firms`,
      {
        next: { revalidate: 1800 }, // revalidate every 30 minutes
      }
    );
    if (!res.ok) throw new Error(`FIRMS API error: ${res.status}`);
    const data = await res.json();
    if (!data.hotspots || data.hotspots.length === 0) throw new Error("Empty hotspots");
    return data;
  } catch (err) {
    console.warn("[NusaSiaga] Live FIRMS fetch failed, falling back:", err);
    return null;
  }
}

export default async function Home() {
  // Try NASA FIRMS live first, fallback to notebook JSON, fallback to demo
  const liveData = await fetchLiveHotspots();
  const hotspotData = liveData ?? (await loadDashboardHotspots());

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <AppHeader />
        <DashboardOverview />
        <DisasterMap data={hotspotData} />
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
