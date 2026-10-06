"""Find out why the authenticated API tests fail, without printing your token.

Run from the repo root:  python api-tests/check_token.py
(pytest ignores this file because its name does not start with test_.)
"""
import base64
import json
import os
import time

import requests
from dotenv import load_dotenv

load_dotenv()

BASE = os.getenv("RHOMBUS_API_BASE_URL", "https://api.rhombusai.com").rstrip("/")
TOKEN = os.getenv("RHOMBUS_API_TOKEN", "")
ORG_ID = os.getenv("RHOMBUS_API_ORG_ID", "")
URL = f"{BASE}/api/accounts/users/credits"

print("Token set:", bool(TOKEN), "| length:", len(TOKEN))
print("Starts with the word Bearer:", TOKEN.lower().startswith("bearer"))
print("Contains spaces, quotes or line breaks:", any(c in TOKEN for c in ' "\'\n\r'))
parts = TOKEN.split(".")
print("Dot-separated parts (a JWT has 3):", len(parts))
if len(parts) == 3:
    try:
        payload = parts[1] + "=" * (-len(parts[1]) % 4)
        exp = json.loads(base64.urlsafe_b64decode(payload)).get("exp")
        if exp:
            state = "EXPIRED" if exp < time.time() else "still valid"
            print("Token expiry:", time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime(exp)), "->", state)
    except Exception as exc:  # the token may be damaged
        print("Could not read the expiry:", exc)
print("x-org-id set:", bool(ORG_ID))

headers = {"Accept": "application/json", "Authorization": f"Bearer {TOKEN}"}
if ORG_ID:
    headers["x-org-id"] = ORG_ID
r = requests.get(URL, headers=headers, timeout=30)
print("\nStatus:", r.status_code)
print("Body (first 300 characters):", r.text[:300])

hints = {
    200: "The call works. The failure is in a test: run pytest with --tb=short and send me the first error.",
    401: "Token rejected: expired, copied incompletely, or has an extra 'Bearer ' in front.",
    403: "Token accepted but not allowed: check that x-org-id matches the value in the browser request.",
}
print("Hint:", hints.get(r.status_code, "Unexpected status. Send me this output."))
