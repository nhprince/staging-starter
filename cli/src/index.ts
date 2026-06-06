#!/usr/bin/env node
/**
 * Saturday CLI — Build any web project. 100% free. Fully automated.
 * 
 * Usage:
 *   saturday new <type> <name>     Create a new project
 *   saturday dev                    Start local development
 *   saturday deploy                 Deploy to Cloudflare
 *   saturday status                 Show project status
 *   saturday logs                   Stream Worker logs
 *   saturday rollback               Rollback deployment
 *   saturday secrets                Manage environment variables
 *   saturday projects               List all projects
 *   saturday destroy                Remove project
 *   saturday update                 Update framework
 *   saturday doctor                 Diagnose issues
 *   saturday init                   First-time setup
 * 
 * Agent flags:
 *   --yes       Skip all prompts (non-interactive)
 *   --json      Output as JSON (machine-readable)
 *   --verbose   Show detailed output
 */

import { Command } from "commander";
import chalk from "chalk";
import { registerNewCommand } from "./commands/new.js";
import { registerDevCommand } from "./commands/dev.js";
import { registerDeployCommand } from "./commands/deploy.js";
import { registerStatusCommand } from "./commands/status.js";
import { registerLogsCommand } from "./commands/logs.js";
import { registerRollbackCommand } from "./commands/rollback.js";
import { registerSecretsCommand } from "./commands/secrets.js";
import { registerProjectsCommand } from "./commands/projects.js";
import { registerDestroyCommand } from "./commands/destroy.js";
import { registerSetupCommand } from "./commands/setup.js";
import { registerUpdateCommand } from "./commands/update.js";
import { registerDoctorCommand } from "./commands/doctor.js";
import { registerInitCommand } from "./commands/init.js";

const program = new Command();

program
  .name("saturday")
  .description("Saturday Framework — Build any web project. 100% free. Fully automated.")
  .version("1.0.0")
  .option("--yes", "Skip all prompts (non-interactive mode)")
  .option("--json", "Output as JSON (for agent automation)")
  .option("--verbose", "Show detailed output");

// Global options handling
program.hook("preAction", (thisCommand) => {
  const opts = thisCommand.opts();
  if (opts.json) {
    process.env.SATURDAY_JSON = "true";
  }
  if (opts.yes) {
    process.env.SATURDAY_YES = "true";
  }
  if (opts.verbose) {
    process.env.SATURDAY_VERBOSE = "true";
  }
});

// Register all commands
registerNewCommand(program);
registerDevCommand(program);
registerDeployCommand(program);
registerStatusCommand(program);
registerLogsCommand(program);
registerRollbackCommand(program);
registerSecretsCommand(program);
registerProjectsCommand(program);
registerDestroyCommand(program);
registerSetupCommand(program);
registerUpdateCommand(program);
registerDoctorCommand(program);
registerInitCommand(program);

// Error handling
program.exitOverride();

try {
  program.parse();
} catch (err: any) {
  if (err.code === "commander.helpDisplayed" || err.code === "commander.help") {
    process.exit(0);
  }
  if (process.env.SATURDAY_JSON) {
    console.log(JSON.stringify({ error: true, message: err.message }));
  } else {
    console.error(chalk.red(`\n❌ Error: ${err.message}\n`));
    console.log(chalk.dim("Run `saturday --help` for usage information.\n"));
    console.log(chalk.dim("Run `saturday doctor` to diagnose common issues.\n"));
  }
  process.exit(1);
}
