import { defineConfig, devices } from '@playwright/test';

const ROUTE_OPTIMIZER_URL = process.env.ROUTE_OPTIMIZER_URL ?? 'https://routeoptimizer-production.up.railway.app';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,      // sequential — one browser hitting remote app
  workers: 1,                // single worker
  retries: 0,                // no retries — fail fast, see what broke
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./e2e/test-plan-reporter.ts'],
  ],
  use: {
    baseURL: ROUTE_OPTIMIZER_URL,
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  timeout: 90_000,           // 90s per test — remote app + optimization is slow
  expect: { timeout: 10_000 },
});
