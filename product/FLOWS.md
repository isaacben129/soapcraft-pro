# SoapCraft Pro — Customer Journeys and Flows

**Version:** 1.0 — Anonymous-First Utility Hub Flows
**Companion to:** `product/PRD.md`, `product/DESIGN.md`, `product/ARCHITECTURE.md`
**Approved direction:** Isaac, 2026-09-09 — anonymous-first, free, tool-first utility hub
**Date:** 2026-09-10

---

## 1. Flow numbering and legend

| Prefix | Meaning |
|--------|---------|
| `AF` | Anonymous Flow (no login, no account) |

All flows start from a public, ungated entry point. Account creation is never a precondition for any core result. No optional-account flows exist in current launch — cloud persistence is a future slice.

---

## 2. Anonymous flows (no login)

### AF-1: Homepage → Tool Catalogue → Batch Cost → Visible Result → Local Save/Export → Reload

**Premise:** A soapmaker lands on the homepage, discovers the tool catalogue, uses the batch cost calculator, sees a complete visible result, and saves or exports — without creating an account.

**Preconditions:** None. Public route. No cookie consent dependency.

**Steps:**
1. User enters `/` (homepage) or `/tools` (tool catalogue)
2. Homepage distributes content through visual modules: hero → tool discovery/value cards → workflow/timeline → UI/proof panels → use-case modules → safety/trust boundary → FAQ → CTA
3. User selects Batch Cost Calculator from `/tools` catalogue
4. Tool loads with optional pre-filled example values, clearly labelled "Example"
5. User enters their own inputs (ingredient costs, quantities, batch weight, packaging, labor)
6. Deterministic calculation runs; complete result updates in real time
7. User sees complete output: cost breakdown, cost per unit, assumptions, warnings, formula revision
8. User chooses one or more actions:
   - Print / export (PDF or clipboard)
   - Create a share URL (local state link, no email required)
   - Save locally
9. Result is delivered; no gate, no email capture, no account prompt
10. User reloads the page or returns later via share URL; context is preserved locally

**Observable result:** User has a complete cost calculation result, a print/export artifact, or a share URL. No personal data collected.

**Branches:**
- **User enters partial inputs →** Result shows missing-cost warnings; result is explicitly incomplete and cannot be styled as a recommendation
- **User shares URL →** Share link contains only calculation state; no email or personal data embedded
- **User returns later →** Local state is preserved; tool loads with previous inputs

**Recovery:**
- If calculation errors: previous valid inputs preserved; error message with correlation ID; retry option
- If browser refresh: local input preserved; calculation re-runs deterministically
- If share URL is corrupted or expired: user starts calculation from scratch

**Persistent outcome:** Nothing persists server-side. The share URL and browser local state are the only persistent artifacts. Analytics events are aggregate and contain no recipe data.

---

### AF-2: Homepage → Tool Catalogue → Recipe Scaling → Visible Result → Context Handoff

**Premise:** A soapmaker discovers recipe scaling via the tool catalogue, scales a recipe, and uses the result as context for a connected tool.

**Preconditions:** None. Public route.

**Steps:**
1. User enters `/tools` or navigates from the homepage
2. User selects Recipe Scaling from the catalogue
3. Tool loads with optional pre-filled example values, clearly labelled "Example"
4. User enters source recipe quantities and target batch weight
5. Deterministic calculation produces scaled ingredient amounts
6. User sees complete output: scaled quantities, assumptions, formula revision
7. User can export, share, or continue to a connected tool (e.g., batch cost)
8. Relevant inputs transfer with visible editable fields

**Observable result:** User has a complete scaling result and can hand off context to a connected tool.

**Branches:**
- **User doesn't continue →** Calculation result remains on the tool page
- **User continues →** Context transfers (see AF-2b)

**Recovery:**
- If transfer fails: user can manually re-enter inputs in the connected tool
- If browser refresh: local state preserved; calculation re-runs

---

### AF-3: Share URL → Re-entry → Continue Calculation

**Premise:** A user receives or creates a share URL, opens it in a new browser, and continues working with the shared context.

**Preconditions:** Valid share URL containing calculation state.

**Steps:**
1. User opens share URL in a browser (new or existing)
2. URL parameters decode into tool inputs; tool loads with transferred state
3. All transferred values are visibly editable; user can modify any field
4. Calculation recalculates with transferred + modified inputs
5. User continues the calculation workflow
6. At any point, user can create a new share URL with the updated state

**Observable result:** Tool loads with pre-populated state from the share URL. Values are editable and calculation is live.

**Branches:**
- **URL is valid →** State loads correctly
- **URL is corrupted/expired →** User starts from the tool's empty state; informational message

**Persistent outcome:** Nothing persists server-side. The share URL is the only carrier of state.

---

### AF-4: Homepage → Safety/Trust Boundary → Public Information

**Premise:** A user visits the safety or trust boundary section of the homepage to understand what is and isn't released.

**Preconditions:** None. Public route.

**Steps:**
1. User navigates to the safety/trust boundary module on the homepage
2. Sees clear statement: chemistry is gated and not publicly released
3. Sees safety disclaimers describing scope
4. Sees that business outputs are planning aids, not advice
5. Sees privacy, terms, and safety pages are publicly accessible
6. Understands that no anonymous result requires authentication

**Observable result:** User understands the safety and trust boundaries of the product.

---

## 3. IA Cleanup flow (Journey 0 — prerequisite)

### AF-C1: Route Normalization

**Premise:** Before any routes are exposed, the IA must be cleaned up.

**Steps:**
1. Dead `/tools` directory content is removed or replaced
2. Empty category `/tools` pages are removed or populated
3. Legacy `/calculators` paths are normalized as redirects or removals
4. Exposed pricing and subscription pages are removed from navigation and sitemap
5. Homepage 404 routes are fixed
6. Canonical `/tools` route is established with constrained catalogue
7. Mobile stacking is verified with no horizontal overflow

**Observable result:** All public routes return 200; navigation and sitemap contain only approved routes; no dead or empty pages remain.

---

## 4. Context transfer between connected tools

### Transfer protocol

When a user moves from Tool A to Tool B:

1. **Source tool exports:** Only fields the user entered or explicitly accepted
2. **Target tool imports:** Transferred fields populate editable input fields
3. **Visual transfer indicators:** Target tool shows which fields were inherited and from which tool
4. **Editable by default:** All transferred values are editable, not read-only
5. **Formula revision:** Each result records the formula revision used
6. **No data loss:** If a field cannot transfer, it appears empty with a note explaining why

### What transfers

| From → To | Transfers |
|-----------|-----------|
| Recipe Scaling → Batch Cost | Ingredient quantities, target batch weight, recipe version |
| Batch Cost → Recipe Scaling | Cost basis, ingredient costs |
| Any tool → Export/Share | Current calculation state, formula revision, assumptions |

### What does NOT transfer

- Personal data (email, name) unless explicitly entered in the target tool
- Account credentials
- Previous calculation history (unless logged into account — future slice)
- Analytics identifiers

---

## 5. Reload and re-entry behavior

### Without account (anonymous)

| What persists | What does not persist |
|---------------|----------------------|
| Local browser state (inputs, results) | Server-side state |
| Share URL (if bookmarked) | Session data |
| Browser form autofill (if supported) | Tool position/scroll |
| Analytics aggregate events (no recipe data) | Any user-specific state |

**Re-entry behavior:** User opens the tool page → local state restores if browser storage persists. If they have a share URL bookmarked, they can reopen it. Otherwise, they re-enter everything.

### With account (future slice)

Not part of current launch. Cloud persistence requires account creation and is a future vertical journey.

---

## 6. Error states and recovery

### E-1: Calculation Error

**Trigger:** Deterministic calculation produces unexpected result or validation failure.

**Behavior:**
- Previous valid inputs preserved in the form
- Error message identifies the specific issue
- Warning state includes words/icon (not color only)
- Retry option available at the failure site
- Correlation/reference ID shown only if useful for support

### E-2: Save Failure

**Trigger:** Local save fails (storage quota, browser error).

**Behavior:**
- Save state shows "Save failed — Retry"
- All user data preserved locally
- No false "Auto-saved" message
- User can retry the save action

### E-3: Tool Loading Failure

**Trigger:** Tool page fails to load (API error, timeout, server unavailable).

**Behavior:**
- Error message with clear description
- Retry button at the failure site
- Skeleton loading states for server-loading content
- No blank shell

### E-4: Share URL Corruption/Expiry

**Trigger:** Share URL is malformed, tampered with, or expired.

**Behavior:**
- Informational message: "This link is no longer valid. Start a new calculation."
- Tool loads with empty state
- No data lost

---

## 7. Persistent outcomes summary

### Anonymous user outcomes (current launch)

- No persistent server-side data (ephemeral only)
- Share URL is the only persistent artifact (contains calculation state, no personal data)
- Browser local state preserves inputs and results across reloads
- Aggregate analytics events (no PII, no recipe data)
- Email only if explicitly exchanged for a specific delivered artifact with consent (future slice)

### Account-holding user outcomes (future slice)

- Cloud persistence across devices
- Multiple saved products/batches/events
- Historical comparisons
- Reusable supplier/item cost records
- Inventory and purchase-plan synchronization

---

## 8. Flow matrix

| Flow ID | Entry | Auth | Core action | Transfer | Persistent outcome |
|---------|-------|------|-------------|----------|-------------------|
| AF-1 | Homepage/Tool | None | Calculate → Export/Save | None | Local state + share URL |
| AF-2 | Homepage/Tool | None | Scale → Continue | Tool→Tool | Local state + share URL |
| AF-3 | Share URL | None | Re-enter → Continue | URL→Tool | None (ephemeral) |
| AF-4 | Homepage | None | Safety/Trust boundary | None | None (informational) |
| AF-C1 | IA Cleanup | None | Route normalization | None | Route taxonomy |

---

## 9. Anti-patterns explicitly excluded

This flow documentation does **not** include:

- **Exit-intent email capture:** No popups or modals triggered by mouse movement toward the browser close button
- **Fake case studies:** No fabricated user stories or testimonials
- **Mandatory gates:** No email requirement before viewing results; no account requirement to use any tool
- **Fake social proof:** No fabricated user counts, ratings, or testimonials
- **Dark patterns:** No confusing unsubscribe, no hidden account deletion, no pre-checked opt-ins
- **CRM drip sequences as primary conversion:** Email delivery only for specific delivered artifacts with explicit consent
- **Gated calculators:** Every tool result is available without login
- **Pricing and subscription flows:** Not part of any flow in current launch
- **Social marketing pages:** Pinterest, TikTok, and social campaign pages are not part of any flow

---

## 10. Measurement events

All analytics events follow the approved event contract:

- `tool_viewed` — page loaded with tool
- `calculation_started` — user began entering inputs
- `calculation_completed` — result produced
- `connected_tool_opened` — user moved to a connected tool
- `plan_exported` — print/export/share action
- `share_link_created` — share URL generated
- `account_save_requested` — user clicked save (future slice)
- `workspace_interest_submitted` — user expressed interest (future slice)

**Privacy constraint:** Analytics contain no recipes, notes, addresses, or any PII.

---

*Document version 1.0 — Anonymous-first utility hub model. Replaces traffic-first flows v2.0.*
*Companion to: `product/PRODUCT-CONTRACT-UTILITY-HUB.md`, `product/PRD.md`, `product/DESIGN.md`, `product/ARCHITECTURE.md`*
