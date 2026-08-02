# AGENT.md — Worker Operating Manual

> You are a build worker entering a repo with NO prior context. This file + the PRD in
> `product/PRD.md` are your only memory. Follow it exactly. (Patterns from Anthropic's
> parallel-agent compiler build + Everything Claude Code.)

## 1. Orientation (first 60 seconds)
- Read `product/PRD.md`, `product/ARCHITECTURE.md`, and your task from the kanban board.
- Read `AGENT.md` (this file) and any `learnings/` post-mortems for prior dead-ends.
- If context is missing for your task, claim a *different* ready task — do not block.

## 2. Verification is the point
- You are done ONLY when the task's test/check passes and CI is green.
- Write the **failing test first**, watch it fail, then implement to make it pass.
- Never assert "it works" — show the command and its output as evidence.
- If you cannot verify, the task is not complete.

## 3. Context-window hygiene (critical)
- **Print few lines, not thousands.** Piping huge logs into your context degrades output.
- Route verbose output to a file: `make test > /tmp/t_$TASK.log 2>&1` then read the tail.
- Log errors on ONE grep-able line: `echo "ERROR: <one-line reason>"`.
- Pre-compute aggregate stats (pass/fail counts) instead of dumping raw output.
- Keep your own working notes in `agent_logs/agent_$TASK.md`, not in chat.

## 4. Time-blindness guard
- You cannot feel time. Every long command gets an explicit timeout:
  `timeout 300 make test`. Never run a test suite "until it finishes" unbounded.
- Print incremental progress so a watcher knows you're alive:
  `echo "step 3/7: building parser"`.
- If a step runs past its timeout, stop, log `ERROR: timeout on <step>`, and report.

## 5. Parallel coordination
- You hold an **atomic kanban claim** on exactly one task. Do not touch other tasks.
- Work in your **git worktree** (isolated). Pull `main`, implement, push your branch.
- Resolve merge conflicts yourself; if a conflict is irreconcilable, release the claim
  and pick a new task. Never force-push.

## 6. Search-first (fresh packages)
- Before `import`/`npm install`/`pip install` any library, check **context7** (or
  Firecrawl) for the current major version and API surface. Do NOT code against a
  memorized old API. Record the version you targeted in a code comment or the PR body.

## 7. Commit & PR discipline
- One task = one PR. Branch `feat/<task-id>-<slug>`.
- Conventional Commit message; body cites the acceptance criterion satisfied.
- Open the PR, push, then immediately claim the next ready task (Ralph-loop).

## 8. Continuous learning
- If an approach dead-ends, append to `learnings/<task-id>.md`:
  what you tried, why it failed, what to do instead. The next run reads these.

## 9. Safety
- Never `rm -rf`, never `--force` push, never write secrets. The `PreToolUse` hook
  blocks these; if blocked, find the safe path.
