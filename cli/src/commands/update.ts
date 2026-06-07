/**
 * saturday update — Update framework
 */

import { Command } from "commander";
import { error, success, info, json, run } from "../lib/utils.js";

export function registerUpdateCommand(program: Command) {
  program
    .command("update")
    .description("Update Saturday framework")
    .action(async () => {
      try {
        const isJson = !!process.env.SATURDAY_JSON;

        if (!isJson) info("🔄 Checking for updates...");

        // Pull latest from GitHub
        const frameworkDir = process.env.SATURDAY_HOME || "~/saturday";
        run(`cd ${frameworkDir} && git pull origin main`);

        // Rebuild CLI
        run(`cd ${frameworkDir}/cli && pnpm install && pnpm build`);

        if (isJson) {
          json({ success: true, message: "Saturday framework updated" });
        } else {
          success("Saturday framework updated!");
        }
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
