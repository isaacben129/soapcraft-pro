# SoapCraft Pro Design and UX Specification

**Version:** 3.0 — Chemist’s Production Ledger
**Purpose:** Buildable UX specification for the rescue PRD. This document replaces generic SaaS cards with an operational product system.

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

### 3.2 Auth shell

- small brand lockup
- focused form
- safety/privacy/legal support links
- no Recipes/Batches/Cure/Cost links
- no marketing feature grid beside the form

### 3.3 Application shell

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
|---|---|---|
| App rail | deep umber-charcoal | persistent navigation and product identity |
| Workspace canvas | warm mineral paper | default operational background |
| Ledger row | slightly darker warm paper | records, queues, tables |
| Editable sheet | soft ivory | focused forms and editors |
| Calculation sheet | pale clay | deterministic inputs/outputs |
| Cure sheet | muted sage | cure observations and status |
| Cost sheet | muted brass/sand | costs and margin context |
| Dialog/popover | near-white | temporary elevation only |

White is not the default surface for both page and cards.

### 4.2 Proposed color tokens

Values must be tested in real rendered components and may be adjusted for contrast. Tailwind v4 utilities must be mapped with `@theme`/`--color-*` tokens so computed styles are not transparent.

```css
:root {
  --color-canvas: #eee9df;
  --color-sheet: #f8f4eb;
  --color-ledger: #e4ded2;
  --color-rail: #241f1b;
  --color-rail-muted: #b8afa2;
  --color-ink: #211d19;
  --color-ink-muted: #675f56;
  --color-rule: #c9c0b3;
  --color-action: #8a4b2a;
  --color-action-hover: #6f3b21;
  --color-action-text: #fffaf2;
  --color-clay: #e7d5c7;
  --color-sage: #d8dfd1;
  --color-brass: #ded1aa;
  --color-info: #315f73;
  --color-success: #3f6b4f;
  --color-warning: #9a6117;
  --color-danger: #9a3f34;
  --color-focus: #2166d1;
}
```

Status fills must maintain readable text. Do not place gray text on colored/dark fills.

### 4.3 Typography

- **Marketing display:** Playfair Display, restrained
- **Application UI:** DM Sans
- **Measurements/data:** JetBrains Mono with tabular numerals

Application headings do not all need serif. Use hierarchy, spacing, and weight before switching families.

Suggested scale:

| Role | Size/line | Font |
|---|---|---|
| Marketing display | clamp(42px, 6vw, 72px) / 1.03 | Playfair |
| App page title | 28–36px / 1.15 | DM Sans 650 or Playfair selectively |
| Section title | 18–22px / 1.25 | DM Sans 650 |
| Body | 16px / 1.55 | DM Sans |
| Label | 13–14px / 1.35 | DM Sans 600 |
| Metadata | 12–13px / 1.4 | DM Sans |
| Measurement | 14–18px / 1.3 | JetBrains Mono |

### 4.4 Shape and elevation

- default radius: 3px
- compact control radius: 2–4px
- pills only for filters/status where the shape conveys compact categorization
- no `rounded-lg` default
- borders/rules define persistent structure
- shadow reserved for menus, dialogs, sheets, and sticky Making Mode controls
- record lists and tables remain on the canvas rather than floating in separate cards

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

It does not answer “which tool do you want to open?”

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
│             │ ...                                                 │
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

- title: “Start your first production record”
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

**Headline:** “From formulation to finished bar, in one production record.”

Support:

“Calculate a recipe, make the batch, record the cure, and know the real cost without rebuilding your work in four different tools.”

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
- “AI did not generate these quantities” only if needed; avoid defensive repetition

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

### 7.6 Pricing and footer

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
│ identity + target               │ save state                 │
│ oil blend table                 │ exact quantities           │
│ lye/water settings              │ warnings                   │
│ fragrance/additives             │ properties/method notes    │
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
- estimated window reached, derived only from elapsed time against the configured window and labelled: “Estimated window reached — review observations; only you can mark ready.”
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

“Mark ready” is an explicit user action. Product copy must not say “safe” or “fully cured” based solely on elapsed time.

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

---

## 13. Motion vocabulary

| Interaction | Motion | Duration |
|---|---|---|
| Row insertion/update | opacity + small vertical shift | 120–180ms |
| Changed calculated value | background emphasis fade | 250–400ms |
| Sheet/dialog | origin-aware transform + opacity | 180–240ms |
| Save success | icon/text state transition | 120–180ms |
| Error | no shake; direct message reveal | 120–180ms |
| Navigation | mostly instant; optional subtle content fade | ≤180ms |

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

- “Water amount is based on 33% lye concentration.”
- “Save failed. Your entries are still here.”
- “No cost record is available for coconut oil.”
- “This batch is on cure day 18 of your 42-day window.”

Avoid:

- “AI-powered perfection”
- “Your soap is safe now”
- “Oops! Something went wrong” without a next action
- “Unlock your potential”
- “Everything you need”
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

### Batch/Making

- [ ] exact parent recipe version visible
- [ ] plan vs actual visible
- [ ] timer/step state survives reload
- [ ] safety checklist blocks start until complete
- [ ] every save state is truthful

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
6. marketing homepage desktop/mobile with blog module
7. blog index/article
8. settings/billing

Mockups must use the same object/data model and realistic linked sample records. Do not approve isolated screens whose handoffs cannot be demonstrated.
