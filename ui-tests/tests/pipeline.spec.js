// UI tests for the Rhombus AI pipeline journey.
//
// Rules from the brief: no fixed sleeps, and assertions on real outcomes. Every wait below is an
// auto-waiting `expect(...)` that polls until it passes or times out.
//
// Setup:   npm install && npm run chrome     (log in by hand in the Chrome window that opens, leave it open)
// Check:   npm run check                     (quick test that the window is logged in)
// Run:     npm test                          (the tests open tabs in that window)
//
// Covered: the pipeline page loads for a logged-in user and shows its main tabs, the Schedule tab
// opens, and a visitor who is not logged in does not get the pipeline.
// Not covered: starting a run from the UI. The Run and Logs buttons are icon-only and could not be
// located reliably, so the pipeline runs in this project were started and recorded by hand.
const { test, expect } = require('../fixtures');
const { BASE_URL, WORKFLOW_PATH } = require('../config');

// Full address: the window we attach to is an existing Chrome session, so a bare path would have no base URL.
const WORKFLOW_URL = BASE_URL + WORKFLOW_PATH;

const tab = (page, name) => page.getByText(name, { exact: true }).first();

// Attach a screenshot to any failing test, so the report shows what the browser saw.
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach('screenshot', { body: await page.screenshot(), contentType: 'image/png' });
  }
});

// ---- tests that need a logged-in session -------------------------------------
test.describe('logged-in pipeline journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WORKFLOW_URL);

    // Wait until the page has settled on either the pipeline or the login screen.
    let state = 'loading';
    await expect
      .poll(
        async () => {
          if (/login\.rhombusai\.com/.test(page.url())) state = 'login';
          else if (await tab(page, 'Canvas').isVisible()) state = 'canvas';
          return state;
        },
        { timeout: 60_000, message: 'waiting for the pipeline page to load' }
      )
      .not.toBe('loading');
    expect(state, 'Redirected to the login screen: log in in the Chrome window started by `npm run chrome`.').toBe('canvas');
  });

  test('the pipeline page shows its main tabs', async ({ page }) => {
    for (const name of ['Canvas', 'Workspace', 'AI Builder', 'Schedule']) {
      await expect(tab(page, name)).toBeVisible();
    }
  });

  test('the schedule tab opens and shows schedule settings', async ({ page }) => {
    await tab(page, 'Schedule').click();
    // The tab label plus at least one more element mentioning the schedule means a panel opened.
    await expect(page.getByText(/schedule/i)).not.toHaveCount(1);
  });
});

// ---- negative test: no session ------------------------------------------------
test('a visitor who is not logged in does not get the pipeline', async ({ browser }) => {
  const context = await browser.newContext(); // fresh browser state, no saved login
  const page = await context.newPage();
  await page.goto(WORKFLOW_URL);

  // The pipeline canvas must not appear, and the page must offer a way to log in.
  await expect(page.getByText('Canvas', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/log ?in|sign ?in|continue with google/i).first()).toBeVisible();
  await context.close();
});
