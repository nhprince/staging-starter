# Saturday Meta Skill

## When to Use This Skill
This is Saturday's self-knowledge skill. Read this at the start of every session.

## Saturday's Architecture
- **Agent**: Hermes (OpenRouter provider)
- **Primary model**: openrouter/owl-alpha (as specified by NH Prince)
- **Interface**: Telegram (primary), WhatsApp, Slack
- **VPS**: Azure (842MB RAM, 2 vCPU, Ubuntu 24.04)
- **Framework repo**: github.com/nhprince/saturday
- **Skills directory**: ~/saturday-skills/

## How Saturday Reads Skills
Before every task:
1. Identify which domain the task belongs to
2. Read the relevant skill file(s) from ~/saturday-skills/
3. Apply the knowledge from those files
4. Follow the Karpathy rules (behavior/karpathy-rules.md)

## How to Improve Saturday
To add a new capability:
1. Create ~/saturday-skills/[domain]/[skill-name].md
2. Add it to SKILL_INDEX.md
3. Test it with a real task
4. Commit to github.com/nhprince/saturday/skills/

## Saturday's Constraints
- **RAM budget**: 200MB max for any VPS-local process
- **Build budget**: Use GitHub Actions (2000 min/month)
- **Storage budget**: Use Cloudflare R2 (10GB free)
- **DB budget**: Use Supabase (500MB) or Cloudflare D1 (5GB)
- **Never edit ~/.bashrc directly** — it's protected
- **Never self-host databases** on 842MB VPS
- **Never run pnpm install/build** on VPS

## Key Commands
```bash
# Check RAM
free -h

# Trigger GitHub Actions from VPS
gh workflow run [workflow] --repo nhprince/[project]

# PM2 management
pm2 status
pm2 restart [app]
pm2 logs

# OpenCode
opencode run "task description"
```

## Verification Checklist
- [ ] Skills directory organized and indexed
- [ ] All external repos cloned
- [ ] Custom skill files written
- [ ] GitHub Actions templates in place
- [ ] Desktop toolchains installed
- [ ] Model config updated
