"""API tests for Rhombus AI. SKELETON: fill in the TODO endpoints.

How to find the endpoints: open the Rhombus web app, open browser dev tools >
Network tab (filter Fetch/XHR), then log in, list pipelines, open one, check a
run. Copy the request URL, method and the Authorization header.

Run:  pytest api-tests -v
"""
import os

import pytest
import requests
from dotenv import load_dotenv

load_dotenv()

BASE = os.getenv("RHOMBUS_API_BASE_URL", "").rstrip("/")
TOKEN = os.getenv("RHOMBUS_API_TOKEN", "")

# TODO: replace with the real paths you saw in the Network tab
PIPELINES_PATH = "/TODO/pipelines"
RUNS_PATH = "/TODO/pipelines/{pipeline_id}/runs"

pytestmark = pytest.mark.skipif(not BASE, reason="set RHOMBUS_API_BASE_URL in .env")


def auth():
    return {"Authorization": f"Bearer {TOKEN}"}  # TODO: match the header format you saw


def test_list_pipelines_authenticated():
    r = requests.get(f"{BASE}{PIPELINES_PATH}", headers=auth(), timeout=30)
    assert r.status_code == 200
    body = r.json()
    # TODO: assert on the real response shape, e.g. a list/field you saw
    assert body is not None


def test_get_run_status_has_expected_fields():
    # TODO: use a real pipeline id (read it from the list call above)
    r = requests.get(f"{BASE}{RUNS_PATH.format(pipeline_id='TODO')}", headers=auth(), timeout=30)
    assert r.status_code == 200
    # TODO: assert on status field values you observed


def test_list_pipelines_unauthenticated_is_rejected():  # negative test
    r = requests.get(f"{BASE}{PIPELINES_PATH}", timeout=30)
    assert r.status_code in (401, 403)
    # TODO: also assert on the error body you observed
