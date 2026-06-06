---
name: playwright-e2e
description: "Add Playwright E2E tests — browser automation, visual regression, API testing. Use when Prince says 'add E2E tests' or 'test the full flow'. Free, open source."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [playwright, e2e, testing, browser, automation, visual-regression]
    related_skills: [test-driven-development, requesting-code-review, fullstack-developer]
---

# Playwright E2E Tests

## Overview

Adds Playwright end-to-end tests to any project. Tests run in real browsers (Chromium, Firefox, WebKit) and can do visual regression testing, API testing, and user flow testing.

## When to Use

- Prince says "add E2E tests" or "test the full flow"
- Before major releases
- Testing critical user journeys (signup, checkout, etc.)
- **Don't use for:** unit tests (use vitest-unit)

## Setup

```bash
pnpm add -D @playwright/test
npx playwright install chromium
```

## Config

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

## Example Tests

```ts
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads and shows hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page).toHaveTitle(/Your Site/);
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('text=About');
  await expect(page).toHaveURL(/about/);
});

test('contact form submits', async ({ page }) => {
  await page.goto('/contact');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="message"]', 'Hello!');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## Visual Regression

```ts
test('homepage looks correct', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', { maxDiffPixelRatio: 0.01 });
});
```

## GitHub Actions

```yaml
# .github/workflows/e2e.yml
- name: Run Playwright
  run: |
    pnpm exec playwright install --with-deps chromium
    pnpm exec playwright test
```

## Verification Checklist

- [ ] `pnpm exec playwright test` passes
- [ ] Tests run in CI
- [ ] Screenshots captured for visual tests
- [ ] Critical flows covered (signup, checkout, etc.)

## Agent Tip 🤖

> Start with 3-5 critical path tests. Don't try to test everything.
> Use `page.locator()` with text selectors — more resilient than CSS selectors.
