"use client";

import type { DashboardHotspot } from "@/lib/dashboard-hotspots";
import { DivIcon, type LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type DisasterMapClientProps = {
  hotspots: DashboardHotspot[];
};

const riskColor: Record<DashboardHotspot["risk"], string> = {
  Critical: "#ef4444",
  High: "#fb923c",
  Medium: "#fbbf24",
  Low: "#6ee7b7",
};

function createHotspotIcon(risk: DashboardHotspot["risk"]) {
  const color = riskColor[risk];

  return new DivIcon({
    className: "",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 9999px;
        background: ${color};
        border: 2px solid rgba(255,255,255,0.92);
        box-shadow: 0 0 0 8px ${color}33, 0 0 28px ${color};
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}

export function DisasterMapClient({ hotspots }: DisasterMapClientProps) {
  return (
    <MapContainer
      center={[-1.9, 109.4]}
      zoom={5}
      scrollWheelZoom={false}
      className="h-[420px] w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {hotspots.map((hotspot) => (
        <Marker
          key={`${hotspot.area}-${hotspot.latitude}-${hotspot.longitude}`}
          position={[hotspot.latitude, hotspot.longitude] as LatLngExpression}
          icon={createHotspotIcon(hotspot.risk)}
        >
          <Popup>
            <div className="space-y-1">
              <strong>{hotspot.area}</strong>
              <div>Risk: {hotspot.risk}</div>
              <div>Score: {hotspot.riskScore}</div>
              {hotspot.brightness !== undefined && (
                <div>Brightness: {hotspot.brightness}</div>
              )}
              {hotspot.frp !== undefined && <div>FRP: {hotspot.frp}</div>}
              <div>{hotspot.status}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
