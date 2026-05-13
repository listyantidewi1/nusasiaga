# NusaSiaga

**Offline-first disaster response and environmental intelligence for resilient communities.**

NusaSiaga is a Global Resilience-focused MVP that helps communities, volunteers, and local responders understand environmental threats during low-connectivity disaster conditions. The project combines field reports, wildfire hotspot monitoring, environmental metrics, and local AI-assisted hazard analysis.

## Problem Statement

Disaster response teams often operate with fragmented information, limited connectivity, and delayed environmental intelligence. During wildfire, smoke, flood, or pollution events, communities need fast situational awareness that can still work when cloud connectivity is unreliable.

## Solution Overview

NusaSiaga provides a modern dashboard for disaster intelligence workflows. It visualizes hotspot regions in Indonesia, summarizes environmental risk metrics, and supports AI-assisted hazard analysis through a local Ollama/Gemma integration with safe fallback behavior.

The MVP is designed around offline-first disaster response: the frontend remains usable with mock operational data, while local AI can run on-device through Ollama when available.

## Key Features

- Interactive disaster dashboard with dark operational UI.
- Wildfire hotspot map for Riau, Kalimantan Barat, and Sumatera Selatan.
- Environmental intelligence stats for AQI, wind, smoke risk, carbon release, emergency priority, and readiness.
- AI Hazard Analyzer with local Gemma/Ollama API foundation.
- Safe mock fallback if local AI is unavailable.
- Feature-based Next.js App Router architecture.
- No backend database dependency in the current MVP.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- React Leaflet and Leaflet
- Lucide React
- Ollama local AI API
- Gemma model target: `gemma3n:e2b`

## Architecture Overview

```text
src/
  app/
    api/analyze/        Local AI route handler
    page.tsx            Server-rendered dashboard composition
  ai/
    gemma/              Prompt construction
    ollama/             Ollama API client
  components/shared/    Reusable shared UI
  features/
    dashboard/          Hero and dashboard summary UI
    environment/        Environmental intelligence stats
    hazard-analysis/    Interactive analyzer panel
    maps/               React Leaflet disaster map
    reports/            Report cards and mock report grid
  lib/                  Mock domain data
```

The homepage remains a Server Component and delegates browser-only behavior to focused Client Components, such as the map and analyzer panel.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

Run quality checks:

```bash
npm.cmd run lint
npm.cmd run build
```

## Local AI Setup

For Windows Ollama setup, Gemma model installation, API verification, and troubleshooting, see:

[docs/LOCAL_AI_SETUP.md](docs/LOCAL_AI_SETUP.md)

## Current MVP Status

NusaSiaga currently includes a polished dashboard prototype, static environmental intelligence data, an interactive map, a frontend analyzer panel, and a working local AI API route with mock fallback behavior.

Not included yet:

- Production backend
- Database persistence
- Real-time sensor feeds
- Authentication
- Deployment hardening

## Hackathon Positioning

NusaSiaga is positioned for Global Resilience challenges where fast, local-first decision support can improve emergency response. The product direction emphasizes:

- Offline-first disaster response
- Environmental intelligence
- Community and volunteer coordination
- Local AI safety guidance
- Low-connectivity field usability

## Founders

- Noesaa Decodes — noesaaerp@gmail.com
- Listyantidewi — listyantidewi@gmail.com
