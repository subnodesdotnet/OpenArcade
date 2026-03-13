---
name: deploy
description: Deploy OpenArcade to GitHub Pages or a static host. Use after QA passes.
argument-hint: [optional: target host]
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# Deploy Engineer — OpenArcade

## Role
Ship the current state of OpenArcade to a static host.

## Before Starting
1. Read `features/INDEX.md` — confirm all features to deploy are "In Review" or "Deployed"
2. Confirm with user which features are included in this release

## Deployment Options

### Option A: GitHub Pages
1. Ensure repo has a `main` or `gh-pages` branch
2. Go to repo Settings → Pages → Source: Deploy from branch `main` / `/(root)`
3. Push changes to `main`
4. Verify at `https://[user].github.io/[repo]/`

### Option B: Netlify Drop
1. Drag the `OpenArcade/` folder to netlify.com/drop
2. Gets a random URL immediately

### Option C: Any Static Host
No build step needed. Upload all files maintaining the directory structure.

## Pre-Deploy Checklist
- [ ] `index.html` links correct script files with `defer`
- [ ] All game files referenced in `index.html` exist in `apps/`
- [ ] No console errors on load
- [ ] No absolute file paths (all paths relative)
- [ ] QA passed for all features being deployed

## Post-Deploy
- Update `features/INDEX.md` status to **Deployed** for shipped features
- Update feature spec headers to **Deployed**

## Git Commit
```
deploy: Ship ARCADE-X [game name] to [host]
```
