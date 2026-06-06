import { Hono } from 'hono';
import type { Bindings } from '../index';

const posts = new Hono<{ Bindings: Bindings }>();

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
  author_id: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// List published posts
posts.get('/', async (c) => {
  const db = c.env.DB;
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const offset = (page - 1) * limit;

  const { results } = await db
    .prepare('SELECT * FROM posts WHERE published = 1 ORDER BY published_at DESC LIMIT ? OFFSET ?')
    .bind(limit, offset)
    .all<Post>();

  const { total } = await db
    .prepare('SELECT COUNT(*) as total FROM posts WHERE published = 1')
    .first<{ total: number }>();

  return c.json({
    posts: results || [],
    pagination: { page, limit, total: total || 0, pages: Math.ceil((total || 0) / limit) },
  });
});

// Get single post by slug
posts.get('/:slug', async (c) => {
  const db = c.env.DB;
  const slug = c.req.param('slug');

  const post = await db
    .prepare('SELECT * FROM posts WHERE slug = ?')
    .bind(slug)
    .first<Post>();

  if (!post) {
    return c.json({ error: 'Post not found' }, 404);
  }

  // Get tags
  const { results: tags } = await db
    .prepare('SELECT t.* FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?')
    .bind(post.id)
    .all();

  // Get categories
  const { results: categories } = await db
    .prepare('SELECT c.* FROM categories c JOIN post_categories pc ON c.id = pc.category_id WHERE pc.post_id = ?')
    .bind(post.id)
    .all();

  return c.json({ ...post, tags: tags || [], categories: categories || [] });
});

// Create post
posts.post('/', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json<Partial<Post>>();

  if (!body.title || !body.slug) {
    return c.json({ error: 'Title and slug are required' }, 400);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db
    .prepare(`INSERT INTO posts (id, slug, title, excerpt, content, cover_image, published, author_id, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, body.slug, body.title, body.excerpt || '', body.content || '', body.cover_image || '', body.published ? 1 : 0, body.author_id || '', body.published ? now : '', now, now)
    .run();

  return c.json({ id, message: 'Post created' }, 201);
});

// Update post
posts.put('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const body = await c.req.json<Partial<Post>>();

  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (body.title) { fields.push('title = ?'); values.push(body.title); }
  if (body.slug) { fields.push('slug = ?'); values.push(body.slug); }
  if (body.excerpt !== undefined) { fields.push('excerpt = ?'); values.push(body.excerpt); }
  if (body.content !== undefined) { fields.push('content = ?'); values.push(body.content); }
  if (body.cover_image !== undefined) { fields.push('cover_image = ?'); values.push(body.cover_image); }
  if (body.published !== undefined) { fields.push('published = ?'); values.push(body.published ? 1 : 0); }
  if (body.published) { fields.push('published_at = ?'); values.push(now); }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  await db.prepare(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();

  return c.json({ message: 'Post updated' });
});

// Delete post
posts.delete('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
  return c.json({ message: 'Post deleted' });
});

export { posts as postsRouter };
