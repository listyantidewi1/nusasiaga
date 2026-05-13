"use client";

import { DivIcon, type LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type Hotspot = {
  area: string;
  position: LatLngExpression;
  risk: "Extreme" | "High" | "Medium";
  aqi: number;
  status: string;
};

const hotspots: Hotspot[] = [
  {
    area: "Riau",
    position: [0.2933, 101.7068],
    risk: "Extreme",
    aqi: 188,
    status: "Hotspot cluster detected",
  },
  {
    area: "Kalimantan Barat",
    position: [-0.1322, 111.0969],
    risk: "High",
    aqi: 142,
    status: "Smoke spread increasing",
  },
  {
    area: "Sumatera Selatan",
    position: [-3.3194, 103.9144],
    risk: "Medium",
    aqi: 96,
    status: "Watch area",
  },
];

const riskColor: Record<Hotspot["risk"], string> = {
  Extreme: "#ef4444",
  High: "#fb923c",
  Medium: "#fbbf24",
};

function createHotspotIcon(risk: Hotspot["risk"]) {
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

export function DisasterMapClient() {
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
          key={hotspot.area}
          position={hotspot.position}
          icon={createHotspotIcon(hotspot.risk)}
        >
          <Popup>
            <div className="space-y-1">
              <strong>{hotspot.area}</strong>
              <div>Risk: {hotspot.risk}</div>
              <div>AQI: {hotspot.aqi}</div>
              <div>{hotspot.status}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
