# SoapCraft Pro — Contract Readiness

**Status:** `BUILD_READY`
**Implementation status:** `INCOMPLETE`
**Public release status:** `NOT_RELEASE_READY`
**Decision date:** 2026-09-11
**Normative formula contract:** `product/CALCULATION-SPEC.md` v2.0.0

## What is authorized

Engineering is authorized for all eight researched public tools: formulation, mold volume/capacity, recipe scaling, batch costing, wholesale pricing, craft-fair break-even, ready-by production planning and ingredient purchasing. The cross-tool Recipe/Batch Context, methodology, verified examples/templates, factual comparisons and canonical SEO shell are included because they are required to make those tools useful and discoverable.

Optional accounts/cloud sync, Seller Pack payment, subscriptions, CRM, social scheduling and native apps remain deferred and cannot block this build.

## Why the contract is build-ready

- `product/PUBLIC-TOOL-CONTRACT.md` defines exact public-tool inputs, outputs, formulas, failures, handoffs, fixtures and gates.
- `product/CALCULATION-SPEC.md` defines numerical semantics and safety boundaries.
- `product/PRD.md`, `FLOWS.md` and `ARCHITECTURE.md` agree on the eight-tool anonymous scope.
- `.studio/acceptance.json` has one user-observable contract per tool and support system plus 12 high-boundary flows.
- `.studio/slices.json` gives one bounded vertical slice per tool, explicit dependencies, allowed paths, RED tests, exit criteria and verification commands.

## Current implementation truth

The repository contains useful calculation modules, route adapters, tests and forms, but the public product is not complete. At contract issue:

- formulation is intentionally fail-closed and lacks release receipts;
- wholesale pricing lacks its canonical page and current adapter semantics are incomplete;
- production and purchasing public pages are retired redirects rather than tools;
- recipe scaling, mold, batch cost and craft-fair tools implement only part of their researched contracts;
- the public directory lists only a subset;
- local continuity, share/export and cross-tool context are incomplete;
- existing unit tests do not prove the eight complete browser loops;
- the baseline typecheck is blocked by malformed JSX in `app/terms-pinterest/page.tsx` and must be repaired without expanding that retired surface.

Existing source is evidence, not specification. Passing old tests does not convert partial behavior into acceptance.

## Build versus release

Build work may proceed behind fail-closed flags. Public chemistry may not return production quantities until:

1. authoritative ingredient manifest provenance and conflict dispositions exist;
2. hand calculations and at least two specialist-calculator comparisons are recorded with explained differences;
3. exact fragrance certificate revision and Category 9 mapping govern any IFRA output;
4. named independent domain and safety reviewers approve the calculation and copy;
5. deployed release-disabled and release-enabled checks pass in the correct order.

Non-chemistry tools can deploy independently after their own fixtures, browser checks and deployment evidence pass.

## First execution wave

1. Repair the existing typecheck blocker narrowly and establish a green baseline without altering product scope.
2. `SLICE-001` — canonical routes and eight-tool directory.
3. `SLICE-003 — Deterministic Formulation Engine and Source Boundary` — complete formulation engine/UI with public chemistry still OFF.
4. `SLICE-002` — versioned anonymous context continuity through batch cost.

Thereafter follow `.studio/slices.json` exactly. One cheap-model run owns one slice; it may not self-declare the next slice ready.

## Release authority

Gate_A remains pending. The product is not complete or release-accepted until an independent deployed verifier records the literal `RELEASE_ACCEPTED`.