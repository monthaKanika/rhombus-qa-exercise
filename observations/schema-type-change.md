# Schema drift: change a data type

Run type: manual (the scheduler never triggered, see [schedule-did-not-run.md](schedule-did-not-run.md))

## What I changed
Uploaded `datasets/schema_type_change.csv` over `baseline.csv` in S3. The only change:
`age` values became text with a unit, e.g. `79` -> `79 years`. Same 8 columns, same names,
same 1,050 rows.

## What I expected
*(Written after the first run, based on what a customer would reasonably expect.)*

`age` changes from a number (`79`) to text (`79 years`). I expected the platform to either:
- **stop with a clear error** naming the `age` column and saying it is no longer numeric, or
- **warn and handle it** (for example by reading the number out of the text) and tell me it did.

I did not expect it to silently drop rows or blank out ages. I also expected the log to say which
column changed, and the chatbot to point at the type change when given the error.

## What happened
- **Pipeline stopped** at 11:13:27 PM with
  `Pipeline failed at deduped: 'NoneType' object is not iterable` (node id
  `remove_duplicate_node_1`). On the canvas the red node is Remove Duplicates, directly after
  Data Input.
- This is a **different step** from the rename and drop cases, which both got past this node
  and failed later at `invalid_rows_removed`.
- **GCS output:** [no new file / old output unchanged. Check the bucket and fill in.]
- **Pipeline status in the UI:** [shows as failed / still looks healthy]

## Is this failure caused by the drift? (not established)
Nothing in the error mentions `age` or a data type. The chatbot blamed the `columns`
parameter of the `deduped` node being `null`. If that were always true, this node would have
failed in the earlier runs too, but it passed in them. Possible explanations:
1. The pipeline configuration changed since those runs (the chatbot edited node prompts in the
   rename case, and I restored / re-ran afterwards: [describe what you did]).
2. The text-valued `age` column triggers a different code path in the deduplication step.

**Control run:** I re-ran the unchanged `baseline.csv` on the current pipeline to check.
[Result: baseline passes -> the type change is the trigger / baseline also fails at `deduped`
-> the pipeline was already broken and this result does not show drift behaviour.]

## Logs
- The error says nothing about the age column or its new type, so it gives no hint that the
  data changed.
- "Pipeline execution completed successfully" again appears at the same timestamp
  (11:13:27 PM) as the failure.
- The log panel shows 10 errors and 22 successes in total, so history accumulates across
  runs and several failed runs happened since the drop-column case. [List which runs these were.]

Screenshot: `evidence/type-change-log.png`

## Chatbot
- Error I gave it: `what is the error? Pipeline failed at deduped: 'NoneType' object is not iterable`
- Its diagnosis: the `deduped` node's `columns` parameter was `null`, so the transformer
  crashed when it tried to iterate over it. It did not mention the `age` column or the type change.
- Its fix: set `columns` on `deduped` to all 8 column names and said the pipeline "should now
  pass this step cleanly".
- **Did the fix work?** [Re-run on the same file and record: passed `deduped` / failed again /
  failed at a later step. If it now reaches `invalid_rows_removed`, record what happens to
  the `age` values.]
- Side effect: the chatbot changed the pipeline again, so the pipeline no longer matches the
  baseline configuration. [How I handled it.]

## If the re-run produces an output file
Run the validator and link the report. Pay attention to:
- **Row count.** If rows with `79 years`-style ages are removed by the age-range rule, the
  output could be empty or far smaller than the baseline output, with no warning.
- **The age column.** Is it numeric, still text, or empty?
```
python data-validation/validate.py --source datasets/schema_type_change.csv \
  --output datasets/schema_type_change_output.csv --reference datasets/baseline_output.csv \
  --report observations/evidence/validation-schema-type-change.md
```

## Schedule afterwards
Not tested: ran manually because the scheduler never triggered.

## Severity
[Medium, adjust after the control run.] The pipeline failed loudly, which is safe, but the
error and the chatbot's diagnosis point at an unrelated node setting instead of the changed data.
