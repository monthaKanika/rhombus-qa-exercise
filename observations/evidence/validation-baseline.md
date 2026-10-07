| Status | Check | Detail |
|---|---|---|
| PASS | schema: expected columns present | missing=[] |
| PASS | schema: no unexpected columns | extra=[] |
| PASS | schema: amount_usd is numeric | non-numeric=0 |
| PASS | schema: age is numeric | non-numeric=0 |
| INFO | rows: source / unique source / output | 1050 / 1000 / 949 |
| PASS | rows: output is not empty |  |
| PASS | rows: output not larger than unique source rows | output=949 unique_source=1000 |
| FAIL | clean: no exact duplicate rows | duplicates=4 |
| FAIL | clean: order_id unique | duplicate ids=4 |
| PASS | clean: customer_name trimmed |  |
| PASS | clean: customer_name Title Case |  |
| PASS | clean: customer_name has no empty values | empty=0 |
| PASS | clean: country trimmed |  |
| PASS | clean: country Title Case |  |
| PASS | clean: country has no empty values | empty=0 |
| PASS | clean: order_date is YYYY-MM-DD | bad format=0 |
| PASS | clean: order_date is a real date | invalid=0 |
| FAIL | clean: emails valid | invalid=12 |
| INFO | clean: placeholder emails (valid-looking but fake) | 56 |
| PASS | clean: age within 18-100 | out of range=0 |
| PASS | clean: amount in (0, 10000] | out of range=0 |
| INFO | clean: one amount repeated many times (imputation?) | 253.81 x61 |
| INFO | semantic: skipped | no --reference given |
