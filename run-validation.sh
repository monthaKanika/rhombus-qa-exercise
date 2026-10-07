#!/usr/bin/env bash
# Runs the data validation for the baseline, the combined schema drift and the dollars-to-cents run,
# prints the failing checks and the totals for each, and saves a Markdown report per case.
#
# Usage (Git Bash, from the repo root):   bash run-validation.sh
# A FAIL is not always a problem: on drifted data several failures are the findings.
PY="${PYTHON:-$HOME/anaconda3/python.exe}"
mkdir -p observations/evidence

validate() {  # validate <label> <report name> <source> <output> [extra validator options...]
  local label="$1" report="observations/evidence/validation-$2.md" src="$3" out="$4"; shift 4
  echo; echo "=== $label ==="
  for f in "$src" "$out"; do
    if [ ! -f "$f" ]; then echo "SKIPPED: missing file $f"; return; fi
  done
  local text code
  text=$("$PY" data-validation/validate.py --source "$src" --output "$out" --report "$report" "$@" 2>&1)
  code=$?
  if [ $code -ge 2 ]; then  # exit 1 only means some checks failed; 2 or more means the validator did not run
    echo "ERROR: the validator did not run (exit $code):"
    echo "$text" | tail -3
    echo "Check that data-validation/validate.py is the latest version."
    return
  fi
  echo "$text" | grep -E "^FAIL" || echo "(no FAIL lines)"
  echo "$text" | tail -1
  echo "report saved: $report"
}

validate "Baseline" baseline datasets/baseline.csv datasets/baseline_output.csv
validate "Combined schema drift" schema-combined datasets/schema_combined_v1.csv datasets/schema_combined_output.csv \
  --reference datasets/baseline_output.csv --amount-col order_amount_usd
validate "Dollars to cents" semantic-cents datasets/semantic_cents_combined_schema.csv datasets/semantic_cents_output.csv \
  --reference datasets/schema_combined_output.csv --amount-col order_amount_usd
echo
