# SoapCraft Pro Product Contract Readiness

**Status:** `BUILD_READY` — implementation may begin  
**Public release status:** `NOT_RELEASE_READY` — affected routes remain fail-closed  
**Decision date:** 2026-09-09  
**Product authorization:** Isaac directed that the contract be made ready so building could start  
**Normative formula contract:** `product/CALCULATION-SPEC.md` v2.0.0

## 1. Meaning of this verdict

`BUILD_READY` means the target behavior, interfaces, failure modes, acceptance boundaries, dependencies, and implementation delta are specific enough for engineering to start without inventing product or chemistry semantics.

It does **not** mean the current source already implements the contract. The legacy engine is expected to contradict the new target in several places; replacing those behaviors is the work of the first implementation slice. It also does not mean chemistry, fragrance limits, mold-capacity claims, payments, legal copy, or unproven assets may be released before their gates pass.

## 2. Goal metric and leverage

**Goal metric:** weekly anonymous utility sessions that produce a correct result, plus continuation into another tool using the same Recipe/Batch Context.

**Primary lever:** a deterministic, ungated formulation engine whose result can flow into sizing, costing, production, inventory, and market tools without re-entry.

**Hard constraints:** deterministic math, no fabricated source values, no account gate for core results, no invented infrastructure, and fail-closed publication for safety-critical or externally governed outputs.

## 3. Resolved normative decisions

| Area | Build contract |
|---|---|
| Oil mass | Explicit positive user input; no hidden 1000 g recipe |
| SAP basis | Versioned KOH-basis ingredient manifest; NaOH derived using the versioned molecular-weight ratio |
| Mixed alkali | KOH percentage is a share of full pure alkali equivalents |
| Superfat | One recipe-level multiplier applied to every selected alkali before purity correction |
| Purity | NaOH and KOH corrected independently after equivalent split and superfat |
| Water | Exactly one active mode: water-to-lye ratio, lye concentration, or percent of oils |
| Rounding | Full precision internally; round only at display/export boundaries |
| Quality indicators | Remove arbitrary ±20% transforms; publish only sourced fatty-acid-derived indicators, otherwise omit |
| Fragrance | No oil-level IFRA logic; any future limit check requires the exact material certificate and Category 9 mapping |
| Mold sizing | Geometry produces volume; user calibration produces precise batter mass; uncalibrated planning returns an explicit range |
| Pricing | Markup and gross margin are distinct inputs with distinct equations |
| Persistence | Reuse existing NextAuth and Neon/Drizzle; optional account only for persistence |
| Payments | Reuse Dodo behind a one-time Seller Pack provider interface; verified, idempotent webhook grants entitlement |
| Concurrency | Optimistic conflict response; no silent last-write-wins |

## 4. Known implementation delta — first-slice work, not open decisions

The current code contains known legacy behavior:

- `lib/calculations/sap.ts` hard-codes a 1000 g oil total.
- KOH does not receive recipe-level superfat.
- Mixed-alkali equivalent splitting and per-alkali purity are absent.
- Only water-to-lye ratio currently controls water.
- Arbitrary ±20% property ranges are returned.
- Oil-level IFRA logic exists and must be removed.
- `lib/calculations/batch-cost.ts` labels a 50% markup as margin.
- The versioned production ingredient manifest and calibrated mold module do not exist.
- Existing tests assert some legacy behavior and must be replaced through RED-GREEN-REFACTOR, not retained as truth.

These deltas are enumerated in `CALCULATION-SPEC.md` Appendix A and owned by `SLICE-003`, `SLICE-004`, and `SLICE-005`. Their existence is why implementation starts; they are not ambiguity in what to build.

## 5. Fail-closed public-release gates

| Gate | Required evidence | Build effect |
|---|---|---|
| `R-CHEM-01` | Complete production ingredient manifest with authoritative provenance and independent reviewer receipt | Engine/schema work allowed; production chemistry flag remains OFF |
| `R-CHEM-02` | Hand calculations and at least two specialist-calculator comparisons with explained differences | Synthetic fixture work allowed; public chemistry OFF |
| `R-CHEM-03` | Ingredient-level disposition for every source conflict | Affected ingredient unavailable |
| `R-MOLD-01` | Metric/imperial geometry, calibration, planning-range, irregular-mold, and reverse-scaling fixtures | Geometry/calibration build allowed; no universal capacity claim |
| `R-FRAG-01` | Oil-level IFRA removed; exact fragrance certificate revision and Category 9 mapping for any limit check | Fragrance amount input allowed; compliance output unavailable |
| `R-SAFETY-01` | Named independent domain review and approved safety copy | Implementation allowed behind production-off flag |
| `R-LEGAL-01` | Terms, privacy, refund, and digital-goods review | Local build allowed; affected production flow cannot launch |
| `R-ASSET-01` | Ownership/license/source record for every published asset | Layout may use existing approved tokens; unproven asset omitted |

## 6. Security operational gate

A credential was found embedded in Git remote configuration during baseline inspection. It must be rotated and the remote sanitized before any authenticated remote Git operation. Local implementation and tests may proceed. The credential value must never appear in an artifact or report.

## 7. Verification evidence

- Final `python3 .studio/verify-planning.py`: **10/10 PASS**, 0 failed, 0 blocked at 2026-09-09T12:55:49Z after the precision correction and first-slice dependency update.
- Repository tests: **77/77 PASS** across 4 test files. These prove baseline stability; legacy formula assertions are explicitly scheduled for replacement in `SLICE-003`.
- `npm run typecheck`: **PASS** after clearing stale generated `.next` output.
- `npm run build`: **PASS**; Next.js generated 103 static pages. Nonblocking warnings remain for deprecated middleware convention, edge-runtime static generation, and missing `metadataBase` on some metadata exports.
- JSON artifacts passed syntax validation on every edit.
- Markdown fence balance passed.
- All 72 acceptance/flow IDs remain slice-mapped.
- Source-boundary baseline seals 46 pre-existing tracked and untracked application-source paths at HEAD `9eadb87fb6ef`; the current working-tree source SHA-256 must match `.studio/source-boundary-baseline.json`.
- First independent falsification correctly identified that the old readiness document was stale and that the verifier needed a normative semantic check. It also treated intentionally unimplemented target behavior as implementation blockers, prompting this document to make the build-vs-built distinction explicit.
- A fresh second reviewer then returned **`CONTRACT_BUILD_READY` / `NOT_RELEASE_READY`**, found no missing source-to-target delta, and independently reran the verifier at 10/10 PASS. The reviewer noted that token checks alone could false-pass; therefore the independent semantic reading remains part of the evidence, and Gate A now explicitly requires the literal `RELEASE_ACCEPTED` in both ledgers.

## 8. Authorized first implementation slice

**Start:** `SLICE-003 — Deterministic Formulation Engine and Source Boundary`.

**Why first:** it defines the central numerical contract and result schema consumed by sizing, costing, production, inventory, context transfer, and examples. Building pages first would optimize surfaces before the system lever exists.

**Slice output:**

1. Versioned calculation input/output types and `IngredientRecord` manifest interface.
2. Synthetic algebra fixtures from `CALCULATION-SPEC.md` §14.
3. NaOH, KOH, and mixed-alkali equivalent calculations with recipe-level superfat and per-alkali purity.
4. Three mutually exclusive water modes.
5. Explicit oil mass and full-precision internals.
6. Removal of arbitrary property ranges and oil-level IFRA logic from the calculation path.
7. Typed fail-closed errors for unavailable/unverified production ingredient records.
8. Production chemistry feature flag defaulting OFF unless release receipts pass.
9. Updated tests that prove the new contract and delete assertions for legacy wrong behavior.

**Slice exit metric:** all synthetic fixtures and invariants pass; no production ingredient is enabled without a verified manifest record; the public production flag remains OFF.

## 9. Decision

Implementation may start now against the normative contract. Public release may not be claimed until the applicable gates above pass and Gate_A receives the literal `RELEASE_ACCEPTED` after independent deployed verification.
