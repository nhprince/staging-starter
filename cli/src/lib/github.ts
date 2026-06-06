/**
 * GitHub repository creation and management
 */

import { success, warn, info, error, run } from "./utils.js";

export async function createGitHubRepo(name: string, projectDir: string): Promise<void> {
  info(`🐙 Creating GitHub repo: nhprince/${name}`);

  try {
    // Check gh auth
    run("gh auth status");
  } catch {
    error("GitHub CLI not authenticated. Run `gh auth login` first.");
    throw new Error("GitHub authentication required");
  }

  try {
    run(`gh repo create nhprince/${name} --public --source=. --push`, { cwd: projectDir });
    success(`GitHub repo created: github.com/nhprince/${name}`);
  } catch (e: any) {
    // If repo already exists, just push
    if (e.message.includes("already exists")) {
      warn("Repo already exists, pushing to existing repo...");
      run(`git remote add origin https://github.com/nhprince/${name}.git`, { cwd: projectDir });
      run("git push -u origin main", { cwd: projectDir });
      success("Code pushed to existing repo");
    } else {
      throw e;
    }
  }
}
