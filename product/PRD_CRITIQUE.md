# PRD Critique — SoapCraft Pro (Revised)

**Reviewer:** Independent subagent
**Date:** 2026-08-02
**Document:** `/opt/data/studio/apps/soapcraft-pro/product/PRD.md` (593 lines)
**Cross-referenced:** `brief.md`, `product/DESIGN.md`, `build-order.md`

---

## 1. Internal Consistency

### 1.1 "Not a lye calculator replacement" non-goal contradicts the product's core function

**Section:** §2 Non-Goals, line 31
**Problem:** The PRD states "Not a lye calculator replacement in marketing terms (but it calculates lye internally — see §6)." This is contradictory — the product *does* calculate lye, and the brief.md (line 44) explicitly says "Free tier must include lye calculator (compete with SoapCalc on utility)." The non-goal is poorly worded and creates confusion about whether the product is or isn't a lye calculator.
**Suggested fix:** Rewrite the non-goal to: "Not positioned as a replacement for SoapCalc in marketing (SoapCalc remains the dedicated lye calculator), but SoapCraft Pro calculates lye internally as part of the formulation workspace." Align with brief.md's positioning.

### 1.2 Recipe Library tier gating contradicts itself

**Section:** §9.2 Recipe Builder, line 215 vs. §8 App Structure, line 186 vs. brief.md line 88
**Problem:** §9.2 says "All tiers (Pro tier for saving to library)" — meaning free users cannot save recipes. But the App Structure (§8) and brief.md both say the free tier gets a "curated recipe library." The free tier can browse curated recipes but cannot save them? And the Pro tier is needed for saving? This is inconsistent with the 4-module MVP framing where the Recipe Library is a separate top-level section.
**Suggested fix:** Clarify: Free tier can browse curated recipes and save up to N (e.g., 3) to personal library. Pro tier gets unlimited personal recipes and full library features. Update §9.2 permission rules to "Free tier (save up to 3 recipes), Pro tier (unlimited)."

### 1.3 Batch Log permission rules contradict the free tier description

**Section:** §9.3 Batch Log, line 229 vs. §8 App Structure, line 186
**Problem:** §9.3 says "Pro tier only (free tier gets 1 active batch)" — but "Pro tier only" implies free tier cannot use Batch Log at all, while the parenthetical says free tier gets 1 active batch. These are contradictory. The free tier should be able to log 1 active batch; the permission rule should reflect that, not say "Pro tier only."
**Suggested fix:** Change permission rules to "Free tier (1 active batch), Pro tier (unlimited active batches)." Remove the misleading "Pro tier only" label.

### 1.4 Making Mode covers only CP, but onboarding allows HP/MP

**Section:** §9.4 Making Mode, line 238 vs. §9.1 Onboarding, line 196
**Problem:** The onboarding quiz captures "Preferred method (CP/HP/MP)" and the Making Mode step checklist is "CP-specific steps." If a user selects HP or MP as their method, they have no Making Mode content. This is a significant gap — users who chose HP or MP in onboarding will encounter an empty or CP-only Making Mode.
**Suggested fix:** Either (a) add HP and MP step guides to Making Mode, or (b) restrict the onboarding method preference to CP only for v1 with a clear statement that HP/MP support is v2, or (c) show a contextual message for HP/MP users: "Making Mode for [method] is coming soon."

### 1.5 Business tier referenced but never defined

**Section:** §9.6 Costing, line 271 vs. §7 Product Scope
**Problem:** §9.6 says "Pro tier (cost tracking), Business tier (advanced pricing — v2)" but the PRD never defines a Business tier anywhere. The brief.md (line 69) mentions "50 Business users at $299/yr" and §16 Compliance mentions "Business tier includes compliance checklist generation" and "Business tier includes MoCRA documentation export." The PRD has no tier definition entity, no pricing page, and no feature gating for a Business tier.
**Suggested fix:** Either define the Business tier in the PRD (pricing, features, gating) or remove the Business tier references from v1 sections. If it's v2, mark it explicitly as out of scope for v1.

### 1.6 SEO content placement contradicts v1/v2 boundary

**Section:** §13 SEO Strategy vs. §14 Launch Plan Gate 3
**Problem:** §13 describes SEO content as "v2 — Post-Launch" with content pillars and programmatic pages. But §14 Gate 3 (the v1 launch gate) includes "SEO content: 10 pages (calculators + guides + troubleshooting)." The brief.md (line 92) also says "SEO content (10 pages in v1: calculators + guides + troubleshooting)." This means SEO content production is a v1 deliverable, but §13 frames it as v2. The launch plan contradicts the SEO strategy section.
**Suggested fix:** Move SEO content to the v1 scope explicitly, or remove it from Gate 3 and place it in Gate 4 (v2). The brief.md already treats it as v1, so align the PRD accordingly.

### 1.7 Recipe Library is a 5th module, not part of the 4-module MVP

**Section:** §7 Product Scope (4-module table) vs. §8 App Structure vs. §9.7
**Problem:** The PRD says the MVP is 4 modules, but Recipe Library appears as a separate top-level nav item in §8 with its own screen requirements in §9.7, its own analytics events, and its own permission rules. It's not listed in the 4-module table. Is it part of Recipe Builder? A separate module? This ambiguity makes the scope unclear.
**Suggested fix:** Either (a) include Recipe Library as a 5th module in the MVP table with a clear description, or (b) fold it into the Recipe Builder module, or (c) explicitly state it's a shared infrastructure component, not a standalone module.

### 1.8 "One complete batch cycle" is undefined

**Section:** §11 Accounts & Authentication, line 341 vs. §14 Gate 1, line 520
**Problem:** The trial is "30 days or one complete batch cycle, no credit card." But "one complete batch cycle" is never defined. Does it mean from batch creation to cure completion (which could be 4-6 weeks for cold process)? This is a critical business logic term that's left ambiguous.
**Suggested fix:** Define "one complete batch cycle" explicitly: "From batch creation through cure completion (user marks batch as complete), or 30 days, whichever comes first."

### 1.9 Onboarding quiz outcome not linked to Making Mode method

**Section:** §9.1 Onboarding, line 196 vs. §9.4 Making Mode, line 238
**Problem:** The onboarding captures a "Preferred method (CP/HP/MP)" but this preference is never referenced in the Making Mode or anywhere else in the PRD. How does the method preference affect the user experience? It's collected but not used.
**Suggested fix:** Either use the method preference to customize the Making Mode step guide (see §1.4) or remove the method preference from onboarding for v1 and add it to the user profile for v2 personalization.

---

## 2. Safety Architecture

### 2.1 Safety warnings only in Recipe Builder, absent from Batch Log and Making Mode

**Section:** §6.1 Calculation Engine, line 101 vs. §9.3 Batch Log, §9.4 Making Mode
**Problem:** "Prominent safety warnings for lye handling" is only mentioned in the calculation engine (§6.1). When a user logs actual measurements in Batch Log (§9.3) or follows steps in Making Mode (§9.4), there are no safety warnings. The highest-risk moments in soap making are during actual lye handling and batch production — these are exactly where safety warnings are most needed.
**Suggested fix:** Add safety warnings to Batch Log (e.g., "Your actual lye amount differs from the recipe calculation — verify this is intentional") and Making Mode (e.g., "Wear gloves and eye protection before mixing lye" at the lye-mixing step). Add a safety checklist as a required step before Starting Making Mode.

### 2.2 No safety escalation for extreme or dangerous input values

**Section:** §6.1, line 99
**Problem:** Validation rules cover "negative values, zero batch size, impossible percentages" but don't include safety-critical ranges: superfat below 0% or above 20%, lye concentration outside safe bounds, water ratio too low (dangerous lye concentration), or oil blends with 100% of a single drying oil. These are the inputs that produce dangerous or unusable soap.
**Suggested fix:** Add explicit safety validation ranges: superfat 0-20%, lye concentration 10-50%, water-to-lye ratio minimum 2:1, and flag blends where any single oil exceeds 80% of the total. Add prominent safety warnings (not just validation errors) for values in the danger zone.

### 2.3 AI layer suggests fragrance load ranges based on IFRA — a safety-relevant claim that should be deterministic

**Section:** §6.2 AI Layer, line 122
**Problem:** "Suggests fragrance load ranges based on IFRA guidelines" is a safety-recommendation feature. Under the deterministic/AI boundary (§6), the calculator is the authority and AI is assistive. But IFRA usage limits are deterministic rules — they should be in the calculation engine, not the AI layer. If the AI suggests a fragrance load that exceeds IFRA limits, that's a safety failure.
**Suggested fix:** Move IFRA fragrance load validation and guidance to the deterministic calculation engine. The AI layer should only explain what the IFRA limits mean, not suggest or validate them. Add IFRA checks to §6.1 validation rules.

### 2.4 No safety disclaimer on Batch Log when actual measurements differ from recipe

**Section:** §9.3 Batch Log, line 222-232
**Problem:** The Batch Log allows users to input actual measurements that "can differ from recipe quantities without breaking the link" (acceptance criteria, line 232). But there's no safety warning when actual lye amounts differ significantly from calculated amounts. A user could log dangerous lye quantities without any flag.
**Suggested fix:** Add a safety warning when actual lye amount differs from calculated amount by more than a configurable threshold (e.g., ±10%). "Your actual lye amount differs from the recipe calculation by X%. Please verify this is intentional."

### 2.5 Deterministic/AI boundary not consistently applied to safety features

**Section:** §6.2, lines 125-131
**Problem:** The "What AI does NOT do" list is clear for quantity generation and override, but it doesn't address safety-critical boundaries. Specifically: AI "flags potential issues" (line 123) — but what if the AI flags a safety issue incorrectly or fails to flag one? There's no fallback. The AI also "suggests fragrance load ranges based on IFRA guidelines" which is a safety-recommendation that should be deterministic.
**Suggested fix:** Add to the AI boundary: "AI safety flags are advisory only and do not override deterministic validation. All safety-critical limits (IFRA, lye concentration, water ratio) are enforced by the calculation engine. AI flags are informational suggestions."

### 2.6 Missing: Safety disclaimer on first use and in settings

**Section:** §9.1 Onboarding, §11 Settings
**Problem:** There's no mention of a safety disclaimer shown to users on first use or in settings. Given that the product involves lye (a hazardous chemical), a first-use safety disclaimer is a basic requirement. The brief.md (line 77) mentions "prominent safety disclaimers" as a mitigation for calculation errors, but the PRD doesn't implement this.
**Suggested fix:** Add a mandatory safety disclaimer on first recipe creation or first batch log: "Soap making involves lye, a hazardous chemical. Always wear protective equipment, work in a ventilated area, and follow safety guidelines. SoapCraft Pro provides calculations — you are responsible for safe handling." Include a link to safety guidelines in Settings.

---

## 3. Data Model Completeness

### 3.1 JSON-blob anti-patterns: RecipeVersion.oilBlend should be a junction table

**Section:** §12 Data Model, line 417
**Problem:** `RecipeVersion.oilBlend` is defined as `JSON: [{ ingredientId, percentage }]`. The PRD explicitly states the data model is relational (revision notes, line 10), but this is a JSON blob. It should be a normalized junction table `RecipeIngredient` with columns `recipeVersionId`, `ingredientId`, `percentage`, and `sortOrder`. This enables proper querying (e.g., "find all recipes containing coconut oil"), indexing, and referential integrity.
**Suggested fix:** Create a `RecipeIngredient` entity: `id (UUID), recipeVersionId (FK), ingredientId (FK), percentage (number), sortOrder (integer)`. Remove `oilBlend` from `RecipeVersion`.

### 3.2 JSON-blob anti-patterns: Batch.actualMeasurements should be normalized

**Section:** §12 Data Model, line 453
**Problem:** `Batch.actualMeasurements` is `JSON: { oils: [{ ingredientId, weight }], lye, water, fragrance }`. This should be normalized into at least two entities: `BatchIngredient` (for oils) and `BatchLyeWater` (for lye, water, fragrance). JSON blobs prevent querying individual measurements and break referential integrity.
**Suggested fix:** Create `BatchIngredient`: `id, batchId, ingredientId, weight, unit`. Create `BatchLyeWater`: `id, batchId, lyeAmount, lyeUnit, waterAmount, waterUnit, fragranceAmount, fragranceUnit`.

### 3.3 JSON-blob anti-patterns: Batch.conditions, outcome, and photos should be normalized

**Section:** §12 Data Model, lines 454-456
**Problem:** `Batch.conditions` (JSON: `{ traceTemp, moldType, batchSize, actualYield }`), `Batch.outcome` (JSON: `{ hardness, lather, moisturizing, scent, appearance, notes }`), and `Batch.photos` (JSON: `[{ url, caption }]`) are all JSON blobs. Each should be a separate entity for proper normalization.
**Suggested fix:** Create `BatchCondition`: `id, batchId, traceTemp, moldType, batchSize, actualYield`. Create `BatchOutcome`: `id, batchId, hardness, lather, moisturizing, scent, appearance, notes`. Create `BatchPhoto`: `id, batchId, url, caption, sortOrder`.

### 3.4 JSON-blob anti-patterns: BatchCost.ingredientCosts should be normalized

**Section:** §12 Data Model, line 485
**Problem:** `BatchCost.ingredientCosts` is `JSON: [{ ingredientId, cost }]`. This should be a junction table `BatchCostIngredient` for proper normalization and querying.
**Suggested fix:** Create `BatchCostIngredient`: `id, batchCostId, ingredientId, cost, quantity, unit`. Remove `ingredientCosts` from `BatchCost`.

### 3.5 Missing entity: Method-specific step guide for Making Mode

**Section:** §9.4 Making Mode, line 244 (data dependencies: "method-specific step guide")
**Problem:** Making Mode references "method-specific step guide" as a data dependency, but there's no entity in the data model for storing CP/HP/MP step guides. The PRD describes CP steps (line 238) but doesn't define where these are stored or how they're versioned.
**Suggested fix:** Add a `MethodGuide` entity: `id, method (CP/HP/MP), stepNumber, title, instructions, temperatureTarget, notes`. Link to user's method preference.

### 3.6 Missing entity: Subscription/Tier for feature gating

**Section:** §11 Roles, lines 345-346
**Problem:** The PRD defines Free and Pro tiers with different feature access, but there's no `Subscription` or `Tier` entity in the data model. How is tier stored? On the User entity (it's there as `tier (free/pro)`), but there's no subscription record, no trial tracking, no payment linkage.
**Suggested fix:** Add a `Subscription` entity: `id, userId (FK), tier (free/pro/business), status (active/trialing/expired/cancelled), stripeCustomerId, trialStartDate, trialEndDate, currentPeriodStart, currentPeriodEnd`. Keep `User.tier` as a derived field.

### 3.7 Missing entity: Curated recipe source/creator

**Section:** §12 Data Model, line 433 (Recipe.visibility)
**Problem:** `Recipe.visibility` has values `private|curated`, but curated recipes need a source. Who created them? The system? A community member (v2)? There's no `creatorId` or `source` field on Recipe, and `Recipe.userId` implies all recipes are user-owned, which contradicts curated recipes being system-curated.
**Suggested fix:** Add `creatorId (FK → User, nullable)` to Recipe. For system-curated recipes, `creatorId` is null and `visibility` is `curated`. Add a `CuratedRecipe` entity if curated recipes need special metadata (source, verification status, etc.).

### 3.8 Missing entity: Ingredient source/tracking for SAP values

**Section:** §12 Data Model, line 402-411 (Ingredient)
**Problem:** The PRD says SAP values are "sourced from published data, user-editable" (§6.1, line 92), but the Ingredient entity has no source attribution or edit history. When a user edits an SAP value, there's no audit trail. This is critical for a safety-related calculation.
**Suggested fix:** Add `sapSource (string, nullable)` to Ingredient to track the data source. Consider an `IngredientEdit` audit log entity for tracking SAP value changes.

### 3.9 Missing entity: User ingredient custom entries linkage

**Section:** §12 Data Model, line 409 (Ingredient.isCustom)
**Problem:** `Ingredient.isCustom` is a boolean, but there's no entity linking custom ingredients to the user who created them. A custom ingredient belongs to a user, but the data model doesn't reflect this.
**Suggested fix:** Add `createdBy (FK → User, nullable)` to Ingredient. For `isCustom = true`, `createdBy` must be set.

### 3.10 Missing relationship: CostRecord → BatchCost linkage

**Section:** §12 Data Model, lines 472-491
**Problem:** `CostRecord` is a user-level ingredient cost catalogue entry. `BatchCost` has `ingredientCosts` (JSON) that references ingredients and costs, but there's no explicit FK from BatchCost entries to CostRecord. The relationship is implicit — BatchCost duplicates cost data from CostRecord rather than linking to it.
**Suggested fix:** Add `costRecordId (FK → CostRecord, nullable)` to the normalized `BatchCostIngredient` entity (see §3.4). This allows tracking the cost source and enables cost history analysis.

### 3.11 Missing entity: Onboarding state tracking

**Section:** §12 Data Model, line 392-398 (User)
**Problem:** `User.onboardingComplete` is a boolean, but there's no entity to store the onboarding quiz answers, progress, or timestamps. The brief.md (line 118) mentions onboarding time as a metric, but there's no data to measure it.
**Suggested fix:** Add `OnboardingState` entity: `id, userId (FK), step (integer), answers (JSON), completedAt (datetime, nullable)`. Or at minimum, store quiz answers on User as JSON.

### 3.12 Batch.status transitions are undefined

**Section:** §12 Data Model, line 459
**Problem:** `Batch.status` has values `active|complete` but there's no description of what triggers the transition from active to complete, or what happens to cure observations, cost records, and other related data when a batch is marked complete.
**Suggested fix:** Define the state machine: active → complete (when outcome is logged). Add `completedAt` timestamp. Clarify that cure observations can still be added after completion, and cost calculation is available after completion.

---

## 4. MVP Scope Discipline

### 4.1 Recipe Library is effectively a 5th module

**Section:** §7 Product Scope (4-module table) vs. §8 App Structure vs. §9.7
**Problem:** The PRD claims 4 modules but Recipe Library has its own screen requirements (§9.7), analytics events, permission rules, and data dependencies. It's a full-featured section with search, filter, rating, and save functionality. Calling it part of Recipe Builder is a stretch — it has its own nav entry, its own empty state, and its own permission model.
**Suggested fix:** Either (a) acknowledge Recipe Library as a 5th MVP module and update the scope table, or (b) make it a sub-feature of Recipe Builder with minimal standalone requirements for v1 (browse and save only, no rating or search).

### 4.2 Business tier referenced in v1 sections implies v2 functionality

**Section:** §9.6 Costing, line 271
**Problem:** "Business tier (advanced pricing — v2)" is mentioned in a v1 screen requirement. This implies a tier that doesn't exist in the PRD's data model, pricing, or feature gating. It's v2 functionality leaking into v1 documentation.
**Suggested fix:** Remove Business tier references from v1 sections. Define Business tier separately in a v2 section or remove it entirely until v2 scope is defined.

### 4.3 SEO programmatic pages are a significant v1 scope item not accounted for in the 4-module framing

**Section:** §13 SEO Strategy, lines 500-501 vs. §7 Product Scope
**Problem:** "Programmatic oil-specific calculator pages" (line 500) is a significant development effort — generating pages for every oil combination with meaningful content. This is not a product module but it's a v1 deliverable per the brief.md (line 92). The 4-module framing makes it invisible.
**Suggested fix:** Add a "Content & SEO" line item to the v1 scope or acknowledge it as a cross-cutting concern that requires dedicated resources.

### 4.4 App Life Spec is a v1 deliverable but not listed as a module or feature

**Section:** brief.md line 93 vs. §7 Product Scope
**Problem:** The brief.md lists "App Life Spec with signature interaction, motion vocabulary, first-use guidance" as in-scope for v1. The DESIGN.md contains the full App Life Spec. But the PRD doesn't include the App Life Spec as a deliverable or reference it as a v1 requirement.
**Suggested fix:** Add the App Life Spec as a v1 deliverable in the PRD, cross-referencing DESIGN.md.

### 4.5 "Guided, not hands-free" Making Mode implies a v2 hands-free version

**Section:** §9.4 Making Mode, line 235
**Problem:** The qualifier "guided, not hands-free" implies a hands-free version exists in v2. But "hands-free" in the context of soap making is unclear — does it mean automated step progression? Timer-based? This is a v2 scope item that should be defined in the v2 section, not hinted at in v1.
**Suggested fix:** Remove the "guided, not hands-free" qualifier from the v1 description and add "Hands-free batch production (automated step progression, timer-based guidance)" to the v2 section.

### 4.6 Fragrance system in Recipe Builder implies a more complex fragrance engine in v2

**Section:** §9.2 Recipe Builder, line 210 vs. §7 v2 features
**Problem:** The Recipe Builder includes "Fragrance/EO (name, % load)" as a required field, and the AI layer "Suggests fragrance load ranges based on IFRA guidelines." This implies a fragrance system with IFRA integration that goes beyond a simple field. The v2 section includes a "Fragrance pairing engine," suggesting the v1 fragrance feature is a minimal version of something more complex.
**Suggested fix:** Clarify that the v1 fragrance feature is a simple name + load percentage field with IFRA range display, and the fragrance pairing engine is v2. Don't let the v1 field imply a more complex system than what's being built.

---

## 5. Buildability

### 5.1 "Impossible percentages" is undefined

**Section:** §6.1, line 99
**Problem:** Validation rules include "impossible percentages" but this term is never defined. Does it mean oil percentages must sum to 100%? That no single oil can exceed 100%? That superfat can't be negative? A builder cannot implement validation without knowing the exact rules.
**Suggested fix:** Define "impossible percentages" explicitly: "Oil percentages must sum to 100% (±0.1% tolerance). Superfat must be 0-20%. Lye concentration must be 10-50%. Water-to-lye ratio must be ≥ 2:1."

### 5.2 "Published ranges and blending rules" for property prediction is unspecified

**Section:** §6.1 Property Prediction, line 104-105
**Problem:** "Uses published ranges and blending rules (not AI inference)" — but which published ranges? Which blending rules? The most common approach in soap making is the "Cathy Davies method" or the "Nurturing Soap" approach, but this isn't referenced. A builder cannot implement property prediction without knowing the algorithm.
**Suggested fix:** Specify the methodology: "Property predictions use the [named method/standard] with the following blending rules: [list rules]. Source: [citation]." At minimum, provide the formula or reference.

### 5.3 "Configurable precision rules" for rounding is undefined

**Section:** §6.1, line 100
**Problem:** "Rounds according to configurable precision rules" — but there's no specification of what these rules are, what values are configurable, or how they're configured. A builder needs to know the default rounding behavior.
**Suggested fix:** Define default precision rules: "Lye and water quantities rounded to 1 decimal place. Oil percentages rounded to 1 decimal place. Superfat rounded to 1 decimal place. Precision rules are configurable in Settings with defaults."

### 5.4 Missing acceptance criteria for Making Mode step completeness

**Section:** §9.4, line 246
**Problem:** Acceptance criteria says "User can follow a complete CP soap making process with guided steps and persistent timers." But "complete" is undefined — does it mean all 7 steps must be completed? Can steps be skipped? What happens if a user skips a step?
**Suggested fix:** Define "complete": "All 7 CP steps must be marked complete to finish the batch. Steps can be skipped with a reason. The Making Mode is complete when the last step is marked complete or all steps are skipped."

### 5.5 Missing acceptance criteria for cost calculation accuracy

**Section:** §9.6, line 274
**Problem:** Acceptance criteria says "User can input ingredient costs and get real cost per bar + target selling price within 2 minutes." But there's no accuracy criterion. What constitutes "real cost"? Does it include waste? Labor? Shipping?
**Suggested fix:** Define cost calculation methodology: "Cost per bar = (sum of ingredient costs used in batch) / (actual number of bars produced). Target selling price = cost per bar / (1 - target margin). Waste and labor are excluded from cost calculation but noted as separate considerations."

### 5.6 Missing edge case: Recipe deletion with existing batches

**Section:** §11 CRUD Operations, line 349
**Problem:** The PRD says "Create/Read/Update/Delete recipes" but doesn't describe what happens when a user deletes a recipe that has existing batches referencing it. This is a critical referential integrity question.
**Suggested fix:** Add: "Deleting a recipe soft-deletes it (status: deleted) and preserves all referencing batches. Hard delete is only available when no batches reference the recipe. Users are warned before deletion if batches exist."

### 5.7 Missing edge case: Free tier limit enforcement

**Section:** §11 Roles, line 345-346
**Problem:** The free tier allows 3 recipes and 1 active batch, but there's no described behavior for when a user tries to create a 4th recipe or a 2nd active batch. Is there a blocking error? A prompt to upgrade? A soft limit with warnings?
**Suggested fix:** Add: "When a free-tier user attempts to exceed their limit, show a modal explaining the limitation and offering to upgrade to Pro. The user can still view and edit existing recipes/batches but cannot create new ones."

### 5.8 Missing edge case: Trial expiry mid-batch

**Section:** §11 Accounts & Authentication, line 341
**Problem:** The trial is "30 days or one complete batch cycle." What happens if a user starts a batch during the trial and the trial expires before the batch is complete? Can they still log the outcome? Do they lose access to Making Mode?
**Suggested fix:** Add: "When a trial expires, the user retains access to view and complete in-progress batches but cannot start new batches or access Pro-only features. Cure reminders continue. The user is prompted to subscribe to retain full access."

### 5.9 Missing edge case: AI request failure handling

**Section:** §6.2 AI Layer
**Problem:** The AI layer is described as "async" (§11 Background Jobs, line 370) but there's no description of what happens when an AI request fails, times out, or returns an error. Does the user see an error? Does the formulation assistant degrade gracefully?
**Suggested fix:** Add: "AI requests have a 10-second timeout. On failure, the UI shows 'Assistant unavailable — try again later.' The deterministic calculation engine continues to work independently of AI availability."

### 5.10 Missing: How the AI formulation assistant is invoked in the UI

**Section:** §6.2 AI Layer
**Problem:** The PRD describes what the AI does (explains trade-offs, recommends adjustments, interprets predictions) but doesn't specify the UI pattern. Is it a chat sidebar? Inline suggestions? A "Get AI Help" button? A builder can't implement this without knowing the interaction pattern.
**Suggested fix:** Add a UI specification for the AI layer: "The formulation assistant is accessible via a 'Suggest' button in the Recipe Builder. It opens a slide-out panel with contextual suggestions based on the current recipe state. Suggestions are non-blocking and can be dismissed."

### 5.11 Missing: How SoapCalc CSV import/export works

**Section:** §11 Integrations, line 367
**Problem:** "SoapCalc import/export (CSV)" is mentioned but there's no detail on the CSV format, what fields are mapped, or how import errors are handled. A builder can't implement this without a specification.
**Suggested fix:** Add: "Import format: CSV with columns [recipe_name, oil_name, oil_percentage, superfat, lye_type, lye_concentration, water_ratio, batch_size, batch_unit, fragrance_name, fragrance_load]. Export format mirrors the import format. Invalid rows are reported with line numbers and error descriptions."

### 5.12 Missing: How recipe versioning works in the UI

**Section:** §12 Data Model, §13 Recipe Versioning
**Problem:** The data model has RecipeVersion and the text describes versioning, but there's no UI specification for how users interact with versions. Can they see a version history? Compare versions? Revert? The "Make a Variation" entry point (§9.2, line 208) implies versioning but doesn't describe the UX.
**Suggested fix:** Add: "Recipe version history is accessible from the Recipe detail view. Users can view previous versions, compare differences, and revert to a previous version. 'Make a Variation' creates a new RecipeVersion with the current recipe as the parent."

### 5.13 Missing: Cost catalogue management UI

**Section:** §12 Data Model, line 472-481 (CostRecord)
**Problem:** CostRecord is a user-level ingredient cost catalogue, but there's no UI described for managing it (adding, editing, deleting ingredient costs). The Costing screen (§9.6) references "Ingredient costs (per unit from catalogue)" but doesn't describe how users populate or maintain the catalogue.
**Suggested fix:** Add a Cost Catalogue management screen or section: "Users can add, edit, and delete ingredient costs in their cost catalogue. Each entry links to an Ingredient and specifies costPerUnit and unit. The catalogue is pre-populated with common ingredients."

---

## 6. UX Coherence

### 6.1 App Life Spec elements missing from PRD

**Section:** DESIGN.md (full document) vs. PRD
**Problem:** The DESIGN.md App Life Spec includes elements not reflected in the PRD:
- **Core loop** (DESIGN.md line 13): The PRD's use cases (§5) describe the loop but don't frame it as the "core loop" with the same emphasis.
- **Moment of truth** (DESIGN.md line 14): The calculation reveal is the moment of truth, but the PRD doesn't describe this as a distinct UX moment.
- **Personality role** (DESIGN.md line 17): "Calm precision" is not reflected in the PRD's tone or content.
- **Retention cues** (DESIGN.md lines 108-111): Dashboard cure alert, recipe recommendation, and batch reminder are not in the PRD.
- **Accessibility budget** (DESIGN.md line 24): Specific targets (16px body, 4.5:1 contrast, 44x44px touch targets) are in §17 NFRs but not in the screen-by-screen requirements.
**Suggested fix:** Cross-reference the App Life Spec in the PRD. Add a "UX Design" section that references DESIGN.md and includes the key UX specifications (moment of truth, personality role, retention cues).

### 6.2 Signature interaction not in PRD

**Section:** DESIGN.md lines 28-35
**Problem:** DESIGN.md defines a signature interaction (Trigger → Before → During → After → Feedback → Metric) for the calculation reveal. The PRD doesn't include this pattern anywhere. The PRD's Recipe Builder description (§9.2) mentions "Calculation display" but doesn't describe the interaction pattern.
**Suggested fix:** Add the signature interaction specification to the Recipe Builder section: "When the user clicks Calculate, the result panel reveals with a subtle animation showing lye amount, water amount, fragrance load, and property ranges. Each metric has a checkmark animation on reveal."

### 6.3 Motion vocabulary not referenced in PRD

**Section:** DESIGN.md lines 37-53
**Problem:** DESIGN.md has a detailed motion vocabulary (navigation, submit/commit, loading/resolution, sheet/modal, success/reward, error/undo) with specific timing and behavior. The PRD doesn't reference this vocabulary.
**Suggested fix:** Add a "Motion & Animation" section in the PRD that references DESIGN.md's motion vocabulary and applies it to the screen-by-screen requirements.

### 6.4 First-use guidance differs between DESIGN.md and PRD

**Section:** DESIGN.md lines 57-70 vs. PRD §9.1 Onboarding, lines 192-204
**Problem:** DESIGN.md describes a 7-step onboarding flow (Welcome → Experience quiz → Goal setting → Method preference → First recipe → First batch → First cure observation). The PRD's onboarding (§9.1) describes a 3-step quiz and then "First recipe creation is suggested immediately after." The 7-step flow includes first batch and first cure observation as onboarding steps, which the PRD doesn't capture.
**Suggested fix:** Align the PRD onboarding with the DESIGN.md first-use guidance. Add "First batch" and "First cure observation" as onboarding steps, or explicitly note that they're post-onboarding flows triggered by contextual cues.

### 6.5 Contextual action chips not in PRD

**Section:** DESIGN.md lines 72-75
**Problem:** DESIGN.md describes contextual action chips as a UX pattern ("specific to the user's immediate context, executable in one tap, visibly subordinate to the primary input"). The PRD doesn't mention this pattern anywhere, but it's a key part of the first-use guidance.
**Suggested fix:** Add contextual action chips to the relevant PRD sections (e.g., Dashboard empty state, Recipe Builder after calculation).

### 6.6 Gamification (streaks) not in PRD

**Section:** DESIGN.md lines 112-117
**Problem:** DESIGN.md includes streaks, recovery paths, and reward alignment. The PRD doesn't mention gamification at all. This is a significant UX feature that's missing from the PRD.
**Suggested fix:** Either add gamification to the PRD (as a v1 or v2 feature) or explicitly state it's out of scope for v1. If it's v1, add it to the appropriate module (Batch Log or Dashboard).

### 6.7 Retention surfaces not in PRD

**Section:** DESIGN.md lines 104-111
**Problem:** DESIGN.md defines three retention surfaces (Dashboard cure alert, Recipe recommendation, Batch reminder) with specific jobs, tap destinations, refresh/privacy rules, and metrics. The PRD doesn't include these.
**Suggested fix:** Add retention surfaces to the PRD, cross-referencing DESIGN.md. Include them in the Dashboard and relevant module specifications.

### 6.8 Design quality gates not referenced in PRD

**Section:** DESIGN.md lines 149-161
**Problem:** DESIGN.md has "Impeccable Pass" design quality gates (no per-section eyebrows, no glassmorphism, etc.) that are part of the build pipeline (build-order.md line 62). The PRD doesn't reference these quality gates.
**Suggested fix:** Add a reference to the design quality gates in the PRD's Non-Functional Requirements or as a separate "Design Quality" section.

### 6.9 Empty state inconsistency between DESIGN.md and PRD

**Section:** DESIGN.md line 21 vs. PRD §9.2 line 212
**Problem:** DESIGN.md specifies the Recipe Builder empty state as "Your first recipe is one oil selection away." The PRD specifies "Select oils and set percentages to see your recipe come together." These are different messages with different tones. DESIGN.md's "one oil selection away" is more action-oriented and aligned with the "calm precision" personality.
**Suggested fix:** Align the PRD empty state with DESIGN.md: "Your first recipe is one oil selection away."

### 6.10 Color system and type tokens not in PRD

**Section:** DESIGN.md lines 163-202
**Problem:** DESIGN.md defines a complete design token system (colors, typography, spacing, animation). The PRD doesn't reference these tokens. A builder implementing the UI would need to look at DESIGN.md separately.
**Suggested fix:** Add a "Design Tokens" reference in the PRD or include key tokens in the relevant screen specifications. At minimum, reference DESIGN.md for the full token system.

---

## 7. Technical Correctness

### 7.1 SAP calculation for dual-lye recipes is underspecified

**Section:** §6.1 Calculation Engine, line 94
**Problem:** "Supports dual-lye recipes (NaOH + KOH in same batch)" — this is technically correct but the PRD doesn't describe how the calculation handles the interaction. In dual-lye recipes, NaOH saponifies hard oils and KOH saponifies soft oils/liquid soaps. The calculation engine needs to handle separate SAP values for each lye type per oil. This is a non-trivial calculation that's not described.
**Suggested fix:** Add: "For dual-lye recipes, each oil has separate NaOH and KOH SAP values. The calculation engine computes lye amounts separately for each alkali based on the oil's respective SAP value. The user specifies the lye type and percentage for each oil in the blend."

### 7.2 Water ratio vs. water amount relationship is ambiguous

**Section:** §6.1, line 96 and §9.2, line 210
**Problem:** The PRD accepts "Water ratio (%)" as an input and "calculatedWater" as an output, but doesn't explain the relationship. In soap making, water ratio typically means water-to-lye ratio (e.g., 2:1). But the PRD also has "Lye concentration (%)" which is the lye solution strength. These two inputs are mathematically related — changing one affects the other. The PRD doesn't describe how the calculation engine handles this relationship or which input takes precedence.
**Suggested fix:** Clarify the relationship: "Water ratio is the water-to-lye ratio by weight (e.g., 2:1 means 2 parts water per 1 part lye). Lye concentration is the percentage of lye in the total lye solution. The calculation engine derives one from the other — users can specify either water ratio or lye concentration, and the other is calculated automatically."

### 7.3 Fragrance load calculation methodology is undefined

**Section:** §6.1, line 100 (calculatedFragrance in RecipeVersion)
**Problem:** The PRD mentions "calculatedFragrance" as an output but doesn't describe how fragrance load is calculated. Is it a percentage of total oil weight? Total batch weight? This matters for accuracy and consistency with IFRA guidelines.
**Suggested fix:** Define: "Fragrance load is calculated as a percentage of total oil weight. For example, if the oil blend is 1000g and the fragrance load is 3%, the calculated fragrance amount is 30g."

### 7.4 Property prediction methodology is unspecified

**Section:** §6.1 Property Prediction, lines 104-106
**Problem:** "Hardness, lather, moisturizing scores calculated from oil percentages" using "published ranges and blending rules" — but the specific methodology, source, and formulas are not specified. This is a core feature that a builder cannot implement without knowing the algorithm.
**Suggested fix:** Specify the methodology: "Property scores use the [named standard, e.g., 'Cathy Davies SAP-based blending'] with the following formulas: Hardness = Σ(oil_percentage × oil_hardness_factor). Lather = Σ(oil_percentage × oil_lather_factor). Moisturizing = Σ(oil_percentage × oil_moisturizing_factor). Each factor is sourced from [published reference]. Scores are normalized to a 1-10 scale."

### 7.5 IFRA handling is split between deterministic engine and AI layer

**Section:** §6.1 line 92, §6.2 line 122, §16 line 567
**Problem:** IFRA is mentioned in three different places with different roles: (1) Ingredient has `ifraCategory` and `maxUsagePercent` (data model), (2) AI "suggests fragrance load ranges based on IFRA guidelines" (AI layer), (3) IFRA "generates documentation and warnings" (compliance). The PRD doesn't describe how IFRA limits are enforced in the calculation engine — should the engine prevent users from exceeding IFRA limits, or just warn?
**Suggested fix:** Clarify: "The calculation engine enforces IFRA limits as warnings (not hard blocks). If a fragrance load exceeds the IFRA maximum for the oil blend, a warning is shown: 'This fragrance load exceeds the IFRA recommended maximum of X% for this oil combination.' The AI layer can explain what the IFRA limit means. Compliance documentation (§16) generates a summary of IFRA compliance for the recipe."

### 7.6 Unit conversion list is incomplete for soap making

**Section:** §6.1, line 97
**Problem:** Supported units are "g, oz, ml, fl oz, lbs" — but soap makers commonly use cups, tablespoons, and pounds (weight). The omission of cups and tablespoons is notable for a product targeting serious soap makers.
**Suggested fix:** Add cups and tablespoons to the supported units, or explicitly state why they're excluded: "Volume units (cups, tablespoons) are not supported in v1 due to the inconsistency of volume-based measurements in soap making. Weight-based units are recommended for accuracy."

### 7.7 Superfat calculation methodology is not described

**Section:** §6.1, line 98
**Problem:** "Applies superfat percentage (user-specified, default 5%)" — but the PRD doesn't describe how superfat affects the lye calculation. Superfat reduces the lye amount by the specified percentage. This is a critical calculation detail that a builder needs.
**Suggested fix:** Add: "Superfat reduces the calculated lye amount by the specified percentage. For example, if the lye calculation yields 100g of NaOH and the superfat is 5%, the final lye amount is 95g. The remaining 5g of unsaponified oils contributes to the moisturizing properties of the soap."

### 7.8 Property prediction "confidence indicators" are undefined

**Section:** §6.1 Property Prediction, line 106
**Problem:** "Results shown as ranges with confidence indicators" — but confidence indicators are not defined. What do they represent? Are they based on the number of oils in the blend? The deviation from standard formulations? The source of the SAP values? A builder can't implement this without knowing what the indicators mean.
**Suggested fix:** Define confidence indicators: "Confidence is shown as High (≥5 oils in blend, all SAP values from published sources), Medium (3-4 oils, all SAP values from published sources), Low (<3 oils or user-edited SAP values). Confidence is displayed as a color-coded badge (green/yellow/red) next to each property score."

### 7.9 Cure window estimation methodology is unspecified

**Section:** §9.5 Cure Tracker, line 252
**Problem:** "Estimated cure window (based on oil blend and superfat)" — but the methodology for estimating cure windows is not specified. Different oil blends have different cure times (e.g., 100% olive oil: 4-6 weeks; 100% coconut oil: 4-6 weeks; high superfat: longer cure). The PRD doesn't describe the algorithm or data source.
**Suggested fix:** Add: "Cure window estimation uses published cure time data for common oil blends. The base cure window is determined by the primary oil(s) in the blend. Superfat above 5% adds 1 week per 2% increment. The estimated window is shown as 'X-Y weeks' with a confidence indicator."

### 7.10 Target margin pricing formula is undefined

**Section:** §9.6 Costing, line 265-266
**Problem:** "Target margin (%)" and "suggested selling price" are mentioned but the formula is not defined. Is it cost per bar / (1 - margin)? Or cost per bar * (1 + margin)? This is a critical business logic detail.
**Suggested fix:** Define the formula explicitly: "Suggested selling price = cost per bar / (1 - target margin). For example, if cost per bar is $2.00 and target margin is 50%, the suggested selling price is $4.00."

### 7.11 Batch yield calculation is undefined

**Section:** §9.3 Batch Log, line 224
**Problem:** "Actual number of bars" is a required field, but the PRD doesn't describe how yield is calculated or whether it's user-entered or system-calculated. Is it batch size divided by a standard bar weight? Is it user-entered?
**Suggested fix:** Define: "Actual number of bars is user-entered. The system can optionally calculate expected yield based on batch size and a configurable bar weight (default: 4 oz per bar). Actual yield can differ from expected yield, and the difference is noted in the outcome."

### 7.12 "Results shown as ranges with confidence indicators" for property prediction — ranges from what?

**Section:** §6.1 Property Prediction, line 106
**Problem:** Property predictions show "ranges" — but ranges based on what? Are these ranges from the published SAP data? From batch outcome history? From the blending rules? The PRD says "published ranges" but doesn't specify what these ranges represent or how they're calculated.
**Suggested fix:** Clarify: "Property ranges represent the expected variation based on the oil blend composition and published SAP value ranges. For example, a hardness score of 7-9 means that batches with similar oil blends typically score between 7 and 9 on the hardness scale. Ranges are derived from the published SAP data and blending rules, not from user batch history (which is v2)."

### 7.13 AI formulation accuracy threshold is subjective

**Section:** §18 Open Questions, line 588
**Problem:** "What is the acceptable AI formulation accuracy threshold before launch? (recommend: > 80% user satisfaction on first recipe)" — this is a subjective metric (user satisfaction) masquerading as a technical accuracy threshold. The PRD should define what "accuracy" means for the AI layer in objective terms.
**Suggested fix:** Define AI accuracy as: "AI suggestions are considered accurate when the user accepts or acts on the suggestion. Target: > 80% of AI suggestions are accepted or acted upon by users. This is measured as 'AI suggestion acceptance rate' in analytics."

---

## Summary of Findings

| Dimension | Issues Found | Severity |
|-----------|-------------|----------|
| Internal Consistency | 9 issues | High — tier gating, module count, and scope boundaries are contradictory |
| Safety Architecture | 6 issues | Critical — safety warnings are missing from the highest-risk paths |
| Data Model Completeness | 12 issues | High — JSON-blob anti-patterns dominate; key entities are missing |
| MVP Scope Discipline | 6 issues | Medium — scope creep is subtle but real |
| Buildability | 13 issues | High — critical ambiguities would cause a builder to invent decisions |
| UX Coherence | 10 issues | Medium — DESIGN.md has rich UX specs not reflected in the PRD |
| Technical Correctness | 13 issues | High — core calculation methodologies are underspecified |

**Total: 69 issues across 7 dimensions.**

The most critical findings:
1. **Safety gaps** — warnings are absent from Batch Log and Making Mode, the highest-risk paths in the product.
2. **Tier gating contradictions** — free vs. Pro permissions are stated inconsistently across sections.
3. **JSON-blob anti-patterns** — the PRD claims a relational data model but 8+ fields are JSON blobs.
4. **Underspecified calculation methodologies** — property prediction, cure window estimation, fragrance load, and target margin pricing all lack the detail a builder needs.
5. **Missing entities** — MethodGuide, Subscription, BatchCondition, BatchOutcome, BatchPhoto, RecipeIngredient junction table, and others are absent.
