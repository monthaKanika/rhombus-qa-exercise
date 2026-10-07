"""Validate a Rhombus AI pipeline output (from GCS) against its S3 source.

Examples
--------
Baseline run (no reference yet):
  python validate.py --source ../datasets/baseline.csv \
                     --output ../datasets/baseline_output.csv \
                     --report ../observations/evidence/validation-baseline.md

Drifted run (compare against the known-good baseline output):
  python validate.py --source ../datasets/semantic_cents.csv \
                     --output ../datasets/semantic_cents_output.csv \
                     --reference ../datasets/baseline_output.csv \
                     --report ../observations/evidence/validation-semantic-cents.md

Determinism (same input, several runs):
  python validate.py --determinism run1.csv run2.csv run3.csv

Exit code is 1 if any check FAILs, so it can run in CI.
"""
import argparse
import hashlib
import re
import sys

import pandas as pd

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
ISO_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
AGE_MIN, AGE_MAX = 18, 100          # cleaning rules the pipeline was asked to apply
AMOUNT_MIN, AMOUNT_MAX = 0, 10_000  # amount must be > MIN and <= MAX
AMOUNT_COL = "amount_usd"        # override with --amount-col when the column is renamed
ROW_TOLERANCE = 0.20               # allowed row-count difference vs the reference output
RATIO_LIMIT = 5.0                   # median amount ratio that signals a unit change
DATE_DIFF_LIMIT = 0.05              # share of shared order_ids with changed dates

RESULTS = []  # (status, check, detail)


def record(ok, check, detail=""):
    RESULTS.append(("PASS" if ok else "FAIL", check, detail))


def note(check, detail):
    RESULTS.append(("INFO", check, detail))


def load(path):
    return pd.read_csv(path, dtype=str, keep_default_na=False)


# --------------------------------------------------------------------------
def check_schema(src, out, ref):
    expected = list(ref.columns) if ref is not None else list(src.columns)
    missing = [c for c in expected if c not in out.columns]
    extra = [c for c in out.columns if c not in expected]
    record(not missing, "schema: expected columns present", f"missing={missing}")
    record(not extra, "schema: no unexpected columns", f"extra={extra}")
    if AMOUNT_COL in out.columns:
        num = pd.to_numeric(out[AMOUNT_COL], errors="coerce")
        record(num.notna().all(), "schema: amount_usd is numeric",
               f"non-numeric={int(num.isna().sum())}")
    if "age" in out.columns:
        num = pd.to_numeric(out["age"], errors="coerce")
        record(num.notna().all(), "schema: age is numeric", f"non-numeric={int(num.isna().sum())}")


def check_rows(src, out, ref=None):
    unique_src = len(src.drop_duplicates())
    note("rows: source / unique source / output", f"{len(src)} / {unique_src} / {len(out)}")
    record(len(out) > 0, "rows: output is not empty")
    record(len(out) <= unique_src, "rows: output not larger than unique source rows",
           f"output={len(out)} unique_source={unique_src}")
    if ref is not None and len(ref):
        ratio = len(out) / len(ref)
        record(1 - ROW_TOLERANCE <= ratio <= 1 + ROW_TOLERANCE,
               "rows: output size close to reference (silent row loss?)",
               f"output={len(out)} reference={len(ref)} ratio={ratio:.2f}")


def check_cleaning(out):
    d = int(out.duplicated().sum())
    record(d == 0, "clean: no exact duplicate rows", f"duplicates={d}")
    if "order_id" in out.columns:
        d = int(out["order_id"].duplicated().sum())
        record(d == 0, "clean: order_id unique", f"duplicate ids={d}")
    for col in ("customer_name", "country"):
        if col in out.columns:
            s = out[col]
            record((s == s.str.strip()).all(), f"clean: {col} trimmed")
            record((s == s.str.title()).all(), f"clean: {col} Title Case")
            record((s != "").all(), f"clean: {col} has no empty values",
                   f"empty={(s == '').sum()}")
    if "order_date" in out.columns:
        s = out["order_date"]
        fmt = s.str.match(ISO_RE)
        valid = pd.to_datetime(s, format="%Y-%m-%d", errors="coerce").notna()
        record(fmt.all(), "clean: order_date is YYYY-MM-DD", f"bad format={(~fmt).sum()}")
        record(valid.all(), "clean: order_date is a real date", f"invalid={(~valid).sum()}")
    if "email" in out.columns:
        bad = ~out["email"].str.match(EMAIL_RE)
        record(not bad.any(), "clean: emails valid", f"invalid={int(bad.sum())}")
        placeholder = int((out["email"] == "unknown@unknown.com").sum())
        note("clean: placeholder emails (valid-looking but fake)", str(placeholder))
    if "age" in out.columns:
        a = pd.to_numeric(out["age"], errors="coerce")
        bad = ~a.between(AGE_MIN, AGE_MAX)
        record(not bad.any(), f"clean: age within {AGE_MIN}-{AGE_MAX}", f"out of range={int(bad.sum())}")
    if AMOUNT_COL in out.columns:
        m = pd.to_numeric(out[AMOUNT_COL], errors="coerce")
        bad = ~((m > AMOUNT_MIN) & (m <= AMOUNT_MAX))
        record(not bad.any(), f"clean: amount in ({AMOUNT_MIN}, {AMOUNT_MAX}]", f"out of range={int(bad.sum())}")
        top = m.value_counts()
        if len(top) and top.iloc[0] > 10:
            note("clean: one amount repeated many times (imputation?)",
                 f"{top.index[0]} x{int(top.iloc[0])}")


def check_semantic(out, ref):
    """Compare against a known-good baseline output, joined on order_id."""
    if ref is None:
        note("semantic: skipped", "no --reference given")
        return
    if AMOUNT_COL in out.columns and AMOUNT_COL in ref.columns:
        a = pd.to_numeric(out[AMOUNT_COL], errors="coerce").median()
        b = pd.to_numeric(ref[AMOUNT_COL], errors="coerce").median()
        ratio = a / b if b else float("inf")
        record(1 / RATIO_LIMIT <= ratio <= RATIO_LIMIT,
               "semantic: median amount in line with baseline (unit change?)",
               f"median={a:.2f} baseline={b:.2f} ratio={ratio:.2f}")
    if {"order_id", "order_date"} <= set(out.columns) & set(ref.columns):
        j = out.merge(ref, on="order_id", suffixes=("_out", "_ref"))
        if len(j):
            share = (j["order_date_out"] != j["order_date_ref"]).mean()
            record(share <= DATE_DIFF_LIMIT,
                   "semantic: dates match baseline for shared order_ids (day/month swap?)",
                   f"changed={share:.1%} of {len(j)} shared rows")
        else:
            note("semantic: dates", "no shared order_ids with the reference")


def determinism(paths):
    hashes = {}
    for p in paths:
        df = load(p)
        df = df.sort_values(list(df.columns)).reset_index(drop=True)
        hashes[p] = hashlib.sha256(df.to_csv(index=False).encode()).hexdigest()[:12]
    same = len(set(hashes.values())) == 1
    record(same, "determinism: identical output across runs", str(hashes))


# --------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--source")
    ap.add_argument("--output")
    ap.add_argument("--reference", help="known-good baseline output for comparison")
    ap.add_argument("--determinism", nargs="+", help="output files from repeated runs")
    ap.add_argument("--amount-col", default="amount_usd", help="name of the amount column in the output (default amount_usd)")
    ap.add_argument("--report", help="write a Markdown report here")
    args = ap.parse_args()
    global AMOUNT_COL
    AMOUNT_COL = args.amount_col

    if args.determinism:
        determinism(args.determinism)
    if args.source and args.output:
        src, out = load(args.source), load(args.output)
        ref = load(args.reference) if args.reference else None
        check_schema(src, out, ref)
        check_rows(src, out, ref)
        check_cleaning(out)
        check_semantic(out, ref)
    elif not args.determinism:
        ap.error("give --source and --output, and/or --determinism")

    lines = [f"{s:4}  {c}" + (f"  [{d}]" if d else "") for s, c, d in RESULTS]
    print("\n".join(lines))
    fails = sum(1 for s, *_ in RESULTS if s == "FAIL")
    print(f"\n{len(RESULTS) - fails} ok/info, {fails} FAIL")

    if args.report:
        with open(args.report, "w") as f:
            f.write("| Status | Check | Detail |\n|---|---|---|\n")
            for s, c, d in RESULTS:
                f.write(f"| {s} | {c} | {d} |\n")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
