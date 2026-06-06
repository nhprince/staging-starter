/**
 * Configuration validation for saturday.yaml
 */

import type { SaturdayConfig } from "../types/index.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateConfig(config: SaturdayConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!config.name) errors.push("name is required");
  if (!config.type) errors.push("type is required");
  if (!config.stack) errors.push("stack is required");

  // Stack validation
  if (config.stack) {
    const validFrontends = ["nextjs", "astro", "sveltekit", "static-html"];
    const validBackends = ["hono-workers", "python-vps", "php-vps"];
    const validDbs = ["d1", "postgres-vps", "supabase", "planetscale"];
    const validAuths = ["none", "clerk", "authjs", "lucia"];

    if (!validFrontends.includes(config.stack.frontend)) {
      errors.push(`Invalid frontend: ${config.stack.frontend}`);
    }
    if (!validBackends.includes(config.stack.backend)) {
      errors.push(`Invalid backend: ${config.stack.backend}`);
    }
    if (!validDbs.includes(config.stack.database)) {
      errors.push(`Invalid database: ${config.stack.database}`);
    }
    if (!validAuths.includes(config.stack.auth)) {
      errors.push(`Invalid auth: ${config.stack.auth}`);
    }
  }

  // Cloudflare validation
  if (config.cloudflare) {
    if (!config.cloudflare.account_id) {
      warnings.push("cloudflare.account_id is empty — set it with: saturday config set cloudflare.account_id <id>");
    }
    if (config.cloudflare.d1?.database_id === "YOUR_D1_DATABASE_ID") {
      warnings.push("D1 database ID not set — run: saturday setup");
    }
    if (config.cloudflare.kv?.namespace_id === "YOUR_KV_NAMESPACE_ID") {
      warnings.push("KV namespace ID not set — run: saturday setup");
    }
  } else {
    warnings.push("cloudflare section is missing");
  }

  // GitHub validation
  if (!config.github?.repo) {
    warnings.push("github.repo is not set");
  }

  // Secrets check
  if (config.stack?.auth && config.stack.auth !== "none") {
    if (!config.secrets || config.secrets.length === 0) {
      warnings.push(`Auth provider '${config.stack.auth}' requires secrets — run: saturday secrets list`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
