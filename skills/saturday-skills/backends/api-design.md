# API Design SKILL

## When to Use This Skill
Use when designing REST APIs, defining endpoints, or documenting with OpenAPI.

## Core Knowledge

### REST Naming Conventions
```
GET    /api/v1/products          # List all
GET    /api/v1/products/:id      # Get one
POST   /api/v1/products          # Create
PUT    /api/v1/products/:id      # Full update
PATCH  /api/v1/products/:id      # Partial update
DELETE /api/v1/products/:id      # Delete

# Nested resources
GET    /api/v1/products/:id/reviews
POST   /api/v1/products/:id/reviews

# Actions
POST   /api/v1/orders/:id/cancel
POST   /api/v1/auth/login
```

### Error Response Schema
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Must be a valid email" }
    ]
  }
}
```

### Pagination Patterns
```typescript
// Cursor-based (preferred for large datasets)
interface CursorPagination {
  data: Item[];
  next_cursor: string | null;
  has_more: boolean;
}

// Offset-based (simpler)
interface OffsetPagination {
  data: Item[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
```

### OpenAPI/Swagger Auto-Generation
```typescript
// With Hono + @hono/zod-openapi
import { createRoute } from "@hono/zod-openapi";

const route = createRoute({
  method: "get",
  path: "/api/v1/products",
  responses: {
    200: {
      content: { "application/json": { schema: ProductArraySchema } },
      description: "List of products",
    },
  },
});
```

## Common Pitfalls
1. **Inconsistent naming** — Stick to plural nouns for resources
2. **Missing error schemas** — Document all error responses
3. **No versioning** — Always use /api/v1/ prefix
4. **Over-fetching** — Allow field selection via query params

## Verification Checklist
- [ ] All endpoints follow REST conventions
- [ ] Error responses have consistent schema
- [ ] Pagination implemented for list endpoints
- [ ] OpenAPI spec generated and valid
