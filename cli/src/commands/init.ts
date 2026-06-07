/**
 * saturday init — First-time setup wizard
 */

import { Command } from "commander";
import inquirer from "inquirer";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { out, success, error, warn, info, json, run, checkPrerequisites, ErrorCode } from "../lib/utils.js";
import { PROJECT_TYPES, DEFAULTS, type ProjectType } from "../types/index.js";

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("First-time setup wizard")
    .action(async () => {
      try {
        const isJson = !!process.env.SATURDAY_JSON;
        const isYes = !!process.env.SATURDAY_YES;

        if (!isJson) {
          out("");
          info("🛠️  Welcome to Saturday!");
          info("   Let's get you set up. This takes about 5 minutes.");
          out("");
        }

        // Check prerequisites
        const prereqs = checkPrerequisites();
        if (!prereqs.ok) {
          if (isJson) {
            json({ success: false, error: "Missing prerequisites", missing: prereqs.missing });
          } else {
            warn("Missing prerequisites:");
            prereqs.missing.forEach((m) => info(`  • ${m}`));
            info("\nInstall them and run `saturday init` again.");
            info("Run `saturday doctor` for details.");
          }
          process.exit(1);
        }
        if (!isJson) success("All prerequisites found");

        // Cloudflare auth
        if (!isJson) out("");
        try {
          run("wrangler whoami");
          if (!isJson) success("Cloudflare: authenticated");
        } catch {
          if (!isJson) {
            warn("Cloudflare: not authenticated");
            info("Opening Cloudflare login...");
          }
          try {
            run("wrangler login");
            if (!isJson) success("Cloudflare: authenticated");
          } catch {
            error("Cloudflare login failed. Run `wrangler login` manually.");
          }
        }

        // GitHub auth
        if (!isJson) out("");
        try {
          run("gh auth status");
          if (!isJson) success("GitHub: authenticated");
        } catch {
          if (!isJson) {
            warn("GitHub: not authenticated");
            info("Opening GitHub login...");
          }
          try {
            run("gh auth login");
            if (!isJson) success("GitHub: authenticated");
          } catch {
            error("GitHub login failed. Run `gh auth login` manually.");
          }
        }

        // Create first project
        if (!isJson) out("");

        let createProject = true;
        if (!isYes) {
          const { create } = await inquirer.prompt([{
            type: "confirm",
            name: "create",
            message: "Create your first project?",
            default: true,
          }]);
          createProject = create;
        }

        if (createProject) {
          let projectType: string;
          let projectName: string;

          if (isYes) {
            projectType = "blog";
            projectName = "my-first-project";
          } else {
            const answers = await inquirer.prompt([
              {
                type: "list",
                name: "type",
                message: "What do you want to build?",
                choices: PROJECT_TYPES.map((t) => ({ name: t.charAt(0).toUpperCase() + t.slice(1), value: t })),
              },
              {
                type: "input",
                name: "name",
                message: "Project name (kebab-case):",
                validate: (input: string) => {
                  if (!input) return "Name is required";
                  if (!/^[a-z][a-z0-9-]*$/.test(input)) return "Use kebab-case (e.g., my-blog)";
                  return true;
                },
              },
            ]);
            projectType = answers.type;
            projectName = answers.name;
          }

          const defaults = DEFAULTS[projectType as ProjectType];
          if (!isJson) {
            info(`\nCreating ${projectType}: ${projectName}`);
            info(`Frontend: ${defaults.frontend}, Backend: ${defaults.backend}, DB: ${defaults.database}`);
          }

          if (isJson) {
            json({
              success: true,
              project: projectName,
              type: projectType,
              frontend: defaults.frontend,
              backend: defaults.backend,
              database: defaults.database,
              message: "Project configured. Run `saturday new` to scaffold.",
            });
          } else {
            success("Configuration saved! Run `saturday new` to scaffold your project.");
          }
        }

        if (isJson) {
          json({ success: true, message: "Setup complete" });
        } else {
          out("");
          success("Setup complete! 🎉");
          out("");
          info("Quick reference:");
          info("  saturday new <type> <name>   — Create project");
          info("  saturday dev                  — Start developing");
          info("  saturday deploy               — Deploy to Cloudflare");
          info("  saturday status               — Check status");
          info("  saturday doctor               — Diagnose issues");
          info("  saturday --help               — All commands");
          out("");
        }
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
