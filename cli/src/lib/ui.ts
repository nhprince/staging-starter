/**
 * Saturday UI Library — 21st.dev Component Integration
 * 
 * Handles:
 * - Component cache management (offline metadata)
 * - Search and filtering
 * - Install/remove components
 * - MCP server configuration for agent integration
 * - Curated registry + full 21st.dev catalog
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync, statSync } from "fs";
import { join, basename, dirname } from "path";
import { homedir } from "os";
import { execSync } from "child_process";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UiComponent {
  id: string;
  name: string;
  slug: string;
  description: string;
  author: string;
  author_username: string;
  downloads: number;
  likes: number;
  tags: string[];
  categories: string[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  license: string;
  source: "curated" | "21st.dev";
  code_url: string;
  demo_url: string;
  preview_url: string;
  tailwind_config_url: string | null;
  global_css_url: string | null;
  version: string;
  created_at: string;
  updated_at: string;
}

export interface UiCache {
  version: string;
  last_synced: string;
  source: "curated" | "full";
  components: UiComponent[];
  categories: Record<string, number>;
}

export interface InstalledComponent {
  name: string;
  slug: string;
  version: string;
  installed_at: string;
  source: string;
  files: string[];
}

// ─── Paths ───────────────────────────────────────────────────────────────────

const SATURDAY_HOME = join(homedir(), ".saturday");
const UI_CACHE_DIR = join(SATURDAY_HOME, "ui-cache");
const UI_CACHE_FILE = join(UI_CACHE_DIR, "components.json");
const UI_INSTALLED_FILE = join(UI_CACHE_DIR, "installed.json");
const UI_MCP_CONFIG = join(SATURDAY_HOME, "mcp-config.json");
const CURATED_REGISTRY = join(__dirname, "..", "..", "ui", "registry.json");

// ─── Cache Management ────────────────────────────────────────────────────────

export function ensureUiDirs(): void {
  if (!existsSync(SATURDAY_HOME)) {
    mkdirSync(SATURDAY_HOME, { recursive: true });
  }
  if (!existsSync(UI_CACHE_DIR)) {
    mkdirSync(UI_CACHE_DIR, { recursive: true });
  }
}

export async function getUiCache(): Promise<UiCache | null> {
  ensureUiDirs();
  if (!existsSync(UI_CACHE_FILE)) {
    // Return embedded curated registry as initial cache
    return getCuratedRegistry();
  }
  try {
    const raw = readFileSync(UI_CACHE_FILE, "utf-8");
    return JSON.parse(raw) as UiCache;
  } catch {
    return getCuratedRegistry();
  }
}

export async function saveUiCache(cache: UiCache): Promise<void> {
  ensureUiDirs();
  writeFileSync(UI_CACHE_FILE, JSON.stringify(cache, null, 2));
}

export async function syncUiCache(source: "curated" | "full" = "curated"): Promise<{ count: number; cachePath: string }> {
  ensureUiDirs();

  let components: UiComponent[];

  if (source === "curated") {
    const registry = getCuratedRegistry();
    components = registry.components;
  } else {
    // Full sync from 21st.dev — fetch from their CDN/API
    components = await fetchAll21stComponents();
  }

  const categories: Record<string, number> = {};
  components.forEach((c) => {
    (c.tags || []).forEach((tag) => {
      categories[tag] = (categories[tag] || 0) + 1;
    });
  });

  const cache: UiCache = {
    version: "1.0.0",
    last_synced: new Date().toISOString(),
    source,
    components,
    categories,
  };

  await saveUiCache(cache);
  return { count: components.length, cachePath: UI_CACHE_FILE };
}

function getCuratedRegistry(): UiCache {
  // Read from the registry.json file (single source of truth)
  try {
    const registryPath = join(__dirname, "..", "..", "..", "ui", "registry.json");
    if (existsSync(registryPath)) {
      const raw = readFileSync(registryPath, "utf-8");
      const registry = JSON.parse(raw);
      const components: UiComponent[] = registry.components.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        author: c.author,
        author_username: c.author_username,
        downloads: 0,
        likes: 0,
        tags: c.tags || [],
        categories: [],
        dependencies: c.dependencies || {},
        devDependencies: {},
        license: c.license || "MIT",
        source: c.source || "curated",
        code_url: `https://raw.githubusercontent.com/nhprince/saturday/main/ui/components/${c.file}`,
        demo_url: "",
        preview_url: "",
        tailwind_config_url: null,
        global_css_url: null,
        version: "1.0.0",
        created_at: registry.last_updated || new Date().toISOString(),
        updated_at: registry.last_updated || new Date().toISOString(),
      }));

      const categories: Record<string, number> = {};
      components.forEach((c: UiComponent) => {
        (c.tags || []).forEach((tag) => {
          categories[tag] = (categories[tag] || 0) + 1;
        });
      });

      return {
        version: registry.version || "1.0.0",
        last_synced: new Date().toISOString(),
        source: "curated",
        components,
        categories,
      };
    }
  } catch {
    // Fall through to empty
  }

  return {
    version: "1.0.0",
    last_synced: new Date().toISOString(),
    source: "curated",
    components: [],
    categories: {},
  };
}

async function fetchAll21stComponents(): Promise<UiComponent[]> {
  // Start with curated as base
  const curated = getCuratedRegistry();
  const components = [...curated.components];

  try {
    // Fetch from 21st.dev's public component pages
    // Their components are accessible via CDN URLs
    const response = await fetch("https://21st.dev/api/components?limit=100&sort=popular", {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const data = await response.json() as any;
      const fetched = (data.components || data || []).map(map21stComponent);
      // Merge, avoiding duplicates by slug
      const existingSlugs = new Set(components.map((c) => c.slug));
      fetched.forEach((c: UiComponent) => {
        if (!existingSlugs.has(c.slug)) {
          components.push(c);
        }
      });
    }
  } catch {
    // If API fails, return curated only
  }

  return components;
}

function map21stComponent(raw: any): UiComponent {
  return {
    id: raw.id?.toString() || `21st-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: raw.name || raw.component_names?.[0] || "Unknown",
    slug: raw.component_slug || raw.slug || "",
    description: raw.description || "",
    author: raw.user?.name || raw.user?.username || "Community",
    author_username: raw.user?.username || "",
    downloads: raw.downloads_count || 0,
    likes: raw.likes_count || 0,
    tags: raw.tags?.map((t: any) => t.name || t) || [],
    categories: [],
    dependencies: raw.dependencies || {},
    devDependencies: raw.demo_dependencies || {},
    license: raw.license || "MIT",
    source: "21st.dev" as const,
    code_url: raw.code || "",
    demo_url: raw.demo_code || "",
    preview_url: raw.preview_url || "",
    tailwind_config_url: raw.tailwind_config_extension || null,
    global_css_url: raw.global_css_extension || null,
    version: "1.0.0",
    created_at: raw.created_at || new Date().toISOString(),
    updated_at: raw.updated_at || new Date().toISOString(),
  };
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchUiComponents(
  query: string,
  options?: { source?: string; category?: string; limit?: string }
): Promise<UiComponent[]> {
  const cache = await getUiCache();
  if (!cache) return [];

  let results = cache.components;

  // Filter by source
  if (options?.source === "curated") {
    results = results.filter((c) => c.source === "curated");
  }

  // Filter by category/tag
  if (options?.category) {
    const cat = options.category.toLowerCase();
    results = results.filter((c) =>
      (c.tags || []).some((t) => t.toLowerCase().includes(cat)) ||
      (c.categories || []).some((c2) => c2.toLowerCase().includes(cat))
    );
  }

  // Search by query
  if (query) {
    const q = query.toLowerCase();
    results = results.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.tags || []).some((t) => t.toLowerCase().includes(q)) ||
      c.author.toLowerCase().includes(q)
    );
  }

  // Sort by downloads (popularity)
  results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));

  // Limit
  const limit = parseInt(options?.limit || "20", 10);
  return results.slice(0, limit);
}

// ─── Get Single Component ───────────────────────────────────────────────────

export async function getUiComponent(
  nameOrSlug: string,
  options?: { source?: string }
): Promise<UiComponent | null> {
  const cache = await getUiCache();
  if (!cache) return null;

  const q = nameOrSlug.toLowerCase();
  return cache.components.find(
    (c) => c.slug === q || c.name.toLowerCase() === q || c.id === q
  ) || null;
}

// ─── Install Component ──────────────────────────────────────────────────────

export async function installUiComponent(comp: UiComponent, targetDir?: string): Promise<void> {
  const projectRoot = targetDir || process.cwd();
  const componentsDir = join(projectRoot, "src", "components", "ui");

  if (!existsSync(componentsDir)) {
    mkdirSync(componentsDir, { recursive: true });
  }

  // Check if already installed
  const installed = await listInstalledUiComponents(projectRoot);
  if (installed.some((c) => c.slug === comp.slug)) {
    throw new Error(`Component already installed: ${comp.name}. Use 'saturday ui remove ${comp.slug}' first.`);
  }

  // Get component code — from local template, URL, or generated stub
  let code = "";

  // 1. Try local template file (for curated components)
  // The registry "file" field is like "ui/components/HeroGradient.tsx"
  // We resolve relative to the repo root (2 levels up from cli/src/lib/)
  const repoRoot = join(__dirname, "..", "..", "..");
  const templateFromRegistry = comp.id ? join(repoRoot, "ui", "components", getComponentFileName(comp.id)) : null;

  if (templateFromRegistry && existsSync(templateFromRegistry)) {
    code = readFileSync(templateFromRegistry, "utf-8");
  } else if (comp.code_url && comp.code_url.startsWith("http")) {
    // 2. Try downloading from URL (for 21st.dev components)
    try {
      const response = await fetch(comp.code_url, { signal: AbortSignal.timeout(15000) });
      if (response.ok) {
        code = await response.text();
      }
    } catch {
      code = generateComponentTemplate(comp);
    }
  } else {
    // 3. Generate stub
    code = generateComponentTemplate(comp);
  }

  // Write component file — use PascalCase name for the file
  const fileName = getComponentFileName(comp.id);
  writeFileSync(join(componentsDir, fileName), code);

  // Download tailwind config extension if available
  if (comp.tailwind_config_url) {
    try {
      const twResponse = await fetch(comp.tailwind_config_url, { signal: AbortSignal.timeout(10000) });
      if (twResponse.ok) {
        const twConfig = await twResponse.text();
        writeFileSync(join(componentsDir, `${comp.slug}.tailwind.config.js`), twConfig);
      }
    } catch { /* ignore */ }
  }

  // Download global CSS extension if available
  if (comp.global_css_url) {
    try {
      const cssResponse = await fetch(comp.global_css_url, { signal: AbortSignal.timeout(10000) });
      if (cssResponse.ok) {
        const css = await cssResponse.text();
        writeFileSync(join(componentsDir, `${comp.slug}.css`), css);
      }
    } catch { /* ignore */ }
  }

  // Update installed list — write to project-local file
  const installedComp: InstalledComponent = {
    name: comp.name,
    slug: comp.slug,
    version: comp.version,
    installed_at: new Date().toISOString(),
    source: comp.source,
    files: [fileName],
  };

  const installedList = await listInstalledUiComponents(projectRoot);
  installedList.push(installedComp);
  const projectInstalledFile = join(componentsDir, ".installed.json");
  writeFileSync(projectInstalledFile, JSON.stringify(installedList, null, 2));

  // Write component metadata for agent reference
  writeFileSync(
    join(componentsDir, `${comp.slug}.meta.json`),
    JSON.stringify(comp, null, 2)
  );
}

function getComponentFileName(id: string): string {
  // Map component IDs to their PascalCase file names
  const nameMap: Record<string, string> = {
    "hero-01": "HeroGradient.tsx",
    "hero-02": "HeroMinimal.tsx",
    "features-01": "FeaturesGrid.tsx",
    "navbar-01": "NavbarGlass.tsx",
    "footer-01": "FooterModern.tsx",
    "testimonials-01": "TestimonialsCarousel.tsx",
    "pricing-01": "PricingCards.tsx",
    "cta-01": "CtaBold.tsx",
    "auth-01": "AuthForms.tsx",
  };
  return nameMap[id] || `${id}.tsx`;
}

function generateComponentTemplate(comp: UiComponent): string {
  // Generate a basic component template when code can't be fetched
  const componentName = comp.name
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  return `/**
 * ${comp.name}
 * ${comp.description}
 * 
 * Source: ${comp.source}
 * Author: ${comp.author} (@${comp.author_username})
 * Tags: ${comp.tags.join(", ")}
 * Dependencies: ${Object.entries(comp.dependencies).map(([k, v]) => `${k}@${v}`).join(", ")}
 * 
 * Installed via Saturday Framework — 21st.dev Integration
 */

import React from "react";

interface ${componentName}Props {
  className?: string;
}

export default function ${componentName}({ className = "" }: ${componentName}Props) {
  return (
    <div className={\`${comp.slug} \${className}\`}>
      {/* TODO: Implement ${comp.name} */}
      <p>Component: ${comp.name}</p>
      <p>Source: ${comp.source}</p>
    </div>
  );
}
`;
}

// ─── Remove Component ───────────────────────────────────────────────────────

export async function removeUiComponent(slug: string, targetDir?: string): Promise<boolean> {
  const projectRoot = targetDir || process.cwd();
  const componentsDir = join(projectRoot, "src", "components", "ui");
  const projectInstalledFile = join(componentsDir, ".installed.json");

  const installed = await listInstalledUiComponents(projectRoot);
  const idx = installed.findIndex((c) => c.slug === slug);
  if (idx === -1) return false;

  const comp = installed[idx];

  // Remove files
  comp.files.forEach((file) => {
    const filePath = join(componentsDir, file);
    if (existsSync(filePath)) {
      rmSync(filePath);
    }
    // Also remove meta and css files — try both PascalCase and kebab-case
    const baseName = file.replace(".tsx", "");
    const slugName = comp.slug;
    for (const name of [baseName, slugName]) {
      const metaFile = join(componentsDir, `${name}.meta.json`);
      const cssFile = join(componentsDir, `${name}.css`);
      const twFile = join(componentsDir, `${name}.tailwind.config.js`);
      if (existsSync(metaFile)) rmSync(metaFile);
      if (existsSync(cssFile)) rmSync(cssFile);
      if (existsSync(twFile)) rmSync(twFile);
    }
  });

  // Update installed list
  installed.splice(idx, 1);
  writeFileSync(projectInstalledFile, JSON.stringify(installed, null, 2));

  return true;
}

// ─── List Installed ──────────────────────────────────────────────────────────

export async function listInstalledUiComponents(targetDir?: string): Promise<InstalledComponent[]> {
  const projectRoot = targetDir || process.cwd();
  // Project-local installed list takes priority
  const projectInstalledFile = join(projectRoot, "src", "components", "ui", ".installed.json");
  const globalInstalledFile = join(projectRoot, ".saturday", "ui-installed.json");

  for (const file of [projectInstalledFile, globalInstalledFile]) {
    if (existsSync(file)) {
      try {
        return JSON.parse(readFileSync(file, "utf-8"));
      } catch { /* ignore */ }
    }
  }

  return [];
}

// ─── MCP Configuration ──────────────────────────────────────────────────────

export function getMcpConfig(): Record<string, any> {
  if (existsSync(UI_MCP_CONFIG)) {
    try {
      return JSON.parse(readFileSync(UI_MCP_CONFIG, "utf-8"));
    } catch { /* ignore */ }
  }
  return {};
}

export function saveMcpConfig(config: Record<string, any>): void {
  ensureUiDirs();
  writeFileSync(UI_MCP_CONFIG, JSON.stringify(config, null, 2));
}

export function setupMcpServer(): void {
  ensureUiDirs();
  const config = {
    mcpServers: {
      "@21st-dev/magic": {
        command: "npx",
        args: ["-y", "@21st-dev/magic@latest"],
        description: "21st.dev Magic MCP — Browse and install UI components",
      },
    },
  };
  saveMcpConfig(config);
}

// ─── Agent Instructions ─────────────────────────────────────────────────────

export function getAgentInstructions(): string {
  return `
## 21st.dev UI Component Integration

Saturday Framework integrates with 21st.dev — a community-driven React/Tailwind component marketplace.
Use this to find and install high-quality UI components for any project.

### Available Commands
- \`saturday ui browse\` — Interactive component browser
- \`saturday ui search <query>\` — Search components
- \`saturday ui add <slug>\` — Install a component
- \`saturday ui list\` — List installed components
- \`saturday ui remove <slug>\` — Remove a component
- \`saturday ui sync\` — Sync component cache
- \`saturday ui categories\` — List categories
- \`saturday ui info <slug>\` — Component details

### Component Sources
- **curated** (default): Hand-picked, high-quality components tested with Saturday
- **all**: Full 21st.dev library — thousands of community components

### Workflow for Building UIs
1. Run \`saturday ui sync\` to cache component metadata
2. Use \`saturday ui search <query>\` to find components
3. Use \`saturday ui info <slug>\` to review details
4. Use \`saturday ui add <slug>\` to install
5. Components are installed to \`src/components/ui/\`
6. Each component includes a \`.meta.json\` with full metadata

### Component Metadata
Each installed component has a \`.meta.json\` file containing:
- name, description, author, tags
- dependencies (auto-detected)
- code_url, demo_url, preview_url
- tailwind_config_url, global_css_url

### MCP Server
21st.dev provides an MCP server for agent-native component browsing:
- Config: ~/.saturday/mcp-config.json
- Server: @21st-dev/magic
- Use \`npx @21st-dev/magic\` to start

### Design Philosophy
Saturday is design-agnostic. Components from 21st.dev can be:
- Used as-is for rapid prototyping
- Modified to match any design system
- Combined to create unique layouts
- Used as reference/inspiration for custom builds

### Scaffold Integration
When creating new projects (\`saturday new\`), users can opt-in to install
recommended 21st.dev components for their project type:
- Landing: hero, features, testimonials, cta, footer
- SaaS: hero, features, pricing, auth-forms, navbar
- Portfolio: hero, navbar, footer, cta
- Blog: navbar, footer, auth-forms
- E-commerce: hero, features, pricing, auth-forms, navbar, footer
`;
}
