/**
 * saturday deploy — Deploy to Cloudflare
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { join } from "path";
import { out, success, error, warn, info, run, readConfig } from "../lib/utils.js";

export function registerDeployCommand(program: Command) {
  program
    .command("deploy")
    .description("Deploy to Cloudflare")
    .option("--env <env>", "Environment (production, staging)", "production")
    .action(async (options) => {
      try {
        const config = readConfig();
        if (!config) {
          error("No saturday.yaml found. Run `saturday init` first.");
          process.exit(1);
        }

        out("");
        info(`🚀 Deploying ${config.name} to ${options.env}...`);
        out("");

        // Build & deploy frontend
        const frontendDir = join(process.cwd(), "frontend");
        if (existsSync(frontendDir)) {
          info("📦 Building frontend...");
          run(`cd ${frontendDir} && pnpm build`);
          success("Frontend built");

          info("☁️  Deploying to Cloudflare Pages...");
          const pagesProject = config.cloudflare.pages.project;
          run(`cd ${frontendDir} && wrangler pages deploy out --project-name ${pagesProject} --branch main`);
          success(`Frontend live: ${config.cloudflare.pages.url}`);
        }

        // Build & deploy backend
        const backendDir = join(process.cwd(), "backend");
        if (existsSync(backendDir)) {
          info("⚡ Deploying Worker...");
          run(`cd ${backendDir} && wrangler deploy`);
          success(`Backend live: ${config.cloudflare.worker.url}`);
        }

        // Health check
        info("🏥 Running health checks...");
        try {
          const health = run(`curl -s ${config.cloudflare.worker.url}/api/health`);
          const data = JSON.parse(health);
          if (data.status === "ok") {
            success("Health check passed");
          } else {
            warn("Health check returned unexpected response");
          }
        } catch {
          warn("Health check failed — service may still be starting");
        }

        out("");
        success(`Deployment complete!`);
        info(`Frontend: ${config.cloudflare.pages.url}`);
        info(`Backend:  ${config.cloudflare.worker.url}`);
        out("");

      } catch (e: any) {
        error(`Deploy failed: ${e.message}`);
        info("Run `saturday logs` for details");
        info("Run `saturday doctor` to diagnose issues");
        process.exit(1);
      }
    });
}
