# Batch Cost Tool vs SoapmakingToolbox Soap Cost & Pricing

**Audit date:** 2026-09-13  
**Direct competitor:** [SoapmakingToolbox Soap Cost & Pricing](https://soapmakingtoolbox.com/calculators/soap-cost-calculator)  
**Evidence:** `O2` direct live-interface inspection on 2026-09-13.

## Decision this tool must solve
What does one **saleable** bar actually cost after materials, packaging, labor, overhead, and selling fees?

## What the direct competitor demonstrably provides
- Separate material inputs: oils, lye, fragrance/EO, colorants/additives; bars/batch and packaging/bar.
- Labor minutes, hourly value, batch overhead, price/bar, percent fee, fixed fee/sale, optional craft-fair table fee.
- Cost per bar, profit at the entered price, margin, and table-fee break-even scenario.
- Educational worked example and a clear warning that ingredient-only pricing does not pay for labor.

## Honest comparison
| Capability | Competitor | SoapCraft audit baseline | Verdict |
|---|---:|---:|---|
| Materials broken down | Yes | Required | Match |
| Packaging, labor, overhead | Yes | Prior audit said inputs missing | Behind unless deployed proof shows otherwise |
| Percent + fixed selling fees | Yes | Required | Match |
| Saleable yield vs made units | Not visibly separated | SoapCraft should add | Win opportunity |
| Explicit missing-data warnings | Not central | SoapCraft should add | Win opportunity |
| Formula revision/export provenance | Not observed | SoapCraft should add | Win opportunity |

## P0 correctness issue
The prior internal audit reported that SoapCraft called `cost × (1 + percentage)` a “target margin.” That is **markup**, not gross margin. Required definitions:
- `markup = (price - cost) / cost`
- `gross margin = (net revenue - cost) / net revenue`
- `price for target margin = cost / (1 - targetMargin)`

The API must not discard missing-cost warnings or quietly treat unknown amounts as a complete cost.

## What SoapCraft must do to match
1. Separate material, packaging, labor, overhead, and sale/channel fees.
2. Display full batch cost, cost/made unit, cost/**saleable** unit, net revenue, contribution, markup, and gross margin with definitions.
3. Keep unknown/missing values visible, mark the result incomplete, and never produce a confident “suggested price.”
4. Do not sum currencies; carry currency and formula revision into export/share.

## How SoapCraft can be better
- Capture trim, samples, defects, and retained test bars so cost/saleable-unit is real.
- Receive recipe quantities from formulation and send cost/saleable-unit to wholesale and event tools with data-completeness status.
- Show a sensitivity table: what changes when yield, labor, or fees change.

## Acceptance metric
For a fixture of $50 material + $9 packaging + $7.50 labor + $2 overhead, 100 made/90 saleable: full cost=$68.50; cost/made=$0.685; cost/saleable=$0.761. Missing labor or yield produces a visible incomplete-result warning, not a recommendation.
