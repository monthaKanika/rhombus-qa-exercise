# Rhombus AI: pipeline QA exercise

Scheduled ETL test of Rhombus AI: S3 (messy CSV) -> AI-built cleaning pipeline -> Google Cloud Storage.
I built the baseline, then broke the input on purpose (schema and semantic drift) and recorded what happened.
All data is fake and seeded.

## Setup
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # fill in values; never commit .env or key files
```

## Datasets (`/datasets`)
```bash
cd datasets
python make_baseline.py     # writes baseline.csv (1,050 rows, seeded)
python make_drifts.py       # writes the 7 drifted files next to it
```
Files: `baseline.csv`, `schema_{drop_column,rename_column,type_change,add_column,combined}.csv`,
`semantic_{cents,date_swap}.csv`. Pipeline outputs downloaded from GCS are saved as `<case>_output.csv`.

## Data validation (`/data-validation`)
```bash
python data-validation/validate.py --source datasets/baseline.csv --output datasets/baseline_output.csv
python data-validation/validate.py --source datasets/semantic_cents.csv \
       --output datasets/semantic_cents_output.csv --reference datasets/baseline_output.csv
python data-validation/validate.py --determinism run1.csv run2.csv run3.csv
```
Checks schema, row counts, cleaning rules, determinism, and semantic drift (median amount vs baseline for
unit changes; date differences vs baseline for day/month swaps). Exits 1 if any check fails.

## API tests (`/api-tests`)
```bash
pytest api-tests -v
```

## UI tests (`/ui-tests`)
```bash
cd ui-tests && npm install && npx playwright install && npx playwright test
```

## Deviations from the brief
- **Scheduled runs were not possible.** My hourly schedule never triggered, even after following every point in the docs' troubleshooting checklist (see [schedule-did-not-run.md](observations/schedule-did-not-run.md)). The baseline and all drift runs were started manually.
- Consequence: schedule behaviour after a failed run is **not tested** for any drift case, and the column "Schedule afterwards" in the observation files is marked "not tested (manual run)".

## Observations summary
| Change | Pipeline stopped? | Chatbot fix worked? | Severity | Details |
|---|---|---|---|---|
| Baseline cleaning quality | n/a | n/a | Medium-High | [baseline-cleaning-quality.md](observations/baseline-cleaning-quality.md) |
| Drop column | TODO | TODO | TODO | `observations/schema-drop-column.md` |
| Rename column | Stopped | No | Medium-High | `observations/schema-rename-column.md` |
| Type change | TODO | TODO | TODO | `observations/schema-type-change.md` |
| Add column | TODO | TODO | TODO | `observations/schema-add-column.md` |
| Combined | TODO | TODO | TODO | `observations/schema-combined.md` |
| Semantic: cents | TODO | TODO | TODO | `observations/semantic-cents.md` |
| Semantic: day/month swap | TODO | TODO | TODO | `observations/semantic-date-swap.md` |

## Top three findings
1. **Ambiguous dates are resolved silently.** DD/MM/YYYY slash dates were read as MM/DD: 79 of 949 rows (8.3%) got a wrong but valid-looking date, and I found no warning.
2. TODO (after drift runs)
3. TODO (after drift runs)

## Usability feedback
TODO: one or two paragraphs. What helped, what frustrated, what would make the platform more efficient.
(Notes so far: S3 used a generated scoped policy while GCS required a long-lived JSON key that many
organisations block by default; the first AI builder reply was a report rather than a pipeline;
missing values were filled with identical placeholders without saying so.)

## Demo video
TODO: link (3-5 min: UI tests, API tests, validation script).
