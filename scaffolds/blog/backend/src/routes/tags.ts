import { Hono } from 'hono';
import type { Bindings } from '../index';

const tags = new Hono<{ Bindings: Bindings }>();

tags.get('/', async (c) => {
  const db = c.env.DB;
  const { results } = await db.prepare('SELECT * FROM tags ORDER BY name').all();
  return c.json({ tags: results || [] });
});

tags.get('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const tag = await db.prepare('SELECT * FROM tags WHERE id = ?').bind(id).first();
  if (!tag) return c.json({ error: 'Not found' }, 404);
  return c.json(tag);
});

tags.post('/', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  if (!body.name || !body.slug) return c.json({ error: 'Name and slug required' }, 400);
  const id = crypto.randomUUID();
  await db.prepare('INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)').bind(id, body.name, body.slug).run();
  return c.json({ id, message: 'Tag created' }, 201);
});

export { tags as tagsRouter };
