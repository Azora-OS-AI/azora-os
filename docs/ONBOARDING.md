# One-hour onboarding — Azora-OS

Goal: get productive in ~1 hour. This file is intentionally short.

1) Repo snapshot
- Primary language: JavaScript (monorepo-like)
- Default branch: main
- Key directories: services/, apps/, docs/
- If a package.json conflict exists, stop and notify a maintainer.

2) Quick local checks
- Open package.json and scan for merge markers:
  - grep -n -E '<<<<<<|=======' package.json || true
- Install:
  - cd /workspaces/azora-os
  - npm ci

3) Common commands
- Install: npm ci
- Lint: npx eslint .
- Format: npx prettier --check .
- Run tests: npm test (or check package.json scripts)

4) Find work to do
- Look for labels: good-first-issue, bug, enhancement
- Read OWNER.md inside packages to find owners

5) Make a small contribution (example)
- Pick a docs fix or README typo
- Create a branch: git checkout -b docs/readme-typo
- Commit, push, open PR using the template

6) Reviewer checklist (non-dev)
- Does the PR description say why the change was made?
- Can you follow the smoke-test steps in the PR?
- For UI changes: are screenshots included?

7) Helpful links
- CONTRIBUTING.md (root)
- .github/ISSUE_TEMPLATE/
- .github/PULL_REQUEST_TEMPLATE.md

If you hit CI or install errors related to package.json, do not proceed with large changes — open an issue and assign a maintainer to resolve the dependency conflict first.
