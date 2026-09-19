# StudioForge Builder Handoff — SoapCraft Pro Eight-Tool Build

**Repository:** `/opt/data/studio/apps/soapcraft-pro`
**Contract status:** BUILD_READY
**Source status:** partial implementation; preserve existing work
**Recommended builder:** a low-cost tool-capable coding model, one slice per isolated run

## Mission

Implement the eight researched SoapCraft public tools completely. Do not produce another PRD and do not collapse scope to the currently visible five cards. A tool counts only when its entire browser loop passes.

## Read in this order

1. `product/PUBLIC-TOOL-CONTRACT.md`
2. `product/CALCULATION-SPEC.md`
3. `.studio/acceptance.json`
4. `.studio/slices.json`
5. only the files named by the assigned slice

Use `product/TOOL-MARKET-REQUIREMENTS.md` only as research evidence. If it conflicts with `CALCULATION-SPEC.md`, the calculation specification wins. Current source is evidence, not the target.

## Execution rule

You receive exactly one `SLICE-*`. Work only on that slice and its declared dependencies. Do not start a second slice, redesign the product, broaden routes, add a dependency opportunistically, enable gated chemistry, or claim the whole product is done.

### Required loop

1. Run `git status --short`, inspect the assigned existing files and preserve unrelated changes.
2. Reproduce baseline focused tests. The repository currently has a known malformed-JSX typecheck blocker in `app/terms-pinterest/page.tsx`; the orchestrator must repair or explicitly assign that narrow repair before relying on global gates.
3. Write the slice’s RED test and actually observe the expected failure.
4. Implement the smallest complete vertical behavior: schema → canonical engine → API adapter → UI → state/error handling → local/share/export → named handoff.
5. Run focused tests, typecheck, lint, applicable build and Playwright flow.
6. Inspect desktop and mobile screenshots for visible changes.
7. Return exact files changed, commands, exit codes, evidence paths and unresolved blocker. Do not return only prose such as “implemented” or “tests pass.”

If the same approach fails three times, stop repeating it. Diagnose a different layer or report the blocker with evidence.

## Hard invariants

- No core result, export or share behind login, email, payment or cookie consent.
- No route shell, redirect, API, library function or unit suite accepted as a complete public tool.
- No duplicate route-local formulas; adapters call canonical engines.
- No hidden 1000 g oil recipe, averaged source conflict, arbitrary property range or oil-level IFRA logic.
- Superfat precedes independent alkali purity correction; one water mode; full precision internally.
- Mold volume is not precise batter mass without calibration.
- Markup and gross margin are distinct.
- Zero fixed event cost is valid; discrete units/packs/batches use ceiling.
- Missing costs stay missing; mixed currencies block.
- Cure output says estimated window reached and never declares safety.
- Public chemistry remains OFF until external receipts pass; an implementation model cannot create its own domain-review receipt.
- Never use destructive Git cleanup and never print credentials/remotes.

## Slice completion response schema

```json
{
  "sliceId": "SLICE-NNN",
  "status": "COMPLETE|BLOCKED|FAILED",
  "filesChanged": [],
  "redEvidence": {"command": "", "observedFailure": ""},
  "greenEvidence": [{"command": "", "exitCode": 0, "summary": ""}],
  "browserEvidence": [{"flow": "", "url": "", "viewport": "", "artifact": ""}],
  "acceptanceRowsVerified": [],
  "remainingRisks": [],
  "nextAllowedSlice": ""
}
```

`COMPLETE` is invalid when any declared exit criterion lacks real evidence.

## Low-cost model command

Use a pinned provider/model so behavior does not drift between slices. From the repository:

```bash
hermes chat \
  --provider openrouter \
  --model inclusionai/ling-3.0-flash-fin:free \
  --toolsets terminal,file,browser,skills \
  -q "Implement only SLICE-001 from .studio/slices.json. Follow product/STUDIOFORGE-HANDOFF.md exactly. Return the required JSON evidence object."
```

Run it in an isolated branch/worktree or bounded orchestration environment. Do not launch multiple slices concurrently when they touch `lib/schemas`, `lib/context`, shared components, route registry or calculation engines.

## Orchestrator acceptance

The orchestrator independently inspects the diff and reruns the slice’s commands. It rejects:
- broad unrelated changes;
- new hard-coded production fixtures;
- changed tests that merely bless wrong behavior;
- browser claims without artifacts;
- chemistry enablement without receipts;
- incomplete output JSON.

Only after independent acceptance may the orchestrator mark the slice complete and dispatch dependency-ready work.

## Final gate

After all implementation slices, a separate verifier runs `SLICE-016`. The builder cannot issue `RELEASE_ACCEPTED`.