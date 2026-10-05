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
| Schema drift: rename, drop, type change, add column | Run (round 1, see caveat below) |
| Schema drift: all changes combined | Not yet run |
| Semantic drift: dollars to cents, day/month swap | Not yet run (datasets ready) |
| Data validation script | Done and tested |
| API tests | In progress |
| UI tests | In progress |
| Demo video | Not yet recorded |

## Repository layout
```
datasets/          baseline, 7 drifted files, generator scripts, pipeline outputs
data-validation/   validate.py
api-tests/         pytest tests against the backend
ui-tests/          Playwright tests of the pipeline journey
observations/      one Markdown file per case, with evidence/ screenshots
```

## Setup
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # fill in values; never commit .env or key files
```

## Datasets
```bash
cd datasets
python make_baseline.py     # writes baseline.csv (1,050 rows, 8 columns, seeded)
python make_drifts.py       # writes the 7 drifted files next to it
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
| `semantic_date_swap.csv` | day and month swapped in 289 dates, all still valid |

Pipeline outputs downloaded from GCS are saved as `<case>_output.csv`.

## Data validation
```bash
python data-validation/validate.py --source datasets/baseline.csv --output datasets/baseline_output.csv
python data-validation/validate.py --source datasets/semantic_cents.csv \
       --output datasets/semantic_cents_output.csv --reference datasets/baseline_output.csv
python data-validation/validate.py --determinism run1.csv run2.csv run3.csv
```
Checks schema, row counts, cleaning rules, determinism, and semantic drift (median amount against the
baseline output for unit changes; date differences against the baseline output for day/month swaps).
It exits with code 1 if any check fails. I tested it against the baseline output and against simulated
cents and date-swap outputs, which it flagged (median ratio 100.00; 35.9% of dates changed).

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
  add-column case I accepted its proposed update and the same file then failed with a different error.
  Later round 1 results therefore ran on a changed pipeline and may be confounded. Each observation file
  states the pipeline state it ran on. I plan to rebuild the pipeline and re-run the cases as a clean round 2.

## Observations summary
| Case | Pipeline stopped? | Chatbot fix worked? | Severity | Details |
|---|---|---|---|---|
| Baseline cleaning quality | Ran, with defects | n/a | Medium-High | [baseline-cleaning-quality.md](observations/baseline-cleaning-quality.md) |
| Scheduled run | Schedule never triggered | n/a | High | [schedule-did-not-run.md](observations/schedule-did-not-run.md) |
| Rename column | Yes, at `invalid_rows_removed` | No | Medium | [schema-rename-column.md](observations/schema-rename-column.md) |
| Drop column | Yes, at `invalid_rows_removed` | Not recorded | Medium | [schema-drop-column.md](observations/schema-drop-column.md) |
| Change data type | Yes, at `deduped` | Not confirmed | Medium (confounded) | [schema-type-change.md](observations/schema-type-change.md) |
| Add column | Yes, at `email_imputed` | No | High | [schema-add-column.md](observations/schema-add-column.md) |
| All schema changes combined | Not yet run | Not yet run | Not yet run | n/a |
| Semantic: dollars to cents | Not yet run | Not yet run | Not yet run | n/a |
| Semantic: day/month swap | Not yet run | Not yet run | Not yet run | n/a |

## Top three findings
1. **Ambiguous dates were resolved silently.** The AI builder read DD/MM/YYYY slash dates as MM/DD, so
   79 of 949 output rows (8.3%) carry a wrong but valid-looking date. Unambiguous dates, and the dash
   and text formats, were all correct. I found no warning anywhere. It also left 4 duplicate pairs and
   12 invalid emails in the output, and filled every missing amount with the same value (253.81).
2. **The chatbot's fixes did not work, and one made things worse.** For the renamed column it blamed an
   unrelated node, and its prompt edits left the pipeline failing identically (same generated-code hash).
   For the added column, I accepted its proposed update and the same file then failed with a different
   error at the same node ("LLM transform requires a non-empty prompt when code is not provided"), a
   configuration problem that no longer depends on the data.
3. **Errors were raw and uninformative, and there is no up-front schema check.** Missing columns surfaced
   as bare Python messages (`'amount_usd'`, `'age'`), schema changes failed at three different steps
   (`invalid_rows_removed`, `deduped`, `email_imputed`) without naming the changed column, and every failure
   was followed by "Pipeline execution completed successfully" at the same timestamp. A node with no prompt
   and no code was accepted and only failed after the run started.

## Usability feedback
Connecting S3 was smooth once I understood the flow: Rhombus generates a scoped read-only policy, which is
safer than handing over keys, and its error when my policy was missing was specific about what to fix. The
AI builder's data profile was fast and accurate on duplicates, date formats and out-of-range ages, and the
pipeline canvas with per-node status made it easy to see where a run stopped.

The frustrating parts were the lack of safety around change. The first AI builder reply was a list of
recommendations, not a pipeline. Google Cloud Storage requires a long-lived service-account key, which my
organisation's policy blocks by default, and this differs from the S3 flow. My hourly schedule never ran
and nothing explained why. Errors were raw exceptions, the log accumulates across runs and shows
"completed successfully" beside failures, and the chatbot edits pipelines directly, with no preview, diff or
undo, so one accepted "fix" left a node without a prompt. Helpful additions would be an up-front schema
check that names the added, removed or renamed columns; a warning when a date column mixes ambiguous
formats; a preview and undo for chatbot edits; validation when a node is saved; a keyless option for GCS;
and a "next run at" indicator with a reason whenever a scheduled run is skipped.

## Demo video
Not yet recorded. It will walk through the UI tests, API tests and validation script.
