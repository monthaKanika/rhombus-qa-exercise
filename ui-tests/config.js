// Shared settings for the UI tests. Values come from the repo-root .env file.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const BASE_URL = (process.env.RHOMBUS_BASE_URL || 'https://rhombusai.com').replace(/\/$/, '');
const WORKFLOW_ID = process.env.RHOMBUS_WORKFLOW_ID || '5270';
const WORKFLOW_PATH = `/workflow/${WORKFLOW_ID}`;
const DEBUG_PORT = process.env.RHOMBUS_DEBUG_PORT || '9222';
const CDP_URL = `http://127.0.0.1:${DEBUG_PORT}`;
// A dedicated Chrome profile for the test window. It holds session data: never commit it.
const PROFILE_DIR = path.resolve(__dirname, '.chrome-profile');

module.exports = { BASE_URL, WORKFLOW_ID, WORKFLOW_PATH, DEBUG_PORT, CDP_URL, PROFILE_DIR };
