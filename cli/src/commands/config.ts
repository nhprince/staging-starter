/**
 * saturday config — Manage project configuration
 */

import { Command } from "commander";
import { out, success, error, warn, info, json, readConfig, writeConfig } from "../lib/utils.js";
import { validateConfig } from "../lib/config.js";

export function registerConfigCommand(program: Command) {
  const config = program
    .command("config")
    .description("Manage project configuration");

  // saturday config get <key>
  config
    .command("get")
    .description("Get a config value")
    .argument("<key>", "Config key (dot notation, e.g., cloudflare.pages.project)")
    .action(async (key: string) => {
      try {
        const cfg = readConfig();
        if (!cfg) {
          error("No saturday.yaml found.");
          process.exit(1);
        }

        const value = key.split(".").reduce((obj: any, k) => obj?.[k], cfg);

        if (process.env.SATURDAY_JSON) {
          json({ key, value });
        } else {
          if (value === undefined) {
            warn(`Key not found: ${key}`);
          } else if (typeof value === "object") {
            out(JSON.stringify(value, null, 2));
          } else {
            out(`${key} = ${value}`);
          }
        }
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });

  // saturday config set <key> <value>
  config
    .command("set")
    .description("Set a config value")
    .argument("<key>", "Config key (dot notation)")
    .argument("<value>", "Value to set")
    .action(async (key: string, value: string) => {
      try {
        const cfg = readConfig();
        if (!cfg) {
          error("No saturday.yaml found.");
          process.exit(1);
        }

        // Set nested value
        const keys = key.split(".");
        let obj: any = cfg;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) obj[keys[i]] = {};
          obj = obj[keys[i]];
        }

        // Try to parse as number/boolean
        let parsedValue: any = value;
        if (value === "true") parsedValue = true;
        else if (value === "false") parsedValue = false;
        else if (!isNaN(Number(value))) parsedValue = Number(value);

        obj[keys[keys.length - 1]] = parsedValue;
        writeConfig(cfg);
        success(`Set ${key} = ${parsedValue}`);
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });

  // saturday config validate
  config
    .command("validate")
    .description("Validate saturday.yaml configuration")
    .action(async () => {
      try {
        const cfg = readConfig();
        if (!cfg) {
          error("No saturday.yaml found.");
          process.exit(1);
        }

        const result = validateConfig(cfg);

        if (result.valid) {
          success("Configuration is valid!");
        } else {
          warn("Configuration has issues:");
          result.errors.forEach((err) => info(`  • ${err}`));
        }

        if (result.warnings.length > 0) {
          info("\nWarnings:");
          result.warnings.forEach((w) => info(`  • ${w}`));
        }
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });

  // saturday config show
  config
    .command("show")
    .description("Show full configuration")
    .action(async () => {
      try {
        const cfg = readConfig();
        if (!cfg) {
          error("No saturday.yaml found.");
          process.exit(1);
        }

        if (process.env.SATURDAY_JSON) {
          json(cfg);
        } else {
          const yaml = require("yaml");
          out(yaml.stringify(cfg));
        }
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
