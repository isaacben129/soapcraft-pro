# SoapCraft Pro Utility Hub — Research, Audit, and Decision Package

**Status:** Decision package; implementation remains frozen pending approval  
**Date:** 2026-09-09  
**Repository audited:** `/opt/data/studio/apps/soapcraft-pro`  
**Decision standard:** observable user behaviour and verified source evidence outrank route names, comments, generated page counts, or prior completion claims.

---

## 1. Executive decision

### Recommendation

Continue the utility-site thesis, but **do not launch the generated six-calculator/28-article expansion as-is** and do not position the product as merely a modern SoapCalc alternative.

The best opening is a **public, connected “Batch Economics & Ready-to-Sell Planner” for early-stage cold-process soap sellers**:

1. Enter one batch and its real costs once.
2. Calculate true cost per *saleable cured bar*.
3. Compare retail, wholesale, fees, and target-margin scenarios.
4. Calculate craft-market break-even and stock targets.
5. Back-plan pour dates from a user-chosen ready-by date and cure interval.
6. Export/share the result without an account; offer optional saving, supplier links, and a paid seller worksheet pack after value is delivered.

This is stronger than an isolated cost calculator because present competitors already cover isolated costing well. The defensible unit is the **handoff between cost, price, event target, saleable yield, and production date**, with transparent formulas and no pre-result gate.

### Primary audience

Start with **selling-curious and early commercial cold-process soapmakers producing roughly one to twenty batches per month and preparing for markets or first wholesale orders**. This is narrower and more useful than “all soapmakers”:

- They have urgent economic and planning decisions.
- Their current systems commonly span calculators, spreadsheets, printed sheets, and notebooks.
- They are not yet well served by manufacturing software costing $41+/month.
- They have natural next-step demand for templates, supplies, labels, packaging, and eventually saved multi-batch workflows.

### What not to lead with

- **Not a lye/formulation calculator:** SoapCalc is now modern and advertises 150+ oils; the local safety-critical engine has material defects and only 20 oils.
- **Not isolated batch costing:** Craftybase/Stocksmith, Soapmaking Friend, SoapmakingToolbox, SoapLab, SoapIndex, and others already target this intent.
- **Not “50 pages this week”:** the current 28 posts average about 254 source words and 21 are under 500 words. Page count is not evidence of value.
- **Not a gated SaaS dashboard:** every calculator on both the local production build and the live deployment currently redirects to login.

### North-star metric

**Weekly completed connected planning sessions per qualified visitor** — a session counts only when a visitor completes one calculation and continues to at least one connected output (for example cost → price, price → fair break-even, or sales target → production date).

This metric tests whether the product is a workflow rather than a page-view collection.

---

## 2. Repository and deployment baseline

Captured on 2026-09-09 before any implementation work:

| Item | Verified state |
|---|---|
| Branch | `main` |
| Local HEAD | `9eadb87fb6ef` |
| `origin/main` | `4aceb018696a` |
| Divergence | local is 2 commits ahead, 0 behind |
| Worktree | 50 changed/untracked entries |
| Tracked diff | 24 files, 1,660 insertions, 671 deletions |
| Stashes | 1 |
| Remote | HTTPS URL contains an embedded credential; value intentionally omitted |
| Tests | 77/77 passed |
| Typecheck | passed |
| Production build | passed; 103 generated pages reported |
| Lint | failed |
| Local production server | runs and returns homepage 200 |
| Dev server | process started but did not listen during the audit |
| Live deployment | `https://soapcraft-pro.vercel.app` responds, but calculators and SEO control files redirect to login |
| Vercel provenance | unresolved: transient `npx vercel` dependency failed, so the deployment commit was not guessed |

### Immediate controls before implementation

1. Rotate/revoke the GitHub credential embedded in the remote URL, then replace the remote with a credential-helper or SSH-based URL.
2. Preserve the worktree and stash; create a named safety branch or backup before editing.
3. Reconcile the two local-only commits with the intended source of truth.
4. Do not expose generated calculator routes merely by changing middleware; several formulas are incorrect.

---

## 3. Existing asset audit

### 3.1 Effective route inventory

The source contains 32 page route files and 19 API route files. The production build reports 103 generated pages largely because one dynamic blog route generates 28 posts in two route trees.

#### Public and useful now

| Area | Classification | Finding |
|---|---|---|
| `/` | Improve | Public and visually revised, but navigation still frames a gated workspace and does not expose working public tools. |
| `/blog` and `/blog/[slug]` | Consolidate + rewrite | Public, metadata and Article/Breadcrumb JSON-LD exist, but most content is thin and the duplicated marketing route creates unnecessary complexity. |
| `/pricing` | Remove or defer | Public SaaS pricing conflicts with the approved utility-first validation phase. |
| Auth pages | Keep but de-emphasize | Technically reusable when saving is introduced after public value. |

#### Present in source but effectively unavailable to anonymous visitors

All six calculator pages return HTTP 307 to `/auth/login` locally and live:

- `/calculators/soap-cost-calculator`
- `/calculators/batch-costing`
- `/calculators/recipe-scaling`
- `/calculators/mold-volume`
- `/calculators/craft-fair-break-even`
- `/calculators/wholesale-pricing`

Their `/api/calculate/*` endpoints are also intercepted by middleware. Comments saying “public” and “No auth required” are false at the system boundary.

`/templates`, `/pinterest`, and `/tiktok` are similarly gated. `/sitemap.xml` and `/robots.txt` also redirect to login on the live site, which blocks basic crawl discovery.

#### Older workspace routes

Recipes, batches, cure, costing, library, dashboard, subscription, ingredient-cost, and subscription/payment APIs form a partially implemented authenticated workspace. Treat these as a **latent component bank**, not the immediate product. Keep the underlying domain models where sound; remove them from public positioning until demand for persistent workflows is demonstrated.

### 3.2 Calculation and data audit

Passing tests do not establish chemistry or business correctness. The tests largely encode the implementation’s own assumptions.

#### SAP/formulation engine — replace before public use

`lib/calculations/sap.ts` is not safe to call authoritative:

- `lyeConcentrationPercent` is validated but ignored when calculating water.
- Water is calculated only from `waterToLyeRatio`; accepting both fields without reconciling them permits contradictory inputs.
- KOH is calculated but superfat is applied only to NaOH.
- `lyeWeightTotal` algebraically becomes KOH internally, but the returned field is then set to NaOH.
- Total batch weight uses NaOH only even when KOH is present.
- The engine assumes a fixed 1,000 g oil weight rather than accepting target batch/oil weight.
- “Property ranges” are invented ±20% transforms of coarse custom factors, not standard fatty-acid profile calculations.
- IFRA checking is attached to oils and `maxUsagePercent`; IFRA limits concern fragrance materials/product categories and cannot be inferred from a generic oil list.
- A universal warning above 6% fragrance is not a substitute for supplier-specific IFRA documentation and product-category limits.
- The oil dataset contains 20 records and no auditable source/revision provenance suitable for safety-critical publication.

**Disposition:** quarantine from public use; redesign data contract, source authoritative SAP records, add cross-calculator reference cases and independent chemistry review.

#### Batch costing — useful structure, incorrect labels/economics

Reusable: unit normalization, ingredient-row pattern, missing-cost concept, and cost breakdown.

Defects:

- The input says “Cost” rather than whether it is pack cost, cost per selected unit, or cost per gram.
- The API’s “targetMargin” computes `cost × (1 + percentage)`, which is markup, not gross margin. A target gross margin requires `price = cost / (1 - margin)`.
- The public API adapter throws away the core engine’s missing-cost warnings by filtering incomplete rows first.
- Labor, packaging per bar, waste/trim/samples, payment fees, discounts, taxes, and saleable cured yield are missing.
- “Suggested price” is presented with more confidence than the input supports.

**Disposition:** improve and make the foundation of the initial wedge after formula/UX tests.

#### Wholesale pricing — replace formula model

The route calls markup “desired margin,” applies it as `cost × (1 + percentage)`, then calculates a different retail margin later. It also defaults retail to twice wholesale without showing channel fees, minimum order quantities, discounts, labor, or whether cost already includes overhead.

**Disposition:** replace with an explicit model separating cost, markup, gross margin, channel fees, wholesale discount, and minimum viable price.

#### Craft-fair break-even — improve

The basic fixed-cost/contribution calculation is valid for one product, but validation rejects zero booth cost and zero unit cost despite saying non-negative. It omits travel, event labor, card fees, product mix, expected sell-through, target profit, and stock buffer.

**Disposition:** improve and connect to the batch economics output.

#### Mold volume — block immediately

The centimeter default uses 0.9 g/cm³. The inch default is `0.0523 g/in³`; converting 0.9 g/cm³ gives about **14.7484 g/in³**, not 0.0523. A 12 × 3 × 3 inch mold is therefore estimated as 5.65 g instead of about 1,592.82 g under the same density assumption. The fragrance subtraction is also not a sound general recipe-sizing model.

**Disposition:** replace; do not publish.

#### Recipe scaling — improve only after formulation contract exists

Pure proportional scaling is arithmetically simple, but the current utility accepts arbitrary ingredients and scales lye/water without validating the originating formula, units, alkali type, or target mold. It needs explicit “copy amounts” versus “recalculate from oils/SAP” modes and safety boundaries.

**Disposition:** defer until the validated formulation data contract exists; a non-lye generic ratio scaler may ship separately.

### 3.3 Content and SEO audit

#### Reusable

- Next.js metadata foundation.
- `SITE_URL` helper and intent registry.
- Article and Breadcrumb JSON-LD serialization.
- Blog index/category UI and related-post concept.
- Canonical route opportunity at `/blog`.

#### Must change

- 28 posts average ~254 source words; 21 are below 500. Several safety, tax, legal, labeling, fragrance, cure, and formulation pages are 70–174 words.
- `/blog/[slug]` and `/marketing/blog/[slug]` duplicate the same content architecture.
- Sitemap publishes `/marketing/pricing` and `/marketing/blog`, uses `new Date()` for every URL on every generation, and lists a gated calculator.
- Sitemap and robots are themselves gated by middleware.
- Generated pages contain unsupported universal claims and inadequate source disclosure for safety/legal topics.
- There is no `public/` asset directory; prior claims that OG images were complete are contradicted by the repository.
- Calculator pages need SoftwareApplication/WebApplication only where policy-valid; structured data must match visible content.

**Disposition:** consolidate to one canonical public tree, keep only pages that can be made substantively useful, and noindex/remove thin pages until rewritten.

### 3.4 Analytics, capture, and monetization audit

- PostHog initialization exists, but no meaningful funnel-event calls were found in TSX files.
- The email capture endpoint only logs addresses and falsely responds “Welcome email sent.” No CRM delivery exists.
- The drip endpoint and template endpoint are gated and do not prove delivery.
- Dodo payment/subscription code exists for the old SaaS model but is not evidence of demand.
- There is no verified Search Console, traffic, index, conversion, email-delivery, ad, or affiliate baseline in the audited access.

**Disposition:** keep PostHog plumbing and payment code isolated; replace false-success capture with real consent/delivery before exposing it; instrument the public tool loop first.

### 3.5 Design/UX audit

The uncommitted redesign provides usable typography, color tokens, a navbar, shared calculator shells, and responsive intentions. However:

- Gating prevents end-to-end anonymous use.
- Forms are dense horizontal rows on small screens.
- Units and economic terms are ambiguous.
- Results do not expose formulas/assumptions clearly enough.
- “Save results” triggers an email modal rather than a real save and can imply functionality that does not exist.
- The design reference repository and `node_modules.bak` pollute lint/build scope.
- The repository’s own `scripts/scan-generic.sh` fails on the generated interface: generic “How It Works/Pro Features” language, backdrop blur, a side-stripe alert, pure-black modal overlay, and a hard-coded `rounded-xl` card.

**Disposition:** reuse visual tokens and basic shells; redesign around a mobile, stepwise, connected calculation flow.

---

## 4. Market and workflow evidence

### 4.1 Direct practitioner signals

Search-indexed Soapmaking Forum discussions repeatedly show makers building or requesting spreadsheets for:

- formula design plus cost per ingredient/batch;
- automatic scaling to 500 g, 1,000 g, and 2,500 g oil weights;
- mold dimensions → bar count → batch cost;
- purchase inventory that depletes automatically when batches are made;
- printed SoapCalc sheets, cure cards, binders, batch codes, lot labels, and spreadsheets;
- fragrance/IFRA conversion confusion, especially whether a percentage applies to finished product and how Category 9 limits relate to practical usage.

Representative sources are listed in §12. The forum blocks direct automated access, so these are labeled **search-index evidence**, not direct full-thread quotations.

This evidence supports the connected-input thesis: the pain is not merely arithmetic; it is re-entering and reconciling the same batch across formulation, mold, cost, cure, inventory, and sale.

### 4.2 Competition corrects the original hypothesis

| Competitor | Verified current offer | Implication |
|---|---|---|
| SoapCalc | Modern public calculator; 150+ oils, dual lye, fatty-acid profiles, quality metrics, responsive UI | “Modern SoapCalc” is no longer an opening. |
| Soapmaking Friend | Recipe builder, batches, inventory, costing, community; free capped at 2 recipes/1 batch; premium $5.99/mo | Connected workflows exist cheaply, but require an account and cap persistence. |
| SoapmakingToolbox | Strong free recipe/cost/pricing/fair workflow with labor, overhead, fees, related tools, formulas and substantial supporting content | Isolated free costing and tool interlinking are already competitive. |
| Craftybase → Stocksmith | Free soap cost calculator feeds manufacturing software; Studio $41/mo and higher plans $83–$291/mo annually billed | Strong proof of free-tool → high-value operational SaaS, but the commercial suite targets larger operations. |
| iLovePDF | Core tools free with limits; $4/mo premium removes limits/ads and spans web/mobile/desktop; business/API offers | Transfer the frictionless core-result model and tool adjacency, not the generic PDF economics. |
| General calculator/content entrants | SoapLab, SoapIndex, BatchCalculator, StashQ, Artysan, SoapMetric, and others appear across cost, cure, mold, resize, and break-even queries | Many individual SERPs are crowded; generic calculator-page multiplication is weak differentiation. |

No search-volume or keyword-difficulty tool was available. SERP observations are qualitative and must not be presented as measured demand.

---

## 5. Utility funnel and monetization decision

### Transferable models

1. **Free result → capped persistent workspace**  
   Soapmaking Friend proves a low-price version. Transfer only after repeat saving demand appears.

2. **Free niche calculator → operational software**  
   Craftybase/Stocksmith demonstrates this adjacency. SoapCraft Pro can serve smaller sellers first, then test a saved batch/inventory workspace.

3. **Free core tools → limits/ads removal/API/business**  
   iLovePDF demonstrates value-first conversion. In soapmaking, arbitrary calculation limits would damage trust; paid value should be persistence, multi-batch planning, collaboration, exports, or business integrations.

4. **Free tool → relevant resource/affiliate**  
   A batch plan creates contextual demand for scales, molds, packaging, labels, storage, supplier packs, and insurance. Recommendations must be editorially justified and clearly disclosed.

### Monetization order

1. **Contextual affiliate links** after a result, only where the product/use case is genuinely relevant.
2. **One-time Seller Pack**: editable costing workbook, market planner, batch/cure sheet, wholesale quote sheet, and inventory count sheet.
3. **Optional email sequence** tied to a delivered artifact, not a generic newsletter gate.
4. **Display ads** only after enough traffic exists to assess user impact and network eligibility; no revenue claim is made now.
5. **Paid workspace** only after users demonstrate recurring save, compare, multi-batch, inventory, or lot-tracking behaviour.

Revenue should be modeled from observed inputs rather than copied RPMs:

`monthly revenue = eligible pageviews × observed net RPM / 1,000 + qualified clicks × observed affiliate conversion × net commission + qualified leads × observed purchase conversion × net order value`

### Conversion interface

- Core result: always anonymous and immediate.
- Continue: one-click transfer of inputs to the next calculator.
- Save/share: encoded local/shareable state first; account optional for cloud persistence.
- Email: offered after result for a specific Seller Pack; explicit consent and actual delivery required.
- Paid: no subscription prompt until repeat-use evidence exists.

---

## 6. Opportunity scoring

Weights derive from the utility-hub goal: pain 15%, distribution 10%, competitive opening 10%, workflow value 10%, repeat use 10%, monetization 8%, buildability 8%, low safety risk 10%, existing asset fit 8%, better-free potential 5%, adjacency 4%, and low friction 2%.

Scores are evidence-based judgments (1 weak–5 strong), not market-size measurements.

| Opportunity | Weighted score / 100 | Decision |
|---|---:|---|
| Connected sellable-batch planner | **90.0** | Lead wedge |
| Isolated costing/pricing | 85.6 | Component, not positioning |
| Selling/craft-fair planning | 82.0 | First connected extension |
| Production/cure planner | 75.2 | Add as date planning, not safety prediction |
| Inventory/purchasing | 75.0 | Phase-two repeat-use extension |
| Batch records/traceability | 74.0 | Later persistence feature |
| Mold sizing/recipe resize | 72.2 | Useful, but formula/safety remediation first |
| Formulation/lye calculator | 65.0 | Defer until independently validated |

### Wedge specification

**Promise:** “Know what this batch really costs, what each saleable bar must earn, how many you need to sell, and when to make it.”

**Inputs:** batch material costs or linked recipe totals; packaging; labor; overhead; waste/non-saleable units; expected cured saleable bars; channel fees; selling price; event/wholesale target; user-selected cure interval and ready-by date.

**Outputs:** full batch cost; cost per saleable bar; contribution and gross margin; break-even price; wholesale viability; event break-even/target stock; batches/bars required; latest pour date; assumptions and formula trace; downloadable/shareable plan.

---

## 7. Information architecture and prioritized page plan

### IA

- `/tools` — all public utilities
- `/tools/batch-economics` — connected flagship
- `/tools/pricing/*`
- `/tools/markets/*`
- `/tools/production/*`
- `/tools/molds/*` — only after formula validation
- `/guides/*` — decision guides linked to tools
- `/examples/*` — reproducible worked examples with editable inputs
- `/templates/*` — downloadable artifacts
- `/compare/*` — only genuine product/workflow comparisons
- `/account/*` — optional saving, not core access

### Publish 32 strong pages first; hold pages 33–50 for evidence

Each item has a distinct job. Nearby pages must canonicalize or merge when intent overlaps.

#### Wave 1 — working tools (10)

1. **Batch economics planner** — flagship full-flow tool; seller audience; links to all pricing/market/production tools; differentiator is shared inputs.
2. **Soap cost-per-saleable-bar calculator** — cured sellable yield, waste and samples; links to pricing and worked example.
3. **Gross-margin vs markup calculator for soap** — explains and computes both; links to wholesale and pricing guide.
4. **Soap wholesale price calculator** — channel fees, discount and MOQ scenarios; links to quote template.
5. **Craft-fair break-even calculator for soap** — product mix, fees, labor and target profit; links to stock planner.
6. **Craft-fair soap stock planner** — revenue goal, expected sell-through, product mix; links to production back-plan.
7. **Soap batch ready-by date planner** — user-selected cure interval, pour/cut/ready dates; never predicts safety.
8. **Soap production back-planner** — required bars/batches and latest pour dates; links from fair/wholesale tools.
9. **Ingredient purchase planner for upcoming batches** — requirements minus stock, pack rounding; no persistent inventory needed.
10. **Soap mold capacity calculator** — release only with corrected units, named assumptions and reference tests.

#### Wave 2 — decision guides (10)

11. True cost of handmade soap: ingredients, labor, overhead, waste and fees.
12. Gross margin vs markup for soapmakers.
13. How to price soap for retail without using a universal multiplier.
14. How to price soap for wholesale and test a retailer discount.
15. How to calculate saleable yield after trim, samples and defects.
16. How to decide whether a craft fair can break even.
17. How much soap to bring to a craft fair: assumptions and buffers.
18. How to back-plan cold-process batches for a market date.
19. How to calculate ingredient purchases from a production plan.
20. Batch records for small soap businesses: practical fields and limits of compliance claims.

#### Wave 3 — worked examples (8)

21. Ten-bar batch: full cost and price sensitivity.
22. Forty-eight-bar batch: labor and overhead sensitivity.
23. $75 craft table: bars required at three contribution levels.
24. Mixed-product fair: bars, gift sets and samples.
25. First wholesale order: margin, MOQ and production requirement.
26. Holiday market ready-by plan: user-selected six-week interval.
27. Supplier pack-size purchase example for three batches.
28. Mold capacity example in inches and centimeters with unit cross-check.

Every example embeds the same tool with preloaded inputs and exposes every formula, making it more than prose and preventing duplicate intent.

#### Wave 4 — resources and comparisons (4)

29. Free printable soap batch-cost worksheet.
30. Free craft-market planning worksheet.
31. Free batch/cure record sheet.
32. SoapCraft Pro vs spreadsheets vs Soapmaking Friend vs Stocksmith — factual workflow comparison with date-stamped sources and no invented claims.

### Conditional expansion to 50

Only add pages 33–50 after Search Console queries, on-site search, support questions, and tool events reveal distinct unmet intents. Candidate families include currency/local fee variants, supplier-pack scenarios, wholesale quote workflows, saved mold workflows, and traceability templates. Do **not** create near-duplicate pages solely by changing a number, location, oil, or keyword.

---

## 8. SEO and distribution plan

### Search

1. Make tools, sitemap, robots, and required calculation APIs public.
2. Collapse `/marketing/blog/*` into canonical `/blog/*` redirects.
3. Remove gated, thin, and obsolete routes from sitemap.
4. Use stable, truthful `lastModified` values from content metadata.
5. Ship one useful cluster at a time: tool → guide → example → template.
6. Each page must contain a working tool, original calculation, verified data, useful template, or substantial evidence synthesis.
7. Add methodology/source sections and updated dates, especially on safety/business pages.
8. Validate structured data against visible content; schema is not a ranking substitute.
9. Connect Search Console and submit the corrected sitemap; record indexed/excluded reasons.

Google’s current guidance permits generative AI use, but warns that generating many pages without adding user value may violate scaled-content-abuse policy. The operating rule here is therefore: AI may help research/draft, but every publication requires verified facts, unique utility, editorial review, and a reason to exist.

### Pinterest

Publish visual artifacts derived from verified pages: cost breakdown diagrams, margin-vs-markup examples, market packing checklists, and ready-by timelines. Each pin must stand alone and point to the directly matching tool, not the homepage.

### TikTok/short video

Demonstrate one decision in 20–45 seconds: “why $5 bars lose money,” “markup is not margin,” or “how many bars cover a $75 table.” Use the actual tool and show assumptions. No invented earnings or fear-based safety content.

### Communities

Read each community’s current rules before posting. Prefer answering existing questions fully; mention a tool only when allowed and directly useful. No automated posting, backlink drops, or artificial community launch.

### Paid tests

No spend without approval. After organic conversion instrumentation works, a proposed test may use a small fixed cap, one landing tool, one completion event, and a predeclared stop condition. Paid traffic must not be used to hide weak organic utility.

---

## 9. Technical and design revamp plan

### Seams first

`BatchInput → EconomicsResult → SellingScenario → ProductionRequirement → ReadyByPlan`

Each module must accept a versioned, typed contract and preserve assumptions/provenance. Calculations should be pure TypeScript functions; UI and API adapters must not redefine formulas.

### Reuse

- Next.js App Router and existing design tokens.
- Shared result cards/form scaffolding after accessibility revision.
- Unit-normalization concepts after exhaustive tests.
- PostHog initializer, intent registry, JSON-LD serializer, authenticated domain models, and optional payment integration where they fit the new contract.

### Replace or isolate

- Middleware allowlist architecture: define explicit public tool/content/SEO routes and separate account APIs.
- SAP/formulation, mold, margin/markup and wholesale formulas.
- Duplicate blog tree and thin generated posts.
- False email success path.
- Old pricing-first homepage and subscription prompts.

### Quality gates

1. Formula spec with units and terminology before UI.
2. Independent reference examples, property tests, boundary tests, and unit-conversion round trips.
3. Safety-critical chemistry data must include source, revision, and review owner.
4. Cross-browser mobile E2E for anonymous complete/continue/share/export flows.
5. Accessibility: labels, keyboard flow, errors, focus, contrast, and screen-reader result announcement.
6. SEO checks: 200 responses, canonical, indexability, sitemap membership, structured-data validation, unique title/H1, and internal links.
7. No success message unless the external side effect is verified.

---

## 10. Measurement and validation milestones

### Event contract

Track aggregate events without sensitive recipe contents:

- `tool_viewed`
- `calculation_started`
- `calculation_completed`
- `connected_tool_opened`
- `plan_exported`
- `share_link_created`
- `email_offer_viewed`
- `email_delivery_confirmed`
- `affiliate_link_clicked`
- `account_save_requested`
- `workspace_interest_submitted`

Properties: tool, source page, device class, new/returning, anonymous flow ID, and validation/error category. Do not send ingredient notes, email addresses, or full recipes to analytics.

### Decision milestones (test thresholds, not industry benchmarks)

1. **Technical release gate:** 100% of selected public pages return 200 anonymously; zero high-severity formula failures; sitemap/robots public; lint/typecheck/tests/build/E2E pass.
2. **Utility signal:** collect at least 100 genuine completed flagship sessions before judging downstream behaviour.
3. **Workflow signal:** at least 15% of completed sessions continue to a connected result. If lower, test the seam/CTA before adding more tools.
4. **Repeat signal:** observe meaningful returning-tool usage over four weeks; segment by use case rather than using a vanity visitor count.
5. **Offer signal:** measure worksheet delivery and paid-resource interest; build a workspace only if save/multi-batch/inventory requests recur.
6. **SEO signal:** review index coverage, query-page fit, impressions, clicks, and pages with zero impressions after sufficient crawl time; consolidate rather than endlessly publish.

These thresholds are internal falsification criteria. They are not revenue forecasts.

---

## 11. Phased roadmap and acceptance criteria

### Phase 0 — secure and recover the baseline

- Rotate embedded remote credential.
- Back up current branch, uncommitted work, and stash.
- Reconcile local-only commits and identify deployed commit.
- Exclude `node_modules.bak` and design-reference code from lint/build inputs without deleting evidence.

**Accept when:** clean reproducible baseline, secret removed, provenance documented, no work lost.

### Phase 1 — public flagship vertical slice

- Implement shared contracts and corrected economics functions.
- Build batch economics → craft-fair break-even → production back-plan as one anonymous flow.
- Expose transparent formulas, assumptions, editable results, local/share state, and real export.
- Add one guide and one worked example.
- Instrument event contract.

**Accept when:** reference tests and E2E pass; anonymous user gets all core results without login/email; no terminology ambiguity; pages are indexable.

### Phase 2 — complete the first cluster

- Add wholesale, saleable yield, stock target, ready-by dates, and purchase planning.
- Publish the 32-page plan only as each utility/source requirement is met.
- Implement actual consented Seller Pack delivery.

**Accept when:** every page has unique intent and functional/substantive value; no thin/duplicate pages; delivery is verified.

### Phase 3 — validate monetization

- Add disclosed contextual affiliate tests and one-time resource purchase.
- Evaluate ads only with real traffic/network terms.
- Collect workspace-demand events/interviews.

**Accept when:** revenue and conversion are based on observed cohorts, not borrowed benchmarks.

### Phase 4 — optional workspace

- Saved recipes/batches, multi-batch planning, inventory, lot records, and collaboration only in response to validated repeat demand.

**Accept when:** paid boundaries add persistence/operations, never withhold a core public result.

### Deferred chemistry track

Rebuild lye/formulation, mold-to-recipe, fragrance and IFRA utilities only under an independently reviewed safety-data/testing program.

---

## 12. Sources and evidence strength

### Directly inspected official/product sources

- Google Search Central, generative AI content: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Google Search spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Google helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google structured-data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- SoapCalc current product/calculator: https://soapcalc.net/
- Soapmaking Friend product and pricing: https://www.soapmakingfriend.com/
- SoapmakingToolbox costing workflow: https://soapmakingtoolbox.com/calculators/soap-cost-calculator
- Stocksmith pricing (Craftybase redirect): https://stocksmith.io/pricing/
- iLovePDF pricing: https://www.ilovepdf.com/pricing
- FDA small-business cosmetics fact sheet: https://www.fda.gov/cosmetics/resources-industry-cosmetics/small-businesses-homemade-cosmetics-fact-sheet
- FDA MoCRA overview: https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022-mocra

### Search-index evidence; full pages were blocked by the forum

- Free soap/candle Excel tool: https://www.soapmakingforum.com/threads/free-tool-soap-and-candle-making-excel-spreadsheet.94342/
- Spreadsheet recipe/cost tool: https://www.soapmakingforum.com/threads/soapmaking-spreadsheet-recipe-tool.91022/
- Costing spreadsheet request: https://www.soapmakingforum.com/threads/spreadsheet-for-soapcosting-etc.82851/
- Google Sheet alternative to Craftybase/Soapmaker Pro: https://www.soapmakingforum.com/threads/google-sheet-alternative-to-craftybase-or-soapmaker-pro.93510/
- Batch data tracking: https://www.soapmakingforum.com/threads/data-tracking-each-batch-of-soap-made.69048/
- Batch code/lot tracking: https://www.soapmakingforum.com/threads/tracking.42250/
- IFRA usage-rate confusion: https://www.soapmakingforum.com/threads/ifra-fragrance-usage-rates-how-do-people-calculate-these.96051/

### Qualitative SERP competitors; features require direct verification before comparative publication

- https://www.soaplab.net/cost-per-bar-calculator
- https://soapindex.com/tools/cost-calculator
- https://batchcalculator.com/soap/pricing-calculator
- https://stashq.app/tools/soap-pricing-calculator/
- https://soapcalculator.app/cure-tracker/
- https://soapmetric.com/en/cure-time
- https://soapmakingtoolbox.com/calculators/batch-resizer
- https://latherandlye.com/tools/mold-volume-calculator

---

## 13. Unresolved questions

1. What commit is currently deployed on Vercel? CLI provenance retrieval failed.
2. Is a production custom domain connected beyond the Vercel URL?
3. Do Search Console, PostHog, or Vercel Analytics contain meaningful historical data?
4. Which regions/currencies matter first?
5. Will target users enter per-pack prices, batch totals, or ingredient unit costs most naturally?
6. Which export is genuinely wanted: printable batch sheet, editable spreadsheet, PDF, calendar, or all?
7. Are affiliate relationships available with suppliers the audience already trusts?
8. Which chemistry authority/reviewer and dataset can sign off on SAP, water, mold, fragrance, and IFRA logic?

These do not block approval of the product direction. They must be resolved at the relevant phase gate.

---

## Approval decision requested

Approve, revise, or reject the following product contract:

> Build a public connected batch-economics and ready-to-sell planning workflow for early soap sellers; keep core outputs ungated; monetize adjacent resources before considering a paid workspace; defer formulation chemistry until independently validated; publish 32 evidence-backed pages before considering expansion to 50.

No implementation should begin until this decision and the companion draft contract are approved.
