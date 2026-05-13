# NusaSiaga Notebooks

This folder contains reproducible Kaggle-style notebooks for verified data integration experiments.

## Notebook

- `nusasiaga_gemma_pipeline.ipynb` converts NASA FIRMS-style wildfire hotspot data into deterministic dashboard-ready JSON and Gemma prompt examples.

## How to Run

1. Open the notebook in Jupyter, VS Code, or Kaggle.
2. Use a Python 3 kernel.
3. Run all cells from top to bottom.

The notebook does not require external API calls. If `data/firms_hotspots.csv` does not exist, it uses inline sample wildfire hotspot data for Riau, Kalimantan Barat, and Sumatera Selatan.

## Optional CSV Input

Place a NASA FIRMS-style CSV at:

```text
data/firms_hotspots.csv
```

Expected columns:

- `latitude`
- `longitude`
- `brightness`
- `confidence`
- `frp`
- `acq_date`
- `acq_time`
- `region`

Optional columns:

- `satellite`
- `instrument`
- `distance_to_settlement_km`

## Outputs

When run, the notebook writes reproducible artifacts to:

```text
outputs/dashboard_hotspots.json
outputs/gemma_prompt_examples.json
```

These files are intended for future dashboard and local Gemma/Ollama integration work.
