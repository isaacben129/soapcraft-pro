# SoapCraft Pro Product Brief

**Version:** 3.0 — aligned to rescue PRD
**Authoritative detail:** `product/PRD.md`

## One-line product

SoapCraft Pro is a private recipe-to-profitability operating system that keeps a soap formulation, its real production batches, cure evidence, final yield, and cost per bar in one traceable record.

## Problem

Serious soapmakers repeatedly re-enter the same information across lye calculators, spreadsheets, notes, timers, cure logs, and pricing sheets. The fragmentation destroys provenance:

- a batch is not tied to the exact recipe version used
- planned and actual measurements drift apart
- Making Mode state disappears
- cure notes have no durable relationship to the batch
- final yield and cost use manually reconstructed inputs
- lessons from prior batches do not inform the next version

A bundle of standalone tools does not solve this. The product must preserve the handoffs.

## Product model

```text
Recipe
  → immutable Recipe Version
  → Batch
  → Making Record
  → Cure Observations
  → Final Yield
  → Cost Record
  → next Recipe Version
```

The Batch is the central operational object. Cure and costing are contextual batch views plus cross-batch portfolio summaries.

## Core promise

A user can start from an authoritative saved formulation and complete a real batch record through curing and cost per bar without manually rebuilding context.

## Product rule

Deterministic calculation is authoritative. AI is deferred from the rescue MVP and may later explain deterministic output; it may never invent chemical quantities.

## Users

### Serious hobbyist

Wants repeatability, version history, and evidence from previous batches.

### Micro-business soapmaker

Needs actual yield, cost basis, cost per sellable unit, and target-margin pricing.

### Careful beginner

Needs a clear first workflow and strong, honest safety boundaries.

## Goal metrics

### Primary

Connected batch completion rate:

```text
batch started → making completed → cure marked ready → yield finalized → cost complete
```

### Activation

First verified recipe save rate.

### Guardrails

- zero cross-user data access
- zero silent save failures
- zero AI-generated quantities
- zero false public capability claims
- all calculation fixtures green
- historical batch/version linkage preserved

## Rescue MVP

1. Auth and private ownership
2. Verified deterministic formulation contract
3. Recipe save and immutable versioning
4. Batch creation from exact recipe version
5. Persistent Making Mode
6. Cure observations and user-controlled readiness
7. Ingredient cost records, final yield, and cost per bar
8. Operational dashboard
9. Recipe, batch, cure, and cost portfolio views
10. Marketing homepage with real workflow proof and integrated blog content
11. Settings needed for profile, units, data, safety, and billing
12. Dodo billing after the core lifecycle works

## Explicitly deferred

- AI formulation assistant
- generated recipe percentages
- community/social features
- public ratings/comments
- community-data predictions
- inventory management
- marketplace comparison
- ecommerce integrations
- native mobile app
- automatic cure/safety declaration

## Required dashboard

The dashboard is not a grid of links to tools. It shows:

1. Needs attention queue
2. Active production pipeline
3. Recent recipes and outcomes
4. Activity ledger
5. One New command

Every row shows object lineage, status/evidence, and one next action.

## Required marketing homepage

1. Proof-led hero
2. Composite recipe → batch → cure → cost record
3. Calculation trust and warning example
4. Planned-vs-actual example
5. Featured article plus three latest posts
6. Category links
7. Pricing after value proof
8. Safety/legal footer

Public copy must describe only live, demonstrable behavior.

## Design direction

**Chemist’s production ledger**:

- dark umber/charcoal app rail
- warm mineral-paper workspace
- ruled rows, tables, timelines, and plan-vs-actual comparisons
- clay calculation surfaces, sage cure surfaces, brass cost surfaces
- white reserved for focused editing/dialogs
- DM Sans application UI
- JetBrains Mono/tabular numerals for measurements, batch IDs, timers, and currency
- 2–4px radii
- Lucide icons plus a real brand mark

Banned:

- primary dashboard tool cards
- equal icon/heading/text feature grids
- white page plus white cards everywhere
- emoji branding
- universal `rounded-lg`
- hero KPI tiles
- unverified semantic color utilities
- generic “AI-powered” language

## Trust and safety boundaries

- Formulation quantities come from one versioned deterministic engine.
- Ingredient/SAP sources are cited and revisioned.
- Unsupported lye/water modes are not simulated.
- Blocking validation prevents save/start-batch.
- Every batch retains the exact recipe-version snapshot.
- Cure readiness is an explicit user decision.
- Missing cost basis remains visible; it never silently becomes zero.

## Technology constraints

Current stack remains Next.js, React, TypeScript, Tailwind v4, Drizzle/PostgreSQL, NextAuth, and Dodo Payments unless a separate technical decision changes it.

Implementation requirements:

- route/server boundaries enforce session and ownership
- migrations committed and tested
- test mode uses the production schema
- Tailwind v4 semantic colors verified through computed styles
- deterministic quantity calculation has no network/AI dependency
- Dodo entitlement changes come from verified idempotent webhooks

## Release definition

The MVP is not done until a clean user can:

```text
sign up
→ save verified recipe v1
→ start batch from v1
→ resume Making Mode after reload
→ complete into cure
→ log observation
→ mark ready
→ finalize yield
→ save cost per bar and target-margin price
→ see the full record on dashboard/detail
```

A second user must be unable to access any of those records by guessing URLs or IDs.

## Open decisions

- authoritative SAP/property sources
- first-release lye types and water modes
- free/trial/paid limits and trial policy
- labor/overhead inclusion in rescue costing
- default cure observation cadence
- verified launch templates
- owned homepage/blog imagery

Do not let these decisions block shell separation, ownership, recipe/batch persistence, or dashboard design.
