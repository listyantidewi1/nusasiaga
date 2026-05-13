import { FloodHero } from "./FloodHero";
import { FloodMap } from "./FloodMap";
import { FloodReportFeed } from "./FloodReportFeed";
import { FloodSampleCard } from "./FloodSampleCard";
import { FloodStats } from "./FloodStats";
import { FloodSynthesisPanel } from "./FloodSynthesisPanel";
import { OfflineResiliencePanel } from "@/features/offline/components/OfflineResiliencePanel";

/**
 * The Flood Response demo tab: pre-baked Scenario A synthesis from
 * Gemma 4 31B, rendered as the operational picture the command center
 * would see while responders submit reports from their phones.
 */
export function FloodView() {
  return (
    <>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <FloodHero />
        <FloodSampleCard />
      </div>
      <FloodMap />
      <FloodSynthesisPanel />
      <FloodStats />
      <FloodReportFeed />
      <OfflineResiliencePanel />
    </>
  );
}
