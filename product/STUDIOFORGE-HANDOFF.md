# StudioForge Execution Prompt — SoapCraft Pro Rescue

Copy everything inside the prompt block into the new model session.

---

## Prompt

You are executing the existing SoapCraft Pro rescue through StudioForge. This is an **existing repository**, not a greenfield project.

**Repository of record:** `/opt/data/studio/apps/soapcraft-pro`

Load and follow these skills before acting:

1. `studio-build`
2. `studio-app-implementation`
3. `test-driven-development`
4. `app-life-and-style`
5. `impeccable-design`
6. `debugging` when a gate fails
7. `requesting-code-review` before each merge
8. `github-workflows` for branches, PRs, CI, and merges

The user approves the current rescue planning and is asking you to execute it. Do not restart product discovery, reverse-prompt the concept, scaffold another app, or write a parallel PRD.

### Canonical artifacts

Read these completely before creating tickets or changing code:

- `product/PRD.md` — canonical scope and behavior
- `product/DESIGN.md` — canonical UX/visual specification
- `product/CODE-PRD-AUDIT.md` — evidence-based current-state baseline
- `product/PRD_CRITIQUE.md` — resolved critique and hard decision gates
- `flowchart/product-flow.md` — routes, states, and module handoffs
- `build-order.md` — dependency-ordered rescue tickets
- `brief.md` — concise product boundary

When documents conflict, use this precedence:

```text
product/PRD.md
→ product/DESIGN.md
→ flowchart/product-flow.md
→ build-order.md
→ brief.md
→ current implementation
```

The current implementation is evidence, not specification.

### Existing worktree warning

Before doing anything:

1. Run `git status`, `git diff`, `git log -1`, and compare `HEAD` with `origin/main`.
2. The planning pass intentionally changed:
   - `brief.md`
   - `build-order.md`
   - `flowchart/product-flow.md`
   - `product/PRD.md`
   - `product/DESIGN.md`
   - `product/PRD_CRITIQUE.md`
   - `product/CODE-PRD-AUDIT.md`
   - this handoff file
3. `package.json` was already modified and `package-lock.json` was already deleted before the planning pass. Do not discard, overwrite, or silently mix those changes into a planning commit.
4. Preserve all user work. Do not use destructive reset/checkout/clean commands.
5. Establish a clean, reproducible baseline before spawning workers. If necessary, create a dedicated local planning commit containing only the planning artifacts. Keep package changes separate until their ownership and intended package-manager outcome are established.

### StudioForge stage selection

S0 and S2 are complete:

- existing repo found
- code/UX audit completed
- PRD and DESIGN rewritten
- state map completed
- independent PRD critique completed and fixes applied
- user has approved moving to implementation

Therefore:

- Do **not** run S1.
- Do **not** reinvent S2.
- Start with a short S0 integrity recheck, then execute S3 onward.

### Product system

Build one connected lifecycle:

```text
Recipe
→ immutable Recipe Version
→ Batch
→ persistent Making Record
→ Cure Observations
→ Final Yield
→ Cost Record
→ next Recipe Version
```

The Batch is the central operational object. Cure and costing are contextual views of the same Batch, not standalone tools.

The rescue MVP has four connected core modules:

1. Formulation and recipe versioning
2. Guided batch production and persistent Making Mode
3. Cure tracking
4. Costing and profitability

Dashboard, authentication, settings, marketing, and blog are required system surfaces, not additional disconnected product modules.

### Goal metric

Optimize and instrument:

**Connected batch completion rate**

```text
batch created
→ Making Mode completed
→ cure marked ready by user
→ final yield recorded
→ cost per bar completed
```

Guardrails:

- zero cross-user record access
- zero silent save failures
- zero AI-generated chemical quantities
- zero unsupported public capability claims
- deterministic calculation fixtures green
- historical recipe-version/batch lineage preserved

### Non-negotiable product decisions

1. The deterministic calculator is authoritative.
2. AI is deferred from the rescue MVP and cannot invent or override recipe quantities.
3. Dodo Payments is the provider. Do not substitute Stripe.
4. Community/social features are outside v1.
5. Do not implement inventory, marketplace, ecommerce integrations, or a native app.
6. Cure readiness is an explicit user decision, never an automated safety declaration.
7. Missing cost basis stays visible; it never silently becomes zero.
8. Test mode uses the production schema and production-shaped records, not parallel demo types.
9. The dashboard is not a grid of cards linking to tools.
10. The homepage must include real connected workflow proof and featured/latest blog content.

### Hard stop gates

Do not let an implementation model invent any of the following:

- authoritative SAP/property sources
- supported lye types, methods, water modes, or dual-lye semantics
- chemistry input boundaries
- planned-versus-actual warning thresholds
- verified recipe-template status
- trial/pricing/limit policy
- account deletion/retention policy
- cure safety conclusions

Follow the human/domain approval gate in PRD §8 and build ticket R1.1. You may execute all work that does not depend on an unresolved value. When a ticket reaches a hard gate, mark it `blocked` with the exact decision and evidence needed; continue only with independent tickets that cannot invalidate or bypass that gate.

### S3 — atomic implementation plan

Transform `build-order.md` into atomic TDD tickets without changing scope.

Each ticket must contain:

- one user-visible or contract-level behavior
- linked PRD section
- linked DESIGN/App Life requirement when visible
- dependencies
- files/interfaces expected to change
- RED test
- implementation acceptance criteria
- empty/loading/saving/saved/error/retry states where relevant
- ownership/IDOR assertion for private data
- desktop/mobile visual proof for UI work
- rollback or recovery note for schema/billing work

Create `tasks.json` and the StudioForge issue/kanban structure. Preserve the dependency waves in `build-order.md`. Do not compress the whole rescue into a few giant tickets and do not split it into unrelated cosmetic tickets.

Before S4, verify:

- every build-order ticket maps to at least one atomic task
- no task expands beyond PRD scope
- every module handoff has an integration task
- calculation, schema, ownership, and auth precede dependent UI
- dashboard aggregation follows stable lifecycle contracts
- pricing content is blocked on approved policy

### UX execution rules

This rescue exists because the current product has no coherent UX. UX is not a final polish wave.

For every screen-changing task:

1. Read the corresponding DESIGN section.
2. Produce a populated desktop and mobile mockup before implementation.
3. Compare it against the banned patterns.
4. Implement the approved direction using the existing component system; do not create a second UI framework.
5. Exercise populated, empty, loading, saving, failure, retry, and permission states as applicable.
6. Capture desktop and mobile screenshots from the running application.
7. Inspect computed styles for semantic fills, fonts, radii, and contrast.
8. Run the Impeccable generic-pattern scan.

Use the **Chemist’s Production Ledger** visual system:

- dark umber/charcoal application rail
- warm mineral-paper workspace
- clay formulation/calculation surfaces
- sage cure surfaces
- brass cost surfaces
- ruled rows, dense tables, timelines, and plan-versus-actual comparisons
- DM Sans UI and JetBrains Mono/tabular numerals where specified
- sharp 2–4px radii
- white only for focused editing/dialog surfaces

Banned:

- dashboard tool-card grid
- equal icon/title/body feature-card grids
- all-white page plus white cards
- emoji branding
- universal `rounded-lg`
- hero KPI tiles
- glassmorphism/backdrop blur
- decorative gradients
- repeated eyebrow labels
- fake testimonials or fake user activity
- unverified semantic Tailwind classes
- generic AI-powered language

### Required dashboard outcome

Replace the current five-card directory with one operational workspace:

1. Needs attention queue
2. Active production pipeline
3. Recent recipes and outcomes
4. Activity ledger
5. One New command

Every row must expose:

- object identity
- parent lineage
- factual status/evidence
- timestamp or due context
- one next action

A minimal active-pipeline slice ships with batch persistence. Cure/cost/attention enrichment follows as their contracts land.

### Required homepage/blog outcome

The public homepage must include:

- proof-led hero
- a real rendering of production application components using production-shaped synthetic data clearly labelled `Example`
- connected Recipe → Batch → Cure → Cost proof
- deterministic calculation provenance and warning example
- planned-versus-actual example
- featured article and three latest posts
- canonical blog category links
- pricing only after approved pricing policy
- safety/legal footer

Canonical editorial routes:

```text
/blog
/blog/[slug]
/blog?category=calculations
/blog?category=recipes
/blog?category=guides
/blog?category=troubleshooting
```

Fix actual filtering, images/alt text, semantic long-form rendering, related articles, breadcrumbs, and structured data. Redirect stale `/marketing/**` URLs rather than maintaining duplicate public trees.

### S4 — implementation discipline

Use StudioForge dependency waves. Each worker receives only:

- its atomic ticket
- relevant PRD/DESIGN/flow excerpts
- required interface contracts
- current baseline

Each ticket gets its own branch and PR. Workers must not modify unrelated files or planning scope. Do not run workers concurrently when they mutate the same schema, contract, shell, or shared component.

For each ticket:

1. Write and observe the RED test.
2. Implement the smallest complete behavior.
3. Run focused tests.
4. Run lint and typecheck.
5. Exercise the feature against persisted production-shaped data.
6. Capture UI proof if visible.
7. Run security/ownership assertions if private.
8. Refactor only after green.
9. Create a conventional commit and bounded PR.

If the same approach fails three times, stop repeating it and pivot to a fundamentally different diagnostic path.

### CI and review gates

No PR merges unless all applicable gates pass:

- lint
- TypeScript typecheck
- unit/integration tests
- calculation fixtures
- ownership/IDOR tests
- migration verification
- production build
- accessibility checks
- `scan-generic.sh`
- secrets/security scan
- independent code review
- regression test proven to fail without the fix
- screenshot/computed-style evidence for visible changes

Reviewers must refute rather than rubber-stamp. A route/component existing is not proof that a feature works.

### Repository and package discipline

- Do not run destructive Git cleanup.
- Keep commits narrow and the working tree explainable.
- Resolve the `package.json`/`package-lock.json` state deliberately before CI relies on `npm ci`.
- Do not change dependency versions opportunistically.
- WSL is memory constrained; use the documented StudioForge Next.js build fallback only after reproducing a real memory-related failure.
- Do not modify the container `.env` or globally alter PATH.
- Never print or embed credentials.

### Final connected acceptance test

The rescue is not complete until a clean user can:

```text
sign up and obtain a session
→ build a valid formulation
→ save Recipe Version 1
→ start a Batch from Version 1
→ see it in the dashboard pipeline
→ start Making Mode after safety acknowledgement
→ persist actual values and timer state
→ reload and resume the same state
→ complete Making Mode into curing
→ log a cure observation
→ explicitly mark the batch ready
→ finalize sellable yield
→ choose valid ingredient cost basis
→ save cost per bar and target-margin price
→ see consistent lineage on dashboard, recipe detail, batch detail, cure, cost, and activity
→ log out
```

Then create a second account and prove it cannot access any first-account recipe, version, batch, Making Session, cure observation, cost record, ingredient cost, or activity record by guessed ID or direct API request.

If any arrow uses demo props, an empty array, console logging, an alert, local-only state, a hard-coded record, or manual re-entry of inherited data, the MVP is not complete.

### Execution and reporting

Act; do not merely produce another plan. Continue from S3 through implemented and verified dependency waves. Respect hard decision gates without inventing answers.

At the end of each wave, report only:

- tickets completed
- PRs and CI results
- tests/build actually run and their outputs
- screenshots or URLs for visible work
- exact blockers requiring human decisions
- next dependency wave

Do not report a feature as complete until real execution verifies it.

---

## End prompt
