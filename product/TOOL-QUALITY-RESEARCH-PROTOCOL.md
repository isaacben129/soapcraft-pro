# SoapCraft Pro — Tool Quality Research and Evidence Protocol

**Status:** Approved operating protocol; research in progress  
**Date:** 2026-09-09  
**Governs:** Every calculator, planner, conversion tool, reference dataset and connected workflow

## 1. Purpose

SoapCraft Pro is not allowed to create a tool from a feature name and generic model knowledge. Each tool must be derived from:

1. the real user decision it supports;
2. direct inspection of the strongest current tools in that category;
3. explicit deterministic formulas and data sources;
4. observed workflow gaps, error states and handoffs;
5. independently reproducible acceptance fixtures.

The goal is not feature-count parity. The goal is a tool that is at least as capable as the strongest relevant specialist for its core job, is easier to understand and use, exposes its assumptions, and transfers context cleanly into the rest of SoapCraft Pro.

## 2. Evidence hierarchy

Every matrix claim must carry one of these evidence grades.

| Grade | Evidence | Permitted use |
|---|---|---|
| `O1` | Tool directly operated and result/output inspected | May define behavior and acceptance requirements |
| `O2` | Live interface directly inspected, but a full calculation was not completed | May define input, navigation and presentation requirements; not formula correctness |
| `D1` | First-party product or standards documentation | May define documented capability, category or standard |
| `S1` | Primary scientific, standards or regulatory source | May define formula/data/safety requirements within the source's actual scope |
| `C1` | Competitor's own assertion about its tests, data or accuracy | May create an investigation item only; cannot establish correctness |
| `U1` | Search snippet, third-party review, forum post or delegated research lead | Discovery only; must be verified before becoming a requirement |

Rules:

- Search snippets never establish feature behavior.
- A competitor agreeing with another competitor is not independent validation if both use the same dataset.
- A visible disclaimer does not compensate for incorrect math.
- A model recommendation is not a chemistry, safety, legal or accounting source.
- Pricing and feature claims must include an observed date because they change.
- Unsupported precision must not be copied from a competitor.

## 3. Required market row for every tool

A tool cannot enter the Forge build ledger until its row contains:

1. **User decision:** the concrete question answered.
2. **Inputs:** required, optional, units, defaults and dependencies.
3. **Outputs:** primary answer, secondary explanation and export/share behavior.
4. **Strongest comparators:** at least three when the market contains three credible tools.
5. **Direct observations:** what was actually operated or read.
6. **Must match:** table-stakes behavior whose absence would make SoapCraft Pro inferior.
7. **Must improve:** observed friction, ambiguity or missing state.
8. **Connected advantage:** context accepted from and passed to adjacent SoapCraft Pro tools.
9. **Formula/data sources:** authoritative basis, revision and allowed variability.
10. **Edge cases:** zero, negative, extreme, conflicting, incomplete and unit-conversion states.
11. **Failure behavior:** invalid input, unavailable storage, stale link and incompatible context.
12. **Reference fixtures:** independently calculated examples with expected results and tolerance.
13. **Safety/claims boundary:** what the result does and does not establish.
14. **Accessibility/mobile:** keyboard, labels, touch targets, focus, errors and responsive behavior.
15. **Evidence grade:** claim-by-claim, not one grade for the entire competitor.

## 4. Formula and dataset quality gate

Any consequential calculator must have these artifacts before implementation:

- symbol glossary;
- dimensional/unit analysis;
- canonical formula specification;
- rounding and display policy separate from internal precision;
- source manifest with retrieval date and revision;
- assumptions and user-overridable parameters;
- golden fixtures calculated independently of production code;
- property tests or invariants;
- cross-tool consistency tests;
- metric/imperial round-trip tests;
- mutation or adversarial tests for high-risk branches;
- provenance visible from the product;
- version identifier included in share/export output.

Chemistry additionally requires:

- NaOH, KOH and mixed-alkali branches specified independently;
- hydroxide purity handled explicitly rather than hidden in a default;
- superfat/lye-discount terminology and operation defined;
- all water conventions converted through one canonical representation;
- oil SAP basis and NaOH/KOH conversion documented;
- fatty-acid and property calculations distinguished from skin or performance guarantees;
- fragrance limits entered from the certificate for the specific fragrance, not inferred from an oil database;
- unresolved high-severity discrepancies to block public release.

## 5. Usability quality gate

Each tool must be tested as a complete decision surface, not merely as a form that returns a number.

Required checks:

- useful default or worked example without fabricating user data;
- plain-language label plus formula term where useful;
- context-sensitive help at the point of uncertainty;
- results update model is obvious and predictable;
- input remains available after errors;
- result distinguishes estimate, assumption and known value;
- 'show the math' substitutes the user's actual values;
- copy/share/print/export produces a real usable artifact;
- anonymous session can pass compatible context to the next tool;
- account invitation appears only for persistence/sync/history;
- complete result is never hidden by email capture;
- mobile use is possible one-handed where practical;
- critical warnings are not conveyed by color alone;
- keyboard and screen-reader semantics pass automated and manual checks.

## 6. Verified market baseline — first direct pass

This section records only observations independently checked in the live interface or first-party documentation. It is not yet the complete market matrix.

### 6.1 SoapCalc — live calculator

**Source:** <https://soapcalc.net/calculator>  
**Observed:** 2026-09-09  
**Evidence:** `O2`

Directly observed controls and outputs:

- NaOH or KOH selection;
- optional 90% KOH setting;
- oil weight in pounds, ounces or grams;
- water as percent of oils, lye concentration, or water-to-lye ratio;
- superfat;
- fragrance in ounces per pound;
- large oil/fat/wax selector;
- per-oil (`One`) and full-blend (`All`) property columns;
- hardness, cleansing, conditioning, bubbly, creamy, iodine and INS;
- blend fatty-acid totals for lauric, myristic, palmitic, stearic, ricinoleic, oleic, linoleic and linolenic acids.

Correction to preliminary research: the current live SoapCalc interface does expose full-blend property totals. Any claim that it only shows per-oil profiles is rejected.

Still to operate and verify:

- complete result sheet;
- exact custom-oil behavior;
- print/share persistence;
- rounding and unit behavior;
- mixed-alkali support or absence;
- mobile completion friction;
- exact oil count and data provenance.

### 6.2 Soapmaking Friend — live recipe builder

**Source:** <https://www.soapmakingfriend.com/soap-making-recipe-builder-lye-calculator/>  
**Observed:** 2026-09-09  
**Evidence:** `O2`

Directly observed controls and product surfaces:

- solid NaOH soap, liquid KOH soap, hybrid NaOH/KOH soap and non-soap product modes;
- editable NaOH purity, visibly defaulted to 99%;
- masterbatch lye option;
- percentage, gram, kilogram, pound and ounce recipe entry;
- mold-resize option;
- liquid-to-lye ratio, lye concentration, or liquid as percent of oils;
- superfat and post-cook superfat mode;
- searchable oil library;
- public recipe setting and load/clear flow;
- adjacent Recipes, Batches and Inventory product modules;
- account and premium propositions that are separate from opening the calculator.

The displayed 'recommended' defaults are competitor choices, not authoritative requirements. They require independent source review before SoapCraft Pro chooses any default.

Still to operate and verify:

- hybrid-lye ratio controls and output;
- full results and property model;
- additive and fragrance handling;
- saved-recipe/version flow;
- batch and inventory handoffs;
- free/premium limits;
- mobile and error behavior.

### 6.3 SoapmakingToolbox — live public tools

**Sources:**  
- <https://soapmakingtoolbox.com/recipe-builder>  
- <https://soapmakingtoolbox.com/about>  
- live calculator links exposed by the site

**Observed:** 2026-09-09  
**Evidence:** interface behavior `O2`; its data/test/accuracy statements `C1`

Directly observed product design:

- one-screen recipe builder connecting oils, lye, water, fragrance, cost per bar, mold sizing and property bars;
- recipe state encoded in the URL for sharing/bookmarking;
- local-device save and print without email or signup;
- oil percentages with a 'make it 100%' operation and starting recipe presets;
- NaOH, KOH and dual-lye modes;
- editable hydroxide purity;
- lye concentration, water-to-lye ratio and percent-of-oils conventions;
- explicit 'show the math' area;
- source/provenance links;
- visible distinction between relative property indices and skin claims;
- live links for lye, mold volume, batch resizing, lye concentration, superfat, fragrance load, liquid soap, dual lye, masterbatch lye, essential-oil blending, cost/pricing and bar-count tools.

The site states that it has 94 oils, published ranges for 39, 140+ automated checks and a dozen SoapCalc reference recipes. Those are useful competitor assertions but remain `C1` until independently reproducible.

Important competitive implication: public access, URL-carried state, transparent math, local save and print are no longer differentiators by themselves. SoapCraft Pro must execute them at least as well and win through broader verified coverage, clearer workflows and cross-category context transfer.

### 6.4 IFRA category for bar soap

**Official source:** IFRA, *Guidance for the use of the IFRA Standards*, 51st Amendment, 3 July 2023  
**Landing page:** <https://ifrafragrance.org/initiatives-positions/safe-use-fragrance-science/ifra-standards/ifra-standards-documentation>  
**PDF retrieved:** 2026-09-09  
**Evidence:** `D1`

The official guidance explicitly places **bar soap in Category 9**, described as products with body and hand exposure that are primarily rinse-off. The product-type table also lists liquid soap in Category 9.

Product requirement consequence:

- SoapCraft Pro may identify the applicable product category.
- It must not invent a universal safe fragrance percentage.
- A fragrance calculator should ask for the Category 9 limit from the certificate supplied for the user's specific fragrance and calculate against that entered value.
- Certificate amendment/version and whether the percentage basis is understood must remain visible.

## 7. Preliminary claims rejected or quarantined

The following may not enter requirements without stronger evidence:

- a universal safe or recommended superfat range;
- a universal safe lye concentration range;
- a single default hydroxide purity presented as chemically authoritative;
- treatment of SoapCalc and Soapmaking Friend oil tables as independent source validation;
- claims that a competitor is accurate because its marketing page says it has tests;
- generic 'IFRA percentage' logic not tied to the specific fragrance certificate and product category;
- default craft-fair sell-through, waste, labor, wholesale discount or margin values presented as industry facts;
- accounting formulas copied without defining whether the target is markup, margin or contribution;
- inventory or compliance claims inferred from a pricing page rather than directly operated product behavior.

## 8. Remaining direct research queue

### Formulation and chemistry

- Complete reference recipes in SoapCalc, Soapmaking Friend and SoapmakingToolbox.
- Test the same NaOH, KOH and mixed-alkali fixtures across tools.
- Record every input, default, precision choice, warning and result.
- Resolve SAP source licensing/provenance and variation policy from suitable primary literature or supplier-specific values.
- Inspect custom oils, additives, purity, masterbatch and fragrance certificate flows.
- Obtain an independent chemistry/domain review after the formal specification is written.

### Sizing, mold, conversion, cure and production

- Operate mold calculators for rectangular, cylindrical, cavity and irregular molds.
- Identify whether outputs mean oil weight, batter weight or usable capacity.
- Test internal-dimension, headspace, density and unit assumptions.
- Operate recipe resizers and bar-cut planners.
- Inspect real cure trackers and production back-planning workflows, including reminders and timezone/date edge cases.

### Cost, price, market, wholesale, purchasing and inventory

- Operate SoapmakingToolbox, Soapmaking Friend, Craftybase/Stocksmith and HSCG calculators with one shared fixture.
- Separate material cost, landed unit cost, labor, overhead, fees, waste, saleable yield, contribution, markup and gross margin.
- Inspect craft-fair, wholesale/MOQ, purchasing and stock-depletion workflows directly.
- Verify current account boundaries and pricing from first-party pages.
- Mine user complaints and spreadsheet workarounds as qualitative evidence, not formula authority.

## 9. Completion condition

The research phase is complete only when:

- every approved tool has a populated market row;
- every consequential formula has a source and independent fixture;
- every strongest comparator has been directly operated or explicitly marked inaccessible;
- no `U1` or `C1` claim is carrying a safety-critical or acceptance requirement;
- market parity, improvement and connected advantage are explicit per tool;
- an independent critic has attempted to falsify the matrix;
- unresolved safety/source questions are presented to the user before implementation.
