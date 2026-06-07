/**
 * saturday setup — Set up Cloudflare resources for a project
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { join } from "path";
import { out, success, error, warn, info, json, readConfig, writeConfig, run } from "../lib/utils.js";
import { setupCloudflare } from "../lib/cloudflare.js";

export function registerSetupCommand(program: Command) {
  program
    .command("setup")
    .description("Set up Cloudflare resources (KV, D1, Pages, Worker)")
    .action(async () => {
      try {
        const config = readConfig();
        if (!config) {
          error("No saturday.yaml found. Run `saturday init` or `saturday new` first.");
          process.exit(1);
        }

        const isJson = !!process.env.SATURDAY_JSON;
        await setupCloudflare(config.name, process.cwd());

        if (isJson) {
          json({ success: true, message: "Cloudflare resources created", project: config.name });
        } else {
          success("Setup complete!");
        }
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
