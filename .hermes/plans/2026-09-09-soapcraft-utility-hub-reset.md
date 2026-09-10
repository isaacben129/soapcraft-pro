# SoapCraft Pro Utility Hub Research and Revamp Plan

> **For Hermes:** This is a planning and research program first. Do not invoke StudioForge implementation until the research package and replacement product direction receive Isaac's approval. After approval, compile the product contract and then use StudioForge slice-by-slice with a cheaper implementation model.

**Goal:** Reposition and revamp the existing SoapCraft Pro site into an ungated, comprehensive, interlinked library of genuinely useful soapmaking tools, supported by a high-quality SEO/content system and evidence-based monetization.

**Architecture:** The public website is the primary product. Each utility route owns one distinct user job and returns its useful result without account creation. The homepage exposes the full tool library; guides, examples, worksheets, and reference pages support tool discovery and use. Existing workspace capabilities may be retained as optional save/sync/history infrastructure, but they must not gate the core calculation or dictate the public information architecture.

**Tech Stack:** Existing Next.js application and calculation libraries, existing test framework, existing SEO plumbing where verified, Vercel deployment, PostHog/Search Console only where connected and verified.

---

## 1. Product reset and source-of-truth rule

### Replacement thesis

SoapCraft Pro is "I Love PDF for soapmaking":

- a comprehensive collection of free soapmaking utilities;
- every important tool visible from the homepage and tool index;
- one clear, complete job per tool page;
- no login before the core result;
- contextual links between related tools and supporting content;
- SEO pages exist because they satisfy distinct intents, not to reach a page quota;
- monetization is layered around usefulness, not used to cripple usefulness;
- an optional account may support saving, syncing, history, exports, and repeat workflows later.

### Explicitly superseded assumptions

The following old assumptions must not drive implementation unless research independently revalidates them:

- SoapCraft Pro is primarily a private SaaS workspace.
- The central product must be recipe → batch → cure → cost.
- Free usage is limited to three recipes or one active batch.
- Login is required to use core tools.
- A subscription is the default or only monetization route.
- The homepage should primarily sell the workspace rather than expose the utility library.
- More connected state is automatically more valuable than fast, standalone utility.

### Preservation rule

Do not delete or rewrite existing product code during research. Treat all current work as potentially reusable. Preserve:

- deterministic calculation logic;
- verified datasets and source manifests;
- safety-critical tests and fixtures;
- existing calculator routes and forms;
- SEO metadata helpers, intent registry, sitemap/robots implementation, and validators where they actually work;
- existing articles and structured content records that pass quality review;
- design components and branding that support the utility-hub direction;
- optional authenticated workspace behavior that can coexist without gating tools.

The old PRD remains historical evidence only. Do not hand it to a coding model as implementation authority.

---

## 2. System frame

### Primary user outcome

A soapmaker arrives with a specific problem, completes the calculation or planning task immediately, understands the result, and can move to the next related task without rebuilding inputs unnecessarily.

### Business outcome

Build a compounding utility asset that attracts qualified soapmaking traffic, earns repeat use and trust, and produces measurable downstream value through appropriate offers.

### North-star metric

**Useful tool completions by qualified users per week.**

A tool completion must represent a real computed result or finished worksheet, not a page view or button click.

### Supporting metrics

- organic impressions and clicks by intent-owner page;
- tool-start → valid-result completion rate;
- repeat tool users over 30 and 90 days;
- related-tool continuation rate;
- worksheet/download/email conversion after the result;
- revenue per 1,000 qualified sessions by monetization channel;
- indexed useful pages, excluding thin or duplicate routes;
- calculation error reports and verified safety defects;
- content-assisted tool completions;
- tool-assisted conversions to optional paid or affiliate offers.

### Constraints

- No implementation before audit/research approval.
- No account gate before a tool's core result.
- No invented search volume, RPM, conversion, chemistry, or competitor performance.
- No safety-critical formula or dataset change without sources, reference cases, tests, and review.
- No generated page count as a success metric.
- No content publishing automation that makes editorial judgments in scripts. Scripts are plumbing; agents draft and review; humans approve safety-critical claims and initial publishing batches.
- Preserve the existing dirty working tree until its provenance is established.

---

## 3. Target product layers

### Layer A: Public utility library — primary product

Potential families to validate rather than assume:

1. **Formulation and recipe utilities**
   - lye/formulation calculator;
   - recipe scaling;
   - oil percentage converter;
   - dual-lye calculations;
   - mold-volume and batch-size utilities;
   - recipe comparison.

2. **Costing and pricing utilities**
   - batch cost;
   - cost per cured/saleable bar;
   - retail price and target margin;
   - wholesale pricing;
   - craft-fair break-even;
   - packaging, labor, overhead, waste, and discount calculators.

3. **Production and curing utilities**
   - cure-date calculator;
   - batch schedule/planning;
   - target inventory and production requirement;
   - unmold/cut/cure worksheets;
   - ready-for-sale planning.

4. **Inventory and purchasing utilities**
   - ingredient requirement by planned batches;
   - supplier pack-size conversion;
   - reorder-point and lead-time calculator;
   - purchasing list generator.

5. **Batch records and traceability**
   - printable batch sheet;
   - recipe-version comparison;
   - ingredient lot/supplier record;
   - batch outcome worksheet.

6. **Fragrance and usage worksheets**
   - only after authoritative-source and safety boundaries are established;
   - never imply universal safe fragrance rates;
   - separate supplier/IFRA documentation handling from general costing math.

7. **Selling utilities**
   - wholesale order planner;
   - craft-market stock planner;
   - order profitability;
   - production capacity and deadline planning.

These are research candidates, not approved scope.

### Layer B: Supporting content system

Each content route must support a tool, answer a distinct problem, or provide a verified reference. Accepted value forms:

- working interactive utility;
- original calculation or worked example;
- downloadable worksheet/template;
- verified reference table with sources and revision metadata;
- detailed tutorial connected to a tool;
- synthesis of documented user problems;
- meaningful comparison with reproducible criteria.

AI prose by itself does not justify a URL.

### Layer C: Optional continuity features

Only after the public utility works:

- save inputs/results;
- sync across devices;
- history and reusable profiles;
- supplier/catalog presets;
- exports and printable bundles;
- connected multi-step business workflows.

These features can justify account creation or a future paid offer, but must not remove the public tool's useful result.

### Layer D: Monetization interfaces

Validate independently:

- display ads after traffic, geography, eligibility, UX cost, and RPM evidence justify them;
- contextual affiliate links to relevant suppliers or equipment;
- paid worksheets, record packs, calculators, or educational bundles;
- premium save/sync/history/workspace convenience;
- sponsor or supplier referrals;
- other offers found through research.

Do not design the free experience backward from an assumed subscription.

---

## 4. Phase 0 — Freeze and map the current baseline

**Objective:** Prevent accidental regression or loss before research starts.

### Tasks

1. Record current branch, HEAD, remotes, stash list, and all dirty paths.
2. Establish whether `soapcraft-pro` or any synced copy is the repository of record.
3. Trace the uncommitted changes to their originating session/goal.
4. Inventory deployed URLs and identify the exact deployed commit.
5. Record all current environment-dependent services without exposing secrets.
6. Create a read-only baseline report that distinguishes committed, uncommitted, stashed, deployed, and planned behavior.

### Acceptance criteria

- No source file changes.
- Every audited code claim is pinned to a commit plus dirty-worktree state.
- Existing uncommitted work is not overwritten, reset, reformatted, or silently folded into a new plan.
- Canonical repository and deployment are known, or the missing access is explicitly documented.

---

## 5. Phase 1 — Audit the existing product as an asset bank

**Objective:** Determine what can be reused in the utility-hub model.

### Audit dimensions

1. Current routes and their real user-observable behavior.
2. Working tools versus static landing pages, demo state, or disconnected forms.
3. Core-result gating and account dependencies.
4. Calculation libraries, datasets, sources, unit handling, tests, and boundary cases.
5. Shared inputs/components that can power multiple tools.
6. Design system, mobile usability, navigation, homepage discoverability, and tool completion UX.
7. SEO implementation: metadata, canonicals, sitemap, robots, schema, URL structure, internal links, indexability, rendered content, and crawl truthfulness.
8. Content records, categories, templates, validators, and publishing state.
9. Analytics, Search Console, conversion events, and missing instrumentation.
10. Domain, Vercel project, deployment state, performance, and error behavior.
11. Existing workspace/auth/billing features that could remain optional.
12. Broken flows, technical debt, duplicative routes, and misleading claims.

### Classification output

Classify every route, tool, component family, and planning artifact as:

- **Keep** — already fits and works.
- **Improve** — correct role, incomplete quality or behavior.
- **Consolidate** — overlaps another route or tool family.
- **Repurpose** — useful asset, wrong current framing.
- **Replace** — cannot meet the target system economically.
- **Remove** — misleading, unsafe, duplicate, or valueless.
- **Historical only** — planning artifact that must not guide implementation.

### Acceptance criteria

- Every listed tool is manually exercised where feasible.
- “Route exists” is never reported as “tool works.”
- Core calculations have actual test evidence.
- Existing assets are mapped to target layers A–D.
- No rewrite recommendation is accepted without explaining why targeted improvement is insufficient.

---

## 6. Phase 2 — External evidence research

Run the following research tracks in parallel, then synthesize them. Use current sources and preserve URLs, dates, quoted complaint language, and evidence confidence.

### Track A: Utility-site business models

Study relevant examples across:

- free utility → paid product;
- free utility → email/resources;
- ad-supported calculator/content sites;
- calculator/template businesses;
- niche directories/marketplaces;
- free/open alternatives monetized through adjacent offers;
- hub-and-spoke utility SEO;
- Pinterest/short-video evergreen utility distribution;
- community-informed products without empty forum-building.

For each example, record:

- acquisition mechanism;
- free value delivered;
- conversion point;
- monetization mechanism;
- evidence that it operates as claimed;
- what is and is not transferable to soapmaking.

### Track B: Soapmaking workflow complaint mining

Search practitioner discussions, forums, supplier resources, YouTube descriptions/comments where accessible, spreadsheet requests, Etsy/template markets, and small-business communities.

Capture repeated language around:

- costing and pricing;
- cure and production scheduling;
- inventory and purchasing;
- batch traceability;
- fragrance/IFRA paperwork;
- recipe resizing and molds;
- selling, wholesale, fairs, and capacity.

For each complaint cluster, record:

- user and context;
- current workaround;
- frequency/recurrence evidence;
- consequence of failure;
- tools already used;
- remaining seam;
- whether a narrow free utility can produce immediate value.

### Track C: Competitive research

At minimum inspect SoapCalc, Soapmaking Friend, Soapee or current equivalents, soap business/formulation products, calculators offered by suppliers/content publishers, paid spreadsheet/template products, and any current competitors discovered during research.

Compare:

- workflow coverage;
- free/paid boundary;
- pricing and monetization when verifiable;
- calculation depth and trust;
- UX/mobile quality;
- SEO/content architecture;
- brand/community advantage;
- switching cost;
- cumbersome handoffs;
- focused differentiation opportunities.

Competitor presence is demand evidence, not an automatic negative. Reject a proposed wedge only when an incumbent serves the target user and workflow seam well enough that a new free experience would not be meaningfully better.

### Track D: Search and SERP research

Research actual results and intent for clusters including:

- soap calculator;
- lye calculator;
- soap cost calculator / cost per bar;
- soap pricing / wholesale pricing;
- soap batch tracker / batch record;
- soap cure date / cure calculator;
- soap mold size / batch size;
- soap recipe scaling;
- fragrance usage and worksheets;
- soap inventory and production planning;
- craft-fair break-even and stock planning.

For each query family:

- identify result types and dominant domains;
- classify intent;
- note tool versus article preference;
- document content quality and gaps;
- identify cannibalization risk;
- record measured volume/difficulty only when a named tool provides it;
- otherwise label findings qualitative.

### Track E: Current search-policy research

Use current official Google Search documentation to verify:

- guidance on generative AI content;
- scaled content abuse;
- people-first content;
- helpful original value;
- structured data and spam-policy boundaries.

Do not reduce this to “AI content is allowed.” Translate the policy into operational publication gates.

### Acceptance criteria

- Claims distinguish verified fact, estimate, inference, and open question.
- No invented traffic, revenue, RPM, volume, conversion, or competitor capability.
- Evidence comes from direct/primary sources where available.
- Complaint clusters include actual user language, not only SEO articles.
- Blocked sources and access limitations are named.

---

## 7. Phase 3 — Select the opening wedge and audience

**Objective:** Decide what the first utility cluster should own, without assuming batch costing wins.

### Candidate scoring dimensions

Score each candidate 1–5 with written evidence for:

1. user-pain evidence;
2. search/distribution opportunity;
3. incumbent coverage of the exact seam;
4. economic/user value;
5. repeat-use potential;
6. monetization adjacency;
7. complexity and maintenance;
8. safety/regulatory risk;
9. reuse of current assets;
10. ability to deliver a meaningfully better free result;
11. natural adjacency to additional useful tools;
12. data-entry friction before value.

Weights must be set before scoring. Safety risk and weak evidence should be explicit penalties; competitor existence alone should not be.

### Wedge candidates to compare

- formulation/lye calculation;
- batch costing and pricing;
- production/cure planning;
- inventory/purchasing;
- batch records/traceability;
- mold/recipe resizing;
- selling/wholesale/craft-fair planning;
- any stronger seam discovered during research.

### Decision output

Produce:

- ranked opportunity matrix;
- recommended first audience;
- falsifiable gap statement;
- “why use this instead?” argument;
- first 3–5 tool cluster;
- strongest rejected alternatives and why;
- evidence still required;
- advance/change/kill decision.

### Gate

Isaac approves the audience, positioning, first tool cluster, and public/free boundary before architecture or implementation planning begins.

---

## 8. Phase 4 — Design the utility information architecture

**Objective:** Turn the approved wedge into an I Love PDF-style navigable product, not a blog with incidental calculators.

### Proposed IA pattern

- `/` — tool-library homepage exposing all validated tools by job family.
- `/tools` or `/calculators` — canonical complete utility index.
- `/tools/[tool-slug]` — one canonical route per distinct utility intent.
- `/guides/[slug]` — tutorials and problem-solving guides.
- `/examples/[slug]` — worked examples tied to tools.
- `/templates/[slug]` — downloadable/interactive worksheets.
- `/reference/[slug]` — sourced reference material.
- Optional `/workspace` or account routes — save/sync/history only, not the default entry.

Final route names come from SERP and code audit evidence, not this placeholder taxonomy.

### Tool-page contract

Every tool page must include:

1. immediately visible job and input boundary;
2. complete ungated core result;
3. formula/method explanation appropriate to risk;
4. units, defaults, validation, and error states;
5. worked example;
6. safety limitations and sources where relevant;
7. reset/share/print/download behavior where valuable;
8. contextual next tool;
9. supporting guide/reference links;
10. optional post-result save/email/offer, never pre-result obstruction;
11. page-specific metadata, canonical, and relevant truthful schema;
12. named analytics events for start, validation failure, completion, next-step, and conversion.

### Homepage contract

The homepage must:

- show the tool catalog above or near the primary fold;
- group tools using soapmakers' jobs/language;
- make every live tool reachable;
- distinguish tools from guides/resources;
- prioritize utility discovery over a generic SaaS pitch;
- expose recent/popular/recommended tools only when the signals are real;
- remain usable on mobile;
- include content and monetization without burying the tools.

### Input reuse

Investigate client-side handoff or optional profiles so users can move between related tools without re-entering the same batch weight, costs, yield, or mold dimensions. This convenience must work without compulsory signup where technically reasonable.

---

## 9. Phase 5 — Build the quality-constrained content map

**Objective:** Plan up to 50 pages only when each has a distinct job and substantive value.

### Content planning order

1. Tool intent-owner pages.
2. Tool documentation and worked examples.
3. High-value templates/worksheets.
4. Problem-solving guides supported by complaint research.
5. Sourced reference pages.
6. Comparisons only where switching criteria are meaningful.

### Per-page specification

Each proposed page records:

- canonical path;
- primary intent;
- audience and situation;
- unique value artifact;
- related tool;
- supporting and outgoing links;
- source/data requirements;
- conversion role;
- overlap/cannibalization check;
- editorial/programmatic mode;
- publication dependency;
- safety review requirement;
- acceptance criteria.

### Page-count gate

Recommend fewer than 50 when the research cannot support 50 distinct, useful intents. No near-duplicate city, ingredient, oil, unit, or wording variants merely to increase URL count.

### Publication model

- Editorial pages: agent-assisted research and drafting, human approval before initial publication.
- Structured pages: deterministic rendering from curated, reviewed records.
- Scripts may collect, validate, link-check, build, and report; they may not generate or make editorial decisions.
- Sitemap includes only approved, indexable, complete routes.

---

## 10. Phase 6 — Funnel and monetization experiments

**Objective:** Attach relevant next steps after value delivery and discover what users will pay for.

### Funnel principles

- Core result first.
- Next action matches the completed job.
- Email capture has a declared user benefit and lifecycle.
- No generic newsletter solely to collect addresses.
- No community product without evidence that active peer interaction improves the workflow.

### Candidate post-result offers to validate

- save or reuse this calculation;
- download a useful worksheet/record;
- calculate the next linked decision;
- get a sourced reference or supplier checklist;
- purchase a deeper template/bundle;
- use an optional paid continuity workspace;
- visit a relevant supplier through a clearly disclosed affiliate link.

### Experiments

Define small, capped tests with:

- hypothesis;
- audience/channel;
- landing route;
- conversion event;
- minimum evidence threshold;
- time or traffic window;
- stop condition;
- maximum approved spend, defaulting to zero until Isaac explicitly approves.

---

## 11. Phase 7 — Safety and calculation assurance

**Objective:** Establish a release contract for consequential calculations before expanding them.

### Required artifacts

- calculation inventory;
- formula/source manifest;
- dataset provenance and revision metadata;
- unit and rounding policy;
- boundary/invalid-input matrix;
- reference test cases from authoritative sources;
- cross-calculator consistency tests;
- disclaimer and limitation matrix;
- human/domain approval gate for lye, water, fragrance/IFRA, or safety claims.

### Hard rule

No coding model may invent or modify chemistry formulas, safety thresholds, SAP values, IFRA limits, or authoritative reference data. It may implement an approved, versioned contract and tests.

---

## 12. Phase 8 — Replacement product contract

Only after Phases 0–7 are synthesized and Isaac approves the direction:

1. Archive/supersede the old SaaS-first PRD explicitly.
2. Create a new utility-hub `product/PRD.md`.
3. Create `product/FLOWS.md` for anonymous tool completion, related-tool handoff, optional save, downloads, and conversions.
4. Create `product/ARCHITECTURE.md` defining public tool contracts, calculation boundaries, content modes, SEO registry, optional account services, analytics, and failure behavior.
5. Create `.studio/acceptance.json` with user-observable acceptance rows.
6. Create `.studio/slices.json` with dependency-ordered vertical slices.
7. Preserve current code classifications so the contract says keep/improve/repurpose/replace rather than pretending the repository is greenfield.
8. Independently critique the product contract for competitive positioning, safety, SEO cannibalization, ungated-value regressions, and low-capability-model ambiguity.

### Contract gates

- Every tool's core result is explicitly anonymous/ungated.
- Homepage/tool-index discoverability has deployed acceptance tests.
- Each route owns one primary intent.
- Safety-sensitive tools have approved sources and reference cases.
- Optional accounts add continuity but do not remove free results.
- Public claims correspond to live behavior.
- No stale free-tier, three-recipe, one-batch, or SaaS-first language remains unless deliberately retained for an optional workspace.

---

## 13. Phase 9 — StudioForge implementation with a cheaper model

Use the cheaper model only after the replacement contract is approved.

### Implementation order

1. **Baseline protection and regression harness**
   - preserve current working state;
   - verify build/tests;
   - add route/tool smoke tests;
   - lock calculation reference tests.

2. **Public utility shell**
   - homepage tool catalog;
   - complete tool index;
   - global navigation/search/category system;
   - anonymous access contract;
   - mobile and accessibility states.

3. **First approved tool cluster**
   - one complete vertical slice at a time;
   - form → validation → calculation → result → explanation → next tool → analytics;
   - deploy and visually verify each slice.

4. **SEO source of truth**
   - intent registry;
   - metadata/canonical/schema contracts;
   - truthful sitemap and robots;
   - internal links and orphan detection.

5. **Supporting content pilot**
   - publish 3–5 reviewed pages around live tools;
   - validate quality, indexing, completion, and conversion before scaling.

6. **Optional continuity layer**
   - save/sync/history/export only after anonymous utility quality is proven.

7. **Scale toward the approved content map**
   - add pages in evidence-backed batches;
   - measure and prune/consolidate weak routes;
   - do not bulk-publish 50 URLs in one undifferentiated wave.

### Cheaper-model control system

Each slice must provide:

- exact paths;
- existing assets to reuse;
- behavior contract;
- banned regressions;
- input/output examples;
- error and empty states;
- unit, integration, E2E, and deployed acceptance checks;
- visual reference and responsive criteria;
- safety stop conditions;
- one focused commit;
- independent spec and code-quality review before merge.

The cheaper model must never receive “implement the whole PRD.”

---

## 14. Research package deliverables

Before implementation, deliver:

1. Executive summary and recommended business thesis.
2. Sourced utility-site funnel and monetization study.
3. Exact existing-project baseline and asset audit.
4. Competitor and workflow-opportunity matrix.
5. Ranked wedge and audience recommendation.
6. Utility-centered information architecture and conversion funnel.
7. Researched, prioritized plan for up to 50 useful pages.
8. Technical/design revamp plan based on keep/improve/consolidate/repurpose/replace/remove.
9. SEO and distribution plan.
10. Safety/calculation assurance plan.
11. Measurement and validation framework.
12. Phased implementation roadmap with acceptance criteria.
13. Explicit unresolved questions and the evidence required to resolve them.

---

## 15. Immediate next action

Do not build or rewrite the PRD yet.

Execute the research program in this order:

1. Freeze current code/deployment baseline.
2. Audit the existing tools and SEO implementation.
3. Run parallel external research tracks A–E.
4. Synthesize and score the wedges.
5. Present the research package and recommended first cluster to Isaac.
6. Obtain explicit approval.
7. Compile the replacement utility-hub product contract.
8. Obtain product-contract approval.
9. Start StudioForge implementation with the cheaper model.

---

## 16. Principal risks and controls

| Risk | Failure mode | Control |
|---|---|---|
| Old PRD regression | Coding model rebuilds gated SaaS workspace | Mark old PRD historical; replacement contract required before Forge |
| Page-count theater | 50 thin or overlapping pages | Intent registry, unique-value artifact, cannibalization review, batch publishing |
| Free-tool bait and switch | Signup required before result | Anonymous core-result acceptance test on every tool |
| Unsafe calculations | Invented formula/data or false confidence | Source manifests, reference cases, approval gates, immutable safety tests |
| Existing-work loss | Dirty tree overwritten during reset | Freeze baseline; no mutation during audit; reconcile provenance first |
| Tool sprawl | Many disconnected low-value calculators | Validate tool families and contextual handoffs; measure completions |
| SEO without conversion | Traffic rises but useful activity does not | North star is tool completion; instrument post-result funnel |
| Automation slop | Scripts publish low-quality AI pages | Scripts as plumbing only; review-state publication contract |
| Premature monetization | Ads/paywalls degrade trust and utility | Test monetization after value; scenario-based economics |
| Cheap-model drift | Model invents requirements or rebuilds patterns | Thin slices, exact contracts, stop conditions, two-stage review |

---

## 17. Decisions considered aligned unless Isaac corrects them

1. SoapCraft Pro becomes an ungated public utility hub first, not a gated SaaS workspace first.
2. “I Love PDF for soapmaking” is the structural analogy: comprehensive, visible, interlinked tools—not a visual clone.
3. Existing code is audited and reused where sensible; this is not a greenfield rewrite.
4. The homepage exposes every live tool.
5. Login is only for optional continuity features such as save/sync/history.
6. SEO/content supports tools and user jobs; it is not a standalone article farm.
7. Fifty pages is a ceiling/target subject to distinct intent and substantive-value gates.
8. Monetization remains evidence-led and may combine ads, affiliates, paid resources, and optional workspace features.
9. The batch-costing/production-planning wedge remains a hypothesis until scored against alternatives.
10. Research and audit approval precede the replacement PRD and StudioForge implementation.
