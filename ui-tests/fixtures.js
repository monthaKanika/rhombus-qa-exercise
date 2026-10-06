// Attaches the tests to the Chrome window started by `npm run chrome`, where you are logged in.
// The tests open new tabs in that window's default session and close them again afterwards.
const { test: base, expect, chromium } = require('@playwright/test');
const { CDP_URL } = require('./config');

const test = base.extend({
  browser: [
    async ({}, use) => {
      let browser;
      try {
        browser = await chromium.connectOverCDP(CDP_URL);
      } catch (err) {
        throw new Error(
          'Cannot reach the test Chrome window. Run `npm run chrome` in another terminal, log in, ' +
            'leave the window open, then run the tests again. (' + err.message + ')'
        );
      }
      await use(browser);
      await browser.close(); // disconnects; the Chrome window stays open
    },
    { scope: 'worker' },
  ],
  context: async ({ browser }, use) => {
    const context = browser.contexts()[0]; // the window's own session, which holds your login
    if (!context) throw new Error('The test Chrome window has no open session. Restart it with `npm run chrome`.');
    await use(context);
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

module.exports = { test, expect };
