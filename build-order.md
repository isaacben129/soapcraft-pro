# SoapCraft Pro Rescue Build Order

**Baseline:** `ed27e22`
**Purpose:** Dependency-ordered implementation plan for a cheaper coding model.
**Rule:** Do not parallelize tickets that mutate the same contracts. Do not start visual polish before ownership, domain, and lifecycle seams are stable.

---

## 1. Operating rules

1. Read `product/PRD.md`, `product/DESIGN.md`, `flowchart/product-flow.md`, and `product/CODE-PRD-AUDIT.md` before coding.
2. One ticket = one coherent, testable outcome.
3. Use TDD for calculations, state transitions, ownership, and billing.
4. Use realistic seed data through the production schema; no parallel demo-only types.
5. No placeholder success messages, alerts, console-only saves, or hard-coded demo records.
6. Every UI mutation implements idle, saving, saved, failed, retry, and preserved-input states.
7. Every private route/API test includes cross-user denial.
8. Every visible ticket includes desktop/mobile screenshots and computed-style inspection.
9. Do not modify the calculation engine and UI contract in separate unsynchronized tickets.
10. Stop and fix a failed dependency before moving to later waves.

---

## 2. Preflight

### R0.1 Preserve and understand worktree state

Current pre-existing local state at planning completion includes modified `package.json` and deleted `package-lock.json`. Determine owner/intent before package operations.

Acceptance:

- baseline status captured
- no unrelated file reverted
- package manager strategy explicit

### R0.2 Restore reproducible validation

Goal: make the existing project verifiable before feature work.

Tasks:

- establish expected package manager/lockfile
- install dependencies without changing versions accidentally
- run lint, typecheck, tests, and production build
- record existing failures as tickets; do not paper over them

Acceptance:

```text
lint: green
typecheck: green
test: green
build: green
```

If not green, block later tickets until failures are classified and fixed.

### R0.3 Add baseline end-to-end smoke harness

Scenarios:

- logged-out homepage
- signup/login redirect
- protected dashboard
- existing recipe calculation
- public blog index/article

This is a baseline, not proof of MVP.

---

## 3. Wave 1: Trust, contracts, and data isolation

### R1.1 Freeze and specify calculation contract

**Human approval gate:** This is a product/domain-review decision ticket, not an autonomous implementation ticket. The coding agent must stop until a named approver signs off the version-controlled contract and source manifest.

Deliverables:

- `docs` or test-adjacent calculation contract
- supported methods, lye types, water modes, units, purity policy
- authoritative ingredient/SAP sources and dataset revision
- internal precision and display rounding policy
- warning/blocking matrix
- planned-vs-actual variance contract covering alkali by type, water, total oils, and supported fragrance: normalized comparison basis, approved thresholds, severity, continue/confirm/block behavior, confirmation copy, and audit event

Do not implement unsupported options as fake fields or infer chemistry thresholds from generic web guidance.

Acceptance:

- named product/domain owner approves PRD open decisions 1–2, all numeric boundaries, and variance behavior
- approved source manifest and independent fixtures are version controlled
- explicit stop condition prevents R1.2 until approval is recorded
- no marketing verification claim without evidence

### R1.2 Rebuild deterministic calculation tests, then engine

RED tests first:

- scaling by target oil mass
- unit conversion
- each supported lye type
- each active water mode
- superfat and purity policy
- invalid/boundary values
- rounding separation
- known independent fixtures

Then implement one typed engine contract used by server and client.

Acceptance:

- all fixtures green
- no AI/network dependency
- inactive water mode cannot influence result
- all invalid outputs become typed errors, not NaN/silent hides

### R1.3 Correct relational model and migrations

Migration safety procedure, before schema edits:

- inventory production row counts, nulls, duplicates, and orphan relationships
- take and verify a restorable backup
- document field-by-field mapping from current tables/JSON blobs to the target contract
- define how `createdBy` maps to real users and quarantine records whose owner cannot be derived
- add nullable/additive structures first, backfill and verify, then enforce constraints
- define transaction/locking expectations plus rollback or forward-recovery steps
- never drop/recreate a production table or delete/quasi-own orphan data merely to pass migration tests

Required changes:

- user ownership on recipes, batches, cost records, private ingredients
- immutable recipe versions and currentVersionId
- versioned batch planned snapshot plus normalized actual measurement line items; Batch is the only editable owner of actual quantities
- Making Session/steps/timer state references Batch measurement IDs and does not duplicate editable actual values
- cure observations with observedAt and structured text/numeric fields; photos are deferred unless a separate storage/security contract is approved
- ingredient cost records
- batch cost revisions/cost basis
- activity events
- subscription provider projection
- archive fields and safe FK behavior

Acceptance:

- migration files committed
- clean database migrates from zero
- upgrade migration tested against a copy of current production-shaped schema/data
- pre/post row counts, owner mappings, and FK lineage verified
- unresolved ownerless/orphan records are quarantined for manual resolution, not deleted
- rollback or forward-recovery exercise documented
- historical recipe versions and batches survive unchanged
- deleting/archiving a recipe cannot cascade-delete historical batches

### R1.4 Centralize authenticated ownership guards

Implement reusable server helpers for:

- require session user
- load owned recipe/version
- load owned batch through userId
- verify child ownership through parent
- curated read policy

Acceptance tests:

- unauthenticated denied
- User A cannot access User B recipe/batch/cure/cost by ID
- list queries only return current user plus explicitly curated public data
- client-provided owner IDs ignored

### R1.5 Finish authentication lifecycle

Tasks:

- production secret validation
- signup → authenticated session → intended route
- logout
- real reset token/email/completion flow
- callback URL validation
- session-expired recovery

Acceptance:

- no hard-coded production secret fallback
- password reset success means a token was actually issued/sent
- no email enumeration
- dashboard protected server-side

**Wave 1 gate:** calculation, migration, ownership, auth, lint, typecheck, tests, and build all green.

---

## 4. Wave 2: Shell and design-system foundation

### R2.1 Create route groups and three shells

Tasks:

- root document only owns `<html>/<body>`
- marketing shell
- auth shell
- app shell with rail/command bar/mobile nav
- canonical `/pricing`, `/blog`, `/blog/[slug]`
- redirects from old `/marketing/**` paths
- valid logo behavior

Acceptance:

- no duplicate header/footer
- `/marketing` is not a broken Home destination
- public pages never render app navigation
- authenticated root redirects to dashboard

### R2.2 Implement Tailwind v4 semantic theme mapping

Tasks:

- map `--color-*` tokens through Tailwind v4 theme system
- introduce rail/canvas/ledger/sheet/clay/sage/brass semantics
- radius/elevation/type tokens
- numeric mono/tabular utility

Acceptance:

- browser computed styles confirm intended non-transparent fills
- contrast checks pass
- no pure-white-on-white default
- old semantic classes either work or are replaced systematically

### R2.3 Build shared operational primitives

Components:

- AppRail / MobileNav / CommandBar
- LedgerRow
- ObjectHeader / Breadcrumbs
- StatusLabel
- MeasurementCell / PlanActualCell
- SaveIndicator
- AttentionRow
- ActivityRow
- structured EmptyState
- field/blocking error summary

Acceptance:

- Storybook/demo route or focused tests show all states
- keyboard/focus behavior verified
- no generic card primitive becomes default content container

**Wave 2 gate:** approved shell + populated dashboard mockup exists before dashboard implementation.

---

## 5. Wave 3: Recipe vertical slice

### R3.1 Ingredient catalogue read model

Tasks:

- seed sourced system ingredients
- expose user-scoped/system catalogue query
- surface source/SAP revision
- no arbitrary system `createdBy`

Acceptance:

- builder uses database/catalogue contract or one canonical shared dataset
- unknown/missing SAP blocks calculation

### R3.2 Recipe create API/server action

Atomic behavior:

- authenticate
- validate ownership/input
- run authoritative calculation server-side
- create Recipe + Version 1
- persist calculation/dataset version and warnings
- append activity event

Acceptance:

- client totals ignored/recomputed
- invalid/blocking recipe not saved
- retry does not create accidental duplicate versions

### R3.3 Recipe Builder UX

Implement approved split desktop/staged mobile design.

Required:

- identity, target mass/unit, oil table, one active water mode
- calculation panel
- warnings
- truthful save states
- Save recipe
- View recipe / Start batch continuation

Acceptance end-to-end:

```text
new recipe → calculate → save → recipe detail
```

No alert/console placeholder.

### R3.4 Recipe portfolio and detail/versioning

Tasks:

- user-scoped recipe list/search/filter/sort
- recipe detail
- version history/diff
- create new version
- duplicate/archive
- batches section initially valid empty state

Acceptance:

- editing creates N+1, never mutates N
- archived recipe preserves batch history
- if approved launch templates exist, they are clearly separated with provenance; otherwise no template control is rendered

**Wave 3 gate:** first verified recipe save rate can be instrumented and tested.

---

## 6. Wave 4: Batch and persistent Making Mode vertical slice

### R4.1 Batch creation from recipe version

Tasks:

- select exact version
- copy planned measurement snapshot
- create user-owned batch
- activity event
- batch-list visibility; operational dashboard integration is added incrementally in R4.2 and completed in R7

Acceptance:

- later recipe edit does not alter batch plan
- unsaved recipe draft cannot start batch
- cross-user version ID denied

### R4.2 Batch portfolio, minimal dashboard pipeline, and central detail

Implement:

- list/filter/status/next action
- minimal dashboard active-pipeline query/rows for current batches; later waves enrich cure/cost/attention data
- `/batches/[id]`
- Overview, Making, Cure, Cost, Notes/history sections
- plan vs actual
- parent version breadcrumb/link

Acceptance:

- no demo batch IDs/data
- every section derives from same batch

### R4.3 Making state machine and persistence

RED tests:

- checklist gate
- ordered completion
- skip reason
- timer start/pause/resume/reconstruction
- reload resume
- completion transaction to curing
- abandon path
- idempotent/retried writes use the PRD mutation-key contract: user + operation + client UUID uniqueness, payload-hash conflict, exact-replay original outcome

Implement server contract before UI.

### R4.4 Making Mode UX

Implement desktop/mobile design with:

- one active step
- planned/actual values
- persistent timer
- safety context
- save indicator
- complete/skip controls
- final review

Acceptance end-to-end:

```text
batch → checklist → making → enter actual → reload → same state/time → complete → curing
```

**Wave 4 gate:** recipe-to-curing handoff works with no manual re-entry.

---

## 7. Wave 5: Cure vertical slice

### R5.1 Cure observation API and state

Tasks:

- create/read/update/delete observations with ownership
- computed day from observedAt/cureStartedAt
- structured values
- completion/ready transition
- activity events

Acceptance:

- demo route removed
- user can correct an observation
- ready transition requires explicit user action
- language/tests never treat elapsed time as safety certification

### R5.2 Cure portfolio and batch cure UX

Implement:

- overdue observation / due observation / curing / estimated window reached / completed groups; estimated-window copy remains explicitly non-authoritative
- observation sheet
- timeline/trends where data exists
- next observation date
- Mark ready

Acceptance end-to-end:

```text
curing batch → observation → dashboard updates → mark ready → yield request
```

### R5.3 Reminder policy, optional within MVP

Only implement if notifications are in agreed MVP:

- preference/consent
- cadence and quiet hours
- delivery job
- deep links
- retry/observability

Do not display reminder claims before this ticket ships.

---

## 8. Wave 6: Costing vertical slice

### R6.1 Ingredient cost records

Tasks:

- add/edit/archive purchase costs
- unit normalization
- supplier/effective date
- user ownership

Acceptance:

- normalized unit calculation tested
- historical records remain addressable

### R6.2 Batch cost calculation contract

RED tests:

- actual quantities
- missing cost basis
- final yield zero/missing
- total/cost per unit
- target margin → suggested price
- optional cost categories according to scope
- historical cost basis/recalculation revisions

### R6.3 Batch cost UX and cost portfolio

Implement inherited line items, cost-basis selectors, yield, target margin, persisted result, incomplete queue, comparison view.

Acceptance end-to-end:

```text
ready batch → yield → select costs → save → dashboard/detail/cost portfolio agree
```

No zero-cost fallback and no arbitrary Oil ID field.

**Wave 6 gate:** complete connected batch metric can be measured.

---

## 9. Wave 7: Operational dashboard

### R7.1 Dashboard query and attention derivation

Build one user-scoped read model for:

- failed save/recovery items if server-known
- active Making Mode
- blocking recipes
- cure due/overdue
- missing yield/cost
- active pipeline
- recent recipe outcomes
- activity events

Acceptance:

- deterministic priority tests
- no cross-user aggregation
- bounded query counts/performance

### R7.2 Dashboard UX

Replace the current tools card grid with:

1. Needs attention rows
2. Active production pipeline
3. Recent recipes/outcomes
4. Activity ledger
5. New command

Acceptance:

- populated, partial, empty, loading, and error states
- desktop and mobile approved screenshots
- every row exposes parent/context and one next action
- no primary cards that simply link to modules

---

## 10. Wave 8: Marketing and editorial

### R8.1 Blog content contract and routes

Tasks:

- canonical `/blog` and `/blog/[slug]`
- featured/latest/category filter
- proper semantic article rendering
- images/alt text
- related articles
- Article/Breadcrumb JSON-LD
- redirect old URLs

Acceptance:

- canonical category vocabulary is `calculations`, `recipes`, `guides`, `troubleshooting`; links resolve through `/blog?category=...` and change results/URL state
- no missing image references
- long-form content renders lists/headings correctly

### R8.2 Homepage redesign

**Pricing dependency:** R9.2 is a product-decision prerequisite for any prices, tier limits, trial language, or entitlement claims. Until it is approved, this ticket may show only a neutral Pricing link and must not invent or preserve stale offer details.

Implement approved proof-led design:

- hero + real rendering of production application components using production-shaped synthetic data clearly labelled Example
- connected lifecycle artifact
- calculation trust
- plan vs actual example
- featured + latest blog
- pricing/footer

Acceptance:

- no four-card feature section
- no hero metric tiles
- no emoji brand
- no false persistent timer/reminder/catalogue/connection claims
- computed semantic fills verified
- logged-in redirect works

### R8.3 Technical SEO

- sitemap
- robots
- canonicals
- OpenGraph assets
- structured data
- heading/image audit
- no thin programmatic pages

---

## 11. Wave 9: Settings, billing, entitlement

### R9.1 Settings foundation

- profile
- preferences/units/currency
- safety acknowledgement
- data export
- account deletion only after product/legal approval defines retention/anonymization, active Dodo handling, recovery window, and recent-auth confirmation
- logout
- notification preferences if reminders exist

### R9.2 Decide pricing/trial/limits (product decision; complete before R8.2 pricing content)

Before code, resolve:

- trial policy
- free recipe/active-batch limits
- post-cancellation access
- billing periods/prices

Update PRD/copy as one truth.

### R9.3 Dodo lifecycle

Implement:

- customer/subscription IDs
- checkout session
- signed idempotent webhook
- state projection
- cancel at period end
- renewal/past_due/canceled handling
- billing UI

Acceptance matrix:

- checkout canceled
- payment pending
- payment succeeds
- duplicate webhook
- out-of-order webhook
- renewal
- payment failed
- cancel at period end
- actual period end

### R9.4 Server-side entitlement gates

- enforce limits in mutations
- preserve/read historical data per policy
- UI mirrors server result

No front-end-only gating.

---

## 12. Wave 10: Instrumentation, QA, and launch truth

### R10.1 Analytics wrapper and lifecycle events

Implement PRD event names with privacy-safe payloads. Verify dashboards/queries can compute activation and connected completion.

### R10.2 Accessibility audit

Exercise keyboard, screen reader labels, focus, 200% zoom, 320px viewport, reduced motion, tables/mobile alternatives, timer announcements.

### R10.3 Visual and responsive QA

For every core route:

- 1440×900
- 1024×768
- 390×844
- 320×568 critical flows

Inspect computed tokens and all state variants.

### R10.4 Security review

- ownership and IDOR suite
- auth rate limiting
- secret/config validation
- webhook verification
- export/delete recent auth
- logs free of secrets/private notes

### R10.5 Marketing truth audit

Compare every public claim against live behavior. Remove anything not demonstrable.

### R10.6 Final end-to-end gate

Run the 15-step definition of done in `product/PRD.md` with two accounts and real persisted test records.

---

## 13. Dependency graph

```text
R0 validation
  → R1 calculation + schema + ownership + auth
    → R2 shells/tokens/primitives
      → R3 recipes
        → R4 batches/making
          → R5 cure
            → R6 costing
              → R7 dashboard

R2 shells/tokens ───────────────→ R8 marketing/blog
R1 auth/schema + R6 lifecycle ──→ R9 billing/entitlements
R3–R9 complete ────────────────→ R10 launch gates
```

Parallelism allowed:

- R2 shell mockups can proceed while R1 tests are being completed, but implementation must use final auth boundaries.
- R8 editorial content cleanup can proceed after route decisions, but homepage claims must wait for implemented capabilities.
- R9 pricing decision can occur early, but billing code waits for core lifecycle.

Parallelism forbidden:

- schema migration and multiple feature APIs changing the same entities
- calculation engine and builder using different input/output contracts
- dashboard aggregation before lifecycle entities stabilize
- entitlement UI before webhook/provider state contract

---

## 14. Ticket completion template

Every implementation ticket closes with:

```markdown
### Requirement
PRD section / DESIGN section / flow handoff

### Changed
Exact files and behavior

### Tests
RED test observed, GREEN result, regression suite

### States exercised
empty / loading / populated / saving / saved / failed / retry / permission denied

### Visual verification
Desktop + mobile screenshots, computed token check

### Data/security verification
Ownership predicate and cross-user denial test

### Remaining limitations
Truthful, no placeholder success path
```

A cheaper model should execute one ticket at a time and stop at the stated gate. It should not “finish the whole product” in one pass.
