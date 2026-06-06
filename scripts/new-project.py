#!/usr/bin/env python3
"""
Staging Starter — Project Generator
Creates a new project from framework blueprints.

Usage:
    python3 new-project.py --type blog --name my-blog
    python3 new-project.py --type saas --name my-saas --auth clerk --payments stripe
    python3 new-project.py  # Interactive mode
"""

import argparse
import os
import shutil
import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime

# Framework root (where this script lives)
FRAMEWORK_ROOT = Path(__file__).parent.parent

# Available options
PROJECT_TYPES = ["blog", "saas", "portfolio", "api", "ecommerce", "landing"]
FRONTENDS = ["nextjs", "astro", "sveltekit", "static-html"]
BACKENDS = ["hono-workers", "python-vps", "php-vps"]
DATABASES = ["d1", "postgres-vps", "supabase", "planetscale"]
AUTH_PROVIDERS = ["none", "clerk", "authjs", "lucia"]
EXTRA_MODULES = ["cms", "comments", "payments-stripe", "email", "file-upload", "analytics"]

# Defaults per project type
DEFAULTS = {
    "blog":     {"frontend": "nextjs", "backend": "hono-workers", "db": "d1", "auth": "clerk"},
    "saas":     {"frontend": "nextjs", "backend": "hono-workers", "db": "d1", "auth": "clerk"},
    "portfolio":{"frontend": "nextjs", "backend": "hono-workers", "db": "d1", "auth": "none"},
    "api":      {"frontend": "nextjs", "backend": "hono-workers", "db": "d1", "auth": "none"},
    "ecommerce":{"frontend": "nextjs", "backend": "hono-workers", "db": "d1", "auth": "clerk"},
    "landing":  {"frontend": "nextjs", "backend": "hono-workers", "db": "d1", "auth": "none"},
}

EXTRA_DEFAULTS = {
    "blog": ["cms", "email"],
    "saas": ["payments-stripe", "email", "analytics"],
    "portfolio": ["email"],
    "api": ["email"],
    "ecommerce": ["payments-stripe", "email", "file-upload"],
    "landing": ["email"],
}


def print_banner():
    print("""
╔══════════════════════════════════════════════════════╗
║  🏗️  Staging Starter — Project Generator            ║
║  Build any web project. 100% free infrastructure.   ║
╚══════════════════════════════════════════════════════╝
""")


def ask_choice(prompt, options, default=None):
    """Ask user to choose from a list of options."""
    print(f"\n{prompt}")
    for i, opt in enumerate(options, 1):
        marker = " ← default" if opt == default else ""
        print(f"  {i}. {opt}{marker}")
    while True:
        choice = input(f"  Choice [{options.index(default) + 1 if default else 1}]: ").strip()
        if not choice and default:
            return default
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(options):
                return options[idx]
        except ValueError:
            if choice in options:
                return choice
        print(f"  Invalid choice. Please enter 1-{len(options)} or the option name.")


def ask_yes_no(prompt, default=True):
    """Ask a yes/no question."""
    suffix = " [Y/n]: " if default else " [y/N]: "
    answer = input(prompt + suffix).strip().lower()
    if not answer:
        return default
    return answer in ("y", "yes")


def copy_blueprint(src, dest, project_name, replacements=None):
    """Copy a blueprint directory, replacing placeholders."""
    if not src.exists():
        print(f"  ⚠️  Blueprint not found: {src}")
        return

    dest.mkdir(parents=True, exist_ok=True)

    for item in src.iterdir():
        if item.is_dir():
            copy_blueprint(item, dest / item.name, project_name, replacements)
        else:
            content = item.read_text()
            if replacements:
                for key, val in replacements.items():
                    content = content.replace(key, val)
            (dest / item.name).write_text(content)


def scaffold_project(project_type, name, frontend, backend, db, auth, extras, interactive=False):
    """Scaffold a new project from blueprints."""

    project_dir = Path.home() / "projects" / name

    if project_dir.exists():
        print(f"\n❌ Directory already exists: {project_dir}")
        if not ask_yes_no("Overwrite?", default=False):
            print("Aborted.")
            return False

    print(f"\n🔨 Scaffolding {project_type}: {name}")
    print(f"   Frontend: {frontend}")
    print(f"   Backend:  {backend}")
    print(f"   Database: {db}")
    print(f"   Auth:     {auth}")
    print(f"   Extras:   {', '.join(extras) if extras else 'none'}")

    # Create project directory
    project_dir.mkdir(parents=True, exist_ok=True)

    replacements = {
        "{{PROJECT_NAME}}": name,
        "{{PROJECT_TYPE}}": project_type,
        "{{FRONTEND}}": frontend,
        "{{BACKEND}}": backend,
        "{{DATABASE}}": db,
        "{{AUTH}}": auth,
        "{{DATE}}": datetime.now().strftime("%Y-%m-%d"),
    }

    # 1. Copy scaffold
    scaffold_src = FRAMEWORK_ROOT / "scaffolds" / project_type
    if scaffold_src.exists():
        print(f"\n  📦 Copying scaffold: {project_type}")
        copy_blueprint(scaffold_src, project_dir, name, replacements)

    # 2. Copy frontend
    frontend_src = FRAMEWORK_ROOT / "frontends" / frontend
    if frontend_src.exists():
        print(f"  🎨 Copying frontend: {frontend}")
        frontend_dest = project_dir / "frontend"
        copy_blueprint(frontend_src, frontend_dest, name, replacements)

    # 3. Copy backend
    backend_src = FRAMEWORK_ROOT / "backends" / backend
    if backend_src.exists():
        print(f"  ⚙️  Copying backend: {backend}")
        backend_dest = project_dir / "backend"
        copy_blueprint(backend_src, backend_dest, name, replacements)

    # 4. Copy database schema
    db_src = FRAMEWORK_ROOT / "databases" / db / "schema.sql"
    if db_src.exists():
        print(f"  🗄️  Copying database schema: {db}")
        db_dest = project_dir / "database"
        db_dest.mkdir(parents=True, exist_ok=True)
        shutil.copy2(db_src, db_dest / "schema.sql")

    # 5. Copy auth module
    if auth != "none":
        auth_src = FRAMEWORK_ROOT / "auth" / auth
        if auth_src.exists():
            print(f"  🔒 Copying auth: {auth}")
            auth_dest = project_dir / "auth"
            copy_blueprint(auth_src, auth_dest, name, replacements)

    # 6. Copy extra modules
    for extra in extras:
        module_src = FRAMEWORK_ROOT / "modules" / extra
        if module_src.exists():
            print(f"  📎 Copying module: {extra}")
            module_dest = project_dir / "modules" / extra
            copy_blueprint(module_src, module_dest, name, replacements)

    # 7. Copy deploy config
    deploy_src = FRAMEWORK_ROOT / "deploy"
    if deploy_src.exists():
        deploy_dest = project_dir / ".github" / "workflows"
        deploy_dest.mkdir(parents=True, exist_ok=True)
        # Copy the main deploy workflow
        main_workflow = FRAMEWORK_ROOT / ".github" / "workflows" / "deploy.yml"
        if main_workflow.exists():
            shutil.copy2(main_workflow, deploy_dest / "deploy.yml")

    # 8. Create project README
    readme_content = f"""# {name}

{project_type.capitalize()} project built with Staging Starter Framework.

## Stack
- **Frontend:** {frontend}
- **Backend:** {backend}
- **Database:** {db}
- **Auth:** {auth}

## Quick Start

```bash
# Install dependencies
pnpm install

# Start frontend
pnpm dev:frontend

# Start backend
pnpm dev:backend
```

## Deployment
Push to `main` → auto-deploys to Cloudflare.

## Generated
- Date: {datetime.now().strftime("%Y-%m-%d %H:%M")}
- Framework: Staging Starter
"""
    (project_dir / "README.md").write_text(readme_content)

    # 9. Create package.json if not exists
    if not (project_dir / "package.json").exists():
        pkg = {
            "name": name,
            "version": "1.0.0",
            "private": True,
            "scripts": {
                "dev:frontend": "cd frontend && pnpm dev",
                "dev:backend": "cd backend && pnpm dev",
                "build:frontend": "cd frontend && pnpm build",
                "build:backend": "cd backend && pnpm build",
            },
            "devDependencies": {}
        }
        (project_dir / "package.json").write_text(json.dumps(pkg, indent=2))

    print(f"\n✅ Project scaffolded: {project_dir}")
    return True


def create_github_repo(name, project_dir):
    """Create GitHub repository and push."""
    print(f"\n🐙 Creating GitHub repo: nhprince/{name}")
    try:
        subprocess.run(
            ["gh", "repo", "create", f"nhprince/{name}", "--public", "--source=.", "--push"],
            cwd=project_dir,
            check=True,
            capture_output=True,
            text=True
        )
        print(f"  ✅ GitHub repo created and code pushed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ⚠️  GitHub repo creation failed: {e.stderr}")
        print(f"  You can create it manually: gh repo create nhprince/{name} --public")
        return False


def setup_cloudflare(name):
    """Set up Cloudflare resources."""
    print(f"\n☁️  Setting up Cloudflare resources...")

    try:
        # Create KV namespace
        result = subprocess.run(
            ["wrangler", "kv", "namespace", "create", f"{name.upper().replace('-', '_')}-KV"],
            capture_output=True, text=True
        )
        print(f"  ✅ KV namespace created")

        # Create D1 database
        result = subprocess.run(
            ["wrangler", "d1", "create", f"{name}-db"],
            capture_output=True, text=True
        )
        print(f"  ✅ D1 database created")

        # Create Pages project
        result = subprocess.run(
            ["wrangler", "pages", "project", "create", name, "--production-branch=main"],
            capture_output=True, text=True
        )
        print(f"  ✅ Pages project created")

        return True
    except Exception as e:
        print(f"  ⚠️  Cloudflare setup incomplete: {e}")
        print(f"  Set up manually at dash.cloudflare.com")
        return False


def main():
    parser = argparse.ArgumentParser(description="Staging Starter — Project Generator")
    parser.add_argument("--type", choices=PROJECT_TYPES, help="Project type")
    parser.add_argument("--name", help="Project name (kebab-case)")
    parser.add_argument("--frontend", choices=FRONTENDS, help="Frontend framework")
    parser.add_argument("--backend", choices=BACKENDS, help="Backend runtime")
    parser.add_argument("--db", choices=DATABASES, help="Database")
    parser.add_argument("--auth", choices=AUTH_PROVIDERS, help="Auth provider")
    parser.add_argument("--extras", nargs="*", choices=EXTRA_MODULES, help="Extra modules")
    parser.add_argument("--no-github", action="store_true", help="Skip GitHub repo creation")
    parser.add_argument("--no-cloudflare", action="store_true", help="Skip Cloudflare setup")
    parser.add_argument("--interactive", "-i", action="store_true", help="Interactive mode")

    args = parser.parse_args()

    print_banner()

    # Interactive mode
    if args.interactive or not args.type:
        print("Interactive mode — answer the questions:\n")

        project_type = ask_choice("Project type?", PROJECT_TYPES)
        name = input("\nProject name (kebab-case): ").strip()
        while not name:
            name = input("Project name (required): ").strip()

        defaults = DEFAULTS[project_type]
        extras_default = EXTRA_DEFAULTS.get(project_type, [])

        if ask_yes_no("\nUse default configuration?", default=True):
            frontend = defaults["frontend"]
            backend = defaults["backend"]
            db = defaults["db"]
            auth = defaults["auth"]
            extras = extras_default
        else:
            frontend = ask_choice("Frontend?", FRONTENDS, defaults["frontend"])
            backend = ask_choice("Backend?", BACKENDS, defaults["backend"])
            db = ask_choice("Database?", DATABASES, defaults["db"])
            auth = ask_choice("Auth?", AUTH_PROVIDERS, defaults["auth"])

            extras = []
            available = [e for e in EXTRA_MODULES if e in extras_default]
            if available and ask_yes_no("Add extra modules?", default=True):
                for mod in available:
                    if ask_yes_no(f"  Add {mod}?", default=True):
                        extras.append(mod)
    else:
        project_type = args.type
        name = args.name
        if not name:
            print("❌ --name is required")
            sys.exit(1)

        defaults = DEFAULTS[project_type]
        frontend = args.frontend or defaults["frontend"]
        backend = args.backend or defaults["backend"]
        db = args.db or defaults["db"]
        auth = args.auth or defaults["auth"]
        extras = args.extras or EXTRA_DEFAULTS.get(project_type, [])

    # Scaffold
    project_dir = Path.home() / "projects" / name
    success = scaffold_project(project_type, name, frontend, backend, db, auth, extras)

    if not success:
        sys.exit(1)

    # GitHub repo
    if not args.no_github:
        if ask_yes_no("\nCreate GitHub repository?", default=True):
            create_github_repo(name, project_dir)

    # Cloudflare setup
    if not args.no_cloudflare:
        if ask_yes_no("\nSet up Cloudflare resources?", default=True):
            setup_cloudflare(name)

    # Summary
    print(f"""
╔══════════════════════════════════════════════════════╗
║  ✅ Project Ready!                                  ║
╠══════════════════════════════════════════════════════╣
║  📁 Local:   ~/projects/{name}
║  🌐 GitHub:  github.com/nhprince/{name}
║  ☁️  Pages:   https://{name}.pages.dev
║  ⚡ Worker:  https://{name}.workers.dev
╚══════════════════════════════════════════════════════╝

Next steps:
  cd ~/projects/{name}
  pnpm install
  # Edit code, then:
  git add -A && git commit -m "..." && git push
""")


if __name__ == "__main__":
    main()
