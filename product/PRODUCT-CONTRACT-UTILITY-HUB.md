# SoapCraft Pro — Comprehensive Connected Utility Hub Contract

**Status:** Product direction approved by Isaac on 2026-09-09; detailed tool contracts and independent critique required before implementation  
**Parent decision:** `product/UTILITY-HUB-RESEARCH-DECISION.md`  
**Supersedes strategically:** `product/PRD.md` v3.0 after approval

## 1. Product system

### Goal

Give soapmakers one comprehensive, public utility system in which they can formulate, size, cost, make, cure, price, and plan sales without repeatedly entering the same recipe or being forced to create an account.

### Goal metric

Weekly anonymous utility sessions that produce a correct result, plus the proportion that continue into a connected tool using the same recipe/batch context.

### Primary actor

A selling-curious or early commercial cold-process soapmaker producing approximately 1–20 batches monthly and planning a market or first wholesale order.

### Core jobs

- “When I formulate or resize a recipe, calculate every dependent amount correctly and show me the assumptions.”
- “When I plan a batch for sale, help me know what it truly costs, what each saleable bar must earn, how many I need to sell, and when I must make it.”
- “When I move from recipe to mold, purchasing, production, cure, pricing, or a sales event, carry the relevant context forward instead of making me rebuild it in another calculator or spreadsheet.”

## 2. Product boundaries

### Always public and ungated

- Formulate recipes using the approved, sourced chemistry engine once its release gate passes.
- Size recipes to molds, target batch weights, percentages, units, and bar counts.
- Enter/edit batch economics inputs.
- Receive complete batch cost, saleable-unit cost, contribution, markup and gross-margin outputs.
- Compare retail/wholesale/channel-fee scenarios.
- Calculate craft-market break-even and stock targets.
- Back-plan batch count and dates using a user-selected cure interval.
- Calculate ingredient and packaging purchase requirements.
- View assumptions, formula trace, validation warnings, and methodology.
- Continue between connected tools without re-entry.
- Print, export, or create a local/shareable state link.

### Optional account value

- Cloud persistence across devices.
- Multiple saved products/batches/events.
- Historical comparisons.
- Reusable supplier/item cost records.
- Inventory and purchase-plan synchronization.
- Batch/lot records.

An account must never be required to reveal a core result.

### Out of scope

- Automatic cure-safety prediction.
- Universal fragrance recommendations or claims of IFRA compliance certification.
- Regulatory/legal compliance guarantees.
- Bookkeeping, tax filing, e-commerce, or full ERP features.
- Display-ad integration.
- Community/forum creation.
- Automated publication of content.

### Comprehensive release scope

The approved release is the connected utility hub, not a three-tool MVP. Forge may use internal dependency waves, but it must not present those waves as separately approved products or stop for routine slice approval.

1. **Formulation and chemistry:** NaOH, KOH and mixed-alkali formulation; superfat/lye discount; lye concentration; water-to-lye ratio; water as percentage of oils; oil/fatty-acid profiles; quality indicators; bounded additive/fragrance inputs; versioned source provenance.
2. **Sizing and conversion:** percentage/weight conversion; unit conversion; recipe scaling; mold volume/capacity; recipe-to-mold sizing; target batch weight; bar-count/cut planning; multi-mold allocation; any approved masterbatch calculations.
3. **Cost and pricing:** ingredient, packaging, labor, overhead, waste and saleable-yield costing; markup and gross margin; retail, wholesale, channel-fee, contribution and minimum-viable-price scenarios.
4. **Markets and sales:** craft-fair break-even; product mix; stock, revenue, sell-through and target-profit planning; wholesale MOQ/order production requirements; quote/price-sheet output.
5. **Production and cure:** pour/unmold/cut/target-ready dates using user-selected intervals; capacity and production back-planning; batch/lot records; cure tracking; printable records.
6. **Purchasing and inventory:** ingredient/packaging requirements; pack rounding and supplier comparison; requirements minus stock; event counts; anonymous local planning plus optional-account persistence and depletion.
7. **Utility-support system:** homepage and complete tool directory; methodology; substantive decision guides; editable examples; templates; factual comparisons; canonical SEO architecture; relevant visual explanations.

Every named tool remains provisional until its market requirements, formula contract, source requirements, states, interfaces, and acceptance tests are recorded in the tool-quality matrix. Research and evidence grading are governed by [`TOOL-QUALITY-RESEARCH-PROTOCOL.md`](./TOOL-QUALITY-RESEARCH-PROTOCOL.md); no delegated or competitor assertion may bypass that protocol.

## 3. Domain interfaces

```ts
type Money = { amount: number; currency: string };
type Quantity = { amount: number; unit: "g" | "kg" | "oz" | "lb" | "each" };

type BatchEconomicsInput = {
  materials: Array<{
    id: string;
    name: string;
    purchaseCost?: Money;
    purchaseQuantity?: Quantity;
    batchCost?: Money;
    batchQuantity?: Quantity;
  }>;
  packagingCostPerSaleableUnit: Money;
  laborMinutes: number;
  laborRatePerHour: Money;
  batchOverhead: Money;
  expectedMadeUnits: number;
  expectedSaleableUnits: number;
  channel: {
    percentageFee: number;
    fixedFeePerTransaction: Money;
    unitsPerTransaction: number;
  };
};

type BatchEconomicsResult = {
  materialCost: Money;
  packagingCost: Money;
  laborCost: Money;
  overheadCost: Money;
  fullBatchCost: Money;
  costPerMadeUnit: Money;
  costPerSaleableUnit: Money;
  assumptions: string[];
  missingInputs: string[];
  formulaRevision: string;
};

type SellingScenarioInput = {
  economics: BatchEconomicsResult;
  pricePerUnit: Money;
  targetGrossMargin?: number;
  fixedEventCost?: Money;
  targetEventProfit?: Money;
  expectedSellThrough?: number;
  productMix?: Array<{ name: string; price: Money; contribution: Money; mixShare: number }>;
};

type ProductionRequirement = {
  saleableUnitsRequired: number;
  expectedYieldPerBatch: number;
  batchesRequired: number;
  stockTarget: number;
};

type ReadyByPlanInput = {
  production: ProductionRequirement;
  readyByDate: string;
  userSelectedCureDays: number;
  unmoldCutBufferDays: number;
  capacityBatchesPerWeek?: number;
};
```

Money must never be summed across currencies. Quantities must be normalized by tested conversion functions. Rounding is display-only until the final monetary output.

## 4. Economic definitions

- **Markup %** = `(price - cost) / cost × 100`.
- **Gross margin %** = `(net revenue - cost) / net revenue × 100`.
- **Target price before percentage/fixed fees** must be solved algebraically, not approximated by a markup multiplier.
- **Saleable yield** excludes trim, samples, defects, and units retained for testing.
- **Contribution per unit** = net revenue after channel fees minus full cost per saleable unit.
- **Event break-even units** = ceiling of fixed event costs divided by weighted contribution per unit.
- A result with missing costs is explicitly incomplete and cannot be styled as a recommendation.

## 5. Connected product flow

### User flow

1. Land on the homepage, `/tools`, or any indexable individual tool from search, social, community, or an internal page.
2. Use that tool independently and receive its complete result without authentication.
3. Create or extend a local, versioned Recipe/Batch Context containing only the fields the user entered or explicitly accepted.
4. Continue to any compatible tool with relevant inputs transferred and visibly editable.
5. Move through the complete lifecycle where needed: recipe → mold/batch size → requirements → cost → production/cure → price → market/wholesale plan.
6. Inspect formula definitions, data/source revision, assumptions, validation warnings and rounding policy.
7. Print/export/share the current plan locally.
8. Optionally create an account for cloud persistence, synchronization, history, inventory or multi-batch operations.
9. Optionally request a specific Seller Pack only after receiving the useful result.

### Entry and hub pages

- `/`
- `/tools`
- `/tools/formulation/*`
- `/tools/sizing/*`
- `/tools/batch-economics`
- `/tools/pricing/*`
- `/tools/markets/craft-fair-break-even`
- `/tools/production/ready-by-planner`
- `/tools/purchasing/*`
- `/guides/true-cost-of-handmade-soap`
- `/examples/ten-bar-soap-batch-cost`

The final canonical route inventory will be produced by the approved product-contract phase after the market/tool audit. Every public tool must be reachable from the homepage and tool directory.

## 6. Functional acceptance criteria

1. Anonymous user completes the full flow in a fresh browser with no login, email, cookie consent dependency, or payment.
2. Inputs transfer between all three tool stages without re-entry.
3. Results show formulas, definitions, assumptions, rounding policy and missing-cost warnings.
4. Markup and gross margin are separately labeled and verified against reference cases.
5. Saleable yield changes cost-per-bar and all downstream outputs consistently.
6. Event fees, percentage fees, fixed transaction fees, labor and target profit affect results correctly.
7. Date planning uses an explicit user-selected interval and never claims to determine product safety/readiness.
8. Share state contains no email/personal data; analytics contain no recipes, notes or addresses.
9. Export contains the same values/formula revision as the screen.
10. Error states are accessible and preserve valid inputs.

## 7. Technical acceptance criteria

- Pure calculation modules have unit, boundary, property, and unit-conversion round-trip tests.
- Independent spreadsheet/reference cases are reviewed before release.
- Typecheck, lint, unit tests, production build, and anonymous mobile/desktop E2E all pass.
- Public page/API responses are 200; sitemap and robots are 200 and correct.
- Canonical URLs contain no duplicate `/marketing` tree.
- PostHog events follow the approved event contract and omit sensitive values.
- No endpoint reports email delivery, save, export, or payment success unless the side effect is verified.
- Formula/data revisions are explicit and included in exports.
- Error logging does not expose user-entered recipe or contact data.

## 8. Safety acceptance criteria

- No existing SAP, KOH, mold-density, fragrance, or IFRA logic is made public by middleware-only changes.
- Chemistry is in the approved build scope, but it cannot become public until its deterministic specification, source manifest, effective/revision dates, independent review, hand/reference calculations and cross-calculator fixtures pass.
- The model may research, derive, explain, implement and test chemistry logic, but model output is never the authoritative source of a safety-critical constant or formula.
- Differences between authoritative sources or credible calculators must be explained and resolved; values must not be averaged merely to make tests pass.
- Disclaimers describe scope but never substitute for correct calculations.
- Business outputs are planning aids, not tax/legal/regulatory advice.

## 9. Content acceptance criteria

The complete approved tool/content expansion is in the current build scope. Every published page must supply at least one of:

- a verified working tool;
- an editable worked calculation;
- a useful downloadable artifact;
- verified reference data with provenance;
- substantive synthesis of real workflow evidence.

No page ships solely to meet a word/page quota. Meaningful guide pages should generally provide approximately 1,500 or more rendered words where the subject warrants that depth, plus useful visuals and direct tool connections. Safety, legal, tax, IFRA and formulation content needs named sources and reviewer approval. Pages with overlapping intent are merged, redirected or canonicalized.

The initial 32-page architecture in the parent decision is authorized for current specification and build, subject to each page meeting this quality contract. It is not permission for thin, duplicate or automatically published pages.

## 10. Monetization contract

- Core calculations remain free.
- Affiliate links are contextual, disclosed and editorially selected.
- Email is exchanged only for a specific delivered artifact with explicit consent.
- First paid test is a one-time Seller Pack, not a forced subscription.
- A paid workspace is authorized only after repeat saving/multi-batch/inventory demand is observed.
- Ads require a separate UX/performance decision after traffic evidence.

## 11. Measurement contract

Required events:

- `tool_viewed`
- `calculation_started`
- `calculation_completed`
- `connected_tool_opened`
- `plan_exported`
- `share_link_created`
- `email_delivery_confirmed`
- `affiliate_link_clicked`
- `account_save_requested`
- `workspace_interest_submitted`

Initial validation needs at least 100 genuine completed utility sessions. A working hypothesis is that 15% or more continue to a connected output; below that, revise the seam and relevant tool handoff. This measurement improves the comprehensive hub after release; it is not a gate that postpones the approved initial tool/content architecture.

## 12. Tool-quality and market-research contract

Before a tool implementation is accepted, its specification must be grounded in direct inspection of the strongest current alternatives for that exact job. The audit must record:

- supported inputs, modes, settings and units;
- formulas, terminology, rounding and visible assumptions;
- source datasets and provenance where discoverable;
- result depth, warnings, error handling and mobile behavior;
- local/cloud saving, export, sharing and cross-tool handoffs;
- user complaints, spreadsheet/manual workarounds and switching costs;
- what SoapCraft Pro must match, must improve, uniquely connects, and must avoid;
- unresolved safety, licensing, source or domain-review gates.

The result is a tool-by-tool market requirements matrix with dated URLs and evidence strength. Generic competitor summaries do not satisfy this requirement. A route or calculator name cannot enter the final acceptance ledger until its matrix row and deterministic behavior contract exist.

## 13. Approval gates

1. **Product direction:** approved by Isaac on 2026-09-09, including comprehensive scope, current expansion and chemistry subject to verification.
2. **Baseline recovery:** credential rotated, branch/worktree/stash backed up, deployed commit identified.
3. **Market/tool specification:** detailed direct-source benchmark and tool-quality matrix completed.
4. **Formula specification:** chemistry, sizing and economic formulas plus reference fixtures reviewed.
5. **Comprehensive release:** all approved functional, technical, safety, content and SEO acceptance criteria pass through Forge's independent acceptance gate.
6. **Post-release improvement:** individual tools are iterated from observed use, search, support and competitive evidence.
7. **Spending/publishing:** explicit approval for ads, paid traffic, partnerships, chemistry features, and bulk publication.

## 14. Approved direction and remaining gate

The product direction is approved. This approval authorizes Forge to complete reconnaissance, detailed market/tool research, the full product contract, experience routing, and independent contract critique without returning for routine slice approval. Application implementation remains blocked until those artifacts define every in-scope capability and any unresolved safety/source decisions are surfaced accurately.
