# Saturday E2E Tests

End-to-end tests for the Saturday framework using Playwright.

## Setup

```bash
cd tests/e2e
npm install
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests
npm test

# Run with UI mode
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Run specific project
npm run test:chromium
npm run test:firefox
npm run test:mobile

# View report
npm run report
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `FRONTEND_URL` — Frontend URL (default: https://saturday-62d.pages.dev)
- `BACKEND_URL` — Backend URL (default: https://saturday.nurulhudaprince18.workers.dev)

## Test Structure

- `specs/frontend.spec.ts` — Frontend page load, UI elements, responsive, links
- `specs/backend.spec.ts` — API health, CORS, performance, KV, error handling
- `specs/security.spec.ts` — HTTPS, headers, CORS, XSS prevention

## CI/CD Integration

Tests run automatically on push via GitHub Actions. See `.github/workflows/test.yml`.
