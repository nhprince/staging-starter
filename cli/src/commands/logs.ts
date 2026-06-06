/**
 * saturday logs — Stream Worker logs
 */

import { Command } from "commander";
import { error, info, readConfig, runAsync } from "../lib/utils.js";

export function registerLogsCommand(program: Command) {
  program
    .command("logs")
    .description("Stream Worker logs")
    .option("--tail", "Tail mode (stream new logs)", true)
    .action(async (options) => {
      try {
        const config = readConfig();
        if (!config) {
          error("No saturday.yaml found. Run `saturday init` first.");
          process.exit(1);
        }

        info(`📋 Streaming logs for: ${config.cloudflare.worker.name}`);
        info("Press Ctrl+C to stop");
        process.stdout.write("\n");

        await runAsync(`wrangler tail ${config.cloudflare.worker.name}`, {
          onStdout: (d) => process.stdout.write(d),
          onStderr: (d) => process.stderr.write(d),
        });
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
