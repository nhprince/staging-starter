/**
 * saturday rollback — Rollback deployment
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { join } from "path";
import { out, success, error, warn, info, json, readConfig, run } from "../lib/utils.js";

export function registerRollbackCommand(program: Command) {
  program
    .command("rollback")
    .description("Rollback to previous deployment")
    .action(async () => {
      try {
        const config = readConfig();
        if (!config) {
          error("No saturday.yaml found. Run `saturday init` first.");
          process.exit(1);
        }

        const isYes = !!process.env.SATURDAY_YES;
        const isJson = !!process.env.SATURDAY_JSON;

        if (!isYes && !isJson) {
          const inquirer = (await import("inquirer")).default;
          const { confirm } = await inquirer.prompt([{
            type: "confirm",
            name: "confirm",
            message: `⏪ Rollback ${config.name} to previous deployment?`,
            default: false,
          }]);
          if (!confirm) {
            info("Aborted.");
            return;
          }
        }

        // Git revert to previous commit
        const lastCommit = run("git log --oneline -2 | tail -1 | awk '{print $1}'");
        if (lastCommit) {
          run("git revert --no-edit HEAD");
          run("git push origin main");
          if (isJson) {
            json({ success: true, message: "Rolled back to previous commit", commit: lastCommit });
          } else {
            success("Rolled back to previous commit");
            info("CI/CD will auto-deploy the rollback");
          }
        } else {
          warn("No previous commit found");
        }

      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
