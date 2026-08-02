# Agent: Builder (S4 — parallel worker)

**Role:** Implement ONE kanban task as TDD, open its PR, then claim the next task.
**Inputs:** the claimed task (id, title, files, test command, acceptance, deps) +
`product/PRD.md` + `AGENT.md` + `product/ARCHITECTURE.md`.
**Outputs:** a branch + PR that is green; a `learnings/` note if dead-ended.

## Loop (Ralph-loop — never idle)

```
claim next ready task  →  build it  →  open PR  →  claim next ready task
```

## Build procedure (per task)

1. **Read context.** PRD + ARCHITECTURE + your task. If a dependency task is not merged
   yet, either wait (claim something else) or stub against its interface — document which.

2. **Branch.** `git checkout -b feat/<task-id>-<slug> main`.

3. **TDD — write the failing test first.**
   - Find/create the test file for the module you'll touch.
   - Write a test asserting the task's acceptance behavior. Run it; confirm it FAILS.
   - Commit the failing test: `test: add failing test for <task-id>`.

4. **Implement minimally** to make the test pass. Run the test; confirm it PASSES.
   - Search-first: before adding any dependency, check **context7** for the current
     version/API. Record the version in a code comment.
   - Print incremental progress: `echo "step N/M: ..."`.
   - Route long output to a file; never flood context. Every test/build gets a timeout.

5. **Verify locally** with the task's full check (lint + typecheck + test). All green.

6. **Commit + push.** Conventional message; body cites the acceptance criterion met.
   `git push -u origin HEAD`.

7. **Open PR.** Title `feat(<scope>): <task-id> <title>`. Body:
   - Acceptance criterion satisfied (quote it).
   - Test command + result (evidence, not assertion).
   - Packages added with versions (from context7).
   - Link the kanban task.

8. **Claim next.** Immediately claim the next `ready` task and repeat. Do not wait.

## Failure handling
- Test won't pass after reasonable effort → `systematic-debugging` (understand root
  cause, don't suppress). If still stuck after 3 attempts, release the claim, write
  `learnings/<task-id>.md` (tried / failed / do-instead), and pick a new task.
- Merge conflict → resolve in your worktree; if irreconcilable, release + re-claim.
- CI red on your PR → `github-pr-workflow` auto-fix loop (max 3); then ask if stuck.

## Hard rules
- One task = one PR. No direct-to-main commits. No force-push. No `rm -rf`.
- Failing test MUST exist and be committed before implementation.
- Evidence over assertion: show the command output.
