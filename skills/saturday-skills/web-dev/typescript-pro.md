# TypeScript Pro SKILL

## When to Use This Skill
Use when writing TypeScript code, configuring tsconfig, or designing type-safe APIs.

## Core Knowledge

### Strict Mode Config
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "module": "ESNext",
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Utility Types
```typescript
// Pick — Select specific properties
type UserPreview = Pick<User, "id" | "name" | "avatar">;

// Omit — Exclude specific properties
type CreateUser = Omit<User, "id" | "createdAt">;

// Partial — All properties optional
type UpdateUser = Partial<User>;

// Required — All properties required
type CompleteUser = Required<Partial<User>>;

// Record — Object with specific key/value types
type UserRoles = Record<string, "admin" | "user" | "guest">;

// ReturnType — Extract function return type
type UserResponse = ReturnType<typeof fetchUser>;

// Parameters — Extract function parameters
type CreateUserParams = Parameters<typeof createUser>;

// Awaited — Unwrap Promise type
type User = Awaited<ReturnType<typeof fetchUser>>;
```

### Discriminated Unions
```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rectangle": return shape.width * shape.height;
    case "triangle": return 0.5 * shape.base * shape.height;
  }
}
```

### Branded Types (Nominal Typing)
```typescript
type UserId = string & { readonly __brand: "UserId" };
type OrderId = string & { readonly __brand: "OrderId" };

function createUserId(id: string): UserId {
  return id as UserId;
}

// Now UserId and OrderId are not interchangeable
function getUser(id: UserId) { /* ... */ }
```

### Zod for Runtime Validation + TypeScript Inference
```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(["admin", "user", "guest"]),
  createdAt: z.date(),
});

// Infer TypeScript type from schema
type User = z.infer<typeof UserSchema>;

// Parse and validate
const result = UserSchema.safeParse(data);
if (!result.success) {
  console.error(result.error.issues);
} else {
  const user: User = result.data;
}
```

### Common Pitfalls
1. **Using `any`** — Use `unknown` instead, then narrow
2. **Type assertions (`as`)** — Avoid unless absolutely necessary
3. **Ignoring strict mode** — Always enable strict
4. **Overusing generics** — Keep generics simple and meaningful
5. **Not using `satisfies`** — Use `satisfies` to check type without widening

## Verification Checklist
- [ ] `strict: true` in tsconfig
- [ ] No `any` types in codebase
- [ ] Runtime validation with Zod for external data
- [ ] Branded types for domain IDs
- [ ] Discriminated unions for state machines
