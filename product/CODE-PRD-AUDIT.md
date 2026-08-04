# SoapCraft Pro: PRD vs Code Audit

**Audit date:** 2026-08-04  
**Baseline audited:** `ed27e22`  
**Scope:** Assessment and planning only. No product code was changed.  
**Decision rule:** A feature is not “implemented” because a component or route exists. It is implemented only when the user can complete the required flow with authenticated, persistent, owned data and truthful states.

## 1. Executive verdict

SoapCraft Pro is currently a collection of partially built tools presented as a connected workspace. The code does not deliver the PRD’s central promise:

```text
saved recipe version → real batch → Making Mode → cure record → actual yield → cost per bar
```

The product is therefore not at polish stage. It is at **integration and product-architecture rescue stage**.

### Current reality

- The public homepage exists and its calculation-demo call was corrected in the pulled revision, but it still does not prove the connected workflow or include the requested blog/editorial modules.
- The blog has static article routes, but it is not integrated into the homepage and the marketing shell is invalid/duplicated.
- A dashboard route now exists, but it is only a five-card directory linking to the tools. It loads no operational data.
- Recipes and library pages are mounted with empty arrays.
- Recipe calculation exists in a limited form, but save/version/start-batch actions are not connected.
- Batch creation and Making Mode use transient React state and console output rather than persistence.
- Cure and costing pages use a hard-coded demo batch.
- Core APIs do not enforce user ownership.
- Middleware’s earlier all-public prefix defect was corrected in the pulled revision, but authorization remains incomplete because private APIs do not scope records to the authenticated user.
- Subscription code does not have a complete checkout → webhook → entitlement lifecycle.
- The deployed semantic Tailwind colors resolve to transparent on key surfaces, explaining the white appearance.

## 2. Classification standard

| Classification | Meaning |
|---|---|
| Implemented and integrated | Reachable UI, correct behavior, persistence, ownership, states, and downstream handoff all exist. |
| Implemented but disconnected | Useful code exists but is not wired into the intended user flow. |
| Partial prototype | Surface exists, but substantial behavior, persistence, validation, or states are missing. |
| Missing | No meaningful implementation exists. |
| Contradicted | Code or copy directly violates the PRD or makes an untrue product claim. |

## 3. Traceability summary

| Area | Status | Code evidence | Required planning correction |
|---|---|---|---|
| Public homepage | Partial / overclaiming | `app/page.tsx` has hero, calculation output, feature cards, workflow, and pricing. The calculation call was corrected in the pulled revision, but the page has no blog feed, no real workspace proof, and claims persistent timers, reminders, a cost catalogue, and connected handoffs that the product does not yet deliver. | Make `/` a proof-led marketing/editorial page for logged-out users. Show only working capability, a real connected production record when available, and latest articles. |
| Marketing shell | Contradicted | `app/marketing/layout.tsx` nests `<html>` and `<body>` under the root layout, adds a second header, and links Home to nonexistent `/marketing`. | One root document, three explicit shells: marketing, auth, app. Public routes should be `/`, `/pricing`, `/blog`, `/blog/[slug]`. |
| Blog | Partially integrated | `lib/blog-data.json`, `lib/blog.ts`, `/marketing/blog`, and slug pages exist. Category links do not filter; referenced images are not rendered; homepage does not surface posts. | Define content source, featured/latest modules, real category filtering, article template, imagery, related content, and contextual product CTA. |
| Dashboard | Contradicted / superficial | `app/dashboard/page.tsx` defines a five-item `tools` array and renders it as a `rounded-lg` card grid. It reads only the session display name; no recipe, batch, cure, cost, due-work, or activity data is queried. | Replace the tool directory with an operational home: attention queue, active production pipeline, recipe outcomes, activity ledger. No tool-link card grid. |
| Navigation | Contradicted | `app/layout.tsx` always shows Recipes / Batches / Cure / Costing, including public pages. | Separate public and app navigation. App uses Overview, Recipes, Batches, Curing, Costs, Ingredients, Guides, Settings. |
| Auth | Partial | Credentials auth, `Providers`, JWT session IDs, and dashboard redirect now exist. Password reset is still a placeholder; logout and onboarding completion remain absent; a hard-coded development secret fallback remains. | Finish reset/logout/onboarding and remove unsafe production fallback. Keep server-side authorization separate from route visibility. |
| Route protection | Partially corrected | `middleware.ts` now uses exact public-route matching and explicit prefixes. `/marketing` remains public despite being a 404, and route protection does not replace ownership checks inside APIs. | Keep exact matching, normalize public routes, and independently authenticate/authorize every API mutation and query. |
| User data ownership | Contradicted | Recipe GET returns all recipes; POST uses `createdBy: "user"`; batch lacks `userId`; cure/cost APIs trust arbitrary batch IDs. | Every private entity must carry or derive `userId`; every query/mutation must scope by authenticated user. |
| Recipe calculation | Partial / safety risk | `lib/calculations/sap.ts` has basic NaOH SAP math and tests. Fixed 1000g oils, incomplete KOH/dual-lye behavior, ignored concentration input, weak validation, no unit scaling. | Freeze feature work until an authoritative calculation contract and test-vector suite pass. Do not market unsupported safety capability. |
| Mold calculator | Partial / likely wrong | `components/recipe-builder/recipe-builder.tsx` displays liters × 0.9 as grams and applies a fixed approximate lye factor. | Derive units explicitly; calculator only sets target oil mass. The selected formulation engine calculates lye/water. |
| Recipe save/versioning | Disconnected / missing | `/api/recipes` can create a recipe/version, but Recipe Builder never calls it and has no name/save/start-batch action. | Recipe save creates immutable version; detail page exposes Start batch from this version. |
| Recipe library | Partial / disconnected | `/recipes` and `/library` pass `recipes={[]}`; client search component exists. | Load user-scoped recipes; distinguish personal, curated, archived; add detail/version routes and meaningful search/filter. |
| Templates | Disconnected prototype | `components/template-recipes` is unmounted; Use action logs/alerts. | Template action creates an editable private draft, not an alert. Templates need verified provenance. |
| Recipe Intelligence / AI | Contradicted | Unmounted component generates hard-coded percentages while PRD says AI never invents quantities. | Remove AI from rescue MVP. Reintroduce only as explanation after deterministic and lifecycle foundations are trustworthy. |
| Batch persistence | Missing | No batch API; `BatchLog` console-logs and mutates local state. | Batch is a first-class user-owned object created from an exact recipe version and persisted before Making Mode. |
| Making Mode | Partial / contradicted | Local checklist/timer exists; checklist is not enforced and timer does not survive refresh. | Persist session, step state, timer origin, measurements, safety acknowledgement, skip reason, and save status. |
| Batch detail/history | Missing | No `/batches/[id]` route. | Batch detail is the central operational page with Overview, Making record, Cure, Cost, Notes/history. |
| Cure | Partial demo | Page uses `demo-batch`; observation API/table exist but are not loaded into a real batch context. | `/cure` is portfolio view; observations and completion live on `/batches/[id]`. Honest estimate, no automated “safe/ready” claim. |
| Costing | Partial demo / wrong flow | Page has zero-valued demo data. UI takes target price and derives margin, while PRD requires target margin → suggested price. No catalogue or save integration. | Batch actuals + yield + ingredient cost basis drive cost. Add target margin input and persist provenance. |
| Ingredient cost catalogue | Missing | No CostRecord/catalogue entity or management surface. | Lightweight ingredient purchase/cost records are required before cost-per-bar can be trusted. |
| Subscription | Partial / broken lifecycle | Dodo helpers and pricing UI exist; missing import, bad public CTA route, no webhook, no durable provider subscription linkage, no server-side gates. | Dodo is authoritative. Billing follows core workflow rescue, with checkout, webhook verification, idempotency, entitlement state, and cancellation semantics. |
| Trial/tier policy | Unresolved / contradicted in current product | Current pricing/trial copy and stored trial fields do not represent an approved or enforced policy; limits are not enforced. The rescue PRD leaves trial/free-tier policy open and prohibits advertising it until resolved. | Approve one policy, encode it in the state machine, and enforce it server-side before making entitlement claims. |
| Settings | Missing | No settings route. | Profile, units, notifications, billing, data export/delete, safety acknowledgement. |
| Analytics | Missing | No event wrapper or emissions. | Instrument lifecycle transitions and dashboard actions after persistent data flow exists. |
| SEO infrastructure | Partial | Metadata exists; no JSON-LD, sitemap/robots route, oil pages, or truthful data-backed proof. | Homepage + blog IA first. Add schema, sitemap, canonicals, and only substantive calculator/ingredient pages. |

## 4. Why the UI looks white and generic

### 4.1 Theme utilities are not rendering as intended

The deployed interface was inspected with computed styles. Key classes such as `bg-primary`, `bg-muted/50`, and `bg-background` resolved to transparent. `app/globals.css` defines raw CSS variables, but the Tailwind v4 semantic color mapping required by the utility classes is absent.

This is not a taste debate. Intended action fills and section surfaces literally disappear.

### 4.2 The palette and surface system are too close in value

Even if the utilities worked, the current system uses:

- 97% lightness warm background
- 94% lightness muted background
- white cards
- pale borders

The result is white on off-white on almost-white. There is no strong application shell, no production-ledger plane, and no visual distinction between navigation, records, calculations, and editorial content.

### 4.3 Generic composition is repeated everywhere

The interface relies on:

- centered narrow containers
- equal cards with border/background/radius
- icon + heading + copy grids
- metric tiles
- emoji branding
- `rounded-lg` as a recurring default

The generic-design scan can pass while the whole page still feels generic. It is a string detector, not a product-design review.

### 4.4 The visual claim is unsupported by product evidence

The homepage claims “one workspace” but shows abstract feature cards and demo metrics. It does not show:

- a saved recipe version
- an active batch inheriting that version
- planned vs actual measurements
- a cure observation timeline
- actual yield
- cost per bar

The homepage describes integration instead of demonstrating it.

## 5. Why it feels like disconnected free tools

1. Navigation is a flat list of modules.
2. The new “operational home” is only a card grid that repeats those same links.
3. There are no recipe detail or batch detail routes.
4. Routes use empty arrays and demo records.
5. Recipe Builder does not save or continue to batch creation.
6. Batch creation does not persist or inherit a recipe version.
7. Cure and Costing are orphan top-level tools instead of views of a batch.
8. Making Mode “auto-save” and timers are local state.
9. The strongest product relationship exists only in the database sketch, not in the interface.

## 6. Product model correction

SoapCraft Pro is not four tools. It is one production record with multiple views.

```text
Recipe
  └── immutable Recipe Version
        └── Batch
              ├── Making Session + planned/actual measurements
              ├── Cure Observations + user-controlled readiness
              ├── Yield
              └── Cost Record + cost basis + margin target
```

### Primary objects

- **Recipe:** the evolving formulation identity.
- **Recipe Version:** immutable formula snapshot used by batches.
- **Batch:** the operational center of the product.
- **Ingredient Cost Record:** historical cost basis.
- **Cure Observation:** dated evidence attached to a batch.
- **Activity Event:** factual history of changes and lifecycle transitions.

### Product views

- Dashboard: all current work and next actions.
- Recipes: formulation portfolio.
- Batches: production portfolio.
- Curing: filtered portfolio of batches in cure.
- Costs: cross-batch profitability view.
- Ingredients: cost catalogue and formulation source data.

Cure and Cost are not independent tools. They are batch data viewed in context and summarized across batches.

## 7. Correct dashboard concept

The dashboard answers:

> What is happening in my soap production, what needs attention, and what did I learn?

### Required dashboard regions

1. **Needs attention queue**
   - active Making Mode session
   - overdue/due cure observation
   - batch missing final yield
   - batch missing cost basis
   - recipe with blocking safety validation
   - failed save/sync requiring retry

2. **Active production pipeline**
   - one row per batch
   - exact recipe version
   - lifecycle state
   - current step or cure day/window
   - latest observation
   - yield status
   - cost per bar/margin status
   - next action

3. **Recent recipes and outcomes**
   - current version
   - last batch result
   - number of batches
   - variance/outcome summary
   - Start another batch / Create new version

4. **Activity ledger**
   - factual chronological events
   - recipe saved, batch started, measurements changed, observation logged, yield finalized, cost recalculated

5. **Single New command**
   - New recipe
   - Start batch from recipe
   - Add ingredient cost

### Explicitly banned dashboard pattern

Do not use a primary grid of cards linking to Recipes, Batches, Cure, and Costing. Navigation already performs that job. Dashboard space is for live operational information.

## 8. Marketing/homepage correction

Logged-out `/` must contain:

1. Marketing navigation: Product, Pricing, Guides, Blog, Log in, Start a recipe.
2. Proof-led hero with a real composite workspace preview.
3. Connected lifecycle artifact: `Recipe v3 → Batch #024 → Cure day 18/42 → $2.14/bar`.
4. Calculation trust section with exact output, warnings, and method/source explanation.
5. Planned-vs-actual example showing how batch history creates value.
6. Featured article plus three latest posts, with real category links and images.
7. Pricing after value proof.
8. Legal/safety/footer links.

Logged-in `/` must resolve to the operational dashboard, not marketing.

## 9. Critical trust blockers before visual polish

The following must be fixed before the product makes safety or workspace claims:

- authoritative calculation specification and sourced SAP dataset
- independent test vectors for NaOH/KOH/dual lye, water modes, purity, units, scaling, rounding, and invalid inputs
- exact authentication boundaries
- per-user authorization on every private query/mutation
- immutable recipe-version linkage
- persistent batch/step/timer/save state
- real cure and costing links to the batch
- truthful Dodo webhook-driven entitlement state
- removal of unsupported “AI,” data-backed, cure-prediction, and persistent-timer claims

## 10. Planning artifacts changed by this audit

- `product/CODE-PRD-AUDIT.md`: created as the evidence-based baseline.
- `product/PRD.md`: replaced with a traceable rescue PRD centered on the batch lifecycle.
- `product/DESIGN.md`: replaced with an operational UX and visual-system specification.
- `product/PRD_CRITIQUE.md`: replaced with the independent adversarial review and resolved gates.
- `flowchart/product-flow.md`: replaced with lifecycle, shell, route, state, and handoff maps.
- `build-order.md`: replaced with dependency-ordered implementation tickets suitable for a cheaper model.
- `brief.md`: aligned to the rescue scope so it cannot override the PRD with stale AI/trial claims.

## 11. Repository hygiene note

At audit start the worktree already contained:

```text
D package-lock.json
M package.json
```

Those changes predated this planning pass and were not modified or reverted by the audit.
