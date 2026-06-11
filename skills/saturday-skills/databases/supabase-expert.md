# Supabase Expert SKILL

## When to Use This Skill
Use when building applications with Supabase as the backend (PostgreSQL + Auth + Storage + Realtime).

## Core Knowledge

### Free Tier Limits
- 500MB Postgres database
- 1GB file storage
- 50k monthly active users (auth)
- 2GB bandwidth
- 500k Edge Function invocations/month

### Row Level Security (RLS) Policies
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Realtime Subscriptions
```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Subscribe to changes
const channel = supabase
  .channel("orders")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "orders",
  }, (payload) => {
    console.log("Change:", payload);
  })
  .subscribe();
```

### Edge Functions (Deno)
```typescript
// supabase/functions/hello/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { name } = await req.json();
  return new Response(JSON.stringify({ message: `Hello ${name}!` }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### pgvector for AI/Embeddings
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table with embedding column
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT,
  embedding vector(1536)  -- OpenAI embedding size
);

-- Similarity search
SELECT * FROM documents
ORDER BY embedding <=> $1  -- <=> is cosine distance
LIMIT 5;
```

### Supabase JS Client Patterns
```typescript
// Query builder
const { data, error } = await supabase
  .from("products")
  .select("id, name, price, categories(name)")
  .eq("status", "active")
  .order("created_at", { ascending: false })
  .range(0, 11);  // Pagination

// Auth
const { data, error } = await supabase.auth.signUp({
  email, password,
});

// Storage
const { data, error } = await supabase.storage
  .from("avatars")
  .upload(`${userId}/avatar.png`, file);
```

### Supabase vs D1 Decision Tree
```
Need full SQL (JOINs, triggers, views)?
├── Yes → Supabase (PostgreSQL)
└── No → Need edge performance?
    ├── Yes → Cloudflare D1 (SQLite at edge)
    └── No → Either works; D1 is simpler

Need AI/vector search?
├── Yes → Supabase (pgvector)
└── No → Either works

Need realtime subscriptions?
├── Yes → Supabase Realtime
└── No → Either works
```

## Common Pitfalls
1. **Not enabling RLS** — Data is public by default!
2. **N+1 queries** — Use `.select()` with joins instead of multiple queries
3. **Not using indexes** — Add indexes for frequently queried columns
4. **Ignoring free tier limits** — Monitor usage in Supabase dashboard

## Verification Checklist
- [ ] RLS enabled on all tables with policies
- [ ] Realtime subscriptions working
- [ ] Auth flow complete (sign up, login, logout)
- [ ] Storage uploads working
- [ ] Edge functions deployed
