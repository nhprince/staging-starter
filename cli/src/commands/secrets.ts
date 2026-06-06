/**
 * saturday secrets — Manage environment variables
 */

import { Command } from "commander";
import { error, success, info, warn, run, readConfig, writeConfig } from "../lib/utils.js";

export function registerSecretsCommand(program: Command) {
  const secrets = program
    .command("secrets")
    .description("Manage environment variables");

  secrets
    .command("set")
    .description("Set a secret")
    .argument("<key>", "Secret name")
    .argument("<value>", "Secret value")
    .action(async (key: string, value: string) => {
      try {
        const config = readConfig();
        if (!config) {
          error("No saturday.yaml found. Run `saturday init` first.");
          process.exit(1);
        }

        // Add to config
        if (!config.secrets.includes(key)) {
          config.secrets.push(key);
          writeConfig(config);
        }

        // Set in Cloudflare Worker
        try {
          run(`wrangler secret put ${key}`, { capture: false });
          success(`Secret ${key} set in Cloudflare Worker`);
        } catch {
          warn("Failed to set Cloudflare secret. Set manually: wrangler secret put <key>");
        }

        // Set in GitHub Actions
        try {
          run(`gh secret set ${key} --body "${value}"`);
          success(`Secret ${key} set in GitHub Actions`);
        } catch {
          warn("Failed to set GitHub secret. Set manually: gh secret set <key>");
        }

      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });

  secrets
    .command("list")
    .description("List all secrets")
    .action(async () => {
      try {
        const config = readConfig();
        if (!config) {
          error("No saturday.yaml found. Run `saturday init` first.");
          process.exit(1);
        }

        info("Configured secrets:");
        for (const secret of config.secrets) {
          info(`  • ${secret}`);
        }
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
