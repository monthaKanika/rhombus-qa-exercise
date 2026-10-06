const { defineConfig } = require('@playwright/test');
const { BASE_URL } = require('./config');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 180_000,            // a real pipeline run can take a while
  expect: { timeout: 30_000 }, // assertions poll until this limit, so no fixed sleeps are needed
  workers: 1,                  // the tests share one real pipeline, so run them one at a time
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    // Use the Chrome installed on this computer. That also avoids downloading Playwright's own
    // headless browser, which fails on networks that intercept HTTPS.
    channel: process.env.RHOMBUS_BROWSER_CHANNEL || 'chrome',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
