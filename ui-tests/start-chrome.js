// Run:  npm run chrome
// Opens a normal Chrome window with remote debugging switched on, in a dedicated profile.
// You log in to Rhombus by hand in that window (Google sign-in cannot be automated), and the
// tests then attach to the same window, so they use your real, logged-in session.
// Leave the window open while the tests run.
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { BASE_URL, DEBUG_PORT, CDP_URL, PROFILE_DIR } = require('./config');

const candidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);

const chrome = candidates.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error('Could not find Chrome. Set CHROME_PATH to chrome.exe and run again.');
  process.exit(1);
}

http
  .get(`${CDP_URL}/json/version`, (res) => {
    res.resume();
    console.log(`Chrome is already running with remote debugging on port ${DEBUG_PORT}. Nothing to start.`);
  })
  .on('error', () => {
    spawn(
      chrome,
      [
        `--remote-debugging-port=${DEBUG_PORT}`,
        `--user-data-dir=${PROFILE_DIR}`,
        '--no-first-run',
        '--no-default-browser-check',
        BASE_URL,
      ],
      { detached: true, stdio: 'ignore' }
    ).unref();
    console.log('Chrome is starting. In that window:');
    console.log('  1. Log in to Rhombus (Continue with Google) and wait until you see your pipelines.');
    console.log('  2. Leave the window open and run the tests from this terminal: npm test');
  });
