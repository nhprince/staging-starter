/**
 * saturday deploy — Deploy to Cloudflare
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { join } from "path";
import { out, success, error, warn, info, json, readConfig, run } from "../lib/utils.js";

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

        const isJson = !!process.env.SATURDAY_JSON;

        if (!isJson) {
          out("");
          info(`🚀 Deploying ${config.name} to ${options.env}...`);
          out("");
        }

        const results: { step: string; status: "ok" | "error"; message: string }[] = [];

        // Build & deploy frontend
        const frontendDir = join(process.cwd(), "frontend");
        if (existsSync(frontendDir)) {
          if (!isJson) info("📦 Building frontend...");
          try {
            run(`cd ${frontendDir} && pnpm build`);
            results.push({ step: "Frontend build", status: "ok", message: "Built" });
          } catch (e: any) {
            results.push({ step: "Frontend build", status: "error", message: e.message });
            throw e;
          }

          if (!isJson) info("☁️  Deploying to Cloudflare Pages...");
          try {
            const pagesProject = config.cloudflare.pages.project;
            run(`cd ${frontendDir} && wrangler pages deploy out --project-name ${pagesProject} --branch main`);
            results.push({ step: "Frontend deploy", status: "ok", message: config.cloudflare.pages.url });
          } catch (e: any) {
            results.push({ step: "Frontend deploy", status: "error", message: e.message });
            throw e;
          }
        }

        // Build & deploy backend
        const backendDir = join(process.cwd(), "backend");
        if (existsSync(backendDir)) {
          if (!isJson) info("⚡ Deploying Worker...");
          try {
            run(`cd ${backendDir} && wrangler deploy`);
            results.push({ step: "Backend deploy", status: "ok", message: config.cloudflare.worker.url });
          } catch (e: any) {
            results.push({ step: "Backend deploy", status: "error", message: e.message });
            throw e;
          }
        }

        // Health check
        if (!isJson) info("🏥 Running health checks...");
        try {
          const health = run(`curl -s ${config.cloudflare.worker.url}/api/health`);
          const data = JSON.parse(health);
          if (data.status === "ok") {
            results.push({ step: "Health check", status: "ok", message: "Passed" });
          } else {
            results.push({ step: "Health check", status: "error", message: "Unexpected response" });
          }
        } catch {
          results.push({ step: "Health check", status: "error", message: "Failed" });
        }

        if (isJson) {
          const allOk = results.every((r) => r.status === "ok");
          json({ success: allOk, steps: results });
        } else {
          out("");
          success(`Deployment complete!`);
          info(`Frontend: ${config.cloudflare.pages.url}`);
          info(`Backend:  ${config.cloudflare.worker.url}`);
          out("");
        }

      } catch (e: any) {
        error(`Deploy failed: ${e.message}`);
        info("Run `saturday logs` for details");
        info("Run `saturday doctor` to diagnose issues");
        process.exit(1);
      }
    });
}
