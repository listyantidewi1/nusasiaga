# NusaSiaga

**Offline-first disaster response and environmental intelligence for resilient communities.**

NusaSiaga is a disaster intelligence platform that helps communities, volunteers, and local responders understand environmental threats — especially wildfires and smoke hazards — across Indonesia. The system combines real-time NASA satellite fire detection, reproducible data pipelines, and local AI-assisted hazard analysis.

---

## What's New — Pipeline v2

- **Live NASA FIRMS API** — real-time VIIRS/SNPP satellite hotspot data, auto-refreshed every 30 minutes
- **FRP-weighted risk scoring** — Fire Radiative Power as primary intensity metric
- **Peatland detection** — identifies high-carbon fire zones across Kalimantan and Sumatera
- **Province/regency classification** — 60+ bounding boxes covering all Indonesian provinces
- **Environmental impact estimates** — CO₂ release, smoke plume radius, AQI risk level
- **3-tier fallback** — NASA FIRMS live → notebook JSON → demo data

---

## Problem Statement

Disaster response teams often operate with fragmented information, limited connectivity, and delayed environmental intelligence. During wildfire, smoke, flood, or pollution events, communities need fast situational awareness that works even when cloud connectivity is unreliable.

---

## Solution Overview

NusaSiaga provides a modern dashboard for disaster intelligence workflows:

- Real-time wildfire hotspot map powered by NASA FIRMS satellite data
- Deterministic risk scoring: FRP (40%) + brightness (25%) + confidence (20%) + proximity (15%)
- Local Gemma/Ollama AI for offline hazard analysis
- Reproducible Jupyter notebook pipeline for data processing
- Offline-first design — full fallback chain if live data unavailable

---

## Key Features

- **Live NASA FIRMS map** — VIIRS/SNPP real-time hotspot detection across Indonesia
- **Badge system** — "● Live NASA FIRMS" / "Notebook output" / "Demo fallback"
- **↻ Refresh button** — manual live data refresh
- **Severity summary** — CRITICAL / HIGH / MEDIUM / LOW counts with FRP stats
- **AI Hazard Analyzer** — local Gemma/Ollama integration with safe fallback
- **Environmental impact** — smoke hazard, CO₂ estimate, evacuation recommendations
- **Province summaries** — per-province hotspot aggregation
- **Offline resilience** — full pipeline fallback, no single point of failure

---

## Tech Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS 4
- React Leaflet + Leaflet
- NASA FIRMS API (VIIRS/SNPP NRT)
- Ollama local AI API — Gemma `gemma3n:e2b`
- Jupyter notebook pipeline (Python, no ML dependencies)

---

## Architecture

```
NASA FIRMS API (live)
      ↓
/api/firms  ←── 30min cache
      ↓
page.tsx (server fetch)
      ↓ fallback
outputs/dashboard_hotspots.json  ←── notebook pipeline
      ↓ fallback
Demo hotspot data

src/
  app/
    api/
      analyze/      Local Gemma AI route
      firms/        NASA FIRMS live data route
    page.tsx        Server-rendered dashboard
  features/
    maps/           React Leaflet disaster map
    dashboard/      Hero and stats UI
    hazard-analysis/ AI analyzer panel
    environment/    Environmental intelligence
  lib/
    dashboard-hotspots.ts  Data loader with fallback chain
  ai/
    gemma/          Prompt construction
    ollama/         Ollama API client
notebooks/
  nusasiaga_gemma_pipeline.ipynb  Full processing pipeline
outputs/
  dashboard_hotspots.json         Notebook-generated hotspot data
  gemma_prompt_examples.json      Gemma reasoning prompts
data/
  firms_hotspots.csv              NASA FIRMS CSV (offline use)
```

---

## Local Development

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

Quality checks:
```bash
npm run lint
npm run build
```

---

## NASA FIRMS API Setup

1. Get a free MAP KEY at: https://firms.modaps.eosdis.nasa.gov/api/area/
2. Create `.env.local` in project root:
   ```
   NASA_FIRMS_MAP_KEY=your_key_here
   ```
3. Restart dev server — live data loads automatically

Without a MAP KEY, the dashboard falls back to notebook JSON output or demo data.

---

## Local AI Setup

For Ollama/Gemma setup on Windows, see: [docs/LOCAL_AI_SETUP.md](docs/LOCAL_AI_SETUP.md)

```bash
ollama pull gemma3n:e2b
ollama serve
```

---

## Notebook Pipeline

The notebook processes raw NASA FIRMS data into structured JSON for the dashboard:

```bash
cd notebooks
jupyter notebook nusasiaga_gemma_pipeline.ipynb
# Run All Cells
```

See [notebooks/README.md](notebooks/README.md) for full documentation.

---

## Hackathon Positioning — Gemma 4 Good

NusaSiaga is positioned for **Global Resilience** challenges:

- Offline-first disaster response for low-connectivity environments
- Environmental intelligence for wildfire and smoke hazard monitoring
- Local AI safety guidance via Gemma — no cloud dependency required
- Reproducible open-data pipeline using NASA FIRMS satellite data
- Community and volunteer coordination focus

---

## Founders

- Noesaa Decodes — noesaaerp@gmail.com
- Listyantidewi — listyantidewi@gmail.com
