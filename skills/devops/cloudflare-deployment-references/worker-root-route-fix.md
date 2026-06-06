# Worker Root Route Fix

## Problem
Dashboard test shows "Worker Routing: Failed" / "Failed to fetch" even though Worker is deployed and `/api/health` works.

## Root Cause
Cloudflare Worker only defines routes under `/api/*`. A fetch to the bare Worker URL (`https://<worker>.<subdomain>.workers.dev/`) returns **404** because there's no `GET /` handler. The `cors()` middleware applied to `/api/*` also does NOT cover `/`.

## Fix (2 changes)

### 1. Add root route in `backend/src/index.ts`

```typescript
// Hono app setup
const app = new Hono<{ Bindings: Env }>();
app.use("/api/*", cors());

// ✅ Root route — required for health checks, dashboards, uptime monitors
app.get("/", (c) => {
  return c.json({
    service: "my-project",
    status: "running",
    version: "1.0.0",
    endpoints: ["/api/health", "/api/hello"],
    timestamp: new Date().toISOString(),
  });
});

// existing /api/* routes follow...
```

### 2. If dashboard needs CORS on root, broaden middleware

```typescript
// Instead of:
app.use("/api/*", cors());

// Use:
app.use("*", cors());   // covers all routes including /
```

Or keep `/api/*` for APIs and add a separate entry:
```typescript
app.use("/api/*", cors());
// root route doesn't need CORS if same-origin, but cross-origin dashboards do
```

## Verification

```bash
# Before fix:
curl -s -o /dev/null -w "%{http_code}" https://<worker>.<subdomain>.workers.dev/
# → 404

# After fix:
curl -s https://<worker>.<subdomain>.workers.dev/
# → {"service":"my-project","status":"running",...}
```

## Git commit used in saturday
```
fddaa84 fix: add root route to Worker + improve dashboard routing test
```
