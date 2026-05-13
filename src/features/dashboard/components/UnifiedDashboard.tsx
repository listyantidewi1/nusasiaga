"use client";

import { useState, type ReactNode } from "react";
import { DASHBOARD_VIEWS, type DashboardViewId } from "@/lib/dashboard-views";
import { DashboardViewPicker } from "./DashboardViewPicker";

type Props = {
  wildfire: ReactNode;          // pre-rendered WildfireView (with FIRMS data)
  scenarioA: ReactNode;         // FloodView with initial="A"
  scenarioB: ReactNode;         // FloodView with initial="B"
  scenarioC: ReactNode;         // FloodView with initial="C"
  initial?: DashboardViewId;
};

/**
 * Single top-level picker replacing the old Wildfire/Flood tab pair.
 * Hosts all four current views and exposes a dropdown that surfaces
 * future disaster types in a footer.
 *
 * Children are rendered as ReactNodes so server-side data fetching for
 * the wildfire view (NASA FIRMS) can stay in page.tsx.
 */
export function UnifiedDashboard({
  wildfire,
  scenarioA,
  scenarioB,
  scenarioC,
  initial = "scenario-a",
}: Props) {
  const [viewId, setViewId] = useState<DashboardViewId>(initial);

  // Map each view id to its content. We keep all views mounted (hidden
  // when not active) so transitions are instant. If perf becomes an issue
  // we can switch to conditional render with key=viewId.
  const views: Record<DashboardViewId, ReactNode> = {
    "wildfire-firms": wildfire,
    "scenario-a": scenarioA,
    "scenario-b": scenarioB,
    "scenario-c": scenarioC,
  };

  return (
    <>
      <DashboardViewPicker current={viewId} onSelect={setViewId} />
      {(Object.keys(views) as DashboardViewId[]).map((id) => (
        <div key={id} hidden={id !== viewId}>
          {views[id]}
        </div>
      ))}
    </>
  );
}

// Re-export the DashboardViewId type for callers that want to type
// initial / handler signatures.
export type { DashboardViewId };
