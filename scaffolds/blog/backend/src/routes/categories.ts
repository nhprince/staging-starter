import { Hono } from 'hono';
import type { Bindings } from '../index';

const categories = new Hono<{ Bindings: Bindings }>();

categories.get('/', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare('SELECT * FROM categories ORDER BY name').all();
  return c.json({ categories: results || [] });
});

categories.get('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const category = await db.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();
  if (!category) return c.json({ error: 'Not found' }, 404);
  return c.json(category);
});

categories.post('/', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  if (!body.name || !body.slug) return c.json({ error: 'Name and slug required' }, 400);
  const id = crypto.randomUUID();
  await db.prepare('INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)').bind(id, body.name, body.slug, body.description || '').run();
  return c.json({ id, message: 'Category created' }, 201);
});

export { categories as categoriesRouter };
