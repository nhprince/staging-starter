const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface Post {
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
  tags?: { id: string; name: string; slug: string }[];
  categories?: { id: string; name: string; slug: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function getPosts(page = 1, limit = 12): Promise<Post[]> {
  try {
    const result = await fetchApi<{ posts: Post[]; pagination: any }>(
      `/api/posts?page=${page}&limit=${limit}`
    );
    return result.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    return await fetchApi<Post>(`/api/posts/${slug}`);
  } catch (error) {
    console.error(`Error fetching post "${slug}":`, error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const result = await fetchApi<{ categories: Category[] }>("/api/categories");
    return result.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const result = await fetchApi<{ tags: Tag[] }>("/api/tags");
    return result.tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}
