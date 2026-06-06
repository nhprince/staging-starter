/**
 * Cloudflare resource setup — KV, D1, Pages, Worker
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { success, warn, info, error, run, readConfig, writeConfig } from "./utils.js";

export async function setupCloudflare(projectName: string, projectDir: string): Promise<void> {
  info("☁️  Setting up Cloudflare resources...");

  // Check wrangler auth
  try {
    run("wrangler whoami");
  } catch {
    error("Not authenticated with Cloudflare. Run `wrangler login` first.");
    throw new Error("Cloudflare authentication required");
  }

  // 1. Create KV namespace
  let kvId = "";
  try {
    info("  Creating KV namespace...");
    const kvResult = run(`wrangler kv namespace create "${projectName.toUpperCase().replace(/-/g, "_")}-KV"`);
    const idMatch = kvResult.match(/id\s*=\s*"([^"]+)"/);
    kvId = idMatch?.[1] || "";
    success(`  KV namespace created: ${kvId}`);
  } catch (e: any) {
    warn(`  KV creation failed: ${e.message}`);
  }

  // 2. Create D1 database
  let d1Id = "";
  try {
    info("  Creating D1 database...");
    const d1Result = run(`wrangler d1 create "${projectName}-db"`);
    const idMatch = d1Result.match(/database_id\s*=\s*"([^"]+)"/);
    d1Id = idMatch?.[1] || "";
    success(`  D1 database created: ${d1Id}`);
  } catch (e: any) {
    warn(`  D1 creation failed: ${e.message}`);
  }

  // 3. Create Pages project
  try {
    info("  Creating Pages project...");
    run(`wrangler pages project create "${projectName}" --production-branch=main`);
    success("  Pages project created");
  } catch (e: any) {
    warn(`  Pages creation failed: ${e.message}`);
  }

  // 4. Update wrangler.toml in backend
  const wranglerPath = join(projectDir, "backend", "wrangler.toml");
  if (existsSync(wranglerPath)) {
    let wranglerContent = readFileSync(wranglerPath, "utf-8");
    if (kvId) {
      wranglerContent = wranglerContent.replace(/id\s*=\s*"YOUR_KV_NAMESPACE_ID"/, `id = "${kvId}"`);
    }
    if (d1Id) {
      wranglerContent = wranglerContent.replace(/database_id\s*=\s*"YOUR_D1_DATABASE_ID"/, `database_id = "${d1Id}"`);
    }
    writeFileSync(wranglerPath, wranglerContent);
    success("  wrangler.toml updated with resource IDs");
  }

  // 5. Update saturday.yaml
  try {
    process.chdir(projectDir);
    const config = readConfig();
    if (config) {
      if (kvId) config.cloudflare.kv.namespace_id = kvId;
      if (d1Id) config.cloudflare.d1.database_id = d1Id;
      writeConfig(config);
      success("  saturday.yaml updated");
    }
  } catch (e: any) {
    warn(`  Config update failed: ${e.message}`);
  }

  success("Cloudflare setup complete!");
}
