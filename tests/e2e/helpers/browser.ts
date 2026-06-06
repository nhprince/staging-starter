import { Page, expect, test as base } from '@playwright/test';

const DEFAULT_FRONTEND_URL = 'https://saturday-62d.pages.dev';

/**
 * Navigates to a URL and waits for the page to be fully loaded.
 */
export async function navigateAndWait(
  page: Page,
  url: string,
  options: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' } = {}
) {
  const { waitUntil = 'networkidle' } = options;
  const response = await page.goto(url, { waitUntil });
  return response;
}

/**
 * Checks that the page title contains the expected text.
 */
export async function expectTitleContains(page: Page, expected: string | RegExp) {
  const title = await page.title();
  if (typeof expected === 'string') {
    expect(title.toLowerCase()).toContain(expected.toLowerCase());
  } else {
    expect(title).toMatch(expected);
  }
}

/**
 * Checks that a meta tag with the given name exists and optionally
 * asserts its content.
 */
export async function expectMetaTag(
  page: Page,
  name: string,
  expectedContent?: string
) {
  const meta = page.locator(`meta[name="${name}"]`);
  await expect(meta).toBeVisible();
  if (expectedContent !== undefined) {
    const content = await meta.getAttribute('content');
    expect(content).toBe(expectedContent);
  }
}

/**
 * Checks that dark theme CSS is present on the page by looking for
 * dark-related CSS variables, classes, or color schemes.
 */
export async function expectDarkTheme(page: Page) {
  // Check for dark theme via CSS variables, class, or color-scheme
  const hasDarkTheme = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;

    // Check color-scheme meta or CSS
    const colorScheme = getComputedStyle(html).colorScheme ||
                        getComputedStyle(body).colorScheme;

    // Check for dark-related classes
    const hasDarkClass = html.classList.toString().includes('dark') ||
                         body.classList.toString().includes('dark');

    // Check CSS variables for dark theme
    const styles = getComputedStyle(body);
    const bgColor = styles.backgroundColor;

    // Check for dark background (rgb values all below 50)
    const isDarkBg = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    return {
      colorScheme,
      hasDarkClass,
      bgColor,
      isDarkBg: isDarkBg ? parseInt(isDarkBg[1]) < 60 : false,
    };
  });

  // At least one dark theme indicator should be present
  const hasIndicator =
    hasDarkTheme.colorScheme === 'dark' ||
    hasDarkTheme.hasDarkClass ||
    hasDarkTheme.isDarkBg;

  expect(
    hasIndicator,
    `Expected dark theme indicators but found: ${JSON.stringify(hasDarkTheme)}`
  ).toBe(true);
}

/**
 * Checks that all anchor links on the page are valid (have href attributes).
 */
export async function expectAllLinksValid(page: Page) {
  const links = page.locator('a[href]');
  const count = await links.count();

  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href');
    expect(href).not.toBeNull();
    expect(href).not.toBe('');
  }

  return count;
}

/**
 * Waits for an element to be visible and clickable.
 */
export async function waitForClickable(page: Page, selector: string, timeout = 10_000) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: 'visible', timeout });
  await expect(locator).toBeEnabled();
  return locator;
}

/**
 * Takes a screenshot with a descriptive name.
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `test-results/screenshots/${name}.png`,
    fullPage: true,
  });
}

/**
 * Checks that an element is visible and has non-zero dimensions.
 */
export async function expectRendered(page: Page, selector: string) {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  const box = await element.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);
}

/**
 * Extended test fixture that provides common page setup.
 */
export const test = base.extend<{ preparedPage: Page }>({
  preparedPage: async ({ page }, use) => {
    // Set default viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await use(page);
  },
});

export { expect };
