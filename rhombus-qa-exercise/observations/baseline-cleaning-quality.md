# Baseline cleaning quality

## What I did
Uploaded `baseline.csv` (1,050 rows, 8 columns, seeded fake data with planted
defects) to S3 and built the cleaning pipeline with the AI builder only.
Compared the output against the known defects using `data-validation/validate.py`
and ground truth from `datasets/make_baseline.py`.

## What I expected
Duplicates removed; names and countries trimmed and Title Case; dates YYYY-MM-DD;
invalid emails, ages and amounts removed; missing values handled.

## What happened
Output had 949 rows. Whitespace, casing, ISO dates, age range and amount range
were correct. Problems found:

| Issue | Detail |
|---|---|
| Wrong dates | 79 of 949 rows (8.3%). All were slash dates I wrote as DD/MM/YYYY, read as MM/DD. No errors among unambiguous slash dates, dash (MM-DD-YYYY) or text dates. |
| Surviving duplicates | 4 pairs (order IDs 10102, 10234, 10338, 10548), each with an imputed value |
| Invalid emails kept | 12 rows with `john@@example` |
| Crude imputation | Every missing amount became 253.81; missing emails became `unknown@unknown.com`; missing countries became `Unknown` |
| False positive | The AI report called the refund rate "atypical", but my generator picks statuses uniformly at random |

## Logs / chatbot
TODO: did the run log or report mention the ambiguous date format?

## Severity
Medium to high. The wrong dates look valid, so nothing flags them.

## Evidence
TODO: `evidence/baseline-output-check.png`, `evidence/validation-baseline.md`
