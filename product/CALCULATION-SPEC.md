# SoapCraft Pro — Calculation Specification

**Status:** Build-ready deterministic formula contract; publication remains fail-closed on §15 release gates  
**Version:** 2.0.0  
**Date:** 2026-09-09  
**Owner:** Product/Engineering  
**Parent contract:** `PRODUCT-CONTRACT-UTILITY-HUB.md`  
**Supersedes:** Version 1.0.0 and its unresolved formula conventions.

---

## Table of Contents

1. [Symbol Glossary](#1-symbol-glossary)
2. [Dimensions and Unit Analysis](#2-dimensions-and-unit-analysis)
3. [Canonical Formulas](#3-canonical-formulas)
4. [Precision and Rounding Policy](#4-precision-and-rounding-policy)
5. [Source Manifest and Revisions](#5-source-manifest-and-revisions)
6. [NaOH / KOH / Mixed Alkali Conventions](#6-naoh--koh--mixed-alkali-conventions)
7. [Purity Handling Conventions](#7-purity-handling-conventions)
8. [Superfat and Lye Discount Conventions](#8-superfat-and-lye-discount-conventions)
9. [Water Conventions](#9-water-conventions)
10. [Mold and Geometry Semantics](#10-mold-and-geometry-semantics)
11. [Costing and Accounting Definitions](#11-costing-and-accounting-definitions)
12. [Event / Wholesale / Purchasing / Inventory Formulas](#12-event--wholesale--purchasing--inventory-formulas)
13. [Invariants](#13-invariants)
14. [Independent Golden Fixtures](#14-independent-golden-fixtures)
15. [Build Authorization and Fail-Closed Release Gates](#15-build-authorization-and-fail-closed-release-gates)

---

## 1. Symbol Glossary

All symbols used across the calculation system, with their units and canonical definitions.

### 1.1 Chemical / Formulation Symbols

| Symbol | Name | Unit | Canonical Definition |
|--------|------|------|---------------------|
| `SAP_KOH(oil)` | Saponification factor (KOH basis) | g KOH per g oil | Versioned source-manifest value |
| `SAP_NaOH(oil)` | Derived NaOH factor | g NaOH per g oil | `SAP_KOH(oil) × MW_NaOH / MW_KOH` |
| `oilWeightTotal` | Total oil mass | g | Positive user input |
| `oilPercent(i)` | Percentage of oil `i` in blend | % | `0 < oilPercent(i) ≤ 100`; total equals 100 within tolerance |
| `oilWeight(i)` | Weight of oil `i` | g | `(oilPercent(i) / 100) × oilWeightTotal` |
| `naohAsSuppliedMass` | NaOH mass to weigh | g | Discounted pure NaOH share divided by NaOH purity fraction |
| `kohAsSuppliedMass` | KOH mass to weigh | g | Discounted pure KOH share divided by KOH purity fraction |
| `totalAlkaliAsSupplied` | Total alkali mass to weigh | g | `naohAsSuppliedMass + kohAsSuppliedMass` |
| `superfatPercent` | Recipe-level lye discount | % | Applied once to the theoretical pure requirement of every selected alkali |
| `superfatMultiplier` | Superfat reduction factor | dimensionless | `1 - (superfatPercent / 100)` |
| `fragranceLoadPercent` | Fragrance load | % of oil weight | `(fragranceMass / oilWeightTotal) × 100` |
| `fragranceLoad` | Fragrance mass | g | `(fragranceLoadPercent / 100) × oilWeightTotal` |

### 1.2 Water Symbols

| Symbol | Name | Unit | Canonical Definition |
|--------|------|------|---------------------|
| `waterToLyeRatio` | Water-to-lye ratio | mass water / mass as-supplied alkali | Active-mode formula: `water = totalAlkaliAsSupplied × waterToLyeRatio` |
| `lyeConcentrationPercent` | Lye concentration | % of solution mass | `totalAlkaliAsSupplied / (water + totalAlkaliAsSupplied) × 100` |
| `waterAsPercentOfOils` | Water as % of oils | % of oil mass | `water / oilWeightTotal × 100` |
| `water` | Water mass | g | Canonical output derived from the selected mode |

### 1.3 Batch Weight Symbols

| Symbol | Name | Unit | Canonical Definition |
|--------|------|------|---------------------|
| `totalWeight` | Total batch weight | g | Oils + as-supplied alkalis + water + fragrance + additives |
| `oilWeightTotal` | Oil weight subtotal | g | `Σ oilWeight(i)` |
| `totalAlkaliAsSupplied` | Total lye weight | g | `naohAsSuppliedMass + kohAsSuppliedMass` |

### 1.4 Property / Quality Symbols

No public property-range symbols exist in version 2.0. Sourced fatty-acid composition fields may be added later through the same manifest governance as SAP values; arbitrary hardness/lather/moisturizing transforms are forbidden.

### 1.5 Economic / Cost Symbols

| Symbol | Name | Unit | Canonical Definition |
|--------|------|------|---------------------|
| `cost` | Total batch cost | currency units | `ingredientCostTotal + fragranceCost + otherCosts` |
| `costPerBar` | Cost per bar | currency units per bar | `totalCost / batchYieldBars` |
| `costPerUnit` | Cost per unit mass | currency units per gram | `totalCost / totalQuantityGrams` |
| `ingredientCostTotal` | Sum of ingredient costs | currency units | `Σ (costPerGram(i) × quantityInGrams(i))` excluding missing-cost items |
| `batchYieldBars` | Number of bars from batch | bars (count) | User-entered or derived; excludes trim/samples/defects for saleable yield |
| `saleableYield` | Saleable unit count | bars (count) | `batchYieldBars - trim - samples - defects - testingUnits` |
| `price` | Selling price per unit | currency units per bar | User-entered or algebraically solved |
| `markupPercent` | Markup percentage | % | `(price - cost) / cost × 100` |
| `grossMarginPercent` | Gross margin percentage | % | `(netRevenue - cost) / netRevenue × 100` |
| `netRevenue` | Revenue after channel fees | currency units | `price × units - percentageFee - fixedFeePerTransaction` |
| `contributionPerUnit` | Contribution per saleable unit | currency units per bar | `netRevenuePerUnit - costPerSaleableUnit` |
| `fixedEventCost` | Fixed event costs | currency units | Total booth, travel, and other fixed costs |
| `eventBreakEvenUnits` | Break-even units for event | bars (count) | `ceiling(fixedEventCost / weightedContributionPerUnit)` |
| `targetMargin` | Target gross margin | % | Input for algebraic price solving |

### 1.6 Mold / Geometry Symbols

| Symbol | Name | Unit | Canonical Definition |
|--------|------|------|---------------------|
| `moldVolume` | Internal target-fill volume | mL/cm³ | Geometry after unit normalization, or measured water-fill volume |
| `calibratedDensity` | User-specific batter density | g/mL | Prior batter mass / prior occupied volume |
| `targetBatterMass` | Batter mass for target fill | g | `moldVolume × calibratedDensity` in calibrated mode |
| `scaleFactor` | Recipe scaling ratio | dimensionless | `targetBatterMass / currentRecipeTotalBatterMass` |

### 1.7 Unit Conversion Symbols

| Symbol | Name | Value | Notes |
|--------|------|-------|-------|
| `UNIT_TO_GRAMS["g"]` | Grams per gram | 1 | Base unit |
| `UNIT_TO_GRAMS["kg"]` | Grams per kilogram | 1000 | |
| `UNIT_TO_GRAMS["oz"]` | Grams per ounce | 28.3495 | |
| `UNIT_TO_GRAMS["lb"]` | Grams per pound | 453.592 | |

---

## 2. Dimensions and Unit Analysis

### 2.1 Fundamental Dimensions

The calculation system operates in four fundamental dimensions: **mass** (g), **count** (bars/units), **percentage** (%), and **currency** (any single unit, never mixed).

### 2.2 Dimensional Homogeneity Checks

Every formula must satisfy dimensional homogeneity. The following table confirms dimensional correctness:

| Formula | Left Side | Right Side | Homogeneous? |
|---------|-----------|------------|--------------|
| `oilWeight(i) = oilPercent(i)/100 × oilWeightTotal` | g | dimensionless × g = g | ✅ |
| `lyeNaOH = Σ oilWeight(i) × SAP_NaOH(i)` | g | g × (g/g) = g | ✅ |
| `water = lyeNaOH × waterToLyeRatio` | g | g × (g/g) = g | ✅ |
| `totalWeight = oilWeightTotal + lyeNaOH + water + fragranceLoad` | g | g + g + g + g = g | ✅ |
| `costPerBar = totalCost / batchYieldBars` | curr/bar | curr / bar = curr/bar | ✅ |
| `markupPercent = (price - cost) / cost × 100` | % | (curr - curr) / curr × 100 = % | ✅ |
| `grossMarginPercent = (netRevenue - cost) / netRevenue × 100` | % | (curr - curr) / curr × 100 = % | ✅ |
| `breakEvenUnits = ceiling(fixedCost / contributionPerUnit)` | bars | curr / (curr/bar) = bars | ✅ |
| `totalWeight = moldVolume × density` | g | cm³ × g/cm³ = g | ✅ |

### 2.3 Unit Normalization Pipeline

All mass quantities flow through the `normalizeToGrams` function before cost calculation:

```
input quantity × UNIT_TO_GRAMS[unit] → grams → costForIngredient = normalizedQuantity × costPerGram
```

The `costPerGram` derivation: `costPerUnit / UNIT_TO_GRAMS[unit]`.

**Critical invariant:** Money never crosses currency boundaries. All monetary values within a single calculation must share the same currency code. Cross-currency sums are forbidden and must raise a blocking error.

---

## 3. Canonical Formulas

### 3.1 Formulation Chemistry

#### 3.1.1 Oil Weight Calculation

```
oilWeightTotal = user-entered target oil mass, normalized to grams
oilWeight(i) = (oilPercent(i) / 100) × oilWeightTotal
Σ oilPercent(i) = 100.0000% within a tolerance of ±0.0001
```

**Normative decision:** `oilWeightTotal` MUST be a positive user input. The existing 1000 g constant is a defect to remove, not a product constraint. The engine accepts any positive mass that can be represented safely; the UI defaults to 1000 g only as an editable example value.

#### 3.1.2 NaOH Lye Requirement (Cold Process)

```
lyeNaOH_raw = Σ [oilWeight(i) × SAP_NaOH(i)]
lyeNaOH = lyeNaOH_raw × superfatMultiplier
lyeNaOH = Σ [oilWeight(i) × SAP_NaOH(i)] × (1 - superfatPercent / 100)
```

Where:
- `SAP_NaOH(i)` is the saponification value for oil `i` from `DEFAULT_OILS`
- `superfatMultiplier = 1 - (superfatPercent / 100)`

#### 3.1.3 KOH Lye Requirement

```
lyeKOH_raw = Σ [oilWeight(i) × SAP_KOH(i)]
lyeKOH_pure = lyeKOH_raw × superfatMultiplier
lyeKOH_as_supplied = lyeKOH_pure / (KOH_purityPercent / 100)
```

**Normative decision:** A recipe-level superfat/lye-discount is applied once to the theoretical alkali demand for **both** NaOH and KOH. Alkali purity is then applied independently to the discounted pure requirement. Post-cook superfat is a different hot-process workflow and is out of scope for this calculator version.

#### 3.1.4 Mixed Alkali (NaOH + KOH)

The user specifies `KOHPercentOfAlkaliEquivalents` from 0 through 100. This is an **alkali-equivalent split**, not a mass split. Let `kohFraction = KOHPercentOfAlkaliEquivalents / 100` and `naohFraction = 1 - kohFraction`.

```
fullNaOHPure = Σ [oilWeight(i) × SAP_NaOH(i)]
fullKOHPure = Σ [oilWeight(i) × SAP_KOH(i)]
discount = 1 - (superfatPercent / 100)

lyeNaOH_pure = fullNaOHPure × naohFraction × discount
lyeKOH_pure = fullKOHPure × kohFraction × discount
lyeNaOH_as_supplied = lyeNaOH_pure / (NaOH_purityPercent / 100)
lyeKOH_as_supplied = lyeKOH_pure / (KOH_purityPercent / 100)
totalAlkaliAsSupplied = lyeNaOH_as_supplied + lyeKOH_as_supplied
```

`0% KOH` is a pure-NaOH recipe; `100% KOH` is a pure-KOH recipe. The UI MUST label the field “KOH share of alkali equivalents” and explain that the displayed NaOH and KOH gram masses will not equal the selected percentages because their molar masses and purities differ.

#### 3.1.5 Water Calculation

Exactly one water mode is active. All lye-based modes use `totalAlkaliAsSupplied`, because this is the material the maker weighs.

**Mode A: Water-to-Lye Ratio**
```
water = totalAlkaliAsSupplied × waterToLyeRatio
```

**Mode B: Lye Concentration**
```
lyeConcentrationFraction = lyeConcentrationPercent / 100
water = totalAlkaliAsSupplied × ((1 / lyeConcentrationFraction) - 1)
```

**Mode C: Water as % of Oils**
```
water = oilWeightTotal × waterAsPercentOfOils / 100
```

The contract does not claim one mode is chemically superior. Validation MUST reject non-finite values, non-positive water, lye concentration outside configured safe-operating bounds, and combinations outside the verified fixture envelope. Warnings never silently rewrite user input.

#### 3.1.6 Fragrance Load

```
fragranceLoad = (fragranceLoadPercent / 100) × oilWeightTotal
```

#### 3.1.7 Total Batch Weight

```
totalWeight = oilWeightTotal + lyeNaOH_asSupplied + lyeKOH_asSupplied + water + fragranceLoad + additivesWeight
```

The output schema MUST expose `naohMass`, `kohMass`, and `totalAlkaliMass` separately. The existing `lyeWeightTotal` field may remain only as a deprecated alias of `totalAlkaliMass` during migration and must never be labeled NaOH.

#### 3.1.8 Property Ranges (Quality Indicators)

**Normative decision:** The arbitrary ±20% transforms are removed from public output. Public quality indicators MUST be computed from sourced fatty-acid profiles with provenance and uncertainty, or be omitted. Until that dataset exists, the UI may show only clearly named ingredient-composition facts and must not manufacture a range.

### 3.2 Sizing and Conversion

#### 3.2.1 Recipe Scaling

```
scaledAmount = originalAmount × scaleFactor
```

All ingredient amounts, including oils, lye, water, and fragrance, scale linearly by the same factor.

#### 3.2.2 Unit Conversion

```
quantityInGrams = quantity × UNIT_TO_GRAMS[unit]
```

Where `UNIT_TO_GRAMS = { g: 1, kg: 1000, oz: 28.3495, lb: 453.592 }`.

### 3.3 Costing and Pricing

#### 3.3.1 Batch Cost Calculation

```
ingredientCostTotal = Σ [normalizeCostPerGram(costPerUnit(i), unit(i)) × normalizeToGrams(quantity(i), quantityUnit(i))]
totalCost = ingredientCostTotal + fragranceCost + otherCosts
costPerBar = totalCost / batchYieldBars  (if batchYieldBars > 0; otherwise blocking warning)
costPerUnit = totalCost / totalQuantityGrams  (if totalQuantityGrams > 0; otherwise 0)
```

**Missing cost basis:** If `costPerUnit(i) ≤ 0`, the ingredient is excluded from `ingredientCostTotal` and added to `missingCostBasis`. No zero-cost fallback is used.

#### 3.3.2 Markup Percentage

```
markupPercent = (price - costPerBar) / costPerBar × 100
```

#### 3.3.3 Gross Margin Percentage

```
grossMarginPercent = (netRevenuePerBar - costPerBar) / netRevenuePerBar × 100
```

Where `netRevenuePerBar` is the price after channel fees.

#### 3.3.4 Target Price from Gross Margin (Algebraic Solve)

When `targetGrossMargin` is given and price must be solved:

```
price = costPerBar / (1 - targetGrossMargin / 100)
```

**This is the correct algebraic inversion of the gross margin formula.** A markup multiplier approximation must NOT be used.

#### 3.3.5 Suggested Price

```
suggestedPrice = targetPricePerBar  if targetPricePerBar > 0
suggestedPrice = costPerBar / (1 - configuredTargetGrossMargin / 100)  if an explicit configured target exists
suggestedPrice = null  otherwise
```

The existing `costPerBar × 1.5` implementation is a defect. The UI MUST keep “markup” and “gross margin” as separate named inputs and outputs. It must not supply a hidden commercial default; if no target is configured, it reports cost and lets the user choose a target.

#### 3.3.6 Contribution Per Unit

```
contributionPerUnit = netRevenuePerUnit - costPerSaleableUnit
```

Where `netRevenuePerUnit` accounts for channel percentage fees and fixed transaction fees.

### 3.4 Event / Market Planning

#### 3.4.1 Craft Fair Break-Even

```
profitPerUnit = sellingPricePerUnit - itemCostPerUnit
breakEvenQuantity = ceiling(fixedEventCost / profitPerUnit)
totalCost = fixedEventCost + itemCostPerUnit × itemCount
totalRevenue = sellingPricePerUnit × itemCount
totalProfit = totalRevenue - totalCost
profitAtBreakEven = breakEvenQuantity × profitPerUnit - fixedEventCost
profitAtItemCount = itemCount × profitPerUnit - fixedEventCost
percentageOfInventory = (breakEvenQuantity / itemCount) × 100
```

#### 3.4.2 Event Break-Even with Weighted Contribution

```
eventBreakEvenUnits = ceiling(fixedEventCost / weightedContributionPerUnit)
```

Where `weightedContributionPerUnit` accounts for product mix when multiple products are sold at the event.

#### 3.4.3 Wholesale Pricing

```
wholesalePricePerBar = productionCostPerBar / (1 - desiredWholesaleGrossMargin / 100)
wholesalePricePerBatch = wholesalePricePerBar × batchSize
retailPricePerBar = wholesalePricePerBar × retailMultiplier
retailPricePerBatch = retailPricePerBar × batchSize
wholesaleGrossMarginPercent = (wholesalePricePerBar - productionCostPerBar) / wholesalePricePerBar × 100
```

If the user chooses markup mode instead, `wholesalePricePerBar = productionCostPerBar × (1 + desiredMarkup / 100)` and the input/output are labeled markup. The two modes are never conflated.

### 3.5 Purchasing and Inventory

#### 3.5.1 Purchase Requirements

```
purchaseQuantity = requirements - stock  (rounded up to nearest pack size)
```

Where `requirements` derive from planned batch production, and `stock` is current inventory on hand.

#### 3.5.2 Pack Rounding

```
packsRequired = ceiling(purchaseQuantity / packSize)
purchaseQuantityFinal = packsRequired × packSize
```

### 3.6 Production and Cure Planning

#### 3.6.1 Production Requirements

```
batchesRequired = ceiling(saleableUnitsRequired / expectedYieldPerBatch)
stockTarget = batchesRequired × expectedYieldPerBatch + buffer
```

#### 3.6.2 Ready-By Date Planning

```
pourDate = readyByDate - cureDays - unmoldCutBufferDays - productionLeadTime
```

Where:
- `cureDays` is user-selected cure interval
- `unmoldCutBufferDays` is time from pour to unmold/cut
- `productionLeadTime` accounts for batch count and capacity

---

## 4. Precision and Rounding Policy

### 4.1 Internal Precision

All chemistry, sizing, cost, pricing, and planning calculations retain full numeric precision through the complete dependency chain. Implementations may use IEEE-754 numbers only where fixture tolerances prove stability; money may use integer minor units or an approved decimal representation. No formula may round an intermediate value for reuse.

Internal result objects retain unrounded values. Rounding functions exist only at explicit display/export boundaries. Property ranges are absent unless a separately sourced indicator contract is approved.

### 4.2 Display Rounding

Display values are rounded to **4 decimal places** for mass/weight values and **2 decimal places** for monetary values.

| Value Type | Display Decimals | Example |
|------------|-----------------|---------|
| NaOH/KOH mass | 4 | 127.3000 g |
| Water mass | 4 | 318.2500 g |
| Fragrance load | 4 | 30.0000 g |
| Total batch weight | 4 | 1345.5500 g |
| Sourced indicator values (if separately approved) | Formula-specific | 29.0 |
| Money | 2 | $6.80 |
| Percentages | 2 | 54.67% |
| Unit prices | 4 | $0.0756/g |
| Break-even quantities | 0 (integer) | 15 bars |

### 4.3 Rounding Separation Rule

Rounding is **display-only until the final monetary output**. Intermediate calculations must use full precision. Only the final presented monetary value is rounded to 2 decimal places. This prevents compounding rounding errors across chained calculations.

### 4.4 Currency Rounding

Monetary outputs are rounded to 2 decimal places using standard rounding (half-up). All intermediate monetary calculations use unrounded values.

**Critical rule:** Money is never summed across currencies. All monetary values in a single calculation must share the same `currency` code. A result mixing currencies is incomplete and must not be presented as a recommendation.

---

## 5. Source Manifest and Revisions

### 5.1 Chemistry Source Hierarchy and Manifest

| Priority | Source | Role |
|---|---|---|
| 1 | ISO 3657:2020, *Animal and vegetable fats and oils — Determination of saponification value* (`https://www.iso.org/standard/78380.html`) | Defines the laboratory method and saponification value in mg KOH/g |
| 2 | Codex CXS 210-1999, §5.8 (`https://www.fao.org/4/y2774e/y2774e04.htm`) | Recognizes ISO 3657 / AOCS Cd 3-25 methods and publishes identity ranges for named edible oils |
| 3 | AOCS Cd 3-25 (`https://library.aocs.org/cd-3-25/`) | Alternative recognized laboratory test method |
| 4 | PubChem KOH CID 14797 and NaOH CID 14798 | Molecular weights used to convert KOH-basis values to NaOH equivalents |
| 5 | Supplier certificate of analysis produced with a recognized method | Optional batch-specific override; always user-selected and retained with the recipe |
| 6 | Named specialist calculator fixture | Cross-check only; never the provenance of an ingredient constant |

The calculation engine MUST load ingredients from `lib/calculations/ingredient-dataset.ts` (or a generated JSON imported by it), not from anonymous constants embedded in calculation code. Every ingredient record MUST include: stable ID, display name, KOH-basis saponification value or range, derived NaOH factor, source title, source URL/identifier, source method, publication/revision date, retrieval date, value status (`verified`, `estimated`, `user_override`), and reviewer state.

NaOH factors are derived from the KOH-basis value using `MW_NaOH / MW_KOH`, with the molecular-weight constants versioned in the manifest. A supplier/batch override never mutates the shared catalogue. Missing or unverified values fail closed for public calculation; they may be used only in an explicitly labeled internal fixture mode.

The current `DEFAULT_OILS` values are **legacy provisional data**. They may be migrated into the schema to build and test the engine, but no public chemistry route may use an ingredient until its manifest record is `verified`.

### 5.2 Cost Calculation Source

| Field | Value |
|-------|-------|
| **File** | `lib/calculations/batch-cost.ts` |
| **Schema version** | 1.0.0 |
| **Unit conversions** | `{ g: 1, kg: 1000, oz: 28.3495, lb: 453.592 }` |
| **Revision** | 1 |
| **Retrieved** | 2026-09-09 |

### 5.3 Mold Volume and Calibration Source

There is no universal soap-batter density constant. Density varies with the oil blend, water mode, alkali solution, additives, temperature, and entrained air. The historical constants `0.9 g/cm³` and `0.0523 g/in³` MUST be removed; the latter is also dimensionally wrong because `0.9 g/cm³ = 14.7483576 g/in³`.

The sizing tool uses two modes:

1. **Calibrated mode (recommended):** the user supplies a prior poured batter mass and corresponding occupied mold volume. `calibratedDensity = priorBatterMass / priorOccupiedVolume`; `targetBatterMass = targetVolume × calibratedDensity`.
2. **Planning estimate:** when no calibration exists, the tool uses a versioned, visibly disclosed planning assumption and returns an estimate range, never a precise capacity claim. The assumption and range require retained benchmark fixtures before release.

For irregular molds, `targetVolumeMl = gramsOfWaterFilledToTargetLine / waterDensityAtRoomTemperature`, with the UI explaining that one gram of water approximates one millilitre for workshop planning. For rectangular and cylindrical molds, internal dimensions determine geometric volume. Units are normalized before formulas run.

A recipe can be fit to a mold by solving a linear scale factor: `scaleFactor = targetBatterMass / currentRecipeTotalBatterMass`. Every recipe component scales by the same factor; the chemistry engine then recomputes and validates the scaled result. Cure shrinkage is not part of pour-volume sizing and must be reported separately.

### 5.4 Contract and Task References

| Document | Reference | Status |
|----------|-----------|--------|
| `PRODUCT-CONTRACT-UTILITY-HUB.md` | §4 Economic definitions, §5 Connected product flow | Approved |
| `tasks.json` | R1.1 (Freeze calculation contract), R1.2 (Rebuild tests) | Contract frozen / Implementation planned |
| `TOOL-MARKET-REQUIREMENTS.md` | Category 1: Formulation and Chemistry | Approved research baseline |
| `CODE-PRD-AUDIT.md` | §7 Correct dashboard concept, §9 Critical trust blockers | Approved audit |
| `PRD.md` | §8 Formula specification | Ready for decomposition |

### 5.5 Legacy Provisional SAP Values (Migration Input Only)

The values below document the current codebase and are **not automatically approved reference data**. The implementation may use them for migration tests behind an internal fixture flag. Each row must be replaced or promoted by a manifest record satisfying §5.1 before that ingredient is selectable on the public calculator.

#### NaOH SAP Values (g NaOH per g oil)

| Oil ID | SAP NaOH |
|--------|----------|
| olive-oil | 0.1340 |
| coconut-oil | 0.1900 |
| palm-oil | 0.1410 |
| shea-butter | 0.1280 |
| castor-oil | 0.1270 |
| sweet-almond-oil | 0.1360 |
| avocado-oil | 0.1330 |
| sunflower-oil | 0.1350 |
| rice-bran-oil | 0.1340 |
| canola-oil | 0.1340 |
| cocoa-butter | 0.1370 |
| mango-butter | 0.1370 |
| jojoba-oil | 0.1360 |
| argan-oil | 0.1360 |
| hemp-seed-oil | 0.1350 |
| flaxseed-oil | 0.1340 |
| pomace-oil | 0.1340 |
| babassu-oil | 0.1890 |
| kyrgyz-kernel-oil | 0.1340 |
| safflower-oil | 0.1350 |

#### KOH SAP Values (g KOH per g oil)

| Oil ID | SAP KOH |
|--------|---------|
| olive-oil | 0.1920 |
| coconut-oil | 0.2730 |
| palm-oil | 0.2020 |
| shea-butter | 0.1830 |
| castor-oil | 0.1810 |
| sweet-almond-oil | 0.1960 |
| avocado-oil | 0.1910 |
| sunflower-oil | 0.1940 |
| rice-bran-oil | 0.1920 |
| canola-oil | 0.1930 |
| cocoa-butter | 0.1970 |
| mango-butter | 0.1970 |
| jojoba-oil | 0.1960 |
| argan-oil | 0.1960 |
| hemp-seed-oil | 0.1940 |
| flaxseed-oil | 0.1930 |
| pomace-oil | 0.1920 |
| babassu-oil | 0.2710 |
| kyrgyz-kernel-oil | 0.1920 |
| safflower-oil | 0.1940 |

---

## 6. NaOH / KOH / Mixed Alkali Conventions

### 6.1 Supported Methods

- **Cold process:** NaOH only, KOH only, or an NaOH/KOH alkali-equivalent blend.
- **Hot process:** Uses the same stoichiometric engine, but post-cook superfat behavior is a separate workflow and is not implied.

### 6.2 Pure Alkali Requirements

For each oil, the source manifest supplies a KOH-basis saponification value. The NaOH factor is derived by molecular-weight ratio. The engine computes the full pure requirement, applies the recipe-level superfat discount, and then divides by the user-entered product purity to produce the as-supplied mass to weigh.

### 6.3 Mixed Alkali Semantics

`KOHPercentOfAlkaliEquivalents` is the fraction of the recipe's theoretical alkali equivalents assigned to KOH. The remainder is assigned to NaOH. This is not a percentage of final lye mass. Formulas in §3.1.4 are authoritative.

### 6.4 Output Fields

The result MUST expose:
- `naohPureMass` and `naohAsSuppliedMass`
- `kohPureMass` and `kohAsSuppliedMass`
- `totalAlkaliAsSupplied`
- selected equivalent split and both purity inputs
- manifest revision and ingredient source IDs used

### 6.5 Unknown or Unverified Ingredient Handling

An unknown ingredient or one without a public `verified` manifest record blocks the calculation with a typed, recoverable error. The UI offers ingredient replacement or a recipe-local supplier value with provenance; it never silently substitutes another oil.

---

## 7. Purity Handling Conventions

Purity is supported for NaOH and KOH independently. Each purity input is a percentage greater than 0 and at most 100. The weighed amount is:

```
alkaliAsSupplied = discountedPureAlkaliRequirement / (purityPercent / 100)
```

The default is 100% only as an editable value, not a claim about the user's material. The UI tells the user to use the assay/purity stated by the supplier or certificate of analysis. Purity changes MUST recompute water for lye-based water modes because those modes use the as-supplied mass.

---

## 8. Superfat and Lye Discount Conventions

Superfat is modeled as a stoichiometric lye discount:

```
superfatMultiplier = 1 - (superfatPercent / 100)
discountedPureRequirement = fullPureRequirement × superfatMultiplier
```

The multiplier applies once to every selected alkali path, including pure KOH and mixed alkali. The valid product range is 0–20%; values outside it are rejected. A default of 5% may prefill the input but is a conventional starting point, not a safety guarantee. The product does not claim that any superfat percentage makes a soap safe, moisturizing, stable, or ready to use. Post-cook addition of a selected superfat oil is a separate hot-process feature and is out of scope.

---

## 9. Water Conventions

### 9.1 Water Mode Taxonomy

Exactly one of three modes controls the water mass. `totalAlkaliAsSupplied` means the sum of the NaOH and KOH masses the user will weigh after purity adjustment.

1. **Water-to-lye ratio:** `water = totalAlkaliAsSupplied × waterToLyeRatio`
2. **Lye concentration:** `water = totalAlkaliAsSupplied × ((1 / concentrationFraction) - 1)`
3. **Water as percentage of oils:** `water = oilWeightTotal × (waterPercentOfOils / 100)`

### 9.2 Canonical Representation and Conversions

Water mass in grams is canonical. Inactive controls are derived displays and cannot independently affect the result.

```
lyeConcentrationPercent = totalAlkaliAsSupplied / (totalAlkaliAsSupplied + water) × 100
waterToLyeRatio = water / totalAlkaliAsSupplied
waterAsPercentOfOils = water / oilWeightTotal × 100
```

Changing mode preserves the current water mass on the first transition by deriving the new control value. Subsequent edits in the selected mode recompute water and all downstream values. Inputs outside configured bounds produce a warning or blocking error defined by test fixtures; the engine never clamps silently.

---

## 10. Mold and Geometry Semantics

### 10.1 Quantities

| Quantity | Definition | Unit | Derivation |
|---|---|---|---|
| Oil mass | Total recipe oils | g | Formulation input |
| Batter mass | All ingredients at pour time | g | Sum of oils, as-supplied alkalis, water, fragrance, and additives |
| Mold target volume | Volume filled to the desired line | mL/cm³ | Geometry or water-fill measurement |
| Calibrated density | Prior batter mass divided by occupied volume | g/mL | User's own historical batch |
| Target batter mass | Batter mass intended for that fill line | g | target volume × calibrated density |

### 10.2 Geometry

```
rectangularVolume = internalLength × internalWidth × targetFillHeight
cylindricalVolume = π × internalRadius² × targetFillHeight
irregularVolumeMl ≈ gramsOfWaterAtTargetFillLine
```

All dimensions are internal dimensions. Input units are normalized to centimetres before calculation.

### 10.3 Capacity Modes

**Calibrated mode** is authoritative for a user's mold/recipe family. It stores the prior batter mass, occupied volume, calculated density, date, and optional recipe ID. **Planning mode** uses a versioned benchmark range and must display both the range and “estimate, calibrate before a critical batch.” No single density constant is presented as universal or exact.

### 10.4 Recipe-to-Mold Scaling

```
scaleFactor = targetBatterMass / currentRecipeTotalBatterMass
scaledIngredientMass(i) = currentIngredientMass(i) × scaleFactor
```

After scaling, the chemistry engine recomputes from percentages and source values rather than scaling rounded display outputs. Cure weight loss is excluded from mold capacity and shown only in the separate yield planner.

### 10.5 Calibration and Planning-Estimate Rules

Calibration records are versioned user data, never global constants. A planning estimate remains explicitly approximate and cannot be reused as if it were measured calibration. The release fixture set must cover metric/imperial equivalence, rectangular/cylindrical geometry, irregular-mold water fill, calibration, reverse scaling, invalid dimensions, and uncertainty copy.

---

## 11. Costing and Accounting Definitions

### 11.1 Core Definitions

| Term | Definition | Formula |
|------|------------|---------|
| **Material Cost** | Cost of all ingredients | `Σ (costPerGram × grams)` |
| **Fragrance Cost** | Cost of fragrance additives | User input |
| **Other Costs** | Packaging, labor, overhead | User input |
| **Full Batch Cost** | Total cost of producing the batch | `materialCost + fragranceCost + otherCosts` |
| **Cost Per Made Unit** | Cost per bar produced (including defects) | `fullBatchCost / batchYieldBars` |
| **Cost Per Saleable Unit** | Cost per bar that can be sold | `fullBatchCost / saleableYield` |
| **Saleable Yield** | Bars available for sale | `batchYieldBars - trim - samples - defects - testingUnits` |
| **Markup %** | Percentage above cost | `(price - cost) / cost × 100` |
| **Gross Margin %** | Percentage of revenue that is profit | `(netRevenue - cost) / netRevenue × 100` |
| **Contribution Per Unit** | Revenue after fees minus cost per saleable unit | `netRevenuePerUnit - costPerSaleableUnit` |

### 11.2 Markup vs. Gross Margin

These are **not interchangeable**. The distinction is critical:

| | Markup | Gross Margin |
|---|--------|-------------|
| **Base** | Cost | Price (revenue) |
| **Formula** | `(price - cost) / cost × 100` | `(price - cost) / price × 100` |
| **Solve for price** | `price = cost × (1 + markup/100)` | `price = cost / (1 - margin/100)` |
| **Example** | Cost $6.80, 50% markup → price $10.20 | Cost $6.80, 50% margin → price $13.60 |

**Target price before percentage/fixed fees must be solved algebraically using the gross margin formula**, not approximated by a markup multiplier.

### 11.3 Known Bug: Target Margin Computes Markup

In `batch-cost.ts`, the suggested price calculation at line 128 uses `costPerBar * 1.5`, which computes a 50% markup, not a 50% margin. The correct behavior should use `price = costPerBar / (1 - targetMargin / 100)`.

### 11.4 Channel Fees

When selling through a marketplace or platform, channel fees reduce net revenue:

```
netRevenuePerUnit = pricePerUnit × (1 - percentageFee / 100) - fixedFeePerTransaction / unitsPerTransaction
```

```
contributionPerUnit = netRevenuePerUnit - costPerSaleableUnit
```

### 11.5 Missing Cost Basis Policy

If an ingredient has `costPerUnit ≤ 0`, it is **excluded from the total cost** and added to `missingCostBasis`. The system does NOT use a zero-cost fallback. The result is explicitly marked as incomplete with `missingCostBasis` entries and `warnings`.

**A result with missing costs cannot be styled as a recommendation.**

### 11.6 Cost Basis Revision

Each batch cost calculation accepts a `costBasisRevision` number. This allows tracking how costs change when ingredient prices are updated. Historical batch costs remain addressable by their revision number.

### 11.7 Currency Handling

Money must never be summed across currencies. All monetary values in a single calculation must share the same currency code. If the user's inputs involve multiple currencies, the calculation must raise a blocking error.

---

## 12. Event / Wholesale / Purchasing / Inventory Formulas

### 12.1 Craft Fair Break-Even

#### 12.1.1 Single Product

```
profitPerUnit = sellingPricePerUnit - itemCostPerUnit
breakEvenQuantity = ceiling(fixedEventCost / profitPerUnit)
totalCost = fixedEventCost + itemCostPerUnit × itemCount
totalRevenue = sellingPricePerUnit × itemCount
totalProfit = totalRevenue - totalCost
profitAtBreakEven = breakEvenQuantity × profitPerUnit - fixedEventCost
profitAtItemCount = itemCount × profitPerUnit - fixedEventCost
percentageOfInventory = (breakEvenQuantity / itemCount) × 100
```

#### 12.1.2 Multi-Product Event (Weighted Contribution)

```
eventBreakEvenUnits = ceiling(fixedEventCost / weightedContributionPerUnit)
```

Where `weightedContributionPerUnit` is derived from the product mix:
```
weightedContributionPerUnit = Σ [mixShare(i) × contributionPerUnit(i)]
```

### 12.2 Wholesale Pricing

The user chooses either gross-margin mode or markup mode.

```
priceFromGrossMargin = productionCostPerBar / (1 - desiredGrossMargin / 100)
priceFromMarkup = productionCostPerBar × (1 + desiredMarkup / 100)
wholesalePricePerBatch = wholesalePricePerBar × batchSize
retailPricePerBar = wholesalePricePerBar × retailMultiplier
```

Inputs and results MUST use the chosen term consistently. Gross margin must be less than 100%; invalid or incomplete cost bases block price recommendations.

### 12.3 Production Requirement Planning

```
batchesRequired = ceiling(saleableUnitsRequired / expectedYieldPerBatch)
stockTarget = batchesRequired × expectedYieldPerBatch + buffer
```

### 12.4 Purchase Requirements

```
purchaseQuantity = requirements - stock  (rounded up to pack size)
packsRequired = ceiling(purchaseQuantity / packSize)
purchaseQuantityFinal = packsRequired × packSize
```

Where:
- `requirements` = ingredient quantities needed for planned batches
- `stock` = current inventory levels
- `packSize` = supplier minimum order quantity

### 12.5 Ready-By Date Planning

```
pourDate = readyByDate - cureDays - unmoldCutBufferDays - productionLeadTime
```

Where:
- `cureDays` = user-selected cure interval (e.g., 4–6 weeks)
- `unmoldCutBufferDays` = time from pour to cut (typically 24–48 hours)
- `productionLeadTime` = batches_per_week × time_per_batch (adjusted for capacity)

### 12.6 Date Planning Invariants

- Date planning uses an explicit user-selected interval
- The system **never claims** to determine product safety or readiness
- Cure readiness is always a user decision
- The model may show factual numeric variance but must not label safe/acceptable/dangerous

---

## 13. Invariants

The following invariants must always hold across all calculation modules:

### 13.1 Chemical Invariants

1. Oil percentages total 100% within the declared decimal tolerance; otherwise calculation blocks.
2. Oil mass is a positive explicit user input; no hidden 1000 g default exists.
3. `0 ≤ superfatPercent ≤ 20`; values outside the supported range block.
4. `0 < alkaliPurityPercent ≤ 100` for each selected alkali.
5. NaOH and KOH equivalent fractions total exactly 1 within tolerance.
6. The recipe-level superfat multiplier is applied once to every selected alkali before purity correction.
7. Exactly one water mode is active; inactive values cannot affect the result.
8. Any unknown, provisional, revoked, expired, or malformed production ingredient record blocks public calculation.
9. Alkali output fields identify pure demand and as-supplied mass without overloaded labels.
10. Arbitrary property-range transforms and oil-level IFRA checks are absent.

### 13.2 Economic Invariants

1. **Money never crosses currency boundaries**: All monetary values in a single calculation share one currency code
2. **Missing cost basis is visible, not hidden**: Zero-cost or negative-cost ingredients are excluded from totals and reported
3. **No zero-cost fallback**: Missing ingredient costs are never silently filled with $0
4. **Saleable yield excludes trim, samples, defects, and testing units**
5. **Rounding is display-only until final monetary output**: Intermediate calculations use full precision
6. **A result with missing costs cannot be styled as a recommendation**
7. **Target price before fees must be solved algebraically** (not by markup multiplier approximation)

### 13.3 Unit and Precision Invariants

1. All mass quantities normalize to grams before chemistry or cost calculations.
2. Unit-conversion factors are centralized, source-controlled, and covered by exact fixtures.
3. Internal calculations retain full available decimal precision; rounding occurs only in serialized/display fields according to §4.
4. Metric and imperial geometry normalize to mL/cm³ before any calibration or estimate formula.

### 13.4 Safety Invariants

1. Cure readiness remains a user decision; the product never predicts safety or readiness.
2. Numeric variance may be displayed factually but never classified as safe/acceptable/dangerous.
3. Disclaimers describe scope and never substitute for correct calculations or fail-closed data handling.
4. Business outputs are planning aids, not tax, legal, or regulatory advice.
5. No AI or network call is in the calculation path; production chemistry accepts only verified, versioned manifest records.
6. A route whose release receipt is missing defaults OFF in production.

---

## 14. Independent Golden Fixtures

Engine fixtures are split into **algebra fixtures** and **catalogue fixtures**. Algebra fixtures use an explicitly synthetic oil record so implementation can begin without treating a provisional ingredient value as authoritative. Catalogue fixtures are added only after a manifest record passes the release gate.

### 14.1 Synthetic Fixture Record

```
id = test-oil-a
sapKOH = 0.190000 g KOH/g oil
MW_NaOH = 39.997
MW_KOH = 56.106
sapNaOH = sapKOH × MW_NaOH / MW_KOH = 0.1354477239510926
```

This record MUST be impossible to load in production.

### 14.2 Pure NaOH Fixture

For 1000 g oil, 5% superfat, and 100% NaOH purity:

- full pure NaOH = `135.4477 g`
- discounted/as-supplied NaOH = `128.6753 g`
- tolerance = `±0.0001 g`

### 14.3 Pure KOH and Purity Fixture

For 1000 g oil, 5% superfat, and 90% KOH purity:

- discounted pure KOH = `180.5000 g`
- as-supplied KOH = `200.5556 g`
- tolerance = `±0.0001 g`

### 14.4 Mixed-Alkali Fixture

For 1000 g oil, 5% superfat, 40% KOH alkali equivalents, 99% NaOH purity, and 90% KOH purity:

- as-supplied NaOH = `77.9851 g`
- as-supplied KOH = `80.2222 g`
- total as-supplied alkali = `158.2073 g`
- tolerance = `±0.0001 g`

### 14.5 Water-Mode Fixtures

Using the mixed-alkali result above:

- ratio `2.0:1` → water `316.4146 g`
- concentration `33.3333333333%` → water `316.4146 g` within `±0.0002 g`
- water at `30%` of 1000 g oils → water `300.0000 g`

Switching from ratio mode to its mathematically equivalent concentration preserves water mass; editing the active concentration changes water mass.

### 14.6 Economic Fixtures

For a complete cost basis of 6.80 per unit:

- 50% markup → price `10.20`
- 50% gross margin → price `13.60`
- the UI and result schema retain both labels and values distinctly

A missing cost produces an incomplete result and no recommended price.

### 14.7 Mold Fixtures

Fixtures MUST cover:

- metric/imperial geometric equivalence;
- a 1000 mL target volume calibrated from 1050 g prior batter → density `1.05 g/mL` and target mass `1050 g`;
- irregular-mold water-fill measurement;
- recipe scale factor and full downstream chemistry recomputation;
- zero, negative, non-finite, and implausible dimensions;
- planning mode visibly returning an estimate range rather than a point-capacity claim.

### 14.8 Catalogue and Competitor Fixtures

Before public chemistry release, each verified catalogue oil MUST have at least one hand-derived fixture. A representative set covering pure NaOH, pure KOH, mixed alkali, purity, all water modes, and unit conversion must also be run against at least two specialist calculators. Differences outside declared tolerance are investigated and recorded; expected values are never changed merely to make tests pass.

---



## 15. Build Authorization and Fail-Closed Release Gates

The product owner authorized implementation on 2026-09-09. Formula semantics, data interfaces, architecture seams, and failure behavior are now sufficiently specified to begin building. The gates below block **public exposure or release**, not engineering work behind feature flags.

### 15.1 Resolved Build Decisions

| Decision | Normative resolution |
|---|---|
| Arbitrary oil mass | Positive user-entered target oil mass; 1000 g is editable example data only |
| Superfat on KOH | Recipe-level discount applies once to both selected alkali paths |
| Mixed alkali | User-entered KOH percentage of alkali equivalents; formulas in §3.1.4 |
| Purity | Independent NaOH/KOH assay inputs; divide discounted pure requirement by purity fraction |
| Water modes | Ratio, concentration, and percentage-of-oils are all active deterministic modes |
| Lye output | Separate NaOH, KOH, and total as-supplied masses |
| Property ranges | Remove arbitrary ±20% transforms from public output |
| Mold sizing | Calibrated density is preferred; planning mode is an explicit range, never false precision |
| Margin vs markup | Separate terminology and algebra |
| IFRA | Remove oil-level IFRA checks; only fragrance-material certificates and Category 9 usage belong in the future fragrance checker |

### 15.2 Public-Release Gates

| Gate ID | Required evidence | Failure behavior |
|---|---|---|
| **R-CHEM-01** | Every public ingredient has a complete §5.1 source record and independent reviewer approval | Unverified ingredient is not selectable and API rejects it |
| **R-CHEM-02** | Hand calculations plus cross-calculator fixtures for representative NaOH, KOH, mixed-alkali, purity, water, and unit cases | Chemistry routes remain feature-flagged off |
| **R-CHEM-03** | Source disagreements are investigated and dispositioned per ingredient; no averaging to force parity | Affected record remains unverified |
| **R-MOLD-01** | Geometric conversion, water-fill, calibration, estimate-range, and reverse-scaling fixtures pass | Sizing route remains feature-flagged off |
| **R-FRAG-01** | Oil-level IFRA logic is absent; any fragrance checker consumes a user/supplier certificate for the exact material and maps bar soap to Category 9 | Fragrance compliance result is unavailable rather than guessed |
| **R-SAFETY-01** | Independent domain review of formulas, warning bounds, safety copy, and no-cure-safety claims | Chemistry routes remain private |
| **R-LEGAL-01** | Terms, privacy, disclaimers, refund/digital-goods copy, and jurisdictional requirements reviewed before production launch | Production launch blocked |
| **R-ASSET-01** | Public images, illustrations, and marks have recorded ownership/license provenance | Unlicensed asset is omitted |

### 15.3 Implementation Controls

1. `PUBLIC_CHEMISTRY_ENABLED`, `PUBLIC_MOLD_CAPACITY_ENABLED`, and `PUBLIC_FRAGRANCE_LIMITS_ENABLED` default to `false` in production. Each may become true only when its required release-gate receipts exist and validate; a missing or malformed receipt is false.
2. Algebra tests use only the synthetic fixture from §14; provisional catalogue records cannot cross the production boundary.
3. No AI or network call participates in a calculation. AI may explain a deterministic result but cannot alter it.
4. The engine returns typed errors and visible warnings; it never silently clamps, substitutes an oil, hides missing costs, or invents a source value.
5. The product never labels soap “safe,” “ready,” “approved,” or “compliant” from calculator output.
6. The independent reviewer must not be the implementation actor.

### 15.4 Definition of Build-Ready

This contract is build-ready when the planning verifier confirms complete acceptance/slice mapping and an independent critique finds no unresolved decision that forces a builder to invent behavior. It is release-ready only when every applicable `R-*` gate has retained evidence and independent approval.

---



## Appendix A: Implementation Migration Tasks

These are required code changes, not unresolved product decisions.

| Task | Legacy location | Required implementation | Build status |
|---|---|---|---|
| User-entered oil mass | `sap.ts` | Remove fixed 1000 g constant | Ready |
| Active water modes | `sap.ts` | Implement all three §9 modes | Ready |
| KOH superfat and purity | `sap.ts` | Apply §3.1 order of operations | Ready |
| Separate alkali outputs | `sap.ts` | Add NaOH, KOH, and total fields | Ready |
| Remove fabricated property ranges | `sap.ts` | Omit until sourced fatty-acid records exist | Ready |
| Remove oil-level IFRA | `sap.ts` | Delete incorrect check; future certificate-based module only | Ready |
| Source manifest | new dataset module | Add schema, validation, revision, and fail-closed status | Ready |
| Mold calibration | mold calculation module | Remove universal constants and implement §10 modes | Ready |
| Margin/markup correction | `batch-cost.ts` | Implement separate algebraic modes | Ready |
| Missing-cost warning propagation | cost API adapter | Preserve warnings to the UI | Ready |

---

## Appendix B: Formula Quick Reference

### Chemistry
```
oilWeight(i) = (oilPercent(i) / 100) × oilWeightTotal
fullNaOHPure = Σ [oilWeight(i) × SAP_NaOH(i)]
fullKOHPure = Σ [oilWeight(i) × SAP_KOH(i)]
naohAsSupplied = fullNaOHPure × naohEquivalentFraction × superfatMultiplier / naohPurityFraction
kohAsSupplied = fullKOHPure × kohEquivalentFraction × superfatMultiplier / kohPurityFraction
totalAlkaliAsSupplied = naohAsSupplied + kohAsSupplied
waterRatioMode = totalAlkaliAsSupplied × waterToLyeRatio
waterConcentrationMode = totalAlkaliAsSupplied × ((1 / concentrationFraction) - 1)
waterOilPercentMode = oilWeightTotal × waterPercentOfOils / 100
totalWeight = oilWeightTotal + totalAlkaliAsSupplied + water + fragranceLoad + additivesWeight
```

### Costing
```
ingredientCostTotal = Σ [costPerGram(i) × grams(i)]  (excluding missing-cost items)
totalCost = ingredientCostTotal + fragranceCost + otherCosts
costPerBar = totalCost / batchYieldBars
markupPercent = (price - costPerBar) / costPerBar × 100
grossMarginPercent = (price - costPerBar) / price × 100
priceFromMargin = costPerBar / (1 - targetMargin / 100)
```

### Event Planning
```
breakEvenUnits = ceiling(fixedEventCost / (sellingPrice - itemCost))
contributionPerUnit = netRevenuePerUnit - costPerSaleableUnit
eventBreakEvenUnits = ceiling(fixedEventCost / weightedContributionPerUnit)
```

### Unit Conversion
```
grams = quantity × UNIT_TO_GRAMS[unit]
```

### Mold Sizing
```
moldVolumeMl = normalized geometry or measured water-fill volume
calibratedDensity = priorBatterMass / priorOccupiedVolumeMl
targetBatterMass = moldVolumeMl × calibratedDensity
scaleFactor = targetBatterMass / currentRecipeTotalBatterMass
```

---

**Document version:** 2.0.0  
**Last updated:** 2026-09-09  
**Next review:** Before any public chemistry or mold-capacity release  
**Supersedes:** Version 1.0.0
