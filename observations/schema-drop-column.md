# Schema drift: drop a column

Run type: manual (the scheduler never triggered, see [schedule-did-not-run.md](schedule-did-not-run.md))

## What I changed
Uploaded `datasets/schema_drop_column.csv` over `baseline.csv` in S3. The only change:
column `age` removed (7 columns instead of 8). Same 1,050 rows, same values elsewhere.

## What I expected
*(Written after the first run.)*

`age` is removed from the file. I expected the pipeline to stop (or warn) with a message saying
the `age` column is missing, and to write no output, because the age-range cleaning rule cannot
be applied without it.

## What happened
- **Pipeline stopped.** It failed at the step `invalid_rows_removed` with
  `LLM execution failed: 'age'` at 10:58:33 PM. This is the same step that failed for the
  renamed-column case.
- **GCS output:** [no new file / old output unchanged / partial file. Check the bucket
  timestamps and fill in.]
- **Pipeline status in the UI:** [shows as failed / still looks healthy]
- Pipeline state before this run: [original prompts restored and baseline re-run checked /
  chatbot-modified pipeline from the rename case. State which, because it affects comparability.]

## Logs
Same pattern as the rename case:
- The error text is only the raw missing-key message `'age'`. It does not say a column is
  missing, which columns the file has, or that `age` was not found.
- The `code_sha` is `ae2df7444000`, identical to the rename-column failures, so the same
  generated code ran each time. [Confirm against your screenshots.]
- A "Pipeline execution completed successfully" message appears at the same timestamp as the
  failure (10:58:33 PM), which is contradictory.
- The panel counts 3 errors in total (19 visible entries). It looks like the log accumulates
  across runs, since the earlier rename failures are included. This makes it harder to see
  which entries belong to the current run. [Confirm.]

Screenshot: `evidence/drop-col-log.png`

## Observation across drift cases
Both a renamed and a dropped column used by the pipeline end in the same way: a hard stop at
`invalid_rows_removed` with a bare Python key error. The pipeline does not check the incoming
schema before running, and the cleaning rules appear to live in one AI-generated block,
so any missing column halts all of them at once.

## Chatbot
- Error I gave it: `Pipeline failed at invalid_rows_removed ... 'age'`
- Its diagnosis: [correct / partly correct / wrong, and why. Did it say the source file no
  longer has an `age` column?]
- Its fix: [what it changed. Did it edit prompts or nodes?]
- Did the fix work? [Re-run on the same file and record: failed again / different error /
  succeeded. If it succeeded, check the GCS output: did it silently skip the age rules?]
- Side effect: [did it modify the pipeline? If so, how I restored it.]

## Schedule afterwards
Not tested: ran manually because the scheduler never triggered.

## Validation script result
[No output file was produced, so the validator was not run. If a file reached GCS, run it
and link `evidence/validation-schema-drop-column.md`.]

## Severity
Medium. The pipeline failed loudly and wrote no bad data, which is the safest outcome for
this kind of drift. The error message is unhelpful, because it names the missing column
but not why or what to do. [Adjust after the chatbot result.]
