/**
 * saturday init — First-time setup wizard
 */

import { Command } from "commander";
import inquirer from "inquirer";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { out, success, error, warn, info, run, checkPrerequisites, ErrorCode } from "../lib/utils.js";
import { PROJECT_TYPES, DEFAULTS, type ProjectType } from "../types/index.js";

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("First-time setup wizard")
    .action(async () => {
      out("");
      info("🛠️  Welcome to Saturday!");
      info("   Let's get you set up. This takes about 5 minutes.");
      out("");

      // Check prerequisites
      const prereqs = checkPrerequisites();
      if (!prereqs.ok) {
        warn("Missing prerequisites:");
        prereqs.missing.forEach((m) => info(`  • ${m}`));
        info("\nInstall them and run `saturday init` again.");
        info("Run `saturday doctor` for details.");
        process.exit(1);
      }
      success("All prerequisites found");

      // Cloudflare auth
      out("");
      try {
        run("wrangler whoami");
        success("Cloudflare: authenticated");
      } catch {
        warn("Cloudflare: not authenticated");
        info("Opening Cloudflare login...");
        try {
          run("wrangler login");
          success("Cloudflare: authenticated");
        } catch {
          error("Cloudflare login failed. Run `wrangler login` manually.");
        }
      }

      // GitHub auth
      out("");
      try {
        run("gh auth status");
        success("GitHub: authenticated");
      } catch {
        warn("GitHub: not authenticated");
        info("Opening GitHub login...");
        try {
          run("gh auth login");
          success("GitHub: authenticated");
        } catch {
          error("GitHub login failed. Run `gh auth login` manually.");
        }
      }

      // Create first project
      out("");
      const { createProject } = await inquirer.prompt([{
        type: "confirm",
        name: "createProject",
        message: "Create your first project?",
        default: true,
      }]);

      if (createProject) {
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

        const defaults = DEFAULTS[answers.type as ProjectType];
        info(`\nCreating ${answers.type}: ${answers.name}`);
        info(`Frontend: ${defaults.frontend}, Backend: ${defaults.backend}, DB: ${defaults.database}`);

        // This would call the new command internally
        success("Project created! Run `saturday dev` to start developing.");
      }

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
    });
}
