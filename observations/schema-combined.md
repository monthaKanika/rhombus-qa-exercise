# Schema drift: all changes combined

Run type: manual (the scheduler never triggered, see [schedule-did-not-run.md](schedule-did-not-run.md))
Pipeline state: **Round 1, chatbot-modified.** This run used a pipeline that the chatbot had already
edited in earlier cases and then edited three more times for this one (see "Chatbot").
Source file: the first version of `schema_combined.csv`, in which `loyalty_tier` was assigned
randomly per row (see "Duplicates").

## What I changed
Uploaded `datasets/schema_combined.csv` over `baseline.csv` in S3, with four changes at once:
- `age` dropped
- `amount_usd` renamed to `order_amount_usd`
- new column `loyalty_tier` added
- `order_id` changed from a number to text (`ORD-10456`)

Same 1,050 rows, 8 columns in the file.

## What I expected
*(Written after the run, based on what a customer would reasonably expect.)*

Two columns the pipeline relies on had changed (`age` gone, `amount_usd` renamed), and in the
single-change cases the pipeline stopped. I expected it to stop again or at least warn, naming each
change. I did not expect any cleaning rule to be skipped without a message.

## What happened
After the chatbot's three edits, the run started at 12:45:51 AM and completed at 12:45:57 AM.
The log says "Pipeline completed successfully", and a line "Applied 7 transformations" shows the
Remove Duplicates step listing `order_amount_usd` among its columns. A new output file appeared in
the GCS bucket at 12:45:55 AM, 86.8 KB, compared with 74.6 KB for each earlier baseline output.
The error from this file's first run, before the edits, is not recorded here.

## What reached GCS
I downloaded the output (`datasets/schema_combined_output.csv`) and validated it against the
baseline output (`evidence/validation-schema-combined.md`). It has 1,001 rows, against 949 in the
baseline output.

| Area | Result |
|---|---|
| Schema | 8 columns. `age` absent, `amount_usd` now `order_amount_usd`, `loyalty_tier` passed through with only the four valid values. |
| `order_id` type change | Passed through unchanged: every ID still starts with `ORD-`. Nothing checked or reported the type change. |
| Age rule | Not applied (no age column), with no warning. 19 unique orders whose ages were invalid in the baseline file, and which the baseline run removed, reached GCS. |
| Amount rule | Still applied to the renamed column: no amounts outside 0 to 10,000. |
| Text and dates | Names and countries trimmed and Title Case. All 990 rows shared with the baseline output have identical dates, so the day/month misreading of slash dates from the baseline run is unchanged. |
| Missing values | Filled in as before: 57 placeholder emails and 61 rows with the same amount, 257.91 (253.81 in the baseline output, so the fill value depends on which rows are included). |
| Invalid emails | 13 rows remain, all `john@@example`, the same defect as in the baseline output. |
| Duplicates | 37 order IDs appear twice (74 rows). See below. |

### Duplicates
The duplicate pairs differ only in `loyalty_tier`. This is a flaw in my test data and not evidence
about the platform: the first version of the drift file gave each row a random tier, so the 50
planted duplicates were no longer identical and de-duplication across all columns could not remove
them. The generator now derives the tier from `order_id`. This should be re-tested in round 2.

## Logs
- The log never says that columns were dropped, renamed, added or retyped. The only trace of a
  schema change is the column list in the Remove Duplicates line.
- Because the run is reported as successful, nothing tells a customer that the age check no
  longer ran.
- The panel totals 58 entries (40 ok, 18 errors), and history accumulates across runs.

Screenshots: `evidence/combined-log.png`, `evidence/combined-gcs.png`

## Chatbot
- **Diagnosis:** partly right. It read the column list from a node's last run and noticed that
  the source had `order_amount_usd` and no `age`, but it hedged that the schema "may" have changed.
  It did not mention the `order_id` type change.
- **Its fix:** three edits. `dates_trimmed` was simplified to copy the input and keep all columns.
  `invalid_rows_removed` now checks each column with `df.get('col')`, so a missing or renamed
  column no longer raises a `KeyError`. `deduped` was re-confirmed with a column list that includes
  `loyalty_tier`. It also warned that `amount_imputed` and `email_imputed` might need column-name
  updates, which would mean further edits to match the drifted file.
- **Effect:** the chatbot said itself that the age check would simply be skipped. The validation
  confirms it: the pipeline now runs, and the age rule is silently dropped.
- **Did the fix work?** Partly. It made the pipeline run and the amount rule kept working on the
  renamed column, but only by adapting the pipeline to the drifted file and skipping the age rule
  without any warning.
- **Side effect:** three more pipeline edits, so the pipeline no longer matches the baseline
  configuration.

## Schedule afterwards
Not tested: ran manually because the scheduler never triggered.

## Validation script result
```
python data-validation/validate.py --source datasets/schema_combined_v1.csv \
  --output datasets/schema_combined_output.csv --reference datasets/baseline_output.csv \
  --amount-col order_amount_usd --report observations/evidence/validation-schema-combined.md
```
Four checks fail. Two are the expected schema changes (columns missing and unexpected). One is the
duplicate order IDs, caused by my test data. One is the invalid emails, the same as in the baseline output.

## Severity
High. The pipeline reported success while 19 orders that the cleaning rules should have removed
reached GCS, and the platform gave no sign that four schema changes had happened or that the age
check had stopped running.

