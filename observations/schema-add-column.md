# Schema drift: add a column

Run type: manual (the scheduler never triggered, see [schedule-did-not-run.md](schedule-did-not-run.md))
Pipeline state: **Round 1, chatbot-modified.** Earlier chatbot edits (rename case: prompts of
`dates_trimmed` and `invalid_rows_removed`; type-change case: `deduped` columns set to the 8
original names) were still in place, so results below may be confounded. See "Round 2".

## What I changed
Uploaded `datasets/schema_add_column.csv` over `baseline.csv` in S3. The only change: a new
column `loyalty_tier` (bronze / silver / gold / platinum) added at the end, giving 9 columns
instead of 8. Same 1,050 rows, nothing else touched.

## What I expected
*(Written after the first run, based on what a customer would reasonably expect.)*

Adding a column is the least disruptive kind of schema change, because nothing the pipeline
relies on is removed or renamed. I expected the pipeline to succeed and either pass the new
column through to the output or ignore it, ideally with a note that the schema changed. I did
not expect a failure.

## What happened
**Run 1 (11:36:20 PM): pipeline stopped** at `email_imputed` with
`No numeric columns available for imputation after removing non-numeric columns.` Earlier steps
(Text Case, Trim) show green on the canvas. This is a third different failing step: the rename
and drop cases failed at `invalid_rows_removed`, the type-change case at `deduped`.

**Chatbot, then re-run (11:44:15 PM, failed 11:44:19 PM): pipeline stopped again** at the same
node, with a different error: `LLM transform requires a non-empty prompt when code is not provided.`

## Logs
- Run 1's error says there are no numeric columns, although the data has numeric columns
  (`order_id`, `age`, `amount_usd`) and the only change is an extra text column. It never
  mentions `loyalty_tier`, so nothing tells me a schema change happened.
- Run 2's error is a configuration problem (a node with no prompt and no code), not a data problem.
  It would fail on any file.
- "Pipeline execution completed successfully" appears at the same timestamp as each failure
  (11:36:20 PM and 11:44:19 PM).
- Log totals went from 41 entries (26 ok, 15 errors) to 44 entries (28 ok, 16 errors): history
  accumulates across runs, which makes it hard to tell which entries belong to the current run.

Screenshots: `evidence/add-column-log-run1.png`, `evidence/add-column-log-run2.png`

## Chatbot
- **What it said (visible part):** `loyalty_tier` is a new column and should be added to the
  pipeline's cleaning scope, specifically the `deduped` node's column list and downstream schema
  references. It asked whether I wanted it to update the pipeline.
- **Diagnosis:** partly right. It noticed the schema change (a new column). But the failure was at
  `email_imputed`, not `deduped`, and it did not explain how the new column produces a
  "no numeric columns" error. The `deduped` column list it wanted to update is the one it
  hard-coded to 8 names in the type-change case, so its earlier fix had made the pipeline depend
  on a fixed schema.
- **Its fix:** I told it to update the pipeline, as it offered.
- **Did the fix work? No.** Re-running the same file failed at the same node with a different
  error (above). The data was identical, so the pipeline itself had changed: the node now has no
  prompt and no code. I could not see the node's edit history, so I cannot prove the update caused
  this, but the change appeared between the two runs, right after I accepted the update.
  Screenshots: `evidence/add-column-email-imputed-node.png`, `evidence/add-column-chatbot.pdf`
- **Side effect:** the chatbot changed the pipeline again, and the pipeline now fails whatever the input.

## Is the first failure caused by the drift? (not established)
Run 1's error does not look like a response to a column being added. Either the new column
changes how the imputation step picks its columns, or the earlier chatbot edits had already made
the pipeline fragile. This case therefore cannot show how the platform handles an added column on
a healthy pipeline.

## Round 2 (second attempt)
- **Result with `schema_add_column.csv`: still fails** at `email_imputed` with
  `LLM transform requires a non-empty prompt when code is not provided.`
  Screenshot: `evidence/add-column-round2-log.png`
- **Note on the evidence:** the screenshot is timestamped 11:44:19 PM, the same as the Round 1
  re-run, so it may show the same run and not a new one.
- **What the result means:**
  - If the pipeline was rebuilt and this is a new run, then a fresh AI-built pipeline contains an
    `email_imputed` node with no prompt and no code. That is independent of the added column and
    is a separate, serious finding about the AI builder.
  - If the same canvas was re-run, this is the same broken node from Round 1 and adds no new
    information about add-column behaviour.
- **Validator:** no output file was produced, so it was not run on this case.

## Schedule afterwards
Not tested: ran manually because the scheduler never triggered.

## Severity
- **Platform behaviour on the drift:** not established (confounded, see above).
- **Chatbot and error handling: High.** An additive change stopped the pipeline with an error
  that does not mention the new column. The chatbot's update then left a node without a prompt
  or code, and the platform accepted that configuration and only failed after the run had started.
