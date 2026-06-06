import { Hono } from 'hono';
import { cors } from 'hono/cors';

export interface Bindings {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  exposeHeaders: ['cf-ray'],
}));

app.get('/api/health', (c) => c.json({ status: 'ok', service: 'saturday-portfolio', timestamp: new Date().toISOString() }));
app.get('/api/hello', (c) => c.json({ message: 'Saturday Portfolio API', version: '1.0.0' }));

// Get all projects
app.get('/api/projects', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare('SELECT * FROM projects ORDER BY sort_order, created_at DESC').all();
  return c.json({ projects: results || [] });
});

// Get featured projects
app.get('/api/projects/featured', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare('SELECT * FROM projects WHERE featured = 1 ORDER BY sort_order').all();
  return c.json({ projects: results || [] });
});

// Get single project
app.get('/api/projects/:slug', async (c) => {
  const db = c.env.DB;
  const slug = c.req.param('slug');
  const project = await db.prepare('SELECT * FROM projects WHERE slug = ?').bind(slug).first();
  if (!project) return c.json({ error: 'Not found' }, 404);
  return c.json(project);
});

// Get experience
app.get('/api/experience', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare('SELECT * FROM experience ORDER BY sort_order, start_date DESC').all();
  return c.json({ experience: results || [] });
});

// Get skills
app.get('/api/skills', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare('SELECT * FROM skills ORDER BY sort_order, level DESC').all();
  return c.json({ skills: results || [] });
});

// Submit contact
app.post('/api/contact', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<{ name: string; email: string; subject?: string; message: string }>();
  if (!body.name || !body.email || !body.message) {
    return c.json({ error: 'Name, email, and message are required' }, 400);
  }
  const id = crypto.randomUUID();
  await db.prepare('INSERT INTO messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)')
    .bind(id, body.name, body.email, body.subject || '', body.message)
    .run();
  return c.json({ success: true, message: 'Message sent' }, 201);
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) => { console.error(err); return c.json({ error: 'Internal error' }, 500); });

export default app;
