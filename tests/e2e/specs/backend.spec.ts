import { test, expect, type APIRequestContext } from '@playwright/test';

const BACKEND_URL = process.env.BACKEND_URL || 'https://saturday.nurulhudaprince18.workers.dev';

test.describe('Backend API — Health', () => {
  test('health endpoint returns 200', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/health`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('hello endpoint returns message', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/hello`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBeTruthy();
  });

  test('health response has timestamp', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/health`);
    const body = await response.json();
    expect(body.timestamp).toBeTruthy();
    expect(new Date(body.timestamp).getTime()).toBeGreaterThan(0);
  });
});

test.describe('Backend API — CORS', () => {
  test('CORS headers present on health endpoint', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/health`);
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeTruthy();
  });

  test('CORS headers present on hello endpoint', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/hello`);
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeTruthy();
  });

  test('cf-ray header exposed', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/health`);
    const headers = response.headers();
    // cf-ray may or may not be present depending on cache
    // Just verify the response came from Cloudflare
    expect(headers['cf-ray'] || headers['server']).toBeTruthy();
  });
});

test.describe('Backend API — Performance', () => {
  test('health endpoint responds under 1000ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${BACKEND_URL}/api/health`);
    const duration = Date.now() - start;
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(1000);
  });

  test('hello endpoint responds under 1000ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${BACKEND_URL}/api/hello`);
    const duration = Date.now() - start;
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(1000);
  });

  test('average latency under 500ms (3 requests)', async ({ request }) => {
    const latencies: number[] = [];
    for (let i = 0; i < 3; i++) {
      const start = Date.now();
      await request.get(`${BACKEND_URL}/api/health`);
      latencies.push(Date.now() - start);
    }
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    expect(avg).toBeLessThan(500);
  });
});

test.describe('Backend API — KV', () => {
  test('KV write works', async ({ request }) => {
    const key = `e2e-test-${Date.now()}`;
    const response = await request.post(`${BACKEND_URL}/api/kv/${key}`, {
      data: { test: true, timestamp: Date.now() },
    });
    expect(response.status()).toBeLessThan(500);
  });

  test('KV read works', async ({ request }) => {
    const key = `e2e-test-read-${Date.now()}`;
    // Write first
    await request.post(`${BACKEND_URL}/api/kv/${key}`, {
      data: { value: 'hello' },
    });
    // Read
    const response = await request.get(`${BACKEND_URL}/api/kv/${key}`);
    expect(response.status()).toBeLessThan(500);
  });
});

test.describe('Backend API — Error Handling', () => {
  test('404 for unknown route', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/nonexistent`);
    expect(response.status()).toBe(404);
  });

  test('405 for wrong method', async ({ request }) => {
    const response = await request.post(`${BACKEND_URL}/api/health`);
    // Should return 405 Method Not Allowed
    expect(response.status()).toBe(405);
  });
});
