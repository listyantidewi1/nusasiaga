"use client";

import type { DashboardHotspotData } from "@/lib/dashboard-hotspots";
import dynamic from "next/dynamic";
import { MapLegend } from "./MapLegend";

const DisasterMapClient = dynamic(
  () => import("./DisasterMapClient").then((mod) => mod.DisasterMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] w-full items-center justify-center bg-slate-900 text-sm text-slate-400">
        Loading map...
      </div>
    ),
  },
);

type DisasterMapProps = {
  data: DashboardHotspotData;
};

export function DisasterMap({ data }: DisasterMapProps) {
  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Indonesia Wildfire Hotspot Map
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Field intelligence for priority monitoring regions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
            {data.sourceLabel}
          </div>
          <div className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {data.hotspots.length} active hotspots
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
          <DisasterMapClient hotspots={data.hotspots} />
        </div>

        <div className="space-y-4">
          <MapLegend />
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            Priority areas use notebook-generated hotspot output when available
            and fall back to stable demo data.
          </div>
        </div>
      </div>
    </section>
  );
}
