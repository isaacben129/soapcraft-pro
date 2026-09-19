# Wholesale Pricing Tool vs SoapLab Wholesale Calculator

**Audit date:** 2026-09-13  
**Direct competitor:** [SoapLab Wholesale Soap Pricing Calculator](https://www.soaplab.net/wholesale-calculator)  
**Evidence:** `O2` direct live-interface inspection on 2026-09-13.

## Decision this tool must solve
Can I offer this wholesale price and order policy while retaining a known contribution after my actual cost and fees?

## What the direct competitor demonstrably provides
- MSRP/bar plus a wholesale-as-percent-of-retail input; default shown as 48% and an explanation of “keystone” shorthand.
- Immediate wholesale unit price and educational reminders to compare against true loaded cost.
- Guidance to put MSRP, wholesale, case pack, and payment terms in a line sheet; mentions tiers and freight.

## Honest comparison
| Capability | Competitor | SoapCraft target/status | Verdict |
|---|---:|---:|---|
| MSRP-to-wholesale conversion | Yes | Required | Match |
| Buyer share of MSRP explicit | Yes | Required | Match |
| Actual cost floor | Guidance only | Cost-tool handoff can make it live | Beat |
| Fees/freight/unit economics | Mentioned, not modeled in form | Required | Beat if built |
| MOQ/case-pack revenue | Mentioned, not modeled | Required | Beat if built |
| Line-sheet export | Suggested, not produced | Required | Beat if built |

## P0 correctness issue
Do not label markup as margin. A wholesale tool needs distinct controls and outputs for:
- price as a share of MSRP;
- gross-margin target solved as `price = cost / (1 - margin)`;
- channel percentage/fixed fees;
- freight and per-order costs allocated across units.

## What SoapCraft must do to match
1. Let the maker model wholesale as a percentage of MSRP **and** check it against cost.
2. Explain potentially ambiguous buyer language (“40% off” vs “40% of MSRP”) in the UI.
3. Keep retail, wholesale, case pack/MOQ, payment terms, and currency explicit.

## How SoapCraft can be better
- Receive cost/saleable bar and completeness warnings from Batch Cost.
- Model percentage fees, fixed fees, freight allocation, discounts, MOQ, and contribution per unit.
- Generate a factual line sheet / quote with assumptions, currency, revision, MOQ, and validity date; no invented market-price claim.
- Run multiple buyer scenarios side-by-side.

## Acceptance metric
With cost=$1.00 and target gross margin=40%, computed floor is $1.67. If a 20% discount and 10% fee makes net revenue fall below that floor, show the deficit and block “profitable” language.
