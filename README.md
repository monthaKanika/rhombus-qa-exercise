# Rhombus AI: pipeline QA exercise

A scheduled-ETL test of Rhombus AI: Amazon S3 (messy CSV) -> AI-built cleaning pipeline -> Google Cloud Storage.
I built the baseline, then changed the input on purpose (schema drift and semantic drift) and recorded how
the platform responded. All data is fake and generated from a fixed seed.

## Status
| Part | State |
|---|---|
| Baseline pipeline (S3 -> AI builder -> GCS) | Done |
| Baseline cleaning-quality analysis | Done |
| Scheduled run | Blocked: the schedule never triggered (see Deviations) |
| Schema drift: drop, rename, type change, add column, all combined | Run (round 1, see caveats) |
| Semantic drift: dollars to cents | Run (round 1, on a variant matched to the pipeline) |
| Semantic drift: day/month swap | Not yet run (dataset ready) |
| Determinism (same input, repeated runs) | Not yet measured |
| Round 2: rebuilt pipeline, corrected datasets | Planned |
| Data validation script | Done and tested |
| API tests | Completed |
| UI tests | Completed |
| Demo video | Recorded |

## Repository layout
```
datasets/          baseline, drifted files, generator scripts, pipeline outputs
data-validation/   validate.py
api-tests/         pytest tests against the backend
ui-tests/          Playwright tests of the pipeline journey
observations/      one Markdown file per case, with evidence/ screenshots and validator reports
```

## Setup
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # fill in values; never commit .env or key files
```
If `python` is not found in Git Bash, use the full path to your Python (for example an Anaconda install) or
run the commands from Anaconda Prompt.

## Datasets
```bash
cd datasets
python make_baseline.py                     # writes baseline.csv (1,050 rows, 8 columns, seeded)
python make_drifts.py                       # writes the 7 drifted files next to it
python make_semantic_on_combined_schema.py  # writes the cents variant that matches the pipeline's current schema
```
`baseline.csv` has planted defects: 50 exact duplicates, about 5% missing values in `email`,
`amount_usd` and `country`, four mixed date formats, inconsistent casing and whitespace, and invalid
emails, ages and amounts. Knowing the defects lets the validator check each one.

| File | Change |
|---|---|
| `schema_drop_column.csv` | `age` removed |
| `schema_rename_column.csv` | `amount_usd` renamed to `order_amount_usd` |
| `schema_type_change.csv` | `age` becomes text, e.g. `79 years` |
| `schema_add_column.csv` | new column `loyalty_tier` |
| `schema_combined.csv` | `age` dropped, `amount_usd` renamed, `loyalty_tier` added, `order_id` made text |
| `semantic_cents.csv` | `amount_usd` now in cents (x100), same name and type |
| `semantic_cents_combined_schema.csv` | the combined-schema file with `order_amount_usd` in cents |
| `semantic_date_swap.csv` | day and month swapped in 289 dates, all still valid |

Pipeline outputs downloaded from GCS are saved as `<case>_output.csv`.

Two notes on the data:
- `loyalty_tier` is now derived from `order_id`. The first version assigned a random tier per row, which made
  the 50 planted duplicates differ from each other. Round 1 of the add-column and combined cases used that
  first version, kept as `schema_add_column_v1.csv` and `schema_combined_v1.csv`.
- By the time of the semantic tests the pipeline had been adapted by the platform's chatbot to the combined
  schema (no `age`, amount column `order_amount_usd`). The original `semantic_cents.csv` would therefore also be a
  schema change, so the cents result comes from `semantic_cents_combined_schema.csv`.

## Data validation
```bash
python data-validation/validate.py --source datasets/baseline.csv --output datasets/baseline_output.csv
python data-validation/validate.py --source datasets/semantic_cents_combined_schema.csv --output datasets/semantic_cents_output.csv --reference datasets/schema_combined_output.csv --amount-col order_amount_usd
python data-validation/validate.py --determinism run1.csv run2.csv run3.csv
```
Checks schema, row counts, cleaning rules, determinism, and semantic drift: the median amount against a
reference output (unit changes), the date differences against the reference (day/month swaps), and the output
size against the reference (silent row loss). Use `--amount-col` when the amount column has been renamed and
`--report` to save a Markdown table. It exits with code 1 if any check fails. I tested it against the baseline
output and against simulated cents and date-swap outputs before using it on real runs.

## API tests
```bash
pytest api-tests -v
```

## UI tests
```bash
cd ui-tests && npm install && npx playwright install && npx playwright test
```

## Deviations from the brief
- **Scheduled runs were not possible.** My hourly schedule never triggered, even after I followed every
  point in the documentation's "Why didn't my schedule run?" checklist
  ([details](observations/schedule-did-not-run.md)). The baseline and all drift runs were started manually.
  As a result, what happens to the schedule after a failed run is **not tested** for any case.
- **The pipeline was modified by the platform's chatbot during testing.** In the rename-column case the
  chatbot edited two node prompts; in the type-change case it set the `deduped` node's column list; in the
  add-column case I accepted its proposed update and the same file then failed with a different error; in
  the combined case it made three more edits before the run passed. Later round 1 results therefore ran on
  a changed pipeline and may be confounded. Each observation file states the pipeline state it ran on. I
  plan to rebuild the pipeline and re-run the cases as a clean round 2.
- **A flaw in my test data affected two cases.** The first versions of `schema_add_column.csv` and
  `schema_combined.csv` gave duplicate rows different `loyalty_tier` values, so duplicates survived
  de-duplication. This is my data's fault, not a platform result. It is fixed and will be re-tested in round 2.
- **Each case was run once on one pipeline.** The results describe what happened in those runs and are not a
  statistical measure of the platform.

## Observations summary
| Case | Pipeline stopped? | Chatbot fix worked? | Severity | Details |
|---|---|---|---|---|
| Baseline cleaning quality | Ran, with defects | n/a | Medium-High | [baseline-cleaning-quality.md](observations/baseline-cleaning-quality.md) |
| Scheduled run | Schedule never triggered | n/a | High | [schedule-did-not-run.md](observations/schedule-did-not-run.md) |
| Rename column | Yes, at `invalid_rows_removed` | No | Medium | [schema-rename-column.md](observations/schema-rename-column.md) |
| Drop column | Yes, at `invalid_rows_removed` | Not recorded | Medium | [schema-drop-column.md](observations/schema-drop-column.md) |
| Change data type | Yes, at `deduped` | Not confirmed | Medium (confounded) | [schema-type-change.md](observations/schema-type-change.md) |
| Add column | Yes, at `email_imputed` | No | High | [schema-add-column.md](observations/schema-add-column.md) |
| All schema changes combined | No: completed after three chatbot edits | Partly | High | [schema-combined.md](observations/schema-combined.md) |
| Semantic: dollars to cents | No: completed, 75% of rows removed silently | n/a (no error) | High | [semantic-cents.md](observations/semantic-cents.md) |
| Semantic: day/month swap | Not yet run | Not yet run | Not yet run | n/a |

## Top three findings
1. **Data changes passed silently.** Dollars-to-cents ran with no warning, and the pipeline's own "amount above
   10,000" rule then deleted 75% of the rows (247 of 1,001). The combined-schema run was logged as successful
   although the age rule had stopped running, so 19 orders the baseline run removed reached GCS. My validator
   caught the unit change through the median amount (20.6x) and the row count.
2. **Chatbot fixes failed or made things worse.** For the renamed column it blamed an unrelated node, and the
   pipeline failed identically on re-run. After I accepted its update in the add-column case, the same file
   failed with a new error ("LLM transform requires a non-empty prompt when code is not provided"). In the
   combined case its fix worked only by making the pipeline tolerate missing columns.
3. **Failures were opaque, and the scheduler failed silently.** Missing columns surfaced as bare errors
   (`'age'`, `'amount_usd'`) at three different steps, each followed by "completed successfully". My hourly
   schedule never ran, and nothing said why.

## Usability feedback
**Helpful:** connecting S3 through a generated, scoped read-only policy was safer than sharing keys, and its
error message told me exactly what was missing. The AI builder's data profile accurately found duplicates, mixed
date formats and out-of-range ages, and the canvas's per-node status showed where each run stopped.

**Frustrating:** the schedule never ran even after the documentation's checklist; errors were raw exceptions
shown beside "completed successfully"; the chatbot edits pipelines with no preview or undo; GCS needs a
long-lived service-account key that my organisation's policy blocks; and runs on changed data completed with no
warning. **Suggestions:** name added, removed, renamed or retyped columns in the run log; say when a rule is
skipped because its column is missing; warn when the median or row count shifts sharply between runs; add
preview and undo for chatbot edits; validate nodes on save; offer keyless GCS access; and show the next run
time with a reason whenever a scheduled run is skipped.

## Demo video
[Please find recorded video here.](https://drive.google.com/drive/folders/1DDhWNLwP7--p6cjYV5_fsCBDNMYNxlYr?usp=sharing) It will walk through the UI tests, API tests and validation script.
