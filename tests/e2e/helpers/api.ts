import { APIRequestContext, expect } from '@playwright/test';

const DEFAULT_BACKEND_URL = 'https://saturday.nurulhudaprince18.workers.dev';

/**
 * Returns the base URL for API calls.
 */
export function getBaseUrl(baseUrl?: string): string {
  return baseUrl || process.env.BACKEND_URL || DEFAULT_BACKEND_URL;
}

/**
 * Asserts that a response has CORS headers present.
 */
export async function expectCORSHeaders(response: Awaited<ReturnType<APIRequestContext['get']>>) {
  const headers = response.headers();
  const hasCors =
    headers['access-control-allow-origin'] !== undefined ||
    headers['access-control-allow-methods'] !== undefined;
  expect(hasCors).toBe(true);
}

/**
 * Asserts that a response was received within the expected time.
 */
export async function expectResponseTime(
  fn: () => Promise<unknown>,
  maxMs: number = 1000
): Promise<{ duration: number }> {
  const start = Date.now();
  await fn();
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(maxMs);
  return { duration };
}

/**
 * Performs a health check against the backend.
 */
export async function healthCheck(request: APIRequestContext, baseUrl?: string) {
  const url = getBaseUrl(baseUrl);
  const response = await request.get(`${url}/api/health`);
  return response;
}

/**
 * Calls the hello endpoint.
 */
export async function helloEndpoint(request: APIRequestContext, baseUrl?: string) {
  const url = getBaseUrl(baseUrl);
  const response = await request.get(`${url}/api/hello`);
  return response;
}

/**
 * Reads a value from the KV store.
 */
export async function kvGet(
  request: APIRequestContext,
  key: string,
  baseUrl?: string
) {
  const url = getBaseUrl(baseUrl);
  const response = await request.get(`${url}/api/kv/${encodeURIComponent(key)}`);
  return response;
}

/**
 * Writes a value to the KV store.
 */
export async function kvSet(
  request: APIRequestContext,
  key: string,
  value: string,
  baseUrl?: string
) {
  const url = getBaseUrl(baseUrl);
  const response = await request.post(`${url}/api/kv/${encodeURIComponent(key)}`, {
    data: { value },
  });
  return response;
}

/**
 * Measures the response time of an API call.
 */
export async function measureResponseTime(
  request: APIRequestContext,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  baseUrl?: string,
  data?: unknown
): Promise<{ response: Awaited<ReturnType<APIRequestContext['get']>>; durationMs: number }> {
  const url = getBaseUrl(baseUrl);
  const start = Date.now();

  let response;
  switch (method) {
    case 'GET':
      response = await request.get(`${url}${path}`);
      break;
    case 'POST':
      response = await request.post(`${url}${path}`, data ? { data } : undefined);
      break;
    case 'PUT':
      response = await request.put(`${url}${path}`, data ? { data } : undefined);
      break;
    case 'DELETE':
      response = await request.delete(`${url}${path}`);
      break;
  }

  const durationMs = Date.now() - start;
  return { response, durationMs };
}
