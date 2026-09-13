# SoapCraft Pro — Deployed Per-Tool UI Audit

**Audit date:** 2026-09-13  
**Method:** Direct desktop browser inspection plus visual screenshot review of the deployed `soapcraftpro.com` routes.  
**Scope:** This is a desktop baseline, not mobile acceptance. It does not prove result calculations; it evaluates visible form and empty-state UX.

## Cross-tool UI finding

The newer planner-style tools (Wholesale, Ready-By, Purchase) have a coherent two-column form/result pattern, clear labels, calm visual hierarchy, and explicit privacy reassurance. The older calculator surfaces (Mold, Scaling, Craft Fair) are simpler but visibly behind: they do not reserve an obvious result area, rely too much on placeholders, and use ambiguous icon-only destructive actions. Batch Cost exposes expert context payload mechanics too early.

| Tool | Desktop UI status | Direct competitor UI parity finding | Priority |
|---|---|---|---|
| Formulation | Intentionally gated | Gated screen is clear; no calculator can be compared until chemistry evidence clears | Gate, not polish |
| Mold Volume | Usable but sparse | Behind SoapmakingToolbox’s richer shape/assumption/result explanation | P1 |
| Recipe Scaling | Usable but ambiguous | Behind Batch Resizer in row parsing/classification, result preview, and clarity | P1 |
| Batch Cost | Functionally dense | Behind its competitor’s task focus because technical context controls interrupt the job | P0 UX |
| Wholesale | Strong structure, commercial wording needs precision | Modern layout is better; feature/result framing needs more explicit economics | P1 |
| Craft Fair | Usable but sparse | Behind competitor’s explicit event-cost categories and visible result summary | P1 |
| Ready-By | Strongest UI | Better than closest workflow comparator for anonymous single-task clarity | P1 validation/accessibility |
| Purchase Planner | Strong UI, narrow scope | Better for one anonymous purchase decision; needs multi-ingredient workflow to compete with inventory products | P1 |

---

## 1. Formulation — `/tools/formulation`

### What is visibly shipped
A heading, a short informational explanation, and a prominent **“Gated for verification”** notice. The route explains the ingredient source manifest is under independent review and provides a return-to-tools action. Navigation and legal links render normally.

### UI verdict
The gate is visually intentional rather than broken: hierarchy is clear, no empty interactive calculator shell misleads the user, and no fake “calculating” state appears. But this is not a usable formulation tool and cannot match the direct competitor’s UI until the safety gate clears.

### Required after the gate clears
- Preserve the current calm safety language as a pre-calculation disclosure, but do not make it the entire page.
- Show ingredient search, oil-blend table, alkali/water controls, formula assumptions, and results in one visible primary workspace.
- Keep source revision and math trace available beside results; avoid forcing users to a methodology page for core meaning.

---

## 2. Mold Volume — `/tools/mold-volume`

### What is visibly shipped
A clear title/intro, shape selector, labeled cm fields for length/width/height, and a primary calculate button. The form is calm and legible on desktop.

### UI verdict
The form itself is good. Its key weakness is **result discoverability**: before action, nothing indicates where volume, batter weight, or recommended oil weight will render. Height is isolated on a second row, which leaves the panel visually unfinished. There are no visible validation or input-help states.

### Direct-comparator implication
SoapmakingToolbox makes its outputs and calculation assumptions much more explicit: multiple shapes, fill percentage, lye concentration, units, and a dedicated “Weigh out” result block. SoapCraft should not copy its visual style; it should match the information clarity.

### Required UI changes
1. Reserve a result card in the initial state with labels: **Mold volume**, **Estimated fresh batter**, **Recommended oil weight**, and **Assumption**.
2. Keep units in persistent labels; add an inches/cm control or say explicitly that cm is required.
3. Align all geometry fields in a coherent grid and change fields when shape changes.
4. Place invalid/required errors next to the relevant field; retain user input.

---

## 3. Recipe Scaling — `/tools/recipe-scaling`

### What is visibly shipped
An ingredient-name/weight entry surface with two starter rows, add-ingredient action, target batch-weight field, and Scale Recipe CTA.

### UI verdict
The basic hierarchy works, but the UI is under-specified for a data-entry tool. Weight reads as a placeholder rather than a persistent label. The trash/remove buttons are small, icon-only, and not self-explanatory. Ingredient rows do not have strong visual grouping. No result destination is visible before submit.

### Direct-comparator implication
SoapmakingToolbox’s Batch Resizer visibly explains what it accepts, which scaling target is selected, and what it will return. SoapCraft needs comparable procedural clarity even if it uses structured input rather than pasted recipe text.

### Required UI changes
1. Give each row persistent column headers or labels: Ingredient, Weight, Unit, Remove.
2. Use named destructive controls (or accessible icon buttons with a visible tooltip) and 44px targets.
3. Add scale mode selector: proportional resize vs formulation recalculation, with one-sentence explanation.
4. Reserve an output panel showing factor, original total, target total, and scaled ingredient table.

---

## 4. Batch Cost — `/tools/batch-cost`

### What is visibly shipped
A comprehensive calculator panel with ingredient rows, cost/unit/quantity fields, fragrance/other cost, yield, target margin, Save Context, Export JSON, Share, Reset, an advanced shared-context import section, and an educational section.

### UI verdict
The primary hierarchy is acceptable, but the UI is too technical for the job. Context ID, Save Context, Export JSON, checksum, schema version, base64 payload, and “Decode and Validate” compete with “What does this batch cost?” before a result exists. The ingredient **Cost** label is ambiguous: per unit, pack cost, or total cost? The initial screen lacks a clearly reserved cost result area.

### Direct-comparator implication
SoapmakingToolbox keeps the costing task central while still explaining labor, packaging, overhead, and fees. SoapCraft’s advanced transport format is a product seam, not a first-use UI feature.

### Required UI changes
1. Move save/share/export below a successful result. Put raw payload import/export under an **Advanced** disclosure, not the primary flow.
2. Rename cost input precisely: **Cost per selected unit ($)** or **Line total ($)**, and calculate from that named model.
3. Put materials, packaging, labor, overhead, and selling fees into visibly labeled groups.
4. Reserve result labels: full batch cost, cost per saleable bar, suggested floor (if complete), markup, gross margin, and completeness warning.

---

## 5. Wholesale Pricing — `/tools/wholesale-pricing`

### What is visibly shipped
A strong two-column calculator/result pattern. Inputs are production cost/bar, saleable bars/batch, target markup, and retail multiplier; the dark result panel clearly reserves output and explains that nothing is sent to an account.

### UI verdict
This is one of the strongest visual surfaces. Fields are spacious and defaults reduce blank-page friction. Problems are semantic rather than visual: “Retail multiplier” needs a formula explanation; “target markup” must not be confused with margin; currency suffix placement is slightly unconventional; the empty result card should preview its output rows.

### Direct-comparator implication
SoapLab has a simpler UI but makes the MSRP/wholesale percentage relationship explicit. SoapCraft’s layout is better; it must make financial definitions even clearer.

### Required UI changes
1. Add short inline definitions: **Markup is profit ÷ cost; it is not gross margin.**
2. Rename or explain Retail multiplier: “Retail price = wholesale price × multiplier.”
3. In the empty result card, show placeholders for wholesale price, retail price, margin, batch revenue, and assumptions.
4. Offer an MSRP/share-of-retail mode and an actual-cost-floor mode; do not bury the choice.

---

## 6. Craft Fair Break-Even — `/tools/craft-fair-break-even`

### What is visibly shipped
An expense list with starting Booth Fee and Travel rows, Add expense, price/bar, estimated items sold, and a calculate CTA.

### UI verdict
The page is understandable but appears like a thin spreadsheet fragment. Amount fields rely on placeholders, removal controls are ambiguous and icon-only, and results have no obvious destination. The desktop panel leaves substantial unused horizontal space.

### Direct-comparator implication
Simple Life gives named event-cost inputs and immediately visible expense/break-even summaries. SoapCraft can retain flexible custom rows but must equal that predictability.

### Required UI changes
1. Show column headings: **Expense**, **Amount ($)**, **Remove**.
2. Start with Booth, Travel, Packaging, Supplies, Marketing; allow custom extras rather than requiring every user to build the common model.
3. Add an initial result panel: total event cost, contribution/item, exact break-even, rounded sales target, revenue target.
4. Use a text-plus-icon Remove action or labelled accessible icon button.

---

## 7. Ready-By Planner — `/tools/ready-by-planner`

### What is visibly shipped
A polished two-column planner: saleable units required, units/batch, ready-by date with calendar control, selected interval, unmold/cut buffer, other lead time, CTA, and dark empty-result panel.

### UI verdict
The strongest deployed tool UI. It is direct, visually balanced, and makes its no-account/privacy stance clear. The remaining issue is terminology: **User-selected interval** and **Other lead time** are not immediately self-explanatory. Result placeholders could make outputs more predictable. No error states are visible yet.

### Direct-comparator implication
The closest direct alternative is an account-centred batch workflow, not a purpose-built public planner. SoapCraft already leads in single-task clarity; retain that advantage rather than adding early account mechanics.

### Required UI changes
1. Rename User-selected interval to **Cure interval (days)**; add helper text for processing assumptions.
2. Label Other lead time with examples: labels, packaging, delivery, or your own extra buffer.
3. Add empty result rows: Batches needed, Latest pour date, Total lead time.
4. Show local validation beside invalid date, zero yield, and impossible capacity inputs.

---

## 8. Ingredient Purchase Planner — `/tools/ingredient-purchase-planner`

### What is visibly shipped
A clean three-input planner: Requirement, On hand, Pack size, all in grams, with a single calculate action and dark empty-result/explanation panel.

### UI verdict
The UI is clean, focused, and good for a first purchase calculation. The user understands the math quickly. It is, however, a **single-ingredient** experience with fixed grams and no visible cost/supplier/date fields. The initial result panel should preview the output, and edge-case guidance is not visible.

### Direct-comparator implication
SoapmakingFriend’s inventory workflow is broader and account-driven. SoapCraft’s immediate anonymous page is better for a discrete decision, but it needs multi-ingredient plans and flow handoff to be a real alternative.

### Required UI changes
1. Add a persistent output template: shortfall, packs to buy, purchased quantity, expected remaining stock.
2. Provide a unit selector or state explicitly that amounts must be entered in grams.
3. Add ingredient name and multi-row/plan mode after the simple default flow; do not make the first-use form dense.
4. Add validations for zero pack size, negative values, and on-hand exceeding requirement; show purchase=0 as a valid result.

---

## UI acceptance gate for every released tool

Before a tool is marked competitive:
- Desktop **and 390px** screenshots show the primary input, primary CTA, and result/empty-result area without horizontal overflow.
- Every input has a persistent visible label, unit/context, helper where concepts are non-obvious, and local error treatment.
- Every add/remove control is explicit and has a 44×44px accessible target.
- The initial state tells the user what result will appear and the result state exposes assumptions, not merely a number.
- Raw technical transport formats (payloads/checksums/schema) are not part of the default first-use flow.
