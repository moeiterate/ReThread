import { test, expect, Page } from '@playwright/test';

// ── Helpers ─────────────────────────────────────────────

async function freshPage(page: Page) {
  await page.goto('/');
  // Clear any stale state from previous runs
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function waitForLoading(page: Page) {
  // The app has a full-screen overlay div[x-show="isLoading"] that blocks all clicks.
  // Wait for it to be hidden (Alpine.js sets display:none when isLoading=false).
  await page.locator('[x-show="isLoading"]').waitFor({ state: 'hidden', timeout: 60_000 }).catch(() => {});
  // Extra safety: also wait for "Checking Schedule" text to be gone
  await page.getByText('Checking Schedule').waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => {});
}

async function loadAllSamples(page: Page) {
  const sample = () => page.getByRole('button', { name: 'Sample' }).first();

  await sample().click();         // Riders
  await waitForLoading(page);

  await sample().click();         // Drivers
  await waitForLoading(page);

  await sample().click();         // Vehicles
  await waitForLoading(page);

  await expect(page.getByText(/Ready:/)).toBeVisible({ timeout: 10_000 });
}

async function goToReview(page: Page) {
  await page.getByRole('button', { name: /Validate & Continue/ }).click();
  await waitForLoading(page);
  await expect(page.getByRole('heading', { name: 'Review & Confirm' })).toBeVisible({ timeout: 60_000 });
}

async function runOptimization(page: Page) {
  await page.getByRole('button', { name: /Run Optimization/ }).click();
  await waitForLoading(page);
  // Results page: "Fleet Utilization" only appears on Results
  await expect(page.getByText('Fleet Utilization')).toBeVisible({ timeout: 60_000 });
}

// ── Tests ───────────────────────────────────────────────

test.describe('Route Optimizer MVP', () => {

  test('1.1.1 — Load all sample data', async ({ page }) => {
    await freshPage(page);
    await loadAllSamples(page);
    await expect(page.getByText('Riders Loaded')).toBeVisible();
    await expect(page.getByText('Drivers Loaded')).toBeVisible();
    await expect(page.getByText('Vehicles Loaded')).toBeVisible();
  });

  test('1.3.1 — Default settings are sensible', async ({ page }) => {
    await freshPage(page);
    await expect(page.getByText('Arrive Before Flight')).toBeVisible();
    await expect(page.getByText('120 min', { exact: true })).toBeVisible();
    await expect(page.getByText('Max Ride Time')).toBeVisible();
    await expect(page.getByText('90 min', { exact: true })).toBeVisible();
    await expect(page.getByText('Max Cluster Radius')).toBeVisible();
    await expect(page.getByText('Max Stops per Van')).toBeVisible();
  });

  test('4.1 — Full flow reaches Review step', async ({ page }) => {
    await freshPage(page);
    await loadAllSamples(page);
    await goToReview(page);
    await expect(page.getByRole('button', { name: /Run Optimization/ })).toBeVisible();
  });

  test('4.1+ — Full flow reaches Results', async ({ page }) => {
    await freshPage(page);
    await loadAllSamples(page);
    await goToReview(page);
    await runOptimization(page);
  });

  test('3.1.2 — No unassigned rider has reason UNKNOWN', async ({ page }) => {
    await freshPage(page);
    await loadAllSamples(page);
    await goToReview(page);
    await runOptimization(page);

    const body = await page.locator('main').textContent();
    expect(body).not.toMatch(/Skipped by optimizer:\s*UNKNOWN/i);
  });

});
