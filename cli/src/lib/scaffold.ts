/**
 * Project scaffolding logic — copies from framework scaffolds/blueprints
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, cpSync } from "fs";
import { join, resolve } from "path";
import { success, warn, info, error, readConfig, writeConfig, PROJECTS_DIR } from "./utils.js";
import type { ProjectType, FrontendType, BackendType, DatabaseType, AuthType, ModuleType, SaturdayConfig } from "../types/index.js";

const FRAMEWORK_DIR = resolve(__dirname, "..", "..", "..");

interface ScaffoldOptions {
  type: ProjectType;
  name: string;
  frontend: FrontendType;
  backend: BackendType;
  db: DatabaseType;
  auth: AuthType;
  modules: ModuleType[];
}

export async function scaffoldProject(opts: ScaffoldOptions): Promise<void> {
  const projectDir = join(PROJECTS_DIR, opts.name);
  mkdirSync(projectDir, { recursive: true });

  const replacements = {
    "{{PROJECT_NAME}}": opts.name,
    "{{PROJECT_TYPE}}": opts.type,
    "{{FRONTEND}}": opts.frontend,
    "{{BACKEND}}": opts.backend,
    "{{DATABASE}}": opts.db,
    "{{AUTH}}": opts.auth,
    "{{DATE}}": new Date().toISOString().split("T")[0],
  };

  // 1. Copy scaffold (if exists)
  const scaffoldSrc = join(FRAMEWORK_DIR, "scaffolds", opts.type);
  if (existsSync(scaffoldSrc)) {
    info(`  📦 Copying scaffold: ${opts.type}`);
    copyDir(scaffoldSrc, projectDir, replacements);
  } else {
    warn(`  Scaffold not found: ${opts.type} (creating basic structure)`);
  }

  // 2. Copy frontend blueprint (if exists)
  const frontendSrc = join(FRAMEWORK_DIR, "frontends", opts.frontend);
  if (existsSync(frontendSrc)) {
    info(`  🎨 Copying frontend: ${opts.frontend}`);
    const frontendDest = join(projectDir, "frontend");
    copyDir(frontendSrc, frontendDest, replacements);
  }

  // 3. Copy backend blueprint (if exists)
  const backendSrc = join(FRAMEWORK_DIR, "backends", opts.backend);
  if (existsSync(backendSrc)) {
    info(`  ⚙️  Copying backend: ${opts.backend}`);
    const backendDest = join(projectDir, "backend");
    copyDir(backendSrc, backendDest, replacements);
  }

  // 4. Copy database schema
  const dbSchemaSrc = join(FRAMEWORK_DIR, "databases", opts.db, "schema.sql");
  if (existsSync(dbSchemaSrc)) {
    info(`  🗄️  Copying database schema: ${opts.db}`);
    const dbDest = join(projectDir, "database");
    mkdirSync(dbDest, { recursive: true });
    writeFileSync(join(dbDest, "schema.sql"), replaceVars(readFileSync(dbSchemaSrc, "utf-8"), replacements));
  }

  // 5. Copy auth module
  if (opts.auth !== "none") {
    const authSrc = join(FRAMEWORK_DIR, "auth", opts.auth);
    if (existsSync(authSrc)) {
      info(`  🔒 Copying auth: ${opts.auth}`);
      const authDest = join(projectDir, "auth");
      copyDir(authSrc, authDest, replacements);
    }
  }

  // 6. Copy extra modules
  for (const mod of opts.modules) {
    const modSrc = join(FRAMEWORK_DIR, "modules", mod);
    if (existsSync(modSrc)) {
      info(`  📎 Copying module: ${mod}`);
      const modDest = join(projectDir, "modules", mod);
      copyDir(modSrc, modDest, replacements);
    }
  }

  // 7. Copy CI/CD workflow
  const workflowSrc = join(FRAMEWORK_DIR, ".github", "workflows", "deploy.yml");
  if (existsSync(workflowSrc)) {
    const workflowDest = join(projectDir, ".github", "workflows");
    mkdirSync(workflowDest, { recursive: true });
    writeFileSync(
      join(workflowDest, "deploy.yml"),
      replaceVars(readFileSync(workflowSrc, "utf-8"), replacements)
    );
  }

  // 8. Create saturday.yaml config
  const config: SaturdayConfig = {
    name: opts.name,
    type: opts.type,
    created: new Date().toISOString(),
    stack: {
      frontend: opts.frontend,
      backend: opts.backend,
      database: opts.db,
      auth: opts.auth,
    },
    cloudflare: {
      account_id: "",
      pages: {
        project: opts.name,
        url: `https://${opts.name}-xxx.pages.dev`,
      },
      worker: {
        name: opts.name,
        url: `https://${opts.name}.workers.dev`,
      },
      d1: {
        database_id: "YOUR_D1_DATABASE_ID",
        database_name: `${opts.name}-db`,
      },
      kv: {
        namespace_id: "YOUR_KV_NAMESPACE_ID",
      },
    },
    github: {
      repo: `nhprince/${opts.name}`,
      branch: "main",
    },
    secrets: [],
    modules: opts.modules,
    environments: {
      production: {
        frontend_url: `https://${opts.name}-xxx.pages.dev`,
        backend_url: `https://${opts.name}.workers.dev`,
      },
    },
  };

  writeFileSync(
    join(projectDir, "saturday.yaml"),
    require("yaml").stringify(config),
    "utf-8"
  );

  // 9. Create README.md
  const readme = `# ${opts.name}

${opts.type.charAt(0).toUpperCase() + opts.type.slice(1)} project built with Saturday Framework.

## Stack
- **Frontend:** ${opts.frontend}
- **Backend:** ${opts.backend}
- **Database:** ${opts.db}
- **Auth:** ${opts.auth}
${opts.modules.length > 0 ? `- **Modules:** ${opts.modules.join(", ")}` : ""}

## Quick Start

\`\`\`bash
# Install dependencies
pnpm install

# Start development
saturday dev

# Deploy
saturday deploy
\`\`\`

## Deployment
Push to \`main\` → auto-deploys to Cloudflare.

## Generated
- Date: ${new Date().toISOString().split("T")[0]}
- Framework: Saturday
`;

  writeFileSync(join(projectDir, "README.md"), readme);

  // 10. Initialize git
  try {
    const { execSync } = require("child_process");
    execSync("git init", { cwd: projectDir, stdio: "pipe" });
    execSync("git add -A", { cwd: projectDir, stdio: "pipe" });
    execSync('git commit -m "🎬 Initial commit from Saturday Framework"', { cwd: projectDir, stdio: "pipe" });
    success("Git repository initialized");
  } catch {
    warn("Git init failed — initialize manually");
  }
}

function copyDir(src: string, dest: string, replacements: Record<string, string>): void {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, replacements);
    } else {
      const content = replaceVars(readFileSync(srcPath, "utf-8"), replacements);
      writeFileSync(destPath, content);
    }
  }
}

function replaceVars(content: string, replacements: Record<string, string>): string {
  for (const [key, val] of Object.entries(replacements)) {
    content = content.replaceAll(key, val);
  }
  return content;
}
