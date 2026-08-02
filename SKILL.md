---
name: studio-build
description: "Autonomous build pipeline: idea -> reverse-prompt -> all-encompassing PRD -> parallel TDD build -> strict CI/CD -> ship. Use when the user gives a product idea and wants it built autonomously with parallel agents and hard CI gates."
version: 1.0.0
author: app-dev-studio
license: MIT
metadata:
  hermes:
    tags: [autonomous, build-pipeline, prd, parallel-agents, cicd, orchestration]
    related_skills: [plan, software-prd-authoring, github-pr-workflow, requesting-code-review, systematic-debugging, simplify-code, claude-code, codex, opencode]
---

# StudioForge — Autonomous Build Orchestrator

Run a product idea from a one-liner to a shipped, CI-gated build using parallel agents.
Inspired by Anthropic's parallel-agent compiler build, the Everything Claude Code
config collection, and our PRD/plan/PR skills.

## Core principle

**Tests are the verifier. If the verifier is weak, agents solve the wrong problem.**
Every task is TDD: write the failing test, make it pass, open a PR, merge only on green.

## Pipeline (run these stages in order)

### S1 — Reverse-Prompt (expand the idea)
Load `agents/reverse-prompt.md`. Goal: turn the one-line idea into `brief.md`:
problem, target users, differentiators, constraints, tech leanings, success metrics,
risks, explicit scope (in/out), open questions.
- Use the **firecrawl** MCP (self-hosted `firecrawl-api-1:3002`) to research the space.
- Use **context7** to record *current* major versions of any libraries you'd lean on
  (so the build uses fresh APIs, not memorized old ones).
  **Egress fallback:** in sandboxes where context7's API host is unreachable, use
  `web_extract`/`web_search` (the agent web tools have egress) or the self-hosted
  **Firecrawl** MCP (has its own egress) to verify versions instead — same search-first rule.
- Only use `clarify` for genuinely blocking unknowns (cannot proceed otherwise).

### S2 — PRD (all-encompassing)
Run the `software-prd-authoring` skill against `brief.md`. Output:
- `product/PRD.md` (use `templates/PRD.md` as the skeleton; fill all 30 sections)
- `product/DESIGN.md` — use the **excalidraw/figma** MCP to produce architecture
  diagram + screen/flow wireframes; embed as markdown + asset links.
- `product/ARCHITECTURE.md` — module boundaries, data flow, tech-stack recommendation.
Do NOT skip failure/empty/loading/permission/error states. Do NOT assume integrations.

### S3 — Plan (bite-sized, TDD)
Run the `plan` skill against `product/PRD.md`. Emit:
- A kanban board seeded with one task per bite-sized unit (2–5 min each).
- `task-manifest.json` (id, title, files, test command, acceptance, deps, status).
Each task = write failing test → implement → verify → commit.

### S4 — Parallel Build (the autonomous loop)
1. **Dispatcher** (a `cron` job or this session) claims the next `ready` task from the
   kanban board (atomic claim — replaces Anthropic's file-lock).
2. For each claimed task, spawn a worker. Default: `delegate_task(goal, context,
   toolsets=['terminal','file','web','skills'])` (max 3 concurrent).
   For >3 concurrency, spawn `tmux` sessions running `hermes -w` (worktree mode) so
   each worker has an isolated git worktree — replaces Anthropic's Docker containers.
3. Worker follows `agents/builder.md` + `AGENT.md`: TDD, run tests, open a PR per task,
   push, then claim the next task. Loop until the board is empty.
4. Workers write a `learnings/` post-mortem for any dead-end approach (continuous learning).

### S5 — CI/CD Gate
The PR triggers `.github/workflows/ci.yml`. Required green: lint, typecheck,
unit+integration tests, production build, security scan (gitleaks + semgrep),
coverage floor, conventional-commit lint. Red = blocked, never merged.

### S6 — Review
- Run `requesting-code-review` (security scan + quality gates + auto-fix).
- Run `agents/reviewer.md` (fresh-model code + security review that tries to *refute*
  the implementation). Use `systematic-debugging` on any failure; reopen as a task.

### S7 — Merge & Verify
- `gh pr merge --auto --squash --delete-branch` when all checks pass.
- Re-run the PRD acceptance criteria; any regression reopens a fix task on the board.

### S8 — Ship
- Optional deploy hook. Use the **postiz** MCP to announce the release.

## Hard rules (do not violate)
- Never commit directly to `main`. Every task = its own PR.
- TDD always: failing test committed before the implementation.
- Search-first: verify package versions via context7/firecrawl before importing.
- Atomic kanban claims only — never two workers on one task.
- Time-blindness guard: every test/build command has an explicit timeout; print
  incremental progress, never thousands of unreadable bytes.
- Context hygiene: log `ERROR <reason>` on one line; keep PRD/AGENT.md in repo root
  so fresh workers have context.

## Failure handling
- CI red → `github-pr-workflow` auto-fix loop (max 3 attempts) then `clarify` if stuck.
- Worker crash → kanban dispatcher reclaims the stale claim after `failure_limit`.
- Stuck board → escalate to user with the exact blocker, not a vague status.
