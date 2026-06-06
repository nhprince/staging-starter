import { Hono } from 'hono';
import { cors } from 'hono/cors';

export interface Bindings {
  DB: D1Database;
  KV: KVNamespace;
}

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['cf-ray'],
}));

// Health
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', service: 'saturday-landing', timestamp: new Date().toISOString() });
});

app.get('/api/hello', (c) => {
  return c.json({ message: 'Saturday Landing API', version: '1.0.0' });
});

// Contact form submission
app.post('/api/contact', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{ name: string; email: string; message?: string }>();

  if (!body.name || !body.email) {
    return c.json({ error: 'Name and email are required' }, 400);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.prepare('INSERT INTO submissions (id, name, email, message, source, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(id, body.name, body.email, body.message || '', 'contact', now)
    .run();

  return c.json({ success: true, message: 'Message received' }, 201);
});

// Newsletter subscribe
app.post('/api/subscribe', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{ email: string; name?: string }>();

  if (!body.email) {
    return c.json({ error: 'Email is required' }, 400);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await db.prepare('INSERT INTO subscribers (id, email, name, created_at) VALUES (?, ?, ?, ?)')
      .bind(id, body.email, body.name || '', now)
      .run();
    return c.json({ success: true, message: 'Subscribed!' }, 201);
  } catch {
    return c.json({ error: 'Already subscribed' }, 409);
  }
});

// Track page view
app.post('/api/view', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{ path: string; referrer?: string }>();

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const ua = c.req.header('user-agent') || '';

  await db.prepare('INSERT INTO page_views (id, path, referrer, user_agent, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(id, body.path || '/', body.referrer || '', ua.slice(0, 500), now)
    .run();

  return c.json({ success: true });
});

// Get submission count (admin)
app.get('/api/stats', async (c) => {
  const db = c.env.DB;
  const { total: submissions } = await db.prepare('SELECT COUNT(*) as total FROM submissions').first<{ total: number }>() || { total: 0 };
  const { total: subscribers } = await db.prepare('SELECT COUNT(*) as total FROM subscribers').first<{ total: number }>() || { total: 0 };
  const { total: views } = await db.prepare('SELECT COUNT(*) as total FROM page_views').first<{ total: number }>() || { total: 0 };

  return c.json({ submissions, subscribers, views });
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
