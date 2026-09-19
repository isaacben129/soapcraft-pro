# SoapCraft Pro — End-to-End Flows

**Version:** 3.0.0
**Companion:** `PRD.md`, `PUBLIC-TOOL-CONTRACT.md`, `ARCHITECTURE.md`

## Flow contract

All core flows are public and anonymous. A core result must never be hidden behind account, email, payment or cookie consent. Local persistence and share/export are part of each tool’s completion boundary.

## F-01 — Formulate to connected plan

**Precondition:** public chemistry gate is open for the selected verified ingredients.
**Journey:** open `/tools/formulation` → enter oils and explicit target mass → choose alkali, purity, superfat and one water mode → calculate → inspect math/sources/warnings → save locally or export/share → choose mold, costing, ready-by or purchasing → review inherited values → continue.
**Failure branch:** while the chemistry gate is closed, the full form and methodology may be visible but calculate returns a truthful typed unavailable state; no estimated result. Invalid or unverified ingredients preserve input and name the blocker.
**Outcome:** versioned formulation context is carried to the next tool without re-entry.

## F-02 — Mold to recipe scale

Open `/tools/mold-volume` → select shape or measured volume → enter internal dimensions/fill → choose calibrated mode with prior mass/volume or planning-range mode → calculate → inspect volume, assumptions and capacity result → continue to recipe scaling → review inherited target → recalculate recipe. A planning range cannot silently become a precise target.

## F-03 — Scale to cost

Open `/tools/recipe-scaling` with manual or inherited recipe → choose proportional-copy or formulation-recalculation mode → enter target → calculate → inspect scale factor and line amounts → continue to batch cost → add/review cost basis → receive complete or explicitly incomplete economics.

## F-04 — Cost to wholesale

Open `/tools/batch-cost` → import or enter quantities → enter ingredient, packaging, labor and overhead costs → enter made and excluded units → calculate → inspect cost per made and saleable unit → continue to wholesale pricing → choose markup or gross-margin target → add fees and MOQ → calculate → print/export quote. Missing cost basis follows the user and prevents a recommended-price presentation.

## F-05 — Price to event plan

Open `/tools/craft-fair-break-even` manually or from pricing context → enter event costs and one or more products with price, variable cost, mix, stock and sell-through → enter target profit → calculate weighted contribution, break-even, target units and stock plan → adjust assumptions → export. Zero fixed costs is valid; non-positive contribution blocks.

## F-06 — Ready-by to purchase plan

Open `/tools/ready-by-planner` with saleable-yield context or manual values → enter ready-by date, cure interval, buffers, capacity and blackout days → calculate production dates and batches → inspect feasibility → continue to ingredient purchase planner → aggregate formulation needs across planned batches → subtract usable stock → round to packs → compare supplier landed cost → export purchase list.

## F-07 — Direct entry into any tool

A visitor may land directly from search or a shared URL. The page identifies the decision it answers, loads empty/example/shared state truthfully, validates inputs, produces the complete result, provides methodology and offers only compatible next tools. No earlier tool is mandatory when all required inputs are supplied manually.

## F-08 — Share and re-entry

After any result, create a versioned share URL. Open it in a clean browser → decode and validate state → show source tool, revision and inherited values → allow edits → recompute. Personal data is absent. Oversized state offers a downloadable context file instead. Corrupt/incompatible state produces an informative empty state and preserves the URL for support without executing untrusted data.

## F-09 — Local restore and reset

Complete any tool → save locally → reload → restore editable inputs and recompute with version notice → reset → confirm destructive local reset → return to clean state. Save failure preserves all inputs and exposes retry/export.

## F-10 — Tool discovery and trust

Homepage → `/tools` → see exactly eight tools with purpose, required inputs, connected next step and truthful availability → open methodology/source revision → open tool. Navigation, sitemap, metadata and comparison copy do not advertise retired or gated behavior as working.

## F-11 — Editable example and template

Open a worked example → see `Example` label, source assumptions and expected result → edit an input → deterministic result changes → open the same tool with context. Downloadable templates contain usable content and require no email.

## F-12 — Error recovery

For validation, API, local-save, share-decode or calculation failure: preserve user input; identify the failing field or operation; show actionable recovery; do not display stale output as current; allow retry/reset/export where safe. A correlation ID is used only for server failures.

## Persistent outcomes

Anonymous browser state contains versioned non-personal tool context. Share URLs/context files are portable. No server persistence or save claim occurs unless the user later opts into an account flow. Aggregate analytics records event names and route/revision only, never recipe, cost, supplier or personal values.

## Required high-boundary proof

Each flow has at least one Playwright/browser test. F-01 additionally needs deployed fail-closed and release-enabled evidence. F-03 through F-06 require API/UI result parity. F-08 must run in a clean browser context. F-10 requires deployed route, navigation and sitemap checks at mobile and desktop widths.