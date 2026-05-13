"use client";

import { floodReports } from "@/lib/flood-reports";
import { DivIcon, type LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const severityColor: Record<number, string> = {
  5: "#7f1d1d",
  4: "#dc2626",
  3: "#ea580c",
  2: "#d97706",
  1: "#ca8a04",
};

function createReportIcon(severity: number) {
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

export function FloodMapClient() {
  // Jakarta center, averaged across Scenario A reports.
  const center: LatLngExpression = [-6.243, 106.858];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      className="h-[420px] w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {floodReports.map((report) => {
        if (report.location.lat == null || report.location.lon == null) return null;
        return (
          <Marker
            key={report.report_id}
            position={
              [report.location.lat, report.location.lon] as LatLngExpression
            }
            icon={createReportIcon(report.severity)}
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
                <div className="text-slate-700">
                  {report.severity_rationale}
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  <em>Action:</em> {report.immediate_action}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
