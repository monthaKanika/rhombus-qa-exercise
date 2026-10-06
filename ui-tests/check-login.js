// Run:  npm run check
// A quick check, much faster than the whole suite: is the test Chrome window running and logged in?
const { chromium } = require('@playwright/test');
const { CDP_URL, WORKFLOW_PATH, BASE_URL } = require('./config');

(async () => {
  let browser;
  try {
    browser = await chromium.connectOverCDP(CDP_URL);
  } catch (err) {
    console.log('NOT RUNNING: no Chrome with remote debugging found. Run `npm run chrome` first.');
    process.exit(1);
  }
  const context = browser.contexts()[0];
  const page = await context.newPage();
  await page.goto(BASE_URL + WORKFLOW_PATH);

  const deadline = Date.now() + 45_000;
  let result = 'TIMEOUT: the page neither showed the pipeline nor the login screen in 45 seconds.';
  while (Date.now() < deadline) {
    if (/login\.rhombusai\.com/.test(page.url())) {
      result = 'NOT LOGGED IN: the page went to the login screen. Log in in the Chrome window, then run this again.';
      break;
    }
    if (await page.getByText('Canvas', { exact: true }).first().isVisible()) {
      result = 'LOGGED IN: the pipeline page loaded.';
      break;
    }
    await page.waitForTimeout(500);
  }
  console.log(result);
  await page.close();
  await browser.close();
  process.exit(result.startsWith('LOGGED IN') ? 0 : 1);
})();
