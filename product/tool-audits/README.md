# Per-Tool Direct-Competitor Audits

**Purpose:** One decision surface against one direct alternative. These are deliberately not a portfolio-wide comparison.

## Audit map

| SoapCraft tool | Direct competitor audited | Why this comparator |
|---|---|---|
| Formulation | SoapmakingToolbox Recipe Builder | Closest public one-screen formulation competitor |
| Mold Volume | SoapmakingToolbox Mold Volume | Closest specialist mold-sizing calculator |
| Recipe Scaling | SoapmakingToolbox Batch Resizer | Closest specialist resize calculator |
| Batch Cost | SoapmakingToolbox Soap Cost & Pricing | Closest soap-specific loaded-cost calculator |
| Wholesale Pricing | SoapLab Wholesale Calculator | Closest specialist soap wholesale/MSRP calculator found in direct research |
| Craft-Fair Break-Even | Simple Life Craft Fair Break-Even | Closest event break-even calculator with observable detailed inputs/results |
| Ready-By Planner | SoapmakingFriend Batches | Closest observed soap-production workflow; no dedicated public ready-by calculator found in this pass |
| Ingredient Purchase Planner | SoapmakingFriend Inventory | Closest observed soap inventory workflow; no public specialist purchase planner found in this pass |

## Evidence discipline
- `O1`: directly operated result/output; `O2`: direct live interface inspection.
- Competitor assertions and search snippets do **not** prove calculations correct.
- Current SoapCraft capability statements marked “audit baseline” are not release proof. Recheck deployed behavior and source before marking a gap closed.
- Every audit ends in an independently reproducible acceptance metric. That is the definition of “match,” not a visually similar screen.

## Sequencing derived from the audits
1. Correctness blockers first: formulation chemistry provenance, mold conversion, markup vs margin, and invalid break-even cases.
2. Specialist parity second: precise inputs/outputs, show-the-math, accessible errors, copy/share/print.
3. Only then leverage the actual differentiator: context handoffs across tools, with source/revision/completeness carried forward.

The former `product/COMPETITIVE-AUDIT.md` is a portfolio-level overview. These eight files are the implementation-grade per-tool audits requested by Isaac.
