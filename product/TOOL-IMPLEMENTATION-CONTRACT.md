# SoapCraft Pro — Eight-Tool Implementation Contract

**Status:** Normative and build-ready; public release remains gated  
**Version:** 1.0.0  
**Date:** 2026-09-12  
**Scope owner:** Product/Engineering  
**Companions:** `PUBLIC-TOOL-CONTRACT.md`, `CALCULATION-SPEC.md`, `ARCHITECTURE.md`, `.studio/acceptance.json`

## 1. Authority and interpretation

This document closes behavioral gaps between the market research and the calculation specification so an implementation worker does not invent product behavior.

Precedence is:

1. `CALCULATION-SPEC.md` for numeric definitions, precision, provenance, and safety gates;
2. this document for exact browser behavior, validation, transfer, and proof;
3. `PUBLIC-TOOL-CONTRACT.md` for public scope and product-level release conditions;
4. `TOOL-MARKET-REQUIREMENTS.md` as research evidence only.

Existing source is evidence, not the target. A conflict, missing rule, or unavailable receipt blocks the affected behavior; it is not permission to guess.

A tool is complete only when a user can enter or import valid inputs, calculate, understand the result and assumptions, recover from invalid states, save locally, share or export, and continue to every named compatible next tool in a real browser at desktop and 390 px mobile widths.

## 2. Common implementation protocol

### 2.1 Canonical result envelope

Every calculation adapter returns one of:

```ts
type ToolResult<T> =
  | {
      ok: true;
      toolId: ToolId;
      schemaVersion: 1;
      formulaRevision: string;
      datasetRevision?: string;
      computedAt: string;
      completeness: "complete" | "incomplete" | "estimate";
      value: T;
      assumptions: Assumption[];
      warnings: ToolMessage[];
    }
  | {
      ok: false;
      toolId: ToolId;
      schemaVersion: 1;
      error: {
        code: string;
        kind: "validation" | "unavailable" | "infeasible" | "calculation";
        fieldPaths: string[];
        message: string;
        recovery: string;
        correlationId?: string;
      };
    };
```

No adapter returns stale prior output after an error. Field errors preserve user inputs. A server exception may expose a correlation ID but no stack, secret, or raw payload.

### 2.2 Numeric and unit rules

- Normalize mass to grams and volume to millilitres before calculation.
- Preserve full internal precision. Never feed display-rounded values into another formula.
- Apply the display/export policy in `CALCULATION-SPEC.md` §4 only at output boundaries.
- Reject non-finite values, malformed numbers, negative values where only non-negative values are meaningful, and non-positive divisors.
- Discrete bars, batches, packs, and required sellable units use ceiling where the output means “enough”; physically fitting whole bars use floor.
- One calculation has one ISO 4217 currency code. Currency follows context across tools. A mismatch blocks until the user explicitly replaces or removes one side; there is no exchange-rate inference.

### 2.3 Anonymous persistence, sharing, and export

The canonical context is JSON with `schemaVersion: 1`. It contains only calculation/planning data explicitly entered or accepted by the user.

```ts
interface RecipeBatchContextV1 {
  schemaVersion: 1;
  contextId: string;
  sourceTool: ToolId;
  createdAt: string;
  updatedAt: string;
  units: { mass: "g" | "kg" | "oz" | "lb"; dimensions: "cm" | "in" };
  currency?: string;
  revisions: Record<string, string>;
  formulation?: FormulationContext;
  mold?: MoldContext;
  scaling?: ScalingContext;
  yield?: YieldContext;
  costing?: CostingContext;
  pricing?: PricingContext;
  event?: EventContext;
  production?: ProductionContext;
  purchasing?: PurchasingContext;
}
```

Each section records `sourceTool`, `acceptedAt`, source revision, raw canonical values, and whether each field was `manual`, `imported`, or `calculated`. Tool schemas define the section fields; arbitrary executable content and unknown top-level sections are rejected. Unknown fields inside a known newer revision are ignored only after schema validation records a version notice.

Local state uses the namespace `soapcraft:context:v1:<contextId>`. The UI truthfully distinguishes memory-only, saving, locally saved, and save failed. Reset requires confirmation and removes only the active SoapCraft context.

A share payload is canonical JSON encoded as UTF-8 base64url with a SHA-256 checksum and explicit schema version. Decoding validates size, checksum, JSON shape, enums, numbers, and version before any value enters a form. Share URLs longer than 1,800 characters are not created; the user receives a downloadable `.soapcraft.json` context file instead. Share links are portable but not secret.

Every tool supports:

- JSON context export containing inputs, unrounded canonical result values, revisions, assumptions, warnings, and generated timestamp;
- accessible print output containing human-readable inputs, displayed results, assumptions, warnings, formula revision, and dataset revision where applicable;
- no email, login, payment, or cookie-consent gate around result, print, export, or share.

### 2.4 Import and handoff

A destination imports only fields it declares. Before calculation, it displays the source tool/revision and marks inherited fields. The user may edit or reject imported values. Any edit invalidates the inherited result and triggers destination recalculation. Unsupported versions produce `context_version_unsupported`; no partial silent migration is allowed.

### 2.5 Common visible states

Every tool intentionally handles: empty, editable example, editing, validating, calculating, result, warning, blocking error, unavailable, locally saved, save failed, share too large, share decode failed, print, and reset confirmation. Keyboard order, labels, errors, focus movement, live-result announcements, 44 px touch targets, horizontal overflow, and print readability are acceptance boundaries.

## 3. TOOL-FORM — Formulation and lye calculation

### User decision

“What quantities do I weigh for this explicitly entered oil blend and process configuration?”

### Inputs

- positive target oil mass and supported unit;
- one or more ingredient rows with versioned manifest ID and oil percentage;
- alkali mode: NaOH, KOH, or mixed;
- mixed mode KOH share of alkali equivalents, 0–100%;
- independent NaOH and KOH purity for selected alkalis, greater than 0 and at most 100%;
- superfat/lye discount, 0–20%;
- exactly one active water mode and its control value;
- optional fragrance load as percent of oil mass and optional additive mass;
- optional local name and notes.

The catalogue may expose only independently verified manifest records. The count of verified oils is a release-data outcome, not permission to pad the catalogue with unsourced entries.

### Rules and outputs

Use `CALCULATION-SPEC.md` §§3.1, 4, 5, 6–9, 13.1, 14.1–14.5, and 15. Oil percentages must sum to 100.0000% within ±0.0001. Zero ingredients, unknown ingredients, provisional/revoked/expired records, or an invalid total block all quantities.

Switching water mode preserves current water mass on the first transition by deriving the new control; later edits recompute water. Output separately identifies oil masses, pure demand and as-supplied mass for each selected alkali, total as-supplied alkali, water, fragrance/additives, total batter mass, active mode values, source IDs, revisions, assumptions, and warnings. “Show the math” substitutes the user’s values into the formula.

No public hardness/lather/conditioning range is shown until a separately approved fatty-acid indicator contract and manifest exist. No oil-level IFRA limit exists. Fragrance amount is planning data only; any future compliance checker requires an exact material certificate and Category 9 mapping and is outside this eight-tool build.

### Errors and gates

`PUBLIC_CHEMISTRY_ENABLED` defaults off. While off, the complete form and methodology may render, but calculation returns `chemistry_publication_gated` with no chemical quantities. A feature flag cannot bypass ingredient eligibility. A recipe-local supplier SAP override can be stored as `user_override` for private planning only; it never becomes a verified public result.

### Handoffs

Exports formulation, canonical ingredient masses, total batter mass, units, and revisions to mold, scale, cost, ready-by, and purchase tools.

### Mandatory proof

Synthetic NaOH, KOH, mixed, independent purity, superfat, three water modes and transition invariants; unit round trip; unknown/unverified record; inactive control isolation; deterministic repeat; API/engine parity; production 503 while gated; desktop/mobile form, source, error, share/export, and handoff behavior.

## 4. TOOL-MOLD — Mold volume and capacity

### User decision

“What target volume does this mold hold, and what batter mass or loaf-cut plan can I justify?”

### Inputs

- rectangular internal length/width/target-fill height, cylindrical internal diameter/target-fill height, or irregular water-fill mass/volume;
- dimensions in centimetres or inches; fill percentage from greater than 0 through 100;
- calibrated mode: prior occupied volume and corresponding prior batter mass, date, optional recipe ID;
- planning mode: no user-specific calibration;
- optional current recipe batter mass;
- optional loaf-cut inputs: internal loaf length, desired bar thickness, and saw/knife kerf, all in the same length unit.

### Rules and outputs

Use `CALCULATION-SPEC.md` §§5.3, 10, 13.3, 14.7, and 15. Exactly `1 in = 2.54 cm` and `1 in³ = 16.387064 cm³`. The deprecated `0.0523 g/in³` and any universal batter-density constant are forbidden.

Target-fill volume equals normalized geometric/measured volume times fill percentage. In calibrated mode, density is prior mass divided by prior occupied volume and target batter mass is target-fill volume times calibrated density. In planning mode, output is a lower/upper range from a versioned benchmark receipt and is labelled “estimate, calibrate before a critical batch.” If that receipt is absent, planning capacity is unavailable; raw volume still works.

For an optional straight loaf cut plan: `barPitch = barThickness + kerf`; `wholeBars = floor((loafLength + kerf) / barPitch)`; `usedLength = wholeBars × barThickness + max(0, wholeBars - 1) × kerf`; `trimRemainder = loafLength - usedLength`. Negative remainder or non-positive dimensions block. This estimates cuts along one axis and does not infer cure shrinkage or saleable yield.

If a current recipe batter mass exists, `scaleFactor = targetBatterMass / currentRecipeBatterMass` only in calibrated mode. A planning range produces a scale-factor range, never a point value.

### Handoffs and proof

Exports volume, capacity type/range, calibration record, optional cut count, and target scale to formulation, scaling, costing, and ready-by. Prove rectangular/cylindrical/irregular geometry, exact metric/imperial equivalence, fill factor, calibrated fixture, missing benchmark fail-closed behavior, planning labels, loaf cuts, reverse scaling, extreme/invalid inputs, local/share/export, and desktop/mobile output.

## 5. TOOL-SCALE — Recipe scaling

### User decision

“How do I resize this recipe without hiding whether I copied quantities or recalculated chemistry?”

### Inputs and mode matrix

- source ingredient/component quantities and units;
- positive source basis and positive target oil mass, target total batter mass, calibrated mold mass, or target saleable units with explicit mass/units-per-batch assumptions;
- `copy_quantities` or `recalculate_formulation`.

`copy_quantities` accepts a source and target expressed on the same declared basis and multiplies every unrounded component once. It preserves the source water mode as metadata but does not claim chemical verification. `recalculate_formulation` requires the full TOOL-FORM inputs and a target oil mass or a target batter mass that can be solved through the canonical formulation engine. Calibrated mold mass may feed that solve. Saleable-unit targeting first derives required batches/target mass from explicit yield assumptions.

### Rules and outputs

Use `CALCULATION-SPEC.md` §§3.2, 4, 9, 10.4, and 13. `scaleFactor = targetBasis/sourceBasis`. Copy mode uses `scaledAmount = sourceUnroundedAmount × scaleFactor`. Recalculation mode preserves oil percentages and chosen process controls, then calls the canonical formulation engine for alkali, water, fragrance, additives, and total mass. It does not duplicate chemistry.

Source and target basis mismatch, zero/negative target, non-finite values, invalid recipe totals, unknown units, unavailable chemistry, or an unapproved planning-range midpoint block the affected mode. Extreme factors produce a warning but are not silently clamped.

Outputs mode, basis, factor, each original/scaled unrounded quantity, display unit, assumptions, validation status, and disclosed whole-unit/remainder calculations where explicit unit size exists.

### Handoffs and proof

Exports scaled context to mold, cost, ready-by, and purchasing. Prove copy and recalculation intentionally differ; both pure and mixed alkali; all water modes; target sources; exact unit normalization; no rounded intermediate reuse; blocked chemistry path; invalid basis; share/export; and browser handoff.

## 6. TOOL-COST — Batch costing and saleable yield

### User decision

“What did this batch cost, and what is the cost per made unit versus saleable unit?”

### Inputs

- mandatory currency code;
- ingredient rows containing quantity/unit and either pack purchase price plus pack size/unit, or explicit cost per selected unit;
- optional fragrance cost row under the same rules;
- packaging cost per saleable unit or explicit batch packaging amount;
- labor minutes and hourly rate;
- non-negative batch overhead and other named costs;
- made units and non-negative trim, samples, defects, and retained testing units;
- optional candidate price, channel percentage fee, fixed transaction fee, and units per transaction;
- cost-basis revision.

An omitted required cost basis is missing, not zero. An explicit numeric zero is accepted only for genuinely zero optional lines such as labor or overhead.

### Rules and outputs

Use `CALCULATION-SPEC.md` §§2.3, 3.3, 4, 11, 13.2, and 14.6. Ingredient cost equals normalized quantity consumed times normalized cost per gram. Packaging equals per-saleable-unit packaging times saleable units unless an explicit batch amount mode is selected. Labor is `(minutes/60) × hourlyRate`. Full batch cost equals material + fragrance + packaging + labor + overhead + named other costs.

`saleableUnits = madeUnits - trim - samples - defects - testingUnits`; it must be greater than zero and exclusions may not exceed made units. Output material, fragrance, packaging, labor, overhead, other and full subtotals; cost per made unit; cost per saleable unit; candidate net revenue/contribution when supplied; revision; and the exact denominator for each value.

Each missing basis entry names its row and required field, is excluded from the known subtotal, sets completeness to `incomplete`, and suppresses suggested/recommended pricing. Negative costs, mixed currency, invalid yield, invalid fee, and division by zero block.

### Handoffs and proof

Exports complete or incomplete cost context to wholesale, event, and purchasing. Prove the research fixture (including packaging, labor, overhead and 100/90 yield), missing and explicit-zero distinctions, all exclusions, made/saleable denominators, currency mismatch, channel fees, revisions, API parity, local/share/export, and cost-to-price browser flow.

## 7. TOOL-WHOLESALE — Wholesale pricing and quote

### User decision

“What list and invoiced unit price meets my chosen markup or gross-margin target after discount and channel fees, and what is the MOQ order value?”

### Inputs

- complete cost per saleable unit and currency, manually entered or imported;
- exactly one target mode: markup percent or gross-margin percent;
- optional quoted discount percent, 0 through less than 100;
- channel percentage fee, 0 through less than 100, fixed fee per transaction, and positive units per transaction;
- positive MOQ, optional requested quantity, and positive quote-pack multiple;
- optional user-entered retail comparison price;
- quote label and optional non-personal notes.

### Rules and outputs

Use `CALCULATION-SPEC.md` §§3.3.2–3.3.6, 4, 11.2–11.7, 12.2, 13.2, and 14.6. Define `discountFraction=d`, `feeFraction=f`, and `fixedPerUnit=fixedFee/unitsPerTransaction`.

For gross-margin mode, required net revenue is `cost/(1-margin)`; for markup mode it is `cost × (1+markup)`. The displayed list price is solved so the discounted invoiced price and fees still produce that required net revenue:

`listPrice = (requiredNetRevenue + fixedPerUnit) / ((1-d) × (1-f))`  
`invoicePrice = listPrice × (1-d)`  
`netRevenue = invoicePrice × (1-f) - fixedPerUnit`.

Any non-positive denominator blocks. The tool never applies a discount after solving and then falsely claims the original margin still holds.

`orderQuantity = max(MOQ, ceil(requestedQuantity/quotePackMultiple) × quotePackMultiple)` when requested quantity exists; otherwise MOQ. Output list and invoiced unit prices, discount, fee burden, net revenue, contribution, actual markup and gross margin, MOQ/order quantity and totals, optional retail comparison, and “Show the math.”

A missing/incomplete cost basis, mixed currency, zero MOQ, invalid pack multiple, impossible percentage, or non-positive net contribution blocks a recommendation. Quote output includes generated date, currency, formula/cost revisions, assumptions, quantity, totals, and “planning quote—not a binding offer”; it does not invent an expiry period.

### Handoffs and proof

Exports price/cost context to event and ready-by. Prove both modes, discount-plus-both-fee algebra, zero fees, impossible denominator, MOQ/pack rounding, optional retail comparison, incomplete basis, quote print/export, API parity, and mobile/desktop flow.

## 8. TOOL-EVENT — Craft-fair break-even and stock plan

### User decision

“How many units and how much stock are required to cover this event and reach my target under my stated product mix and sell-through assumptions?”

### Inputs

- mandatory currency;
- named non-negative fixed cost lines including booth, travel, accommodation, event labor, supplies, and other costs;
- one or more products with positive selling price, non-negative variable cost, percentage/fixed transaction fees, positive units per transaction, available stock, and mix share;
- non-negative target profit;
- stock buffer percent;
- three explicit user-entered sell-through scenarios: conservative, expected, optimistic, each 0–100% and ordered non-decreasing.

### Rules and outputs

Use `CALCULATION-SPEC.md` §§3.3.6, 3.4, 4, 11.4, 12.1, and 13.2. Mix shares must be non-negative and total 100% within ±0.01. An explicit “normalize shares” action may proportionally normalize them; calculation never rewrites them silently.

For product `i`: `netRevenue_i = price_i × (1-feePercent_i) - fixedFee_i/unitsPerTransaction_i`; `contribution_i = netRevenue_i - variableCost_i`. All active products require positive contribution. `weightedContribution = Σ(share_i × contribution_i)` and `weightedPrice = Σ(share_i × price_i)`, with shares as fractions.

If fixed cost is zero and weighted contribution is positive, break-even units are zero. Otherwise `breakEvenUnits=ceil(fixedCosts/weightedContribution)`. `targetProfitUnits=ceil((fixedCosts+targetProfit)/weightedContribution)`. Break-even revenue is `breakEvenUnits × weightedPrice`.

`bufferUnits=ceil(targetProfitUnits × bufferPercent)`; `baseStock=targetProfitUnits+bufferUnits`. For each sell-through scenario `s>0`, `stockToBring=ceil(baseStock/s)` and `projectedSold=floor(stockToBring × s)`; at 0% the target is explicitly infeasible, not infinity. Allocate total units to products by largest-remainder apportionment so integer product allocations sum exactly to the total and follow the stated mix. Compare allocation to available stock and name shortages.

Outputs per-product contribution, normalized-visible mix, weighted values, break-even and target units/revenue, buffer, each sell-through stock scenario, product allocations, available-stock feasibility, assumptions, and warnings. It never predicts actual sales.

### Handoffs and proof

Exports target units/product mix to ready-by and purchasing. Prove zero booth/fixed cost, both channel fees, multiple products, explicit normalization, target profit, three sell-through scenarios including zero, buffer, largest-remainder allocation, stock shortage, non-positive contribution, currency mismatch, export, and browser flow.

## 9. TOOL-READY — Ready-by production planner

### User decision

“What production dates and batch capacity are required to reach this user-chosen ready-by date?”

### Inputs

- ISO calendar ready-by date (`YYYY-MM-DD`) interpreted as a date-only value, never a timestamp;
- positive user-selected cure interval days and non-negative unmold/cut buffer days;
- positive target saleable units and saleable units per batch;
- positive maximum batches per production day and per ISO week;
- allowed production weekdays plus explicit blackout dates;
- planning start date, defaulting visibly to the user’s current local calendar date;
- optional recipe/batch label.

### Rules and outputs

Use `CALCULATION-SPEC.md` §§3.6, 4, 12.3, 12.5–12.6, and 13.4, with this section resolving the earlier ambiguous `productionLeadTime` shorthand.

`batchesRequired=ceil(targetSaleableUnits/saleableUnitsPerBatch)`. `latestPourDate=readyByDate-cureDays-unmoldCutBufferDays`. Starting at latestPourDate, walk backward over date-only calendar days. Skip disallowed weekdays and blackouts. Allocate at most max batches/day and max batches within each ISO week until all batches are assigned. The schedule is feasible only if every batch is placed on or after planningStartDate.

For each batch: `unmoldCutDate=pourDate+unmoldCutBufferDays`; `estimatedIntervalEnd=unmoldCutDate+cureDays`. Output required batches, excess planned units from ceiling, latest pour date, each batch date chain, weekly capacity use, and either a feasible schedule or an explicit conflict naming the shortfall and required average/peak capacity.

Ready-by before planning start, zero cure interval, invalid yield/capacity, impossible weekday set, duplicate/invalid blackouts, or inability to place all batches is a typed validation/infeasible result. Date arithmetic must produce identical ISO dates under multiple runtime timezones and across leap days/month boundaries. Output says “user-selected interval ends,” never safe, cured, compliant, or guaranteed ready.

### Handoffs and proof

Exports batch count, dates, units, and recipe reference to purchasing. Prove the documented date fixture after correcting any inconsistent expected date, leap/month/year boundaries, multiple runtime timezones, weekday/blackout skips, daily/weekly limits, overlap conflicts, excess units, impossible deadline, printable records, local/share/export, and ready-by-to-purchase browser flow.

## 10. TOOL-PURCHASE — Ingredient purchasing and supplier comparison

### User decision

“What quantity and packs should I buy for these planned batches after usable stock, and which user-entered offer has the lowest landed cost in the selected currency?”

### Inputs

- one or more planned recipe/batch instances with positive multiplier and versioned ingredient IDs;
- manual requirements where no recipe exists;
- current on-hand and user-reserved quantity per ingredient; reserved may not exceed on-hand;
- non-negative buffer percentage per ingredient or plan;
- supplier offers with ingredient ID, positive pack size/unit, non-negative pack price, shipping, named fees, minimum packs and optional minimum order amount, and currency;
- one comparison currency selected from entered offers; no conversion.

### Rules and outputs

Use `CALCULATION-SPEC.md` §§2.3, 3.5, 4, 11.7, 12.4, and 13.2–13.3. Normalize each recipe line to grams, multiply by planned batch count, then aggregate by stable ingredient ID before stock subtraction.

`baseRequirement=Σ(normalizedRequirement)`; `grossRequirement=baseRequirement × (1+bufferPercent)`; `usableStock=max(0,onHand-reserved)`; `netNeed=max(0,grossRequirement-usableStock)`.

For each eligible supplier offer: `needPacks=ceil(netNeed/packSize)`; `packs=max(needPacks,minimumPacks)`; if a minimum order amount applies, increase packs until `packs×packPrice >= minimumOrderAmount`; `purchaseQuantity=packs×packSize`; `landedCost=packs×packPrice+shipping+fees`; `landedUnitCost=landedCost/purchaseQuantity`; `overbuy=max(0,purchaseQuantity-netNeed)`; `projectedRemaining=max(0,usableStock+purchaseQuantity-grossRequirement)`.

When `netNeed=0`, packs, purchase quantity, landed cost, and overbuy are zero regardless of supplier minima because no order is proposed. Offers in other currencies are shown as excluded and are not compared or totalled. “Lowest landed cost” refers only to the entered eligible offers in one currency; the product never claims to search the market.

Outputs base/gross requirement, stock/reserved/usable stock, net need, per-offer packs/quantity/overbuy/projected remaining/landed costs, excluded offers and reasons, selected purchase list, total in one currency, unresolved missing-offer warnings, and print/JSON export.

Planning does not deplete inventory. A future explicit completed-batch transaction may record batch ID and actual consumed quantities, but automatic account inventory depletion is outside this anonymous eight-tool release.

### Handoffs and proof

Imports formulation/scaling/event/ready-by plans and cost basis. Prove multi-recipe shared-ingredient aggregation, units, multipliers, buffer, sufficient and zero stock, reserved validation, exact/partial packs, minimum packs and spend, shipping/fees, overbuy/projected remaining, same-currency comparison, mixed-currency exclusion, missing offers, local/share/export, and mobile/desktop flow.

## 11. Research discrepancies resolved by this contract

- Research requests 100+ searchable oils and property metrics, but unverified catalogue padding and fabricated property transforms are prohibited. Public count and indicators depend on verified manifests.
- Research’s historical `0.9 g/cm³` mold default is not accepted as a universal precise constant. Calibrated output or a receipt-backed estimate range is required.
- Recipe scaling has two explicit modes. Copying quantities is never relabelled as formulation verification.
- Costing distinguishes absent cost from explicit zero and made yield from saleable yield.
- Wholesale discount is incorporated into the algebra so the final invoiced price, fees, and stated target agree.
- Product mixes are rejected when invalid unless the user explicitly requests normalization.
- Sell-through scenarios are assumptions, not predictions.
- Ready-by planning uses deterministic date-only backward allocation, not timestamp arithmetic or a dimensionally invalid lead-time shortcut.
- Purchasing aggregates requirements before stock and pack rounding, compares only user-entered same-currency offers, and does not claim automatic depletion.

## 12. Builder stop conditions

A slice worker stops with `BLOCKED`, preserving evidence, if:

- this contract and `CALCULATION-SPEC.md` still disagree for its behavior;
- a required benchmark/source/publication receipt is absent;
- a dependency slice is not independently accepted;
- implementation needs a path outside the slice allowlist;
- the baseline is dirty outside acknowledged files;
- a required test, build, browser, accessibility, or evidence command cannot be run;
- three materially identical attempts fail.

The worker may not weaken a test, alter acceptance language, mark its own slice accepted, enable public chemistry, change another slice, or declare `RELEASE_ACCEPTED`.
