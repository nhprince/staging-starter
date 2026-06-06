/**
 * saturday dev — Start local development environment
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { join } from "path";
import { out, success, error, warn, info, runAsync, readConfig } from "../lib/utils.js";

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

        out("");
        info(`🚀 Starting local development for: ${config.name}`);
        out("");

        // Check frontend
        if (existsSync(frontendDir)) {
          info(`🎨 Frontend → http://localhost:${options.port}`);
        } else {
          warn("No frontend directory found");
        }

        // Check backend
        if (existsSync(backendDir)) {
          info(`⚡ Backend  → http://localhost:${options.apiPort}`);
        } else {
          warn("No backend directory found");
        }

        out("");
        info("Press Ctrl+C to stop");
        out("");

        // Start both in parallel
        const promises: Promise<void>[] = [];

        if (existsSync(frontendDir)) {
          promises.push(
            runAsync(`cd ${frontendDir} && pnpm dev -- --port ${options.port}`, {
              onStdout: (d) => process.stdout.write(d),
              onStderr: (d) => process.stderr.write(d),
            }).catch((e) => warn(`Frontend error: ${e.message}`))
          );
        }

        if (existsSync(backendDir)) {
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
