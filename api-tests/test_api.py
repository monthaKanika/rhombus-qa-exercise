"""API tests for Rhombus AI (backend at api.rhombusai.com).

Endpoint under test: GET /api/accounts/users/credits (found in the browser's Network tab).
Observed response shape (values redacted, names and types as seen):
  {
    "balance":   {balance, subscription_credits, purchased_credits, tier, monthly_allocation,
                  topup_enabled, is_unlimited, usage_this_period},
    "tier_info": {tier, monthly_credits, price_monthly, credit_value},
    "topup_packages": []
  }
The tests check the structure, the field types and the relationships between fields. They never
assert exact credit amounts, because those change with usage.

Setup (.env, never committed):
  RHOMBUS_API_BASE_URL   defaults to https://api.rhombusai.com
  RHOMBUS_API_TOKEN      the token from the request's Authorization header (without "Bearer ")
  RHOMBUS_API_COOKIE     use this instead if the request is authenticated by a cookie
  RHOMBUS_API_ORG_ID     the value of the x-org-id header the app sends with every request
The token expires after about 24 hours; copy a fresh one if the authenticated tests start getting 401.

Run:  python -m pytest api-tests -v
The two negative tests need no credentials. The authenticated tests are skipped without them.
"""
import os
from functools import lru_cache

import pytest
import requests
from dotenv import load_dotenv

load_dotenv()

BASE = os.getenv("RHOMBUS_API_BASE_URL", "https://api.rhombusai.com").rstrip("/")
TOKEN = os.getenv("RHOMBUS_API_TOKEN", "xxx")
COOKIE = os.getenv("RHOMBUS_API_COOKIE", "")
ORG_ID = os.getenv("RHOMBUS_API_ORG_ID", "xxx")
CREDITS_URL = f"{BASE}/api/accounts/users/credits"

BALANCE_FIELDS = {
    "balance", "subscription_credits", "purchased_credits", "tier",
    "monthly_allocation", "topup_enabled", "is_unlimited", "usage_this_period",
}
TIER_INFO_FIELDS = {"tier", "monthly_credits", "price_monthly", "credit_value"}

needs_auth = pytest.mark.skipif(
    not (TOKEN or COOKIE), reason="set RHOMBUS_API_TOKEN or RHOMBUS_API_COOKIE in .env"
)


def base_headers():
    headers = {"Accept": "application/json"}
    if ORG_ID:
        headers["x-org-id"] = ORG_ID
    return headers


def auth_headers():
    headers = base_headers()
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    if COOKIE:
        headers["Cookie"] = COOKIE
    return headers


@lru_cache(maxsize=1)
def fetch_credits():
    """One authenticated call, shared by the tests below."""
    r = requests.get(CREDITS_URL, headers=auth_headers(), timeout=30)
    return r


def is_int(value):
    return isinstance(value, int) and not isinstance(value, bool)


def is_number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


# ---- positive tests ---------------------------------------------------------
@needs_auth
def test_credits_returns_200_json_with_expected_structure():
    r = fetch_credits()
    assert r.status_code == 200
    assert "application/json" in r.headers.get("Content-Type", "")
    body = r.json()
    assert set(body) >= {"balance", "tier_info", "topup_packages"}
    assert BALANCE_FIELDS <= set(body["balance"])
    assert TIER_INFO_FIELDS <= set(body["tier_info"])


@needs_auth
def test_credits_field_types():
    body = fetch_credits().json()
    b, t = body["balance"], body["tier_info"]
    for field in ("balance", "subscription_credits", "purchased_credits",
                  "monthly_allocation", "usage_this_period"):
        assert is_int(b[field]), f"balance.{field} should be an integer, got {b[field]!r}"
    assert isinstance(b["tier"], str) and b["tier"]
    assert isinstance(b["topup_enabled"], bool)
    assert isinstance(b["is_unlimited"], bool)
    assert isinstance(t["tier"], str) and t["tier"]
    assert is_int(t["monthly_credits"])
    assert is_number(t["price_monthly"]) and is_number(t["credit_value"])
    assert isinstance(body["topup_packages"], list)


@needs_auth
def test_credits_balance_is_sum_of_subscription_and_purchased():
    b = fetch_credits().json()["balance"]
    assert b["balance"] == b["subscription_credits"] + b["purchased_credits"]


@needs_auth
def test_credits_tier_and_allocation_agree_between_sections():
    body = fetch_credits().json()
    assert body["balance"]["tier"] == body["tier_info"]["tier"]
    assert body["balance"]["monthly_allocation"] == body["tier_info"]["monthly_credits"]


@needs_auth
def test_credits_values_are_not_negative():
    body = fetch_credits().json()
    b, t = body["balance"], body["tier_info"]
    for value in (b["balance"], b["subscription_credits"], b["purchased_credits"],
                  b["monthly_allocation"], b["usage_this_period"],
                  t["monthly_credits"], t["price_monthly"], t["credit_value"]):
        assert value >= 0


@needs_auth
def test_credits_responds_quickly():
    r = fetch_credits()
    assert r.status_code == 200
    assert r.elapsed.total_seconds() < 5


# ---- negative tests ---------------------------------------------------------
def test_credits_without_credentials_is_rejected():
    r = requests.get(CREDITS_URL, headers=base_headers(), timeout=30)  # org id, but no credentials
    assert r.status_code in (401, 403)


def test_credits_with_invalid_token_is_rejected():
    headers = {**base_headers(), "Authorization": "Bearer not-a-real-token"}
    r = requests.get(CREDITS_URL, headers=headers, timeout=30)
    assert r.status_code in (401, 403)
    assert r.text  # the server explains the rejection in a response body
