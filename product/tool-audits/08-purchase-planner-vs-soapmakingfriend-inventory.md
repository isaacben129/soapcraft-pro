# Ingredient Purchase Planner vs SoapmakingFriend Inventory

**Audit date:** 2026-09-13  
**Direct competitor:** [SoapmakingFriend](https://www.soapmakingfriend.com/soap-making-recipe-builder-lye-calculator) Inventory workflow  
**Evidence:** `O2` direct live navigation/interface inspection on 2026-09-13; feature-detail assertions beyond observed navigation are not treated as requirements.

## Decision this tool must solve
Given planned batches, current stock, supplier pack sizes, and prices, what do I need to buy, in what packs, and at what estimated cash cost?

## What the direct competitor demonstrably provides
- Inventory is a first-class product module beside Recipes and Batches.
- The product positions itself as a place to create/save recipes, manage batches, and track inventory.
- Account-oriented workflow and premium funnel are prominent.

## Honest comparison
| Capability | Competitor | SoapCraft target/status | Verdict |
|---|---:|---:|---|
| Inventory module | Yes | Public purchase planner | Different job; must be complete |
| Recipe/batch adjacency | Yes | Context pipeline is the intended advantage | Must prove |
| Anonymous starting point | Account promoted | Required for core planning | Win opportunity |
| Requirements minus stock | Not directly verified | Must implement | Core requirement |
| Pack rounding | Not directly verified | Must implement | Core requirement |
| Supplier comparison | Not directly verified | Strong improvement | Opportunity |

## What SoapCraft must do
1. Accept requirements from formulation/production, plus user-entered stock and pack size.
2. Compute `purchase quantity = ceil(max(0, required − stock) / pack size) × pack size`.
3. Show required, on-hand, shortfall, packs to buy, purchase quantity, projected remainder, currency, and input provenance for each ingredient.
4. Allow stock above requirement (purchase=0) and aggregate multiple planned batches before pack rounding.
5. Keep anonymous local planning functional. Account may add sync/history, never block the purchase list.

## How SoapCraft can be better
- Compare user-entered supplier pack options on effective unit cost and cash outlay without claiming to find the market’s cheapest supplier.
- Carry dates from Ready-By Planner so the user knows what to buy now versus later.
- Produce a printable/exportable purchase list and return landed costs to Batch Cost.
- Explicitly model expected leftover stock after the plan rather than pretending a partial pack disappears.

## Acceptance metric
For 500g required, 200g stock, 1,000g packs: buy 1,000g and forecast 700g remaining. For two batches requiring 500g and 300g from 200g stock: aggregate first, buy 1,000g, forecast 400g remaining. Currency mismatch blocks total-cost aggregation.
