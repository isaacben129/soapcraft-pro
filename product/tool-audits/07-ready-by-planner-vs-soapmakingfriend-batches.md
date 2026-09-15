# Ready-By Planner vs SoapmakingFriend Batches

**Audit date:** 2026-09-13  
**Direct competitor:** [SoapmakingFriend](https://www.soapmakingfriend.com/soap-making-recipe-builder-lye-calculator) Batches workflow  
**Evidence:** `O2` direct navigation/module inspection on 2026-09-13. No dedicated public ready-by calculator was found in this pass; this is the closest direct workflow competitor.

## Decision this tool must solve
Given a delivery/market date and my own production assumptions, what is the latest pour date and what batches must I schedule?

## What the direct competitor demonstrably provides
- An adjacent Batches module in navigation alongside Recipes and Inventory.
- Recipe date input and a workflow positioned around creating recipes, managing batches, and inventory.
- Account/premium funnel around deeper workflow use.

## Honest comparison
| Capability | Competitor | SoapCraft target/status | Verdict |
|---|---:|---:|---|
| Batch management surface | Yes | Planned public tool | Must match core job |
| Ready-by backward calculation | Not directly observed | Core differentiation | Opportunity to lead |
| User-selected cure input | Not directly verified | Mandatory | Must build |
| Capacity / batch count | Not directly observed | Mandatory | Must build |
| No-login planning | Calculator opens publicly but account prompts exist | SoapCraft must keep core plan anonymous | Win |

## What SoapCraft must do
1. Require ready-by date, user-selected cure days, unmold/cut buffer, desired saleable units, expected yield/batch, and capacity/week.
2. Show the full date chain: latest pour → unmold/cut → cure interval → ready-by. Use date-only arithmetic deliberately; do not hide timezone behavior.
3. Calculate `latest pour = ready-by − cure days − buffer`; calculate `batches required = ceil(target units / yield per batch)`.
4. Reject past deadline, negative values, zero yield, and zero capacity; explain capacity conflicts.
5. Never call a date “safe” or “guaranteed ready.” It is a schedule based on the maker’s entered interval.

## How SoapCraft can be better
- Receive event/wholesale demand from the market tools, then create an anonymous printable production plan.
- Send dates and ingredient requirements to Purchase Planner.
- Let the maker compare realistic capacity against required capacity before they commit to an order.

## Acceptance metric
For ready-by 2026-10-15, 30 cure days, and 2 buffer days, latest pour is 2026-09-13. The UI clearly says this is a planning result, retains inputs after validation error, and prints the timeline without requiring account creation.
