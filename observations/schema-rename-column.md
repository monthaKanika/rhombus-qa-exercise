# Schema drift: rename a column

Run type: manual (the scheduler never triggered, see [schedule-did-not-run.md](schedule-did-not-run.md))

## What I changed
Uploaded `datasets/schema_rename_column.csv` over `baseline.csv` in S3. The only change:
column `amount_usd` renamed to `order_amount_usd`. Same 1,050 rows, same values, same
other 7 columns.

## What I expected
[Write what you predicted BEFORE the run, e.g. "The pipeline fails with a missing-column
error and writes nothing to GCS." If you did not write one, say so here rather than
inventing one.]

## What happened
- **Pipeline stopped.** It failed at the step `invalid_rows_removed` with
  `LLM execution failed: 'amount_usd'`. Earlier steps completed (8 successes, 1 error in the log).
- **GCS output:** [no new file / old output unchanged / partial file. Check the bucket
  timestamps and fill in.]
- **Pipeline status in the UI:** [shows as failed / still looks healthy]
- The failure is loud, which is the safest outcome for this kind of drift: nothing wrong was
  silently written. [Confirm against the GCS check above.]

## Logs
The error text is only the raw missing-key message `'amount_usd'`. It does not say that a
column is missing, which columns the file actually has, or that `order_amount_usd` looks like
the renamed version. Other problems with the log:
- A "Pipeline execution completed successfully" message appears at the same timestamp
  (10:03:56 PM) as the failure, which is contradictory.
- The error includes a long generated-code dump with a `code_sha`, cut off in the panel,
  which is noise for a customer and does not help locate the cause.

Screenshots: `evidence/rename-logs-run1.png`, `evidence/rename-logs-run2.png`

## Chatbot
- **Error I gave it:** `Pipeline failed at invalid_rows_removed ... 'amount_usd'`
- **Its diagnosis: incorrect.** It said the `dates_trimmed` node had most likely dropped
  columns when it regenerated its code. It never identified that the source column had been
  renamed to `order_amount_usd`, which was the actual cause.
- **Its fix:** edited the prompts of two nodes. `dates_trimmed` was told to preserve all
  original columns, and `invalid_rows_removed` was told to handle columns more explicitly and
  log column names at runtime. It then said the pipeline "should find `amount_usd` as expected"
  on re-run. Neither change addresses a renamed source column.
- **Did the fix work? No.** I re-ran the pipeline on the same file (10:17:36 PM) and it failed
  at the same step with the same error. The log shows the same `code_sha`
  (`ae2df7444000`) as the first failure, which suggests the generated code was not changed by
  the prompt edits. I could not see from the logs why. [Confirm the two hashes match in your screenshots.]
- **Side effect:** the chatbot modified two node prompts, so the pipeline no longer matches
  the baseline configuration. [How I handled it: restored the original prompts / re-ran the
  baseline / noted that later drift runs used the modified pipeline.]
- **With a hint (optional):** [If tried: after I told it the column was renamed to
  `order_amount_usd`, did it fix it correctly? Delete this line if not tried.]

## Schedule afterwards
Not tested: ran manually because the scheduler never triggered.

## Validation script result
No output file was produced, so the validator was not run on this case. [If a file did reach
GCS, run it and link `evidence/validation-schema-rename-column.md`.]

## Severity
Medium. The pipeline failed loudly and wrote no bad data, which is good. But the error does
not name the cause, and the chatbot's help was misleading: a wrong diagnosis, a fix that
changed the pipeline without solving anything, and a confident claim that it would work.
