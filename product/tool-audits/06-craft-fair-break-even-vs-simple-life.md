# Craft-Fair Break-Even Tool vs Simple Life Calculator

**Audit date:** 2026-09-13  
**Direct competitor:** [Simple Life Craft Fair Break-Even Calculator](https://simplelifecalc.com/c/craft-fair-break-even-calculator)  
**Evidence:** `O1/O2` live calculator inputs/results inspected on 2026-09-13.

## Decision this tool must solve
How many items, and how much revenue, must this event generate to cover event costs and reach my stated profit goal?

## What the direct competitor demonstrably provides
- Explicit event-cost lines: booth, travel, packaging, supplies, marketing.
- Average **profit per item** (described as after materials, labor, and card fees) and average sale price.
- Total expenses, exact and rounded products-to-break-even, break-even revenue, expense summary, worked example, and shareable link.
- No-signup workflow; its disclosure calls results estimates.

## Honest comparison
| Capability | Competitor | SoapCraft audit baseline | Verdict |
|---|---:|---:|---|
| Separate event costs | Yes | Previous audit found omissions | Match needed |
| Break-even units + revenue | Yes | Required | Match |
| Card fee already in contribution | Prompted conceptually | Must be explicit in model | Match/beat |
| Product mix | No, uses average item | Required | Opportunity to win |
| Target profit, stock buffer, sell-through | Not visible in core form | Required | Opportunity to win |
| Batch/purchase handoff | No | Product advantage | Win opportunity |

## P0 correctness issue
The prior internal audit said SoapCraft rejected zero booth cost despite “non-negative” validation. A free table or free event is valid; only negative costs are invalid. Also, break-even is undefined when weighted contribution is zero or negative: this must produce a clear warning, never a finite target.

## What SoapCraft must do to match
1. Provide separate cost lines for booth, travel, packaging, supplies, marketing, and optional event labor.
2. Show total event costs, per-unit contribution, exact break-even, rounded units, and break-even revenue.
3. Let fixed cost be zero; reject negatives and non-positive contribution with honest explanation.
4. State that results are plans based on user inputs, not sales predictions.

## How SoapCraft can be better
- Support multiple products with price, cost, and mix share; calculate weighted contribution rather than one average.
- Add target profit, conservative/expected/optimistic sell-through scenarios, and stock buffer.
- Feed target units to Ready-By Planner and Ingredient Purchase Planner; return a traceable market-stock plan.

## Acceptance metric
For $200 fixed costs, $3 price, $1 cost, 2% fee, and $0.10 fixed fee: contribution=$1.84 and break-even=109 units. A zero booth fee with $50 travel remains valid and yields 28 units.
