# NusaSiaga · Gemma Rescue Grid

**Two-track disaster intelligence platform powered by Gemma 4. Live wildfire monitoring across Indonesia plus offline-edge flood response with on-device Gemma 4 triage.**

A submission to [The Gemma 4 Good Hackathon](https://www.kaggle.com/competitions/gemma-4-good-hackathon) targeting the Global Resilience track. NusaSiaga combines two complementary disaster-response capabilities in a single operational dashboard:

- **Wildfire Monitoring tab** — Real-time NASA FIRMS satellite hotspot data across Indonesia, with FRP-weighted risk scoring and provincial classification.
- **Flood Response Demo tab** — Pre-baked Scenario A synthesis from the hybrid Gemma 4 architecture: E2B on responder phones (offline) → 31B in command center (cloud) → this dashboard (ops UI).

---

## Why two tracks

Disasters in Indonesia are not one thing. Wildfires across Kalimantan and Sumatera need different intelligence than rapid-onset floods in central Jakarta. **The two tabs demonstrate that the same NusaSiaga dashboard can serve as the ops UI for fundamentally different disaster types** — wildfires with live satellite feeds, floods with synthesized field reports — without rewriting the platform.

Both tracks share the same operational aesthetic, the same Gemma 4 reasoning capability, and the same offline-first design philosophy.

---

## Track A — Wildfire Monitoring (live NASA FIRMS)

- **Live NASA FIRMS API** — VIIRS/SNPP satellite hotspot data, refreshed every 30 minutes
- **FRP-weighted risk scoring** — Fire Radiative Power as primary intensity metric
- **Peatland detection** — identifies high-carbon fire zones
- **Province/regency classification** — 60+ bounding boxes covering all Indonesian provinces
- **Environmental impact estimates** — CO₂ release, smoke plume radius, AQI risk level
- **3-tier fallback** — NASA FIRMS live → notebook JSON → demo data
- **AI Hazard Analyzer** — local Gemma/Ollama integration with safe fallback

NASA FIRMS work by [@NoesaaDecodes](https://github.com/NoesaaDecodes).

## Track B — Offline-Edge Flood Response (Gemma 4 hybrid)

- **Edge tier:** Gemma 4 E2B on Android via Google AI Edge LiteRT, fully offline. Photo + voice/text → structured `EdgeTriageReport` JSON in under 5 seconds on a mid-range phone.
- **Sync tier:** Gemma 4 31B (Unsloth 4-bit, 2× T4 on Kaggle) consolidates queued reports into a single `CommandCenterSynthesis` JSON with priority zones, recommended actions, and validity flags.
- **Intelligent routing (Cactus Prize hook):** every report carries the on-device model's own routing recommendation. The app layer combines this with cross-report context (recurring location, low confidence, trapped persons) to decide fast lane (local action) vs deep lane (queue for 31B synthesis).
- **One JSON contract** — same Gemma 4 family, same schema, top to bottom.

Pre-baked demo: 12 field reports from Scenario A (rapid-onset Jakarta flood, 90-minute window). The synthesis JSON shown was produced by Gemma 4 E4B on Colab; will be regenerated from 31B on Kaggle for the final submission.

Gemma Rescue Grid work in [listyantidewi1/gemma-disaster-grid](https://github.com/listyantidewi1/gemma-disaster-grid).

---

## Architecture

```
┌─────────────────────────────────┐    ┌─────────────────────────────────────────┐
│  NASA FIRMS API (satellite)     │    │  Field responder phone (offline)         │
│       │                         │    │       │                                  │
│       ▼                         │    │       ▼                                  │
│  /api/firms  ← 30min cache      │    │  Gemma 4 E2B (LiteRT)                    │
│       │                         │    │       │                                  │
│       │ fallback                │    │       │ sync when online                 │
│       ▼                         │    │       ▼                                  │
│  Notebook JSON → Demo data      │    │  Gemma 4 31B (Kaggle, Unsloth)           │
│       │                         │    │       │                                  │
│       ▼                         │    │       ▼                                  │
│  Wildfire Monitoring tab        │    │  Flood Response Demo tab                 │
└─────────────────────────────────┘    └─────────────────────────────────────────┘
              \                              /
               \                            /
                ▼                          ▼
        ┌─────────────────────────────────────┐
        │   NusaSiaga · Gemma Rescue Grid     │
        │   (Next.js, Tailwind, Vercel)       │
        └─────────────────────────────────────┘
```

### File structure

```
src/
  app/
    api/
      firms/        Live NASA FIRMS proxy
      analyze/      Ollama local-AI route
    page.tsx        Server-side data fetch + TabbedDashboard
    layout.tsx
  components/shared/  AppHeader, Metric
  features/
    dashboard/      Hero, Overview, HazardAnalyzer (wildfire), TabbedDashboard
    demo/           DemoReadinessPanel
    environment/    Wildfire env stats + cards
    hazard-analysis/  Wildfire analyzer panel
    incidents/      Wildfire incident feed
    maps/           Wildfire DisasterMap + Client + Legend
    offline/        Shared OfflineResiliencePanel
    reports/        Wildfire ReportGrid + Card
    wildfire/       Composition: WildfireView
    flood/          Gemma Rescue Grid track
      FloodHero, FloodMap, FloodMapClient, FloodMapLegend
      FloodSynthesisPanel, FloodReportFeed, FloodReportCard
      FloodStats, FloodSampleCard, FloodView
  lib/
    dashboard-hotspots.ts   NASA FIRMS data loader + fallback chain
    reports.ts              Original wildfire mock data
    flood-reports.ts        12 EdgeTriageReports from Scenario A
    synthesis-scenario-a.ts CommandCenterSynthesis output
    types.ts                Pydantic-mirrored schemas
  ai/
    gemma/, ollama/         Wildfire Ollama integration
notebooks/
  nusasiaga_gemma_pipeline.ipynb   Wildfire processing pipeline
```

---

## Tech Stack

- Next.js 16 App Router · React 19 · TypeScript
- Tailwind CSS 4 · Lucide-react · Framer Motion
- React Leaflet for both maps
- NASA FIRMS API (VIIRS/SNPP NRT) for live wildfires
- Gemma 4 E2B (LiteRT) for on-device edge inference
- Gemma 4 31B (Unsloth 4-bit) for cloud synthesis
- Ollama (gemma3n:e2b) for local AI hazard analysis

---

## Local Development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run lint
npm run build
```

The dashboard defaults to the **Flood Response Demo** tab. Click the tab pill at the top to switch to **Wildfire Monitoring**.

### NASA FIRMS API setup (Wildfire tab live data)

1. Get a free MAP KEY: <https://firms.modaps.eosdis.nasa.gov/api/area/>
2. `.env.local` in project root:
   ```
   NASA_FIRMS_MAP_KEY=your_key_here
   ```
3. Restart dev server.

Without a key, the wildfire tab falls back to notebook JSON or demo data.

---

## Hackathon Positioning — Gemma 4 Good

Track: **Global Resilience**.

Stackable Special Tech: **Cactus Prize** — best local-first mobile application that intelligently routes tasks between models. Our hybrid E2B-on-phone + 31B-in-cloud architecture with visible routing decisions is the canonical example.

Aspirational: **Main Track** — both prizes together if execution is top-tier.

---

## Founders

- Listyantidewi — <listyantidewi@gmail.com>
- Noesaa Decodes — <noesaaerp@gmail.com>

## License

Code: Apache 2.0. Winning Submission per Kaggle rules: CC-BY 4.0.
