/**
 * Saturday UI — 21st.dev Component Integration
 * 
 * Commands:
 *   saturday ui                      Browse components interactively
 *   saturday ui search <query>       Search for components
 *   saturday ui add <component>      Install a component into the project
 *   saturday ui list                 List installed 21st.dev components
 *   saturday ui remove <component>   Remove an installed component
 *   saturday ui sync                 Sync component cache from 21st.dev
 *   saturday ui categories           List available categories
 *   saturday ui info <component>     Show component details
 * 
 * Agent flags:
 *   --yes       Skip all prompts (non-interactive)
 *   --json      Output as JSON (machine-readable)
 *   --source    Component source: "curated" | "all" (default: curated)
 */

import { Command } from "commander";
import inquirer from "inquirer";
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from "fs";
import { join, basename } from "path";
import {
  out, success, error, warn, info, json, run, projectDir,
  ErrorCode,
} from "../lib/utils.js";
import { getUiCache, syncUiCache, searchUiComponents, getUiComponent, installUiComponent, removeUiComponent, listInstalledUiComponents } from "../lib/ui.js";

export function registerUiCommand(program: Command) {
  const ui = program
    .command("ui")
    .description("Browse and install UI components from 21st.dev")
    .option("--source <source>", "Component source: curated | all (default: curated)", "curated")
    .option("--category <category>", "Filter by category")
    .option("--limit <limit>", "Max results (default: 20)", "20");

  // saturday ui — Interactive browse
  ui
    .command("browse")
    .description("Browse UI components interactively")
    .action(async (options) => {
      try {
        const cache = await getUiCache();
        if (!cache || !cache.components || cache.components.length === 0) {
          info("No component cache found. Run `saturday ui sync` first.");
          if (process.env.SATURDAY_YES) {
            error("No component cache. Run `saturday ui sync` first.");
            process.exit(1);
          }
          const { sync } = await inquirer.prompt([{
            type: "confirm",
            name: "sync",
            message: "Sync component cache from 21st.dev now?",
            default: true,
          }]);
          if (sync) {
            await syncUiCache();
          } else {
            process.exit(0);
          }
        }

        const components = await searchUiComponents("", options);
        if (components.length === 0) {
          info("No components found.");
          process.exit(0);
        }

        if (process.env.SATURDAY_JSON) {
          json(components);
          return;
        }

        const { selected } = await inquirer.prompt([{
          type: "list",
          name: "selected",
          message: "Select a component to install:",
          choices: components.map((c: any) => ({
            name: `${c.name}  ${c.description ? "— " + c.description.slice(0, 60) : ""}  ⬇ ${c.downloads || 0}`,
            value: c,
          })),
          pageSize: 15,
        }]);

        if (selected) {
          await installUiComponent(selected);
          success(`Installed: ${selected.name}`);
        }
      } catch (err: any) {
        error(err.message);
        process.exit(1);
      }
    });

  // saturday ui search <query>
  ui
    .command("search <query>")
    .description("Search for UI components")
    .action(async (query: string, options) => {
      try {
        const components = await searchUiComponents(query, options);

        if (process.env.SATURDAY_JSON) {
          json(components);
          return;
        }

        if (components.length === 0) {
          info(`No components found for "${query}".`);
          info("Try: saturday ui sync");
          process.exit(0);
        }

        out(`\n🔍 Found ${components.length} components for "${query}":\n`);
        components.forEach((c: any, i: number) => {
          out(`  ${i + 1}. ${c.name}${c.description ? " — " + c.description.slice(0, 80) : ""}`);
          out(`     ⬇ ${c.downloads || 0} downloads  |  ${c.tags?.join(", ") || "no tags"}`);
          out(`     📦 ${c.dependencies ? Object.keys(c.dependencies).join(", ") : "no deps"}`);
          out("");
        });
      } catch (err: any) {
        error(err.message);
        process.exit(1);
      }
    });

  // saturday ui add <component>
  ui
    .command("add <component>")
    .description("Install a UI component by name or slug")
    .action(async (componentName: string, options) => {
      try {
        const comp = await getUiComponent(componentName, options);
        if (!comp) {
          error(`Component not found: ${componentName}`);
          info("Run `saturday ui search <query>` to find components.");
          process.exit(1);
        }

        if (process.env.SATURDAY_JSON) {
          json({ installing: comp.name, dependencies: comp.dependencies });
        }

        await installUiComponent(comp);
        success(`✅ Installed: ${comp.name}`);

        if (comp.dependencies && Object.keys(comp.dependencies).length > 0) {
          info(`Dependencies: ${Object.entries(comp.dependencies).map(([k, v]) => `${k}@${v}`).join(", ")}`);
          info("Run `pnpm install` to install dependencies.");
        }
      } catch (err: any) {
        error(err.message);
        process.exit(1);
      }
    });

  // saturday ui list
  ui
    .command("list")
    .description("List installed 21st.dev components")
    .action(async () => {
      try {
        const installed = await listInstalledUiComponents();

        if (process.env.SATURDAY_JSON) {
          json(installed);
          return;
        }

        if (installed.length === 0) {
          info("No 21st.dev components installed.");
          info("Run `saturday ui browse` to find components.");
          process.exit(0);
        }

        out(`\n📦 Installed 21st.dev components (${installed.length}):\n`);
        installed.forEach((c: any) => {
          out(`  • ${c.name} — ${c.installed_at || "unknown date"}`);
        });
        out("");
      } catch (err: any) {
        error(err.message);
        process.exit(1);
      }
    });

  // saturday ui remove <component>
  ui
    .command("remove <component>")
    .description("Remove an installed component")
    .action(async (componentName: string) => {
      try {
        const removed = await removeUiComponent(componentName);
        if (removed) {
          success(`Removed: ${componentName}`);
        } else {
          error(`Component not found: ${componentName}`);
          process.exit(1);
        }
      } catch (err: any) {
        error(err.message);
        process.exit(1);
      }
    });

  // saturday ui sync
  ui
    .command("sync")
    .description("Sync component cache from 21st.dev")
    .action(async () => {
      try {
        if (process.env.SATURDAY_JSON) {
          const result = await syncUiCache();
          json(result);
          return;
        }

        out("🔄 Syncing component cache from 21st.dev...");
        const result = await syncUiCache();
        success(`✅ Synced ${result.count} components.`);
        info(`Cache location: ${result.cachePath}`);
      } catch (err: any) {
        error(err.message);
        process.exit(1);
      }
    });

  // saturday ui categories
  ui
    .command("categories")
    .description("List available component categories")
    .action(async () => {
      try {
        const cache = await getUiCache();
        const categories = new Set<string>();
        (cache?.components || []).forEach((c: any) => {
          (c.tags || []).forEach((t: string) => categories.add(t));
        });

        if (process.env.SATURDAY_JSON) {
          json([...categories].sort());
          return;
        }

        out(`\n📂 Categories (${categories.size}):\n`);
        [...categories].sort().forEach((cat: string) => {
          const count = (cache?.components || []).filter((c: any) => (c.tags || []).includes(cat)).length;
          out(`  • ${cat} (${count} components)`);
        });
        out("");
      } catch (err: any) {
        error(err.message);
        process.exit(1);
      }
    });

  // saturday ui info <component>
  ui
    .command("info <component>")
    .description("Show detailed component information")
    .action(async (componentName: string, options) => {
      try {
        const comp = await getUiComponent(componentName, options);
        if (!comp) {
          error(`Component not found: ${componentName}`);
          process.exit(1);
        }

        if (process.env.SATURDAY_JSON) {
          json(comp);
          return;
        }

        out(`\n📦 ${comp.name}\n`);
        out(`  Description: ${comp.description || "N/A"}`);
        out(`  Author: ${comp.author || "N/A"}`);
        out(`  Downloads: ${comp.downloads || 0}`);
        out(`  Tags: ${comp.tags?.join(", ") || "N/A"}`);
        out(`  Dependencies: ${comp.dependencies ? Object.entries(comp.dependencies).map(([k, v]) => `${k}@${v}`).join(", ") : "None"}`);
        out(`  License: ${comp.license || "MIT"}`);
        out(`  Source: ${comp.source || "21st.dev"}`);
        out("");
      } catch (err: any) {
        error(err.message);
        process.exit(1);
      }
    });
}
