import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { postsRouter } from './routes/posts';
import { categoriesRouter } from './routes/categories';
import { tagsRouter } from './routes/tags';

export interface Bindings {
  DB: D1Database;
  KV: KVNamespace;
}

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['cf-ray'],
}));

// Health
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', service: 'saturday-blog', timestamp: new Date().toISOString() });
});

app.get('/api/hello', (c) => {
  return c.json({ message: 'Saturday Blog API', version: '1.0.0' });
});

// Routes
app.route('/api/posts', postsRouter);
app.route('/api/categories', categoriesRouter);
app.route('/api/tags', tagsRouter);

// 404
app.notFound((c) => c.json({ error: 'Not found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
