/**
 * saturday projects — List all projects
 */

import { Command } from "commander";
import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { out, success, error, info, json } from "../lib/utils.js";

export function registerProjectsCommand(program: Command) {
  program
    .command("projects")
    .description("List all Saturday projects")
    .action(async () => {
      try {
        const projectsDir = join(homedir(), "projects");
        if (!existsSync(projectsDir)) {
          info("No projects yet. Run `saturday new` to create one.");
          return;
        }

        const projects = readdirSync(projectsDir, { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .map((d) => d.name);

        if (projects.length === 0) {
          info("No projects yet. Run `saturday new` to create one.");
          return;
        }

        if (process.env.SATURDAY_JSON) {
          json({ projects });
          return;
        }

        out("");
        info("📁 Saturday Projects:");
        out("");
        for (const name of projects) {
          const configPath = join(projectsDir, name, "saturday.yaml");
          if (existsSync(configPath)) {
            info(`  📦 ${name}`);
          } else {
            info(`  📁 ${name} (no saturday.yaml)`);
          }
        }
        out("");

      } catch (e: any) {
        error(e.message);
        process.exit(1);
      }
    });
}
