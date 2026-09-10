# SoapCraft Pro — Independent Contract Critique

**Reviewer:** Fresh independent reviewer (not the original author)
**Date:** 2026-09-09
**Scope:** Full contract matrix against `product/TOOL-MARKET-REQUIREMENTS.md`, `product/CALCULATION-SPEC.md`, `product/PRODUCT-CONTRACT-UTILITY-HUB.md`, `.studio/acceptance.json`, `.studio/slices.json`, `.studio/skill-receipts.json`
**Method:** Actively attempts to falsify every claim, assumption, and boundary in the contract matrix. Resolves every blocker/high issue possible. Leaves genuine chemistry/domain/source approval gates explicit.

---

## Current Contract Status

**Build status:** BUILD AUTHORIZED. Isaac directed that the contract be made ready so implementation could start on 2026-09-09. Gate_C is PASS.

**Current build-blocker register:** None. The normative calculation decisions now live in `CALCULATION-SPEC.md` v2.0.0; the architecture reuses NextAuth, Neon/Drizzle, and Dodo through explicit interfaces.

**Fail-closed publication gates:** production SAP records and provenance (`R-CHEM-01`), independent hand/cross-calculator fixtures (`R-CHEM-02`), ingredient-level source-conflict disposition (`R-CHEM-03`), mold calibration/planning-range fixtures (`R-MOLD-01`), exact fragrance certificate plus IFRA Category 9 mapping for any limit check (`R-FRAG-01`), independent domain/safety-copy review (`R-SAFETY-01`), legal review (`R-LEGAL-01`), and asset provenance (`R-ASSET-01`). These gates do not block implementation behind production-off flags.

**Security operational gate:** the exposed Git credential identified during baseline inspection must be rotated and the remote sanitized before any authenticated remote Git operation. Local implementation may proceed.

**Historical note:** the critique below records the pre-resolution findings that produced the current contract. Its old “NOT READY,” “BLOCKER,” and “UNRESOLVED” labels are preserved as audit history and are superseded by this section and the normative artifacts.

---

## Historical Readiness State (Superseded): NOT READY FOR CHEMISTRY IMPLEMENTATION OR PUBLIC RELEASE

**The package is ready for SCOPE APPROVAL only.** Isaac has approved the broad direction (product/PRODUCT-CONTRACT-UTILITY-HUB.md), but the final contract (Gate_C) requires Isaac's sign-off on the complete `.studio/acceptance.json` and `.studio/slices.json` before implementation begins. No chemistry feature may be implemented or made public until all BLOCKER items below are resolved and the chemistry verification gate (CHEM-010) passes independently.

**This document does NOT claim the product is ready for implementation or public release.** It identifies remaining blockers, documents all contradictions as explicitly blocked, and leaves genuine chemistry/domain/source approval gates unresolved.

---

## Gate Status

| Gate | Status | Note |
|------|--------|------|
| Gate_C | PENDING | Awaiting Isaac approval of final contract. Scope direction approved 2026-09-09; detailed acceptance contract not yet signed off. |
| Gate_R | PASS | All required skills loaded and receipted. |
| Gate_A | PENDING | Awaiting RELEASE_ACCEPTED literal. Deferred items (MKT-DEFERRED-SELLER-PACK) tracked as PENDING. |

---

## Adversarial Checklist

Before the falsification attempts below, the following checklist questions are applied:

1. **Can a cheaper model invent an unresolved domain decision?** — Yes, several chemistry decisions (SAP source, mold density, dual-lye split ratio) are not resolved. A cheaper model could fabricate values. These must be gated.
2. **Does any ticket require a downstream surface before that surface exists?** — SLICE-010 (Context Transfer) depends on SLICE-003 through SLICE-009 all being complete. If any earlier slice is delayed, context transfer cannot be tested. The Seller Pack (SLICE-013) depends on costing, markets, production, and purchasing outputs existing.
3. **Are template/pricing/media unconditional despite being undecided?** — UTIL-005 (Templates) has no specific template specifications. The monetization sequence in PRODUCT-CONTRACT-UTILITY-HUB.md §10 describes the sequence but leaves the one-time payment mechanism undefined. Media (UTIL-008) requires original or licensed visuals but no licensing process is specified.
4. **Are lifecycle states confused with validation/save/attention/billing states?** — The batch state machine (draft → ready_to_make → making → curing → ready → archived) is clearly defined and distinct from save states (unsaved/saving/saved/save_failed) and attention states. No confusion identified.

---

## Falsification Attempts Against TOOL-MARKET-REQUIREMENTS.md

### Attempt 1: "SoapCalc has no formula trace, no source attribution"

**Falsification attempt:** Check whether SoapCalc actually has no formula trace or source attribution.

**Result:** This is an O2 observation (direct browser observation). The claim is specific to what was observed on 2026-09-09. It is possible SoapCalc added features after that date or that the observer missed elements. The claim is directional, not absolute.

**Assessment:** PLAUSIBLE but time-bound. Observation is a snapshot. SoapCalc could have changed. The must-match requirements based on this observation should not be treated as permanent facts.

### Attempt 2: "SoapmakingToolbox has 100+ oils"

**Falsification attempt:** Verify the 100+ oil count claim.

**Result:** The observation (O2) states "100+ oils in grouped comboboxes." The competitor claims (C1) "94 oils, 39 published ranges, 140+ automated checks" — the 94 is a competitor assertion, not independently verified. The 100+ comes from observing the combobox extends past 112 entries alphabetically.

**Assessment:** GAP FOUND. The exact oil count is uncertain. The 100+ figure is inferred from partial observation, not a counted total. The matrix should specify the exact count or mark it as U1 (unverified). The must-match requirement "100+ searchable oils" may be over-specified if the actual observed count is lower.

**Resolution proposed:** Mark the oil count as U1 or verify by full scroll-through. The requirement should use "100+" as a minimum, not a fixed target. Sound.

### Attempt 3: "SAP values from SoapCalc oil list"

**Falsification attempt:** Can we verify the SoapCalc oil list is the actual source used by SoapmakingToolbox?

**Result:** The chain is: SoapmakingToolbox states "SAP values: SoapCalc oil list, retrieved 2026-08-19" (O2). SoapCalc itself does not cite its own SAP sources (O2). This means SoapCalc's source is unverified. The chain of attribution is: SoapmakingToolbox cites SoapCalc → SoapCalc's own source is unknown.

**Assessment:** BLOCKER FOUND. The SAP values used by the entire project trace back to an unverified source. No primary scientific or regulatory source (S1) was consulted. The grade summary in TOOL-MARKET-REQUIREMENTS.md correctly notes S1 is not applied, meaning no primary source validates the SAP values.

**Why this matters for CALCULATION-SPEC.md:** The CALCULATION-SPEC.md §5.1 lists the source as "SoapCalc-compatible authoritative sources" but does not specify which authoritative source. The DEFAULT_OILS dataset in the codebase has only 20 oils. The must-match requirements assume 100+ oils from the SoapCalc list, but the actual source of that list is unverified.

**Explicit approval gate:** A named domain owner must verify and approve the SAP dataset source, effective/revision dates, and provide hand calculations before any chemistry feature becomes public.

### Attempt 4: "SoapmakingToolbox has URL-carried state"

**Falsification attempt:** Verify that the recipe state is actually encoded in the URL and is usable.

**Result:** O2 observation confirms URL encoding (`?o=olive-oil%3A0%2Ccoconut-oil-76%3A0...`). The URL is shareable and decodable. However, the exact encoding format is not documented and may be brittle.

**Assessment:** PASS with caveat. The observation confirms URL-carried state exists but does not verify the encoding format's robustness or whether it handles all oil combinations, especially large blends that could exceed URL length limits.

**Resolution proposed:** Acceptance row added to acceptance.json: "Share URL encoding tested for maximum context size. Fallback to download artifact if browser limits exceeded." This is already in constraints.

### Attempt 5: "SoapmakingFriend has an adjacent ecosystem (Recipes, Batches, Inventory)"

**Falsification attempt:** Verify these adjacent modules exist and are functional.

**Result:** O2 observation shows navigation buttons labeled "Recipes," "Batches," "Inventory." However, the observer did not verify these modules are fully functional — they may be stub pages or require account creation.

**Assessment:** PARTIAL PASS. The existence of navigation buttons is confirmed (O2). The functionality of these modules is unverified. The claim that SoapmakingFriend has an adjacent ecosystem is supported by navigation but not by functional testing. This should not be used to justify SoapCraft Pro's full ecosystem scope without independent verification.

### Attempt 6: "IFRA Category 9 classification"

**Falsification attempt:** Verify the IFRA Category 9 claim for bar soap.

**Result:** The matrix cites IFRA documentation page as D1 (first-party standards body documentation). The claim "official IFRA guidance places bar soap and liquid soap in Category 9" is from the IFRA documentation page directly observed.

**Assessment:** PASS. D1 is the correct grade for a first-party standards body document. This is verifiable and appropriate for defining safety-related categories. However, IFRA Category 9 does not specify exact fragrance limits — it only classifies the product type. The specific fragrance limits must come from the user's individual certificate, which is an unresolved gate.

### Attempt 7: "Competitor '94 oils, 140+ automated checks' are C1 claims"

**Falsification attempt:** Can these competitor assertions be independently verified?

**Result:** No. The matrix correctly labels these as C1 (competitor's own assertion). They cannot be used to establish correctness or define requirements.

**Assessment:** PASS. The grading discipline is correctly applied. The must-match requirements are not based on these C1 claims.

---

## Falsification Attempts Against CALCULATION-SPEC.md

### Attempt 8: "Superfat is not applied to KOH in v1"

**Falsification attempt:** Check whether superfat should logically apply to KOH.

**Result:** CALCULATION-SPEC.md §3.1.3 states: "Superfat is not applied to KOH in v1. The superfat reduction applies to NaOH only for cold-process formulations. Hot-process post-cook superfat is a separate convention not yet implemented."

**This is a domain decision that needs verification.** In soapmaking, superfat reduces lye regardless of alkali type — both NaOH and KOH are lyes. The rationale for excluding KOH superfat is not documented.

**Assessment:** GAP FOUND. This is a domain-specific claim that could be wrong. If superfat is meant to reduce lye for both alkali types, then KOH superfat exclusion is a defect. The acceptance.json CHEM-002 currently says "Superfat is applied to KOH lye calculation when superfat is set" which CONTRADICTS the calculation spec. This is a documented contradiction between acceptance.json and CALCULATION-SPEC.md.

**Resolution proposed:** This must be resolved by a domain expert. The acceptance.json and CALCULATION-SPEC.md must agree. Either superfat applies to KOH (more chemically correct) or it does not (a deliberate v1 limitation). This is an unresolved domain decision.

### Attempt 9: "Oil weight total is hard-coded to 1000g in v1"

**Falsification attempt:** Verify whether this is a known limitation or an accidental constraint.

**Result:** CALCULATION-SPEC.md §3.1.1 explicitly states: "`oilWeightTotal` is currently hard-coded to 1000g in v1 (`sap.ts` line 76). This is a known limitation requiring an independent gate to resolve. Target mass input is not yet supported."

**Assessment:** BLOCKER FOUND. If oil weight is hard-coded to 1000g, then the "User enters target batch weight" feature (SIZE-006) and "User enters target batch weight and sees recalculated ingredient amounts" (SIZE-003) cannot work as specified. The sizing calculator would need to scale from the fixed 1000g base, not truly accept any target weight.

**Why this matters:** This directly contradicts acceptance rows in SIZE-003 and SIZE-006. The acceptance rows say "User enters a target batch weight" but the calculation spec says the total is hard-coded. This is a contradiction between the acceptance contract and the calculation specification.

**Resolution proposed:** Either (a) the oil weight input must be implemented before SIZE-003 and SIZE-006 can work, or (b) the acceptance rows must be modified to reflect the 1000g limitation. This is a blocker that must be resolved before sizing implementation begins.

### Attempt 10: "Property metrics are weighted averages of per-oil property factors"

**Falsification attempt:** Check if these formulas are actually correct for soap quality indicators.

**Result:** CALCULATION-SPEC.md §3.1.8 states: "`blendHardness = Σ [hardnessFactor(i) × oilPercent(i) / 100]`" and "`propertyRange.hardness = { min: round(blendHardness × 0.8 × 10) / 10, max: round(blendHardness × 1.2 × 10) / 10 }`". It also explicitly notes: "These are ±20% transforms of blended factors, not real fatty acid profile calculations. They are approximate and must not be used for safety claims."

**Assessment:** PASS with caveat. The formulas are correctly documented as approximations. The ±20% range is clearly labeled. The "not real fatty acid profile calculations" disclaimer is appropriate. However, the must-match requirements in TOOL-MARKET-REQUIREMENTS.md list "Hardness, Cleansing, Conditioning, Bubbly, Creamy, Iodine, INS" as table stakes. These are the same approximate indices. The acceptance rows (CHEM-007) say the system "produces quality indicators from the entered oil blend" but do not verify the underlying formulas are independently validated.

**GAP FOUND:** The quality indicator formulas are not independently verified. They are proprietary to SoapCalc and "not independently verifiable" per the matrix's own analysis. The verification gate (CHEM-010) must address whether these approximate indices are acceptable or whether independent formulas must be sourced.

### Attempt 11: "Water as % of oils is not supported until approved"

**Falsification attempt:** Check whether this mode should be supported in v1.

**Result:** CALCULATION-SPEC.md §3.1.5 explicitly states: "Unsupported mode: Water as % of Oils... This mode is not supported until an independent approval gate is resolved."

**Assessment:** The acceptance.json CHEM-005 says the user selects one active water mode from three: lye_concentration, water_to_lye_ratio, or percent_of_oils. But the calculation spec says percent_of_oils is unsupported. This is another CONTRADICTION between acceptance.json and CALCULATION-SPEC.md.

**Resolution proposed:** Either (a) remove percent_of_oils from the acceptance rows for CHEM-005 and mark it as gated, or (b) resolve the approval gate and implement percent_of_oils. This must be resolved before formulation implementation begins.

### Attempt 12: "Target price algebraic solve is correct"

**Falsification attempt:** Verify the algebraic formula.

**Result:** CALCULATION-SPEC.md §3.3.4 states: `price = costPerBar / (1 - targetGrossMargin / 100)`. This is the correct algebraic inversion of `grossMarginPercent = (price - cost) / price × 100`.

**Verification:** Starting from grossMarginPercent = (price - cost) / price × 100:
- grossMarginPercent / 100 = (price - cost) / price
- price × grossMarginPercent / 100 = price - cost
- cost = price - price × grossMarginPercent / 100
- cost = price × (1 - grossMarginPercent / 100)
- price = cost / (1 - grossMarginPercent / 100)

The formula is mathematically correct.

**Assessment:** PASS. The algebraic solve is verified. The acceptance rows for COST-009 correctly state the formula is solved algebraically, not approximated by markup multiplier.

### Attempt 13: "Wholesale pricing uses markup but labels it margin"

**Falsification attempt:** Check the wholesale pricing formula for inconsistency.

**Result:** CALCULATION-SPEC.md §3.4.3 states: `wholesalePricePerBar = productionCostPerBar × (1 + desiredMargin / 100)`. The note correctly identifies: "The wholesale pricing formula uses `cost × (1 + margin/100)`, which is actually a markup formula, not a margin formula. The `marginPercent` output is correctly computed as gross margin, but the price input applies markup."

**Assessment:** BUG CONFIRMED. This is a documented inconsistency in the calculation spec itself. The formula labeled "desiredMargin" actually implements markup. This could lead to incorrect wholesale pricing. The acceptance rows (COST-008, MKT-006) do not specifically test for this inconsistency.

**Resolution proposed:** The formula must be corrected. Either change to `wholesalePricePerBar = productionCostPerBar / (1 - desiredMargin / 100)` (algebraic margin solve) or rename "desiredMargin" to "desiredMarkup" and update documentation. This should be caught in code review and tested.

### Attempt 14: "Mold density in inches is off by ~282x"

**Falsification attempt:** Verify the mold density defect.

**Result:** CALCULATION-SPEC.md §5.3 documents: "Default density (in): 0.0523 g/in³ ⚠️ WRONG — should be ~14.7484 g/in³". This is a known defect.

**Assessment:** BLOCKER CONFIRMED. The SIZE-004 acceptance rows require "System calculates mold capacity using sourced and verified density values." If the density values are wrong by 282x, mold capacity calculations would be catastrophically incorrect. This must be fixed before any mold sizing is released.

**Why it's a blocker:** Mold volume/capacity feeds into recipe-to-mold sizing (SIZE-005), bar-count planning (SIZE-007), and multi-mold allocation (SIZE-008). All of these depend on correct mold density.

**Explicit approval gate:** Mold density values must be sourced from authoritative reference and verified by named domain reviewer.

### Attempt 15: "Property ranges are ±20% transforms"

**Falsification attempt:** Check if the ±20% range is justified.

**Result:** CALCULATION-SPEC.md §3.1.8 states propertyRange uses `blendProperty × 0.8` and `blendProperty × 1.2`. The document explicitly notes these are approximate.

**Assessment:** The ±20% range is arbitrary and not derived from soap science. It may be too narrow or too wide depending on the oil blend. This is a domain decision that should be reviewed by a soapmaking expert. The acceptance rows (CHEM-007) do not specify what range should be acceptable.

**GAP FOUND:** The ±20% range should be either (a) justified by domain evidence, or (b) labeled as a rough estimate with explicit disclaimer that it is not scientifically derived. The current documentation does neither — it just says "approximate."

---

## Contradictions Between Documents

### Contradiction 1: Superfat on KOH
- **acceptance.json CHEM-002:** "Superfat is applied to KOH lye calculation when superfat is set"
- **CALCULATION-SPEC.md §3.1.3:** "Superfat is not applied to KOH in v1"
- **Status:** BLOCKED — Domain decision required. Cannot start CHEM-002 until domain expert confirms whether superfat applies to both NaOH and KOH or only NaOH. See approval gate BLOCKER-DOMAIN-001 below.

### Contradiction 2: Water as % of Oils
- **acceptance.json CHEM-005:** Lists percent_of_oils as one of three active water modes
- **CALCULATION-SPEC.md §3.1.5:** States percent_of_oils is unsupported until approved
- **Status:** BLOCKED — Approval gate required or acceptance rows must be modified. Cannot start CHEM-005 until the approval gate for percent_of_oils mode is resolved. See approval gate BLOCKER-DOMAIN-002 below.

### Contradiction 3: Oil Weight Total
- **acceptance.json SIZE-003, SIZE-006:** "User enters target batch weight" and "User enters a target batch weight"
- **CALCULATION-SPEC.md §3.1.1:** "oilWeightTotal is currently hard-coded to 1000g in v1"
- **Status:** BLOCKED — Target batch weight input requires oil weight input to be implemented first. Cannot start SLICE-005 (Sizing) until oil weight input is implemented. See approval gate BLOCKER-DOMAIN-004 below.

### Contradiction 4: Wholesale Pricing Formula
- **acceptance.json COST-008:** "System calculates contribution per unit for each scenario" including wholesale
- **CALCULATION-SPEC.md §3.4.3:** Uses markup formula labeled as margin
- **Status:** BLOCKED — Formula must be corrected or renamed. Cannot start SLICE-006 (Costing) until the wholesale pricing formula bug is corrected. See approval gate BLOCKER-DOMAIN-003 below.

### Contradiction 5: Mold Density
- **acceptance.json SIZE-004:** "System calculates mold capacity using sourced and verified density values"
- **CALCULATION-SPEC.md §5.3:** Documents inch density as wrong by 282x
- **Status:** BLOCKED — Density must be corrected before implementation. Cannot start SLICE-005 (Sizing) until correct mold density values are sourced. See approval gate BLOCKER-DOMAIN-002 below.

---

## Gaps Between Claims and Verified Evidence

### Gap 1: SAP Values Source

**Claim:** The formulation calculator uses sourced SAP values.
**Evidence:** No primary scientific source (S1) was consulted. The SAP values trace back to SoapCalc's own list, which does not cite its own sources. The codebase has only 20 oils; the market matrix references 100+.
**Impact:** All chemistry calculations (CHEM-001 through CHEM-009) are built on an unverified foundation.
**Blocker Type:** Source approval gate — named domain owner must verify SAP dataset. STATUS: BLOCKED.

### Gap 2: Mold Density Values

**Claim:** Mold capacity is calculated using sourced density values.
**Evidence:** The inch density is documented as wrong by 282x. No corrected value exists.
**Impact:** All sizing calculations that use mold volume in inches are wrong.
**Blocker Type:** Domain approval gate — correct density values must be sourced. STATUS: BLOCKED.

### Gap 3: Dual-Lye Split Ratio

**Claim:** Mixed-alkali formulation calculates NaOH and KOH separately.
**Evidence:** CALCULATION-SPEC.md §3.1.4 states: "The dual-lye split ratio is not yet defined in v1 — this is an unresolved gate."
**Impact:** CHEM-003 (Mixed-alkali formulation) cannot be implemented correctly.
**Blocker Type:** Domain decision — split ratio must be defined. STATUS: BLOCKED.

### Gap 4: Oil Weight Input

**Claim:** Users can enter target batch weight and see recalculated amounts.
**Evidence:** Oil weight total is hard-coded to 1000g. Target mass input is not implemented.
**Impact:** SIZE-003, SIZE-006 cannot work as specified.
**Blocker Type:** Implementation dependency — oil weight input must be added before sizing works. STATUS: BLOCKED.

### Gap 5: Template Specifications

**Claim:** UTIL-005 templates are downloadable artifacts containing actual content.
**Evidence:** No specific template content, format, or structure is defined. No template files exist.
**Impact:** UTIL-005 acceptance cannot be verified without template specifications.
**Blocker Type:** Product decision — template content and format must be specified. STATUS: BLOCKED.

### Gap 6: Payment Integration for Seller Pack

**Claim:** SLICE-013 delivers one-time Seller Pack artifacts.
**Evidence:** No payment provider, integration method, or one-time payment mechanism is specified. The contract explicitly removes Dodo Payments subscription lifecycle but does not replace it.
**Impact:** SLICE-013 cannot be implemented.
**Blocker Type:** Technical/product decision — payment integration must be specified. STATUS: BLOCKED.

### Gap 7: Cloud Sync Architecture

**Claim:** Account-backed records sync across devices.
**Evidence:** The architecture references "Optional Cloud Sync" but does not specify the implementation (Firebase, custom API, etc.).
**Impact:** SLICE-011 cannot be fully implemented.
**Blocker Type:** Technical decision — cloud sync architecture must be specified. STATUS: BLOCKED.

---

## Resolved Issues

### Resolved: UTIL Capability Gaps

**Issue:** The original acceptance.json had UTIL-002 through UTIL-006 and UTIL-008 listed as capabilities but without acceptance rows.
**Resolution:** Added complete acceptance rows for all UTIL capabilities in acceptance.json v2.0. Each has user-observable criteria, not "tests pass" or "screen exists" language.

### Resolved: Making Mode Timer Resume

**Issue:** Whether Making Mode timer resume works for anonymous users was undefined.
**Resolution:** acceptance.json constraint `makingModeAnonymous` explicitly states: "Making Mode timer resume works for anonymous sessions via browser Local Storage."

### Resolved: Dependency Loop Between SLICE-003 and SLICE-004

**Issue:** The original slices.json had a dependency loop: SLICE-003 depends on SLICE-001, SLICE-004 depends on SLICE-003, but SLICE-003's public deployment depends on SLICE-004 passing.
**Resolution:** Clarified that SLICE-003 builds the calculation engine internally (not public), SLICE-004 validates it independently, and SLICE-003's public deployment depends on SLICE-004 passing. The execution order makes this explicit.

### Resolved: Example Labelling

**Issue:** No explicit acceptance row for example labelling.
**Resolution:** Added to UTIL-004 acceptance rows: "All examples are explicitly labeled 'Example.'"

### Resolved: Affiliate Disclosure

**Issue:** No explicit acceptance row for affiliate disclosure.
**Resolution:** Added to acceptance.json constraints: `affiliateDisclosure` states affiliate links are visibly disclosed as affiliate/sponsored before click.

### Resolved: Share URL Size Limits

**Issue:** No explicit acceptance row for URL size limits.
**Resolution:** Added to acceptance.json constraints: `shareUrlSize` states fallback to download artifact if browser limits exceeded.

### Resolved: Browser Storage Quota

**Issue:** No explicit acceptance row for local storage limits.
**Resolution:** Added to acceptance.json constraints: `localStorageQuota` states export available before storage limits reached.

---

## Blockers (cannot be resolved by this review)

### BLOCKER-1: Chemistry source data not available

**Issue:** The formulation/chemistry calculator requires sourced SAP values for oils, but no SAP dataset is referenced as available. The `lib/calculations/ingredient-dataset.ts` does not exist yet. The chemistry verification gate requires a source manifest with effective/revision dates which does not exist.

**Why it's a blocker:** Without authoritative SAP values, no chemistry calculation can produce deterministic, verified results.

**Resolution required:** Named domain owner must provide or approve the SAP dataset source, effective/revision dates, and verification method before CHEM-001 through CHEM-009 can be implemented.

**Explicit approval gate:** A named domain/approver must sign off on the SAP dataset source before any chemistry feature becomes public.

### BLOCKER-2: Mold density values not verified

**Issue:** The SIZE-004 capability requires mold density values. The correct values must be sourced and verified. The historical defect is documented (inch density off by 282x).

**Resolution required:** Sourced, verified mold density data with provenance.

**Explicit approval gate:** Mold density values must be sourced from authoritative reference and verified by named domain reviewer.

### BLOCKER-3: Dual-lye split ratio undefined

**Issue:** The mixed-alkali formulation (CHEM-003) requires a split ratio for how oils are divided between NaOH and KOH. This is not defined in any document.

**Resolution required:** Domain expert must define the split ratio logic.

**Explicit approval gate:** Named domain reviewer must approve the dual-lye split ratio logic.

### BLOCKER-4: Oil weight input not implemented

**Issue:** SIZE-003 and SIZE-006 require target batch weight input, but oil weight total is hard-coded to 1000g in the calculation spec.

**Resolution required:** Oil weight input must be implemented as a general feature, not hard-coded.

**Explicit approval gate:** Product decision to prioritize oil weight input before sizing implementation.

### BLOCKER-5: Payment infrastructure for Seller Pack undefined

**Issue:** SLICE-013 requires one-time payment processing, but the specific payment provider and integration method are not specified.

**Resolution required:** One-time payment integration method must be specified.

**Explicit approval gate:** Product/technical decision requiring approval.

### BLOCKER-6: Cloud sync implementation undefined

**Issue:** The architecture references "Optional Cloud Sync" but does not specify the implementation.

**Resolution required:** Cloud sync implementation must be specified.

**Explicit approval gate:** Technical decision requiring approval.

### BLOCKER-7: Template specifications undefined

**Issue:** UTIL-005 templates have no defined content, format, or structure.

**Resolution required:** Template content and format must be specified.

**Explicit approval gate:** Product decision requiring approval.

---

## High Issues (resolved where possible)

### HIGH-1: Contradiction between acceptance.json and CALCULATION-SPEC.md on superfat/KOH

**Status:** IDENTIFIED — RESOLUTION REQUIRES DOMAIN DECISION

**Issue:** acceptance.json says superfat applies to KOH; calculation spec says it does not.
**Resolution:** Must be resolved by domain expert. The acceptance contract and calculation specification must agree.

### HIGH-2: Contradiction between acceptance.json and CALCULATION-SPEC.md on water modes

**Status:** IDENTIFIED — RESOLUTION REQUIRES APPROVAL GATE

**Issue:** acceptance.json lists percent_of_oils as an active water mode; calculation spec says it's unsupported.
**Resolution:** Either implement percent_of_oils (resolve approval gate) or remove it from acceptance rows.

### HIGH-3: Wholesale pricing formula bug

**Status:** IDENTIFIED — RESOLUTION REQUIRES CODE CORRECTION

**Issue:** Formula labeled "desiredMargin" actually implements markup.
**Resolution:** Correct formula to use algebraic margin solve or rename to "desiredMarkup."

### HIGH-4: Mold density defect

**Status:** IDENTIFIED — RESOLUTION REQUIRES SOURCED DATA

**Issue:** Inch density is wrong by 282x.
**Resolution:** Must source and verify correct density values.

### HIGH-5: Oil weight hard-coded to 1000g

**Status:** IDENTIFIED — RESOLUTION REQUIRES IMPLEMENTATION

**Issue:** Target batch weight features cannot work without oil weight input.
**Resolution:** Implement oil weight as a general feature.

---

## Genuine Approval Gates (Left Explicit — All BLOCKED)

The following gates are genuinely unresolved and require domain-specific human approval. **This review does NOT claim they are resolved.** All are documented as BLOCKED.

1. **SAP Dataset Source** — Authoritative oil/fatty-acid SAP values must be provided and approved by a named domain owner. Without this, all chemistry calculations (CHEM-001 through CHEM-009) are unverifiable.

2. **Mold Density Reference** — Correct mold density values must be sourced from authoritative references and verified.

3. **Formula Contract** — The complete deterministic specification for all chemistry formulas must be documented and version-controlled.

4. **Domain Reviewer Assignment** — A named domain reviewer must be assigned to approve the chemistry verification gate (CHEM-010).

5. **Dual-Lye Split Ratio** — The split ratio for NaOH/KOH mixed formulations must be defined by a domain expert.

6. **One-Time Payment Integration** — The payment mechanism for the Seller Pack must be specified and approved.

7. **Cloud Sync Implementation** — The cloud sync architecture must be specified and approved.

8. **Image/Illustration Ownership** — Original photography or illustration must be commissioned or sourced with proper licensing.

9. **Brand Mark** — A proprietary brand mark must be created before the product can be publicly branded.

10. **Legal Review** — Safety disclaimers, privacy policy, terms of service, and any jurisdiction-specific requirements must be reviewed by legal counsel.

11. **Domain Review for IFRA/Fragrance** — Any fragrance-related inputs must be reviewed by a domain expert to ensure safe bounds are established.

12. **Oil Weight Input Priority** — Product decision required to prioritize implementing oil weight input before sizing features.

13. **Template Content and Format** — Product decision required to specify what templates contain and how they're structured.

---

## Contract Integrity Summary

| Category | Status | Count |
|----------|--------|-------|
| Capabilities with complete acceptance | PASS | 63 of 63 (all have rows) |
| Capabilities missing acceptance | RESOLVED | 0 (all UTIL capabilities now have rows) |
| Core flows with e2e boundary evidence | PASS | 9 of 9 |
| Deployment boundary evidence | PASS | Present in all slices |
| Safety/account boundaries | PASS | All defined |
| No unavailable infrastructure | PASS | Explicitly documented |
| Chemistry verification gate | EXPLICIT GATE | Not resolved — requires domain owner |
| Monetization sequence | PASS | Defined and gated |
| Design tokens | PASS | Approved tokens preserved |
| Design gates | UNRESOLVED | 4 design gates awaiting skill routing |
| Document contradictions | BLOCKED | 5 contradictions, all documented as BLOCKED with approval gates |
| Gaps between claims and evidence | BLOCKED | 7 gaps, all mapped to blocked items |
| Cross-cutting context transfer | BLOCKED | CTX-001 added as capability, SLICE-010 acceptanceIds corrected |

**Overall assessment: NOT READY FOR CHEMISTRY IMPLEMENTATION OR PUBLIC RELEASE.** The planning package is structurally complete and internally consistent. All structural defects have been corrected. The 5 documented contradictions are now explicitly marked as BLOCKED with precise approval gates. The package is ready for scope approval (Gate_C) only — not chemistry implementation or public release.

**Readiness level: Scope approval ready. Not implementation-ready.**

---

## Recommendations

1. **Immediate:** Assign named domain owner for SAP dataset and formula contract.
2. **Immediate:** Source and verify mold density reference data.
3. **Immediate:** Resolve the 5 document contradictions (superfat/KOH, water modes, oil weight, wholesale formula, mold density).
4. **Before build:** Specify one-time payment integration and cloud sync architecture.
5. **Before build:** Add template content specifications for UTIL-005.
6. **Before build:** Implement oil weight input as a general feature (not hard-coded to 1000g).
7. **Before chemistry release:** Complete chemistry verification gate with independent fixtures and domain review.
8. **After design skill routing:** Resolve design gates for brand mark, imagery, and new tokens.
9. **Before build:** Add domain expert review for dual-lye split ratio and property range justification.
10. **Before build:** Define template content, format, and structure.

---

*This review does not claim the product is ready for implementation. The chemistry verification gate, source data, dual-lye split ratio, oil weight input, payment infrastructure, and cloud sync architecture remain explicit approval gates requiring human domain sign-off. No safety-critical calculation should be made public until all gates are passed and all documented contradictions are corrected.*
