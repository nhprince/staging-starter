/**
 * saturday status — Show project status
 */

import { Command } from "commander";
import { out, success, error, warn, info, json, readConfig, run } from "../lib/utils.js";

export function registerStatusCommand(program: Command) {
  program
    .command("status")
    .description("Show project status")
    .action(async () => {
      try {
        const config = readConfig();
        if (!config) {
          error("No saturday.yaml found. Run `saturday init` first.");
          process.exit(1);
        }

        if (process.env.SATURDAY_JSON) {
          json({ project: config.name, type: config.type, config });
          return;
        }

        out("");
        info(`📊 Project: ${config.name} (${config.type})`);
        out("");

        // Check frontend
        try {
          const status = run(`curl -s -o /dev/null -w "%{http_code}" ${config.cloudflare.pages.url}`);
          if (status === "200") {
            success(`Frontend: ${config.cloudflare.pages.url}`);
          } else {
            warn(`Frontend: HTTP ${status}`);
          }
        } catch {
          error("Frontend: unreachable");
        }

        // Check backend
        try {
          const health = run(`curl -s ${config.cloudflare.worker.url}/api/health`);
          const data = JSON.parse(health);
          if (data.status === "ok") {
            success(`Backend:  ${config.cloudflare.worker.url}`);
          } else {
            warn(`Backend: unexpected response`);
          }
        } catch {
          error("Backend: unreachable");
        }

        // Stack info
        out("");
        info("Stack:");
        info(`  Frontend: ${config.stack.frontend}`);
        info(`  Backend:  ${config.stack.backend}`);
        info(`  Database: ${config.stack.database}`);
        info(`  Auth:     ${config.stack.auth}`);
        if (config.modules.length > 0) {
          info(`  Modules:  ${config.modules.join(", ")}`);
        }
        out("");

      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
