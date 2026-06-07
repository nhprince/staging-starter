/**
 * saturday doctor — Diagnose common issues
 */

import { Command } from "commander";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { out, success, error, warn, info, json, readConfig, run, checkPrerequisites, ErrorCode } from "../lib/utils.js";

export function registerDoctorCommand(program: Command) {
  program
    .command("doctor")
    .description("Diagnose and fix common issues")
    .action(async () => {
      const results: { check: string; status: "ok" | "warn" | "error"; message: string }[] = [];

      // Check Node.js
      try {
        const nodeVersion = execSync("node --version", { encoding: "utf-8" }).trim();
        results.push({ check: "Node.js", status: "ok", message: nodeVersion });
      } catch {
        results.push({ check: "Node.js", status: "error", message: "Not found. Install: https://nodejs.org" });
      }

      // Check pnpm
      try {
        const pnpmVersion = execSync("pnpm --version", { encoding: "utf-8" }).trim();
        results.push({ check: "pnpm", status: "ok", message: pnpmVersion });
      } catch {
        results.push({ check: "pnpm", status: "error", message: "Not found. Install: npm install -g pnpm" });
      }

      // Check wrangler
      try {
        const wranglerVersion = execSync("wrangler --version", { encoding: "utf-8" }).trim();
        results.push({ check: "wrangler", status: "ok", message: wranglerVersion });
      } catch {
        results.push({ check: "wrangler", status: "error", message: "Not found. Install: npm install -g wrangler" });
      }

      // Check wrangler auth
      try {
        execSync("wrangler whoami", { stdio: "pipe" });
        results.push({ check: "Cloudflare", status: "ok", message: "Authenticated" });
      } catch {
        results.push({ check: "Cloudflare", status: "error", message: "Not authenticated. Run: wrangler login" });
      }

      // Check git
      try {
        const gitVersion = execSync("git --version", { encoding: "utf-8" }).trim();
        results.push({ check: "git", status: "ok", message: gitVersion });
      } catch {
        results.push({ check: "git", status: "error", message: "Not found. Install: https://git-scm.com" });
      }

      // Check gh CLI
      try {
        execSync("gh auth status", { stdio: "pipe" });
        results.push({ check: "GitHub", status: "ok", message: "Authenticated" });
      } catch {
        results.push({ check: "GitHub", status: "warn", message: "Not authenticated. Run: gh auth login" });
      }

      // Check saturday.yaml
      const config = readConfig();
      if (config) {
        results.push({ check: "saturday.yaml", status: "ok", message: `Found (${config.name})` });
      } else {
        results.push({ check: "saturday.yaml", status: "warn", message: "Not found. Run: saturday init" });
      }

      // Output
      if (process.env.SATURDAY_JSON) {
        const allOk = results.every((r) => r.status !== "error");
        json({ success: allOk, checks: results });
      } else {
        out("");
        info("🏥 Saturday Doctor — Diagnosing...");
        out("");
        for (const r of results) {
          if (r.status === "ok") success(`✓ ${r.check}: ${r.message}`);
          else if (r.status === "warn") warn(`⚠️  ${r.check}: ${r.message}`);
          else error(`❌ ${r.check}: ${r.message}`);
        }
        out("");
        const errors = results.filter((r) => r.status === "error");
        if (errors.length === 0) {
          success("All checks passed! Your environment is ready.");
        } else {
          warn(`Found ${errors.length} issue(s). See above for fixes.`);
        }
        out("");
      }
    });
}
