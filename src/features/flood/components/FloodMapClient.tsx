"use client";

import { DivIcon, type LatLngExpression } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useFloodScenario } from "./FloodScenarioContext";
import { useLiveReports } from "@/lib/use-live-reports";

const severityColor: Record<number, string> = {
  5: "#7f1d1d",
  4: "#dc2626",
  3: "#ea580c",
  2: "#d97706",
  1: "#ca8a04",
};

/** Solid filled-circle marker for the synthesis-tier reports (pre-baked scenario). */
function createScenarioReportIcon(severity: number) {
  const color = severityColor[severity] ?? severityColor[3];
  const size = severity >= 4 ? 22 : 16;

  return new DivIcon({
    className: "",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 9999px;
        background: ${color};
        border: 2px solid rgba(255,255,255,0.92);
        box-shadow: 0 0 0 6px ${color}33, 0 0 24px ${color};
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

/**
 * Animated pulsing marker for live reports streaming in from the edge tier.
 * Visually distinct from the synthesis-tier markers: hollow ring + center
 * dot, with a CSS keyframe ping so the eye gets drawn to incoming activity.
 */
function createLiveReportIcon(severity: number) {
  const color = severityColor[severity] ?? severityColor[3];
  const size = 30;

  return new DivIcon({
    className: "",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <div style="
          position:absolute;inset:0;
          border-radius:9999px;
          border:3px solid ${color};
          background:${color}33;
          animation:grg-live-ping 1.8s ease-out infinite;
        "></div>
        <div style="
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:12px;height:12px;
          border-radius:9999px;
          background:${color};
          border:2px solid #fff;
          box-shadow:0 0 8px ${color};
        "></div>
      </div>
      <style>
        @keyframes grg-live-ping {
          0%   { transform: scale(0.85); opacity: 1; }
          80%  { transform: scale(1.45); opacity: 0; }
          100% { transform: scale(1.45); opacity: 0; }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

/**
 * react-leaflet child that fits the map's bounds to the union of scenario +
 * live points whenever `active` is true. Pulled out into its own component
 * because hooks like useMap() must be called inside a MapContainer.
 */
function FitBoundsController({
  active,
  points,
}: {
  active: boolean;
  points: [number, number][];
}) {
  // The @types/leaflet shipped with this app omits fitBounds from the Map
  // interface, but it exists at runtime (it's a core Leaflet method). Cast
  // to any to bypass the broken declaration.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useMap() as any;
  useEffect(() => {
    if (!active || points.length === 0) return;
    // SW/NE corners as a length-2 tuple satisfy LatLngBoundsLiteral.
    const lats = points.map((p) => p[0]);
    const lons = points.map((p) => p[1]);
    const sw: [number, number] = [Math.min(...lats), Math.min(...lons)];
    const ne: [number, number] = [Math.max(...lats), Math.max(...lons)];
    map.fitBounds([sw, ne], { padding: [48, 48], maxZoom: 12 });
  }, [active, points, map]);
  return null;
}

export function FloodMapClient() {
  const { scenario } = useFloodScenario();
  const { reports: liveReports } = useLiveReports();
  const [autoFit, setAutoFit] = useState(false);

  const liveWithLocation = useMemo(
    () =>
      liveReports.filter(
        (r) => r.location?.lat != null && r.location?.lon != null,
      ),
    [liveReports],
  );

  // Memoise the combined point list so FitBoundsController's effect only
  // fires when locations actually change.
  const combinedPoints = useMemo<[number, number][]>(() => {
    const scenarioPts: [number, number][] = scenario.reports
      .filter((r) => r.location.lat != null && r.location.lon != null)
      .map((r) => [r.location.lat as number, r.location.lon as number]);
    const livePts: [number, number][] = liveWithLocation.map((r) => [
      r.location.lat as number,
      r.location.lon as number,
    ]);
    return [...scenarioPts, ...livePts];
  }, [scenario.reports, liveWithLocation]);

  return (
    <div className="relative">
      <MapContainer
        key={scenario.id}
        center={scenario.mapCenter as LatLngExpression}
        zoom={scenario.mapZoom}
        scrollWheelZoom={false}
        className="h-[420px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {scenario.reports.map((report) => {
          if (report.location.lat == null || report.location.lon == null)
            return null;
          return (
            <Marker
              key={report.report_id}
              position={
                [report.location.lat, report.location.lon] as LatLngExpression
              }
              icon={createScenarioReportIcon(report.severity)}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <strong>{report.location.label ?? "Unknown location"}</strong>
                  <div>
                    <span className="font-semibold">
                      Severity {report.severity}
                    </span>{" "}
                    · {report.disaster_type}
                  </div>
                  <div className="text-slate-700">{report.severity_rationale}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    <em>Action:</em> {report.immediate_action}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {liveWithLocation.map((report) => (
          <Marker
            key={`live-${report.report_id}`}
            position={
              [
                report.location.lat as number,
                report.location.lon as number,
              ] as LatLngExpression
            }
            icon={createLiveReportIcon(report.severity)}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <strong>
                  <span style={{ color: "#059669" }}>● LIVE</span> ·{" "}
                  {report.location.label ?? "Unknown location"}
                </strong>
                <div>
                  <span className="font-semibold">
                    Severity {report.severity}
                  </span>{" "}
                  · {report.disaster_type} · {report.routing_recommendation === "deep_lane" ? "DEEP LANE" : "FAST LANE"}
                </div>
                <div className="text-slate-700">
                  {report.severity_rationale}
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  <em>Action:</em> {report.immediate_action}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <FitBoundsController active={autoFit} points={combinedPoints} />
      </MapContainer>

      {liveWithLocation.length > 0 && (
        <button
          onClick={() => setAutoFit((prev) => !prev)}
          className="absolute right-3 top-3 z-[1000] rounded-lg border border-emerald-500/40 bg-slate-950/85 px-3 py-1.5 text-xs font-medium text-emerald-100 shadow-lg backdrop-blur hover:bg-slate-900 transition"
          aria-pressed={autoFit}
        >
          {autoFit
            ? "Scenario zoom"
            : `Fit to all (${liveWithLocation.length} live)`}
        </button>
      )}
    </div>
  );
}
