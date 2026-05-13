# NusaSiaga — Notebook Pipeline

## Overview

The `nusasiaga_gemma_pipeline.ipynb` notebook is the data processing backbone of NusaSiaga.

It transforms raw NASA FIRMS satellite fire detection data into structured JSON outputs that drive the Next.js disaster dashboard.

---

## Pipeline Version 2.0

### What's New in v2

- **Real NASA FIRMS CSV support** — load actual satellite data from `data/firms_hotspots.csv`
- **FRP-weighted scoring** — Fire Radiative Power now primary risk weight (40%)
- **VIIRS + MODIS confidence normalization** — handles both numeric and categorical confidence values
- **Province/regency classification** — deterministic bounding box lookup
- **Peatland zone detection** — identifies fires in high-carbon peatland zones
- **Environmental impact estimates** — CO₂ release, smoke plume radius, AQI risk level
- **Province summaries** — per-province aggregation for dashboard summary panel
- **Improved Gemma prompts** — structured environmental reasoning with cluster synthesis

---

## Quick Start

### Option A: Use Sample Data (no download required)

```bash
cd notebooks
jupyter notebook nusasiaga_gemma_pipeline.ipynb
# Run All Cells
```

The notebook uses inline sample data if `data/firms_hotspots.csv` is not present.

### Option B: Use Real NASA FIRMS Data

1. Go to: https://firms.modaps.eosdis.nasa.gov/download/
2. Select: Country → Indonesia
3. Select: Product → MODIS Collection 6.1 NRT or VIIRS 375m NRT
4. Select: Date range → last 7 days
5. Download as CSV
6. Save to: `data/firms_hotspots.csv`
7. Run the notebook → outputs are regenerated automatically

---

## Output Files

| File | Description |
|---|---|
| `outputs/dashboard_hotspots.json` | Primary dashboard data — consumed by Next.js frontend |
| `outputs/gemma_prompt_examples.json` | Gemma reasoning prompts for local AI inference |

### dashboard_hotspots.json Schema

```json
{
  "metadata": { ... },
  "summary": {
    "total": 26,
    "critical": 6,
    "high": 9,
    "provinces_affected": ["Kalimantan Barat", ...],
    "satellites_used": ["Terra", "Aqua", "SNPP"]
  },
  "environmental_impact": {
    "estimated_area_burned_ha": 4200,
    "estimated_co2_release_tons": 9800,
    "smoke_hazard_estimate": "...",
    "evacuation_recommendation": "..."
  },
  "province_summaries": [ ... ],
  "hotspots": [
    {
      "id": "HS-001",
      "lat": -1.5678,
      "lon": 110.7890,
      "severity": "CRITICAL",
      "risk_score": 92,
      "brightness": 378.2,
      "frp": 112.7,
      "confidence": 92,
      "satellite": "Terra",
      "province": "Kalimantan Tengah",
      "environmental_label": "Peatland fire — extreme carbon release risk",
      "smoke_impact": "severe"
    }
  ]
}
```

---

## Risk Scoring Model

### Formula

```
risk_score = (frp_score × 0.40) + (brightness_score × 0.25) + (confidence_score × 0.20) + (proximity_score × 0.15)
```

### Severity Classification

| Score | Severity | Response |
|---|---|---|
| 80–100 | CRITICAL | Immediate |
| 60–79 | HIGH | Priority |
| 40–59 | MEDIUM | Active monitoring |
| 0–39 | LOW | Watchlist |

### FRP Score (Fire Radiative Power)

FRP is the most physically meaningful measure of fire intensity from satellite data.
- Source: MODIS 1km and VIIRS 375m fire products
- Logarithmic scale: 10 MW → ~42 | 100 MW → ~80 | 200+ MW → 100
- Fires with FRP > 80 MW typically indicate large, intense burns

---

## Dashboard Integration

The frontend reads `outputs/dashboard_hotspots.json` via `src/lib/dashboard-hotspots.ts`:

```
Notebook → outputs/dashboard_hotspots.json → dashboard-hotspots.ts → Next.js map
```

The loader has fallback behavior: if the JSON is missing or malformed, the dashboard
automatically renders demo hotspot data with a "Demo fallback" badge.

---

## Future AQI Integration

The `aqi_placeholder_prompts` block in `gemma_prompt_examples.json` documents the planned OpenAQ integration:

```
OpenAQ v3 API → PM2.5 readings → inject into Gemma prompts → smoke health assessment
```

**Endpoint:** `https://api.openaq.org/v3/locations?country=ID&parameter=pm25`

No API key required for public data. Integration pending for next pipeline version.
