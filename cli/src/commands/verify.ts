/**
 * saturday verify — Post-deployment verification
 */

import { Command } from "commander";
import { out, success, error, warn, info, json, readConfig, run } from "../lib/utils.js";

export function registerVerifyCommand(program: Command) {
  program
    .command("verify")
    .description("Verify deployment health")
    .action(async () => {
      try {
        const config = readConfig();
        if (!config) {
          error("No saturday.yaml found. Run `saturday init` first.");
          process.exit(1);
        }

        out("");
        info("🔍 Verifying deployment...");
        out("");

        let allPassed = true;
        const results: { check: string; status: "pass" | "fail" | "warn"; message: string }[] = [];

        // 1. Frontend check
        try {
          const status = run(`curl -s -o /dev/null -w "%{http_code}" ${config.cloudflare.pages.url}`);
          if (status === "200") {
            results.push({ check: "Frontend", status: "pass", message: `HTTP ${status}` });
          } else {
            results.push({ check: "Frontend", status: "fail", message: `HTTP ${status}` });
            allPassed = false;
          }
        } catch {
          results.push({ check: "Frontend", status: "fail", message: "Unreachable" });
          allPassed = false;
        }

        // 2. Backend health
        try {
          const health = run(`curl -s ${config.cloudflare.worker.url}/api/health`);
          const data = JSON.parse(health);
          if (data.status === "ok") {
            results.push({ check: "Backend Health", status: "pass", message: "OK" });
          } else {
            results.push({ check: "Backend Health", status: "warn", message: "Unexpected response" });
          }
        } catch {
          results.push({ check: "Backend Health", status: "fail", message: "Unreachable" });
          allPassed = false;
        }

        // 3. CORS check
        try {
          const cors = run(`curl -s -o /dev/null -w "%{header}" -H "Origin: https://example.com" ${config.cloudflare.worker.url}/api/health 2>&1 | grep -i "access-control"`);
          if (cors) {
            results.push({ check: "CORS Headers", status: "pass", message: "Present" });
          } else {
            results.push({ check: "CORS Headers", status: "warn", message: "Not detected" });
          }
        } catch {
          results.push({ check: "CORS Headers", status: "warn", message: "Check failed" });
        }

        // 4. HTTPS check
        if (config.cloudflare.pages.url.startsWith("https") && config.cloudflare.worker.url.startsWith("https")) {
          results.push({ check: "HTTPS", status: "pass", message: "Enforced" });
        } else {
          results.push({ check: "HTTPS", status: "fail", message: "Not enforced" });
          allPassed = false;
        }

        // 5. Response time
        try {
          const time = run(`curl -s -o /dev/null -w "%{time_total}" ${config.cloudflare.worker.url}/api/health`);
          const timeMs = parseFloat(time) * 1000;
          if (timeMs < 500) {
            results.push({ check: "Response Time", status: "pass", message: `${Math.round(timeMs)}ms` });
          } else if (timeMs < 1000) {
            results.push({ check: "Response Time", status: "warn", message: `${Math.round(timeMs)}ms` });
          } else {
            results.push({ check: "Response Time", status: "fail", message: `${Math.round(timeMs)}ms` });
            allPassed = false;
          }
        } catch {
          results.push({ check: "Response Time", status: "fail", message: "Timeout" });
          allPassed = false;
        }

        // Output results
        if (process.env.SATURDAY_JSON) {
          json({ success: allPassed, checks: results });
        } else {
          for (const r of results) {
            const icon = r.status === "pass" ? "✓" : r.status === "warn" ? "⚠️" : "❌";
            const fn = r.status === "pass" ? success : r.status === "warn" ? warn : error;
            fn(`${icon} ${r.check}: ${r.message}`);
          }
          out("");
          if (allPassed) {
            success("All checks passed! Deployment is healthy.");
          } else {
            warn("Some checks failed. Run `saturday doctor` for help.");
          }
          out("");
        }

        process.exit(allPassed ? 0 : 1);
      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
