# SoapCraft Pro — Architecture

**Version:** 3.0.0 — Connected Public Tools
**Normative formula contract:** `CALCULATION-SPEC.md` v2.0.0

## 1. System boundary

```text
Public pages/forms
  → shared client schemas + Recipe/Batch Context
  → public calculation route adapters
  → deterministic domain engines
  → versioned manifests/formula revisions
  → visible result, local restore, export/share and next-tool handoff
```

The eight public tools are complete vertical systems, not page shells around unrelated APIs. React owns interaction, engines own math, adapters own transport, and manifests own externally sourced data.

## 2. Canonical public routes

- `/tools/formulation`
- `/tools/mold-volume`
- `/tools/recipe-scaling`
- `/tools/batch-cost`
- `/tools/wholesale-pricing`
- `/tools/craft-fair-break-even`
- `/tools/ready-by-planner`
- `/tools/ingredient-purchase-planner`

`/tools` is the authoritative directory. Existing category or legacy routes redirect one-to-one only where semantics match. A missing, retired or gated route is never listed as operational.

## 3. Module contracts

### 3.1 Schemas

`lib/schemas/` defines versioned input/output types shared by forms, APIs, context serialization and tests. Validation rejects non-finite numbers, invalid enums, impossible denominators, mixed currencies and unsafe/unavailable chemistry data. Server validation is authoritative; client validation mirrors it for usability.

### 3.2 Deterministic engines

`lib/calculations/` contains pure functions with no React, network, authentication or storage dependency. Engines return typed results or typed domain errors. They retain full precision and never read display-rounded values back into calculations.

- chemistry follows `CALCULATION-SPEC.md` and a versioned KOH-basis ingredient manifest;
- sizing distinguishes geometry, calibrated density and planning range;
- scaling distinguishes proportional copy from chemistry recomputation;
- costing distinguishes complete/incomplete basis and made/saleable units;
- pricing distinguishes markup/gross margin and solves fees algebraically;
- markets uses weighted contribution and ceiling for units;
- production uses date-only scheduling and capacity constraints;
- purchasing aggregates normalized quantities before stock and pack rounding.

### 3.3 Route adapters

`app/api/calculate/*/route.ts` parses schema input, calls exactly one canonical engine orchestration path, serializes typed errors consistently, and returns formula/dataset revision. Thin route-local duplicate formulas are prohibited. API and direct-engine fixtures must match.

Calculation routes are public and rate-limitable. Formulation additionally checks `PUBLIC_CHEMISTRY_ENABLED` and production-manifest eligibility; default is OFF. No flag can make an unverified ingredient eligible.

### 3.4 Tool pages

Each canonical page owns form state, accessible validation, result presentation, “Show the math,” assumptions, warning/blocking states, local save/reset, print/export/share, context import and next-tool action. Forms do not use email capture to reveal or export core results.

### 3.5 Recipe/Batch Context

A versioned discriminated object contains:
- metadata: schema version, source tool, calculator/formula/dataset revisions, created/updated dates;
- units and one currency;
- optional formulation, mold, scaling, saleable-yield, cost, pricing, event, production, stock and supplier sections;
- no credentials or implicit personal data.

Each tool declares `imports`, `exports` and a migration function. Import is reviewable and editable. Unknown future fields are ignored safely; unsupported old versions produce an explicit migration failure. Local storage is namespaced and quota errors offer export. Share URL encoding is checksummed and size-limited; oversized payloads become downloadable context files.

### 3.6 Content and SEO

Methodology is generated or maintained from the same formula/revision registry where practical. Examples contain inputs and expected outputs tested against engines. Comparisons have dated evidence records. Sitemap and metadata derive from the route registry and availability status, preventing dead or gated claims.

## 4. Existing infrastructure

Reuse the existing NextAuth session boundary and Neon PostgreSQL with Drizzle only for optional future cloud persistence; they cannot gate anonymous calculations. Optional writes use ownership-scoped queries and optimistic version checks returning `409 Conflict`, never silent last-write-wins.

**Dodo Payments — one-time Seller Pack only:** reuse it only for a future pack, behind a provider interface. Entitlement requires a verified, idempotent webhook. Subscription billing is not part of this build.

## 5. Failure behavior

| Failure | Required behavior |
|---|---|
| invalid input | field-level/typed error; preserve values; no stale result |
| unavailable chemistry/source | fail closed with source/gate reason; no estimate |
| calculation exception | stable error code and safe message; retry; server correlation ID |
| API unavailable | keep editable local state; retry; do not claim saved/computed |
| local quota/save error | preserve memory state; show save_failed; offer export |
| corrupt/incompatible share | do not execute payload; show decode_failed and clean-start option |
| mixed currency | block aggregation/comparison |
| incomplete cost basis | calculate known subtotal only; label incomplete; no recommended price |
| impossible margin/fee | block non-positive denominator |
| insufficient production capacity | return explicit infeasibility and required capacity |
| context revision mismatch | name versions and require migration/recalculation choice |

## 6. Security and privacy

No recipe, chemical quantity, cost, supplier offer, inventory value or share payload enters analytics. Share links are non-secret and must contain no personal data. APIs enforce payload limits and reject prototype-pollution/unknown executable content. Exports escape user text. Optional account records are scoped by server-derived user ID with IDOR tests.

## 7. Testing architecture

For each tool:
1. pure engine golden/edge vectors;
2. schema and property invariants;
3. API/engine parity;
4. component interaction and accessibility;
5. Playwright complete loop, errors, local restore, share/export and context handoff;
6. desktop/mobile screenshots and computed-style checks;
7. deployed route verification.

The final verifier runs typecheck, lint, unit/integration, production build, E2E, accessibility, route/sitemap, secret scan and chemistry gate assertions. Unit success does not prove a tool is built.

## 8. Release topology

Non-chemistry tools may deploy independently after their slices pass. Chemistry code may be built and exercised with synthetic fixtures while public production behavior remains OFF. Gate_A is product-level and remains pending until independent deployed verification records `RELEASE_ACCEPTED`.