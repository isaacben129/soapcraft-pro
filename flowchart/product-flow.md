# SoapCraft Pro Product Flow and State Map

**Version:** 3.0
**Source of truth:** `product/PRD.md`
**Purpose:** Make page-to-page and object-to-object handoffs explicit for implementation.

---

## 1. System map

```text
PUBLIC SYSTEM
  / marketing homepage
    ├── /pricing
    ├── /blog
    │     └── /blog/[slug]
    ├── /guides/[slug]
    └── /auth/signup or /auth/login

AUTH SYSTEM
  signup/login/reset
    └── authenticated session
          ├── first use → /recipes/new
          └── returning → /dashboard

PRIVATE PRODUCTION SYSTEM
  /dashboard
    ├── /recipes
    │     ├── /recipes/new
    │     └── /recipes/[recipeId]
    │            └── /recipes/[recipeId]/versions/[versionId]
    ├── /batches
    │     ├── /batches/new?recipeVersionId=...
    │     └── /batches/[batchId]
    │            └── /batches/[batchId]/making
    ├── /cure
    ├── /costing
    ├── /ingredients
    └── /settings/**
```

The root layout owns `<html>` and `<body>`. Route groups/layouts own shell chrome only.

---

## 2. Domain relationship map

```text
User
 ├── owns Recipe
 │     └── has immutable Recipe Version(s)
 │            └── is referenced by Batch
 │                  ├── has Making Session
 │                  ├── has Cure Observation(s)
 │                  ├── has Final Yield
 │                  ├── has Batch Cost Record
 │                  └── emits Activity Event(s)
 ├── owns Ingredient Cost Record(s)
 ├── owns private Ingredient(s)
 └── has Subscription Projection
```

### Invariants

1. Every private top-level object is owned by an authenticated user.
2. Child access verifies ownership through the parent.
3. A batch references one immutable recipe version.
4. Editing a recipe creates a new version.
5. Cure and cost never exist without a batch.
6. Actual batch values never rewrite planned recipe values.
7. Final historical cost retains its cost-basis references.
8. Activity events are append-only factual records.

---

## 3. Logged-out acquisition flow

```text
GET /
  ├── session exists → redirect /dashboard
  └── no session → render marketing shell
        ├── inspect connected workflow proof
        ├── inspect calculation trust proof
        ├── read featured/latest articles
        │     └── /blog/[slug]
        ├── inspect pricing
        └── Start a recipe
              └── /auth/signup?callbackUrl=/recipes/new
```

### Failure and fallback states

- Blog source unavailable → homepage remains usable; editorial region shows bounded fallback.
- Invalid article slug → 404 with related/latest articles and valid navigation.
- Logged-out app route → login with validated callback URL.
- Logged-in marketing root → dashboard redirect.

---

## 4. Authentication and first-use flow

```text
SIGNUP
  form idle
    → submitting
      ├── validation error → preserve fields → correct → retry
      ├── account exists → offer login
      ├── database/network error → preserve fields → retry
      └── account created
            → establish session
              ├── callback /recipes/new → starter recipe flow
              └── no callback → /recipes/new or setup

LOGIN
  form idle
    → submitting
      ├── invalid credentials → generic error → retry
      ├── service error → actionable retry
      └── session established → validated callback or /dashboard

RESET
  request form
    → generic accepted response
      → email link with expiring single-use token
        → new password form
          → token consumed
            → login
```

### Security branches

- Untrusted external callback URL → ignore, route to `/dashboard`.
- Missing production auth secret → application deployment/startup fails.
- User A requests User B object → 404 or forbidden according to API policy; no data leakage.

---

## 5. Recipe creation flow

```text
/dashboard or /recipes
  → New recipe
    → /recipes/new
      → start blank
        └── if approved verified templates exist, user may choose one with visible provenance
      → enter identity, method, target oil mass/unit
      → add oils and percentages
        ├── total < or > 100 → blocking validation
        └── total valid → deterministic calculation
      → choose lye/water parameters
        → deterministic calculation updates
      → add supported fragrance/additives
      → review exact quantities, assumptions, warnings
        ├── blocking issue → Save disabled; focus issue
        └── valid → Save recipe
              → create Recipe + immutable Version 1 atomically
                ├── save fails → preserve draft → retry
                └── saved
                      ├── View recipe → /recipes/[id]
                      └── Start batch from v1
                            → /batches/new?recipeVersionId=[v1]
```

### Recipe edit/version flow

```text
/recipes/[recipeId]
  → Create new version
    → builder seeded from current version
      → change inputs
      → review calculation and diff
      → Save as version N+1
        ├── failure → prior version remains current
        └── success → recipe.currentVersionId = new version

Existing batches remain linked to their original version.
```

### Recipe archive flow

```text
Recipe detail → Archive
  → explain that historical batches remain
    → confirm
      → recipe hidden from active default
      → existing batch links remain readable
      → undo available where safe
```

---

## 6. Batch creation flow

```text
ENTRY A: Recipe detail → Start batch from version N
ENTRY B: New menu → Start batch → choose recipe/version

preconditions
  ├── auth/ownership valid
  ├── version exists and has no blocking validation
  └── entitlement allows new active batch

/batches/new?recipeVersionId=...
  → show recipe/version and planned quantities
  → enter batch name/date/optional notes
  → Create batch
      transaction:
        - create user-owned Batch in `draft`
        - copy planned measurement snapshot
        - append `batch_created` activity
      → confirm required plan/metadata
        - status `ready_to_make`
        - append `batch_ready_to_make` activity
      → Start Making Mode
        - status `making`
        - append `batch_started` activity
      ├── failure → preserve form → retry
      └── success → /batches/[batchId]
            → batch appears in dashboard pipeline
```

A user cannot create a production batch from an unsaved draft or mutable recipe identity alone.

---

## 7. Making Mode flow

```text
/batches/[batchId]
  → Start Making Mode
    → safety checklist
      ├── incomplete → Start disabled
      └── complete → persist acknowledgement/version/time
            → set batch status making
            → create/resume Making Session
            → /batches/[batchId]/making

FOR EACH STEP
  show one step + relevant planned values
    → enter actual measurement/observation
      → local dirty state
        → persist
          ├── saving
          ├── saved + timestamp
          └── failed → preserve input → retry
    → Complete step
      ├── required field missing → explain/block
      └── persist completion/time → next step
    → Skip
      → require reason → persist skipped state → next step

TIMER
  start/pause/resume stores authoritative timestamps
  reload/navigation reconstructs elapsed time

FINAL STEP COMPLETE
  → completion review
    ├── unresolved required data → return to item
    └── Complete making
          transaction:
            - persist final actuals
            - status = curing
            - completedAt/cureStartedAt stored
            - first observation due derived
            - activity event appended
          → /batches/[batchId]#cure
          → dashboard pipeline updates
```

### Exceptional Making states

- Network loss without offline queue → explicit unsaved/failed state; do not claim queued.
- Concurrent edit conflict → optimistic revision check rejects stale write, preserves the local draft, and offers Reload server version or Copy local values into a new edit. MVP performs no automatic field merge.
- Abandon batch → reason required; timer stops; status abandoned; history preserved.

---

## 8. Cure flow

```text
ENTRY A: dashboard attention row
ENTRY B: /cure portfolio
ENTRY C: /batches/[batchId]#cure

/cure
  → group user batches by overdue observation / due observation / curing / estimated window reached / completed
    (`estimated window reached` means elapsed configured window only, never safety/readiness)
  → choose batch / Log observation
    → batch cure observation sheet
      → date/day prefilled
      → optional structured measures + notes/photos
      → Save
        ├── failure → preserve → retry
        └── success → observation appended + next due derived

USER MARKS READY
  → confirmation explains this is user's decision
  → optional/final observation
  → request final yield if absent
  → persist readyAt and status ready
  → append activity
  → cost record recalculates or becomes needs-cost-basis
  → dashboard attention updates
```

### Cure language state

The product may show:

- elapsed days
- user-configured or evidence-based estimated window
- observation history
- due dates

It must not automatically assert “safe,” “fully cured,” or chemical readiness.

---

## 9. Cost flow

```text
PREREQUISITE: Ingredient cost records
  /ingredients
    → Add purchase/cost record
      → quantity + unit + price + currency + effective date
      → normalize cost per canonical unit
      → save

BATCH COST
  /batches/[batchId]#cost
    → inherit actual quantities (or planned estimate clearly labelled)
    → map each ingredient to cost basis
      ├── missing → attention item, no zero-cost assumption
      └── selected → line cost calculated
    → enter packaging/labor/overhead if in chosen scope
    → enter/finalize actual yield
    → enter target gross margin
    → calculate total, cost per unit, suggested price
    → Save
      ├── failure → preserve → retry
      └── success → persisted with calculation/cost-basis version
            → dashboard and /costing update

/costing
  → incomplete cost queue
  → batch/recipe cost comparison
  → ingredient cost change view
```

### Historical recalculation

```text
Ingredient cost changes
  ├── draft estimate → recalculate/mark changed
  └── finalized historical batch → retain original basis
        → user may explicitly Recalculate using current costs
          → create new calculation revision, preserve prior
```

---

## 10. Dashboard aggregation flow

```text
GET /dashboard for authenticated user
  parallel queries scoped by user:
    - active Making Sessions
    - recipes with blocking issues
    - due/overdue cure observations
    - batches missing yield/cost
    - active batches with recipe/version + latest observation + cost summary
    - recent recipes with latest batch outcomes
    - recent activity events

derive attention priority
  → render urgent rows first
  → render active pipeline
  → render recipe outcomes
  → render activity
```

### Dashboard states

- **New user:** guided first production record; no module cards.
- **Loading:** shell + row skeletons.
- **Partial query failure:** successful regions render; failed region offers retry.
- **No attention:** concise “Nothing needs attention” plus active pipeline, not an empty page.
- **No active batches:** show recent recipes and Start batch action.
- **Active Making Mode:** Resume is highest-priority action.

---

## 11. Subscription flow

```text
Settings/Billing or pricing
  → choose plan
  → create Dodo checkout session
  → provider checkout
    ├── canceled → return with unchanged entitlement
    └── paid/pending → return to pending status
          → verified signed webhook
            → idempotent event processing
              → persist provider customer/subscription/state
              → project entitlement
              → UI reflects active/past_due/etc.
```

Cancellation:

```text
Cancel at period end
  → provider confirms
  → state cancel_at_period_end
  → access remains through period end
  → webhook at end changes entitlement to canceled/free policy
```

No checkout response alone grants Pro.

---

## 12. Global persistence state machine

```text
pristine
  → dirty
    → saving
      ├── saved
      │     └── subsequent change → dirty
      └── failed
            ├── retrying → saved/failed
            └── user edits → dirty with failure context retained
```

Rules:

- Save status belongs to the specific object/section.
- Last saved time comes from successful persistence.
- Navigation guard applies to dirty high-value edits.
- The UI never changes lifecycle status before the server transaction succeeds.

---

## 13. Global validation severity

```text
INFORMATION
  output remains valid; user may continue

NEEDS REVIEW
  output may be valid but assumption/edge requires attention
  save policy is explicit per warning

BLOCKING
  no valid calculation or safe handoff
  Save/Start batch disabled
```

The same severity is stored in calculated snapshot, rendered in UI, and used by dashboard attention logic.

---

## 14. Route ownership matrix

| Route family | Public | Requires session | Requires object ownership |
|---|---:|---:|---:|
| `/`, `/pricing`, `/blog/**`, `/guides/**` | yes | no | no |
| `/auth/**` | yes | no | no |
| `/dashboard` | no | yes | all aggregated queries scoped |
| `/recipes`, `/recipes/new` | no | yes | list/mutations scoped |
| `/recipes/[id]/**` | no | yes | recipe owner or curated-read rule |
| `/batches/**` | no | yes | batch owner |
| `/cure`, `/costing`, `/ingredients` | no | yes | all records scoped |
| `/settings/**` | no | yes | current user only |
| private APIs/server actions | no | yes | independently verified |

---

## 15. End-to-end acceptance flow

```text
new user
  → signup/session
  → valid calculation
  → recipe v1 saved
  → recipe detail
  → batch created from v1
  → dashboard pipeline displays batch
  → Making Mode starts after safety acknowledgement
  → actual values + timer persist through reload
  → making completes
  → same batch enters curing
  → observation persists
  → user marks ready
  → yield finalized
  → cost basis selected
  → cost per bar + target-margin price persist
  → dashboard/activity/detail all show completed lineage
  → logout
  → second account cannot access any IDs from first account
```

If any arrow is replaced by demo props, local-only state, console logging, an alert, an empty array, or manual re-entry, the connected MVP is not complete.
