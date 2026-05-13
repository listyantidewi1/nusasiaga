import { BrainCircuit, ClipboardList, DatabaseZap, Radio } from "lucide-react";
import { OfflineCapabilityCard } from "./OfflineCapabilityCard";

const capabilities = [
  {
    icon: BrainCircuit,
    title: "Local AI Analysis",
    description:
      "Gemma via Ollama can analyze field reports locally when the responder device has the model installed.",
    status: "Ready",
  },
  {
    icon: Radio,
    title: "Low-Bandwidth Report Mode",
    description:
      "The command center is structured around compact text reports that can move through unreliable connections.",
    status: "Designed",
  },
  {
    icon: DatabaseZap,
    title: "Cached Safety Guidance",
    description:
      "Core safety recommendations remain available through the local fallback path when AI services are unreachable.",
    status: "Fallback",
  },
  {
    icon: ClipboardList,
    title: "Field Responder Workflow",
    description:
      "Incident updates, map context, analyzer output, and readiness checks support repeated response operations.",
    status: "MVP",
  },
];

export function OfflineResiliencePanel() {
  return (
    <section className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-2xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Offline Resilience
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Built for disaster response workflows where connectivity can fail.
          </p>
        </div>
        <div className="rounded-full border border-emerald-400/30 bg-slate-950/50 px-4 py-2 text-sm text-emerald-200">
          Offline-first MVP
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((capability) => (
          <OfflineCapabilityCard key={capability.title} {...capability} />
        ))}
      </div>
    </section>
  );
}
