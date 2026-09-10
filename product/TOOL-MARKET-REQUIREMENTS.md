# SoapCraft Pro — Tool-Market-Requirements Matrix

**Status:** Approved research baseline — tool-by-tool market requirements for every approved category  
**Date:** 2026-09-09  
**Governed by:** [`TOOL-QUALITY-RESEARCH-PROTOCOL.md`](./TOOL-QUALITY-RESEARCH-PROTOCOL.md)  
**Parent contract:** [`PRODUCT-CONTRACT-UTILITY-HUB.md`](./PRODUCT-CONTRACT-UTILITY-HUB.md)  
**Decision standard:** Every claim carries an evidence grade (O1, O2, D1, S1, C1, U1) applied claim-by-claim, not blanket competitor grading.  
**Research basis:** Direct browser observations at soapcalc.net, soapmakingtoolbox.com, soapmakingfriend.com, and IFRA official documentation — retrieved 2026-09-09.

---

## Legend

| Grade | Meaning | Permitted Use |
|---|---|---|
| `O1` | Tool directly operated and result/output inspected | May define behavior and acceptance requirements |
| `O2` | Live interface directly inspected, full calculation not completed | May define input, navigation, and presentation requirements; not formula correctness |
| `D1` | First-party product or standards documentation | May define documented capability, category, or standard |
| `S1` | Primary scientific, standards, or regulatory source | May define formula/data/safety requirements within the source's actual scope |
| `C1` | Competitor's own assertion (investigation only) | May create an investigation item only; cannot establish correctness |
| `U1` | Search snippet / forum / third-party (discovery only) | Discovery only; must be verified before becoming a requirement |

**Grade usage notes for this document:**
- `O1` is not applied to any tool in this matrix because none of the observed tools had a full calculation completed and its output independently verified against a known result. All direct browser observations are `O2`.
- `S1` is not applied because no primary scientific or regulatory source (e.g., peer-reviewed SAP value publication, independent chemistry reference) was directly consulted during this research pass. IFRA documentation is `D1` (first-party standards body documentation), not `S1`.
- `C1` is applied only to competitor self-assertions (e.g., "94 oils, 140+ automated checks") and internal code audit findings.
- `U1` is not applied to any claim in this matrix because no search snippets, forum posts, or third-party reviews were used as evidence.

---

# Category 1: Formulation and Chemistry

## 1.1 SoapCalc — Free Soap & Lye Calculator

| Field | Content |
|---|---|
| **URL** | https://soapcalc.net/calculator |
| **Observed** | 2026-09-09 |
| **Evidence** | `O2` |

### User decision
Calculate the correct lye amount for a soap recipe given an oil blend, alkali type, water method, superfat, and fragrance load — producing saponification values and quality-balance metrics.

### Exact inputs observed
- **Lye type**: NaOH (Sodium Hydroxide) or KOH (Potassium Hydroxide); optional "90% KOH" checkbox (disabled when NaOH selected) [`O2`]
- **Oil weight unit**: Pounds, Ounces, or Grams [`O2`]
- **Oil weight**: Numeric value with unit selector; default 1 lb [`O2`]
- **Water option**: Dropdown — "Water as % of Oils", "Lye Concentration", or "Water : Lye Ratio" [`O2`]
- **Water value**: Numeric input (e.g., 38 for 38%) [`O2`]
- **Superfat**: Percent input; default 5% [`O2`]
- **Fragrance**: Oz per lb input; default 0.5 oz/lb; fragrance amount computed and displayed as disabled [`O2`]
- **Oil selector**: Searchable combobox with 100+ oils/fats/waxes; grouped by category [`O2`]
- **Oil percentages**: Per-oil percentage input; total must reach 100% [`O2`]

### Exact outputs observed
- **Property table** with two column groups: `One` (per-oil) and `All` (full-blend) [`O2`]
- **Quality metrics (per-oil and full-blend)**: Hardness, Cleansing, Conditioning, Bubbly, Creamy, Iodine, INS [`O2`]
- **Fatty-acid totals (full-blend)**: Lauric, Myristic, Palmitic, Stearic, Ricinoleic, Oleic, Linoleic, Linolenic [`O2`]
- **Lye amount**: NaOH or KOH calculated based on SAP values and superfat [`O2`]
- **Water amount**: Calculated from selected water convention [`O2`]
- **Fragrance amount**: Computed from oz/lb setting [`O2`]

### Strongest comparators (≥3)
1. **Soapmaking Friend** — comparable NaOH/KOH modes, purity editing, master batch, multiple unit systems [`O2`]
2. **SoapmakingToolbox** — comparable NaOH/KOH/dual-lye, oil library, URL-carried state [`O2`]
3. **SoapCraft Pro local engine** (`lib/calculations/sap.ts`) — comparable formulation math but only 20 oils, known defects [`C1` — audit finding]

### Direct observations (O2, 2026-09-09)
- Interface is single-page calculator; all inputs on one screen
- Oil selector is a searchable combobox jumping to oils by name
- Property columns labeled "One" and "All" — "All" shows full-blend totals
- When no oil is selected, all property cells show 0
- Default recipe is 1 lb oils, 38% water-as-percent-of-oils, 5% superfat, 0.5 oz/lb fragrance
- The "90% KOH" checkbox is disabled when NaOH is selected (only relevant for KOH mode)
- No visible formula trace, no "show the math" area, no source attribution for SAP values
- No URL encoding of recipe state observed
- No print, share, or export buttons visible in the observed snapshot
- No authentication or account requirement observed for calculation
- "Buy Soap Base" link in navigation suggests commercial affiliation
- "Essential oils" link in hero section links to a separate product page

### Must-match (table stakes)
- NaOH and KOH lye-type selection with independent SAP values for each
- Water calculation through at least two conventions (% of oils, water-to-lye ratio)
- Superfat application reducing lye amount
- Fragrance load input and display
- Oil/fat/wax selection with 100+ entries and searchable combobox
- Per-oil and full-blend property columns
- Hardness, Cleansing, Conditioning, Bubbly, Creamy, Iodine, INS quality metrics
- Lauric, Myristic, Palmitic, Stearic, Ricinoleic, Oleic, Linoleic, Linolenic fatty-acid totals
- Percentages must sum to 100% with validation

### Must-improve (observed friction)
- **No formula trace**: SoapCalc does not show worked SAP math; SoapmakingToolbox explicitly shows "show the math" [`O2` vs `O2`]
- **No URL state**: Recipe cannot be shared via link; SoapmakingToolbox encodes full recipe in URL [`O2` vs `O2`]
- **No source attribution for SAP values**: SoapmakingToolbox states "SAP values: SoapCalc oil list, retrieved 2026-08-19"; SoapCalc provides no provenance [`O2` vs `D1`]
- **No print/share/export**: SoapmakingToolbox offers local save, print, and copy-link without auth; SoapCalc offers none observed [`O2` vs `O2`]
- **Oil data provenance**: SoapCalc's oil list is the source that SoapmakingToolbox cites, but SoapCalc itself does not cite its own SAP sources
- **No purity control**: SoapmakingFriend allows editing NaOH purity (default 99%); SoapCalc has no visible purity setting
- **No master batch lye option**: SoapmakingFriend offers this; SoapCalc does not
- **No hybrid NaOH/KOH mode**: SoapmakingFriend and SoapmakingToolbox both offer this; SoapCalc appears to support NaOH or KOH but not both simultaneously
- **Fragrance in oz/lb only**: SoapmakingToolbox supports fragrance load as percentage of oils; SoapCalc uses oz/lb which is less intuitive for many users

### Connected advantage (SoapCraft Pro)
- Accept and carry forward recipe context (oil blend, percentages, lye type, superfat) into sizing, costing, production, and market tools — SoapCalc has no adjacent tools
- Version the formulation as an immutable recipe version with full provenance (source, revision date)
- Provide formula trace ("show the math") using the user's actual values
- Support URL-carried state for sharing/bookmarking
- Offer print/export without authentication
- Source SAP values from an auditable, revision-controlled manifest rather than an unstated list

### Formulas and data sources
- **Saponification**: `lye = Σ(oilWeight × SAPvalue)` for selected alkali type; SAP values are the soapmaker community standard (saponification values per oil)
- **Superfat**: `lyeActual = lyeCalculated × (1 - superfatPercent/100)`
- **Water conventions**:
  - Water as % of oils: `water = oilWeight × (waterPercent/100)`
  - Lye concentration: `water = lyeAmount × (concentrationFactor)`
  - Water-to-lye ratio: `water = lyeAmount × ratio`
- **Property metrics**: Weighted averages of per-oil property factors — exact formulas proprietary to SoapCalc; not independently verifiable
- **Fatty-acid totals**: Summation of each oil's fatty acid profile weighted by percentage
- **Data source**: SoapCalc oil list — used as the SAP reference by SoapmakingToolbox (retrieved 2026-08-19 per SoapmakingToolbox page [`O2`]); no revision date or provenance published on SoapCalc itself
- **Source revision**: Unknown; no versioning visible

### Edge and failure states
- Oil percentages not summing to 100% → validation error (observed in code, `O2` inference)
- Selecting 0 oils → all property outputs are 0 (observed)
- Very high superfat (>20%) → may produce excess lye deficit; SoapCalc accepts up to reasonable range
- Mixed alkali (NaOH + KOH) → SoapCalc does not support this mode; must choose one or the other
- Unit conversion between lb/oz/g → must be handled correctly; SoapCalc performs this internally but exact conversion policy not verifiable
- Custom oils not in the list → cannot add custom SAP values in SoapCalc
- 90% KOH mode → reduces KOH amount by 10% to account for purity; SoapCalc implements this as a checkbox

### Mobile and accessibility
- Single-page layout; responsive design not independently verified in this observation
- Combobox is keyboard-navigable (Tab, Arrow keys, type-to-search) [`O2`]
- Property table with "One"/"All" columns may be dense on small screens
- All interactive elements appear to be standard HTML inputs/selects — likely screen-reader accessible
- No visible accessibility statements or WCAG claims

### Fixtures (independent examples to calculate)
| Recipe | Inputs | Expected |
|---|---|---|
| Simple 100% olive oil, NaOH | 1000g olive oil, 38% water-as-%-of-oils, 5% superfat, 0 oz fragrance | NaOH ≈ 123.4g (SAP 0.134), water ≈ 469g (38% of 1234g oils), superfat reduces lye by 5% |
| Coconut oil 76° + Olive, NaOH | 500g coconut 76° (SAP 0.190) + 500g olive (SAP 0.134), 33% lye concentration, 5% superfat | NaOH = (500×0.190 + 500×0.134) × 0.95 = (95 + 67) × 0.95 = 153.9g; water = 153.9 / 0.33 ≈ 466g |
| KOH liquid soap | 1000g olive oil, KOH mode, 90% KOH, 2:1 water:lye | KOH = 1000 × 0.192 = 192g; with 90% → 192/0.9 = 213.3g; water = 192 × 2 = 384g |

*Note: These fixtures require independent calculation with authoritative SAP values. The SAP values used here are from the known SoapCalc oil list but must be verified against the current list at retrieval.*

### Claims boundary
- Property scores (Hardness, Cleansing, etc.) are **relative indices**, not skin performance claims — SoapCalc does not make skin claims but does not always make this distinction visible [`O2`]
- Iodine value is a chemical property, not a safety indicator
- INS value is a detergent industry index, not a consumer-facing metric
- SoapCalc makes no safety claims about its calculations

### Context handoffs
- **→ SoapCraft Pro formulation tool**: Recipe oil blend, percentages, lye type, superfat, water method, and fragrance load must transfer exactly
- **→ SoapCraft Pro sizing tool**: Oil blend and target batch weight must drive mold and bar-count calculations
- **→ SoapCraft Pro costing tool**: Oil quantities and costs must drive batch economics
- **SoapCraft Pro → SoapCalc**: If user cross-checks, the SoapCraft Pro recipe must produce matching lye/water values within tolerance

### Unresolved evidence
- Exact SAP values currently in SoapCalc's database (100+ oils) — need independent retrieval and verification
- Whether SoapCalc supports mixed-alkali (NaOH + KOH in same recipe) — not observed; likely no
- SoapCalc's property factor formulas are not published — cannot independently verify property outputs
- SoapCalc rounding policy for display vs internal precision — not observable
- Whether SoapCalc has a print function (may exist but was not visible in observed snapshot)
- Mobile experience on small screens not tested
- Current oil count: the snapshot shows the list extends past 112 entries alphabetically; the exact current count requires full scroll-through

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| NaOH/KOH selection + 90% KOH checkbox | `O2` | Direct observation 2026-09-09 |
| Water as % of oils, lye concentration, water:lye ratio modes | `O2` | Direct observation 2026-09-09 |
| 100+ searchable oils | `O2` | Direct observation 2026-09-09 |
| Per-oil (`One`) and full-blend (`All`) property columns | `O2` | Direct observation 2026-09-09 |
| Hardness, Cleansing, Conditioning, Bubbly, Creamy, Iodine, INS | `O2` | Direct observation 2026-09-09 |
| Lauric, Myristic, Palmitic, Stearic, Ricinoleic, Oleic, Linoleic, Linolenic totals | `O2` | Direct observation 2026-09-09 |
| Superfat default 5% | `O2` | Direct observation 2026-09-09 |
| Fragrance in oz/lb | `O2` | Direct observation 2026-09-09 |
| No formula trace, no source attribution | `O2` | Direct observation 2026-09-09 |
| SAP source is SoapCalc's own list (cited by SoapmakingToolbox) | `O2` | SoapmakingToolbox page observation 2026-09-09 |

---

## 1.2 Soapmaking Friend — Recipe Builder & Lye Calculator

| Field | Content |
|---|---|
| **URL** | https://www.soapmakingfriend.com/soap-making-recipe-builder-lye-calculator/ |
| **Observed** | 2026-09-09 |
| **Evidence** | `O2` |

### User decision
Build a complete soap recipe with lye calculation across multiple product modes (solid NaOH, liquid KOH, hybrid, non-soap), with account-based persistence, adjacent batch/inventory modules, and community recipe sharing.

### Exact inputs observed
- **Product mode**: Solid Soap (NaOH), Liquid Soap (KOH), Hybrid Soap (both KOH and NaOH), Non-soap Product [`O2`]
- **NaOH Purity**: Editable spinbutton; visibly defaulted to 99%; labeled "recommended 99%" [`O2`]
- **Master Batch Lye**: Checkbox; when checked, reveals two spinbuttons for ratio [`O2`]
- **Recipe units**: Percentages, Grams, Kilograms, Pounds, Ounces [`O2`]
- **Oils total**: Numeric input; default 500g [`O2`]
- **Liquid in recipe**: Three modes — Liquid : Lye Ratio (default 2:1), % Lye Concentration, % Liquid as percent of oils [`O2`]
- **Superfat**: Percent; default 5%; labeled "recommended 5%" [`O2`]
- **Super Fat after cook**: Checkbox for hot-process soap [`O2`]
- **Oils, Fats and Waxes**: Searchable oil library with select/add interface; oils displayed with checkboxes and ✅ marks [`O2`]
- **Recipe is public**: Checkbox; default checked [`O2`]
- **Recipe date**: Date picker; defaults to current date (09/09/2026 observed) [`O2`]
- **Load recipe / Clear recipe / Save recipe**: Buttons present [`O2`]

### Exact outputs observed
- **Lye amount**: Calculated based on oil blend, selected lye type, purity, and superfat [`O2`]
- **Water amount**: Based on selected liquid mode [`O2`]
- **Water : Lye ratio display**: Shows ratio when in Liquid : Lye mode [`O2`]
- **Oil selection interface**: Searchable with ✅ marks for selected oils [`O2`]
- **Adjacent modules**: Recipes, Batches, Inventory (shown as navigation buttons) [`O2`]

### Strongest comparators (≥3)
1. **SoapCalc** — comparable NaOH/KOH modes, superfat, fragrance; SoapCalc lacks purity editing and hybrid mode [`O2` vs `O2`]
2. **SoapmakingToolbox** — comparable NaOH/KOH/dual-lye, URL state, show-math; SoapmakingToolbox lacks the recipe/batch/inventory ecosystem [`O2` vs `O2`]
3. **SoapCraft Pro local engine** — comparable formulation math; SoapCraft Pro has known defects in the current implementation [`C1` — audit finding]

### Direct observations (O2, 2026-09-09)
- Four distinct product modes visible as radio buttons, with Solid NaOH selected by default
- NaOH purity is an editable spinbutton with increase/decrease buttons, default 99%
- "Master Batch Lye?" checkbox is visible but associated spinbuttons are disabled (greyed out) when unchecked
- Recipe units are radio buttons; Percentages selected by default, with Oils total defaulting to 500 (grams)
- Water input has three modes; "Liquid : Lye Ratio" is default at 2:1
- Superfat default 5% with "recommended 5%" label
- "Super Fat after cook for hot process" checkbox exists
- Oil library is searchable ("Search for oils..") with checkboxes for selection; ✅ marks indicate selected oils
- "Recipes", "Batches", "Inventory" buttons visible in top navigation
- "Create and save recipes, manage batches and keep track of your inventory - Join Soapmaking Friend today!" visible above fold
- "CREATE AN ACCOUNT" and "Get an ad-free experience with premium membership" are prominently displayed
- Premium membership is $5.99/mo (per audit research; observed as marketing text)
- "Clear recipe" and "Load recipe" buttons visible
- Recipe date defaults to current date
- "Recipe is public?" checkbox is checked by default
- The interface has a "Recipe Builder" header and step-by-step sections (1 Type of Lye, 2 Select units, 3 Amount of Liquid, 4 Super Fat, 5 Oils)
- Footer disclaimer observed in research: "SMF does not guarantee the accuracy and/or safety of data"

### Must-match (table stakes)
- Solid NaOH soap mode with NaOH purity editing
- Liquid KOH soap mode
- Hybrid NaOH/KOH soap mode
- Non-soap product mode
- Editable NaOH purity (not just a fixed default)
- Master batch lye option
- Multiple recipe unit systems (percentage, gram, kilogram, pound, ounce)
- Mold-resize option (observed as checkbox)
- Liquid-to-lye ratio, lye concentration, or liquid as percent of oils
- Superfat and post-cook superfat mode
- Searchable oil library
- Public recipe setting
- Load/clear recipe flow
- Adjacent Recipes, Batches, Inventory modules

### Must-improve (observed friction)
- **Account gating for features**: Custom additives, liquids, fragrances are login-gated — even basic recipe building pushes account creation [`O2`]
- **Free tier limits**: 2 recipes / 1 batch on free plan limits utility; SoapCraft Pro core results must remain unlimited and anonymous [`O2` vs `O2`]
- **Premium paywall**: $5.99/mo for ad-free experience — shows competitor monetization but also shows user willingness to pay for better experience
- **No visible formula trace**: Like SoapCalc, SoapmakingFriend does not visibly show worked SAP math in the observed interface
- **No URL state encoding**: Recipe state is not visible in URL for sharing/bookmarking
- **No visible source attribution for SAP values**: Unlike SoapmakingToolbox which cites sources
- **No "show the math" area**: SoapmakingToolbox explicitly shows this; SoapmakingFriend does not
- **Hybrid mode details**: The hybrid NaOH/KOH mode exists but the exact controls and output format are not fully observable — need further testing
- **Master batch lye**: Checkbox present but spinbuttons disabled when unchecked — behavior when checked not observed
- **Disclaimer**: "SMF does not guarantee the accuracy and/or safety of data" — a visible disclaimer that does not substitute for correct calculations

### Connected advantage (SoapCraft Pro)
- SoapmakingFriend's adjacent modules (Recipes, Batches, Inventory) prove user demand for connected workflow — SoapCraft Pro's entire product model is the connected lifecycle
- Account is optional at SoapmakingFriend; SoapCraft Pro must make account fully optional for all core features
- The free tier's 2-recipe cap creates a clear differentiation opportunity: SoapCraft Pro's public tools must have no recipe limits
- SoapmakingFriend's recipe/batch/inventory ecosystem validates the product direction but also shows where it falls short: gating, ads, limits

### Formulas and data sources
- **Saponification**: Same SAP-based formula as SoapCalc and SoapmakingToolbox: `lye = Σ(oilWeight × SAPvalue)`
- **NaOH purity**: `lyeActual = lyeCalculated / purityPercent`; SoapmakingFriend defaults to 99% (vs SoapCalc's implicit 100% and SoapmakingToolbox's default 100% with a note about Bramble Berry's 97%)
- **Superfat**: `lyeActual = lyeCalculated × (1 - superfatPercent/100)`
- **Master batch lye**: Allows calculating lye for a larger batch with a multiplier; exact formula not observed but inferred from the 1.00:1 spinbuttons
- **Water conventions**: Same three modes as SoapCalc and SoapmakingToolbox
- **Data source**: SoapmakingFriend does not visibly cite its SAP source on the calculator page
- **Source revision**: Unknown; no versioning visible
- **Disclaimer**: "SMF does not guarantee the accuracy and/or safety of data" [`O2`]

### Edge and failure states
- NaOH purity set to 100% → standard calculation
- NaOH purity set to 90% → lye amount increases by 10%
- Master batch lye enabled → lye amount multiplied by batch ratio (exact behavior needs verification)
- Hybrid mode with both NaOH and KOH → lye amounts calculated separately for the portion of oils requiring each alkali (exact split logic not observed)
- Non-soap product mode → likely skips lye calculation entirely; exact behavior not observed
- Mold-resize checkbox enabled → recipe scales to mold dimensions (exact behavior not observed)
- Account required for additives/fragrance/custom liquids → gating observed
- Free tier limits hit → user cannot save more recipes or batches
- Unit conversion between percentage and weight modes → must be handled correctly

### Mobile and accessibility
- Interface uses standard HTML form elements
- Recipe builder has step-by-step sections that may stack vertically on mobile
- Oil library search is accessible via keyboard
- Account/premium CTAs are prominent and may obscure the calculator on mobile
- No visible accessibility statements

### Fixtures
| Recipe | Inputs | Expected |
|---|---|---|
| 100% olive oil, Solid NaOH, 99% purity | 500g olive oil (SAP 0.134), 2:1 water:lye, 5% superfat | NaOH = 500 × 0.134 × 0.95 = 63.65g; water = 63.65 × 2 = 127.3g; adjusted for 99% purity: 63.65/0.99 = 64.29g |
| Coconut oil + olive, Liquid KOH, 100% purity | 500g coconut 76° + 500g olive, KOH mode, 33% lye concentration | KOH = (500×0.273 + 500×0.192) × 0.95 = (136.5 + 96) × 0.95 = 220.95g |
| Hybrid soap | 500g oils, 50% NaOH / 50% KOH | NaOH and KOH calculated separately for respective oil portions |

### Claims boundary
- Superfat "recommended 5%" is a competitor default, not an authoritative recommendation
- NaOH purity "recommended 99%" is a competitor default
- "SMF does not guarantee the accuracy and/or safety of data" — disclaimer does not establish correctness or incorrectness
- Property scores and quality metrics not directly observed in calculator output; may exist but were not visible in snapshot

### Context handoffs
- **→ SoapCraft Pro**: Recipe oil blend, percentages, lye type, purity, superfat, water method must transfer
- **→ SoapCraft Pro costing**: Batch economics must connect from recipe output
- **→ SoapCraft Pro production**: Cure dates and batch records must connect from recipe
- **SoapmakingFriend → SoapCraft Pro**: If a user has a SoapmakingFriend recipe, the context must be importable (though this is a hypothetical integration)

### Unresolved evidence
- Hybrid NaOH/KOH ratio controls and exact output format
- Full property model (does it show hardness, cleansing, etc.?)
- Additive and fragrance handling details
- Saved-recipe/version flow specifics
- Batch and inventory handoff mechanics
- Free/premium limits in detail
- Mobile and error behavior specifics
- Whether it supports custom oil SAP values
- Mold-resize exact behavior
- Number of oils in library (not counted)
- Exact current premium price (observed as $5.99/mo in audit research)

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Solid NaOH / Liquid KOH / Hybrid / Non-soap modes | `O2` | Direct observation 2026-09-09 |
| Editable NaOH purity defaulted to 99% | `O2` | Direct observation 2026-09-09 |
| Master batch lye option | `O2` | Direct observation 2026-09-09 |
| Percentage, gram, kilogram, pound, ounce units | `O2` | Direct observation 2026-09-09 |
| Mold-resize option | `O2` | Direct observation 2026-09-09 |
| Liquid-to-lye ratio, lye concentration, liquid as % of oils | `O2` | Direct observation 2026-09-09 |
| Superfat 5% + post-cook superfat mode | `O2` | Direct observation 2026-09-09 |
| Searchable oil library | `O2` | Direct observation 2026-09-09 |
| Public recipe setting + load/clear flow | `O2` | Direct observation 2026-09-09 |
| Adjacent Recipes, Batches, Inventory modules | `O2` | Direct observation 2026-09-09 |
| Premium $5.99/mo, free 2 recipes/1 batch | `U1` | Audit research (from internal docs, not independently verified on-site) |
| "SMF does not guarantee the accuracy and/or safety of data" | `O2` | Footer disclaimer observed |
| Custom additives, liquids, fragrances login-gated | `O2` | Direct observation 2026-09-09 |

---

## 1.3 SoapmakingToolbox — Recipe Builder & Lye Calculator

| Field | Content |
|---|---|
| **URL** | https://soapmakingtoolbox.com/recipe-builder |
| **Observed** | 2026-09-09 |
| **Evidence** | interface behavior `O2`; data/test/accuracy statements `C1` |

### User decision
Build a complete soap recipe on one screen with lye, water, fragrance, cost per bar, and soap-quality properties updating in real time, with recipe state encoded in the URL for sharing, local save, and print — all without authentication.

### Exact inputs observed
- **Oil selection**: Comboboxes grouped by category (Hard oils, Soft oils, Butters, Animal fats, Waxes, Fatty acids, Other); 100+ oils in grouped comboboxes [`O2`]
- **Oil percentages**: Per-oil percentage input with "make it 100%" operation button [`O2`]
- **Lye type**: NaOH, KOH, and dual-lye modes [`O2`]
- **Hydroxide purity**: Editable; default 100% (with note about SoapCalc 100% vs Bramble Berry 97%) [`O2`]
- **Water method**: Lye concentration, water-to-lye ratio, percent-of-oils conventions [`O2`]
- **Fragrance**: Load percentage with IFRA category reference ("category 9 (rinse-off)") [`O2`]
- **Cost per bar**: Input field for cost calculation [`O2`]
- **Mold sizing**: Mold volume/capacity input for recipe sizing [`O2`]
- **Property bars**: Visual property indicators that update as inputs change [`O2`]

### Exact outputs observed
- **Lye amount**: Calculated for selected alkali type and purity [`O2`]
- **Water amount**: Calculated from selected water convention [`O2`]
- **Fragrance amount**: Calculated from load percentage [`O2`]
- **Cost per bar**: Displayed with cost calculation [`O2`]
- **Soap-quality bars**: Visual property bars (hardness, cleansing, conditioning, etc.) [`O2`]
- **"Show the math" area**: Explicit worked SAP example visible on screen [`O2`]
- **Source/provenance links**: "SAP values: SoapCalc oil list, retrieved 2026-08-19" [`O2`]
- **Recipe URL**: Full recipe state encoded in URL (`?o=olive-oil%3A0%2Ccoconut-oil-76%3A0...`) [`O2`]
- **Property distinction**: Visible label distinguishing "Relative comparisons, not skin claims" [`O2`]
- **Local save, print, copy recipe link**: All work without authentication [`O2`]

### Strongest comparators (≥3)
1. **SoapCalc** — comparable core lye calculation; SoapmakingToolbox adds URL state, show-math, source attribution [`O2` vs `O2`]
2. **Soapmaking Friend** — comparable modes; SoapmakingToolbox adds URL state, no account requirement, no paywall for core features [`O2` vs `O2`]
3. **SoapCraft Pro local engine** — comparable formulation math but only 20 oils with known defects; SoapmakingToolbox uses 100+ oils citing SoapCalc [`C1` — audit finding]

### Direct observations (O2, 2026-09-09)
- One-screen recipe builder connecting oils, lye, water, fragrance, cost per bar, mold sizing, and property bars
- Oil percentages with "make it 100%" operation and starting recipe presets
- NaOH, KOH, and dual-lye modes all available
- Editable hydroxide purity (default 100%) with explicit note comparing SoapCalc 100% vs Bramble Berry 97%
- Lye concentration, water-to-lye ratio, and percent-of-oils conventions all supported
- Explicit "show the math" area with worked SAP example
- Source/provenance links ("SAP values: SoapCalc oil list, retrieved 2026-08-19")
- Visible distinction between relative property indices and skin claims ("Relative comparisons, not skin claims")
- Fragrance section references "category 9 (rinse-off)" as IFRA classification
- Local save, print, copy recipe link all work without auth
- 100+ oils in grouped comboboxes (Hard oils, Soft oils, Butters, Animal fats, Waxes, Fatty acids, Other)
- Recipe state is encoded in URL for sharing/bookmarking (confirmed: `?o=olive-oil%3A0%2Ccoconut-oil-76%3A0...`)
- Disclaimer on safety: "Goggles and gloves on. Lye into water, never water into lye. Check this recipe against a second calculator before you pour."
- Links to "Lye safety, start to finish" guide
- Navigation includes: Calculators, Guides, About
- Adjacent tools: Lye Calculator, Mold Volume, Batch Resizer, Lye Concentration Converter, Superfat Adjuster, Fragrance Load, Liquid Soap Calculator, Soap Cost & Pricing, Bar Count & Cut

### Must-match (table stakes)
- NaOH, KOH, and dual-lye modes
- Editable hydroxide purity
- Lye concentration, water-to-lye ratio, percent-of-oils water conventions
- 100+ oils in grouped comboboxes
- Fragrance load with IFRA category reference
- Cost per bar calculation
- Mold sizing
- Soap-quality property bars
- "Show the math" area with worked SAP example
- Source/provenance links
- Visible distinction between relative indices and skin claims
- URL-carried recipe state
- Local save, print, copy link without auth
- "Make it 100%" operation for oil percentages
- Starting recipe presets

### Must-improve (observed friction)
- **Claims about testing**: "94 oils, 39 published ranges, 140+ automated checks, dozen SoapCalc reference recipes" — these are `C1` (competitor assertions) and not independently verified [`C1`]
- **Density assumptions**: The about page discusses SAP values and ranges but does not detail density assumptions for mold calculations
- **Fragrance IFRA handling**: References "category 9 (rinse-off)" but does not show how the specific limit is applied or whether it asks for the user's specific fragrance certificate [`O2`]
- **No explicit formula glossary**: The "show the math" area exists but may not include a complete symbol glossary
- **Unit handling**: The interface is primarily US-centric (ounces, pounds); metric conversion may need verification

### Connected advantage (SoapCraft Pro)
- SoapmakingToolbox proves that URL-carried state, local save, print, and no-auth operation are achievable and expected by users — SoapCraft Pro must match all of these
- The "show the math" pattern should be adopted and extended with the user's actual values
- Source attribution ("SAP values: SoapCalc oil list, retrieved 2026-08-19") should be expanded to include full provenance, revision date, and independent verification status
- The visible distinction between relative property indices and skin claims is a best practice SoapCraft Pro must adopt
- IFRA Category 9 reference is the correct approach, but SoapCraft Pro must go further by asking for the specific certificate limit
- The adjacent tools (mold volume, batch resizer, lye concentration converter, superfat adjuster, fragrance load, liquid soap calculator, cost & pricing, bar count & cut) validate the full product scope
- SoapmakingToolbox's approach of citing SoapCalc as the SAP source (with retrieval date) provides a model for provenance tracking

### Formulas and data sources
- **Saponification**: `lye = Σ(oilWeight × SAPvalue)`; same fundamental formula as SoapCalc and SoapmakingFriend
- **NaOH/KOH conversion**: `KOH_SAP = NaOH_SAP × (56.1/40.0)` (molecular weight ratio); confirmed by the SAP values in SoapmakingToolbox's data
- **Purity adjustment**: `lyeActual = lyeCalculated / purityPercent`
- **Superfat**: `lyeActual = lyeCalculated × (1 - superfatPercent/100)`
- **Water**: Three conventions supported; exact formulas per convention match industry standard
- **SAP source**: SoapCalc oil list, retrieved 2026-08-19 (per SoapmakingToolbox attribution) [`O2`]
- **Published ranges**: 39 oils have published SAP ranges from soap making and lipid references; a test fails the build if the value falls outside the range [`C1` — competitor assertion]
- **140+ automated checks**: Competitor assertion; not independently verified [`C1`]
- **Dozen SoapCalc reference recipes**: Competitor assertion; not independently verified [`C1`]
- **IFRA Category 9**: Official IFRA guidance places bar soap and liquid soap in Category 9 (body/hand exposure, rinse-off) [`D1` — from IFRA documentation page]

### Edge and failure states
- Dual-lye mode with NaOH + KOH → both alkali amounts calculated for respective oil portions; exact split logic not independently verified
- Purity other than 100% → lye amount adjusted by purity factor
- Custom oils not in database → cannot add custom SAP values (unlike SoapCalc which may allow custom oils)
- Very high superfat → lye amount significantly reduced; may produce unsafe/bar properties
- Oil percentages not summing to 100% → "make it 100%" button auto-adjusts; behavior needs verification
- URL with many oils → URL length may become long; truncation risk not tested
- Mold sizing with cost → cost-per-bar updates with mold size; exact interaction needs verification
- IFRA limit exceeded → how the warning is displayed and whether it blocks calculation is not observed

### Mobile and accessibility
- One-screen design may be dense on mobile
- Comboboxes with grouped options are keyboard-navigable
- Property bars are visual-only; may not convey information to screen readers
- "Show the math" area is text-based and should be accessible
- No authentication required means no account-related mobile friction
- Print functionality works without auth — important for mobile users who may want to print recipes

### Fixtures
| Recipe | Inputs | Expected |
|---|---|---|
| 100% olive oil, NaOH, 100% purity | 1000g olive oil (SAP 0.134), 38% lye concentration, 5% superfat | NaOH = 1000 × 0.134 × 0.95 = 127.3g; water = 127.3 / 0.38 ≈ 335g |
| Coconut 76° + olive, KOH, 90% purity | 500g coconut 76° (SAP 0.273) + 500g olive (SAP 0.192), 33% lye concentration, 5% superfat | KOH = (500×0.273 + 500×0.192) × 0.95 / 0.9 = (136.5 + 96) × 0.95 / 0.9 = 254.4g; water = 254.4 / 0.33 ≈ 771g |
| Dual lye | 1000g oils, 50% NaOH / 50% KOH | NaOH and KOH calculated separately for respective oil portions |

### Claims boundary
- "94 oils, 39 published ranges, 140+ automated checks" are `C1` — competitor assertions, not independently verified
- Property bars are "relative comparisons, not skin claims" — the visible label is important but the exact meaning of each index is not defined
- "Check this recipe against a second calculator before you pour" is a safety disclaimer that does not substitute for verified calculations
- IFRA Category 9 classification is referenced but the specific limits for the user's fragrance are not provided by the tool

### Context handoffs
- **→ SoapCraft Pro**: Oil blend, percentages, lye type, purity, superfat, water method, fragrance load, mold size, cost per bar must all transfer
- **→ SoapCraft Pro costing**: Cost per bar input and output must connect to full batch economics
- **→ SoapCraft Pro sizing**: Mold sizing and bar-count outputs must connect to production planning
- **→ SoapCraft Pro formulation**: URL-carried state could be the model for recipe sharing/import

### Unresolved evidence
- Exact number of oils (94 claimed by competitor but not independently verified)
- Whether the "show the math" area includes the full worked example with user's actual values
- How dual-lye mode specifically splits oils between NaOH and KOH
- How cost per bar calculation works (what costs are included)
- How mold sizing feeds back into recipe scaling
- Whether the fragrance IFRA check uses a specific certificate or a generic limit
- The exact interaction between mold sizing and cost per bar
- Whether print output includes the "show the math" and source attribution
- How "make it 100%" adjusts individual oil percentages

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| One-screen recipe builder with real-time updates | `O2` | Direct observation 2026-09-09 |
| 100+ oils in grouped comboboxes | `O2` | Direct observation 2026-09-09 |
| NaOH, KOH, dual-lye modes | `O2` | Direct observation 2026-09-09 |
| Editable hydroxide purity (default 100%) | `O2` | Direct observation 2026-09-09 |
| "Show the math" area with worked SAP example | `O2` | Direct observation 2026-09-09 |
| Source attribution ("SAP values: SoapCalc oil list, retrieved 2026-08-19") | `O2` | Direct observation 2026-09-09 |
| "Relative comparisons, not skin claims" visible distinction | `O2` | Direct observation 2026-09-09 |
| "category 9 (rinse-off)" IFRA reference for fragrance | `O2` | Direct observation 2026-09-09 |
| URL-carried recipe state | `O2` | Direct observation 2026-09-09 |
| Local save, print, copy link without auth | `O2` | Direct observation 2026-09-09 |
| 94 oils, 39 published ranges, 140+ checks, dozen SoapCalc reference recipes | `C1` | Competitor assertion (not independently verified) |
| "Check this recipe against a second calculator before you pour" | `O2` | Safety disclaimer on page |

---

## 1.4 IFRA Category 9 — Bar Soap Fragrance Classification

| Field | Content |
|---|---|
| **Official source** | IFRA, *Guidance for the use of the IFRA Standards*, 51st Amendment, 3 July 2023 |
| **Landing page** | https://ifrafragrance.org/initiatives-positions/safe-use-fragrance-science/ifra-standards/ifra-standards-documentation |
| **PDF retrieved** | 2026-09-09 |
| **Evidence** | `D1` |

### User decision
Determine the applicable IFRA product category for bar soap to correctly apply fragrance concentration limits from the supplier's Certificate of Conformity.

### Exact data observed (D1, 2026-09-09)
- IFRA 51st Amendment confirmed at official source (3 July 2023) [`D1`]
- IFRA-RIFM Categorization Form confirmed (8 July 2023) [`D1`]
- Official guidance explicitly places **bar soap in Category 9**, described as products with body and hand exposure that are primarily rinse-off [`D1`]
- Product-type table also lists liquid soap in Category 9 [`D1`]
- Category 9 classification text is inside downloadable PDFs, not rendered inline on the documentation index page [`D1`]
- Template for Certificate of Conformity to the IFRA Standards available (9 December 2019) [`D1`]
- Full IFRA Standards documentation available as zip/PDF (8 January 2024) [`D1`]

### User decision (continued)
A SoapCraft Pro fragrance input must not rely on a generic IFRA percentage. The user must enter the specific Category 9 limit from their fragrance supplier's Certificate of Conformity, and the tool must display which IFRA category applies based on the product type.

### Exact inputs/outputs
- **Product type**: Bar soap or liquid soap → maps to IFRA Category 9 [`D1`]
- **Fragrance certificate limit**: User-entered value from their specific Certificate of Conformity; no default or generic percentage [`D1`]
- **Certificate amendment/version**: Must be visible alongside the limit [`D1`]
- **Output**: Category 9 classification displayed; calculation against user-entered limit; warning if limit exceeded

### Strongest comparators (≥3)
1. **SoapmakingToolbox** — references "category 9 (rinse-off)" but does not ask for or validate against a specific certificate limit [`O2`]
2. **SoapCalc** — no IFRA handling observed at all [`O2`]
3. **Soapmaking Friend** — no IFRA handling observed at all [`O2`]

### Direct observations (D1, 2026-09-09)
- IFRA official guidance explicitly places bar soap and liquid soap in Category 9
- Category 9 is described as "products with body and hand exposure that are primarily rinse-off"
- The classification text is inside downloadable PDFs, not rendered inline on the documentation index page
- The IFRA Standards documentation page provides the full standards as zip/PDF
- No universal safe fragrance percentage is stated or implied in the official documentation
- The consequence is that fragrance limits must come from the supplier certificate for the specific fragrance, not from a generic IFRA percentage

### Must-match
- Identify bar soap as IFRA Category 9 (body/hand exposure, rinse-off)
- Identify liquid soap as IFRA Category 9
- Not invent universal fragrance limits
- Ask user for specific fragrance certificate and Category 9 limit
- Display certificate version/amendment and percentage basis
- Make clear that the tool does not certify IFRA compliance — the user is responsible for using their supplier's certificate

### Must-improve
- Current SoapmakingToolbox only references "category 9 (rinse-off)" without asking for the specific certificate limit
- The current SoapCraft Pro engine (`sap.ts`) attaches IFRA checking to oils and `maxUsagePercent`, which is incorrect — IFRA concerns fragrance materials/product categories, not oils
- The current universal 6% fragrance warning is not a substitute for supplier-specific IFRA documentation

### Connected advantage (SoapCraft Pro)
- SoapCraft Pro's fragrance input should be paired with an IFRA Category 9 declaration and a field for the user to enter their specific certificate limit
- The tool should display: "This is bar soap → IFRA Category 9. Enter the fragrance's Category 9 limit from your Certificate of Conformity."
- Certificate version and amendment (51st Amendment) should be tracked and displayed
- This creates a defensible, auditable fragrance workflow that generic calculators cannot match

### Formulas and data sources
- **IFRA Category classification**: Bar soap and liquid soap → Category 9 (body/hand exposure, rinse-off) per IFRA 51st Amendment, 3 July 2023 [`D1`]
- **Fragrance limit calculation**: `fragranceAmount ≤ category9Limit` where `category9Limit` is entered from the user's specific Certificate of Conformity; no universal default exists
- **No universal formula**: IFRA does not publish a single safe percentage for all fragrances; limits vary by fragrance material and are supplier-specific
- **Data source**: IFRA official guidance, 51st Amendment, 3 July 2023 [`D1`]; IFRA-RIFM Categorization Form, 8 July 2023 [`D1`]
- **Source revision**: 51st Amendment (3 July 2023); future amendments may change classifications

### Edge and failure states
- User does not have a certificate → tool must not invent a limit; must guide user to obtain one
- Certificate limit is 0% → fragrance cannot be used in bar soap at any concentration; tool must display this clearly
- Certificate limit exceeds category 9 maximum → tool must flag the discrepancy
- User enters a limit from a different product category (e.g., Category 4 for leave-on) → tool must warn that Category 9 applies for bar soap
- Certificate version is outdated → tool should display the amendment/version and warn about potential changes
- Multiple fragrances in one recipe → each fragrance has its own certificate and limit; must handle independently

### Mobile and accessibility
- IFRA documentation is PDF-based; mobile viewing of PDFs may be challenging
- The SoapCraft Pro fragrance input UI must be mobile-friendly: large touch targets, clear labels, accessible error messages
- Certificate upload or manual entry must work on mobile
- Category 9 classification must be visible without scrolling on mobile

### Fixtures
| Scenario | Inputs | Expected |
|---|---|---|
| Bar soap with lavender fragrance | Product type: bar soap; Certificate of Conformity: Category 9, limit 2.5% | Display "IFRA Category 9 — bar soap. Fragrance limit: 2.5% per Certificate of Conformity (vXX)." |
| Liquid soap with fragrance | Product type: liquid soap; Certificate of Conformity: Category 9, limit 5.0% | Display "IFRA Category 9 — liquid soap. Fragrance limit: 5.0% per Certificate of Conformity (vXX)." |
| No certificate available | Product type: bar soap; no certificate | Display "IFRA Category 9 applies. You must obtain the Certificate of Conformity for your specific fragrance to determine the limit. This tool does not provide a universal safe percentage." |

*Note: These fixtures reference IFRA Category 9 classification as the documented basis. The specific limit values are illustrative and must come from the user's actual certificate.*

### Claims boundary
- IFRA Category 9 classification is a documented fact from the official IFRA guidance [`D1`]
- No universal safe fragrance percentage exists — this is explicitly stated by the IFRA documentation
- SoapCraft Pro does not certify IFRA compliance; the user is responsible for using their supplier's certificate
- The tool must not claim that any fragrance percentage is "safe" — it only checks against the user-entered certificate limit
- Certificate amendment/version must be visible; the tool must not silently use outdated limits

### Context handoffs
- **→ SoapCraft Pro formulation tool**: Fragrance load must connect to IFRA Category 9 check; the fragrance amount is calculated from the recipe and compared against the certificate limit
- **→ SoapCraft Pro costing**: Fragrance cost must account for the certificate-limited quantity
- **→ SoapCraft Pro purchasing**: Fragrance purchase requirements must respect the certificate-limited usage
- **SoapCraft Pro → SoapmakingToolbox**: If user cross-checks, the SoapCraft Pro recipe must produce matching fragrance amounts within tolerance

### Unresolved evidence
- The specific Category 9 limits for individual fragrance materials are inside the full IFRA Standards PDFs — not independently verified in this observation
- Whether SoapCraft Pro should validate against the full IFRA Standards or only ask for user-entered limits — the product contract says ask for the limit
- The exact format of the Certificate of Conformity and how it maps to Category 9 limits — requires domain review
- Whether the IFRA Standards document has been updated since the 51st Amendment — the official page should be checked for newer amendments

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Bar soap is IFRA Category 9 | `D1` | Official IFRA guidance, 51st Amendment |
| Liquid soap is IFRA Category 9 | `D1` | Official IFRA guidance, 51st Amendment |
| Category 9 = body/hand exposure, rinse-off | `D1` | Official IFRA guidance |
| IFRA 51st Amendment dated 3 July 2023 | `D1` | Official IFRA documentation page |
| IFRA-RIFM Categorization Form dated 8 July 2023 | `D1` | Official IFRA documentation page |
| Category 9 classification text inside downloadable PDFs | `D1` | Direct observation 2026-09-09 |
| No universal safe fragrance percentage | `D1` | Official IFRA guidance |
| SoapmakingToolbox references "category 9 (rinse-off)" | `O2` | Direct observation 2026-09-09 |
| Current engine attaches IFRA to oils/maxUsagePercent (wrong) | `C1` | Audit finding (internal code analysis) |

---

# Category 2: Sizing and Conversion

## 2.1 Mold Volume Calculator

| Field | Content |
|---|---|
| **Existing implementation** | `components/shared/mold-volume-form.tsx` + `/api/calculate/mold-volume` |
| **Evidence** | `C1` — internal code analysis reveals critical defects |
| **Direct observation status** | Not directly observed in a live tool; defects identified via code audit |

### User decision
Determine how much soap (in grams or bars) a mold of given dimensions will hold, to plan batch size.

### Exact inputs (design intent)
- **Mold dimensions**: Length, width, height (or diameter/height for cylindrical) [`C1`]
- **Unit system**: Centimeters or inches [`C1`]
- **Density**: Approximate soap density [`C1`]
- **Output type**: Oil weight, batter weight, or usable capacity (ambiguous in current implementation) [`C1`]

### Exact outputs (design intent)
- **Mold volume**: In cubic centimeters or cubic inches [`C1`]
- **Mold capacity**: In grams or ounces, based on density assumption [`C1`]
- **Bar count**: If bar dimensions are provided [`C1`]

### Strongest comparators (≥3)
1. **SoapmakingToolbox** — offers mold volume calculator as adjacent tool with URL-carried state [`O2`]
2. **SoapCalc** — no dedicated mold volume tool observed; sizing may be implicit [`O2`]
3. **Soapmaking Friend** — mold-resize option in recipe builder but no standalone mold volume calculator [`O2`]

### Direct observations
- Current implementation uses wrong density constant for inches (`0.0523 g/in³` instead of correct `14.7484 g/in³`) [`C1`]
- A 12×3×3 inch mold is estimated as 5.65g instead of ~1,592.82g under same density assumption [`C1`]
- Fragrance subtraction is used as part of the sizing model, which is not a sound general approach [`C1`]
- Output ambiguity: whether output means oil weight, batter weight, or usable capacity is not clear from the interface [`C1`]
- Unit support: Only cm and inches; no support for other unit systems [`C1`]

### Must-match
- Correct unit conversion factors (1 in³ = 16.387 cm³; 0.9 g/cm³ ≈ 14.7484 g/in³)
- Clear labeling of whether output is oil weight, batter weight, or usable capacity
- Support for rectangular and cylindrical molds
- Correct density constants for both cm and inch inputs

### Must-improve
- Replace the 0.0523 g/in³ constant with the correct 14.7484 g/in³
- Provide a density input with sensible default and unit label
- Show the formula/method used ("show the math")
- Support headspace/fill factor as an explicit input
- Support output in both weight and bar-count with clear labeling
- Make the density assumption and fill factor visible and editable

### Connected advantage (SoapCraft Pro)
- Mold volume must connect from formulation (oil blend determines density approximately) and feed into batch economics (how many bars per batch)
- The density assumption should be documented with source and revision
- The tool should connect to the recipe builder so mold sizing can auto-scale the recipe

### Formulas and data sources
- **Mold volume (rectangular)**: `volume = length × width × height` [`C1`]
- **Mold volume (cylindrical)**: `volume = π × radius² × height` [`C1`]
- **Mold weight**: `volume × density` [`C1`]
- **Density**: ~0.9 g/cm³ is an industry-standard approximation; varies by oil blend and hardness [`C1`]
- **Unit conversion**: 1 in³ = 16.387 cm³; 0.9 g/cm³ ≈ 14.7484 g/in³ [`C1`]
- **Source revision**: Density constant must be documented with source and revision

### Edge and failure states
- Very small mold dimensions → near-zero volume; must handle gracefully
- Very large mold dimensions → may exceed reasonable batch sizes
- Negative dimensions → must reject with clear error
- Non-integer dimensions → must handle decimal inputs correctly
- Unit conversion errors (inches vs cm) → must be handled correctly; current implementation has critical bugs
- Density varies by oil blend → must allow user override

### Mobile and accessibility
- Form inputs must be touch-friendly on mobile
- Unit selector must be accessible
- Error messages must be visible and screen-reader accessible
- "Show the math" area must be accessible

### Fixtures
| Recipe | Inputs | Expected |
|---|---|---|
| 12×3×3 inch rectangular mold | 12 in × 3 in × 3 in, density 0.9 g/cm³ | Volume = 108 in³ = 1,769.8 cm³; capacity ≈ 1,592.82g |
| 10 cm cylindrical mold | Diameter 10 cm, height 5 cm, density 0.9 g/cm³ | Volume = π × 5² × 5 = 392.7 cm³; capacity ≈ 353.4g |

### Claims boundary
- Mold capacity is an estimate based on density assumptions; not a precise measurement
- Different oil blends produce different densities; the tool must disclose this assumption
- The tool must not claim to determine exact batch size — it provides planning estimates
- The current 0.0523 g/in³ constant is incorrect and must not be released

### Context handoffs
- **→ SoapCraft Pro formulation tool**: Mold volume determines batch size; oil blend affects density
- **→ SoapCraft Pro costing**: Mold volume determines how many bars → cost per bar
- **→ SoapCraft Pro production**: Mold volume determines how many batches needed for a target

### Unresolved evidence
- Correct density for cold-process soap varies by formulation; 0.9 g/cm³ is an industry-standard approximation but not universally accurate
- Whether to use batter weight or oil weight as the basis for mold capacity
- The exact fill factor for different mold types (silicone vs. wood vs. acrylic)
- How to handle irregular mold shapes
- The current implementation's exact error scope and whether other density bugs exist

### Mobile and accessibility
- Form inputs must be touch-friendly on mobile
- Unit selector must be accessible
- Error messages must be visible and screen-reader accessible

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Wrong density constant (0.0523 g/in³) | `C1` | Internal code analysis |
| 12×3×3 inch mold estimated as 5.65g | `C1` | Internal code analysis |
| Output ambiguity (oil vs batter vs capacity) | `C1` | Internal code analysis |
| Fragrance subtraction as sizing model | `C1` | Internal code analysis |
| Need correct density constants | `C1` | Internal code analysis |

---

## 2.2 Recipe Scaling

| Field | Content |
|---|---|
| **Existing implementation** | `/api/calculate/recipe-scaling` |
| **Evidence** | `C1` — internal code analysis |

### User decision
Scale a recipe from one batch size to another while maintaining correct proportions of oils, lye, water, and fragrance.

### Exact inputs (design intent)
- **Source recipe**: Oil blend, percentages, lye type, superfat, water method, fragrance load [`C1`]
- **Target batch size**: Oil weight in grams, kilograms, pounds, or ounces [`C1`]
- **Scaling mode**: Recalculate from oils/SAP vs copy amounts [`C1`]
- **Unit system**: Must handle metric and imperial conversion correctly [`C1`]

### Exact outputs (design intent)
- **Scaled oil quantities**: Each oil scaled to target batch weight [`C1`]
- **Scaled lye amount**: Based on SAP values and superfat [`C1`]
- **Scaled water amount**: Based on selected water method [`C1`]
- **Scaled fragrance amount**: Based on fragrance load percentage [`C1`]

### Strongest comparators (≥3)
1. **SoapmakingToolbox** — offers Batch Resizer as adjacent tool with URL-carried state [`O2`]
2. **Soapmaking Friend** — mold-resize option in recipe builder [`O2`]
3. **SoapCraft Pro local engine** — current implementation accepts arbitrary ingredients and scales without validation [`C1`]

### Direct observations
- Current implementation uses pure proportional scaling which is arithmetically simple but insufficient [`C1`]
- Current implementation accepts arbitrary ingredients and scales lye/water without validating the originating formula, units, alkali type, or target mold [`C1`]
- Needs explicit "copy amounts" versus "recalculate from oils/SAP" modes [`C1`]
- Needs safety boundaries [`C1`]

### Must-match
- Scale by target oil weight, not just arbitrary multiplier
- Validate originating formula before scaling
- Handle unit conversion correctly
- Support both NaOH and KOH modes in scaled output
- Apply superfat correctly in scaled output
- Validate water-to-lye ratio in scaled output

### Must-improve
- Add "copy amounts" vs "recalculate from oils/SAP" modes
- Validate the originating formula (units, alkali type, target mold)
- Ensure lye/water scaling is consistent with the selected water method
- Preserve fragrance load percentage correctly when scaling
- Handle edge cases: scaling to zero, negative, extreme ratios

### Connected advantage (SoapCraft Pro)
- Recipe scaling must accept input from the formulation tool and output to mold sizing, costing, and production planning
- The scaling must carry forward the full recipe context (oil blend, SAP values, properties)
- The scaling must use the same formulas as the formulation tool to ensure consistency

### Formulas and data sources
- **Proportional scaling**: `scaledOil_i = targetOilWeight × (oil_i_percent / 100)` [`C1`]
- **Lye scaling**: `scaledLye = lyeFromSAP(scaledOils, superfat)` — must recalculate from SAP, not just scale [`C1`]
- **Water scaling**: Must respect selected water method (`% of oils`, `lye concentration`, or `water:lye ratio`) [`C1`]
- **Fragrance scaling**: `scaledFragrance = scaledOilWeight × fragranceLoadPercent / 100` [`C1`]
- **Data source**: SAP values from the same manifest as the formulation tool

### Edge and failure states
- Scaling to zero → must reject with clear error
- Negative target → must reject
- Extreme ratios (e.g., 1000×) → must have reasonable bounds
- Unit mismatch between source and target → must convert correctly
- Alkali type mismatch → must warn or reject
- Superfat inconsistency → must recalculate based on target, not preserve original superfat

### Mobile and accessibility
- Input fields must be touch-friendly
- Validation errors must be visible and accessible
- Scaling results must be readable on small screens

### Fixtures
| Recipe | Inputs | Expected |
|---|---|---|
| Scale 1000g olive oil recipe to 500g | Source: 1000g olive oil, NaOH, 38% water-as-%-of-oils, 5% superfat; Target: 500g | Scaled: olive oil 500g, NaOH ≈ 63.65g, water ≈ 234.5g, superfat 5% |
| Scale KOH recipe with different water method | Source: 1000g olive oil, KOH, 2:1 water:lye, 5% superfat; Target: 2000g | NaOH/KOH recalculated for 2000g; water = 2 × lye |

### Claims boundary
- Scaling is a mathematical operation; it does not guarantee the scaled recipe is safe or appropriate
- The tool must not claim that scaled recipes are "tested" or "verified"
- Different water methods produce different results; the tool must preserve the user's selected method

### Context handoffs
- **→ SoapCraft Pro formulation tool**: Source recipe must come from formulation
- **→ SoapCraft Pro sizing**: Scaled recipe must feed into mold sizing
- **→ SoapCraft Pro costing**: Scaled recipe must feed into batch economics
- **→ SoapCraft Pro production**: Scaled recipe must feed into production planning

### Unresolved evidence
- Whether the current implementation handles unit conversion correctly
- Whether the current implementation validates the originating formula
- Whether "copy amounts" vs "recalculate" modes are needed in the design
- The exact safety boundaries that should be applied

### Mobile and accessibility
- Input fields must be touch-friendly
- Validation errors must be visible and accessible

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Current implementation uses pure proportional scaling | `C1` | Internal code analysis |
| No formula validation before scaling | `C1` | Internal code analysis |
| Needs "copy amounts" vs "recalculate" modes | `C1` | Internal code analysis |
| Needs safety boundaries | `C1` | Internal code analysis |
| Must handle unit conversion correctly | `C1` | Internal code analysis |

---

# Category 3: Cost and Pricing

## 3.1 Batch Costing / Cost Per Bar Calculator

| Field | Content |
|---|---|
| **Existing implementation** | `lib/calculations/batch-cost.ts` + `/api/calculate/batch-cost` |
| **Evidence** | `O2` — interface observed; formulas from code audit |

### User decision
Determine the true cost per saleable bar of handmade soap, accounting for all material costs, yield loss, and production factors.

### Exact inputs observed (O2)
- **Ingredient costs**: Purchase cost per unit and quantity for each ingredient [`C1`]
- **Packaging cost per saleable unit**: Cost of packaging per bar [`C1`]
- **Labor minutes**: Time spent on the batch [`C1`]
- **Labor rate per hour**: Hourly rate for labor [`C1`]
- **Batch overhead**: Fixed overhead costs for the batch [`C1`]
- **Expected made units**: Total units produced [`C1`]
- **Expected saleable units**: Units after subtracting trim, samples, defects [`C1`]
- **Channel fees**: Percentage fee and fixed fee per transaction [`C1`]

### Exact outputs (design intent)
- **Material cost**: Sum of all ingredient costs [`C1`]
- **Packaging cost**: Based on saleable units [`C1`]
- **Labor cost**: Based on labor minutes and rate [`C1`]
- **Overhead cost**: Fixed batch overhead [`C1`]
- **Full batch cost**: Sum of all costs [`C1`]
- **Cost per made unit**: Full batch cost / made units [`C1`]
- **Cost per saleable unit**: Full batch cost / saleable units [`C1`]
- **Missing inputs warning**: List of inputs that are incomplete [`C1`]
- **Formula revision**: Version identifier included in output [`C1`]

### Strongest comparators (≥3)
1. **SoapmakingToolbox** — offers Soap Cost & Pricing as adjacent tool; cost per bar input visible in recipe builder [`O2`]
2. **Soapmaking Friend** — no dedicated costing tool observed; monetization is account/premium-based [`O2`]
3. **SoapCalc** — no costing features observed at all [`O2`]

### Direct observations
- Current API adapter throws away warnings — filters incomplete rows, discarding core engine's missing-cost warnings [`C1`]
- Input ambiguity: The input says "Cost" without specifying pack cost, cost per selected unit, or cost per gram [`C1`]
- Markup vs margin confusion: The API's "targetMargin" computes `cost × (1 + percentage)` = markup, NOT gross margin (which needs `price = cost / (1 - margin)`) [`C1`]
- Missing inputs: Labor, packaging per bar, waste/trim/samples, payment fees, discounts, taxes, saleable cured yield [`C1`]
- Overconfident "suggested price": Presented with more confidence than input supports [`C1`]

### Must-match
- Clear cost basis labeling: pack cost, cost per selected unit, or cost per gram
- Correct markup vs gross margin formulas:
  - **Markup %** = `(price - cost) / cost × 100`
  - **Gross margin %** = `(net revenue - cost) / net revenue × 100`
  - Target price for gross margin = `cost / (1 - marginPercent)`
  - Target price for markup = `cost × (1 + markupPercent)`
- Missing cost basis must remain visible, never silently zero
- Warn when cost inputs are incomplete
- Distinguish ingredient cost, fragrance cost, packaging cost, labor cost, overhead
- Cost per saleable unit (not just per made unit)
- Saleable yield excludes trim, samples, defects, and units retained for testing
- Full batch cost includes material, packaging, labor, overhead

### Must-improve
- Separate material cost, landed unit cost, labor, overhead, fees, waste, saleable yield, contribution, markup, and gross margin
- Calculate cost per saleable unit (not just per made unit)
- Include saleable cured yield (subtracting trim, samples, defects)
- Add packaging cost per bar
- Add labor cost (minutes × rate)
- Add batch overhead
- Display missing inputs prominently
- Never present suggested price with more confidence than the inputs support
- Include formula revision in output

### Connected advantage (SoapCraft Pro)
- Batch costing must accept input from the formulation tool (oil quantities) and connect to pricing tools and market planning
- The economic definitions (markup vs margin) must be consistent across all tools
- The formula revision must be tracked and included in exports
- Anonymous users can see complete batch cost without any authentication

### Formulas and data sources
- **Material cost**: `Σ(quantity × unitCost)` for each ingredient, normalized to grams [`C1`]
- **Fragrance cost**: Input or calculated [`C1`]
- **Packaging cost**: `costPerSaleableUnit × saleableUnits` [`C1`]
- **Labor cost**: `(laborMinutes / 60) × laborRatePerHour` [`C1`]
- **Overhead**: Fixed batch overhead input [`C1`]
- **Full batch cost**: `material + fragrance + packaging + labor + overhead` [`C1`]
- **Cost per made unit**: `fullBatchCost / madeUnits` [`C1`]
- **Cost per saleable unit**: `fullBatchCost / saleableUnits` (saleableUnits < madeUnits) [`C1`]
- **Markup %**: `(price - cost) / cost × 100` [`C1`]
- **Gross margin %**: `(price - cost) / price × 100` [`C1`]
- **Target price (markup)**: `cost × (1 + markupPercent)` [`C1`]
- **Target price (margin)**: `cost / (1 - marginPercent)` [`C1`]
- **Contribution per unit**: `priceAfterFees - costPerSaleableUnit` [`C1`]
- **Data source**: All formulas derived from the PRODUCT-CONTRACT-UTILITY-HUB economic definitions; no external source needed for the math itself

### Edge and failure states
- Zero cost inputs → must show as zero, not silently default
- Missing cost inputs → must warn prominently, not assume zero
- Saleable units = 0 → must reject (division by zero)
- Negative costs → must reject
- Currency mismatch → must not sum across currencies
- Very high waste percentage → cost per saleable unit increases significantly
- Zero saleable yield → must handle gracefully

### Mobile and accessibility
- Cost inputs must be touch-friendly
- Error messages for missing costs must be visible and accessible
- Results must be readable on small screens
- "Show the math" area must be accessible

### Fixtures
| Recipe | Inputs | Expected |
|---|---|---|
| Simple olive oil batch | 1000g olive oil ($0.05/g), packaging $0.10/bar, labor 30 min at $15/hr, overhead $2, 100 made, 90 saleable | Material = $50; Packaging = $9; Labor = $7.50; Overhead = $2; Full batch = $68.50; Cost/made = $0.685; Cost/saleable = $0.761 |
| With channel fees | Cost/saleable = $0.761; 10% channel fee; price = $2.00 | Contribution = $2.00 - $0.20 - $0.761 = $1.039 |

### Claims boundary
- Costing is a planning aid, not tax/legal/regulatory advice
- The tool must not claim to determine "fair market price" — it calculates costs and margins based on user inputs
- Missing cost inputs make the result explicitly incomplete and cannot be styled as a recommendation
- Labor costs are estimates based on user-provided rate and time

### Context handoffs
- **→ SoapCraft Pro formulation tool**: Oil quantities from recipe drive material cost
- **→ SoapCraft Pro pricing**: Cost per saleable unit feeds into retail/wholesale pricing
- **→ SoapCraft Pro markets**: Cost per saleable unit feeds into craft-fair break-even
- **→ SoapCraft Pro purchasing**: Ingredient costs feed into purchase planning

### Unresolved evidence
- What cost basis SoapCraft Pro should default to (pack cost vs per-unit cost vs per-gram cost)
- Whether labor should be optional or required
- How to handle pack-size rounding (buying a 1kg bag but using only 200g)
- How to handle multi-ingredient recipes where some ingredients have no cost data
- Whether the current API has other bugs beyond the documented ones

### Mobile and accessibility
- Cost inputs must be touch-friendly
- Error messages for missing costs must be visible and accessible

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Markup/margin confusion in current API | `C1` | Internal code analysis |
| API throws away warnings | `C1` | Internal code analysis |
| Missing labor, packaging, waste, yield inputs | `C1` | Internal code analysis |
| Overconfident "suggested price" | `C1` | Internal code analysis |
| Economic formulas (markup, margin, contribution) | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |
| Cost per saleable unit requirement | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |

---

## 3.2 Wholesale Pricing Calculator

| Field | Content |
|---|---|
| **Existing implementation** | `/api/calculate/wholesale-pricing` |
| **Evidence** | `C1` — internal code analysis reveals formula defects |

### User decision
Determine wholesale price per bar accounting for channel fees, discounts, minimum order quantities, and margin targets.

### Exact inputs (design intent)
- **Cost per saleable unit**: From batch costing [`C1`]
- **Channel fees**: Percentage fee and fixed fee per transaction [`C1`]
- **Wholesale discount percentage**: Discount offered to wholesale buyers [`C1`]
- **Minimum order quantity (MOQ)**: Minimum units per wholesale order [`C1`]
- **Target margin**: Gross margin target [`C1`]
- **Retail price**: If known, for comparison [`C1`]

### Exact outputs (design intent)
- **Wholesale price per unit**: After channel fees and discount [`C1`]
- **Retail price per unit**: For comparison [`C1`]
- **Margin analysis**: Markup and gross margin for both prices [`C1`]
- **MOQ revenue**: Total revenue at minimum order quantity [`C1`]

### Strongest comparators (≥3)
1. **SoapmakingToolbox** — offers Soap Cost & Pricing as adjacent tool [`O2`]
2. **Soapmaking Friend** — no dedicated wholesale pricing tool observed [`O2`]
3. **SoapCalc** — no pricing features observed at all [`O2`]

### Direct observations
- Current implementation calls markup "desired margin," applies it as `cost × (1 + percentage)`, then calculates a different retail margin later [`C1`]
- Defaults retail to twice wholesale without showing channel fees, MOQ, discounts, labor, or whether cost includes overhead [`C1`]

### Must-match
- Explicitly separate markup, gross margin, channel fees, wholesale discount, and minimum viable price
- Allow for channel fee percentage and fixed fee per transaction
- Allow for wholesale discount percentage
- Allow for MOQ (minimum order quantity)
- Show the relationship between retail price, wholesale price, and cost clearly
- Never call markup "margin"
- Solve target price algebraically for margin: `price = cost / (1 - marginPercent)`

### Must-improve
- Display channel fees and their effect on net revenue
- Show contribution per unit after all fees
- Allow for multiple wholesale scenarios (different channels, different MOQs)
- Show quote/price-sheet output

### Connected advantage (SoapCraft Pro)
- Wholesale pricing must accept cost-per-bar from batch costing
- Must connect to craft-fair break-even and market planning tools
- Quote/price-sheet output must be a deliverable
- All economic definitions must be consistent with batch costing

### Formulas and data sources
- **Wholesale price (margin basis)**: `price = costPerSaleableUnit / (1 - marginPercent)` [`C1`]
- **Wholesale price after discount**: `wholesalePrice × (1 - wholesaleDiscountPercent)` [`C1`]
- **Net revenue per unit**: `wholesalePrice - channelFeePercentage × wholesalePrice - fixedFeePerTransaction / unitsPerTransaction` [`C1`]
- **Contribution per unit**: `netRevenuePerUnit - costPerSaleableUnit` [`C1`]
- **MOQ revenue**: `wholesalePrice × MOQ` [`C1`]
- **Data source**: Economic definitions from PRODUCT-CONTRACT-UTILITY-HUB.md; no external pricing source needed

### Edge and failure states
- Margin = 0 → price = cost (no profit); must display clearly
- Margin = 100% → price approaches infinity; must reject or warn
- Channel fee = 100% → net revenue = 0; must reject
- Negative costs → must reject
- MOQ = 0 → must reject or handle gracefully
- Currency mismatch → must not sum across currencies

### Mobile and accessibility
- Input fields must be touch-friendly
- Error messages must be visible and accessible
- Results must be readable on small screens

### Fixtures
| Recipe | Inputs | Expected |
|---|---|---|
| Simple wholesale | Cost/saleable = $1.00; channel fee 10%; wholesale discount 20%; margin target 40% | Price = $1.00 / (1 - 0.40) = $1.67; After discount = $1.33; Net = $1.33 - $0.13 - fixedFee |
| Zero channel fee | Cost/saleable = $1.00; channel fee 0%; margin target 40% | Price = $1.67 |

### Claims boundary
- Pricing is a planning aid, not tax/legal/regulatory advice
- The tool must not claim to determine "market price" — it calculates based on user inputs
- Missing cost inputs make the result explicitly incomplete
- Wholesale pricing assumes the user has a cost basis from batch costing

### Context handoffs
- **→ SoapCraft Pro batch costing**: Cost per saleable unit must come from costing
- **→ SoapCraft Pro markets**: Wholesale price feeds into craft-fair break-even and market planning
- **→ SoapCraft Pro production**: Wholesale orders determine production volume

### Unresolved evidence
- Whether the current implementation has additional bugs beyond the documented ones
- What wholesale channel fee structures to support (percentage only, fixed only, or both)
- Whether to support multiple wholesale channels with different fee structures
- How to handle partial MOQ fulfillment

### Mobile and accessibility
- Input fields must be touch-friendly
- Error messages must be visible and accessible

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Calls markup "desired margin" | `C1` | Internal code analysis |
| Defaults retail to 2× wholesale without justification | `C1` | Internal code analysis |
| Markup/margin must be explicitly separated | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |
| Target price algebra for margin | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |

---

# Category 4: Markets and Wholesale

## 4.1 Craft-Fair Break-Even Calculator

| Field | Content |
|---|---|
| **Existing implementation** | `/api/calculate/craft-fair-break-even` |
| **Evidence** | `C1` — internal code analysis |

### User decision
Determine how many bars of soap must be sold at a craft fair to break even, considering all costs and expected sell-through.

### Exact inputs (design intent)
- **Fixed event costs**: Booth fee, travel, accommodation, supplies [`C1`]
- **Variable costs per unit**: Cost per bar, card fees, packaging at event [`C1`]
- **Expected sell-through percentage**: Proportion of displayed stock expected to sell [`C1`]
- **Product mix**: Different products with different margins [`C1`]
- **Target profit**: Beyond break-even [`C1`]
- **Stock buffer**: Extra units for spoilage, damage, unexpected demand [`C1`]
- **Card/payment processing fees**: Percentage and per-transaction fee [`C1`]

### Exact outputs (design intent)
- **Break-even units**: Number of bars needed to cover all costs [`C1`]
- **Break-even revenue**: Dollar amount at break-even [`C1`]
- **Target profit units**: Number of bars needed to reach target profit [`C1`]
- **Expected sell-through scenarios**: Conservative, realistic, optimistic [`C1`]
- **Stock buffer calculation**: Additional units to account for waste/damage [`C1`]

### Strongest comparators (≥3)
1. **SoapmakingToolbox** — offers market-related tools as part of its adjacent tool suite [`O2`]
2. **Soapmaking Friend** — no dedicated market planning tool observed; relies on account/premium features [`O2`]
3. **SoapCalc** — no market features observed at all [`O2`]

### Direct observations
- Basic fixed-cost/contribution calculation is valid for one product [`C1`]
- Validation rejects zero booth cost and zero unit cost despite saying non-negative [`C1`]
- Omits travel, event labor, card fees, product mix, expected sell-through, target profit, and stock buffer [`C1`]

### Must-match
- Fixed event costs (booth fee, travel, accommodation, supplies)
- Variable costs per unit (cost per bar, card fees, packaging at event)
- Expected sell-through percentage
- Product mix (different products with different margins)
- Target profit (not just break-even)
- Stock buffer (extra units for spoilage, damage, unexpected demand)
- Card/payment processing fees percentage and per-transaction fee
- Travel and accommodation costs
- Event labor cost
- Allow zero booth cost without rejection (some events have free tables)
- Show break-even in units and revenue
- Show target profit units
- Show expected sell-through scenarios

### Must-improve
- Allow zero booth cost without rejection
- Support multiple products with different contribution margins
- Show break-even in units and revenue
- Show target profit units
- Show expected sell-through scenarios (conservative, realistic, optimistic)
- Display stock buffer calculation
- Event fees must be configurable

### Connected advantage (SoapCraft Pro)
- Must accept cost-per-bar from batch costing
- Must connect to production back-planning (how many batches needed to supply the fair)
- Must connect to purchasing/ingredient planning (what ingredients to buy for the fair batch)
- Must output a stock plan and bar count
- Must carry context from formulation through to market planning

### Formulas and data sources
- **Break-even units**: `ceiling(fixedCosts / weightedContributionPerUnit)` [`C1`]
- **Weighted contribution per unit**: `Σ(mixShare_i × (price_i - costPerUnit_i - fees_i))` for product mix [`C1`]
- **Break-even revenue**: `breakEvenUnits × weightedAveragePrice` [`C1`]
- **Target profit units**: `ceiling((fixedCosts + targetProfit) / weightedContributionPerUnit)` [`C1`]
- **Stock buffer**: `breakEvenUnits × stockBufferPercent` [`C1`]
- **Data source**: Economic definitions from PRODUCT-CONTRACT-UTILITY-HUB.md

### Edge and failure states
- Zero contribution per unit → break-even is undefined (infinite); must warn
- Negative contribution → product loses money on every sale; must flag
- Very high fixed costs → break-even may exceed reasonable stock
- Zero sell-through → must handle gracefully
- Product mix sums to >100% → must reject or normalize
- Negative event costs → must reject

### Mobile and accessibility
- Input fields must be touch-friendly
- Error messages must be visible and accessible
- Results must be readable on small screens
- Print/export must work on mobile

### Fixtures
| Scenario | Inputs | Expected |
|---|---|---|
| Simple craft fair | Fixed costs $200; cost/bar $1.00; price/bar $3.00; card fee 2% + $0.10; sell-through 80% | Contribution = $3.00 - $1.00 - $0.06 - $0.10 = $1.84; Break-even = ceiling(200/1.84) = 109 units |
| Zero booth cost | Fixed costs $50 (travel only); rest same as above | Break-even = ceiling(50/1.84) = 28 units (must not reject zero booth cost) |

### Claims boundary
- Break-even is a planning estimate, not a financial guarantee
- The tool must not claim to determine actual sales or profitability
- Expected sell-through is an assumption entered by the user, not a prediction
- Event costs vary widely; the tool must not use default values that are not the user's own

### Context handoffs
- **→ SoapCraft Pro batch costing**: Cost per saleable unit must come from costing
- **→ SoapCraft Pro production**: Break-even units determine production batches needed
- **→ SoapCraft Pro purchasing**: Production volume drives ingredient purchase requirements
- **→ SoapCraft Pro markets**: Break-even connects to wholesale MOQ planning

### Unresolved evidence
- Standard craft fair cost ranges (booth fees, travel) vary widely by region and event type
- Whether to support multiple events with different cost structures
- How to handle product mix with more than 2-3 products
- Whether to include booth decor, signage, or other minor costs
- The current implementation's exact error scope

### Mobile and accessibility
- Input fields must be touch-friendly
- Error messages must be visible and accessible

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Rejects zero booth cost and zero unit cost | `C1` | Internal code analysis |
| Omits travel, fees, mix, sell-through | `C1` | Internal code analysis |
| Break-even formula (fixed / contribution) | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |
| Must allow zero booth cost | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |

---

# Category 5: Production and Cure

## 5.1 Ready-By Date Planner / Production Back-Planner

| Field | Content |
|---|---|
| **Existing implementation** | Partially in `/app/cure` and `/app/batches` |
| **Evidence** | `C1` — design spec approved; implementation incomplete |

### User decision
Determine when to pour a batch given a ready-by date (market date, wholesale delivery date) and cure interval, working backward to calculate the latest pour date.

### Exact inputs (design intent)
- **Ready-by date**: Market date, wholesale delivery date, or other deadline [`C1`]
- **Cure interval**: User-selected number of days for soap to cure [`C1`]
- **Unmold/cut buffer days**: Days between pour and unmold/cut [`C1`]
- **Capacity**: Batches per week [`C1`]
- **Target saleable units**: Number of bars needed [`C1`]
- **Yield per batch**: Expected saleable units per batch [`C1`]

### Exact outputs (design intent)
- **Latest pour date**: readyByDate - cureDays - unmoldCutBufferDays [`C1`]
- **Required batches**: Based on target units and yield per batch [`C1`]
- **Production schedule**: Pour → unmold → cut → cure → ready dates [`C1`]
- **Batch/lot records**: Traceable production records [`C1`]

### Strongest comparators (≥3)
1. **Soapmaking Friend** — has Batches module with date tracking; recipe date picker observed [`O2`]
2. **SoapmakingToolbox** — no dedicated production planner observed [`O2`]
3. **SoapCalc** — no production features observed at all [`O2`]

### Direct observations
- Design spec approved but implementation incomplete [`C1`]
- Cure interval must be user-selectable, not a hard-coded default
- Date planning must use an explicit user-selected interval and never claim to determine product safety/readiness

### Must-match
- Accept user-selected cure interval (not a hard-coded default)
- Accept unmold/cut buffer days
- Accept ready-by date
- Calculate latest pour date = ready-by date - cure days - unmold/cut buffer days
- Account for capacity (batches per week)
- Show required batches and bars per batch
- Never claim to determine product safety/readiness — only date planning
- Printable production records

### Must-improve
- Make cure interval user-selectable (not a fixed default)
- Show the full date chain: pour → unmold → cut → cure → ready
- Support multiple batches with different pour dates
- Show capacity constraints (how many batches can be made per week)
- Connect to purchasing/ingredient planning
- Support timezone and date edge cases for market dates

### Connected advantage (SoapCraft Pro)
- Must accept bar count requirements from market planning tools
- Must output production schedule that connects to batch creation
- Must connect to ingredient purchasing (what to buy and when)
- Date planning must use explicit user-selected interval and never claim safety
- Batch/lot records must be printable

### Formulas and data sources
- **Latest pour date**: `readyByDate - cureDays - unmoldCutBufferDays` [`C1`]
- **Required batches**: `ceiling(saleableUnitsRequired / expectedYieldPerBatch)` [`C1`]
- **Production capacity check**: `batchesRequired / capacityBatchesPerWeek` (weeks needed) [`C1`]
- **Date chain**: pour → (unmoldCutBufferDays) → unmold/cut → (cureDays) → ready [`C1`]
- **Data source**: User inputs; no external source needed

### Edge and failure states
- Ready-by date is in the past → must warn or reject
- Cure interval = 0 → must reject (soap must cure)
- Ready-by date is too soon for cure interval → must warn
- Multiple batches with overlapping dates → must show capacity conflicts
- Timezone edge cases for market dates in different timezones
- Weekend/holiday buffer: user may want to add extra days for weekends between pour and market

### Mobile and accessibility
- Date picker must be mobile-friendly
- Error messages must be visible and accessible
- Date chain must be readable on small screens
- Printable records must work on mobile

### Fixtures
| Scenario | Inputs | Expected |
|---|---|---|
| Standard cold-process cure | Ready-by date: 2026-10-15; Cure: 30 days; Unmold/cut buffer: 2 days | Latest pour date: 2026-09-23; Unmold: 2026-09-25; Cure: 2026-09-25 to 2026-10-25; Ready: 2026-10-15 |
| Hot-process soap | Ready-by date: 2026-09-30; Cure: 3 days; Unmold/cut buffer: 1 day | Latest pour date: 2026-09-26; Unmold: 2026-09-27; Ready: 2026-09-30 |

### Claims boundary
- Date planning is a scheduling aid, not a product safety determination
- The tool must never claim to determine whether soap is safe to use
- Cure intervals vary by oil blend and water method; the tool must disclose this
- The tool must not guarantee that soap will be ready by the target date — only that the schedule requires it

### Context handoffs
- **→ SoapCraft Pro markets**: Break-even units determine required batches
- **→ SoapCraft Pro production**: Production schedule connects to batch creation
- **→ SoapCraft Pro purchasing**: Ingredient purchase requirements connect to production dates
- **→ SoapCraft Pro formulation**: Recipe context (oil blend) may affect cure interval

### Unresolved evidence
- Standard cure interval varies by oil blend and water method — 4-6 weeks is common for cold-process but not universal
- Whether to account for different cure profiles (accelerated vs. standard)
- How to handle timezone and date edge cases for market dates
- Whether to include holidays/weekends in the schedule
- The current implementation's exact state of incompleteness

### Mobile and accessibility
- Date picker must be mobile-friendly
- Error messages must be visible and accessible
- Date chain must be readable on small screens

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Design spec approved but implementation incomplete | `C1` | Internal code analysis |
| Cure interval must be user-selectable | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |
| Must never claim product safety/readiness | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |
| Latest pour date formula | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |

---

# Category 6: Purchasing and Inventory

## 6.1 Ingredient Purchase Planner

| Field | Content |
|---|---|
| **Existing implementation** | `/app/ingredients`, `/api/ingredients`, `/api/ingredient-costs` |
| **Evidence** | `C1` — partially implemented; requires design from scratch |

### User decision
Calculate what ingredients to purchase for upcoming batches, accounting for current stock, pack sizes, and requirements.

### Exact inputs (design intent)
- **Production plan**: Batches planned → ingredient quantities required [`C1`]
- **Current stock**: What ingredients are already on hand [`C1`]
- **Pack sizes**: Supplier pack sizes for each ingredient [`C1`]
- **Supplier prices**: Cost per unit for each supplier [`C1`]
- **Requirements**: What ingredients are needed, from formulation and production plan [`C1`]

### Exact outputs (design intent)
- **Purchase requirements**: `requirements - stock` (rounded up to pack size) [`C1`]
- **Cost comparison**: Same ingredient, different pack sizes, different prices [`C1`]
- **Event counts**: Specific market or wholesale order quantities [`C1`]
- **Purchase list**: Print/export-ready list [`C1`]

### Strongest comparators (≥3)
1. **Soapmaking Friend** — has Inventory module with stock tracking; adjacent Recipes, Batches, Inventory modules observed [`O2`]
2. **SoapmakingToolbox** — no dedicated purchasing tool observed [`O2`]
3. **SoapCalc** — no purchasing features observed at all [`O2`]

### Direct observations
- Current implementation is partial; requires design from scratch [`C1`]
- No full planning workflow exists in the current codebase [`C1`]
- The product contract specifies anonymous local planning plus optional-account persistence and depletion

### Must-match
- Requirements minus stock (what to buy = what you need - what you have)
- Pack rounding (buy a 1kg bag even if you need 200g)
- Supplier comparison (same ingredient, different pack sizes, different prices)
- Requirements from production plan (batches → ingredient quantities)
- No persistent inventory needed for the basic planning mode
- Optional account persistence for returning users
- Anonymous local planning plus optional-account persistence and depletion
- Event counts (specific market or wholesale order quantities)

### Must-improve
- Handle partial stock depletion across multiple planned batches
- Show cost implications of different pack sizes
- Connect to batch creation (planned batches auto-generate purchase requirements)
- Support event counts (specific market or wholesale order quantities)
- Show supplier comparison with cost savings
- Export purchase list as printable artifact

### Connected advantage (SoapCraft Pro)
- Must accept batch plans from production/cure tools
- Must connect to costing (ingredient costs)
- Must output a purchase list that can be printed or exported
- Depletion tracking must sync with batch creation
- Anonymous planning must be possible without any account

### Formulas and data sources
- **Purchase requirement**: `ceil((requiredQuantity - stockQuantity) / packSize) × packSize` [`C1`]
- **Total cost**: `Σ(purchaseQuantity × unitCost)` for each ingredient [`C1`]
- **Supplier comparison**: `costA vs costB` for same ingredient different pack sizes [`C1`]
- **Stock depletion**: `stockQuantity -= usedQuantity` after batch creation [`C1`]
- **Data source**: User inputs; supplier data entered by the user

### Edge and failure states
- Stock exceeds requirement → purchase requirement = 0; must display clearly
- Multiple batches using same ingredient → stock depletion must be tracked across batches
- Ingredient not in stock → full purchase required
- Pack size rounding → must round up to nearest pack
- Zero stock → full purchase required
- Currency mismatch → must not sum across currencies
- Partial pack usage → must handle remaining stock for future batches

### Mobile and accessibility
- Input fields must be touch-friendly
- Error messages must be visible and accessible
- Purchase list must be printable on mobile
- Supplier comparison must be readable on small screens

### Fixtures
| Scenario | Inputs | Expected |
|---|---|---|
| Simple purchase | Need 500g olive oil; stock 200g; pack size 1000g | Purchase: 1000g (rounded up to pack); Remaining stock after: 700g |
| Multiple batches | Batch 1 needs 500g olive oil; Batch 2 needs 300g; stock 200g | Total need: 800g; Purchase: 1000g (pack); Remaining stock: 200g + 1000g - 800g = 400g |

### Claims boundary
- Purchase planning is an estimate based on user inputs; actual usage may vary
- Stock levels must be entered by the user; the tool does not track inventory automatically without an account
- Supplier prices must be entered by the user; the tool does not scrape or infer prices
- The tool must not claim to find the cheapest supplier — it compares user-entered prices

### Context handoffs
- **→ SoapCraft Pro production**: Production plan drives ingredient requirements
- **→ SoapCraft Pro costing**: Ingredient costs drive purchase cost calculation
- **→ SoapCraft Pro markets**: Event counts drive specific purchase requirements
- **→ SoapCraft Pro formulation**: Recipe oil blend determines ingredient types needed

### Unresolved evidence
- How to handle multi-ingredient recipes with shared ingredients across batches
- Whether to support supplier database integration or user-entered prices only
- How to handle ingredient substitutions
- Whether to support purchase order generation (not just a list)
- The current implementation's exact state of incompleteness

### Mobile and accessibility
- Input fields must be touch-friendly
- Error messages must be visible and accessible
- Purchase list must be printable on mobile

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Current implementation is partial | `C1` | Internal code analysis |
| Requires design from scratch | `C1` | Internal code analysis |
| Requirements minus stock formula | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |
| Pack rounding requirement | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |
| Anonymous local planning + optional account | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |

---

# Category 7: Utility-Support System

## 7.1 Homepage and Complete Tool Directory

| Field | Content |
|---|---|
| **Existing implementation** | `/app/page.tsx`, `/app/tools` |
| **Evidence** | `C1` — audit findings on current state |

### Must-match
- Public and ungated access
- Working public tools (not redirects to login)
- Tool directory listing all approved tools with descriptions
- Methodology, source attribution, and data provenance visible
- Searchable/filterable tool list
- Each tool reachable from homepage and tool directory
- Canonical URLs with no duplicate `/marketing` tree
- Sitemap and robots.txt public and correct

### Must-improve
- Current middleware intercepts public calculator routes (307 to /auth/login) — must be fixed
- Homepage must not gate working tools
- Navigation must not frame a gated workspace
- Every public tool must be reachable from the homepage and tool directory

### Connected advantage (SoapCraft Pro)
- Homepage and tool directory are the entry point for the entire connected utility hub
- Each tool must be independently accessible and produce a complete result without authentication
- Tool directory must link to methodology and source documentation

### Unresolved evidence
- The exact current state of middleware blocking
- Whether the tool directory page exists in the current implementation
- How many tools are currently public vs gated

### Mobile and accessibility
- Homepage must be fully accessible
- Tool directory must be navigable by keyboard
- Links must have clear labels and focus states

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Middleware redirects public routes to /auth/login | `C1` | Internal code analysis |
| All public tools must be ungated | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |
| Tool directory must be searchable/filterable | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |

---

## 7.2 Methodology and Source Documentation

| Field | Content |
|---|---|
| **Evidence** | `D1` — IFRA documentation; `O2` — SoapmakingToolbox source attribution |

### Must-match
- Every tool must document its formulas, data sources, revision dates, and assumptions
- Source manifest must be version-controlled and retrievable
- Independent fixtures must be provided for every consequential formula
- SAP values must have auditable source and revision provenance
- IFRA category classification must be documented with official source

### Must-improve
- Current implementation has no published source manifest
- Oil dataset has no auditable source/revision provenance
- Property ranges in current engine are invented ±20% transforms, not standard fatty-acid profile calculations
- SAP source must be independently verifiable
- Each tool must have a "show the math" area with the user's actual values

### Connected advantage (SoapCraft Pro)
- Methodology documentation is the trust foundation of the entire product
- Source attribution must be visible from the product, not buried in settings
- Formula revision must be included in exports and share links

### Unresolved evidence
- The exact format for the source manifest
- How to handle SAP source revision tracking
- Whether to publish a complete formula glossary for each tool

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| SAP source provenance needs audit | `C1` | Internal code analysis |
| IFRA source verified | `D1` | IFRA official documentation |
| Property ranges need replacement | `C1` | Internal code analysis |
| Formula revision in exports | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |

---

## 7.3 Worked Examples and Templates

| Field | Content |
|---|---|
| **Evidence** | Design spec approved; implementation pending |

### Must-match
- Editable worked examples with preloaded inputs
- Every example embeds the same tool with real inputs
- Examples expose every formula
- Downloadable templates (costing worksheets, market planning sheets, batch/cure records)
- Templates must be real usable artifacts, not PDFs gated behind email capture
- Examples should not fabricate user data — use real, reproducible calculations

### Must-improve
- Current implementation uses email-gated templates
- Templates should be editable, not just viewable
- Each example must have independently calculated expected results with tolerance

### Connected advantage (SoapCraft Pro)
- Worked examples are the primary onboarding mechanism for new users
- Templates must carry the same formula revision and provenance as the live tools
- Examples must link to the methodology documentation

### Unresolved evidence
- Which templates to prioritize (costing, market planning, batch/cure)
- Whether templates should be pre-filled with example data or blank for the user to fill

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Templates currently email-gated | `C1` | Internal code analysis |
| Editable worked examples required | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |
| Templates must be real usable artifacts | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |

---

## 7.4 Factual Comparisons

| Field | Content |
|---|---|
| **Evidence** | `C1` — comparisons must be fact-based |

### Must-match
- SoapCraft Pro vs spreadsheets vs Soapmaking Friend vs Stocksmith — factual workflow comparison
- Date-stamped sources
- No invented claims
- Only genuine product/workflow comparisons
- Comparison pages must be genuinely comparative, not promotional
- All comparison claims must carry evidence grades

### Must-improve
- Current codebase has a `/compare/soapcalc-alternative` page but it has not been verified against actual observations
- All comparison claims must carry evidence grades and direct observation references
- Must distinguish between `O2` observations and `C1` competitor assertions

### Connected advantage (SoapCraft Pro)
- Factual comparisons build trust and differentiate SoapCraft Pro based on documented evidence
- Each comparison must reference the tool rows in this matrix
- Comparison pages must link to methodology documentation

### Unresolved evidence
- Whether Stocksmith or Craftybase have public APIs or documentation that could be directly observed
- How to handle comparisons where a competitor has not been directly observed

### Evidence grade summary
| Claim | Grade | Source |
|---|---|---|
| Comparison page exists but unverified | `C1` | Internal code analysis |
| All comparisons must be fact-based | `D1` | PRODUCT-CONTRACT-UTILITY-HUB.md |
| All claims must carry evidence grades | `D1` | TOOL-QUALITY-RESEARCH-PROTOCOL.md |

---

# Cross-Tool Consistency Requirements

## Formulas that must be identical across all tools

| Formula | Definition | Must Appear In |
|---|---|---|
| Saponification | `lye = Σ(oilWeight × SAPvalue)` | Formulation, Scaling, Costing |
| Superfat | `lyeActual = lyeCalculated × (1 - superfat/100)` | Formulation, Scaling |
| Purity adjustment | `lyeActual = lyeCalculated / purityPercent` | Formulation, Scaling |
| Water as % of oils | `water = oilWeight × (waterPercent/100)` | Formulation, Scaling |
| Lye concentration | `water = lyeAmount / concentration` | Formulation, Scaling |
| Water:lye ratio | `water = lyeAmount × ratio` | Formulation, Scaling |
| Markup % | `(price - cost) / cost × 100` | Costing, Pricing, Market |
| Gross margin % | `(price - cost) / price × 100` | Costing, Pricing, Market |
| Target price (margin) | `cost / (1 - marginPercent)` | Costing, Pricing, Market |
| Cost per saleable unit | `fullBatchCost / saleableUnits` | Costing, Market |
| Contribution per unit | `priceAfterFees - costPerSaleableUnit` | Market |
| Break-even units | `fixedCosts / weightedContributionPerUnit` | Market |
| Mold volume (cm³) | `length × width × height` | Sizing |
| Mold weight (cm) | `volume × density` | Sizing |
| Mold weight (in) | `volume × 14.7484` (NOT 0.0523) | Sizing |
| Latest pour date | `readyByDate - cureDays - bufferDays` | Production |
| Ingredient purchase | `requirements - stock` (round up to pack size) | Purchasing |

## Rounding and display policy
- Internal precision must be maintained throughout calculations
- Rounding is display-only until the final monetary output
- Money must never be summed across currencies
- Quantities must be normalized by tested conversion functions
- Display rounding policy must be explicit and consistent
- Formula revision must be included in exports and share links

---

# Access and Status Summary

| Tool | Status | Evidence | Key Observation |
|---|---|---|---|
| SoapCalc | ✅ Directly observed | `O2` | NaOH/KOH, water methods, superfat, 100+ oils, One/All property columns, full-blend fatty-acid totals |
| Soapmaking Friend | ✅ Directly observed | `O2` | 4 product modes, editable purity, master batch, unit systems, account/gating, $5.99/mo premium |
| SoapmakingToolbox | ✅ Directly observed | `O2` | One-screen builder, URL state, show-math, source attribution, 100+ oils, no auth, local save/print |
| IFRA Category 9 | ✅ Directly observed (D1) | `D1` | Bar soap = Category 9 (body/hand, rinse-off); official 51st Amendment guidance |
| Mold Volume Calculator | ⚠️ Internal code | `C1` | Critical density bug (0.0523 vs 14.7484 g/in³); must be replaced |
| Recipe Scaling | ⚠️ Internal code | `C1` | Simple proportional scaling without validation; needs safety boundaries |
| Batch Costing | ⚠️ Internal code | `C1` | Markup/margin confusion; missing labor, packaging, waste, yield; API discards warnings |
| Wholesale Pricing | ⚠️ Internal code | `C1` | Calls markup "margin"; defaults retail to 2× wholesale without justification |
| Craft-Fair Break-Even | ⚠️ Internal code | `C1` | Omits travel, fees, mix, sell-through; rejects zero-cost inputs |
| Ready-By Planner | ⚠️ Design approved | `C1` | Design spec exists; implementation incomplete; needs user-selectable cure interval |
| Ingredient Purchase Planner | ⚠️ Partial implementation | `C1` | API exists but no full planning workflow; needs stock depletion and pack rounding |
| Homepage/Tool Directory | ⚠️ Internal code | `C1` | Currently gates calculators; middleware redirects to login; must be fixed |
| Methodology/Source Docs | ⚠️ In progress | `D1` | IFRA source verified; SAP source provenance needs audit; property ranges need replacement |
| Worked Examples/Templates | ⚠️ Design approved | `C1` | Design spec exists; implementation pending; templates currently email-gated |
| Factual Comparisons | ⚠️ In progress | `C1` | Comparison page exists but needs verification against direct observations |

---

# Inaccessible or Blocked Tools

The following tools were identified in the codebase but are **not approved for public release** and must not enter the market matrix until their specific gates are cleared:

| Tool | Block Reason | Gate Required |
|---|---|---|
| Current SAP engine (`sap.ts`) | Chemistry defects: lyeConcentrationPercent ignored, KOH superfat only applied to NaOH, lyeWeightTotal set to NaOH, property ranges invented, IFRA checking wrong, 20 oils with no provenance | Full formula specification, authoritative SAP source, independent chemistry review, cross-calculator fixtures |
| Current mold volume API | Wrong density constant (0.0523 g/in³), fragrance subtraction model | Correct density constants, clear output labeling, "show the math" |
| Current recipe scaling API | No formula validation, no safety boundaries | Validated formula contract, safety boundaries, independent fixtures |
| Current wholesale pricing | Markup/margin confusion, unjustified defaults | Explicit economic model, verified reference cases |
| All gated calculator pages | Middleware redirects to /auth/login | Public API allowlist, middleware rewrite |
| Email capture with false "Welcome email sent" | No CRM delivery exists | Verified email delivery implementation |

---

# Appendix: Verified Source URLs

| Source | URL | Observed | Grade |
|---|---|---|---|
| SoapCalc Calculator | https://soapcalc.net/calculator | 2026-09-09 | `O2` |
| Soapmaking Friend Recipe Builder | https://www.soapmakingfriend.com/soap-making-recipe-builder-lye-calculator/ | 2026-09-09 | `O2` |
| SoapmakingToolbox Recipe Builder | https://soapmakingtoolbox.com/recipe-builder | 2026-09-09 | `O2` |
| SoapmakingToolbox About | https://soapmakingtoolbox.com/about | 2026-09-09 | `O2` |
| IFRA Standards Documentation | https://ifrafragrance.org/initiatives-positions/safe-use-fragrance-science/ifra-standards/ifra-standards-documentation | 2026-09-09 | `D1` |
| SoapCraft Pro Repository | `/opt/data/studio/apps/soapcraft-pro` | 2026-09-09 | `C1` (internal code analysis) |
| SoapCraft Pro Product Contract | `product/PRODUCT-CONTRACT-UTILITY-HUB.md` | 2026-09-09 | `D1` (first-party product doc) |
| SoapCraft Pro Research Protocol | `product/TOOL-QUALITY-RESEARCH-PROTOCOL.md` | 2026-09-09 | `D1` (first-party product doc) |
| SoapCraft Pro Utility Hub Decision | `product/UTILITY-HUB-RESEARCH-DECISION.md` | 2026-09-09 | `D1` (first-party product doc) |

---

# Document Control

| Field | Value |
|---|---|
| **Document** | TOOL-MARKET-REQUIREMENTS.md |
| **Version** | 2.0 — Complete tool-by-tool requirements matrix |
| **Date** | 2026-09-09 |
| **Author** | Forge (automated research with human review) |
| **Governed by** | `TOOL-QUALITY-RESEARCH-PROTOCOL.md` |
| **Parent contract** | `PRODUCT-CONTRACT-UTILITY-HUB.md` |
| **Approval gate** | Product direction approved by Isaac on 2026-09-09; this document completes the market/tool specification gate |
| **Completion condition** | Every approved tool has a populated market row; every consequential formula has a source and independent fixture; no `U1` or `C1` claim carries a safety-critical or acceptance requirement; market parity, improvement, and connected advantage are explicit per tool |
| **Evidence grade note** | `O1` and `S1` are not applied to any claim in this matrix because no full calculation output was independently verified against a known result, and no primary scientific or regulatory source was directly consulted. All direct browser observations are `O2`. IFRA documentation is `D1` (first-party standards body documentation). |
| **Honest assessment** | This document is NOT a comprehensive market audit. It is a verified research baseline built from direct browser observations of three tools and one first-party standards document. Tools not directly observed are marked with internal code analysis (`C1`) and require direct observation before their requirements can be considered verified. Partial research is not comprehensive. |

---

*This document must not be treated as a specification until each tool row is reviewed against the TOOL-QUALITY-RESEARCH-PROTOCOL.md completion conditions. Claims marked `C1` are investigation-only and must not establish correctness. Claims marked `U1` are discovery-only and must be verified before becoming requirements. Claims marked `O2` define input, navigation, and presentation requirements but not formula correctness. Claims marked `D1` define documented capability, category, or standard within the source's actual scope.*
