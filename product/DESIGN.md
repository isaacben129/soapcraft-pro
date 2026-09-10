# SoapCraft Pro — Design and UX Specification

**Version:** 4.0 — Reconciled utility hub model
**Purpose:** Buildable design specification. Tokens verified against `app/globals.css`.
**Companion to:** `product/PRD.md`, `product/ARCHITECTURE.md`, `product/FLOWS.md`
**Date:** 2026-09-09

---

## 0. Design gate status

**State:** Research-only phase. Routed design skills have not yet been loaded. This document reconciles the existing approved design tokens against the new utility hub direction.

**Approved baseline:** The exact color palette, typography, shape rules, and component grammar from the existing `DESIGN.md` v3.0 and `app/globals.css` are the current approved baseline because they are present in the source code (`/opt/data/studio/apps/soapcraft-pro/app/globals.css` and `/opt/data/studio/apps/soapcraft-pro/src/globals.css`).

**Design gate:** Visual direction for the utility hub expansion is unresolved until routed design skills are loaded. This document preserves the approved tokens and notes what needs confirmation; it does not invent new visual direction.

**Tokens confirmed as existing in source code (approved):**
- All color tokens in `app/globals.css` `@theme` block and `:root` block
- Typography tokens: `"DM Sans"`, `"Playfair Display"`, `ui-monospace` stack
- Shape tokens: `--radius: 0.5rem` (3px), `--radius-lg: 0.75rem`, `--radius-md`, `--radius-sm`
- Elevation tokens: `--shadow-elevation-1/2/3`, `--shadow-sm/md/lg`
- Component grammar from DESIGN.md v3.0 sections 5–18

**Tokens needing user confirmation (inherited from other projects):**
- Any tokens that came from `src/globals.css` but not yet verified in the built application
- The PostHog analytics integration details (implementation stub exists but not yet confirmed in production)
- The full utility hub visual treatment (new routes like `/tools/*`, `/examples/*`) — pending design skill routing

---

## 1. Design thesis

SoapCraft Pro should feel like a meticulous production ledger used at the workbench: calm, material, precise, and traceable.

It must not feel like:

- a directory of free calculators
- a generic white SaaS template
- a collection of equal feature cards
- a cheerful hobby blog pasted onto an admin panel
- an AI wrapper

### Core experience statement

> The user should always know which recipe version they are using, which batch is active, what changed from plan, what needs attention next, and whether the record is saved.

### Product seam

Every primary surface reinforces this lineage:

```text
Recipe / Version / Batch / Current stage / Next action
```

No module is designed in isolation.

### Utility hub extension

The utility hub design extends the production ledger thesis to public surfaces. The same calm precision applies to calculator tools, guides, examples, and the tool directory. Public tools must feel like professional workshop instruments — functional, deterministic, and transparent — not marketing pages.

**Public tool surfaces follow the same design grammar as the application shell, but with lighter surface elevation (canvas/sheet rather than rail).**

---

## 2. App Life Spec

- **Core loop:** formulate → save version → make batch → observe cure → finalize yield/cost → use evidence in next version
- **Moment of truth:** the user sees exact deterministic quantities, relevant warnings, and the method/version behind the result, then can save and continue without re-entry
- **Primary metric:** connected batch completion rate
- **Activation metric:** first verified recipe save rate
- **User constraint:** preserve context and input; never claim a save that did not occur
- **Personality:** calm precision, practical craft, no magic language
- **Primary retention surface:** live dashboard attention queue for active production
- **Accessibility budget:** WCAG 2.2 AA, keyboard complete, 44px Making Mode targets, reduced motion, status beyond color
- **Utility hub metric:** weekly anonymous utility sessions that produce a correct result, plus proportion that continue to a connected tool

### Signature interaction

```text
Trigger: user changes a formulation input
Before: saved calculation or unsaved draft is visible
During: deterministic outputs update immediately; changed values are identified
After: exact quantities, assumptions, warnings, and save state are visible
Commit: Save creates an immutable recipe version
Continuation: Start batch from version N carries the plan forward
```

Feedback is factual, not celebratory. Do not animate every metric or use confetti.

---

## 3. Information architecture and shells

### 3.1 Marketing shell

**Header**

- proprietary mark + SoapCraft Pro
- Product
- Pricing
- Guides
- Blog
- Log in
- primary action: Start a recipe

Behavior:

- compact but not sticky-glass
- one border/rule may separate header from page
- mobile uses menu sheet; no app navigation

### 3.2 Tool directory shell

**Header** (same as marketing shell)

- Tool directory grid or list
- Each tool shows: name, one-line description, status (working/coming soon)
- Entry point for all public utility tools
- Each tool card links to the actual functional tool (not a landing page)
- Filters by category: Formulation, Sizing, Cost & Pricing, Markets, Production, Purchasing

### 3.3 Auth shell

- small brand lockup
- focused form
- safety/privacy/legal support links
- no Recipes/Batches/Cure/Cost links
- no marketing feature grid beside the form
- account creation is optional — never a gate

### 3.4 Application shell

#### Desktop rail

Width: 232–256px expanded, 64–72px collapsed.

Navigation order:

1. Overview
2. Recipes
3. Batches
4. Curing
5. Costs
6. Ingredients
7. Guides
8. Settings

Bottom region:

- plan/status
- user menu
- log out

The rail uses a dark umber/charcoal plane to establish the app as an operational environment distinct from marketing.

#### Command bar

- page/object title
- optional breadcrumb
- global search is deferred from rescue MVP; reserve space only if needed, but do not render a nonfunctional control
- single New command
- due-work indicator
- account menu when rail is collapsed/mobile

#### Mobile navigation

Bottom navigation:

- Overview
- Recipes
- Batches
- Curing
- More

A central or prominent New action opens:

- New recipe
- Start batch from recipe
- Add ingredient cost

Costs, Ingredients, Guides, and Settings live in More. Do not squeeze desktop navigation into a top row.

---

## 4. Visual system

### 4.1 Surface architecture

| Surface | Token intent | Role |
|---------|-------------|------|
| App rail | deep umber-charcoal | persistent navigation and product identity |
| Workspace canvas | warm mineral paper | default operational background |
| Ledger row | slightly darker warm paper | records, queues, tables |
| Editable sheet | soft ivory | focused forms and editors |
| Calculation sheet | pale clay | deterministic inputs/outputs |
| Cure sheet | muted sage | cure observations and status |
| Cost sheet | muted brass/sand | costs and margin context |
| Dialog/popover | near-white | temporary elevation only |

White is not the default surface for both page and cards.

### 4.2 Color tokens

**Source:** `app/globals.css` `@theme` block and `:root` block. These are the current approved baseline — present in the source code.

```css
:root {
  --color-canvas: hsl(40 7% 90%);
  --color-sheet: hsl(38 18% 96%);
  --color-ledger: hsl(30 10% 90%);
  --color-rail: hsl(25 12% 13%);
  --color-rail-muted: hsl(30 8% 65%);
  --color-ink: hsl(25 12% 12%);
  --color-ink-muted: hsl(30 8% 35%);
  --color-rule: hsl(30 8% 75%);
  --color-action: hsl(25 55% 35%);
  --color-action-hover: hsl(25 55% 28%);
  --color-action-text: hsl(38 100% 98%);
  --color-clay: hsl(25 25% 85%);
  --color-sage: hsl(80 12% 80%);
  --color-brass: hsl(40 30% 75%);
  --color-info: hsl(195 35% 35%);
  --color-success: hsl(145 30% 30%);
  --color-warning: hsl(38 65% 35%);
  --color-danger: hsl(5 45% 40%);
  --color-focus: hsl(210 65% 50%);
}
```

**Tailwind v4 mapping:** All values are HSL components for `hsl()` reconstruction. Tailwind `@theme` maps these as `--color-*` tokens so computed styles are not transparent.

Status fills must maintain readable text. Do not place gray text on colored/dark fills.

**Dark mode** (from `app/globals.css` `.dark` block):

```css
.dark {
  --background: 25 10% 8%;
  --foreground: 38 8% 92%;
  --muted: 25 6% 16%;
  --muted-foreground: 30 6% 56%;
  --popover: 25 10% 10%;
  --popover-foreground: 38 8% 92%;
  --card: 25 10% 12%;
  --card-foreground: 38 8% 92%;
  --border: 25 6% 20%;
  --input: 25 6% 20%;
  --primary: 32 70% 55%;
  --primary-foreground: 25 10% 8%;
  --secondary: 25 6% 16%;
  --secondary-foreground: 38 8% 92%;
  --accent: 32 80% 55%;
  --accent-foreground: 25 10% 8%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 98%;
  --ring: 32 70% 55%;
}
```

**Status token mapping (from `app/globals.css` `:root`):**
- `--background: 40 7% 90%` maps to `--color-canvas`
- `--foreground: 25 12% 12%` maps to `--color-ink`
- `--success: 145 30% 30%` maps to `--color-success`
- `--warning: 38 65% 35%` maps to `--color-warning`
- `--destructive: 5 45% 40%` maps to `--color-danger`
- `--info: 195 35% 35%` maps to `--color-info`
- `--ring: 210 65% 50%` maps to `--color-focus`

### 4.3 Typography

**Source:** `app/globals.css` `:root` font declarations.

- **Marketing display:** Playfair Display, restrained
- **Application UI:** DM Sans
- **Measurements/data:** JetBrains Mono with tabular numerals (via `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace` stack)

Application headings do not all need serif. Use hierarchy, spacing, and weight before switching families.

**Scale (from `app/globals.css` semantic type scale):**

| Role | Size/line | Font |
|------|-----------|------|
| `.text-display` | 2.5rem / 1.1 | Playfair Display, weight 700 |
| `.text-section` | 1.5rem / 1.3 | Playfair Display, weight 600 |
| `.text-body` | 1rem / 1.6 | DM Sans |
| `.text-label` | 0.875rem / 1.4 | DM Sans, weight 500 |
| `.text-meta` | 0.75rem / 1.4 | DM Sans, `--muted-foreground` color |

Suggested extended scale:

| Role | Size/line | Font |
|------|-----------|------|
| Marketing display | clamp(42px, 6vw, 72px) / 1.03 | Playfair |
| App page title | 28–36px / 1.15 | DM Sans 650 or Playfair selectively |
| Section title | 18–22px / 1.25 | DM Sans 650 |
| Body | 16px / 1.55 | DM Sans |
| Label | 13–14px / 1.35 | DM Sans 600 |
| Metadata | 12–13px / 1.4 | DM Sans |
| Measurement | 14–18px / 1.3 | JetBrains Mono / ui-monospace |

### 4.4 Shape and elevation

**Source:** `app/globals.css` `--radius` tokens.

- default radius: `0.5rem` (3px) — `--radius`
- compact control radius: 2–4px
- pills only for filters/status where the shape conveys compact categorization
- no `rounded-lg` default
- borders/rules define persistent structure
- shadow reserved for menus, dialogs, sheets, and sticky Making Mode controls
- record lists and tables remain on the canvas rather than floating in separate cards

**Elevation tokens (from `app/globals.css`):**

```css
--shadow-elevation-1: 0 1px 3px rgba(0,0,0,0.08);
--shadow-elevation-2: 0 4px 12px rgba(0,0,0,0.10);
--shadow-elevation-3: 0 8px 24px rgba(0,0,0,0.12);
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 2px 8px rgba(0,0,0,0.06);
--shadow-lg: 0 4px 16px rgba(0,0,0,0.08);
```

### 4.5 Brand and imagery

Replace emoji with:

- a proprietary mark combining a soap cut/profile with a measurement or batch-label motif
- Lucide icons for system actions/status
- original process photography or restrained editorial illustration

Image subjects:

- weighing oils
- lye-solution setup with safe handling context
- trace/pour process
- curing rack/batch labels
- cost or formulation ledger

Do not use glossy generic wellness stock photography.

---

## 5. Global component grammar

### Ledger row

Use for dashboard attention, batch lists, recipes, and activity.

Anatomy:

```text
[type/status]  Object name + parent context  Evidence/metadata  Next action  ⋯
```

Rules:

- entire row may open detail when unambiguous
- primary action remains a real button/link
- secondary actions use overflow
- separators, not detached cards
- status includes text/icon

### Measurement cell

```text
Label
123.4 g
planned 120.0 g   +2.8%
```

- mono/tabular values
- units always adjacent
- variance uses sign and text, not color only
- dangerous/review variance provides explanation

### Object header

```text
Breadcrumb
Object title       status        primary action
Parent/version     dates         secondary actions
```

### Timeline

Use for lifecycle/activity, with timestamps and factual event labels. Avoid decorative stepper circles when a chronological ledger is clearer.

### Status vocabulary

- Draft
- Ready to make
- Making
- Curing
- Ready
- Archived
- Abandoned

Batch lifecycle vocabulary:

- Draft / Ready to make / Making / Curing / Ready / Archived / Abandoned

Separate vocabularies:

- validation severity: Information / Needs review / Blocking
- persistence: Unsaved / Saving / Saved / Save failed
- attention reason: Due observation / Missing yield / Missing cost basis / Resume making
- subscription state uses the PRD billing enum

Use each vocabulary consistently within its own database/UI/analytics contract; do not combine them into one enum.

### Action hierarchy

- one dominant action per region
- text links for contextual navigation
- secondary outlined/quiet action
- destructive separated in overflow or danger region

Do not show three equal CTA buttons.

---

## 6. Dashboard specification

### 6.1 Dashboard question

> What is happening in my production, what needs attention, and what changed?

It does not answer "which tool do you want to open?"

### 6.2 Desktop anatomy

```text
┌ rail ───────┬ command bar: Overview | search | New | due | user ┐
│             ├─────────────────────────────────────────────────────┤
│             │ NEEDS ATTENTION                                    │
│             │ [row] Resume Batch #024 — step 4 — 18m elapsed     │
│             │ [row] Observe Cedar Bar — cure day 14 — due today  │
│             ├─────────────────────────────────────────────────────┤
│             │ ACTIVE PRODUCTION PIPELINE                         │
│             │ Batch | Recipe v | Stage | Evidence | Yield | Cost │
│             │ ...                                                  │
│             ├──────────────────────────┬──────────────────────────┤
│             │ RECENT RECIPES/OUTCOMES │ ACTIVITY LEDGER          │
│             │ rows                     │ chronological rows       │
└─────────────┴──────────────────────────┴──────────────────────────┘
```

### 6.3 Needs attention derivation

Items are derived from real data, not manually curated cards.

Priority order:

1. save failed / unsynced record
2. active Making Mode
3. blocking recipe validation
4. overdue cure observation
5. batch missing final yield
6. ready batch missing costs
7. cost basis stale/missing

Each row includes one next action and object lineage.

### 6.4 Active pipeline

Desktop columns:

- batch
- recipe/version
- started
- lifecycle stage
- current evidence: step or cure day/latest observation
- yield
- cost status
- next action

The row should visually cross the lifecycle rather than present four unrelated module icons.

### 6.5 Empty dashboard

Do not show feature cards.

Show:

- title: "Start your first production record"
- concise explanation of recipe → batch → cure → cost
- primary: Build a recipe
- secondary: Use a verified template, only if verified templates exist
- a non-interactive annotated example pipeline clearly labelled Example

### 6.6 Mobile dashboard

Order:

1. urgent attention rows
2. Resume Making Mode if active
3. active batches grouped by stage
4. recent recipes
5. activity

Each batch record shows name, recipe/version, stage, day/step, next action, and cost completion. Expand for secondary data.

---

## 7. Marketing homepage specification

### 7.1 Hero

Split layout, left aligned.

Copy direction:

**Headline:** "From formulation to finished bar, in one production record."

Support:

"Calculate a recipe, make the batch, record the cure, and know the real cost without rebuilding your work in four different tools."

Actions:

- Start a recipe
- See the workflow

Right-side proof artifact:

- real rendering of production application components populated with production-shaped synthetic values such as Recipe v3, Batch #024, cure day 18/42, and $2.14/bar, clearly labelled Example
- clearly tied together through labels/lines
- use real application visual language, not decorative KPI cards

### 7.2 Connected workflow proof

One production record moves through four stages. Show what is inherited:

- formula quantities into batch plan
- actual measurements into cure record
- actual yield into cost per bar
- outcome back into recipe history

Do not render four equal feature cards.

### 7.3 Calculation trust

Show an actual formulation table and deterministic outputs with:

- source/dataset revision
- calculation assumptions
- warnings
- safety note
- "AI did not generate these quantities" only if needed; avoid defensive repetition

Do not claim SoapCalc verification unless the fixture evidence exists.

### 7.4 Evidence section

Show planned vs actual:

- oil weight
- lye/water
- trace time
- final yield
- cost variance

Use a coherent example record, explicitly labelled Example until real consented data exists.

### 7.5 Editorial/blog module

Structure:

- one featured article with large image
- three latest article rows/cards with unequal editorial hierarchy
- category links
- View all articles, linking to `/blog`

Cards include title, category, description, date/reading time, and image. No generic 4-column equal grid.

### 7.6 Tool directory module

For the utility hub expansion, the homepage includes a tool directory section:

- categorized list of available tools
- Each tool shows: name, one-line description, status badge (Working / Coming soon)
- Links go directly to functional tools, not landing pages
- Example: "Batch Economics Calculator — Calculate true cost per saleable bar" [Open tool]

### 7.7 Pricing and footer

Pricing appears after value proof. Footer includes Product, Resources, Account, Legal, safety disclaimer, and status/contact as applicable.

---

## 8. Recipe UX

### 8.1 Recipe portfolio

Default desktop view is a dense list/table.

Columns:

- recipe
- current version
- method
- warning state
- last made
- last outcome
- cost per bar
- actions

Curated templates are visibly distinct and not mixed into private records without labels.

### 8.2 Recipe builder desktop

Split workspace:

```text
┌ input editor: 60–65% ──────────┬ calculation/review: 35–40% ┐
│ identity + target               │ save state                  │
│ oil blend table                 │ exact quantities            │
│ lye/water settings              │ warnings                    │
│ fragrance/additives             │ properties/method notes     │
└─────────────────────────────────┴─────────────────────────────┘
```

Calculation panel may remain sticky within viewport but must not obscure content.

Oil blend table:

- ingredient
- percentage
- exact weight
- SAP/source access
- remove/reorder
- footer total

Show `100.0%` total and block save when invalid.

### 8.3 Recipe builder mobile

Staged single column:

1. Recipe and target
2. Oil blend
3. Lye and water
4. Additives/fragrance
5. Review and save

Sticky bottom summary:

- total oil percentage
- warning count
- current save/calculate action

Results should remain reachable without scrolling past the entire editor repeatedly.

### 8.4 Recipe detail

Use formula tables, version timeline, and batch history. Do not present each metric as a detached stat card.

Version diff highlights:

- ingredient added/removed
- percentage/weight change
- water/superfat/lye change
- changed outputs/warnings

---

## 9. Batch and Making Mode UX

### 9.1 Batch detail

Central object page with anchored sections or tabs:

- Overview
- Making record
- Cure
- Cost
- Notes/history

Overview uses a plan-vs-actual table and lifecycle timeline.

### 9.2 Making Mode desktop

Focused canvas, reduced rail prominence.

- current step
- timer
- required safety/measurement information
- notes/observation
- Back, Complete step, Skip with reason
- save state

### 9.3 Making Mode mobile

Full-screen distraction-reduced mode.

Top sticky region:

- batch number/name
- step N of M
- persistent timer
- save/sync state

Body:

- one instruction block
- relevant planned quantity
- actual input
- safety warning when applicable
- optional note/photo

Bottom sticky region:

- Back
- Complete step

Skip is secondary and requires reason. Reload resumes exact step and timer.

### 9.4 Safety checklist

Must be acknowledged before Making Mode begins. The Start button remains disabled until required items are checked. Store checklist version and timestamp.

Avoid liability theatre: concise, clear, and connected to the actual operation.

---

## 10. Cure UX

### Portfolio

Group batch records by:

- due/overdue observation
- curing normally
- estimated window reached, derived only from elapsed time against the configured window and labelled: "Estimated window reached — review observations; only you can mark ready."
- completed

Each row shows cure day, configured window, last observation, next due date, and action.

### Batch cure section

- elapsed-day timeline
- observation list
- weight trend when comparable values exist
- pH with method/context if captured
- hardness method/value
- appearance/scent/notes; photos are deferred until object-storage, authorization, retention, export, and deletion requirements are approved
- Add observation
- Mark ready

"Mark ready" is an explicit user action. Product copy must not say "safe" or "fully cured" based solely on elapsed time.

### Observation sheet

Desktop: side sheet or inline editor.
Mobile: bottom sheet.

Prefill date and computed day. Preserve values on failure. Show queued/sync state only if an actual offline queue exists.

---

## 11. Cost UX

### Batch cost section

Inherit actual batch quantities. Required structure:

1. ingredient line items
2. cost basis selector/source
3. packaging/labor/overhead sections according to scope
4. actual yield
5. total cost
6. cost per unit
7. target gross margin
8. suggested price

No arbitrary Oil ID text field.

Show equation disclosure:

```text
$2.14 cost / (1 - 0.60 margin) = $5.35 suggested price
```

### Portfolio

- incomplete cost queue
- compare batch/recipe/version costs
- ingredient cost changes
- margin status

Use table/ledger views and small trend charts only where data density justifies them.

---

## 12. Save, loading, error, and transition behavior

### Save indicator

Use the same language everywhere:

- Unsaved changes
- Saving…
- Saved at 14:32
- Save failed — Retry

Never show Auto-saved unless a server persistence request succeeded.

### Deterministic calculation

- no decorative loader under normal conditions
- announce changed result through `aria-live` without reading every value repeatedly
- changed values receive a brief background emphasis, then settle
- stale output is clearly marked if blocking input is invalid

### Server loading

- preserve table/row geometry with skeletons
- do not blank the shell
- urgent dashboard queue may load before lower-priority activity

### Errors

- field errors at field
- blocking summary near commit action
- retain all user data
- retry button at failure site
- correlation/reference ID only if useful for support

### Destructive actions

- archive by default
- recipe version used by batch is immutable
- explain downstream effects
- undo for reversible archive/status changes

### Share URL states

- Share URL generated: confirmation with copyable link
- Share URL copied: brief confirmation, no celebration
- Share URL invalid: informational message, tool loads empty state

---

## 13. Motion vocabulary

| Interaction | Motion | Duration |
|-------------|--------|----------|
| Row insertion/update | opacity + small vertical shift | 120–180ms |
| Changed calculated value | background emphasis fade | 250–400ms |
| Sheet/dialog | origin-aware transform + opacity | 180–240ms |
| Save success | icon/text state transition | 120–180ms |
| Error | no shake; direct message reveal | 120–180ms |
| Navigation | mostly instant; optional subtle content fade | ≤180ms |
| Share link copy | brief checkmark or text confirmation | 120–180ms |

Rules:

- motion explains causality
- no animation disguises latency
- no celebratory animation for routine logging
- honor reduced motion

---

## 14. Content and copy system

Voice:

- concise
- specific
- non-magical
- non-judgmental
- clear about estimates and user decisions

Preferred:

- "Water amount is based on 33% lye concentration."
- "Save failed. Your entries are still here."
- "No cost record is available for coconut oil."
- "This batch is on cure day 18 of your 42-day window."

Avoid:

- "AI-powered perfection"
- "Your soap is safe now"
- "Oops! Something went wrong" without a next action
- "Unlock your potential"
- "Everything you need"
- fake social proof or data claims

---

## 15. Accessibility requirements

- visible focus ring against every surface
- semantic labels and descriptions for numeric fields
- explicit units in label and accessible name
- tables use captions/headers; mobile alternatives preserve relationships
- icons have text or accessible labels
- status never color-only
- warning severity includes words/icons
- timer is readable without continuously announcing every second
- live announcements are throttled and meaningful
- 44px minimum touch targets in Making Mode and mobile primary flows
- dialogs trap focus and restore it on close
- 200% zoom and 320px viewport remain usable

---

## 16. Design acceptance criteria by surface

### Homepage

- [ ] marketing shell only
- [ ] no four-card feature grid
- [ ] integrated featured/latest blog content
- [ ] real product proof or explicitly labelled example
- [ ] no false capability claims
- [ ] real image assets and alt text
- [ ] tool directory section with working links

### Dashboard

- [ ] queries real user-owned data
- [ ] attention queue exists
- [ ] active pipeline exists
- [ ] recipe outcomes exist
- [ ] activity ledger exists
- [ ] empty state is a guided production record
- [ ] no primary tool-link card grid

### Recipe

- [ ] exact version identity visible
- [ ] oil percentages and weights share one table
- [ ] warnings persist through review/save
- [ ] Save and Start batch continuation are explicit
- [ ] recipe version chain visible

### Batch/Making

- [ ] exact parent recipe version visible
- [ ] plan vs actual visible
- [ ] timer/step state survives reload
- [ ] safety checklist blocks start until complete
- [ ] every save state is truthful
- [ ] Making Mode timer resumes after reload

### Cure

- [ ] tied to a real batch
- [ ] user controls readiness
- [ ] observations persist and can be corrected
- [ ] no unsafe completion language

### Cost

- [ ] quantities inherited from actual batch
- [ ] cost basis identified
- [ ] yield required
- [ ] target margin derives suggested price
- [ ] persisted result appears in batch and dashboard

### Utility Hub (Public Tools)

- [ ] every tool functional and reachable from homepage/tool directory
- [ ] no auth gate for any core calculation
- [ ] share URL works for anonymous users
- [ ] calculation results show assumptions, formula revision, and warnings
- [ ] exported/shown results match calculation output
- [ ] tool pages follow same design grammar (canvas/sheet surfaces)

---

## 17. Visual QA protocol

Every visible implementation ticket must include screenshots at:

- 1440×900 desktop
- 1024×768 tablet/compact desktop
- 390×844 mobile
- 320×568 narrow mobile for critical flows

Inspect:

1. computed background/text/border colors
2. token utilities resolve to non-transparent values where intended
3. contrast
4. overflow and 200% zoom
5. empty/loading/error/saved states
6. real seeded data, not only ideal copy lengths
7. keyboard/focus order
8. reduced motion

Automated generic scans are advisory. They cannot replace visual review.

---

## 18. Mockup approval sequence

Before implementation, create and approve high-fidelity mockups in this order:

1. application shell + populated dashboard desktop/mobile
2. recipe builder + recipe detail
3. batch detail + Making Mode mobile
4. cure portfolio + observation sheet
5. batch cost + cost portfolio
6. marketing homepage desktop/mobile with blog module and tool directory
7. blog index/article
8. settings/billing
9. public tool pages (calculator, sizing, costing) — follow same design grammar
10. share URL flow mockups (anonymous → tool → share)

Mockups must use the same object/data model and realistic linked sample records. Do not approve isolated screens whose handoffs cannot be demonstrated.

---

## 19. Utility hub design notes

### 19.1 Public tool surfaces

Public tool pages follow the same component grammar as the application shell but with lighter surface elevation:

- Canvas background (`--color-canvas` / `--background`)
- Calculation sheet (`--color-clay`) for inputs and outputs
- No rail navigation (public tools are standalone surfaces)
- Tool directory serves as the navigation hub
- Each tool has its own object header with title, status, and share/export actions

### 19.2 Share URL visual treatment

- Share URL state loads with the same visual grammar as the originating tool
- Transferred values are visibly editable (not read-only)
- "Inherited from [tool name]" label on transferred fields
- Share badge on the page indicating the link can be shared further

### 19.3 Example labelling

All pre-filled example values must be clearly labelled "Example":

- Example Recipe v3
- Example Batch #024
- Example cost per bar: $2.14
- Clearly tied together through labels/lines
- Use real application visual language, not decorative KPI cards

### 19.4 No gates in public tools

- No email capture before showing results
- No account creation prompt during calculation
- No "Sign up to see your result" messaging
- Results are immediately visible and complete
- Optional save/account prompt appears after the result is delivered

---

## 20. Token verification notes

All tokens in section 4.2 are confirmed present in the source code at `/opt/data/studio/apps/soapcraft-pro/app/globals.css`:

- **Verified in `@theme` block**: All CSS custom properties mapped as Tailwind v4 tokens
- **Verified in `:root` block**: Complete color system with HSL values
- **Verified in `.dark` block**: Dark mode color overrides
- **Verified semantic utilities**: `.bg-rail`, `.bg-canvas`, `.bg-ledger`, `.bg-sheet`, `.bg-clay`, `.bg-sage`, `.bg-brass` and text variants
- **Verified typography**: `font-sans: "DM Sans"`, `font-serif: "Playfair Display"`, `font-mono: ui-monospace` stack
- **Verified radius**: `--radius: 0.5rem`, `--radius-lg: 0.75rem`, `--radius-md`, `--radius-sm`
- **Verified elevation**: Shadow tokens

**Design gate for utility hub expansion:** Until routed design skills are loaded, the public tool surfaces inherit the existing design grammar. No new visual tokens are introduced without user confirmation.

---

*Document version 4.0 — Reconciled utility hub model. Replaces traffic-first DESIGN.md v3.0.*
*Companion to: `product/PRD.md`, `product/ARCHITECTURE.md`, `product/FLOWS.md`*
*Design tokens verified against: `/opt/data/studio/apps/soapcraft-pro/app/globals.css`*
*Vercel config: `{ "projectId": "prj_J12YtoRr3q5dmazDWsqs2jXLpOqy", "orgId": "team_gYtaSveuJSflpubmwIGhFD6Y", "projectName": "soapcraft-pro" }`*
