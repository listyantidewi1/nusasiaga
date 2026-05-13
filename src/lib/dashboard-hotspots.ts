import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type DashboardHotspotRisk = "Critical" | "High" | "Medium" | "Low";

export type DashboardHotspot = {
  area: string;
  latitude: number;
  longitude: number;
  risk: DashboardHotspotRisk;
  riskScore: number;
  brightness?: number;
  confidence?: number;
  frp?: number;
  status: string;
};

export type DashboardHotspotData = {
  hotspots: DashboardHotspot[];
  sourceLabel: "Notebook output" | "Demo fallback";
};

type NotebookHotspotPayload = {
  markers?: unknown;
};

type NotebookMarker = {
  area?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  risk?: unknown;
  riskScore?: unknown;
  brightness?: unknown;
  confidence?: unknown;
  frp?: unknown;
};

const fallbackHotspots: DashboardHotspot[] = [
  {
    area: "Riau",
    latitude: 0.2933,
    longitude: 101.7068,
    risk: "Critical",
    riskScore: 10,
    brightness: 372.4,
    confidence: 92,
    frp: 58.2,
    status: "Hotspot cluster detected",
  },
  {
    area: "Kalimantan Barat",
    latitude: -0.1322,
    longitude: 111.0969,
    risk: "High",
    riskScore: 8,
    brightness: 348.1,
    confidence: 84,
    frp: 39.5,
    status: "Smoke spread increasing",
  },
  {
    area: "Sumatera Selatan",
    latitude: -3.3194,
    longitude: 103.9144,
    risk: "Medium",
    riskScore: 4,
    brightness: 326.7,
    confidence: 68,
    frp: 18.9,
    status: "Watch area",
  },
];

export async function getDashboardHotspotData(): Promise<DashboardHotspotData> {
  try {
    const outputPath = join(process.cwd(), "outputs", "dashboard_hotspots.json");
    const rawJson = await readFile(outputPath, "utf-8");
    const payload = JSON.parse(rawJson) as NotebookHotspotPayload;
    const hotspots = normalizeNotebookMarkers(payload);

    if (hotspots.length === 0) {
      return getFallbackHotspotData();
    }

    return {
      hotspots,
      sourceLabel: "Notebook output",
    };
  } catch {
    return getFallbackHotspotData();
  }
}

function getFallbackHotspotData(): DashboardHotspotData {
  return {
    hotspots: fallbackHotspots,
    sourceLabel: "Demo fallback",
  };
}

function normalizeNotebookMarkers(
  payload: NotebookHotspotPayload,
): DashboardHotspot[] {
  if (!Array.isArray(payload.markers)) {
    return [];
  }

  return payload.markers
    .map((marker) => normalizeNotebookMarker(marker as NotebookMarker))
    .filter((marker): marker is DashboardHotspot => marker !== null);
}

function normalizeNotebookMarker(
  marker: NotebookMarker,
): DashboardHotspot | null {
  const latitude = toNumber(marker.latitude);
  const longitude = toNumber(marker.longitude);

  if (
    typeof marker.area !== "string" ||
    latitude === null ||
    longitude === null
  ) {
    return null;
  }

  const risk = normalizeRisk(marker.risk);
  const riskScore = toNumber(marker.riskScore) ?? 0;

  return {
    area: marker.area,
    latitude,
    longitude,
    risk,
    riskScore,
    brightness: toNumber(marker.brightness) ?? undefined,
    confidence: toNumber(marker.confidence) ?? undefined,
    frp: toNumber(marker.frp) ?? undefined,
    status: `${risk} wildfire hotspot detected`,
  };
}

function normalizeRisk(value: unknown): DashboardHotspotRisk {
  if (typeof value !== "string") {
    return "Low";
  }

  switch (value.toUpperCase()) {
    case "CRITICAL":
    case "EXTREME":
      return "Critical";
    case "HIGH":
      return "High";
    case "MEDIUM":
      return "Medium";
    default:
      return "Low";
  }
}

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}
