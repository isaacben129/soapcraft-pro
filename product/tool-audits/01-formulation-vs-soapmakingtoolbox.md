# Formulation Tool vs SoapmakingToolbox Recipe Builder

**Audit date:** 2026-09-13  
**Direct competitor:** [SoapmakingToolbox Recipe Builder](https://soapmakingtoolbox.com/recipe-builder)  
**Evidence:** `O2` direct live-interface inspection on 2026-09-09; SoapCraft current-state assertions require deployed verification before release.

## Decision this tool must solve
Turn an oil blend into a reviewable NaOH/KOH recipe: exact oil quantities, lye, water, fragrance amount, and *transparent assumptions*.

## What the direct competitor demonstrably provides
- One-screen builder: oils, percentages, lye, water, fragrance, cost/bar, mold sizing, property indicators.
- NaOH, KOH, and dual-lye modes; editable hydroxide purity.
- Three water conventions: concentration, water:lye ratio, percent of oils.
- Grouped 100+ oil selector, oil-percent inputs, starter recipes, and **Make it 100%**.
- URL-carried recipe state, local save, print, copy-link, no account requirement.
- Source/provenance link, visible worked math, and a visible warning that property scores are relative comparisons, not skin claims.

## Honest comparison
| Capability | Competitor | SoapCraft target/status | Verdict |
|---|---:|---:|---|
| Public, no-login calculation | Yes | Yes | Match required |
| Shareable recipe state | URL state | Present in product model; verify on deployed route | Verify |
| Worked math with user values | Yes | Required | Must match |
| Source/revision shown in UI | Yes | Required | Must match |
| NaOH/KOH/dual lye | Yes | Chemistry release gate remains blocked | Behind |
| Editable purity | Yes | Not yet release-verified | Behind until verified |
| Large, searchable oil dataset | 100+ observed | Current research baseline names 20 oils | Behind |
| IFRA logic | Generic Category 9 reference | Certificate-specific Category 9 limit is the better design | Opportunity to win |

## What SoapCraft must do to match
1. Expose purity, alkali mode, and every water convention as explicit inputs. Never hide chemistry assumptions in defaults.
2. Expand the oil library only with auditable SAP provenance, revision date, NaOH/KOH basis, and golden fixtures. Feature-count parity without provenance is not parity.
3. Add a visible **Make blend 100%** action with a stated allocation rule and undo.
4. Keep the actual-value math trace and a source/revision link beside results, not buried in methodology.
5. Make share, print, and export reproduce the same formula revision and state without an account.

## How SoapCraft can be better
- Ask for the **specific fragrance supplier Certificate of Conformity Category 9 limit and amendment**, then compare recipe fragrance load against it. Do not invent a universal safe percentage.
- Transfer approved recipe context into mold sizing, costing, planning, and purchasing without re-entry.
- On every export, carry formula version, SAP dataset revision, entered purity, water convention, and all user overrides.

## P0 release blockers
- No public chemistry claim or formulation release until NaOH, KOH, mixed-alkali, purity, water-method, and SAP provenance fixtures independently pass.
- Do not use property indicators as performance, skin, or safety claims.

## Acceptance metric
For 12 independently calculated reference recipes across NaOH, KOH, water conventions, purity, and units: output matches fixtures within declared display tolerance; a 390px user can calculate, inspect the math, copy the link, and reopen the same state without login.
