// SKELETON: fill in the TODO selectors after inspecting the app (use `npx playwright codegen https://rhombusai.com`).
// Rules from the exercise: no fixed sleeps, assert on real outcomes.
// Run: cd ui-tests && npm install && npx playwright install && npx playwright test
import { test, expect } from '@playwright/test';
import 'dotenv/config';

test.skip(!process.env.RHOMBUS_EMAIL, 'set RHOMBUS_EMAIL / RHOMBUS_PASSWORD in .env');

test.describe.serial('pipeline journey', () => {
  test('log in', async ({ page }) => {
    await page.goto('/');
    // TODO: open login, fill email/password from process.env, submit
    // await expect(page.getByRole('...')).toBeVisible();
  });

  test('S3 source connects', async ({ page }) => {
    // TODO: open data sources > Amazon S3, enter bucket + region, connect
    // await expect(page.getByText(/connected/i)).toBeVisible();
  });

  test('AI builder produces a cleaning pipeline', async ({ page }) => {
    // TODO: send the cleaning prompt, then assert on outcomes (a step appears,
    // preview shows ISO dates, row count below source), not on the AI's wording
  });

  test('GCS destination is created', async ({ page }) => {
    // TODO: add GCS destination (bucket name; key from a local file, never committed)
  });

  test('schedule is saved', async ({ page }) => {
    // TODO: create the schedule and assert it appears in the schedules list
  });
});
