import { AppHeader } from "@/components/shared/AppHeader";
import { TabbedDashboard } from "@/features/dashboard/components/TabbedDashboard";
import { FloodView } from "@/features/flood/components/FloodView";
import { WildfireView } from "@/features/wildfire/components/WildfireView";
import { loadDashboardHotspots } from "@/lib/dashboard-hotspots";

async function fetchLiveHotspots() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/firms`,
      {
        next: { revalidate: 1800 }, // revalidate every 30 minutes
      },
    );
    if (!res.ok) throw new Error(`FIRMS API error: ${res.status}`);
    const data = await res.json();
    if (!data.hotspots || data.hotspots.length === 0)
      throw new Error("Empty hotspots");
    return data;
  } catch (err) {
    console.warn("[NusaSiaga] Live FIRMS fetch failed, falling back:", err);
    return null;
  }
}

export default async function Home() {
  // Wildfire tab data: NASA FIRMS live -> notebook JSON -> demo fallback.
  const liveData = await fetchLiveHotspots();
  const hotspotData = liveData ?? (await loadDashboardHotspots());

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <AppHeader />
        <TabbedDashboard
          wildfire={<WildfireView hotspotData={hotspotData} />}
          flood={<FloodView />}
        />
      </section>
    </main>
  );
}
