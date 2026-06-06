import { test, expect, type Page, type APIRequestContext } from '@playwright/test';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://saturday-62d.pages.dev';
const BACKEND_URL = process.env.BACKEND_URL || 'https://saturday.nurulhudaprince18.workers.dev';

test.describe('Frontend — Page Load', () => {
  test('page loads successfully', async ({ page }) => {
    const response = await page.goto(FRONTEND_URL);
    expect(response?.status()).toBe(200);
  });

  test('title contains Saturday', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await expect(page).toHaveTitle(/Saturday|System Status/);
  });

  test('viewport meta tag present', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toBeAttached();
  });

  test('dark theme CSS is present', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );
    // Dark theme should have low RGB values
    expect(bgColor).toMatch(/rgb\(10,\s*10,\s*15\)|rgba\(10,\s*10,\s*15/);
  });
});

test.describe('Frontend — UI Elements', () => {
  test('header is visible', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('Run Tests button is visible and clickable', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    const button = page.locator('button:has-text("Run Tests")');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('score ring renders after running tests', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.click('button:has-text("Run Tests")');
    // Wait for tests to complete
    await page.waitForSelector('.score-ring', { timeout: 30000 });
    const scoreRing = page.locator('.score-ring');
    await expect(scoreRing).toBeVisible();
  });

  test('test suites appear after running tests', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await page.click('button:has-text("Run Tests")');
    await page.waitForSelector('.glass-card', { timeout: 30000 });
    const cards = page.locator('.glass-card');
    await expect(cards.first()).toBeVisible();
  });

  test('footer is visible', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});

test.describe('Frontend — Responsive', () => {
  test('mobile layout works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(FRONTEND_URL);
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('tablet layout works', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(FRONTEND_URL);
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });
});

test.describe('Frontend — Links', () => {
  test('frontend link works', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    const links = page.locator('a[href*="saturday"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
