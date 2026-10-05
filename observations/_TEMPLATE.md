# <Drift case name>   (copy this file; name it e.g. schema-rename-column.md)

## What I changed
File uploaded over `baseline.csv` in S3: `datasets/<file>.csv`. Change: <one line>.

## What I expected
(Write this BEFORE the run.)

## What happened
- Pipeline: stopped / warned / carried on
- GCS output: no new file / file with N rows / column missing / column empty
- Delay between upload and the next scheduled run:

## Logs
Short excerpt, or "no error shown". Screenshot: `evidence/<name>-logs.png`

## Chatbot
- Error I gave it:
- Its diagnosis (correct / partly / wrong, and why):
- Its fix, and did it work?

## Schedule afterwards
Still running / paused / needed manual restart

## Validation script result
`python data-validation/validate.py ...` -> `evidence/validation-<name>.md`
Which checks failed? Did it catch what Rhombus missed?

## Severity
Low / Medium / High, and why.
