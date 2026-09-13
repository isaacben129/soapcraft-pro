# SoapCraft Pro — Post-Audit Remediation Contract

**Version:** 1.0.0
**Status:** BUILD AUTHORIZED — supersedes prior acceptance claims where the 2026-09-13 competitive or deployed-UI audit found a contradiction.
**Inputs:** `product/PUBLIC-TOOL-CONTRACT.md`, `product/CALCULATION-SPEC.md`, `product/TOOL-IMPLEMENTATION-CONTRACT.md`, `product/tool-audits/01`–`09`.
**Precedence:** This amendment narrows release truth. It does not loosen chemistry gates, numeric semantics, anonymous-use requirements, or independent acceptance requirements.

## 1. Goal and decision metric

**Goal:** each released public tool enables a first-time anonymous maker to enter a clearly labelled input, obtain a correct and explicitly qualified result, understand the operative assumption, and continue without exposure to transport internals.

**Pass metric per tool:** a real browser at desktop and 390px can complete the primary decision loop without horizontal overflow; independently calculated fixtures pass; all inputs, units, errors, empty-result state, add/remove controls, and financial/measurement semantics are visible and truthful.

A passing old unit suite, a route shell, or a static screenshot does not close a remediation slice.

## 2. Shared interface requirements

Every remediation slice must preserve these seams:

`persistent labelled input → field validation → canonical calculation → named result/assumption → local context/save/share/export below result → explicit handoff`

1. **Visible result reservation.** The untouched form states what it will return. A result does not appear out of nowhere below the fold.
2. **Input truth.** Each field has a persistent visible label, unit or basis, and short helper text when a term is ambiguous. Placeholders are not labels.
3. **Control truth.** Add/remove/destructive controls have a visible name or an accessible labelled tooltip and a 44×44px target.
4. **Technical boundary.** Context IDs, raw JSON, checksums, schemas, encoded payloads, and decode mechanics are behind an `Advanced` disclosure. Core save/share/export actions appear only after a successful result.
5. **Precision boundary.** Computation uses canonical full precision; only displayed/exported values round.
6. **Evidence boundary.** Builders record RED and GREEN command output and can set only `VERIFYING`. A separate reviewer must inspect a deployed/real-browser result before an acceptance row can become verified.

## 3. Remediation slices

### REM-001 — Mold capacity correctness and decision clarity

**Owns:** TOOL-MOLD / F-02
**Priority:** P0
**Allowed paths:** `components/shared/mold-volume-form.tsx`, `lib/calculations/sizing*`, `lib/schemas/**`, `app/tools/mold-volume/**`, `e2e/**`.

**RED contract:** a `12 × 3 × 3 in` rectangular mold at `0.9 g/cm³` must not produce a single-digit gram result. The test must initially fail against the current conversion/constant behavior.

**Required behavior:**
- exact conversion round trip using `1 in³ = 16.387064 cm³`;
- separate, named outputs for mold volume, estimated fresh-batter mass, and recommended oil weight;
- initial result template, persistent unit control, field errors, and coherent shape-grid fields;
- valid measured/water-fill and calibration paths remain available.

**Exit evidence:** fixtures include `12×3×3 in ≈ 1,593 g` at the stated density and `10 cm diameter × 5 cm ≈ 392.7 cm³`; desktop + 390px primary loop shows inputs, CTA, empty result, result, and math without overflow.

### REM-002 — Batch cost commercial semantics and task-first UX

**Owns:** TOOL-COST / CTX-001 / F-03 / F-04
**Priority:** P0
**Allowed paths:** `components/shared/batch-costing-form.tsx`, `components/batch-cost/**`, `lib/calculations/batch-cost*`, `lib/calculations/economics*`, `lib/context/**`, `app/tools/batch-cost/**`, `e2e/**`.

**RED contract:** a target gross-margin test with cost `$1.00` and target margin `40%` must fail unless it returns price `$1.666…`; `cost × (1 + margin)` is a markup result and must never be labelled margin.

**Required behavior:**
- canonical, separately labelled markup and gross-margin formulas;
- grouped materials, packaging, labor, overhead, and selling-fee inputs;
- named cost basis (for example, `Cost per selected unit`) and complete/incomplete cost result;
- reserve result rows for full batch cost, cost/made, cost/saleable, floor where complete, markup and gross margin;
- core save/share/export after result; raw context transport under `Advanced`.

**Exit evidence:** $68.50 fixture with 100 made / 90 saleable yields $0.685 made and $0.761… saleable; unknown labor/yield remains incomplete; desktop + 390px path exposes no raw payload before the result.

### REM-003 — Wholesale economics modes and quote clarity

**Owns:** TOOL-WHOLESALE / F-04
**Depends on:** REM-002
**Priority:** P0
**Allowed paths:** `components/shared/wholesale-pricing-form.tsx`, `lib/calculations/economics*`, `app/tools/wholesale-pricing/**`, `e2e/**`.

**RED contract:** target gross margin, markup, MSRP share, fixed/percentage fees, discount, and impossible denominator cases each distinguish their own algebra and labels.

**Required behavior:** first-use mode selector for cost-floor / target gross-margin / markup / MSRP-share; plain-language definitions; visible empty-result rows; MOQ/case/retail relationship and quote assumptions; no profitable claim if fees/discount yield a deficit.

**Exit evidence:** cost `$1.00`, margin `40%` returns `$1.67` floor; a 20% discount plus 10% fee shows deficit when it undermines the floor; desktop + 390px result/quote journey passes.

### REM-004 — Recipe scaling input and output clarity

**Owns:** TOOL-SCALE / F-03
**Depends on:** REM-001
**Priority:** P1
**Required behavior:** explicit proportional vs formulation-recalculation choice, persistent row labels and 44px removal action, reserved factor/original/target/result table, no false verified-recalculation claim from a proportional paste.

### REM-005 — Craft-fair contribution and scenario clarity

**Owns:** TOOL-EVENT / F-05
**Depends on:** REM-003
**Priority:** P1
**Required behavior:** zero fixed cost remains valid; non-positive weighted contribution blocks; initial Booth/Travel/Packaging/Supplies/Marketing rows; headings/accessible removal; result reservation for cost, contribution, exact/rounded break-even and revenue target.

### REM-006 — Ready-by terminology, validation and result predictability

**Owns:** TOOL-READY / F-06
**Depends on:** REM-001
**Priority:** P1
**Required behavior:** cure interval and additional lead time use unambiguous labels/examples; empty result shows batches/latest pour/total lead time; date/yield/capacity errors are local and persistent; never says safe or guaranteed.

### REM-007 — Purchase-plan progression from simple decision to aggregate plan

**Owns:** TOOL-PURCHASE / F-06
**Depends on:** REM-006
**Priority:** P1
**Required behavior:** visible simple-result template; named ingredient and explicit units; zero-pack/negative/on-hand-over-requirement behavior; subsequent multi-row aggregation before pack rounding, optional supplier/landed cost, and print/export.

### REM-008 — Formulation post-receipt interaction surface

**Owns:** TOOL-FORM / F-01
**Depends on:** external CHEM-GATE receipts; cannot be built as public output beforehand.
**Priority:** external gate
**Required behavior after gate:** one workspace for oil blend, alkali/water/purity, actual-value math, revision/source, share/export and connected handoff; `Make blend 100%` with explicit allocation and undo.

### REM-009 — Independent post-remediation deployed audit

**Owns:** all eight tools / Gate_A
**Depends on:** REM-001 through REM-007 and the existing CHEM-GATE dependency for REM-008.
**Required behavior:** fresh reviewer attempts to disprove the numeric fixtures and every UI acceptance requirement at desktop and 390px; checks the exact deployed commit. Gate_A remains `PENDING` until the auditor produces literal `RELEASE_ACCEPTED`.

## 4. Current release truth

- **Formulation:** intentionally unavailable to public calculation pending external chemistry evidence.
- **Mold, cost, wholesale:** prior implementation acceptance is revoked for release purposes while REM-001–003 are open.
- **Scaling, craft fair, ready-by, purchase:** prior implementation acceptance is insufficient to establish competitive/UI completion while REM-004–007 are open.
- **No slice may use audit prose as evidence of a fix.** Only current RED/GREEN proof plus independent browser review counts.
