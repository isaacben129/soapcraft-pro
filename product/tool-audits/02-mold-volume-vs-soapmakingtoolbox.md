# Mold Volume Tool vs SoapmakingToolbox Mold Volume

**Audit date:** 2026-09-13  
**Direct competitor:** [SoapmakingToolbox Mold Volume](https://soapmakingtoolbox.com/calculators/mold-volume)  
**Evidence:** `O1/O2` live controls and worked explanation inspected on 2026-09-13.

## Decision this tool must solve
How much oil weight should I prepare for *this exact mold and fill height*?

## What the direct competitor demonstrably provides
- Inches/cm; loaf/slab, round/tube, cavities, and water-fill modes.
- Inside dimensions and actual pour height, explicit fill percentage, lye concentration, optional bar thickness, grams/ounces output.
- Output framed as **oil weight**, alongside batter context; saved mold, copy link, and handoff to recipe builder.
- A worked derivation: geometry → volume → batter-density assumption → oil share based on lye concentration.
- Water-fill method for irregular molds, plus a clear explanation of why it is more accurate.

## Honest comparison
| Capability | Competitor | SoapCraft audit baseline | Verdict |
|---|---:|---:|---|
| Rectangular + round forms | Yes | Required | Match |
| Cavity and water-fill modes | Yes | Required | Behind until present |
| Lye concentration affects oil weight | Yes | Required | Match only when tested |
| Fill/headspace control | Yes | Required | Match |
| Explicit oil vs batter output | Yes | Existing audit found output ambiguity | Fix |
| Worked derivation | Yes | Required | Match |
| Direct handoff to recipe | Yes | Product advantage when robust | Beat |

## Critical correctness finding
The prior internal audit found an inch-density conversion of `0.0523 g/in³`; the correct conversion for `0.9 g/cm³` is about `14.7484 g/in³`. A 12 × 3 × 3 in mold therefore risked showing 5.65g rather than roughly 1,593g. This is a **release blocker** until current production code and fixture results disprove it.

## What SoapCraft must do to match
1. Define output names unambiguously: mold volume, estimated fresh-batter mass, and recommended oil weight are different values.
2. Test both systems: `1 in³ = 16.387 cm³`; conversion must round-trip.
3. Support rectangular, cylinder, cavity-count, and user-weighed-water modes.
4. Let the user set fill percent and density/recipe assumption; label both as estimates.
5. Show every step of the calculation and preserve the selected assumptions in a share/export.

## How SoapCraft can be better
- Import lye concentration and recipe state automatically from the formulation tool, while leaving the assumption editable.
- Return a usable handoff: “Scale this recipe to the recommended oil weight,” rather than merely a number.
- Flag irregular/tapered molds and recommend water-fill instead of pretending geometry is exact.

## Acceptance metric
Fixtures: 12×3×3 in rectangle at 0.9g/cm³ ≈ 1,593g capacity; 10cm-diameter × 5cm cylinder ≈ 392.7cm³. Both unit paths agree within 0.1%; all result labels identify estimate versus known dimension.
