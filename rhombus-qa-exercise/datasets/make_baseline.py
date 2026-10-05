"""Generate a reproducible messy customer-orders CSV (fake data only).

Planted defects (so the validation script can check each one later):
  - exact duplicate rows
  - missing values (email, amount, country)
  - inconsistent date formats
  - inconsistent casing / whitespace in names and countries
  - invalid entries (bad emails, negative or absurd amounts, impossible ages)
"""
import csv
import random
from datetime import date, timedelta

random.seed(42)  # same file every run

N_ROWS = 1000
FIRST = ["Aisha", "Ben", "Chen", "Diego", "Elena", "Farid", "Grace", "Hiro", "Ivy", "Jon"]
LAST = ["Nguyen", "Smith", "Patel", "Garcia", "Kim", "Okafor", "Rossi", "Silva", "Brown", "Khan"]
COUNTRIES = ["Australia", "India", "Vietnam", "Brazil", "Nigeria", "Canada"]
STATUSES = ["paid", "pending", "refunded"]


def messy_date(d: date) -> str:
    fmt = random.choice(["%Y-%m-%d", "%d/%m/%Y", "%m-%d-%Y", "%d %b %Y"])
    return d.strftime(fmt)


def messy_case(s: str) -> str:
    return random.choice([s, s.upper(), s.lower(), f"  {s} "])


rows = []
for i in range(1, N_ROWS + 1):
    first, last = random.choice(FIRST), random.choice(LAST)
    d = date(2025, 1, 1) + timedelta(days=random.randint(0, 600))
    rows.append({
        "order_id": 10000 + i,
        "customer_name": messy_case(f"{first} {last}"),
        "email": f"{first}.{last}{i}@example.com".lower(),
        "age": random.randint(18, 80),
        "country": messy_case(random.choice(COUNTRIES)),
        "order_date": messy_date(d),
        "amount_usd": round(random.uniform(5, 500), 2),
        "status": random.choice(STATUSES),
    })

# Missing values (~5% per field)
for r in rows:
    for col in ("email", "amount_usd", "country"):
        if random.random() < 0.05:
            r[col] = ""

# Invalid entries
for r in random.sample(rows, 30):
    r["email"] = random.choice(["not-an-email", "john@@example", "missing-at.com"])
for r in random.sample(rows, 20):
    r["age"] = random.choice([-5, 0, 150, 999])
for r in random.sample(rows, 20):
    r["amount_usd"] = random.choice([-49.99, 0, 9999999])

# Exact duplicates (~5%)
rows += random.sample(rows, 50)
random.shuffle(rows)

with open("baseline.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

print(f"Wrote baseline.csv with {len(rows)} rows")
