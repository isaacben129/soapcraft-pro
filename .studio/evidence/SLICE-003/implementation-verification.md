# SLICE-003 Implementation Verification Receipt

**Recorded:** 2026-09-09T14:13:40Z
**Scope:** Deterministic formulation engine and fail-closed public boundary
**Implementation state:** `IMPLEMENTED_PENDING_RELEASE_VERIFICATION`
**Public release state:** `BLOCKED_BY_RELEASE_GATES`

## Implemented

- Explicit positive target oil mass
- Versioned ingredient manifest interface with synthetic and legacy-provisional records
- SAP NaOH derivation from KOH basis using `39.997 / 56.106`
- NaOH, KOH, and mixed-alkali equivalents
- One recipe-level superfat discount before independent alkali purity division
- Separate pure and as-supplied alkali masses
- Water-to-lye ratio, lye concentration, and water-as-percent-of-oils modes
- Fragrance and additives included in total batch weight
- Full internal precision
- Typed public release gate
- `503 PUBLIC_CHEMISTRY_DISABLED` when the production flag is absent
- `422 INGREDIENT_NOT_PUBLICLY_VERIFIED` when selected records lack verified-and-approved status
- Dynamic formulation status page at `/calculators/formulation`
- API route at `/api/calculate/formulation`

## Verification evidence

### Focused journey tests

Command:

```text
npx vitest run lib/calculations/chemistry.test.ts lib/calculations/ingredient-dataset.test.ts app/api/calculate/formulation/route.test.ts
```

Result: **37/37 passed** across 3 files.

### Full repository tests

Final command:

```text
npm test -- --run
```

Result: **114/114 passed** across 7 files after removing the temporary import-smoke test.

### Type safety

Command:

```text
npm run typecheck
```

Result: **PASS** (`tsc --noEmit`, exit 0).

### Production build

Command:

```text
npm run build
```

Result: **PASS**. Next.js compiled, typechecked, generated 104/104 static pages, and registered:

- `ƒ /api/calculate/formulation`
- `ƒ /calculators/formulation`

Nonblocking existing warnings remained for the deprecated middleware filename, edge-runtime static generation, and missing `metadataBase` on some metadata exports.

### Diff integrity

Command:

```text
git diff --check
```

Result: **PASS**.

## Independent review

The Forge reviewer independently confirmed the implemented NaOH/KOH conversion, mixed-alkali split, superfat order, purity correction, water modes, full precision, and fail-closed 503/422 behavior. It identified three implementation gaps that were repaired before this receipt:

1. `additivesWeight` was absent from total batch weight.
2. Manifest public-gate helpers lacked direct tests.
3. Total-weight arithmetic lacked a numeric correctness test.

The reviewer correctly withheld release acceptance because authoritative chemistry data, independent domain review, retained high-boundary release evidence, and literal `RELEASE_ACCEPTED` do not yet exist.

## Gates still closed

- Production ingredient manifest approval
- Independent hand calculations and cross-calculator reference cases
- Ingredient-source conflict resolution
- Independent chemistry/safety review
- Legal/disclaimer review
- Literal `RELEASE_ACCEPTED`

No public chemistry output is authorized by this receipt.
