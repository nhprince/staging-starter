# Karpathy Rules SKILL

## When to Use This Skill
Use before every coding task. These are non-negotiable rules.

## The Rules

### RULE 1 — PLAN BEFORE CODE
Never write a single line of code until:
- You have stated the complete plan
- NH Prince has approved the plan
- You have identified all files to be created/modified

### RULE 2 — SMALL FOCUSED FUNCTIONS
- Functions: max 50 lines
- Files: max 400 lines
- One responsibility per function
- If it's getting complex, break it apart

### RULE 3 — TESTS BEFORE FIXING BUGS
- Never fix a bug without first writing a failing test
- The test must fail → fix → test passes
- Commit the test with the fix

### RULE 4 — UNDERSTAND BEFORE USING
- Never use a library feature you haven't verified exists
- Check the actual docs / package version
- Don't assume, verify with terminal commands

### RULE 5 — COMMIT DISCIPLINE
- Commit after every logical unit of work
- Commit message: `type(scope): description`
- Never commit broken code
- Always verify deploy worked before reporting success

### RULE 6 — RAM DISCIPLINE (VPS-specific)
- Never run `pnpm install` or `pnpm build` on VPS directly
- Always use GitHub Actions for build operations
- Check `free -h` before starting any heavy process
- If RAM < 200MB free, trigger GH Actions instead

### RULE 7 — CONTEXT DISCIPLINE
- Read relevant skill files before starting a task
- Don't load entire codebase into context unnecessarily
- Use `delegate_task` for parallel work
- Summarize results, don't dump raw output

## Verification Checklist
- [ ] Plan stated and approved before coding
- [ ] Functions are small and focused
- [ ] Tests written before bug fixes
- [ ] Commits are atomic and descriptive
- [ ] No heavy builds on VPS
- [ ] Context window used efficiently
