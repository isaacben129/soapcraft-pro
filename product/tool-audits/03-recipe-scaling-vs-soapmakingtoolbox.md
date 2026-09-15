# Recipe Scaling Tool vs SoapmakingToolbox Batch Resizer

**Audit date:** 2026-09-13  
**Direct competitor:** [SoapmakingToolbox Batch Resizer](https://soapmakingtoolbox.com/calculators/batch-resizer)  
**Evidence:** `O1/O2` live interface and worked examples inspected on 2026-09-13.

## Decision this tool must solve
How do I resize a known recipe to a new oil weight or mold without changing its proportions?

## What the direct competitor demonstrably provides
- Paste-any-recipe input, line-by-line parsing, and editable oil identification.
- Scaling targets: oil weight, total batch weight, or factor; g/oz output and preservation of original units.
- Mold handoff: saved mold can become target size.
- Worked explanation that scaling ingredients is linear, but changing oils requires a new SAP calculation.
- Copy resized recipe and copy share link, no-login workflow.

## Honest comparison
| Capability | Competitor | SoapCraft target/status | Verdict |
|---|---:|---:|---|
| Target oil weight / total / factor | Yes | Required | Match |
| Paste existing recipe | Yes | Required | Match or deliberately replace with structured import |
| Unit-preserving output | Yes | Required | Match |
| Mold handoff | Yes | Connected product advantage | Beat |
| Distinguishes resize from reformulation | Yes | Required | Must match |
| Formula-context validation | Partial | SoapCraft can improve | Opportunity |

## What SoapCraft must do to match
1. Make the selected mode explicit: **resize unchanged recipe** vs **recalculate from structured oil blend**. Do not imply that simple scaling makes a reformulated recipe valid.
2. Scale all declared ingredients consistently, preserve original display units when asked, and separately expose canonical grams.
3. Reject zero/negative targets and warn before extreme ratios; preserve invalid inputs for correction.
4. Provide copy/share/print that includes source amounts, factor, result, and formula version.

## How SoapCraft can be better
- When context comes from Formulation, recompute lye and water from the same immutable formula snapshot; when context is pasted, label it a proportional resize rather than “verified recalculation.”
- Identify unclassified pasted lines and require confirmation rather than silently treating an ingredient as an oil, lye, or additive.
- Feed the result into costing and purchase planning with explicit “resized estimate” provenance.

## Acceptance metric
A 1,000g-oil reference recipe resized to 500g yields every declared line at 0.5× within display tolerance. Replacing an oil disables proportional-safety messaging and routes through formulation recalculation.
