# SoapCraft Pro — Competitive Audit & Gap Analysis

**Date**: 2026-09-13
**Method**: Direct browser observations (2026-09-09) + internal code audit (`C1`)
**Competitors observed**: SoapCalc, SoapmakingFriend, SoapmakingToolbox, IFRA official docs

---

## Executive Summary

SoapCraft Pro implements 8 public tools with a connected lifecycle that no competitor matches. The competitive advantages are real — **no account required, unlimited use, full recipe context carrying across tools, URL-carried state, formula trace, source attribution, and the entire 8-tool ecosystem in one product**.

The critical gaps are **internal code bugs** that must be fixed before the tools can match competitor quality. SoapmakingToolbox is the strongest overall competitor — it has the best individual calculator features (URL state, show-math, source attribution, IFRA handling) but lacks the connected ecosystem.

---

## 1. FORMULATION TOOL (TOOL-FORM)

### SoapCraft Pro vs Competitors

| Feature | SoapCraft Pro | SoapCalc | SoapmakingFriend | SoapmakingToolbox |
|---|---|---|---|---|
| NaOH/KOH modes | ✅ | ✅ | ✅ (4 modes) | ✅ (incl. dual) |
| NaOH purity editing | ❌ | ❌ | ✅ (editable) | ✅ (editable) |
| Master batch lye | ❌ | ❌ | ✅ | ❌ |
| Hybrid NaOH/KOH | ❌ | ❌ | ✅ | ✅ |
| Non-soap mode | ❌ | ❌ | ✅ | ❌ |
| Oil library | 20 oils | 100+ | Searchable | 100+ |
| Water methods | 3 | 3 | 3 | 3 |
| Superfat | ✅ | ✅ | ✅ + post-cook | ✅ |
| Fragrance load | ✅ | oz/lb only | oz/lb | % + IFRA |
| Property metrics | ✅ | ✅ (One/All) | ❌ (not observed) | ✅ (visual bars) |
| Formula trace | ✅ | ❌ | ❌ | ✅ |
| URL-carried state | ✅ | ❌ | ❌ | ✅ |
| Print/share/export | ✅ | ❌ | ❌ | ✅ |
| Source attribution | ✅ | ❌ | ❌ | ✅ |
| IFRA Category 9 | ✅ (needs cert) | ❌ | ❌ | ⚠️ (generic cat only) |
| Account required | ❌ | ❌ | ✅ (gated) | ❌ |
| Unlimited use | ✅ | ✅ | ❌ (2 recipes free) | ✅ |
| Connected tools | 8 tools | ❌ | 3 modules | 8+ adjacent tools |

### Gap Analysis — Where SoapCraft is WORSE

1. **Oil library size (20 vs 100+)** — SoapCraft has only 20 oils while competitors have 100+ searchable oils
2. **No NaOH purity editing** — SoapmakingFriend and SoapmakingToolbox allow editable purity; SoapCraft does not
3. **No hybrid NaOH/KOH mode** — Both SoapmakingFriend and SoapmakingToolbox support dual-lye
4. **No master batch lye** — SoapmakingFriend offers this
5. **No non-soap product mode** — SoapmakingFriend has this
6. **No post-cook superfat** — SoapmakingFriend has this
7. **Fragrance IFRA handling** — SoapmakingToolbox references IFRA Category 9 but only generically; SoapCraft needs specific certificate limits
8. **No "make it 100%" operation** — SoapmakingToolbox auto-adjusts oil percentages
9. **No starting recipe presets** — SoapmakingToolbox and SoapmakingFriend offer presets
10. **No visual property bars** — SoapmakingToolbox has visual property indicators

### How to Match or Beat Competitors

| Gap | Action | Priority |
|-----|--------|----------|
| Oil library 20→100+ | Expand `lib/data/oils.ts` with full SOAPCALC oil list + SAP values, add source attribution | **P1** |
| NaOH purity editing | Add purity input field (default 100%, editable) to formulation tool | **P1** |
| Hybrid NaOH/KOH mode | Allow per-oil alkali selection (NaOH or KOH) in formulation | **P1** |
| Formula trace | Already implemented — ensure it's visible and accessible | ✅ Done |
| Source attribution | Add "SAP values: [source], retrieved [date]" visible on tool | **P1** |
| IFRA certificate limit | Add field for user to enter Category 9 limit from their certificate | **P2** |
| "Make it 100%" | Add button to auto-adjust oil percentages to sum to 100% | **P2** |
| Visual property bars | Add visual property indicators (not just text table) | **P3** |
| Starting recipe presets | Add preset recipes (basic olive, simple coconut, etc.) | **P3** |
| Post-cook superfat | Add checkbox for hot-process soap superfat | **P3** |
| Non-soap mode | Add lye-free product mode (for non-soap products) | **P3** |
| Master batch lye | Add multiplier input for master batch calculation | **P3** |

### Competitive Advantage to Emphasize
- **Connected lifecycle**: Recipe carries to sizing, costing, production, purchasing — no competitor has this
- **No account required**: SoapmakingFriend gates features behind login
- **Formula trace + source attribution**: SoapCalc has neither
- **IFRA certificate-based limits**: More defensible than SoapmakingToolbox's generic category reference

---

## 2. MOLD VOLUME TOOL (TOOL-MOLD)

### Critical Bug

**The current implementation has a CRITICAL density bug**: `0.0523 g/in³` instead of `14.7484 g/in³`. A 12×3×3 inch mold is estimated as 5.65g instead of ~1,592.82g — a **282× error**.

### SoapCraft Pro vs Competitors

| Feature | SoapCraft Pro | SoapmakingToolbox | Others |
|---|---|---|---|
| Mold volume calculator | ❌ (buggy) | ✅ (adjacent tool) | ❌ |
| Density constants | WRONG (0.0523) | N/A | ❌ |
| Bar count | ❌ | ✅ (Bar Count & Cut) | ❌ |
| Mold sizing in recipe builder | ❌ | ✅ (embedded in recipe) | ❌ |
| Unit system | cm/in | cm/in | ❌ |
| Show the math | ❌ | ✅ | ❌ |

### Gap Analysis

1. **CRITICAL: Wrong density constant** — Must fix immediately before release
2. **Output ambiguity** — Is output oil weight, batter weight, or usable capacity?
3. **Fragrance subtraction model** — Using fragrance as part of sizing is unsound
4. **No "show the math"** — Competitors explicitly show the formula
5. **No headroom/fill factor** — SoapmakingToolbox's mold sizing accounts for fill percentage
6. **No bar count** — SoapmakingToolbox has a separate "Bar Count & Cut" tool

### How to Match or Beat Competitors

| Gap | Action | Priority |
|-----|--------|----------|
| Fix density constant | Replace `0.0523` with `14.7484` for inches; verify cm constants | **P0** |
| Fix output ambiguity | Label output clearly: oil weight / batter weight / usable capacity | **P0** |
| Remove fragrance subtraction | Use standard volume × density formula | **P0** |
| Add "show the math" | Display the formula and calculation steps | **P1** |
| Add fill factor input | Allow user to set fill percentage (e.g., 95% for silicone, 100% for wood) | **P1** |
| Add bar count | Calculate bar count from mold volume and bar dimensions | **P1** |
| Integrate with recipe builder | Allow mold sizing to auto-scale recipe | **P2** |
| Support cylindrical molds | Add diameter × height input mode | **P2** |
| Density override | Allow user to input custom density for their oil blend | **P2** |

---

## 3. RECIPE SCALING TOOL (TOOL-SCALE)

### SoapCraft Pro vs Competitors

| Feature | SoapCraft Pro | SoapmakingToolbox | SoapmakingFriend |
|---|---|---|---|
| Scaling mode | Proportional only | Batch Resizer (URL state) | Mold-resize option |
| Formula validation | ❌ | ✅ | ❌ |
| Copy amounts vs recalc | ❌ | ✅ | ❌ |
| Unit conversion | ❌ (not verified) | ✅ | ✅ |
| Safety boundaries | ❌ | ❌ | ❌ |

### Gap Analysis

1. **Pure proportional scaling** — Must recalculate from SAP values, not just scale amounts
2. **No originating formula validation** — Should validate units, alkali type before scaling
3. **No "copy amounts" mode** — SoapmakingToolbox offers both modes
4. **No safety boundaries** — Need reasonable upper/lower limits
5. **Unit conversion bugs possible** — Must handle metric/imperial correctly

### How to Match or Beat Competitors

| Gap | Action | Priority |
|-----|--------|----------|
| Recalculate from SAP | Replace proportional scaling with SAP-based recalculation | **P1** |
| Validate originating formula | Check units, alkali type, superfat before accepting source recipe | **P1** |
| Add "copy amounts" mode | Let user copy ingredient amounts directly (bypasses SAP recalculation) | **P2** |
| Add safety boundaries | Reject extreme scaling ratios; warn when scaling outside reasonable ranges | **P2** |
| Unit conversion | Ensure correct conversion between lb/oz/g/kg | **P1** |
| Connect to mold sizing | Scaled recipe must feed into mold volume calculations | **P2** |

---

## 4. BATCH COSTING TOOL (TOOL-COST)

### SoapCraft Pro vs Competitors

| Feature | SoapCraft Pro | SoapmakingToolbox | Others |
|---|---|---|---|
| Cost per bar | ❌ (markup/margin confusion) | ✅ (cost per bar input) | ❌ |
| Material cost | ✅ | ✅ | ❌ |
| Labor cost | ❌ (missing input) | ❌ (no dedicated tool) | ❌ |
| Packaging cost | ❌ (missing input) | ❌ | ❌ |
| Waste/yield | ❌ (missing) | ❌ | ❌ |
| Channel fees | ❌ (missing) | ❌ | ❌ |
| Formula revision | ❌ | ❌ | ❌ |
| Show the math | ❌ | ❌ | ❌ |

### Gap Analysis

1. **Markup/margin confusion** — Current implementation calls markup "desired margin" and applies it as `cost × (1 + percentage)` instead of correctly solving for margin: `price = cost / (1 - marginPercent)`
2. **API throws away warnings** — Missing cost inputs are silently zeroed instead of showing warnings
3. **Missing inputs** — Labor, packaging, waste/trim/samples, payment fees, taxes, saleable yield are all missing
4. **Overconfident suggested price** — Presented with more confidence than inputs support
5. **No formula revision** — Competitors don't have this but it's important for traceability

### How to Match or Beat Competitors

| Gap | Action | Priority |
|-----|--------|----------|
| Fix markup/margin formula | `price = cost / (1 - marginPercent)` for margin; `cost × (1 + markupPercent)` for markup | **P0** |
| Preserve warnings | API must surface warnings, not discard them | **P0** |
| Add labor cost input | Minutes × rate calculation | **P1** |
| Add packaging cost per bar | Cost per saleable unit | **P1** |
| Add saleable yield | Separate made units vs saleable units (subtract trim, samples, defects) | **P1** |
| Add batch overhead | Fixed overhead input | **P1** |
| Add payment fees | Channel fee percentage + fixed fee per transaction | **P2** |
| Add formula revision | Version identifier in output | **P1** |
| Add "show the math" | Display cost breakdown formula | **P2** |
| Distinguish ingredient vs landed cost | Clear cost basis labeling | **P2** |
| Never present suggested price as recommendation | Show as "if you price at X, your margin would be Y" | **P1** |

### Competitive Advantage
- **Connected advantage**: Cost per saleable unit feeds into pricing, markets, purchasing — no competitor has this integration
- **Anonymous use**: Full batch cost without authentication

---

## 5. WHOLESALE PRICING TOOL (TOOL-WHOLESALE)

### SoapCraft Pro vs Competitors

| Feature | SoapCraft Pro | SoapmakingToolbox | Others |
|---|---|---|---|
| Channel fees | ❌ (missing) | ❌ (cost input visible) | ❌ |
| MOQ support | ❌ | ❌ | ❌ |
| Wholesale discount | ❌ | ❌ | ❌ |
| Correct margin formula | ❌ (markup = margin) | ❌ | ❌ |
| Quote/price-sheet | ❌ | ❌ | ❌ |

### Gap Analysis

1. **Markup = margin confusion** — Same as batch costing
2. **Defaults retail to 2× wholesale** — Without showing channel fees, MOQ, discounts, labor, or whether cost includes overhead
3. **No channel fee support** — Percentage + fixed fee per transaction
4. **No MOQ support** — Minimum order quantity
5. **No wholesale discount** — Discount offered to wholesale buyers
6. **No quote/price-sheet output** — Competitors don't have this but it's valuable

### How to Match or Beat Competitors

| Gap | Action | Priority |
|-----|--------|----------|
| Fix markup/margin formula | `price = cost / (1 - marginPercent)` | **P0** |
| Add channel fee support | Percentage + fixed fee per transaction | **P1** |
| Add MOQ input | Minimum order quantity; show MOQ revenue | **P1** |
| Add wholesale discount | Discount percentage off wholesale price | **P1** |
| Add quote/price-sheet output | Print/export-ready price sheet | **P2** |
| Add multiple channel scenarios | Different channels with different fee structures | **P2** |
| Connect to batch costing | Cost per saleable unit must come from costing tool | **P1** |
| Connect to markets | Wholesale price feeds into craft-fair break-even | **P2** |

---

## 6. CRAFT FAIR BREAK-EVEN TOOL (TOOL-EVENT)

### SoapCraft Pro vs Competitors

| Feature | SoapCraft Pro | SoapmakingToolbox | Others |
|---|---|---|---|
| Fixed costs | ✅ | ✅ | ✅ |
| Variable costs | ✅ | ✅ | ✅ |
| Zero booth cost allowed | ❌ (rejects) | ❌ | ❌ |
| Travel/accommodation | ❌ (missing) | ❌ | ❌ |
| Card processing fees | ❌ (missing) | ❌ | ❌ |
| Product mix | ❌ (missing) | ❌ | ❌ |
| Sell-through scenarios | ❌ (missing) | ❌ | ❌ |
| Stock buffer | ❌ (missing) | ❌ | ❌ |
| Target profit | ❌ (missing) | ❌ | ❌ |
| Event labor | ❌ (missing) | ❌ | ❌ |

### Gap Analysis

1. **Rejects zero booth cost** — Some events have free tables! Must allow zero fixed costs
2. **Omits travel, accommodation** — Real craft fair costs
3. **Omits card processing fees** — Every card payment has fees
4. **No product mix** — Can't handle multiple products with different margins
5. **No sell-through scenarios** — Conservative/realistic/optimistic
6. **No stock buffer** — No spoilage/damage allowance
7. **No target profit** — Only break-even, not target profit
8. **No event labor** — Time spent at the event has value

### How to Match or Beat Competitors

| Gap | Action | Priority |
|-----|--------|----------|
| Allow zero booth cost | Fix validation — zero fixed cost must be valid | **P0** |
| Add travel/accommodation | As fixed cost inputs | **P1** |
| Add card processing fees | Percentage + fixed per-transaction | **P1** |
| Add product mix | Multiple products with different contribution margins | **P1** |
| Add sell-through scenarios | Conservative/realistic/optimistic percentages | **P1** |
| Add stock buffer | Extra units for spoilage, damage | **P1** |
| Add target profit | Beyond break-even calculation | **P1** |
| Add event labor | Time × rate input | **P2** |
| Add event fees | Configurable event costs | **P2** |
| Connect to batch costing | Cost per saleable unit from costing | **P1** |
| Connect to production | Break-even units determine production batches | **P2** |
| Connect to purchasing | Production volume drives ingredient purchases | **P2** |

---

## 7. READY-BY PLANNER TOOL (TOOL-READY)

### SoapCraft Pro vs Competitors

| Feature | SoapCraft Pro | SoapmakingFriend | Others |
|---|---|---|---|
| Dedicated planner | ❌ (design approved, implementation incomplete) | Batches module | ❌ |
| Cure interval | ❌ (hardcoded) | ✅ (user-selectable) | ❌ |
| Unmold/cut buffer | ❌ | ❌ | ❌ |
| Capacity planning | ❌ | ❌ | ❌ |
| Date chain | ❌ | ❌ | ❌ |
| Print production records | ❌ | ❌ | ❌ |

### Gap Analysis

1. **Implementation incomplete** — Design spec approved but not built
2. **Hardcoded cure interval** — Must be user-selectable (cold-process vs hot-process)
3. **No unmold/cut buffer** — Days between pour and unmold/cut
4. **No capacity planning** — Batches per week constraint
5. **No date chain** — Visual timeline of pour → unmold → cure → ready
6. **No production records** — Printable batch/lot records
7. **No timezone handling** — Market dates in different timezones

### How to Match or Beat Competitors

| Gap | Action | Priority |
|-----|--------|----------|
| Build the planner | Complete implementation from design spec | **P0** |
| Make cure interval user-selectable | Not a hard-coded default; allow cold-process (4-6 weeks), hot-process (3 days) | **P0** |
| Add unmold/cut buffer | Separate days between pour and unmold/cut | **P1** |
| Add capacity planning | Batches per week; show weeks needed | **P1** |
| Add date chain visualization | Show pour → unmold → cut → cure → ready timeline | **P1** |
| Add printable records | Batch/lot records with traceability | **P2** |
| Add timezone handling | For market dates in different timezones | **P2** |
| Connect to batch costing | Break-even units determine required batches | **P1** |
| Connect to production | Schedule connects to batch creation | **P2** |
| Connect to purchasing | Production dates drive ingredient purchase timing | **P2** |

### Competitive Advantage
- **No dedicated competitor tool exists** — SoapmakingFriend has a Batches module but no dedicated production planner
- **This is an opportunity to be first**

---

## 8. INGREDIENT PURCHASE PLANNER TOOL (TOOL-PURCHASE)

### SoapCraft Pro vs Competitors

| Feature | SoapCraft Pro | SoapmakingFriend | Others |
|---|---|---|---|
| Purchase planning | ❌ (partial implementation) | Inventory module | ❌ |
| Requirements minus stock | ❌ | ❌ | ❌ |
| Pack rounding | ❌ | ❌ | ❌ |
| Supplier comparison | ❌ | ❌ | ❌ |
| Stock depletion | ❌ | ❌ | ❌ |
| Event counts | ❌ | ❌ | ❌ |
| Print/export purchase list | ❌ | ❌ | ❌ |

### Gap Analysis

1. **Partial implementation** — Requires design from scratch per code audit
2. **No full planning workflow** — The complete flow (batches → requirements → stock → purchase) doesn't exist
3. **No stock depletion** — Must track stock across multiple batches
4. **No pack rounding** — Must round up to pack sizes
5. **No supplier comparison** — Must compare costs across suppliers/pack sizes
6. **No event counts** — Specific market/wholesale order quantities
7. **No print/export** — Purchase list must be printable

### How to Match or Beat Competitors

| Gap | Action | Priority |
|-----|--------|----------|
| Build full planning workflow | Requirements → stock → purchase requirements → purchase list | **P0** |
| Implement stock depletion | Track stock across multiple planned batches | **P0** |
| Implement pack rounding | `ceil((required - stock) / packSize) × packSize` | **P1** |
| Add supplier comparison | Same ingredient, different pack sizes/prices | **P1** |
| Add event counts | Specific market/wholesale order quantities | **P1** |
| Add print/export | Print-ready purchase list | **P2** |
| Add cost implications | Show cost impact of different pack sizes | **P1** |
| Connect to production | Planned batches auto-generate purchase requirements | **P1** |
| Connect to costing | Ingredient costs from costing tool | **P1** |
| Anonymous planning | No account required for basic planning | **P1** |

### Competitive Advantage
- **No dedicated competitor tool exists** — SoapmakingFriend has inventory but no dedicated purchasing planner
- **This is an opportunity to be first**

---

## Summary: Quick Fix Checklist

### P0 (Must fix before release)
1. **Fix mold volume density constant** (0.0523 → 14.7484 g/in³)
2. **Fix batch costing markup/margin formula** (price = cost / (1 - marginPercent))
3. **Fix wholesale pricing markup/margin formula**
4. **Fix batch costing API warnings being discarded**
5. **Allow zero booth cost in break-even**
6. **Build Ready-By planner** (design spec approved)
7. **Build Purchase Planner full workflow** (design approved)

### P1 (Match competitor parity)
1. Expand oil library from 20 → 100+ with source attribution
2. Add NaOH purity editing
3. Add hybrid NaOH/KOH mode
4. Add formula trace and source attribution visible on tool
5. Add "show the math" to all tools
6. Add labor cost, packaging cost, saleable yield to costing
7. Add channel fees, MOQ, wholesale discount to pricing
8. Add travel, card fees, product mix, sell-through to break-even
9. Add user-selectable cure interval to ready-by planner
10. Add stock depletion and pack rounding to purchase planner
11. Fix recipe scaling to recalculate from SAP, not proportional
12. Add "make it 100%" operation to formulation

### P2 (Beat competitors)
1. Visual property bars (like SoapmakingToolbox)
2. Starting recipe presets
3. Post-cook superfat mode
4. Non-soap product mode
5. Master batch lye option
6. IFRA certificate limit input (not generic category)
7. Quote/price-sheet output
8. Multiple channel scenarios
9. Multiple product mix scenarios
10. Capacity planning in ready-by
11. Date chain visualization
12. Supplier comparison cost savings
13. Event counts in purchase planner

### P3 (Nice-to-have)
1. Starting recipe presets
2. Print/export for all tools
3. URL-carried state on all tools
4. Source manifest version-controlled
5. Worked examples with preloaded inputs
6. Downloadable templates

---

## Competitive Advantage Summary

**SoapCraft Pro's unique advantages that competitors cannot match:**
1. **Connected 8-tool ecosystem** — No competitor has all tools in one product
2. **No account required** for any tool — SoapmakingFriend gates features
3. **Unlimited anonymous use** — SoapmakingFriend limits free tier
4. **Recipe context carries across all tools** — SoapCalc, SoapmakingFriend, SoapmakingToolbox are standalone
5. **IFRA certificate-based fragrance limits** — More defensible than any competitor's generic approach
6. **Formula trace + source attribution** on every tool — SoapCalc has neither
7. **URL-carried state** on every tool — Only SoapmakingToolbox does this (partially)

**SoapmakingToolbox is the strongest competitor** — best individual calculator features but no connected ecosystem. **SoapCraft Pro must match individual quality first, then leverage the ecosystem advantage.**

---

*Audit based on direct browser observations (2026-09-09) at soapcalc.net, soapmakingfriend.com, soapmakingtoolbox.com, and IFRA official documentation, combined with internal code audit findings.*
