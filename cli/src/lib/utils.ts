/**
 * Shared utilities for Saturday CLI
 */

import chalk from "chalk";
import { execSync, spawn } from "child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, resolve } from "path";
import { homedir } from "os";

// ── Output helpers (respect --json flag) ──

export function out(message: string): void {
  if (process.env.SATURDAY_JSON) return;
  console.log(message);
}

export function success(message: string): void {
  if (process.env.SATURDAY_JSON) {
    console.log(JSON.stringify({ success: true, message }));
  } else {
    console.log(chalk.green(`✓ ${message}`));
  }
}

export function error(message: string): void {
  if (process.env.SATURDAY_JSON) {
    console.log(JSON.stringify({ success: false, error: message }));
  } else {
    console.error(chalk.red(`❌ ${message}`));
  }
}

export function warn(message: string): void {
  if (process.env.SATURDAY_JSON) return;
  console.log(chalk.yellow(`⚠️  ${message}`));
}

export function info(message: string): void {
  if (process.env.SATURDAY_JSON) return;
  console.log(chalk.dim(message));
}

export function json(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

// ── Spinner helper ──

export function createSpinner(text: string) {
  if (process.env.SATURDAY_JSON) {
    return {
      start: () => info(text),
      succeed: (msg: string) => success(msg || text),
      fail: (msg: string) => error(msg || text),
      stop: () => {},
    };
  }
  // Dynamic import for ora (ESM)
  const ora = require("ora");
  return ora(text).start();
}

// ── Command execution ──

export function run(cmd: string, options?: { cwd?: string; capture?: boolean; env?: Record<string, string> }): string {
  try {
    return execSync(cmd, {
      cwd: options?.cwd || process.cwd(),
      encoding: "utf-8",
      stdio: options?.capture === false ? "inherit" : "pipe",
      env: { ...process.env, ...options?.env },
    })?.trim() || "";
  } catch (e: any) {
    throw new Error(`Command failed: ${cmd}\n${e.stderr || e.message}`);
  }
}

export function runAsync(cmd: string, options?: { cwd?: string; onStdout?: (data: string) => void; onStderr?: (data: string) => void }): Promise<void> {
  return new Promise((resolve, reject) => {
    const parts = cmd.split(" ");
    const proc = spawn(parts[0], parts.slice(1), {
      cwd: options?.cwd || process.cwd(),
      stdio: ["inherit", "pipe", "pipe"],
      shell: true,
    });

    proc.stdout?.on("data", (data) => {
      const str = data.toString();
      if (options?.onStdout) options.onStdout(str);
      else if (!process.env.SATURDAY_JSON) process.stdout.write(str);
    });

    proc.stderr?.on("data", (data) => {
      const str = data.toString();
      if (options?.onStderr) options.onStderr(str);
      else if (!process.env.SATURDAY_JSON) process.stderr.write(str);
    });

    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command exited with code ${code}: ${cmd}`));
    });
  });
}

// ── File helpers ──

export function readConfig(): any {
  const configPath = join(process.cwd(), "saturday.yaml");
  if (!existsSync(configPath)) return null;
  const yaml = require("yaml");
  return yaml.parse(readFileSync(configPath, "utf-8"));
}

export function writeConfig(config: any): void {
  const configPath = join(process.cwd(), "saturday.yaml");
  const yaml = require("yaml");
  writeFileSync(configPath, yaml.stringify(config), "utf-8");
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function copyDir(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      let content = readFileSync(srcPath, "utf-8");
      // Replace placeholders
      content = content.replace(/\{\{PROJECT_NAME\}\}/g, readConfig()?.name || "project");
      content = content.replace(/\{\{PROJECT_TYPE\}\}/g, readConfig()?.type || "blog");
      content = content.replace(/\{\{DATE\}\}/g, new Date().toISOString().split("T")[0]);
      writeFileSync(destPath, content);
    }
  }
}

// ── Path helpers ──

export const PROJECTS_DIR = join(homedir(), "projects");
export const FRAMEWORK_DIR = resolve(__dirname, "..", "..", "..");

export function projectDir(name: string): string {
  return join(PROJECTS_DIR, name);
}

// ── Validation ──

export function validateProjectName(name: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

export function checkPrerequisites(): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  
  try { execSync("node --version", { stdio: "pipe" }); } catch { missing.push("Node.js >= 18"); }
  try { execSync("pnpm --version", { stdio: "pipe" }); } catch { missing.push("pnpm"); }
  try { execSync("git --version", { stdio: "pipe" }); } catch { missing.push("git"); }
  
  return { ok: missing.length === 0, missing };
}

// ── Error codes ──

export const ErrorCode = {
  E001: "wrangler not found — run `npm install -g wrangler`",
  E002: "not authenticated with Cloudflare — run `wrangler login`",
  E003: "D1 database not found — run `saturday setup`",
  E004: "deploy failed — check `saturday logs`",
  E005: "health check failed — run `saturday doctor`",
  E006: "secret not set — run `saturday secrets set KEY value`",
  E007: "project not found — run `saturday projects`",
  E008: "config not found — run `saturday init` first",
  E009: "GitHub CLI not found — run `brew install gh` or visit https://cli.github.com",
  E010: "GitHub not authenticated — run `gh auth login`",
} as const;
