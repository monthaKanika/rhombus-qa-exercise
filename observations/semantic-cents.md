# Semantic drift: dollars to cents

Run type: manual (the scheduler never triggered, see [schedule-did-not-run.md](schedule-did-not-run.md))
Pipeline state: **Round 1, chatbot-modified.** The pipeline as left after the combined case: no age rule,
and the amount steps target `order_amount_usd`.

## What I changed
The original `semantic_cents.csv` (columns `amount_usd` and `age`) no longer matches this pipeline, so a
run on it would also be a schema change. I used a variant, `semantic_cents_combined_schema.csv`: the
combined-schema file already run through this pipeline, with `order_amount_usd` multiplied by 100 and
nothing else changed (25.68 becomes 2568, 9,999,999 becomes 999,999,900, missing values stay missing).
The reference output is `schema_combined_output.csv`, which this pipeline produced from the same file
with amounts in dollars.

## What I expected
*(Prediction made before the run, from the reference output.)*

Platform: no warning. The column name, type and format are unchanged, so nothing looks different to a
schema check, and the pipeline should treat the values as dollars.

Data: the rule that removes amounts above 10,000 would, in cents, reject every order over $100. In the
reference output 187 of 1,001 rows are at or below $100, so I predicted about 187 rows would survive,
with a median of about 5,300 against 257.91, and the filter hiding the unit change by deleting most rows.

## What happened
The run at 01:15:01 AM completed without any error or warning. The output has **247 rows against 1,001**
in the reference output, so 754 rows (75%) were removed silently.

- Amounts in the output: minimum 510, median 5,320, maximum 9,988. None above 10,000.
- The rows removed were the higher-value orders: every order above $100 was dropped.
- 60 rows whose amount was missing in the source were filled with 5,320, which equals the median of the
  surviving values. This is why the output has 247 rows and not the 187 I predicted: 187 + 60 = 247. I did
  not anticipate that missing amounts would be filled in the new unit and survive the filter.
- Dates are identical to the reference output for every order that appears in both.
- 11 order IDs appear twice and 3 invalid emails remain. These match the combined case: the duplicates come
  from my first-version test data (see [schema-combined.md](schema-combined.md)), and `john@@example`
  was already left in by the baseline run.

## Did Rhombus notice?
No. The log reports "Applied 7 transformations", then success. Nothing mentions the amounts, the unit, or
the loss of 75% of the rows.

## Did my validation catch it?
Yes, in two ways (`evidence/validation-semantic-cents.md`):
- **Median amount:** 5,320 against 257.91, a ratio of 20.63, fails the unit-change check.
- **Row count:** 247 against 1,001 (ratio 0.25) fails a new check I added for output size against the
  reference. The first version of the validator did not have this check, so it would have missed the row loss.

The existing range check ("amount in 0 to 10,000") **passed**, because the pipeline's own filter had
already removed everything above 10,000. The unit change is only visible in the median and in the
row count, which is why a range check alone is not enough.

## Logs
The Remove Duplicates line removed 12 rows (the first-version duplicates, as in the combined case) and no
line mentions the amount filter at all. The panel's counters did not change between two runs, so it is
hard to tell which entries belong to the current run.

Screenshot: `evidence/semantic-cents-log.png`

## Chatbot
I asked the chatbot "is there anything wrong with this output?". Its reply audited the pipeline's node
configuration, said every node was fine, and warned that the age rule was skipped. It did not mention
amounts, units or row counts.

## Earlier run with the original-schema file
I also ran the original `semantic_cents.csv` on the same pipeline at 01:09:05 AM. It completed without
errors, and its Remove Duplicates line listed `order_amount_usd`, a column that file does not have
(it has `amount_usd`), with 46 rows affected. I did not examine that run's output, so I draw no
conclusion about it. It does show that a pipeline can report success while some of its steps refer to
columns that are not in the input.

## Schedule afterwards
Not tested: ran manually because the scheduler never triggered.

## Severity
High. A 100x change in the meaning of the amounts went unnoticed. The pipeline's own cleaning rule then
silently deleted 75% of the valid rows, all of them higher-value orders, and filled missing amounts using the
new unit. Everything the customer sees says "success".

## Round 2
Repeat on a rebuilt pipeline with the original column names, using `semantic_cents.csv`, so the result does
not depend on a pipeline that earlier chatbot edits had adapted to a drifted schema.
