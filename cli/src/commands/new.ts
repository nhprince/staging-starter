/**
 * saturday new — Create a new project from a scaffold
 */

import { Command } from "commander";
import inquirer from "inquirer";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import {
  PROJECT_TYPES, FRONTEND_TYPES, BACKEND_TYPES, DATABASE_TYPES, AUTH_TYPES, MODULE_TYPES,
  DEFAULTS, MODULE_DEFAULTS,
  type ProjectType, type FrontendType, type BackendType, type DatabaseType, type AuthType, type ModuleType,
} from "../types/index.js";
import {
  out, success, error, warn, info, json, run, projectDir, validateProjectName,
  checkPrerequisites, ErrorCode,
} from "../lib/utils.js";
import { scaffoldProject } from "../lib/scaffold.js";
import { setupCloudflare } from "../lib/cloudflare.js";
import { createGitHubRepo } from "../lib/github.js";

export function registerNewCommand(program: Command) {
  program
    .command("new")
    .description("Create a new project from a scaffold")
    .argument("<type>", `Project type: ${PROJECT_TYPES.join(", ")}`)
    .argument("<name>", "Project name (kebab-case)")
    .option("--frontend <type>", `Frontend: ${FRONTEND_TYPES.join(", ")}`)
    .option("--backend <type>", `Backend: ${BACKEND_TYPES.join(", ")}`)
    .option("--db <type>", `Database: ${DATABASE_TYPES.join(", ")}`)
    .option("--auth <type>", `Auth: ${AUTH_TYPES.join(", ")}`)
    .option("--modules <items...>", `Modules: ${MODULE_TYPES.join(", ")}`)
    .option("--ui-components", "Install recommended UI components from 21st.dev")
    .option("--no-ui-components", "Skip UI component installation")
    .option("--no-github", "Skip GitHub repo creation")
    .option("--no-cloudflare", "Skip Cloudflare setup")
    .action(async (type: string, name: string, options: any) => {
      try {
        // Validate project type
        if (!PROJECT_TYPES.includes(type as ProjectType)) {
          error(`Unknown project type: ${type}`);
          info(`Available types: ${PROJECT_TYPES.join(", ")}`);
          process.exit(1);
        }

        // Validate project name
        if (!validateProjectName(name)) {
          error("Invalid project name. Use kebab-case (e.g., my-blog, cool-app).");
          process.exit(1);
        }

        // Check if project already exists
        const pDir = projectDir(name);
        if (existsSync(pDir)) {
          if (process.env.SATURDAY_YES) {
            error(`Project directory already exists: ${pDir}`);
            process.exit(1);
          }
          const { overwrite } = await inquirer.prompt([{
            type: "confirm",
            name: "overwrite",
            message: `Directory ${pDir} already exists. Overwrite?`,
            default: false,
          }]);
          if (!overwrite) {
            info("Aborted.");
            process.exit(0);
          }
        }

        // Get defaults
        const defaults = DEFAULTS[type as ProjectType];
        const moduleDefaults = MODULE_DEFAULTS[type as ProjectType];

        // Resolve options (flags > interactive > defaults)
        let frontend: FrontendType;
        let backend: BackendType;
        let db: DatabaseType;
        let auth: AuthType;
        let modules: ModuleType[];

        let uiComponents = false;

        if (process.env.SATURDAY_YES) {
          // Non-interactive: use flags or defaults
          frontend = (options.frontend as FrontendType) || defaults.frontend;
          backend = (options.backend as BackendType) || defaults.backend;
          db = (options.db as DatabaseType) || defaults.database;
          auth = (options.auth as AuthType) || defaults.auth;
          modules = (options.modules as ModuleType[]) || moduleDefaults;
          uiComponents = options.uiComponents === true;
        } else {
          // Interactive mode
          out("");
          info(`Creating ${type} project: ${name}`);
          info(`Press Enter to accept defaults.\n`);

          const answers = await inquirer.prompt([
            {
              type: "list",
              name: "frontend",
              message: "Frontend framework:",
              choices: FRONTEND_TYPES,
              default: defaults.frontend,
            },
            {
              type: "list",
              name: "backend",
              message: "Backend runtime:",
              choices: BACKEND_TYPES,
              default: defaults.backend,
            },
            {
              type: "list",
              name: "db",
              message: "Database:",
              choices: DATABASE_TYPES,
              default: defaults.database,
            },
            {
              type: "list",
              name: "auth",
              message: "Authentication:",
              choices: AUTH_TYPES,
              default: defaults.auth,
            },
            {
              type: "checkbox",
              name: "modules",
              message: "Extra modules:",
              choices: MODULE_TYPES.filter((m) => moduleDefaults.includes(m)),
              default: moduleDefaults,
            },
            {
              type: "confirm",
              name: "uiComponents",
              message: "Install recommended UI components from 21st.dev?",
              default: true,
            },
          ]);

          frontend = answers.frontend;
          backend = answers.backend;
          db = answers.db;
          auth = answers.auth;
          modules = answers.modules;
          const uiComponents = answers.uiComponents;
        }

        // Summary
        out("");
        info(`📦 Scaffolding ${type}: ${name}`);
        info(`   Frontend: ${frontend}`);
        info(`   Backend:  ${backend}`);
        info(`   Database: ${db}`);
        info(`   Auth:     ${auth}`);
        info(`   Modules:  ${modules.join(", ") || "none"}`);
        out("");

        // Scaffold the project
        await scaffoldProject({
          type: type as ProjectType,
          name,
          frontend,
          backend,
          db,
          auth,
          modules,
        });

        success(`Project scaffolded: ${pDir}`);

        // Install UI components from 21st.dev
        if (uiComponents) {
          out("");
          info("🎨 Installing recommended UI components from 21st.dev...");

          const { getUiCache, syncUiCache, installUiComponent, getUiComponent, searchUiComponents } = await import("../lib/ui.js");
          await syncUiCache("curated");

          // Get recommended components for this project type
          const { readFileSync } = await import("fs");
          const { join } = await import("path");
          const registryPath = join(__dirname, "..", "..", "ui", "registry.json");
          const registry = JSON.parse(readFileSync(registryPath, "utf-8"));
          const recommended: string[] = registry.scaffold_recommendations[type as string] || [];

          for (const slug of recommended) {
            try {
              const comp = await getUiComponent(slug, { source: "curated" });
              if (comp) {
                await installUiComponent(comp, pDir);
                success(`  ✅ ${comp.name}`);
              }
            } catch (err: any) {
              warn(`  ⚠️  ${slug}: ${err.message}`);
            }
          }

          info("UI components installed to src/components/ui/");
          info("Run `saturday ui browse` to explore more components.");
        }

        // Create GitHub repo
        if (!options.noGithub) {
          const shouldCreateRepo = process.env.SATURDAY_YES || (await inquirer.prompt([{
            type: "confirm",
            name: "create",
            message: "Create GitHub repository?",
            default: true,
          }])).create;

          if (shouldCreateRepo) {
            try {
              await createGitHubRepo(name, pDir);
              success("GitHub repo created and code pushed");
            } catch (e: any) {
              warn(`GitHub repo creation failed: ${e.message}`);
              info("Create manually: gh repo create nhprince/<name> --public");
            }
          }
        }

        // Setup Cloudflare
        if (!options.noCloudflare) {
          const shouldSetupCF = process.env.SATURDAY_YES || (await inquirer.prompt([{
            type: "confirm",
            name: "setup",
            message: "Set up Cloudflare resources? (KV, D1, Pages, Worker)",
            default: true,
          }])).setup;

          if (shouldSetupCF) {
            try {
              await setupCloudflare(name, pDir);
              success("Cloudflare resources created");
            } catch (e: any) {
              warn(`Cloudflare setup incomplete: ${e.message}`);
              info("Set up manually at dash.cloudflare.com");
            }
          }
        }

        // Final summary
        out("");
        if (process.env.SATURDAY_JSON) {
          json({
            success: true,
            project: name,
            type,
            path: pDir,
            urls: {
              pages: `https://${name}-xxx.pages.dev`,
              worker: `https://${name}.workers.dev`,
            },
          });
        } else {
          out("╔══════════════════════════════════════════════════════╗");
          out("║  ✅ Project Ready!                                  ║");
          out("╠══════════════════════════════════════════════════════╣");
          out(`║  📁 Local:   ~/projects/${name}`);
          out(`║  🌐 GitHub:  github.com/nhprince/${name}`);
          out(`║  ☁️  Pages:   https://${name}-xxx.pages.dev`);
          out(`║  ⚡ Worker:  https://${name}.workers.dev`);
          out("╚══════════════════════════════════════════════════════╝");
          out("");
          info("Next steps:");
          info(`  cd ~/projects/${name}`);
          info("  saturday dev        # Start developing");
          info("  saturday deploy     # Deploy changes");
          out("");
        }
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
