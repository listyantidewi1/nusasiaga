import { FloodHero } from "./FloodHero";
import { FloodMap } from "./FloodMap";
import { FloodReportFeed } from "./FloodReportFeed";
import { FloodSampleCard } from "./FloodSampleCard";
import { FloodScenarioProvider } from "./FloodScenarioContext";
import { FloodStats } from "./FloodStats";
import { FloodSynthesisPanel } from "./FloodSynthesisPanel";
import { ScenarioPicker } from "./ScenarioPicker";
import { OfflineResiliencePanel } from "@/features/offline/components/OfflineResiliencePanel";

/**
 * The Flood Response demo tab: scenario-aware operational view of
 * disaster reports flowing through the hybrid Gemma 4 architecture.
 *
 * Wraps every child in <FloodScenarioProvider> so the ScenarioPicker
 * + every flood-namespaced component share one piece of state: which
 * scenario (A/B/C) is currently active.
 */
export function FloodView() {
  return (
    <FloodScenarioProvider initial="A">
      <ScenarioPicker />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <FloodHero />
        <FloodSampleCard />
      </div>
      <FloodMap />
      <FloodSynthesisPanel />
      <FloodStats />
      <FloodReportFeed />
      <OfflineResiliencePanel />
    </FloodScenarioProvider>
  );
}
