import { defineConfig } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 30_000 },        // assertions poll, so no fixed sleeps are needed
  use: {
    baseURL: process.env.RHOMBUS_BASE_URL ?? 'https://rhombusai.com',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
