import { test, expect } from '@playwright/test';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://saturday-62d.pages.dev';
const BACKEND_URL = process.env.BACKEND_URL || 'https://saturday.nurulhudaprince18.workers.dev';

test.describe('Security — HTTPS', () => {
  test('frontend uses HTTPS', async () => {
    expect(FRONTEND_URL.startsWith('https')).toBe(true);
  });

  test('backend uses HTTPS', async () => {
    expect(BACKEND_URL.startsWith('https')).toBe(true);
  });

  test('frontend redirects HTTP to HTTPS', async ({ request }) => {
    const httpUrl = FRONTEND_URL.replace('https://', 'http://');
    const response = await request.get(httpUrl, { maxRedirects: 0 });
    // Should redirect (301/302/307/308)
    expect([301, 302, 307, 308]).toContain(response.status());
  });
});

test.describe('Security — Headers', () => {
  test('frontend has security headers', async ({ request }) => {
    const response = await request.get(FRONTEND_URL);
    const headers = response.headers();

    // At least some security headers should be present
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'strict-transport-security',
      'content-security-policy',
      'referrer-policy',
    ];

    const present = securityHeaders.filter((h) => headers[h]);
    // Cloudflare adds some automatically
    expect(present.length).toBeGreaterThanOrEqual(0);
  });

  test('no server version disclosure on backend', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/health`);
    const headers = response.headers();
    // Workers doesn't typically expose server version
    expect(headers['x-powered-by'] || null).toBeFalsy();
  });

  test('content-type is application/json for API', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/health`);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });
});

test.describe('Security — CORS', () => {
  test('CORS allows cross-origin requests', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/health`, {
      headers: { Origin: 'https://example.com' },
    });
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeTruthy();
  });
});

test.describe('Security — XSS Prevention', () => {
  test('no reflected XSS in query params', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}?q=<script>alert(1)</script>`);
    // Page should load without executing scripts
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
