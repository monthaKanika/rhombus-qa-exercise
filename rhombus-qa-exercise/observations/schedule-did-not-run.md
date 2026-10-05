# Scheduled run did not start (baseline)

## What I did
Built the pipeline (S3 source -> AI-built cleaning -> GCS destination) and created an
hourly schedule, as the exercise asks, to get a scheduled baseline run.

- Schedule interval: hourly
- Time and displayed timezone
- Pipeline manual run before scheduling: succeeded 

## What I expected
The first scheduled run to start at the next hour boundary and appear in the schedule's
execution history, followed by a successful output file in GCS.

## What happened
No run started. I waited "waited 2 hours / 2 scheduled slots",
and the execution history stayed showed no entries for this schedule.
Nothing was written to GCS by a scheduled run.

## What I checked
I followed every point in the docs section "Why Didn't My Schedule Run?"
(screenshot of that section: `evidence/Scheduler1.png`):

| Docs checklist item | My result |
|---|---|
| 1. Is the schedule enabled? | Enabled |
| 2. Is the schedule time and timezone correct? | Correct |
| 3. Is the pipeline valid (exists, configured correctly)? | Yes |
| 4. Execution history (failed runs or failed nodes)? | No entries at all |
| 5. Run the pipeline manually | Succeeded |

## Logs
[Short excerpt from the execution history or the exported CSV, or "no entries / no error
shown".] Screenshots: `evidence/Scheduler1.png`, `evidence/Scheduler2.png`

## Chatbot
I didn't try to ask chatbot on how to make the scheduler run yet.

## What I did next
1. First I recreated the scheduler with shorter time interval. It still didn't run.
2. Second solution, I use manual run to proceed next step.

## Impact
Manual runs exercise the pipeline, the AI builder's cleaning and the GCS write, but not the scheduler. For every drift case, the exercise's question "what happens to the schedule afterwards?" is therefore **not tested**. All baseline and drift results in this repo come from manual runs.

## Severity
High for a scheduled-ETL product: the failure was silent. I could not find anything
in the UI showing why the run never started, and the documented checklist did not
resolve it. [Adjust if support or a retry later explained it.]
