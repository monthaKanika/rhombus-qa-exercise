"""Create every drifted dataset from baseline.csv (fake data only, reproducible).

Run:  python make_drifts.py          (run from inside datasets/; reads baseline.csv, writes next to it)

Schema drift (structure changes):
  schema_drop_column      drop `age`
  schema_rename_column    rename `amount_usd` -> `order_amount_usd`
  schema_type_change      `age` becomes text, e.g. "42 years"
  schema_add_column       add new column `loyalty_tier`
  schema_combined         all four changes together

Semantic drift (structure identical, meaning changes):
  semantic_cents          `amount_usd` now holds cents (x100) under the same name
  semantic_date_swap      day and month swapped in every date where that still
                          gives a valid date (ISO, DD/MM/YYYY and MM-DD-YYYY rows;
                          text-month rows are left unchanged)

Date conventions in baseline.csv (set by make_baseline.py):
  YYYY-MM-DD, DD/MM/YYYY (slash), MM-DD-YYYY (dash), "DD Mon YYYY".
"""
import csv
import os
import random
import re
import shutil

SRC = "baseline.csv"
OUT = "."
TIERS = ["bronze", "silver", "gold", "platinum"]

os.makedirs(OUT, exist_ok=True)

with open(SRC, newline="") as f:
    reader = csv.DictReader(f)
    FIELDS = reader.fieldnames
    BASE = list(reader)


def write(name, rows, fields):
    path = os.path.join(OUT, f"{name}.csv")
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print(f"{name}.csv: {len(rows)} rows, {len(fields)} columns")


def copy(rows):
    return [dict(r) for r in rows]


# ---- schema drift helpers -------------------------------------------------
def drop_age(rows):
    return [{k: v for k, v in r.items() if k != "age"} for r in rows]


def rename_amount(rows):
    return [{("order_amount_usd" if k == "amount_usd" else k): v for k, v in r.items()} for r in rows]


def age_to_text(rows):
    rows = copy(rows)
    for r in rows:
        if r["age"].strip():
            r["age"] = f'{r["age"]} years'
    return rows


def add_tier(rows):
    """loyalty_tier is derived from order_id, so duplicate rows (same order_id)
    stay exact duplicates. (v1 assigned a random tier per row, which made
    duplicates differ and hid them from de-duplication.)"""
    rows = copy(rows)
    for r in rows:
        r["loyalty_tier"] = TIERS[int(r["order_id"]) % len(TIERS)]
    return rows


# ---- semantic drift helpers -----------------------------------------------
def to_cents(rows):
    rows = copy(rows)
    for r in rows:
        v = r["amount_usd"].strip()
        if v:
            r["amount_usd"] = str(round(float(v) * 100))
    return rows


def swap_date(s):
    t = s.strip()
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", t)
    if m:
        y, mo, d = m.groups()
        return f"{y}-{d}-{mo}" if int(d) <= 12 and d != mo else s
    m = re.fullmatch(r"(\d{2})/(\d{2})/(\d{4})", t)  # DD/MM/YYYY
    if m:
        d, mo, y = m.groups()
        return f"{mo}/{d}/{y}" if int(d) <= 12 and d != mo else s
    m = re.fullmatch(r"(\d{2})-(\d{2})-(\d{4})", t)  # MM-DD-YYYY
    if m:
        mo, d, y = m.groups()
        return f"{d}-{mo}-{y}" if int(d) <= 12 and d != mo else s
    return s


def swap_dates(rows):
    rows = copy(rows)
    changed = 0
    for r in rows:
        new = swap_date(r["order_date"])
        changed += new != r["order_date"]
        r["order_date"] = new
    print(f"  (semantic_date_swap changed {changed} of {len(rows)} dates)")
    return rows


# ---- build everything -----------------------------------------------------

write("schema_drop_column", drop_age(BASE), [c for c in FIELDS if c != "age"])
write("schema_rename_column", rename_amount(BASE),
      ["order_amount_usd" if c == "amount_usd" else c for c in FIELDS])
write("schema_type_change", age_to_text(BASE), FIELDS)
write("schema_add_column", add_tier(BASE), FIELDS + ["loyalty_tier"])

# combined = drop `age` + rename amount + add tier + type change on a column
# that still exists (order_id becomes text, e.g. ORD-10456).
combined = add_tier(rename_amount(drop_age(BASE)))
for r in combined:
    r["order_id"] = f'ORD-{r["order_id"]}'
write("schema_combined", combined,
      [("order_amount_usd" if c == "amount_usd" else c) for c in FIELDS if c != "age"] + ["loyalty_tier"])

write("semantic_cents", to_cents(BASE), FIELDS)
write("semantic_date_swap", swap_dates(BASE), FIELDS)
