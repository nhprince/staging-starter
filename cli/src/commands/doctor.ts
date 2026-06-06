/**
 * saturday doctor — Diagnose common issues
 */

import { Command } from "commander";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { out, success, error, warn, info, readConfig, ErrorCode } from "../lib/utils.js";

export function registerDoctorCommand(program: Command) {
  program
    .command("doctor")
    .description("Diagnose and fix common issues")
    .action(async () => {
      out("");
      info("🏥 Saturday Doctor — Diagnosing...");
      out("");

      const issues: string[] = [];
      const fixes: string[] = [];

      // Check Node.js
      try {
        const nodeVersion = execSync("node --version", { encoding: "utf-8" }).trim();
        success(`Node.js: ${nodeVersion}`);
      } catch {
        issues.push("Node.js not found");
        fixes.push("Install Node.js >= 18: https://nodejs.org");
      }

      // Check pnpm
      try {
        const pnpmVersion = execSync("pnpm --version", { encoding: "utf-8" }).trim();
        success(`pnpm: ${pnpmVersion}`);
      } catch {
        issues.push("pnpm not found");
        fixes.push("Install pnpm: npm install -g pnpm");
      }

      // Check wrangler
      try {
        const wranglerVersion = execSync("wrangler --version", { encoding: "utf-8" }).trim();
        success(`wrangler: ${wranglerVersion}`);
      } catch {
        issues.push("wrangler not found");
        fixes.push("Install wrangler: npm install -g wrangler");
      }

      // Check wrangler auth
      try {
        execSync("wrangler whoami", { stdio: "pipe" });
        success("Cloudflare: authenticated");
      } catch {
        issues.push("Not authenticated with Cloudflare");
        fixes.push("Run: wrangler login");
      }

      // Check git
      try {
        const gitVersion = execSync("git --version", { encoding: "utf-8" }).trim();
        success(`git: ${gitVersion}`);
      } catch {
        issues.push("git not found");
        fixes.push("Install git: https://git-scm.com");
      }

      // Check gh CLI
      try {
        execSync("gh auth status", { stdio: "pipe" });
        success("GitHub: authenticated");
      } catch {
        issues.push("GitHub CLI not authenticated");
        fixes.push("Run: gh auth login");
      }

      // Check saturday.yaml
      const config = readConfig();
      if (config) {
        success(`saturday.yaml: found (${config.name})`);

        // Check Cloudflare resources
        if (config.cloudflare?.d1?.database_id) {
          try {
            execSync(`wrangler d1 info ${config.cloudflare.d1.database_name}`, { stdio: "pipe" });
            success(`D1 database: ${config.cloudflare.d1.database_name}`);
          } catch {
            issues.push(`D1 database not found: ${config.cloudflare.d1.database_name}`);
            fixes.push("Run: saturday setup");
          }
        }
      } else {
        warn("saturday.yaml: not found (run `saturday init`)");
      }

      // Summary
      out("");
      if (issues.length === 0) {
        success("All checks passed! Your environment is ready.");
      } else {
        warn(`Found ${issues.length} issue(s):`);
        out("");
        issues.forEach((issue, i) => {
          info(`  ${i + 1}. ${issue}`);
          info(`     Fix: ${fixes[i]}`);
        });
      }
      out("");
    });
}
