| Status | Check | Detail |
|---|---|---|
| FAIL | schema: expected columns present | missing=['age', 'amount_usd'] |
| FAIL | schema: no unexpected columns | extra=['order_amount_usd', 'loyalty_tier'] |
| PASS | schema: amount_usd is numeric | non-numeric=0 |
| INFO | rows: source / unique source / output | 1050 / 1038 / 1001 |
| PASS | rows: output is not empty |  |
| PASS | rows: output not larger than unique source rows | output=1001 unique_source=1038 |
| PASS | clean: no exact duplicate rows | duplicates=0 |
| FAIL | clean: order_id unique | duplicate ids=37 |
| PASS | clean: customer_name trimmed |  |
| PASS | clean: customer_name Title Case |  |
| PASS | clean: customer_name has no empty values | empty=0 |
| PASS | clean: country trimmed |  |
| PASS | clean: country Title Case |  |
| PASS | clean: country has no empty values | empty=0 |
| PASS | clean: order_date is YYYY-MM-DD | bad format=0 |
| PASS | clean: order_date is a real date | invalid=0 |
| FAIL | clean: emails valid | invalid=13 |
| INFO | clean: placeholder emails (valid-looking but fake) | 57 |
| PASS | clean: amount in (0, 10000] | out of range=0 |
| INFO | clean: one amount repeated many times (imputation?) | 257.91 x61 |
| INFO | semantic: dates | no shared order_ids with the reference |
