# SoapCraft Pro — Unified Product Flow & State Map

> **Reference document for the PRD.** Every user journey, feature flow, state, and interface is mapped here. The PRD references this document — no state is unmapped, no journey is unexplored.

---

## 1. Product Overview

SoapCraft Pro is a workspace for soap makers — not just a calculator. The four core modules form a single pipeline:

```
Recipe Builder → Batch Log + Making Mode → Cure Tracker → Cost Per Batch/Per Bar
```

Each module feeds into the next. No module exists in isolation.

---

## 2. User Journeys

### 2.1 New User Journey (First-Time Visitor)

```
Land on homepage
  → See hero + demo calculation (live, deterministic)
  → See feature cards (Recipe Builder, Batch Log, Cure Tracker, Costing)
  → Click "Start building" or "Browse recipes"
  → If new: see empty state (no recipes yet)
  → Recipe Builder opens with template recipe (Castile 101)
  → User customizes oils → calculations update live
  → User saves recipe → recipe appears in Library
  → User clicks "Make this batch" → Batch Log opens pre-filled from recipe
  → User follows Making Mode steps → logs observations
  → Batch completes → Cure Tracker auto-starts
  → User monitors cure → cure prediction updates
  → Cure complete → Costing auto-calculates
  → User sees cost per bar → can adjust ingredient costs
  → User saves batch → appears in Library
  → Loop: user creates another recipe or batch
```

**States mapped:**
- Landing (hero + demo)
- Feature discovery (cards)
- Empty state (no recipes)
- Template recipe loaded
- Recipe editing (live calculation)
- Recipe saved (library entry)
- Batch creation (pre-filled from recipe)
- Making Mode (step-by-step)
- Observation logging
- Batch completion
- Cure tracking (auto-started)
- Cure monitoring (predictions)
- Cure completion
- Cost calculation (auto)
- Cost optimization (manual)
- Cost saved

### 2.2 Returning User Journey

```
Land on homepage
  → See hero + demo calculation
  → Click "Browse recipes" → see recipe library
  → Filter/sort recipes (by name, date, oil blend)
  → Open existing recipe → see calculation results
  → Edit recipe → calculations update live
  → Save changes
  → Click "Make new batch from this recipe"
  → Batch Log opens pre-filled
  → Follow Making Mode → log observations
  → Batch completes → Cure Tracker auto-starts
  → Monitor cure → predictions update
  → Cure complete → Costing auto-calculates
  → Review cost per bar → adjust if needed
  → Save batch → appears in Library
```

**States mapped:**
- All new user states PLUS:
- Recipe library (with existing recipes)
- Recipe filtering/sorting
- Recipe detail view (read-only)
- Recipe edit (with live calc)
- Batch creation from existing recipe

### 2.3 Power User Journey

```
Land on homepage
  → Click "Browse recipes" → see library
  → Compare two recipes side-by-side
  → Open recipe A → note properties
  → Open recipe B → note properties
  → Compare: hardness, lather, cost, cure time
  → Decide which to make → create batch
  → Follow Making Mode
  → Batch completes → Cure Tracker
  → Monitor cure → compare prediction vs actual
  → Cure complete → Costing
  → Review cost per bar
  → Optimize: swap ingredients, adjust percentages
  → Save optimized recipe as new version
  → Create batch from optimized recipe
  → Repeat cycle
```

**States mapped:**
- All returning user states PLUS:
- Recipe comparison (side-by-side)
- Cost optimization (ingredient swap suggestions)
- Recipe versioning (save as new version)
- Prediction vs actual comparison

### 2.4 Free Tier User Journey

```
Land on homepage
  → See hero + demo calculation
  → Click "Start building"
  → Recipe Builder opens (calculator only)
  → Can create up to 3 recipes
  → Can have 1 active batch at a time
  → Cannot access Batch Log Making Mode (limited)
  → Cannot access Cure Tracker (limited)
  → Cannot access Costing (limited)
  → Upgrade prompt when hitting limits
```

**States mapped:**
- Calculator-only mode
- Recipe limit reached (3/3)
- Batch limit reached (1/1)
- Upgrade prompt

---

## 3. Feature Flows

### 3.1 Recipe Builder Flow

```
Open Recipe Builder
  → State: Empty (no recipe loaded)
  → Action: Choose template or start blank
  → State: Template loaded / Blank recipe
  → Action: Add oils (search + select from 150+)
  → State: Oils selected, percentages set
  → Action: Adjust superfat, lye concentration, water ratio
  → State: Calculations updating live
  → Action: Add fragrance/essential oils
  → State: Fragrance load set
  → Action: Add mold dimensions
  → State: Mold volume calculated
  → Action: Review property predictions
  → State: Predictions shown (hardness, cleansing, etc.)
  → Action: Save recipe
  → State: Recipe saved, appears in Library
  → Action: Edit recipe
  → State: Recipe in edit mode, calculations update live
  → Action: Delete recipe
  → State: Recipe removed from Library (confirmation shown)
  → Action: Duplicate recipe
  → State: New recipe created as copy
```

**States:**
- Empty (no recipe loaded)
- Template loaded
- Blank recipe
- Oils selected
- Calculations live
- Fragrance set
- Mold set
- Predictions shown
- Saved (library entry)
- Edit mode
- Deleted (with confirmation)
- Duplicated

**Error states:**
- Oil not found in library
- Percentages don't sum to 100%
- Lye concentration out of range
- Superfat negative or too high
- Mold dimensions invalid
- Calculation error (e.g., division by zero)

**Empty states:**
- No recipes in library
- No oils selected yet
- No fragrance added

### 3.2 Batch Log + Making Mode Flow

```
Open Batch Log
  → State: Empty (no batches yet)
  → Action: Create batch from recipe
  → State: Batch created, pre-filled with recipe data
  → Action: Enter batch name, date, notes
  → State: Batch details filled
  → Action: Start Making Mode
  → State: Making Mode active, step 1 shown
  → Action: Complete step 1 (e.g., "Weigh oils")
  → State: Step 1 complete, step 2 available
  → Action: Complete step 2 (e.g., "Mix lye solution")
  → State: Step 2 complete, step 3 available
  → Action: Complete step 3 (e.g., "Combine and stir")
  → State: Step 3 complete, step 4 available
  → Action: Log observation (e.g., "Reached trace at 45 min")
  → State: Observation logged
  → Action: Complete remaining steps
  → State: All steps complete, batch marked "Done"
  → Action: Save batch
  → State: Batch saved, appears in Library
  → Action: View batch history
  → State: Batch history list
  → Action: Open completed batch
  → State: Batch detail view (read-only)
```

**States:**
- Empty (no batches)
- Batch created (pre-filled)
- Batch details filled
- Making Mode active (step N)
- Step complete
- Observation logged
- All steps complete
- Batch saved
- Batch history
- Batch detail (read-only)

**Error states:**
- Recipe not found when creating batch
- Batch name already exists
- Step completion out of order
- Observation saved without required fields

**Empty states:**
- No batches yet
- No observations logged yet

### 3.3 Cure Tracker Flow

```
Open Cure Tracker
  → State: Empty (no batches in cure)
  → Action: Batch completes → auto-enter cure tracking
  → State: Cure tracking started
  → Action: Set cure parameters (expected duration, environment)
  → State: Cure parameters set, timeline shown
  → Action: Check in daily (log observation)
  → State: Observation logged, progress updated
  → Action: View cure prediction
  → State: Prediction shown (based on similar batches)
  → Action: Mark batch as "cured"
  → State: Batch marked cured, moved to completed
  → Action: View cure history
  → State: Cure history list
  → Action: Open cure detail
  → State: Cure detail view (read-only)
```

**States:**
- Empty (no batches in cure)
- Cure tracking started
- Parameters set
- Observation logged
- Progress updated
- Prediction shown
- Batch cured
- Cure history
- Cure detail (read-only)

**Error states:**
- Batch not found when starting cure
- Cure parameters invalid
- Observation saved without required fields
- Prediction unavailable (no similar batches)

**Empty states:**
- No batches in cure
- No observations logged yet

### 3.4 Costing Flow

```
Open Costing
  → State: Empty (no batches to cost)
  → Action: Select batch to cost
  → State: Batch selected, ingredients listed
  → Action: Enter ingredient costs (per unit)
  → State: Costs entered, per-bar calculation shown
  → Action: Adjust quantities/prices
  → State: Costs update live
  → Action: Set target margin
  → State: Target price shown
  → Action: Compare with market prices
  → State: Market comparison shown
  → Action: Save cost breakdown
  → State: Cost breakdown saved, appears in Library
  → Action: View cost history
  → State: Cost history list
  → Action: Open cost detail
  → State: Cost detail view (read-only)
```

**States:**
- Empty (no batches to cost)
- Batch selected
- Costs entered
- Per-bar calculation shown
- Target margin set
- Target price shown
- Market comparison shown
- Cost breakdown saved
- Cost history
- Cost detail (read-only)

**Error states:**
- Batch not found when selecting
- Ingredient cost not available
- Calculation error (e.g., missing ingredient data)
- Target margin invalid (negative, too high)

**Empty states:**
- No batches to cost
- No costs entered yet

---

## 4. Inter-Module Interfaces

### 4.1 Recipe Builder → Batch Log

**Interface:** Recipe is used as a template for batch creation.

**Data passed:**
- Oil blend (oil IDs + percentages)
- Fragrance load
- Lye concentration
- Water ratio
- Superfat percentage
- Mold dimensions

**Contract:**
- Recipe must exist and be saved
- Recipe must have a valid oil blend (percentages sum to 100%)
- Batch is pre-filled with recipe data but can be modified
- Changes to the recipe after batch creation do NOT affect the batch

**Error states:**
- Recipe not found
- Recipe has invalid oil blend
- Recipe is a free-tier template (limited editing)

### 4.2 Batch Log → Cure Tracker

**Interface:** Batch completion triggers cure tracking.

**Data passed:**
- Batch ID
- Recipe ID (for prediction comparison)
- Completion date
- Oil blend (for cure prediction)
- Batch notes/observations

**Contract:**
- Batch must be marked "Done" in Batch Log
- Cure tracking auto-starts when batch is completed
- User can set cure parameters or accept defaults
- Cure predictions use data from similar completed batches

**Error states:**
- Batch not found
- Batch already in cure tracking
- No similar batches for prediction

### 4.3 Batch Log → Costing

**Interface:** Batch data is used for cost calculation.

**Data passed:**
- Batch ID
- Recipe ID (for ingredient list)
- Oil blend (for cost estimation)
- Fragrance used (for cost estimation)
- Any additional costs logged during Making Mode

**Contract:**
- Batch must exist and be completed
- Ingredient costs must be entered in Costing
- Costing can be accessed before batch completion (estimate mode)

**Error states:**
- Batch not found
- Ingredient costs missing
- Recipe not found (for ingredient list)

### 4.4 Recipe Builder → Costing

**Interface:** Recipe ingredients are used for cost estimation (estimate mode).

**Data passed:**
- Recipe ID
- Oil blend (for cost estimation)
- Fragrance (for cost estimation)

**Contract:**
- Recipe must exist
- Ingredient costs must be entered in Costing
- Estimate mode shows projected cost per bar before batch is created

**Error states:**
- Recipe not found
- Ingredient costs missing

### 4.5 Cure Tracker → Costing

**Interface:** Cure completion triggers final cost calculation.

**Data passed:**
- Batch ID
- Cure duration (actual vs predicted)
- Any additional costs incurred during cure

**Contract:**
- Batch must be marked "Cured" in Cure Tracker
- Final cost calculation includes any cure-phase costs
- User can adjust costs before finalizing

**Error states:**
- Batch not found
- Cure data incomplete
- Cost calculation error

---

## 5. Global States

### 5.1 Application States

| State | Description |
|---|---|
| **Loading** | App is initializing, loading data |
| **Ready** | App is fully loaded, user can interact |
| **Error** | An error occurred, user sees error message |
| **Offline** | App is offline, cached data available |
| **Syncing** | Data is being synced with backend |

### 5.2 Navigation States

| State | Description |
|---|---|
| **Home** | Homepage with hero + demo + feature cards |
| **Recipes** | Recipe library (list view) |
| **Recipe Edit** | Recipe Builder in edit mode |
| **Recipe Detail** | Recipe view (read-only) |
| **Batches** | Batch library (list view) |
| **Batch Log** | Batch Log + Making Mode |
| **Cure** | Cure Tracker |
| **Costing** | Cost Per Batch/Per Bar |
| **Library** | Combined view of recipes + batches + cures + costs |
| **Settings** | User settings, subscription management |
| **Onboarding** | First-time user onboarding flow |

### 5.3 Authentication States

| State | Description |
|---|---|
| **Logged Out** | User is not authenticated |
| **Logged In** | User is authenticated |
| **Session Expired** | Session expired, user needs to re-authenticate |
| **Upgrading** | User is on free tier, upgrading to Pro |

### 5.4 Subscription States

| State | Description |
|---|---|
| **Free** | User is on free tier (calculator + 3 recipes + 1 active batch) |
| **Pro Trial** | User is on 14-day Pro trial |
| **Pro Active** | User is on paid Pro tier |
| **Pro Expired** | User's Pro subscription has expired |
| **Payment Pending** | Payment is being processed |
| **Payment Failed** | Payment failed, user needs to retry |

### 5.5 Data States

| State | Description |
|---|---|
| **Empty** | No data exists for this module |
| **Loading** | Data is being fetched |
| **Loaded** | Data is available and displayed |
| **Error** | Data fetch failed |
| **Stale** | Data is cached but may be outdated |
| **Syncing** | Data is being synced with backend |
| **Saved** | Data has been saved successfully |
| **Saving** | Data is being saved |
| **Save Error** | Data save failed |

### 5.6 Form States

| State | Description |
|---|---|
| ** pristine** | Form has not been modified |
| **Dirty** | Form has been modified but not saved |
| **Valid** | Form passes all validation |
| **Invalid** | Form has validation errors |
| **Submitting** | Form is being submitted |
| **Submitted** | Form has been submitted successfully |
| **Submit Error** | Form submission failed |

### 5.7 Calculation States

| State | Description |
|---|---|
| **Idle** | No calculation in progress |
| **Calculating** | Calculation is in progress |
| **Complete** | Calculation completed successfully |
| **Error** | Calculation failed |
| **Stale** | Calculation result is outdated (inputs changed) |

### 5.8 Notification States

| State | Description |
|---|---|
| **None** | No notifications |
| **Info** | Informational notification |
| **Success** | Action completed successfully |
| **Warning** | Warning about potential issue |
| **Error** | Error occurred |
| **Dismissed** | Notification has been dismissed |

---

## 6. Design System Reference

### 6.1 Type Tokens

| Token | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| Display | Playfair Display | 48-64px | 700 | 1.1 |
| Section Title | Playfair Display | 32-40px | 600 | 1.2 |
| Subsection Title | Playfair Display | 24-28px | 600 | 1.3 |
| Body | DM Sans | 16px | 400 | 1.6 |
| Body Emphasis | DM Sans | 16px | 500 | 1.6 |
| Label | DM Sans | 14px | 500 | 1.4 |
| Metadata | DM Sans | 12px | 400 | 1.4 |
| Button | DM Sans | 14-16px | 600 | 1.4 |

### 6.2 Color Palette

| Token | HSL | Usage |
|---|---|---|
| --background | 38 12% 97% | Page background |
| --foreground | 25 12% 12% | Primary text |
| --muted | 38 8% 94% | Muted backgrounds |
| --muted-foreground | 30 8% 48% | Secondary text |
| --primary | 25 60% 35% | Primary actions, links |
| --primary-foreground | 0 0% 98% | Text on primary |
| --accent | 30 90% 50% | Highlights, badges |
| --accent-foreground | 0 0% 98% | Text on accent |
| --success | 145 45% 40% | Success states |
| --warning | 38 90% 50% | Warning states |
| --destructive | 5 65% 55% | Error states |
| --info | 210 30% 55% | Info states |
| --card | 0 0% 100% | Card backgrounds |
| --border | 30 10% 88% | Borders |

### 6.3 Motion Vocabulary

| Interaction | Duration | Easing |
|---|---|---|
| Navigation | 150-300ms | ease-out |
| Submit/commit | 200ms | ease-in-out |
| Loading/resolution | 300ms | ease-in-out |
| Sheet/modal | 250ms | ease-out |
| Success/reward | 150ms | ease-out |
| Drag/direct | follows user | n/a |
| Error/undo | 200ms | ease-in-out |

---

## 7. App Life Spec

### Core Loop
User creates a recipe → starts a batch → follows Making Mode → tracks cure → analyzes cost → creates next recipe.

### Moment of Truth
When the user sees their first verified calculation result — the deterministic output confirms their recipe is correct. This is the moment that builds trust in the product.

### Goal Metric
Activation rate: % of first-session users who complete their first recipe calculation and save it.

### User Constraint
Never slow down the core calculation flow. The calculator must respond in <100ms. No AI generation delays.

### Personality Role
Calm, precise, authoritative — like a meticulous chemist's notebook. Not playful, not flashy.

### Signature Interaction
Trigger: User adjusts an oil percentage in the Recipe Builder.
Before: The slider is at its previous position.
During: Calculations update in real-time as the slider moves.
After: All dependent values (lye, water, properties) reflect the new percentage.
Feedback: Subtle highlight on changed values, no animation on stable values.
Metric: % of users who adjust at least one oil percentage before saving.

### First-Use Prompts
- Empty recipe builder: "Start with a template — Castile 101" (contextual chip)
- Empty batch log: "Create your first batch from a recipe" (contextual chip)
- Empty cure tracker: "Complete a batch to start tracking cure" (contextual chip)
- Empty costing: "Select a batch to calculate cost per bar" (contextual chip)

### Retention Surface
The dashboard shows the user's last 3 batches with cure status and cost per bar — a glanceable summary that brings the user back.

---

## 8. Accessibility & Performance Budget

| Metric | Target |
|---|---|
| First Contentful Paint | <1.5s |
| Time to Interactive | <2.5s |
| Lighthouse Performance | >90 |
| Lighthouse Accessibility | >95 |
| Keyboard navigation | All interactive elements reachable |
| Screen reader labels | All interactive elements labeled |
| Reduced motion | Respects `prefers-reduced-motion` |
| Contrast ratio | Minimum 4.5:1 for text |
| Touch targets | Minimum 44x44px |
