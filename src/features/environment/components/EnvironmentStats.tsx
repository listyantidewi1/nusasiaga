"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CloudFog,
  Flame,
  Gauge,
  RadioTower,
  Wind,
} from "lucide-react";
import { EnvironmentStatCard } from "./EnvironmentStatCard";
import type { DashboardHotspot } from "@/lib/dashboard-hotspots";

type Tone =
  | "amber"
  | "emerald"
  | "orange"
  | "red"
  | "sky"
  | "slate";

type EnvironmentResponse = {
  fetched_at: string;
  lat: number;
  lon: number;
  aqi: { value: number; label: string } | null;
  wind: {
    speed_kmh: number;
    direction_deg: number;
    direction_compass: string;
  } | null;
  temperature_c: number | null;
};

type Props = {
  /** All hotspots in the current FIRMS payload — used to anchor the AQI/wind
   * query to where the action is, and to derive FRP-based metrics. */
  hotspots?: DashboardHotspot[];
};

/**
 * Computes a centroid weighted by Fire Radiative Power so the AQI/wind
 * query lands near the worst active fire cluster. If no hotspots have FRP,
 * falls back to a simple mean. If the list is empty, returns null and the
 * API uses its default location (central Jakarta).
 */
function frpCentroid(
  hotspots: DashboardHotspot[],
): { lat: number; lon: number } | null {
  if (hotspots.length === 0) return null;
  // Consider only the top-20 by risk_score so a single intense fire dominates
  // the anchor rather than getting averaged out by hundreds of low-FRP pixels.
  const top = [...hotspots]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 20);
  let wLatSum = 0;
  let wLonSum = 0;
  let wSum = 0;
  for (const h of top) {
    const w = Math.max(h.frp ?? 0, 1);
    wLatSum += h.lat * w;
    wLonSum += h.lon * w;
    wSum += w;
  }
  if (wSum === 0) return { lat: top[0].lat, lon: top[0].lon };
  return { lat: wLatSum / wSum, lon: wLonSum / wSum };
}

/**
 * Very rough modelled estimate of CO2 release from a set of fire pixels.
 * Based on a simplified GFED/FIRE-CCI heuristic:
 *   ~1 MW-day of FRP integrates to roughly 1.1 t of CO2 for vegetation,
 *   ~3-5x for peatland combustion. We assume detections persist ~6 hours
 *   between satellite passes.
 *
 * Output: kilotonnes CO2-equivalent. Cap at 0 if we have no FRP signal.
 */
function carbonReleaseKt(hotspots: DashboardHotspot[]): number {
  if (hotspots.length === 0) return 0;
  let totalMwDay = 0;
  for (const h of hotspots) {
    const mw = h.frp ?? 0;
    const hours = 6; // assumed persistence window between passes
    const peatlandMultiplier =
      h.smoke_impact === "severe" || h.smoke_impact === "high" ? 3.5 : 1.2;
    totalMwDay += (mw * hours) / 24 * peatlandMultiplier;
  }
  // 1 MW-day ≈ 1.1 tonnes CO2 → divide by 1000 for kilotonnes.
  const kt = (totalMwDay * 1.1) / 1000;
  return Math.round(kt * 10) / 10;
}

/** Derive an emergency priority bucket from severity counts. */
function emergencyPriority(hotspots: DashboardHotspot[]): {
  value: string;
  detail: string;
  tone: Tone;
} {
  const critical = hotspots.filter((h) => h.severity === "CRITICAL").length;
  const high = hotspots.filter((h) => h.severity === "HIGH").length;
  if (critical >= 5) {
    return {
      value: "P1",
      detail: `${critical} critical-severity hotspots — immediate response posture.`,
      tone: "red",
    };
  }
  if (critical >= 1 || high >= 5) {
    return {
      value: "P2",
      detail: `${critical} critical, ${high} high-severity hotspots — accelerated response.`,
      tone: "orange",
    };
  }
  if (high >= 1) {
    return {
      value: "P3",
      detail: `${high} high-severity hotspots — elevated monitoring.`,
      tone: "amber",
    };
  }
  return {
    value: "P4",
    detail: "No critical or high-severity hotspots in the current pass.",
    tone: "emerald",
  };
}

/** Derive smoke-spread risk from wind speed × AQI category. */
function smokeSpreadRisk(env: EnvironmentResponse | null): {
  value: string;
  detail: string;
  tone: Tone;
} {
  const aqi = env?.aqi?.value ?? null;
  const wind = env?.wind?.speed_kmh ?? null;
  if (aqi == null && wind == null) {
    return {
      value: "—",
      detail: "Awaiting upstream weather + air-quality data.",
      tone: "slate",
    };
  }
  const a = aqi ?? 0;
  const w = wind ?? 0;
  if (a >= 150 && w >= 20) {
    return {
      value: "Severe",
      detail: "Unhealthy AQI plus strong wind — plume reaches far downwind.",
      tone: "red",
    };
  }
  if (a >= 100 && w >= 12) {
    return {
      value: "High",
      detail: "Particulate concentration elevated and wind carries the plume.",
      tone: "orange",
    };
  }
  if (a >= 50 && w >= 6) {
    return {
      value: "Moderate",
      detail: "Mild plume movement; sensitive groups should limit exposure.",
      tone: "amber",
    };
  }
  return {
    value: "Low",
    detail: "Air is acceptable and wind is calm; plume contained.",
    tone: "emerald",
  };
}

export function EnvironmentStats({ hotspots = [] }: Props) {
  const centroid = useMemo(() => frpCentroid(hotspots), [hotspots]);
  const [env, setEnv] = useState<EnvironmentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (centroid) {
      params.set("lat", centroid.lat.toFixed(4));
      params.set("lon", centroid.lon.toFixed(4));
    }
    fetch(`/api/environment?${params.toString()}`, { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<EnvironmentResponse>) : null))
      .then((data) => {
        if (cancelled) return;
        setEnv(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [centroid]);

  const aqi = env?.aqi ?? null;
  const wind = env?.wind ?? null;
  const carbon = useMemo(() => carbonReleaseKt(hotspots), [hotspots]);
  const priority = useMemo(() => emergencyPriority(hotspots), [hotspots]);
  const smoke = useMemo(() => smokeSpreadRisk(env), [env]);

  const stats: Array<{
    icon: typeof Gauge;
    label: string;
    value: string;
    detail: string;
    tone: Tone;
  }> = [
    {
      icon: Gauge,
      label: "Live AQI",
      value: aqi ? `${aqi.value}` : loading ? "…" : "—",
      detail: aqi
        ? `${aqi.label} — Open-Meteo air-quality reading at the highest-FRP cluster.`
        : "Awaiting Open-Meteo air-quality response.",
      tone:
        aqi == null
          ? "slate"
          : aqi.value >= 150
            ? "red"
            : aqi.value >= 100
              ? "orange"
              : aqi.value >= 50
                ? "amber"
                : "emerald",
    },
    {
      icon: Wind,
      label: "Wind",
      value: wind
        ? `${wind.direction_compass} ${wind.speed_kmh} km/h`
        : loading
          ? "…"
          : "—",
      detail: wind
        ? `Surface wind from Open-Meteo (10 m). Plume direction follows the bearing.`
        : "Awaiting Open-Meteo weather response.",
      tone: "sky",
    },
    {
      icon: CloudFog,
      label: "Smoke Spread Risk",
      value: smoke.value,
      detail: smoke.detail,
      tone: smoke.tone,
    },
    {
      icon: Flame,
      label: "Carbon Release Estimate",
      value: hotspots.length === 0 ? "—" : `${carbon} kt`,
      detail:
        hotspots.length === 0
          ? "No active hotspots in the current FIRMS pass."
          : `Modelled CO₂-eq from total FRP across ${hotspots.length} active pixels (6-h persistence window, peatland-weighted).`,
      tone: "amber",
    },
    {
      icon: RadioTower,
      label: "Emergency Priority",
      value: priority.value,
      detail: priority.detail,
      tone: priority.tone,
    },
    {
      icon: Activity,
      label: "Active Hotspots",
      value: hotspots.length.toString(),
      detail:
        hotspots.length === 0
          ? "No detections in the most recent FIRMS pass."
          : `${hotspots.length} pixels in the current pass · max risk ${Math.max(
              0,
              ...hotspots.map((h) => h.risk_score),
            )}.`,
      tone: "emerald",
    },
  ];

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">
          Environmental Intelligence Stats
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Live air quality + wind from Open-Meteo, anchored at the highest-FRP
          fire cluster. Carbon and priority metrics computed from the current
          NASA FIRMS pass.
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
