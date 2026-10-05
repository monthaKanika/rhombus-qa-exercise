| Status | Check | Detail |
|---|---|---|
| PASS | schema: expected columns present | missing=[] |
| PASS | schema: no unexpected columns | extra=[] |
| PASS | schema: amount_usd is numeric | non-numeric=0 |
| INFO | rows: source / unique source / output | 1050 / 1038 / 247 |
| PASS | rows: output is not empty |  |
| PASS | rows: output not larger than unique source rows | output=247 unique_source=1038 |
| FAIL | rows: output size close to reference (silent row loss?) | output=247 reference=1001 ratio=0.25 |
| PASS | clean: no exact duplicate rows | duplicates=0 |
| FAIL | clean: order_id unique | duplicate ids=11 |
| PASS | clean: customer_name trimmed |  |
| PASS | clean: customer_name Title Case |  |
| PASS | clean: customer_name has no empty values | empty=0 |
| PASS | clean: country trimmed |  |
| PASS | clean: country Title Case |  |
| PASS | clean: country has no empty values | empty=0 |
| PASS | clean: order_date is YYYY-MM-DD | bad format=0 |
| PASS | clean: order_date is a real date | invalid=0 |
| FAIL | clean: emails valid | invalid=3 |
| INFO | clean: placeholder emails (valid-looking but fake) | 10 |
| PASS | clean: amount in (0, 10000] | out of range=0 |
| INFO | clean: one amount repeated many times (imputation?) | 5320.0 x61 |
| FAIL | semantic: median amount in line with baseline (unit change?) | median=5320.00 baseline=257.91 ratio=20.63 |
| PASS | semantic: dates match baseline for shared order_ids (day/month swap?) | changed=0.0% of 269 shared rows |
