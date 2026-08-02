# StudioForge — Autonomous Build System

> Idea → Reverse-Prompt → All-Encompassing PRD → Parallel Build → Strict CI/CD → Ship.
> A drop-in kit for the app-dev studio. Grounded in three references and our own system-building skills.

## Why this design (the references)

1. **Anthropic "Building a C compiler with a team of parallel Claudes"** (Feb 2026) — 16 agents, ~2,000 sessions, $20k, a 100k-line Rust compiler that boots Linux. The *harness* lessons are the backbone of this system:
   - **Loop, don't block.** Agents must pick up the next task the instant one finishes (Ralph-loop). We use a `cron` dispatcher + `tmux`-spawned `hermes -w` workers, not one blocking turn.
   - **Tests are the verifier.** "If the task verifier is imperfect, Claude solves the wrong problem." We make TDD + CI the hard gate; nothing merges red.
   - **Write for the agent, not yourself.** Fresh containers have zero context. We ship an `AGENT.md` operating manual + per-task context files + extensive READMEs.
   - **Context hygiene.** Log `ERROR <reason>` on one grep-able line, print a few lines not thousands, pre-compute aggregate stats, and mitigate time-blindness (explicit test timeouts + incremental progress prints).
   - **Parallel coordination without an orchestrator.** Each agent took a file "lock" in `current_tasks/`; git sync forced conflicts. We replace file-locks with **kanban atomic claims** and Docker-containers with **git worktrees**.

2. **Everything Claude Code (Anthropic hackathon winner)** — the production config collection (13 agents, 50+ skills, hooks, rules, MCPs). We adopt its *shape*:
   - **Agents**: planner, architect, tdd-guide, code-reviewer, security-reviewer (mapped to our pipeline roles).
   - **Hooks**: `PostToolUse` auto-lint/format, `PreToolUse` security gate (block `rm -rf`/force-push/secret writes), `Stop` verification gate.
   - **Rules**: `common/` language-agnostic + per-language (`typescript/`, `python/`, `golang/`).
   - **Continuous learning**: workers append failure post-mortems to a `learnings/` log the next run consumes.

3. **Claude Code best practices** — *give the agent a check it can run*; *explore → plan → code → commit*; *be specific in prompts*; *manage the context window*. Our `plan` and `software-prd-authoring` skills encode explore-plan-code; the PRD is the "specific context."

4. **Our own skills** — `plan` (bite-sized TDD tasks), `software-prd-authoring` (30-section PRD), `github-pr-workflow` (branch→PR→CI→merge), `requesting-code-review`, `systematic-debugging`, `simplify-code`, `claude-code`/`codex`/`opencode` (heavy-coding delegation), `hermes-agent` (delegation/kanban/cron native primitives).

## Architecture

```
┌─────────────┐
│  S0 Intake  │  idea string + constraints (chat / webhook / issue)
└──────┬──────┘
       ▼
┌──────────────────┐  Firecrawl + Context7 + clarify (blocking unknowns)
│ S1 Reverse-Prompt│  → brief.md (problem, users, differentiators, constraints,
│  (expand idea)   │     tech leanings, success metrics, risks, scope)
└──────┬───────────┘
       ▼
┌──────────────────┐  software-prd-authoring + design MCP (Excalidraw/Figma)
│ S2 PRD           │  → product/PRD.md, product/DESIGN.md (wireframes),
│  (all-encompassing)│  product/ARCHITECTURE.md
└──────┬───────────┘
       ▼
┌──────────────────┐  plan skill → bite-sized TDD tasks
│ S3 Plan          │  → kanban board + task-manifest.json
└──────┬───────────┘
       ▼
┌──────────────────────────────────────────────────────────┐
│ S4 Parallel Build  (cron dispatcher + N tmux hermes -w)     │
│   kanban atomic-claim  →  worktree per worker  →  TDD  →  PR │
└──────┬───────────────────────────────────────────────────┘
       ▼
┌──────────────────┐  strict GitHub Actions (lint, typecheck, test+coverage,
│ S5 CI/CD Gate    │  build, security scan, conventional-commit). Red = blocked.
└──────┬───────────┘
       ▼
┌──────────────────┐  requesting-code-review + security-reviewer + verify subagent
│ S6 Review        │  systematic-debugging on any failure → re-open task
└──────┬───────────┘
       ▼
┌──────────────────┐  auto-merge --squash on green; re-run PRD acceptance criteria
│ S7 Merge & Verify│  regressions → new fix task on board
└──────┬───────────┘
       ▼
┌──────────────────┐  deploy hook (optional) + Postiz announce (already wired)
│ S8 Ship          │
└──────────────────┘
```

## Parallelism model (Hermes-native, maps Anthropic's container+lock design)

| Anthropic pattern | StudioForge equivalent |
|---|---|
| 16 Docker containers on shared git repo | N `tmux` sessions running `hermes -w` (worktree mode) |
| File "lock" in `current_tasks/` | **Kanban atomic claim** (`kanban` toolset, `HERMES_KANBAN_TASK`) |
| Fresh container = no context | `AGENT.md` + per-task context file + PRD in repo root |
| `claude` Ralph-loop | `cron` dispatcher re-prompts workers until board empty |
| CI blocks breaking commits | `ci.yml` + branch protection + `gh pr merge --auto` only on green |

Default concurrency is 3 (`delegation.max_concurrent_children`). For >3, spawn additional `tmux` `hermes -w` worker processes; the kanban dispatcher reclaims stale claims automatically.

## Strict CI/CD rules (non-negotiable)

- Every task lands as its **own PR** (never direct-to-main).
- Green required on: lint, type-check, unit+integration tests, production build, **security scan** (gitleaks + semgrep/CodeQL), and a **coverage floor** (fail if coverage drops >1% or below threshold).
- **Conventional Commits** enforced; PR title must match.
- **Max PR size** limit (e.g. 800 lines) — oversized PRs are auto-split by the dispatcher.
- No force-push to `main`; `PreToolUse` hook blocks `rm -rf`, secret writes, `--force`.
- `gh pr merge --auto --squash --delete-branch` only when all checks pass.

## MCPs to add (per your ask: design + fresh packages)

| MCP | Purpose | Status |
|---|---|---|
| **context7** (`upstash/context7-mcp`) | Current library docs → agents use **updated** APIs, not ancient ones | **ADD** |
| **github** (official GitHub MCP) | Issue/PR/repo ops beyond our `github-*` skills | **ADD** |
| **excalidraw** or **figma** | Architecture + screen wireframes in S2 | **ADD (design)** |
| **firecrawl** (self-hosted `firecrawl-api-1:3002`) | Web research for reverse-prompt | already healthy |
| **deepwiki** (optional) | Deep repo/package docs | optional |
| **postiz** | Distribution/announce on ship | already wired |

Plus a hard **"search-first" rule**: before importing any package, the builder must query Context7 (or Firecrawl) for the current major version and API surface; no coding against memorized old APIs.

## Files in this kit

| File | Role |
|---|---|
| `SKILL.md` | The orchestrator skill — the pipeline brain (install as a Hermes skill) |
| `AGENT.md` | Worker operating manual — Anthropic context-hygiene + verification rules |
| `agents/reverse-prompt.md` | S1 agent: expand idea → brief |
| `agents/builder.md` | S4 worker: TDD + PR per task |
| `agents/reviewer.md` | S6 agent: code + security review |
| `.github/workflows/ci.yml` | Strict CI gate |
| `mcp-servers.json` | MCP server config to load |
| `templates/PRD.md` | PRD skeleton (software-prd-authoring structure) |

## Getting started

```bash
# 1. Add MCPs (Context7 + GitHub + design)
hermes mcp add context7 --command "npx -y @upstash/context7-mcp"
hermes mcp add github  --command "npx -y @modelcontextprotocol/server-github"
hermes mcp add excalidraw --command "npx -y @matte-as/excalidraw-mcp"

# 2. Install the orchestrator skill
cp -r . ~/.hermes/skills/studio-build/   # (SKILL.md + agents/ + templates/)

# 3. Run an idea through the pipeline
hermes -s studio-build "Build a <idea>"
```
