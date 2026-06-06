/**
 * saturday destroy — Remove a project completely
 */

import { Command } from "commander";
import { existsSync, rmSync } from "fs";
import { join } from "path";
import inquirer from "inquirer";
import { error, success, info, warn, projectDir, run } from "../lib/utils.js";

export function registerDestroyCommand(program: Command) {
  program
    .command("destroy")
    .description("Remove a project completely")
    .argument("[name]", "Project name (defaults to current directory)")
    .action(async (name?: string) => {
      try {
        // Determine project name
        if (!name) {
          const parts = process.cwd().split("/");
          name = parts[parts.length - 1];
        }

        const pDir = name ? projectDir(name) : process.cwd();

        if (!existsSync(pDir)) {
          error(`Project not found: ${pDir}`);
          process.exit(1);
        }

        // Confirm
        if (!process.env.SATURDAY_YES) {
          const { confirm } = await inquirer.prompt([{
            type: "confirm",
            name: "confirm",
            message: `⚠️  Delete project "${name}"? This cannot be undone.`,
            default: false,
          }]);
          if (!confirm) {
            info("Aborted.");
            return;
          }
        }

        // Remove local directory
        rmSync(pDir, { recursive: true, force: true });
        success(`Project deleted: ${pDir}`);

        // Optionally remove GitHub repo
        try {
          run(`gh repo delete nhprince/${name} --yes`);
          success("GitHub repo deleted");
        } catch {
          warn("GitHub repo not deleted (may not exist or no permission)");
        }

      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
