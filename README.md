# NusaSiaga · Gemma Rescue Grid

**Offline-first disaster intelligence platform for communities anywhere, powered by Gemma 4. Same architecture, every disaster type, from the responder's phone to the command center.**

A submission to [The Gemma 4 Good Hackathon](https://www.kaggle.com/competitions/gemma-4-good-hackathon) targeting the Global Resilience track. NusaSiaga is a single unified dashboard with a disaster-type picker — wildfire, flood, earthquake, industrial fire today; volcanic, tsunami, landslide, storm, building collapse next — all driven by one Gemma 4 architecture and one JSON contract.

The system has three tiers:

- **Edge tier** — Gemma 4 E2B on a responder's Android phone via Google AI Edge LiteRT, fully offline. Photo + voice/text → structured `EdgeTriageReport` JSON in under 5 seconds.
- **Sync tier** — Gemma 4 31B in a Kaggle notebook. When connectivity returns, queued reports flow here for cross-report synthesis: priority zones, ranked actions, validity flags.
- **Dashboard tier** — this Next.js app, deployed on Vercel. Renders the synthesis as an operational picture. Also hosts a passive-intelligence layer (live NASA FIRMS satellite wildfire data).

---

## Status — 2026-05-14

| Component | State |
|---|---|
| Unified disaster-type picker | ✅ shipped (Wildfire / Flood / Earthquake / Industrial Fire) |
| Scenario A — central Jakarta flood | ✅ full Gemma 4 synthesis rendered |
| Scenario B — Cianjur shallow earthquake | 🟡 reports rendered; synthesis pending Day 4 Kaggle 31B run |
| Scenario C — compound industrial flood + fire | 🟡 reports rendered; synthesis pending Day 4 Kaggle 31B run |
| Wildfire view — live NASA FIRMS satellite layer | ✅ working; fallback chain (live API → notebook JSON → demo) intact |
| Local production build (`npm run build`) | ✅ clean, 5 static pages generated |
| Vercel deployment | 🟡 pending — set `NASA_FIRMS_MAP_KEY` env var on first deploy |
| Live Demo URL for the Kaggle submission | 🟡 added here once Vercel deploys |
| Android edge app (Gemma 4 E2B via LiteRT) | ✅ Day 3 shipped one day ahead of plan, **tri-modal**. Custom "Disaster Triage" task in the gallery fork accepts a photo, a voice note, or both. Photo capture → Gemma 4 E2B inference (locked system prompt, image + audio backends both loaded) → parsed EdgeTriageReport rendered as a structured card with severity badge, hazard chips, immediate-action callout, and fast-or-deep-lane routing decision (the Cactus Prize hook). Voice path uses `AudioRecord` at 16 kHz mono PCM, wrapped in a RIFF/WAVE header for LiteRT-LM's miniaudio decoder. End-to-end verified on Galaxy A71 in all three modes, fully offline. Code mirrored to [`gemma-disaster-grid/android/app/src/main/kotlin/`](https://github.com/listyantidewi1/gemma-disaster-grid/tree/main/android/app/src/main/kotlin). |

Day-by-day plan and risk register: see [`TEAM_PLAN.en.md`](TEAM_PLAN.en.md) (English) / [`TEAM_PLAN.id.md`](TEAM_PLAN.id.md) (Bahasa Indonesia).

---

## Why one platform for every disaster type

A flood in Jakarta, an earthquake in Türkiye, a wildfire in California — the shape of the disaster differs, but the field-response problem is identical: chaotic input arriving over poor connectivity in the first minutes that matter most. **The same dashboard can serve as the ops UI for fundamentally different disaster types** because the underlying contract — a responder's photo turned into structured triage by an on-device model — does not care which disaster it is.

The current demonstration scenarios are Indonesian (central Jakarta flood, Cianjur earthquake simulation, an industrial flood-fire compound disaster) because that is the team's home context. The architecture is designed to deploy anywhere a phone and Gemma 4 can run.

---

## Wildfire layer — live NASA FIRMS satellite intelligence

- **Live NASA FIRMS API** — VIIRS/SNPP satellite hotspot data, refreshed every 30 minutes
- **FRP-weighted risk scoring** — Fire Radiative Power as primary intensity metric
- **Peatland detection** — identifies high-carbon fire zones
- **Province/regency classification** — 60+ bounding boxes covering all Indonesian provinces
- **Environmental impact estimates** — CO₂ release, smoke plume radius, AQI risk level
- **3-tier fallback** — NASA FIRMS live → notebook JSON → demo data
- **AI Hazard Analyzer** — local Gemma 4 via Ollama with safe fallback

NASA FIRMS work by [@NoesaaDecodes](https://github.com/NoesaaDecodes). The current implementation covers Indonesian wildfire-prone regions because that is the public data the API exposes by default; FIRMS itself is a global service and the same pipeline applies to wildfires anywhere.

## Offline-edge field response — Gemma 4 hybrid

- **Edge tier:** Gemma 4 E2B on Android via Google AI Edge LiteRT, fully offline. Photo + voice/text → structured `EdgeTriageReport` JSON in under 5 seconds on a mid-range phone. Works on any disaster type a responder can photograph.
- **Sync tier:** Gemma 4 31B (Unsloth 4-bit, 2× T4 on Kaggle) consolidates queued reports into a single `CommandCenterSynthesis` JSON with priority zones, recommended actions, and validity flags.
- **Intelligent routing (Cactus Prize hook):** every report carries the on-device model's own routing recommendation. The app layer combines this with cross-report context (recurring location, low confidence, trapped persons) to decide fast lane (local action) vs deep lane (queue for 31B synthesis).
- **One JSON contract** — same Gemma 4 family, same schema, top to bottom.

Pre-baked demo: 12 field reports from a simulated rapid-onset central Jakarta flood (90-minute window). The synthesis JSON shown was produced by Gemma 4 E4B on Colab; will be regenerated from 31B on Kaggle for the final submission. Two more scenarios — a Cianjur-style shallow earthquake and a compound industrial flood + fire event — render as full operational dashboards once their synthesis runs on Day 4.

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
│  Wildfire layer                 │    │  Flood / quake / industrial-fire layer  │
└─────────────────────────────────┘    └─────────────────────────────────────────┘
              \                              /
               \                            /
                ▼                          ▼
        ┌─────────────────────────────────────┐
        │   NusaSiaga · Gemma Rescue Grid     │
        │   Single unified disaster picker    │
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
- Ollama (gemma4:e2b) for local AI hazard analysis on the wildfire layer

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
