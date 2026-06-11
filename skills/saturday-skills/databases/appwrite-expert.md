# Appwrite Expert SKILL

## When to Use This Skill
Use when you need a self-hosted BaaS with multi-language support.

## Core Knowledge

### Self-Hosted on VPS (Docker, ~300MB RAM)
```bash
docker run -it --rm \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
  --entrypoint="install" \
  appwrite/appwrite:1.6.0
```

### Collections & Documents
```typescript
import { Client, Databases, ID } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://localhost/v1")
  .setProject("my-project")
  .setKey("my-api-key");

const databases = new Databases(client);

// Create document
await databases.createDocument(
  "database-id",
  "collection-id",
  ID.unique(),
  { name: "John", email: "john@example.com" }
);

// List documents
const { documents } = await databases.listDocuments(
  "database-id",
  "collection-id",
  [Query.equal("status", "active")]
);
```

### Auth (30+ Providers)
```typescript
import { Account } from "node-appwrite";

const account = new Account(client);

// Email/password
await account.create(ID.unique(), "user@example.com", "password");

// OAuth (Google, GitHub, etc.)
await account.createOAuth2Session("google");

// Magic URL
await account.createMagicURLSession(ID.unique(), "user@example.com");
```

### Storage Buckets
```typescript
import { Storage } from "node-appwrite";

const storage = new Storage(client);

// Upload
await storage.createFile("bucket-id", ID.unique(), file);

// Get preview
const preview = storage.getFilePreview("bucket-id", "file-id");
```

### Functions (Multiple Runtimes)
```bash
# Supported: Node.js, Python, PHP, Ruby, Dart, .NET, Java, Swift, Deno, Bun
appwrite functions create \
  --functionId="hello" \
  --name="Hello World" \
  --runtime="node-18.0" \
  --execute="users"
```

### When to Use Appwrite
- Need full self-hosted BaaS
- Multi-language backend functions
- Prefer Docker-based deployment
- Need 30+ auth providers out of the box

## Common Pitfalls
1. **RAM usage** — Docker + Appwrite needs ~300MB; monitor on 842MB VPS
2. **No realtime** — Appwrite realtime is limited compared to Supabase
3. **Smaller community** — Fewer tutorials than Supabase/Firebase

## Verification Checklist
- [ ] Docker container running
- [ ] Collections created with proper permissions
- [ ] Auth flow working
- [ ] File uploads/downloads working
- [ ] Functions deployed and callable
