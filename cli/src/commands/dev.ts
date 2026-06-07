/**
 * saturday dev — Start local development environment
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { join } from "path";
import { out, success, error, warn, info, json, readConfig, runAsync } from "../lib/utils.js";

export function registerDevCommand(program: Command) {
  program
    .command("dev")
    .description("Start local development environment")
    .option("--port <port>", "Frontend port", "3000")
    .option("--api-port <port>", "Backend port", "8787")
    .action(async (options) => {
      try {
        const config = readConfig();
        if (!config) {
          error("No saturday.yaml found. Run `saturday init` first.");
          process.exit(1);
        }

        const frontendDir = join(process.cwd(), "frontend");
        const backendDir = join(process.cwd(), "backend");
        const hasFrontend = existsSync(frontendDir);
        const hasBackend = existsSync(backendDir);

        if (process.env.SATURDAY_JSON) {
          json({
            project: config.name,
            frontend: hasFrontend ? `http://localhost:${options.port}` : null,
            backend: hasBackend ? `http://localhost:${options.apiPort}` : null,
            status: "starting",
          });
        } else {
          out("");
          info(`🚀 Starting local development for: ${config.name}`);
          out("");
          if (hasFrontend) info(`🎨 Frontend → http://localhost:${options.port}`);
          else warn("No frontend directory found");
          if (hasBackend) info(`⚡ Backend  → http://localhost:${options.apiPort}`);
          else warn("No backend directory found");
          out("");
          info("Press Ctrl+C to stop");
          out("");
        }

        // Start both in parallel
        const promises: Promise<void>[] = [];

        if (hasFrontend) {
          promises.push(
            runAsync(`cd ${frontendDir} && pnpm dev -- --port ${options.port}`, {
              onStdout: (d) => process.stdout.write(d),
              onStderr: (d) => process.stderr.write(d),
            }).catch((e) => warn(`Frontend error: ${e.message}`))
          );
        }

        if (hasBackend) {
          promises.push(
            runAsync(`cd ${backendDir} && pnpm dev -- --port ${options.apiPort}`, {
              onStdout: (d) => process.stdout.write(d),
              onStderr: (d) => process.stderr.write(d),
            }).catch((e) => warn(`Backend error: ${e.message}`))
          );
        }

        await Promise.all(promises);
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
