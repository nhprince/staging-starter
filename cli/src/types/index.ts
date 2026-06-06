/**
 * Shared types for Saturday CLI
 */

export interface SaturdayConfig {
  name: string;
  type: ProjectType;
  created: string;
  stack: {
    frontend: FrontendType;
    backend: BackendType;
    database: DatabaseType;
    auth: AuthType;
  };
  cloudflare: {
    account_id: string;
    pages: {
      project: string;
      url: string;
    };
    worker: {
      name: string;
      url: string;
    };
    d1: {
      database_id: string;
      database_name: string;
    };
    kv: {
      namespace_id: string;
    };
  };
  github: {
    repo: string;
    branch: string;
  };
  secrets: string[];
  modules: ModuleType[];
  environments: Record<string, {
    frontend_url: string;
    backend_url: string;
  }>;
}

export type ProjectType = "blog" | "landing" | "saas" | "portfolio" | "api" | "ecommerce";
export type FrontendType = "nextjs" | "astro" | "sveltekit" | "static-html";
export type BackendType = "hono-workers" | "python-vps" | "php-vps";
export type DatabaseType = "d1" | "postgres-vps" | "supabase" | "planetscale";
export type AuthType = "none" | "clerk" | "authjs" | "lucia";
export type ModuleType = "cms" | "comments" | "payments-stripe" | "email" | "file-upload" | "analytics";

export const PROJECT_TYPES: ProjectType[] = ["blog", "landing", "saas", "portfolio", "api", "ecommerce"];
export const FRONTEND_TYPES: FrontendType[] = ["nextjs", "astro", "sveltekit", "static-html"];
export const BACKEND_TYPES: BackendType[] = ["hono-workers", "python-vps", "php-vps"];
export const DATABASE_TYPES: DatabaseType[] = ["d1", "postgres-vps", "supabase", "planetscale"];
export const AUTH_TYPES: AuthType[] = ["none", "clerk", "authjs", "lucia"];
export const MODULE_TYPES: ModuleType[] = ["cms", "comments", "payments-stripe", "email", "file-upload", "analytics"];

export const DEFAULTS: Record<ProjectType, { frontend: FrontendType; backend: BackendType; database: DatabaseType; auth: AuthType }> = {
  blog:      { frontend: "nextjs", backend: "hono-workers", database: "d1", auth: "clerk" },
  landing:   { frontend: "nextjs", backend: "hono-workers", database: "d1", auth: "none" },
  saas:      { frontend: "nextjs", backend: "hono-workers", database: "d1", auth: "clerk" },
  portfolio: { frontend: "nextjs", backend: "hono-workers", database: "d1", auth: "none" },
  api:       { frontend: "nextjs", backend: "hono-workers", database: "d1", auth: "none" },
  ecommerce: { frontend: "nextjs", backend: "hono-workers", database: "d1", auth: "clerk" },
};

export const MODULE_DEFAULTS: Record<ProjectType, ModuleType[]> = {
  blog:      ["cms", "email"],
  landing:   ["email"],
  saas:      ["payments-stripe", "email", "analytics"],
  portfolio: ["email"],
  api:       ["email"],
  ecommerce: ["payments-stripe", "email", "file-upload"],
};
