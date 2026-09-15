# SoapCraft Pro — Cheap-Model Implementation Handoff

**Status:** BUILD_AUTHORIZED; `RELEASE_ACCEPTED` is not authorized and cannot be claimed by a builder.

## 1. Why this packet exists

A worker failed SLICE-001 by changing unapproved files, leaving retired URLs in the sitemap, calling incomplete pages `Working`, and claiming verification without mobile evidence. This packet makes the builder's job a bounded transformation:

**Inputs:** one named slice, its permitted paths, the normative contracts, the baseline commit.  
**Output:** a small commit plus reproducible evidence.  
**Success metric:** every stated acceptance ID has focused tests and browser evidence, with no out-of-boundary files.  
**Failure condition:** any missing verification, modified prohibited path, uncommitted work, or self-approval. Stop and return `BLOCKED`, not `COMPLETE`.

## 2. Binding authority (read in this order)

1. `product/TOOL-IMPLEMENTATION-CONTRACT.md` v1.0.0 — exact public behavior for all eight tools and the shared context.
2. `product/CALCULATION-SPEC.md` v2.1.0 — all deterministic calculations, units, validity and safety constraints.
3. `product/PUBLIC-TOOL-CONTRACT.md` v4.0.0 — public scope, truthful status, safety and release conditions.
4. `product/FLOWS.md` — required connected browser journeys and recovery behavior.
5. `product/AI-OPERATING-CONTRACT.md` — builder authority limits.
6. `.studio/acceptance.json` — executable release requirements.
7. `.studio/slices.json` — dependency order and declared boundaries.

If a document conflicts, stop and report the exact contradiction. Never invent a product decision or silently choose a formula.

## 3. Non-negotiable worker protocol

- Work **one slice only**. Do not begin a dependent slice.
- Begin with `git status --short`, `git diff -- <allowed paths>`, and the specific contract sections named below.
- Write a focused test first and run it while failing. Retain its command/output in `.studio/evidence/<SLICE-ID>/`.
- Only modify files explicitly named by the handoff. Do not change `package.json`, lockfiles, auth, environment, deployment configuration, global styling, unrelated shared components, or other routes unless the packet explicitly permits it.
- Use the canonical engine and schema. No route-local copies of formulas; never use displayed rounded values in later math.
- Anonymous public use is mandatory. No account, email, payment, AI-generated chemistry, unverified fatty-acid value, or IFRA inference.
- Chemistry stays public fail-closed until SLICE-004's independent evidence clears. A feature flag is not authority to bypass the gate.
- Capture desktop and 390px-wide mobile evidence. If browser verification cannot run, report `BLOCKED`.
- A builder may report `SUBMITTED_FOR_REVIEW` only. It may not edit acceptance evidence to `VERIFIED`, approve itself, write `RELEASE_ACCEPTED`, or merge/rebase/clean other work.

## 4. Mandatory submission format

Return exactly:

```text
SLICE: <id>
STATE: SUBMITTED_FOR_REVIEW | BLOCKED
BASELINE_COMMIT: <sha>
WORKER_COMMIT: <sha or NONE>
ALLOWED_FILES_CHANGED: <one per line>
PROHIBITED_FILES_CHANGED: <NONE or one per line>
FAILING_TEST_PROOF: <command + retained artifact path>
TESTS: <exact commands, exit codes, retained output paths>
BROWSER: desktop=<artifact>; mobile-390=<artifact>; route(s)=<list>
KNOWN_GAPS: <NONE or exact blockers>
NO_SELF_APPROVAL: true
```

An independent reviewer, not the builder, runs the acceptance gate and records review. A missing field rejects the submission.

## 5. Build map — all public tools

| Tool / shared capability | Normative section | Acceptance IDs | Dependencies | Deterministic completion boundary |
|---|---|---|---|---|
| Shared Recipe/Batch Context | Implementation §2 | `CTX-001`, `F-08`, `F-09` | canonical directory | Versioned envelope, migration, local persistence/reset, bounded secure share, export/import and corrupt/oversize recovery work in a clean browser. |
| Formulation | Implementation §3 | `TOOL-FORM`, `F-01`, `F-07`, `CHEM-GATE` | context; chemistry publication is separately blocked | Full UI and canonical engine states exist; default public output is typed unavailable with no quantities until independent chemistry receipts. |
| Mold Capacity | Implementation §4 | `TOOL-MOLD`, `F-02`, `F-07` | context | Geometry units, measured volume, calibration-only exact mass, range mode, cut plan, provenance and scaling handoff. |
| Recipe Scaling | Implementation §5 | `TOOL-SCALE`, `F-03`, `F-07` | context, formulation engine, mold | Explicit proportional-copy vs formulation-recalculation paths; no implied verified chemistry. |
| Batch Cost | Implementation §6 | `TOOL-COST`, `F-03`, `F-04`, `F-07` | context, scaling | Complete named cost basis, made/saleable yield, currency integrity, no hidden pricing default, wholesale handoff. |
| Wholesale Pricing | Implementation §7 | `TOOL-WHOLESALE`, `F-04`, `F-07` | batch cost | List price vs invoice price, markup/margin/fees algebra, invalid denominator, MOQ/pack quote and printable export. |
| Event Planner | Implementation §8 | `TOOL-EVENT`, `F-05`, `F-07` | wholesale | Multi-product weighted contribution, explicit mix validation, target profit, stock/sell-through and infeasibility. |
| Ready-By Planner | Implementation §9 | `TOOL-READY`, `F-06`, `F-07` | context, mold | Date-only backward scheduling, capacity and blackout conflict, safe wording, purchasing handoff. |
| Purchase Planner | Implementation §10 | `TOOL-PURCHASE`, `F-06`, `F-07` | context, cost/ready-by | Ingredient aggregation, stock/buffer/pack/MOQ/landed-cost rules, currency integrity and export. |

`UTIL-001` through `UTIL-007`, `F-10` through `F-12` are release-wide requirements: truthful directory/status, methodology, examples/templates, comparisons, SEO/route registry, discovery, and safe recovery.

## 6. First delegation-safe work packet: SLICE-001R

The original SLICE-001 is **rejected**, not complete. This repair slice is deliberately smaller than the original.

### Goal

Make the canonical public route registry the single source for tool discovery and make generated sitemap output advertise no retired calculator, campaign, Pinterest, TikTok, subscription, or CRM URLs.

### Allowed files

```text
app/sitemap.ts
app/robots.ts
app/tools/page.tsx
lib/routing/canonical-routes.ts
lib/routing/public-routes.ts
lib/routing/route-registry.test.ts
lib/seo/intent-registry.ts
middleware.ts
app/tools/wholesale-pricing/page.tsx
app/tools/ready-by-planner/page.tsx
app/tools/ingredient-purchase-planner/page.tsx
e2e/route-registry.spec.ts
```

No other file may change. Existing files outside this list are reviewer-owned legacy state, not builder scope.

### Required behavior

1. Exactly eight canonical tool URLs match `PUBLIC-TOOL-CONTRACT.md` §2 and `canonical-routes.ts`.
2. `/tools` displays exactly those eight entries and each status is truthful: incomplete is `Preview`, `Unavailable — in build`, or a typed chemistry-gated state; never `Working`.
3. `app/sitemap.ts` emits only canonical public routes. Retired calculators, social, campaign, subscription and CRM URLs are absent.
4. Direct visits to the three in-build canonical pages return a truthful in-build state, not a fake calculator or a misleading redirect.
5. `robots`, intent registry, middleware and directory agree with canonical routes; retired public promises are absent or redirect only where the existing contract explicitly requires it.
6. At 390×844, the tool-directory card grid and all status labels have no horizontal overflow.

### Required red tests

- Route registry test asserts the eight literal URLs and asserts retired URL fragments are absent from the generated sitemap.
- Browser test fails on a 390px viewport if `document.documentElement.scrollWidth > window.innerWidth` on `/tools`.
- Browser test asserts each of the eight cards has a canonical href and truthful visible status.

### Worker commands

```bash
npm test -- --run lib/routing/route-registry.test.ts
npm run typecheck
npm run lint
npm run build
PLAYWRIGHT_BROWSERS_PATH=/opt/data/.cache/ms-playwright npx playwright test e2e/route-registry.spec.ts --project=chromium
```

The worker must retain raw command output plus desktop and mobile screenshots in `.studio/evidence/SLICE-001R/`. It must not run or mark the release gate accepted.

### Independent reviewer acceptance

Reviewer verifies the source boundary against this allowlist, reruns all commands cleanly, inspects both screenshots, runs `acceptance_gate.py audit --project .`, and records only slice-level evidence. The expected release-gate result remains `RELEASE_REJECTED` until all 28 requirements have independent evidence and approval.

## 7. Sequencing

`SLICE-001R` → `SLICE-002` context → `SLICE-005` mold → `SLICE-003` formulation (public chemistry still fail-closed) → `SLICE-006` scaling → `SLICE-007` cost → `SLICE-008` wholesale → `SLICE-009` event → `SLICE-010` ready-by → `SLICE-011` purchase. `SLICE-004` is external-evidence-only and may not be shortcut by an implementation worker.

Every subsequent worker receives a similarly bounded packet generated from the Build Map and its specific `.studio/slices.json` entry. Do not send the whole program as one prompt.
