import { IncidentFeedCard, type Incident } from "./IncidentFeedCard";

const incidents: Incident[] = [
  {
    title: "Dense smoke reported near peatland settlement",
    region: "Riau",
    severity: "CRITICAL",
    timestamp: "2 min ago",
    responseStatus: "Masks and evacuation route preparation requested.",
  },
  {
    title: "Hotspot cluster expanding toward plantation boundary",
    region: "Kalimantan Barat",
    severity: "HIGH",
    timestamp: "14 min ago",
    responseStatus: "Field volunteers assigned for perimeter monitoring.",
  },
  {
    title: "Air quality degradation detected near school zone",
    region: "Sumatera Selatan",
    severity: "HIGH",
    timestamp: "27 min ago",
    responseStatus: "Outdoor activity restriction advisory prepared.",
  },
  {
    title: "Wind shift may redirect smoke plume",
    region: "Riau",
    severity: "MEDIUM",
    timestamp: "43 min ago",
    responseStatus: "Monitoring wind corridor and community reports.",
  },
  {
    title: "Responder supply checkpoint updated",
    region: "Kalimantan Barat",
    severity: "LOW",
    timestamp: "58 min ago",
    responseStatus: "Water, masks, and radio batteries partially staged.",
  },
];

export function IncidentFeed() {
  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Real-time Incident Feed
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Operational updates for field response coordination.
          </p>
        </div>
        <div className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          5 active updates
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {incidents.map((incident) => (
          <IncidentFeedCard
            key={`${incident.region}-${incident.timestamp}`}
            incident={incident}
          />
        ))}
      </div>
    </section>
  );
}
