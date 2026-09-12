# SoapCraft Pro — Public Tool Build Contract

**Version:** 4.0.0
**Status:** BUILD AUTHORIZED; public chemistry remains fail-closed
**Normative formula source:** `product/CALCULATION-SPEC.md` v2.1.0
**Normative implementation source:** `product/TOOL-IMPLEMENTATION-CONTRACT.md` v1.0.0
**Research source:** `product/TOOL-MARKET-REQUIREMENTS.md`
**Contract precedence:** `CALCULATION-SPEC.md` defines numeric semantics and release gates; `TOOL-IMPLEMENTATION-CONTRACT.md` defines browser behavior, validation, transport and proof; this file defines public scope; `.studio/acceptance.json` defines observable acceptance; `.studio/slices.json` defines bounded execution.

## 1. Goal and completion metric

**Goal metric:** weekly anonymous sessions that complete a correct calculation and continue into at least one connected tool without re-entering shared data.

A public tool is built only when a new anonymous user can complete this loop in a real browser:

`valid input → deterministic calculation → visible result or typed validation error → visible assumptions/math/version → local restore/export/share → connected-tool handoff`

An API, library function, route shell, redirect, form mock-up, or passing unit test alone does not count as a built tool.

## 2. Scope: the eight public tools

| ID | Tool | Canonical route | Research basis | Required disposition |
|---|---|---|---|---|
| TOOL-FORM | Formulation and lye calculator | `/tools/formulation` | §§1.1–1.4 | Build completely; keep public calculation disabled until chemistry receipts pass |
| TOOL-MOLD | Mold volume and capacity calculator | `/tools/mold-volume` | §2.1 | Build and release after deterministic fixtures pass |
| TOOL-SCALE | Recipe scaling calculator | `/tools/recipe-scaling` | §2.2 | Build both proportional-copy and formulation-recalculation modes |
| TOOL-COST | Batch costing and cost-per-bar calculator | `/tools/batch-cost` | §3.1 | Build complete cost stack and saleable-yield economics |
| TOOL-WHOLESALE | Wholesale pricing calculator | `/tools/wholesale-pricing` | §3.2 | Build markup and gross-margin modes, fees, MOQ, quote output |
| TOOL-EVENT | Craft-fair break-even calculator | `/tools/craft-fair-break-even` | §4.1 | Build multi-product weighted contribution, target-profit, stock plan |
| TOOL-READY | Ready-by production planner | `/tools/ready-by-planner` | §5.1 | Build date chain and capacity feasibility planning |
| TOOL-PURCHASE | Ingredient purchase planner | `/tools/ingredient-purchase-planner` | §6.1 | Build requirements, stock subtraction, pack rounding, supplier comparison |

Supporting surfaces required for those tools are `/tools`, `/methodology`, worked examples/templates, factual comparisons, canonical metadata, and shared Recipe/Batch Context. Optional accounts, cloud sync, Seller Pack payments, subscription billing, CRM, social campaign tooling, and a native app are not needed to call the eight-tool release complete.

## 3. Shared invariants for every tool

1. Core results require no login, email, payment, or cookie consent.
2. All numeric engines are deterministic and use full internal precision; rounding occurs only at display/export boundaries.
3. Every result displays formula revision, dataset revision where applicable, units, assumptions, warnings, and a “Show the math” explanation.
4. Inputs are validated both client-side and server-side. Invalid input preserves the form and returns a field-level or typed calculation error; it never silently coerces a dangerous or financially misleading value.
5. Empty, loading, calculating, result, warning, blocking-error, save-failed, share-decode-failed, and print states are intentionally handled.
6. Anonymous state is local-only and labelled as such. Reload restore, reset, print, structured export, and share URL are available. Share payloads contain no personal data.
7. Shared values transfer through a versioned Recipe/Batch Context. The destination names inherited fields and lets the user review/edit them before recalculation.
8. Money in one calculation uses one currency code. Mixed currencies block rather than sum.
9. Tests include hand-authored golden vectors, edge cases, API integration, browser interaction, local restore, export/share, and mobile/desktop viewport checks.
10. A tool is not complete while its canonical page redirects elsewhere, displays a release notice instead of the functional UI, or exposes only a subset engine that contradicts its labels.
11. The exact context schema, result envelope, serialization, import behavior, per-tool edge cases and test matrix are normative in `TOOL-IMPLEMENTATION-CONTRACT.md`; a worker may not replace them with an inferred design.

## 4. TOOL-FORM — Formulation and lye calculator

### Responsibility
Produce a reproducible soap formulation from an explicit oil blend and target oil mass. It combines the market expectations observed in SoapCalc, Soapmaking Friend, and SoapmakingToolbox; those are comparators, not three separate SoapCraft tools.

### Inputs
- oils: one or more versioned ingredient IDs and either percentages or weights;
- explicit positive target oil mass and display unit;
- alkali mode: NaOH, KOH, or mixed;
- mixed mode KOH percentage as share of full pure alkali equivalents;
- NaOH purity and KOH purity independently;
- one recipe-level superfat/lye-discount value;
- exactly one active water mode: water-to-lye ratio, lye concentration, or percent of oils;
- optional fragrance amount/load and additive mass as planning inputs only;
- recipe name/notes as local metadata, never required for calculation.

### Outputs
- normalized oil percentages and exact per-oil weights;
- pure NaOH and KOH demand, as-supplied masses after independent purity correction, and total alkali;
- water mass and active water-method explanation;
- fragrance/additive amount, total batter mass, formula revision, dataset revision, source status, warnings;
- sourced fatty-acid-derived indicators only where the manifest contains the required data; unsupported indicators are omitted;
- transfer actions to mold sizing, recipe scaling, batch cost, ready-by planning, and purchasing.

### Formula contract
Use `CALCULATION-SPEC.md` §§3, 5–10, 13–15. KOH-basis SAP records are canonical. Derive NaOH with the versioned molecular-weight ratio. Apply superfat once to each selected pure-equivalent share, then correct NaOH and KOH independently for purity. An inactive water input cannot affect output. No hidden 1000 g recipe, averaged source conflicts, arbitrary ±20% property bands, oil-level IFRA field, or universal fragrance-compliance claim is permitted.

### Fail-closed gates
The engine, UI, synthetic fixtures, and error states may be implemented now. Public production chemistry remains disabled unless all `R-CHEM-*`, `R-FRAG-01`, and `R-SAFETY-01` receipts pass. Unverified ingredient records are unavailable, not estimated to users. Any future IFRA result requires exact fragrance identity, certificate revision, and Category 9 mapping.

### Required proof
Synthetic algebra vectors from `CALCULATION-SPEC.md` §14; NaOH, KOH, mixed-alkali, all water modes, independent purities, superfat, unit round-trip, unknown/unverified ingredient, inactive-water-input, deterministic repeat, API 503 fail-closed, and browser workflow tests.

## 5. TOOL-MOLD — Mold volume and capacity

### Inputs
- shape: rectangular, cylindrical, measured water-fill, or irregular/measured;
- internal dimensions and unit, or measured occupied volume;
- fill percentage/headspace;
- mode: calibrated precision or planning range;
- calibrated mode: prior occupied volume and prior batter mass from the user;
- optional current recipe batter mass from Recipe/Batch Context;
- optional bar dimensions/cut loss for cut planning.

### Outputs
- normalized mold volume and target-fill volume;
- calibrated density and precise target batter mass only when calibration inputs are valid;
- otherwise an explicitly approximate planning range with assumption provenance;
- recipe scale factor, per-mold allocation, estimated whole bars and cut/waste remainder where those inputs exist;
- transfer to recipe scaling and formulation.

### Formula contract
Use `CALCULATION-SPEC.md` §§5.3, 10, 13.3, 14.7 and 15 and `TOOL-IMPLEMENTATION-CONTRACT.md` §4. Geometry determines volume. `calibratedDensity = priorBatterMass / priorOccupiedVolume`; `targetBatterMass = targetFillVolume × calibratedDensity`. No universal density constant or false point estimate. Metric/imperial conversions use tested exact factors.

### Required proof
Rectangular, cylindrical, water-fill, irregular, metric/imperial equivalence, calibration, uncalibrated range, invalid dimension, overfill, multi-mold, and reverse-scaling browser/API vectors.

## 6. TOOL-SCALE — Recipe scaling

### Inputs
- mode: `copy_quantities` or `recalculate_formulation`;
- source ingredient lines with positive amounts and units;
- source total and target total, target oil mass, target mold calibration, or target saleable units;
- for recalculation mode: full formulation inputs needed by TOOL-FORM;
- optional desired bar count and expected saleable yield.

### Outputs
- scale factor and exact scaled ingredient lines;
- target total and unit-normalized result;
- in recalculation mode, newly computed alkali/water from formulation percentages and source manifest rather than proportional copying of rounded lye/water values;
- whole-unit/bar estimate and disclosed remainder where applicable;
- explicit distinction between copied quantities and chemically recalculated formulation;
- transfer to costing, mold, production, and purchasing.

### Formula contract
For copy mode, `scaleFactor = target / source` and each unrounded source quantity is multiplied once. For formulation mode, oil percentages scale to target oil mass, then TOOL-FORM recomputes alkali and water from the normative chemistry contract. Do not present proportional scaling of a chemically incomplete recipe as verified formulation.

### Required proof
Scale up/down/no-op, unit conversion, decimals, zero/negative rejection, sums invariant, copy-vs-recalculate difference, no cumulative rounding, context import, and browser export/share vectors.

## 7. TOOL-COST — Batch costing and cost per bar

### Inputs
- ingredient quantities and per-purchase quantity/cost or direct cost-per-unit basis;
- packaging line items;
- labor minutes/hours and hourly rate;
- fixed and percentage overhead;
- made units, trim, samples, defects, and retained testing units;
- optional channel fees and target price; one currency code;
- imported formulation/scaling quantities.

### Outputs
- ingredient, packaging, labor, overhead, and channel-cost subtotals;
- complete/incomplete cost-basis state and named missing-cost lines;
- total batch cost, made-unit count, saleable yield, cost per made unit, cost per saleable unit;
- markup and gross margin as separately labelled measures when a selling price exists;
- handoff to wholesale pricing, event planning, production, and purchasing.

### Formula contract
Use `CALCULATION-SPEC.md` §§2.3, 3.3, 4, 11, 13.2 and 14.6 and `TOOL-IMPLEMENTATION-CONTRACT.md` §6. `saleableUnits = made - trim - samples - defects - retainedTesting`; cost per saleable unit uses that denominator. Missing basis is never zero. Markup is `(price-cost)/cost`; gross margin is `(price-cost)/price`.

### Required proof
Complete and incomplete basis, packaging/labor/overhead, zero saleable units, waste categories, currency mismatch, saleable-vs-made cost, markup-vs-margin reference vectors, API/UI parity, local restore, and export/share.

## 8. TOOL-WHOLESALE — Wholesale pricing

### Inputs
- verified cost per saleable unit or imported TOOL-COST context;
- pricing mode: target markup or target gross margin;
- target percentage;
- percentage and fixed per-unit channel/payment fees;
- optional quoted discount applied to list price, MOQ, case/pack multiple, requested quantity, and user-entered retail comparison price;
- one currency code and quote metadata.

### Outputs
- algebraic minimum wholesale price before and after fees;
- gross profit per unit, achieved markup, achieved gross margin;
- retail/wholesale comparison where retail input exists;
- MOQ/order total and pack-rounded quantity;
- clearly labelled incomplete result when cost basis is incomplete;
- printable/downloadable quote or price sheet with assumptions and validity metadata.

### Formula contract
Use `CALCULATION-SPEC.md` §§3.3.2–3.3.6, 4, 11.2–11.7, 12.2, 13.2 and 14.6 and `TOOL-IMPLEMENTATION-CONTRACT.md` §7. Markup and gross margin are different modes. Discount and percentage/fixed fees are part of the algebraic solve; they are not applied afterward while preserving a false target claim. Percentages that make the denominator non-positive block.

### Required proof
Markup and margin vectors, fee vector, impossible percentage, incomplete cost, MOQ/pack rounding, retail comparison, quote print layout, and API/UI parity.

## 9. TOOL-EVENT — Craft-fair break-even

### Inputs
- event fixed costs: booth, travel, accommodation, event labor, permits and other lines; zero total is valid;
- one or more products with price, variable cost, expected mix share, available stock, expected sell-through;
- payment/channel fees;
- target profit and optional stock buffer.

### Outputs
- per-product contribution after variable cost and fees;
- normalized mix and weighted contribution per unit;
- break-even units using ceiling, target-profit units using ceiling;
- recommended stock by product and projected sold/unsold units under stated sell-through;
- projected revenue, variable cost and profit scenarios;
- feasibility warnings for non-positive contribution or insufficient stock.

### Formula contract
Use `CALCULATION-SPEC.md` §§3.3.6, 3.4, 4, 11.4, 12.1 and 13.2 and `TOOL-IMPLEMENTATION-CONTRACT.md` §8. `weightedContribution = Σ(mixShare × unitContribution)`; `breakEvenUnits = ceil(fixedCosts / weightedContribution)`; `targetProfitUnits = ceil((fixedCosts + targetProfit) / weightedContribution)`. Zero fixed costs yields zero break-even units only when weighted contribution is positive. Non-positive contribution blocks. Invalid shares require correction or an explicit user-requested normalization action.

### Required proof
Single/multi-product, mix normalization, zero fixed cost, percentage/fixed fees, target profit, sell-through, stock ceiling, non-positive contribution, rounding-up boundary, and imported pricing context.

## 10. TOOL-READY — Ready-by production planner

### Inputs
- target-ready date and timezone-neutral calendar date semantics;
- cure interval, unmold delay, cut delay, safety/buffer days;
- target saleable units, units per batch, maximum batches per production day/week;
- non-production weekdays/blackout dates;
- optional formulation and mold context.

### Outputs
- last feasible pour, unmold, cut, cure-window-reached, label/pack, and ready-by dates;
- batches required, planned production dates, weekly load, earliest/latest feasible dates;
- explicit capacity conflict and required-rate warning;
- wording “estimated window reached,” never automated safety/cure approval;
- transfer to purchase planner and batch record/export.

### Formula contract
Use `CALCULATION-SPEC.md` §§3.6, 12.3, 12.5–12.6 and `TOOL-IMPLEMENTATION-CONTRACT.md` §9. Use date-only arithmetic. `batchesRequired = ceil(targetSaleableUnits / saleableUnitsPerBatch)`. Backward allocation obeys both daily and ISO-week capacity, production weekdays, blackout dates and planning start. Cure readiness is a user decision.

### Required proof
Leap year/month boundary/DST-zone independence, zero or negative validation, exact ceiling, blackout dates, insufficient capacity, imported yield, print/export, and mobile date workflow.

## 11. TOOL-PURCHASE — Ingredient purchase planner

### Inputs
- one or more planned recipes/batches and quantities;
- ingredient and packaging requirements from context or manual entry;
- current stock and reserved stock;
- supplier offers: pack size, pack price, shipping/fees, minimum order, currency;
- waste/buffer percentage and target event/order quantity.

### Outputs
- aggregated gross requirement, usable stock, net requirement;
- packs required using ceiling and purchased quantity/remainder;
- landed cost and comparable unit cost per supplier within one currency;
- selected purchase list, shortage/overbuy amount, and unresolved supplier/cost warnings;
- printable/exportable list and local restore;
- no inventory depletion claim unless an explicit completed-batch action exists.

### Formula contract
Use `CALCULATION-SPEC.md` §§2.3, 3.5, 4, 11.7, 12.4 and `TOOL-IMPLEMENTATION-CONTRACT.md` §10. Aggregate normalized quantities by stable ingredient ID first. Apply buffer once, then subtract usable stock. Pack rounding, minimum packs, minimum spend, shipping and fees are explicit. Never compare or total mixed currencies.

### Required proof
Multi-batch aggregation, unit normalization, sufficient stock, reserved stock, pack ceiling/exact multiple, overbuy, supplier landed-cost comparison, minimum order, mixed-currency block, zero need, and context import.

## 12. Supporting surfaces

- `/tools` lists exactly the eight in-scope tools with truthful states; no dead, retired, or fictional routes.
- `/methodology` documents each equation, units, data provenance, limitations, and revision history.
- Every tool has at least one editable worked example with independently calculated expected output.
- Templates are usable artifacts, not email-capture facades.
- Comparison pages state observation date, evidence grade, and source; they contain no invented superiority or unverifiable claims.
- Canonical metadata, sitemap, robots, structured data, keyboard access, 44 px touch targets, mobile layout, print layout, and WCAG 2.2 AA are verified.

## 13. Implementation truth at contract issue

Current source contains useful engines and forms but does not satisfy the complete-loop definition for all eight tools. Known blockers include a gated formulation UI/API, retired/redirecting production and purchasing pages, no wholesale page, partial route adapters, incomplete shared-context handoffs, and insufficient browser-level acceptance evidence. Existing code is evidence, not specification.

## 14. Release authority

Engineering may implement every slice. Public chemistry remains disabled until its receipts pass. Other tools may release independently once their slice tests and deployed browser evidence pass. The product as a whole is not release-accepted until an independent verifier records the literal `RELEASE_ACCEPTED` in Gate_A.
