# SoapCraft Pro — Design and UX Specification

**Version:** 1.0 — Anonymous-First Utility Hub Design
**Purpose:** Buildable design specification. All visual tokens are provisional pending Isaac approval.
**Companion to:** `product/PRD.md`, `product/ARCHITECTURE.md`, `product/FLOWS.md`
**Date:** 2026-09-10

---

## 0. Design gate status

**State:** Design tokens verified against `app/globals.css`. All tokens are **provisional pending Isaac approval**. No new brand tokens are invented.

**Tokens confirmed as existing in source code:**
- All color tokens in `app/globals.css` `@theme` block and `:root` block
- Typography tokens: `"DM Sans"`, `"Playfair Display"`, `ui-monospace` stack
- Shape tokens: `--radius: 0.5rem` (3px), `--radius-lg: 0.75rem`, `--radius-md`, `--radius-sm`
- Elevation tokens: `--shadow-elevation-1/2/3`, `--shadow-sm/md/lg`
- Component grammar from previous DESIGN.md v3.0 sections 5–18

**Tokens needing user confirmation:**
- Any tokens that came from `src/globals.css` but not yet verified in the built application
- The full utility hub visual treatment (new routes like `/tools/*`, `/examples/*`) — pending design skill routing
- **All new visual tokens are provisional until Isaac approves**

**Design gate:** Visual direction for the utility hub expansion is unresolved until routed design skills are loaded. This document preserves the approved tokens and notes what needs confirmation; it does not invent new visual direction.

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

> The user should always know which tool they are using, what inputs they entered, what changed from the result, and whether the record is saved.

### Product seam

Every primary surface reinforces this lineage:

```text
Tool → Input → Result → Assumption/Warning → Save State → Continue
```

No module is designed in isolation.

### Utility hub extension

The utility hub design extends the production ledger thesis to public surfaces. The same calm precision applies to calculator tools, guides, examples, and the tool directory. Public tools must feel like professional workshop instruments — functional, deterministic, and transparent — not marketing pages.

**Public tool surfaces follow the same design grammar as the application shell, but with lighter surface elevation (canvas/sheet rather than rail).**

---

## 2. App Life Spec

- **Core loop:** discover tool → enter inputs → see result → save/export/share → reload/re-entry
- **Moment of truth:** the user sees exact deterministic quantities, relevant warnings, and the method/version behind the result, then can save and continue without re-entry
- **Primary metric:** weekly anonymous utility sessions that produce a correct result, plus proportion that continue to a connected tool
- **Activation metric:** first anonymous completion rate
- **User constraint:** preserve context and input; never claim a save that did not occur
- **Personality:** calm precision, practical craft, no magic language
- **Utility hub metric:** anonymous completion rate and connected-tool continuation rate
- **Accessibility budget:** WCAG 2.2 AA, keyboard complete, 44px targets, reduced motion, status beyond color

### Signature interaction

```text
Trigger: user changes a formulation or cost input
Before: previous result or unsaved draft is visible
During: deterministic outputs update immediately; changed values are identified
After: exact quantities, assumptions, warnings, and save state are visible
Commit: Local save / export / share URL
Continuation: Tool loads with previous inputs on re-entry
```

Feedback is factual, not celebratory. Do not animate every metric or use confetti.

---

## 3. Information architecture and shells

### 3.1 Marketing shell (homepage)

**Header**
- Proprietary mark + SoapCraft Pro
- Product, Tools, Methodology, Safety, Privacy, Terms
- Log in (optional, future)
- No pricing, no subscription, no marketing feature grid

Behavior:
- compact but not sticky-glass
- one border/rule may separate header from page
- mobile uses menu sheet; no app navigation

### 3.2 Tool directory shell

**Header** (same as marketing shell)

- Tool directory grid or list
- Each tool shows: name, one-line description, status badge (Working / Coming soon), input→output promise
- Entry point for all public utility tools
- Each tool card links directly to the functional tool (not a landing page)
- Filters by category
- Desktop: constrained layout; Mobile: stacks vertically with no horizontal overflow

### 3.3 Auth shell (future)

- small brand lockup
- focused form
- safety/privacy/legal support links
- no Recipes/Batches/Cure/Cost links
- account creation is optional — never a gate

### 3.4 Public tool shell

- No rail navigation (public tools are standalone surfaces)
- Tool directory serves as the navigation hub
- Each tool has its own object header with title, status, and share/export actions
- Canvas background (`--color-canvas` / `--background`)
- Calculation sheet (`--color-clay`) for inputs and outputs

---

## 4. Visual system

### 4.1 Surface architecture

| Surface | Token intent | Role |
|---------|-------------|------|
| App rail | deep umber-charcoal | persistent navigation (future) |
| Workspace canvas | warm mineral paper | default operational background |
| Ledger row | slightly darker warm paper | records, queues, tables |
| Editable sheet | soft ivory | focused forms and editors |
| Calculation sheet | pale clay | deterministic inputs/outputs |
| Cure sheet | muted sage | cure observations and status (future) |
| Cost sheet | muted brass/sand | costs and margin context |
| Dialog/popover | near-white | temporary elevation only |

White is not the default surface for both page and cards.

### 4.2 Color tokens (PROVISIONAL — pending Isaac approval)

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

**Status:** All tokens confirmed present in source code at `/opt/data/studio/apps/soapcraft-pro/app/globals.css`. **All tokens are provisional pending Isaac approval.**

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

**Status token mapping:**
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

**Scale:**

| Role | Size/line | Font |
|------|-----------|------|
| `.text-display` | 2.5rem / 1.1 | Playfair Display, weight 700 |
| `.text-section` | 1.5rem / 1.3 | Playfair Display, weight 600 |
| `.text-body` | 1rem / 1.6 | DM Sans |
| `.text-label` | 0.875rem / 1.4 | DM Sans, weight 500 |
| `.text-meta` | 0.75rem / 1.4 | DM Sans, `--muted-foreground` color |

### 4.4 Shape and elevation

**Source:** `app/globals.css` `--radius` tokens.

- default radius: `0.5rem` (3px) — `--radius`
- compact control radius: 2–4px
- pills only for filters/status where the shape conveys compact categorization
- no `rounded-lg` default
- borders/rules define persistent structure
- shadow reserved for menus, dialogs, sheets, and sticky controls
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

**All brand tokens are provisional pending Isaac approval.**

Replace emoji with:
- a proprietary mark combining a soap cut/profile with a measurement or batch-label motif
- Lucide icons for system actions/status
- original process photography or restrained editorial illustration

Do not use glossy generic wellness stock photography. No brand mark is created without Isaac approval.

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

validation severity: Information / Needs review / Blocking
persistence: Unsaved / Saving / Saved / Save failed
attention reason: Due observation / Missing cost basis / Resume making

### Action hierarchy

- one dominant action per region
- text links for contextual navigation
- secondary outlined/quiet action
- destructive separated in overflow or danger region

Do not show three equal CTA buttons.

---

## 6. Homepage specification

### 6.1 Hero

Split layout, left aligned.

Copy direction:

**Headline:** "From formulation to finished bar, in one production record."

Support:
"Calculate a recipe, make the batch, record the cure, and know the real cost without rebuilding your work in four different tools. All free. No account required."

Actions:
- Start a recipe (→ `/tools`)
- See the workflow

Right-side proof artifact:
- real rendering of production application components populated with production-shaped synthetic values such as Recipe v3, Batch #024, cure day 18/42, and $2.14/bar, clearly labelled **Example**
- clearly tied together through labels/lines
- use real application visual language, not decorative KPI cards

### 6.2 Tool discovery / value cards

Categorized list of available tools. Each tool card shows:
- name
- one-line description
- input→output promise
- status badge (Working / Coming soon)
- direct action ("Open tool" → `/tools/<tool-slug>`)

Do not render four equal feature cards. Group by category: Formulation, Sizing, Cost, Markets, Production, Purchasing.

### 6.3 Workflow / timeline

One production record moves through four stages. Show what is inherited:
- formula quantities into batch plan
- actual measurements into cure record
- actual yield into cost per bar
- outcome back into recipe history

Do not render four equal feature cards. Use a visual timeline.

### 6.4 UI / proof panels

Show an actual formulation table and deterministic outputs with:
- source/dataset revision
- calculation assumptions
- warnings
- safety note
- clearly labelled **Example**

Do not claim SoapCalc verification unless the fixture evidence exists.

### 6.5 Use-case modules

Practical scenarios:
- Batch planning: "How much will it cost to make 20 bars for the craft fair?"
- Cost analysis: "What's my real cost per saleable bar?"
- Event planning: "How many units do I need to break even?"

### 6.6 Safety / trust boundary

Clear public statement:
- Chemistry is gated and not publicly released
- No real formulation output is advertised as usable
- Safety disclaimers describe scope
- Business outputs are planning aids, not advice
- Privacy, terms, and safety pages are publicly accessible
- No anonymous result requires authentication

### 6.7 FAQ

Common questions about anonymous use, tool capabilities, and safety:
- "Do I need an account?" — No. All tools work without login.
- "Is my data saved?" — Locally only. No cloud sync unless you choose an account (future).
- "Are the chemistry calculations released?" — No. Chemistry is gated pending verification.
- "Is there a cost?" — Core tools are free forever.

### 6.8 CTA

Clear entry to `/tools`. "Explore all free tools." No pricing, no subscription, no email capture.

---

## 7. Tools catalogue specification

### Desktop

Constrained layout showing every actual tool:
- Each tool card: name, description, status badge, input→output promise, direct action button
- Category filters
- No horizontal overflow
- Links go directly to functional tools, not landing pages

### Mobile

- Vertical stack with no horizontal overflow
- One tool per row
- Touch targets ≥44px
- Category filters accessible via dropdown or tab

### Tool catalogue entries (current actual tools from source audit)

| Tool Slug | Name | Status | Input → Output Promise |
|-----------|------|--------|----------------------|
| `/tools/batch-cost` | Batch Cost Calculator | Working | Ingredient costs + quantities + batch weight → Full cost breakdown, cost per unit, assumptions, warnings |
| `/tools/recipe-scaling` | Recipe Scaling | Working | Source recipe + target weight → Scaled ingredient amounts, formula revision |
| `/tools/mold-volume` | Mold Volume | Working | Internal dimensions or water-fill volume → Normalized target-fill volume |
| `/tools/craft-fair-break-even` | Craft-Fair Break-Even | Working | Fixed event costs + selling price → Break-even units, methodology |
| `/tools/formulation` | Formulation | **GATED** | Lye calculation — not publicly released |

Tools not yet confirmed as shipped must not appear in the catalogue.

---

## 8. Save, loading, error, and transition behavior

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

### Errors

- field errors at field
- blocking summary near commit action
- retain all user data
- retry button at failure site
- correlation/reference ID only if useful for support

### Share URL states

- Share URL generated: confirmation with copyable link
- Share URL copied: brief confirmation, no celebration
- Share URL invalid: informational message, tool loads empty state

---

## 9. Motion vocabulary

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

## 10. Content and copy system

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

## 11. Accessibility requirements

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

## 12. Design acceptance criteria by surface

### Homepage
- [ ] marketing shell only
- [ ] no four-card feature grid
- [ ] integrated featured/latest content
- [ ] real product proof or explicitly labelled Example
- [ ] no false capability claims
- [ ] real image assets and alt text
- [ ] tool directory section with working links
- [ ] 2,000+ words distributed through visual modules
- [ ] safety/trust boundary module present
- [ ] FAQ module present
- [ ] clear CTA to `/tools`

### Tool catalogue
- [ ] every tool functional and reachable from homepage
- [ ] no auth gate for any core calculation
- [ ] desktop constrained layout; mobile stacks with no horizontal overflow
- [ ] each tool shows status, input→output promise, direct action
- [ ] no fake tool routes exposed
- [ ] links go directly to functional tools

### Public tools
- [ ] every tool follows same design grammar (canvas/sheet surfaces)
- [ ] calculation results show assumptions, formula revision, and warnings
- [ ] exported/shown results match calculation output
- [ ] share URL works for anonymous users

---

## 13. Token verification notes

All tokens in §4.2 are confirmed present in the source code at `/opt/data/studio/apps/soapcraft-pro/app/globals.css`:

- **Verified in `@theme` block**: All CSS custom properties mapped as Tailwind v4 tokens
- **Verified in `:root` block**: Complete color system with HSL values
- **Verified in `.dark` block**: Dark mode color overrides
- **Verified semantic utilities**: `.bg-rail`, `.bg-canvas`, `.bg-ledger`, `.bg-sheet`, `.bg-clay`, `.bg-sage`, `.bg-brass` and text variants
- **Verified typography**: `font-sans: "DM Sans"`, `font-serif: "Playfair Display"`, `font-mono: ui-monospace` stack
- **Verified radius**: `--radius: 0.5rem`, `--radius-lg: 0.75rem`, `--radius-md`, `--radius-sm`
- **Verified elevation**: Shadow tokens

**All design tokens are provisional pending Isaac approval.** No new visual tokens are introduced without explicit reconciliation.

---

*Document version 1.0 — Anonymous-first utility hub design.*
*Companion to: `product/PRD.md`, `product/ARCHITECTURE.md`, `product/FLOWS.md`*
*All tokens provisional pending Isaac approval.*
*Vercel config: `{ "projectId": "prj_J12YtoRr3q5dmazDWsqs2jXLpOqy", "orgId": "team_gYtaSveuJSflpubmwIGhFD6Y", "projectName": "soapcraft-pro" }`*
