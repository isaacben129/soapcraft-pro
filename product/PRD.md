# PRD — SoapCraft Pro (Revised)

> Buildable spec. A capable builder must be able to implement the product from this
> document alone, page-to-page, flow-to-flow, module-to-module. No basic requirement
> may be missing.
>
> **Revision notes:** This PRD has been tightened per critique (2026-08-02).
> The MVP is four modules, not twelve. AI is a formulation assistant, not a recipe
> generator. Lye calculation is deterministic and authoritative. Community is v2.
> The data model is relational with recipe versioning.

## 1. Executive Summary

SoapCraft Pro is a recipe, batch, and profitability workspace for serious soap makers.
It combines verified formulation calculations, guided batch production, cure tracking,
and real cost-per-bar analysis. AI helps users understand trade-offs, refine recipes,
and learn from their own batch history — without replacing deterministic safety calculations.

The product is not an AI wrapper. The calculator is the authority. AI explains,
recommends, and interprets.

## 2. Goals and Non-Goals

- **Goals:**
  - Help soap makers create accurate recipes with verified calculations
  - Reduce batch failures through structured logging and outcome tracking
  - Make soap business economics transparent (cost per bar, target pricing)
  - Build a private recipe library that improves with usage
  - Provide a credible, safe, deterministic formulation foundation
- **Non-Goals (explicit):**
  - Not positioned as a replacement for SoapCalc in marketing (SoapCalc remains the dedicated lye calculator), but SoapCraft Pro calculates lye internally as part of the formulation workspace
  - Not a course or education platform (no video lessons, no cohorts)
  - Not a marketplace for buying/selling soap or ingredients
  - Not a social media platform (private libraries first, public sharing v2)
  - Not a mobile app in v1 (web-first, responsive design, mobile-optimized)
  - Not a multi-product platform (soap only in v1)
  - Not an AI recipe generator (AI assists, never invents quantities)

## 3. Product Context / Background

The soap making community is passionate and growing. There are 81K+ members in r/soapmaking,
active forums, and Facebook groups for every style (cold process, hot process, melt-and-pour).
The existing tools are fragmented: SoapCalc handles lye math but nothing else, Craftybase
($24/mo) handles inventory but not formulation, and no tool provides a unified workspace
for the full recipe-to-sale lifecycle.

The gap is not another lye calculator. The gap is a workspace where a soap maker can:
1. Build a recipe with verified calculations
2. Log the actual batch with real measurements
3. Track cure progress with honest estimates
4. Know what each bar costs and what to charge

That lifecycle is coherent, repeatable, and valuable. It does not require AI to be
exciting — it requires precision.

## 4. Target Users and Personas

- **Persona 1 — Serious Hobbyist (primary):** Makes soap regularly, has 10+ recipes,
  wants better results and fewer failed batches. Job-to-be-done: "Help me make better
  soap with less waste and less guesswork." Willing to pay for a tool that saves them
  time and ingredients.
- **Persona 2 — Micro-Business Seller (secondary):** Sells on Etsy/Shopify, needs to
  track costs and pricing per bar. Job-to-be-done: "Help me know what my soap costs
  and what to charge for it." Willing to pay for business-tier features.
- **Persona 3 — Beginner (tertiary):** Just started, overwhelmed by lye calculations
  and safety concerns. Job-to-be-done: "Help me make my first batch successfully
  without messing up." Starts with free tier, converts when confident.

## 5. Use Cases

1. **Build a recipe:** User selects oils, sets percentages, adjusts superfat and lye
   concentration → system calculates lye, water, and expected properties → user saves.
2. **Scale a recipe:** User changes batch size → all quantities scale proportionally.
3. **Log a batch:** User inputs actual measurements, conditions, and outcomes → system
   stores for comparison and learning.
4. **Track cure:** User logs pH and hardness over time → system shows estimated cure
   window → user decides when soap is ready.
5. **Price a product:** User inputs ingredient costs → system calculates cost per bar →
   user sets target margin → system suggests selling price.
6. **Compare batches:** User views side-by-side comparison of past batches → sees what
   changed and what the outcome was.
7. **Browse curated recipes:** User browses a curated library of verified recipes → saves
   to personal library → logs their own batch.

## 6. Architecture: Deterministic Calculation Engine + AI Layer

### 6.1 Calculation Engine (Deterministic, Authoritative)

The calculation engine is the foundation. It must be correct before anything else runs.

**SAP Calculation:**
- Uses verified SAP values for each oil (sourced from published data, user-editable)
- Supports NaOH (sodium hydroxide) and KOH (potassium hydroxide)
- Supports dual-lye recipes (NaOH + KOH in same batch) — each oil has separate NaOH and KOH SAP values; the engine computes lye amounts separately for each alkali
- Accounts for alkali purity (user-specified, default 100%)
- Accounts for water concentration (lye solution strength, user-specified)
- Handles unit conversion (g, oz, kg, lbs) — weight units only in v1; volume units excluded because soap formulation requires mass-based accuracy
- Applies superfat percentage (user-specified, default 5%) — superfat reduces the calculated lye amount by the specified percentage; the remaining unsaponified oils contribute to moisturizing properties
- Validates inputs (negative values, zero batch size, impossible percentages)
- Validates safety-critical ranges: superfat 0–20%, lye concentration 10–50%, water-to-lye ratio ≥ 2:1, no single oil > 80% of total blend
- Flags values in danger zones with prominent safety warnings (not just validation errors)
- Rounds according to configurable precision rules (default: lye and water to 1 decimal place, oil percentages to 1 decimal place, superfat to 1 decimal place)
- Prominent safety warnings for lye handling at every point where lye quantities are displayed or entered

**Water Calculation Mode:**
- Users select one primary mode: lye concentration, water-to-lye ratio, or percent of oils
- The other values are derived and displayed read-only
- The calculation engine derives water amount from the selected mode and the lye quantity

**Dual-Lye Recipes:**
- Each oil has separate NaOH and KOH SAP values
- The calculation engine computes lye amounts separately for each alkali based on the oil's respective SAP value
- The user specifies the lye type and percentage for each oil in the blend

**Property Prediction:**
- Hardness, lather, moisturizing scores calculated from oil percentages
- Uses SAP-based blending rules with named factors per oil (hardness factor, lather factor, moisturizing factor)
- Scores normalized to a 1–10 scale
- Results shown as ranges with confidence indicators (High: ≥5 oils, all published SAP; Medium: 3–4 oils, all published SAP; Low: <3 oils or user-edited SAP)
- Confidence displayed as a color-coded badge (green/yellow/red) next to each property score
- Ranges represent expected variation based on oil blend composition and published SAP value ranges, not user batch history
- AI layer can explain trade-offs and suggest adjustments

**IFRA Handling:**
- IFRA usage limits are enforced by the deterministic calculation engine, not the AI layer
- Each fragrance ingredient has `ifraCategory` and `maxUsagePercent` sourced from published IFRA data
- If a fragrance load exceeds the IFRA maximum for the oil blend, a warning is shown: "This fragrance load exceeds the IFRA recommended maximum of X% for this oil combination"
- The AI layer explains what the IFRA limit means; it does not validate or suggest fragrance loads
- Compliance documentation generates a summary of IFRA compliance for the recipe

**Batch Scaling:**
- Scale recipe to any target weight
- Recalculate all quantities proportionally
- Preserve ratios and percentages

### 6.2 AI Layer (Assistive, Not Authoritative)

The AI layer operates on top of the deterministic engine. It never invents quantities.

**Formulation Assistant:**
- Explains trade-offs between oil choices ("More coconut oil increases lather but can be drying")
- Recommends adjustments based on user preferences ("You want more hardness — try increasing olive oil by 5%")
- Interprets property predictions ("Your current superfat of 8% is higher than typical — this will make the bar softer")
- Suggests fragrance load ranges based on IFRA guidelines
- Flags potential issues ("This combination has a high superfat — cure time may be longer")

- **What AI does NOT do:**
- Does not generate final lye quantities (the calculator does)
- Does not override user input
- Does not claim to know the "perfect" recipe
- Does not replace safety warnings
- Does not make claims about cure readiness
- Does not validate IFRA limits or suggest fragrance loads (the deterministic engine does this)
- Safety flags are advisory only and do not override deterministic validation. All safety-critical limits (IFRA, lye concentration, water ratio) are enforced by the calculation engine. AI flags are informational suggestions.
- AI suggestions are non-blocking and can be dismissed. The formulation assistant is accessible via a "Suggest" button in the Recipe Builder, opening a slide-out panel with contextual suggestions based on the current recipe state.

## 7. Product Scope

### v1 — Four Modules (MVP)

| Module | Description | Key Features |
|--------|-------------|--------------|
| **Recipe Builder** | Deterministic formulation with verified calculations | Oil selection, percentage-based blending, SAP calc, lye/water calc, superfat, property ranges, warnings, validation, batch scaling, save to library |
| **Batch Log + Making Mode** | Guided CP batch production with structured logging | Create batch from recipe, record actual measurements, CP step checklist, timers, temperatures, notes, photos, actual yield, safety warnings |
| **Cure Tracker** | Estimated cure window with observation logging | Expected cure window, days elapsed, reminders, pH/hardness observation logs, final outcome review, user-decided completion |
| **Cost Per Batch / Per Bar** | Ingredient cost catalogue and pricing | Ingredient cost catalogue, cost per batch, cost per bar, target margin pricing, suggested selling price |

### UX Design (see DESIGN.md)
The App Life Spec (signature interaction, motion vocabulary, first-use guidance, retention surfaces, accessibility budget) is a v1 deliverable defined in `product/DESIGN.md` and referenced throughout this PRD.

### v2 (post-launch)

- Public recipe sharing and community features
- Fragrance pairing engine
- AI Troubleshooter (batch failure diagnosis)
- Full inventory management
- Beginner's adaptive learning path
- AI predictions (outcome prediction based on batch history)
- Etsy/Shopify integration
- SEO publishing operation
- Compliance documentation export

### Explicitly Out of Scope for v1

- Public community Q&A or forums
- AI-generated "perfect" recipes
- Full inventory management system
- AI troubleshooting
- AI cure readiness declarations
- Etsy/Shopify integrations
- Compliance reports (use checklists and documentation only)
- Multi-language support
|- Mobile app (web-first, responsive)

## 8. Competitive Analysis — SoapCraft Pro vs SoapCalc

### SoapCalc (the incumbent)
SoapCalc is the free, no-signup lye calculator that soap makers have used since 2001. It is functional, dense, and information-rich. Its strengths and weaknesses define the baseline SoapCraft Pro must exceed.

**What SoapCalc does well:**
- Fast, deterministic lye calculations (NaOH, KOH, dual)
- 150+ oils with SAP values and fatty acid profiles
- Real-time quality predictions (hardness, cleansing, conditioning, lather, creaminess)
- Water calculation modes (percentage of oils, lye concentration, water:lye ratio)
- Superfat and fragrance ratio controls
- Mobile-responsive design
- Zero friction: no signup, no fees, instant results
- 20+ years of community trust

**Where SoapCalc falls short:**
- Calculator-only: no batch logging, no cure tracking, no cost analysis
- No recipe library or versioning
- No guided production process (Making Mode)
- Dense, utilitarian UI — functional but not delightful
- No workspace concept: each calculation is isolated
- No cost per bar or pricing guidance
- No retention surfaces or user progression
- Static: no learning, no adaptation, no personalization

**SoapCraft Pro exceeds SoapCalc by being a workspace, not a calculator:**

| Dimension | SoapCalc | SoapCraft Pro |
|-----------|----------|---------------|
| Core function | Lye calculator | Full soap-making workspace (recipe → batch → cure → cost) |
| Calculation | Deterministic, instant | Deterministic, instant (< 100ms), with confidence ranges |
| Oil database | 150+ oils | 150+ oils + custom ingredient costs + IFRA compliance |
| Quality predictions | 5 metrics, static scores | 5 metrics + confidence badges + AI trade-off explanations |
| Recipe management | None | Library with versioning, search, filter, ratings |
| Batch logging | None | Structured batch log with Making Mode (CP-guided) |
| Cure tracking | None | Estimated windows, observation logs, user-controlled completion |
| Cost analysis | None | Per-batch and per-bar costing with target pricing |
| UI design | Dense, utilitarian | Impeccable design: semantic type scale, restrained palette, deliberate motion |
| User progression | None | Onboarding quiz → first recipe → first batch → cure → cost |
| Free tier | Fully free, no limits | Calculator + 3 recipes + 1 active batch (genuinely useful) |
| Pro tier | N/A | $12/mo or $99/yr — everything above |

### Design Quality Standard
SoapCraft Pro must not look like a calculator. It must look like a meticulous chemist's notebook — calm precision, editorial restraint, and deliberate motion. Every screen must pass the `scan-generic.sh` quality gate from the `impeccable-design` skill before merge.

### Competitive Moat
SoapCalc is free and will remain free. SoapCraft Pro competes on:
1. **Workspace completeness** — recipe → batch → cure → cost in one flow
2. **Design quality** — impeccable, not generic
3. **Guided production** — Making Mode with CP step checklist and persistent timers
4. **Cost intelligence** — knowing what each bar costs and what to charge
5. **Deterministic trust** — calculations are authoritative; AI explains and recommends only

## 9. Information Architecture / App Structure

```
SoapCraft Pro
├── Onboarding (quiz → goal setting → method preference)
├── Dashboard (overview of active batches, upcoming cures, cost summary)
├── Recipe Builder (create, edit, scale, save recipes)
│   ├── Oil selection (percentage-based)
│   ├── Calculation display (lye, water, fragrance)
│   ├── Property ranges (hardness, lather, moisturizing)
│   ├── Warnings and validation
│   └── Save to library
├── Batches (list, create, view, edit)
│   ├── Batch Detail (inputs, conditions, outcome, photos)
│   └── Making Mode (step checklist, timers, temperatures)
├── Cure Tracker (calendar view, list view, observation logs)
├── Costing (cost per batch, cost per bar, pricing)
├── Recipe Library (curated + personal, browse, search, filter, save)
├── Settings (profile, preferences, integrations, billing)
├── Free Tier (calculator, limited recipes, one active batch)
└── Pro Tier ($12/month or $99/year — everything above)
```

## 9. Screen-by-Screen / Page-by-Page Requirements

### 9.1 Onboarding Flow
- **Purpose:** Assess user's experience level, goals, and preferred soap-making method in < 3 minutes.
- **Entry points:** Landing page CTA, signup after trial, first login for new users.
- **Required sections/components:** 3-step quiz (experience → goal → method), contextual action chips, progress indicator.
- **Required fields/content:** Experience level (beginner/intermediate/advanced), Primary goal (hobby/sell). The method preference field is removed from onboarding for v1; it is stored on the user profile for v2 personalization.
- **CTAs/actions:** "Start" → "Next" → "Get Started" (final).
- **Empty state:** N/A (this is the first screen).
- **Loading state:** Progress bar between steps.
- **Error state:** Preserve quiz answers if user navigates away.
- **Permission rules:** None.
- **Data dependencies:** User profile created on completion.
- **Analytics events:** quiz_started, quiz_step_completed, quiz_completed, onboarding_complete.
- **Acceptance criteria:** User can complete onboarding in < 3 minutes. First recipe creation is suggested immediately after.

### 9.2 Recipe Builder
- **Purpose:** Help users build accurate soap recipes with verified calculations.
- **Entry points:** Dashboard "New Recipe" button, Recipe Library "Create New," from Recipe "Make a Variation."
- **Required sections/components:** Oil selection (searchable list with SAP values and properties), percentage sliders, calculation display (lye, water, fragrance), property ranges, warnings panel, save action, AI "Suggest" button (slide-out panel with contextual suggestions).
- **Required fields/content:** Recipe name, Oil blend (% each oil), Superfat (%), Lye type (NaOH/KOH), Water calculation mode (lye concentration|water-to-lye ratio|percent of oils), Water calculation value, Batch size (weight + unit), Fragrance/EO (name, % load).
- **CTAs/actions:** "Calculate" → "Save to Library" → "Edit" → "Start This Batch."
- **Empty state:** "Your first recipe is one oil selection away."
- **Loading state:** Calculation progress indicator (instant for deterministic calc, < 100ms).
- **Error state:** "Please fix the following issues: [list of validation errors]."
- **Permission rules:** Free tier (save up to 3 recipes), Pro tier (unlimited).
- **Data dependencies:** Ingredient database (SAP values, properties), user preferences.
- **Analytics events:** recipe_builder_started, oil_selected, calculation_performed, recipe_saved, recipe_edited.
- **Acceptance criteria:** User can create a complete recipe with verified calculations in < 5 minutes. All calculations are deterministic and match SoapCalc for the same inputs within documented tolerance (±0.5g for lye/water quantities).

### 9.3 Batch Log + Making Mode
- **Purpose:** Record every input and outcome for each batch of soap.
|- **Purpose:** Record every input and outcome for each batch of soap. Safety warnings are present at every step where lye quantities are entered or compared.
|- **Entry points:** Dashboard "New Batch" button, from Recipe "Start This Batch," from Batch list.
|- **Required sections/components:** Input form (oils, lye, water, fragrance — pre-filled from recipe, editable), condition form (temperature, trace time, mold), outcome form (hardness, lather, moisturizing, scent, appearance, yield), photo attachment, notes, safety checklist (required before Starting Making Mode).
|- **Required fields/content:** Recipe ID (linked), Actual oils used (with weights), Actual lye amount, Actual water amount, Actual fragrance amount, Trace temperature, Mold type, Batch size (target vs actual), Cure start date, Outcome ratings (1-5 for each dimension), Actual number of bars, Photos, Notes.
|- **CTAs/actions:** "Start Batch" → "Log Outcome" → "Save" → "View Analytics."
|- **Empty state:** "Your first batch is one tap away. Start making!"
|- **Loading state:** Saving indicator with success confirmation.
|- **Error state:** Preserve all entered data if connection drops. "Your batch data is safe. Retry saving."
|- **Safety warning:** When actual lye amount differs from recipe calculation by more than ±10%, display: "Your actual lye amount differs from the recipe calculation by X%. Please verify this is intentional."
|- **Permission rules:** Free tier (1 active batch), Pro tier (unlimited active batches).
|- **Data dependencies:** Recipe data, user profile, ingredient database.
|- **Analytics events:** batch_started, batch_input_logged, batch_outcome_logged, batch_photo_added, batch_completed.
|- **Acceptance criteria:** User can create a batch, log all inputs, log outcome, and attach a photo in < 5 minutes. Actual quantities can differ from recipe quantities without breaking the link. Safety warnings appear when actual measurements deviate significantly from calculated values.

### 9.4 Making Mode
- **Purpose:** Guided batch production with structured steps and persistent timers. CP-specific in v1.
- **Scope note:** In v1, Making Mode supports cold process only. Hot process and melt-and-pour receive simplified batch logs (no Making Mode step guide). Users who selected HP or MP in onboarding see a contextual message: "Making Mode for [method] is coming soon."
- **Entry points:** From Batch Detail "Start Making," from Dashboard active batches.
- **Required sections/components:** Safety checklist (required before starting — "Wear gloves and eye protection. Work in a ventilated area. Keep vinegar nearby for lye spills."), step checklist (CP-specific steps), current step highlight, timer (persistent across refreshes), temperature targets, checkpoint alerts.
- **Required fields/content:** Step-by-step guide for CP soap (prepare workspace, measure oils, mix lye, combine, trace, pour, insulate), timer for each step, temperature targets, large tap targets (min 44x44px), high-contrast display option.
- **CTAs/actions:** "Next Step" → "Mark Complete" → "Skip" → "Pause Timer" → "Resume Timer."
- **Empty state:** N/A (this is an active flow).
- **Loading state:** Timer countdown with progress.
- **Error state:** "Timer paused. Resume when ready." (timer persists across page refreshes).
- **Permission rules:** Pro tier only (Making Mode is CP-specific in v1; HP and MP users receive a simplified batch log).
- **Data dependencies:** Batch data, CP step guide.
- **Analytics events:** making_mode_started, step_completed, timer_paused, timer_resumed, making_mode_completed.
- **Acceptance criteria:** User can follow a complete CP soap making process with guided steps and persistent timers. All steps must be marked complete or skipped to finish the batch. Timer survives page refreshes. Safety checklist must be acknowledged before Making Mode starts.

### 9.5 Cure Tracker
- **Purpose:** Track cure progress with honest estimates and user-controlled completion.
- **Entry points:** From Batch Detail "Track Cure," from Dashboard cure calendar.
- **Required sections/components:** Cure progress (days elapsed / estimated window), pH logging, hardness tracking, observation log, user-decided completion, reminders.
- **Required fields/content:** Cure start date, Cure method (air cure, wrap, etc.), pH readings (date + value), Hardness readings (date + value), Observation notes, Estimated cure window (based on oil blend and superfat), User completion date.
- **CTAs/actions:** "Log pH" → "Log Hardness" → "Add Observation" → "Mark as Complete" → "View History."
- **Empty state:** "Start tracking your cure by logging the first pH reading."
- **Loading state:** Progress bar showing cure days elapsed.
- **Error state:** "This pH reading falls outside the expected range. Verify the measurement method and record any observations before continuing."
- **Permission rules:** Pro tier only. Cure tracking is a post-production activity tied to batch completion.
- **Analytics events:** cure_tracking_started, ph_logged, hardness_logged, observation_added, cure_marked_complete, reminder_sent.
- **Acceptance criteria:** User can log pH and hardness readings, see cure progress with estimated window, add observations, and mark completion on their own terms. The system never claims to know "exactly when" the soap is ready. pH readings are one observation, not a ready/not-ready switch.

### 9.6 Costing
- **Purpose:** Know your ingredient and production cost per bar.
- **Entry points:** From Batch Detail "Calculate Cost," from Dashboard cost summary.
- **Required sections/components:** Ingredient cost breakdown (per batch), cost per bar calculator, target margin pricing, suggested selling price.
- **Required fields/content:** Ingredient costs (per unit from catalogue), Usage per batch, Batch size (number of bars), Target margin (%), Suggested selling price.
- **CTAs/actions:** "Calculate Cost" → "Set Target Price" → "View Recipe Margins."
- **Empty state:** "Add your ingredient costs to see your real cost per bar."
- **Loading state:** Real-time cost update as inputs change.
- **Error state:** "Missing cost data for [ingredient]. Add it to your cost catalogue to get accurate pricing."
- **Permission rules:** Pro tier (cost tracking).
- **Data dependencies:** Ingredient cost catalogue, batch data.
- **Analytics events:** cost_calculated, target_price_set, margin_analyzed.
- **Acceptance criteria:** User can input ingredient costs and get ingredient cost per bar + target selling price within 2 minutes. Formula: suggested selling price = cost per bar / (1 - target margin). Waste, labour, and overhead are excluded from cost calculation but noted as separate considerations. Cost catalogue is pre-populated with common ingredients and user-editable.

### 9.7 Recipe Library
- **Purpose:** Browse curated recipes and manage personal library. Part of the Recipe Builder module (shared infrastructure, not a standalone module).
- **Entry points:** Nav "Library" link, from Recipe Builder "Browse Similar."
- **Required sections/components:** Search bar, tag filters (oil blend, fragrance, method, skill level), recipe cards (name, creator, rating, key properties), recipe detail view, save to personal library, rating system.
- **Required fields/content:** Recipe name, Creator, Oil blend, Fragrance, Method, Skill level, Property ranges, Community rating (if public), User's own rating, Photo.
- **CTAs/actions:** "Search" → "Filter" → "Save to My Recipes" → "Rate" → "Make This."
- **Empty state:** "No recipes yet. Browse the curated library to get started."
- **Loading state:** Skeleton cards while loading.
- **Error state:** "Search failed. Try different keywords."
- **Permission rules:** Free tier (browse curated, save up to 3 personal recipes), Pro (full library + personal ratings + unlimited saves).
- **Data dependencies:** Curated recipe database, user ratings, search index.
- **Analytics events:** library_viewed, recipe_searched, recipe_viewed, recipe_saved, recipe_rated, recipe_made.
- **Acceptance criteria:** User can search, filter, view, save, and rate recipes. Search returns relevant results within 1 second.

### 9.8 Dashboard
- **Purpose:** Overview of active batches, upcoming cures, and cost summary.
- **Entry points:** App home after onboarding.
- **Required sections/components:** Active batches (list), Upcoming cures (calendar preview), Cost summary (this month's costs, avg cost per bar), Quick actions (new recipe, new batch, log cure, calculate cost).
- **Required fields/content:** Batch count, Cure count, Costs (month), Avg cost per bar, Quick action buttons.
- **CTAs/actions:** "New Recipe" → "New Batch" → "Log Cure" → "Calculate Cost."
- **Empty state:** "Welcome to SoapCraft Pro! Create your first recipe to get started."
- **Loading state:** Skeleton cards while loading.
- **Error state:** "Could not load dashboard data. Retry."
- **Permission rules:** All tiers.
- **Data dependencies:** Batch data, cure data, cost data.
- **Analytics events:** dashboard_viewed, quick_action_clicked.
- **Acceptance criteria:** User can see their active batches, upcoming cures, and cost summary at a glance. All data is current.

## 10. User Flows

### 10.1 First Recipe Creation Flow
1. User completes onboarding (experience → goal → method)
2. User lands on Dashboard → clicks "New Recipe"
3. User is taken to Recipe Builder
4. User selects oils and sets percentages
5. User sets batch size, superfat, lye type, concentration
6. System calculates lye, water, fragrance load, property ranges
7. User reviews calculations and warnings
8. User clicks "Save to Library"
9. Recipe saved → user redirected to Batch creation
10. User clicks "Start This Batch" → batch created from recipe
11. User can now use Making Mode to produce the soap

### 10.2 Batch Logging Flow
1. User navigates to Dashboard → clicks "New Batch"
2. User selects a recipe (or creates a new one)
3. User reviews pre-filled actual measurements (editable)
4. User inputs batch conditions (temperature, trace time, mold)
5. User saves the batch
6. User can log outcome after curing (hardness, lather, moisturizing, scent, appearance, yield)
7. User can attach photos
8. Outcome saved → batch marked complete

### 10.3 Cost Calculation Flow
1. User navigates to a Batch → clicks "Calculate Cost"
2. System auto-fills ingredient costs from cost catalogue
3. User reviews and adjusts if needed
4. System shows cost per batch + cost per bar + suggested target price
5. User can adjust target margin → price updates in real-time

## 11. Functional Requirements

### 11.0 Product Flow Reference

The complete product flow, state map, and user journey documentation is maintained in `flowchart/product-flow.md` and `flowchart/product-flow.excalidraw`. These documents are the authoritative reference for:

- All user journeys (new user, returning user, power user, free tier user)
- All feature flows (Recipe Builder, Batch Log, Cure Tracker, Costing)
- All global states (app, navigation, auth, subscription, data, form, calculation, notification)
- All inter-module interfaces and data contracts
- All empty, loading, error, and success states

The PRD references these documents — no state is unmapped, no journey is unexplored.

## 11. Functional Requirements

### Accounts & Authentication
- Email/password signup (free and paid tiers)
- Google OAuth (optional)
- **Trial:** 30-day Pro trial. The trial ends after 30 days or when the user completes one full batch cycle (batch creation → cure completion, marked by the user), whichever comes first. Users in-progress when the trial expires retain view and complete access to existing batches but cannot start new batches or access Pro-only features. Cure reminders continue during the trial.
- Tier-based feature gating (Free → Pro)

### Roles
- Free user: calculator, limited recipes (3), one active batch, curated recipe library
- Pro user: all features including unlimited recipes, batch tracking, cure tracking, costing, personal recipe library

### CRUD Operations
- Create/Read/Update/Delete recipes (with versioning — see §12)
  - Recipes with no batches can be permanently deleted
  - Recipes referenced by batches are soft-deleted (status: deleted) and preserve all referencing batches
  - Users are warned before deletion if batches exist
  - Recipe versions are immutable after creation
  - Deleting a personal saved recipe removes only the saved reference
  - Curated recipes cannot be modified directly by normal users
  - Making a variation creates a private recipe owned by the user
- Create/Read/Update/Delete batches
  - Batch status transitions: draft → making → curing → completed → archived
  - Completed batches retain cure observations and cost records
- Create/Read/Update/Delete cure observations
- Create/Read/Update/Delete cost records
- Create/Read/Update/Delete saved recipes (personal library)

### Search & Filter
- Full-text search on recipes
- Filter by oil blend, fragrance, method, skill level
- Sort by rating, newest, most popular

### Payments
- Stripe integration for subscription payments
- Pro: $12/month or $99/year (annual discount)
- **Free tier:** calculator, limited recipes (3), one active batch at a time, curated recipe library. Completed batches remain viewable in read-only history.
- Trial: 30 days or one complete batch cycle (whichever comes first)

### Integrations
- SoapCalc import/export (CSV) — for data migration. Import format: CSV with columns [recipe_name, oil_name, oil_percentage, superfat, lye_type, lye_concentration, water_ratio, batch_size, batch_unit, fragrance_name, fragrance_load]. Export format mirrors the import format. Invalid rows are reported with line numbers and error descriptions.

### Background Jobs
- AI formulation requests (async)
- Cure reminder notifications (cron)
- SEO content generation (v2)

### Free Tier Limit Enforcement
- When a free-tier user attempts to exceed their recipe limit (3) or active batch limit (1), show a modal explaining the limitation and offering to upgrade to Pro
- The user can still view and edit existing recipes/batches but cannot create new ones
- Completed batches remain viewable in read-only history

### AI Request Failure Handling
- AI requests have a 10-second timeout
- On failure, the UI shows "Assistant unavailable — try again later"
- The deterministic calculation engine continues to work independently of AI availability

### Design Quality Gates
- All PRs must pass `scan-generic.sh` (from the `impeccable-design` skill) before merge
- Banned patterns (hard bans, zero tolerance): per-section eyebrows, identical card grids, glassmorphism, image-hover zoom, gray-on-dark, side-stripe borders, pure black (`#000000`), hero-metric template, soft 12px radius
- Design system: semantic type scale, only supplied/explicit colours, restrained Impeccable design
- Every component must use the supplied hero-template JSON first for any hero sections
- Client mockups: semantic type scale, only supplied/explicit colours, restrained Impeccable design
- Editorial-looking heroes over generic service layouts
- Motion: CSS transitions and React Spring, 150–300ms for small state transitions, prefer opacity and transform for performance
- Accessibility: reduced motion supported, keyboard navigable, screen-reader labels on all inputs, minimum 16px body text, contrast ratio 4.5:1 minimum
- See `impeccable` repo at `/tmp/impeccable` for the full hard bans list
- The `impeccable-design` skill is the authoritative source for all design decisions. No component ships without passing its quality gates.

### Retention Surfaces (see DESIGN.md)
- Dashboard cure alert: prompts user to log a cure observation for batches approaching completion
- Recipe recommendation: suggests recipes based on user's oil preferences and batch history
- Batch reminder: prompts user to log an outcome for completed batches
- All retention surfaces are opt-in and respect user privacy settings

### Audit Logs
- Track all user actions for debugging and analytics
- Log AI model calls for quality monitoring

### Settings
- Profile settings (name, email, password)
- Notification preferences (email, in-app)
- Method preference (CP/HP/MP) — stored for v2 personalization
- Unit preferences (metric/imperial)
- Integration settings (SoapCalc import/export)
- Safety disclaimer acknowledgment (first-use)

### Community Rating
- Ratings attach to a specific recipe version (not the general recipe record) to prevent substantial edits from inheriting ratings earned by older formulations
- Ratings are user-specific and can be updated
- Community rating is v2 (public sharing); v1 ratings are private to the user

## 12. Data Model

### Core Entities (Relational)

```
User
  - id (UUID)
  - email
  - name
  - tier (free/pro)
  - onboardingComplete (boolean)
  - preferences (JSON: method, units, notifications)
  - createdAt
  - updatedAt

Ingredient
  - id (UUID)
  - name
  - type (oil, lye, fragrance, additive)
  - sapValueNaOH (number)
  - sapValueKOH (number)
  - hardnessFactor (number)
  - latherFactor (number)
  - moisturizingFactor (number)
  - ifraCategory (string, nullable)
  - maxUsagePercent (number)
  - isCustom (boolean)
  - createdBy (FK → User, nullable)
  - sapSource (string, nullable)
  - createdAt
  - updatedAt

Recipe
  - id (UUID)
  - userId (FK → User)
  - name
  - currentVersionId (FK → RecipeVersion)
  - visibility (private|curated)
  - creatorId (FK → User, nullable — null for system-curated)
  - createdAt
  - updatedAt

RecipeVersion
  - id (UUID)
  - recipeId (FK → Recipe)
  - version (integer)
  - superfat (number)
  - waterCalcMode (string: lye_concentration|water_lye_ratio|percent_of_oils)
  - waterCalcValue (number)
  - batchSize (number)
  - batchUnit (string: g|oz|kg|lbs)
  - fragranceLoad (number)
  - fragranceId (FK → Ingredient, nullable)
  - calculatedLye (number)
  - calculatedWater (number)
  - calculatedFragrance (number)
  - createdAt

RecipeIngredient
  - id (UUID)
  - recipeVersionId (FK → RecipeVersion)
  - ingredientId (FK → Ingredient)
  - percentage (number)
  - sortOrder (integer)

RecipeWarning
  - id (UUID)
  - recipeVersionId (FK → RecipeVersion)
  - type (string)
  - message (text)

SavedRecipe
  - id (UUID)
  - userId (FK → User)
  - recipeVersionId (FK → RecipeVersion)
  - savedAt

Batch
  - id (UUID)
  - userId (FK → User)
  - recipeVersionId (FK → RecipeVersion)
  - cureStartDate (date)
  - cureCompleteDate (date, nullable)
  - status (draft|making|curing|completed|archived)
  - createdAt
  - updatedAt

BatchIngredient
  - id (UUID)
  - batchId (FK → Batch)
  - ingredientId (FK → Ingredient)
  - plannedWeight (number)
  - actualWeight (number, nullable)
  - unit (string: g|oz|kg|lbs)

BatchLyeWater
  - id (UUID)
  - batchId (FK → Batch)
  - lyeAmount (number)
  - lyeUnit (string: g|oz|kg|lbs)
  - waterAmount (number)
  - waterUnit (string: g|oz|kg|lbs)
  - fragranceAmount (number, nullable)
  - fragranceUnit (string: g|oz|kg|lbs)

BatchCondition
  - id (UUID)
  - batchId (FK → Batch)
  - traceTemp (number, nullable)
  - moldType (string, nullable)
  - actualYield (number, nullable)

BatchOutcome
  - id (UUID)
  - batchId (FK → Batch)
  - hardness (number, 1-5, nullable)
  - lather (number, 1-5, nullable)
  - moisturizing (number, 1-5, nullable)
  - scent (number, 1-5, nullable)
  - appearance (number, 1-5, nullable)
  - notes (text, nullable)
  - actualBars (integer, nullable)
  - completedAt (datetime, nullable)

BatchPhoto
  - id (UUID)
  - batchId (FK → Batch)
  - url (string)
  - caption (text, nullable)
  - sortOrder (integer)
  - createdAt

CureObservation
  - id (UUID)
  - batchId (FK → Batch)
  - date (date)
  - phValue (number, nullable)
  - hardness (number, nullable)
  - notes (text, nullable)
  - createdAt

CostRecord
  - id (UUID)
  - userId (FK → User)
  - ingredientId (FK → Ingredient)
  - costPerUnit (number)
  - unit (string)
  - supplier (string, nullable)
  - date (date)
  - createdAt

BatchCost
  - id (UUID)
  - batchId (FK → Batch)
  - totalCost (number)
  - costPerBar (number)
  - targetMargin (number)
  - suggestedPrice (number)
  - calculatedAt (datetime)

BatchCostIngredient
  - id (UUID)
  - batchCostId (FK → BatchCost)
  - ingredientId (FK → Ingredient)
  - cost (number)
  - quantity (number)
  - unit (string)
  - costRecordId (FK → CostRecord, nullable)

RecipeRating
  - id (UUID)
  - userId (FK → User)
  - recipeVersionId (FK → RecipeVersion)
  - score (integer, 1-5)
  - notes (text, nullable)
  - createdAt
  - updatedAt

Subscription
  - id (UUID)
  - userId (FK → User)
  - tier (free/pro)
  - status (active|trialing|expired|cancelled)
  - trialStartDate (datetime, nullable)
  - trialEndDate (datetime, nullable)
  - stripeCustomerId (string, nullable)
  - currentPeriodStart (datetime, nullable)
  - currentPeriodEnd (datetime, nullable)
  - createdAt
  - updatedAt

MethodGuide
  - id (UUID)
  - method (string: CP|HP|MP)
  - stepNumber (integer)
  - title (string)
  - instructions (text)
  - temperatureTarget (number, nullable)
  - notes (text, nullable)

OnboardingState
  - id (UUID)
  - userId (FK → User)
  - step (integer)
  - answers (JSON)
  - completedAt (datetime, nullable)
  - createdAt

### Recipe Versioning

Editing a recipe after it has been used in batches must not retroactively change historical batch records. Each recipe save creates a new `RecipeVersion`. Batches reference a specific `RecipeVersion`. The current version is tracked on the `Recipe` record.

## 13. SEO Strategy (v2 — Post-Launch)

### Content Pillars (4 pillars for v1, expanded in v2)
1. **Soap Calculators** — "soap making calculator," "cold process soap calculator," "lye calculator for soap" + programmatic oil-specific calculator pages
2. **Soap Recipes** — "cold process soap recipe," "soap recipe for beginners" + curated recipe pages with verified formulations
3. **Soap Making Guides** — "how to make soap," "soap making for beginners," "cold process soap tutorial" + long-form guides (2,000+ words)
4. **Troubleshooting** — "soap making problems," "my soap didn't trace," "soap soda ash fix" + articles based on actual recurring user problems

### SEO Principles
- Do not generate thin programmatic pages for every oil/fragrance combination
- Each page must contain meaningful, validated formulation information
- Calculators and ingredient database pages are the primary SEO assets
- Curated recipes with verified formulations are the content moat
- Troubleshooting articles based on real user problems are the retention asset
- Measurable goals: impressions, indexed pages, qualified signups, top-ten rankings for defined clusters

## 14. Launch Plan

### Gate 1: Recipe Builder + Batch Log (Weeks 1-3)
- Recipe Builder with deterministic calculation engine
- Batch Log with Making Mode (CP-guided production)
- Free tier (calculator, 3 recipes, 1 active batch)
- Pro tier ($12/month or $99/year)
- 30-day trial or one complete batch cycle

### Gate 2: Cure Tracker + Costing (Weeks 3-5)
- Cure Tracker with estimated windows and observation logging
- Cost Per Batch / Per Bar with lightweight cost catalogue
- All v1 features integrated and tested

### Gate 3: Launch (Week 6)
- Launch Free tier + Pro trial
- Announce in r/soapmaking, SoapCalc community, Soapmaking Forum
- First 50 users → collect feedback
- SEO content: 10 pages (calculators + guides + troubleshooting) — v1 deliverable

### Gate 4: v2 (Months 2-4)
- Public recipe sharing and community features
- Fragrance pairing engine
- AI Troubleshooter
- Full inventory management
- Beginner's adaptive learning path
- AI predictions (outcome prediction based on batch history)
- Etsy/Shopify integration

## 15. Analytics & Instrumentation

### App Life Spec Metrics
- First-session recipe completion rate (target: 60% month 1)
- Signature interaction: % of users who save a recipe after calculations are shown
- Retention surfaces: which empty state prompts lead to action
- Onboarding flow: drop-off at each step of the 3-step quiz
- Error states: how often users hit errors, do they recover
- Motion: user feedback on animations (helping vs. hindering)
- Safety disclaimer acknowledgment rate (first-use)
- AI suggestion acceptance rate (target: > 80%)

### Event Tracking
All analytics events follow the pattern: `{feature}_{action}`
- onboarding_started, onboarding_step_completed, onboarding_complete
- recipe_builder_started, oil_selected, calculation_performed, recipe_saved, recipe_edited
- batch_started, batch_input_logged, batch_outcome_logged, batch_photo_added, batch_completed
- making_mode_started, step_completed, timer_paused, timer_resumed, making_mode_completed
- cure_tracking_started, ph_logged, hardness_logged, observation_added, cure_marked_complete, reminder_sent
- cost_calculated, target_price_set, margin_analyzed
- library_viewed, recipe_searched, recipe_viewed, recipe_saved, recipe_rated, recipe_made
- dashboard_viewed, quick_action_clicked

## 16. Compliance

- **CPSC:** Soap is a cosmetic product in the US depending on composition, claims, and intended use. Compliance features generate checklists and documentation summaries.
- **MoCRA:** Modernization of Cosmetics Regulation Act. Compliance features generate MoCRA documentation export.
- **IFRA:** International Fragrance Association. Fragrance calculator includes IFRA usage category and concentration guidance. Not a legal certification — generates documentation and warnings.
- **GDPR:** User data is encrypted at rest, users can export/delete their data.
- **PCI DSS:** Payment processing handled by Stripe (PCI compliant), no card data stored on our servers.

**Compliance disclaimers:** The compliance features generate checklists, documentation summaries, missing-information warnings, and exportable records. They do not constitute legal advice or certification. Users are responsible for ensuring their own compliance with applicable regulations.

## 17. Non-Functional Requirements

- **Performance:** Page load < 2s, calculation < 100ms, search results < 1s
- **Availability:** 99.9% uptime target
- **Security:** HTTPS everywhere, encrypted PII at rest, no raw API keys in client code
- **Scalability:** Architecture must scale horizontally. Initial paid infrastructure budget supports first defined usage target without major rearchitecture.
- **Accessibility:** WCAG 2.1 AA, keyboard navigable, screen reader compatible, reduced motion support
- **SEO:** Semantic HTML, structured data, fast Core Web Vitals
- **Internationalization:** English only in v1, architecture supports i18n for v2

## 18. Open Questions

- Does SoapCalc have an API or only manual export/import? (verify via SoapCalc community)
- What is the current OpenRouter pricing for Claude/GPT models used in formulation assistance? (verify via OpenRouter API docs)
- What SAP values should be included in the default ingredient database? (start with top 20 oils by community usage)
- AI accuracy metric: > 80% of AI suggestions are accepted or acted upon by users, measured as "AI suggestion acceptance rate" in analytics. AI may never recommend an adjustment that violates a deterministic safety constraint without visibly flagging the conflict.
- Preferred default persona voice: calm expertise (not playful, not salesy) — confirm with Isaac
- What is the target first-user onboarding time? (recommend: < 3 minutes to first recipe)
- What is the exact free-tier limitation for recipes? (recommend: 3 recipes on free tier)
- What happens to Pro data after cancellation? (recommend: read-only access for 30 days, then data export)
- How does trial expiry affect existing batches and cure reminders? (recommend: cure reminders continue, new features gated)
- What is the CSV format for SoapCalc import/export? (recommend: columns [recipe_name, oil_name, oil_percentage, superfat, lye_type, lye_concentration, water_ratio, batch_size, batch_unit, fragrance_name, fragrance_load]; invalid rows reported with line numbers and error descriptions)
- How does recipe versioning work in the UI? (recommend: version history accessible from Recipe detail view; users can view previous versions, compare differences, and revert; "Make a Variation" creates a new RecipeVersion with the current recipe as parent)
- How is the cost catalogue managed? (recommend: users can add, edit, and delete ingredient costs; each entry links to an Ingredient and specifies costPerUnit and unit; catalogue pre-populated with common ingredients)
- What are the Making Mode step completeness rules? (recommend: all CP steps must be marked complete or skipped to finish the batch)
- What happens when a trial expires mid-batch? (recommend: user retains view and complete access to in-progress batches but cannot start new batches or access Pro-only features)
- What happens when a free-tier user exceeds their limit? (recommend: modal explaining the limitation and offering to upgrade; user can still view and edit existing recipes/batches but cannot create new ones)
- How does AI request failure degrade? (recommend: 10-second timeout; on failure, UI shows "Assistant unavailable — try again later"; deterministic calculation engine continues independently)
- What is the fragrance load calculation base? (recommend: percentage of total oil weight; e.g., 1000g oil blend + 3% load = 30g fragrance)
- What property prediction methodology is used? (recommend: SAP-based blending with named factors per oil; scores normalized to 1-10 scale; ranges derived from published SAP data and blending rules, not user batch history)
- What are the confidence indicators for property predictions? (recommend: High ≥5 oils all published SAP; Medium 3-4 oils all published SAP; Low <3 oils or user-edited SAP; displayed as color-coded badge green/yellow/red)
