# SoapCraft Pro — Customer Journeys and Flows

**Version:** 2.0 — Utility hub model
**Companion to:** `product/PRD.md`, `product/DESIGN.md`, `product/ARCHITECTURE.md`
**Approved direction:** `product/PRODUCT-CONTRACT-UTILITY-HUB.md` (approved by Isaac, 2026-09-09)
**Date:** 2026-09-09

---

## 1. Flow numbering and legend

| Prefix | Meaning |
|--------|---------|
| `AF` | Anonymous Flow (no login, no account) |
| `OF` | Optional-account Flow (anonymous base + account branch) |

All flows start from a public, ungated entry point. Account creation is never a precondition for any core result.

---

## 2. Anonymous flows (no login)

### AF-1: Homepage → Tool Discovery → Complete Calculation → Share/Export

**Premise:** A soapmaker lands on the homepage or tool directory, discovers a tool, completes a full calculation, and exports or shares the result — without creating an account.

**Preconditions:** None. Public route. No cookie consent dependency.

**Steps:**
1. User enters `/` or `/tools` via search, social link, or direct URL
2. Tool directory or homepage shows available tools; user selects one (e.g., batch-costing, craft-fair break-even, recipe scaling)
3. Tool loads with optional pre-filled example values, clearly labelled "Example"
4. User enters their own inputs (ingredients, quantities, costs, target batch weight)
5. Deterministic calculation runs; results update in real time
6. User sees complete output: result values, assumptions, formula revision, validation warnings, rounding policy
7. User chooses one or more actions:
   - Print / export (PDF or clipboard)
   - Create a share URL (local state link, no email required)
   - Continue to a connected tool
8. Result is delivered; no gate, no email capture, no account prompt

**Observable result:** User has a complete calculation result, a print/export artifact, or a share URL. No personal data collected.

**Branches:**
- **User enters partial inputs →** Result shows missing-cost warnings; result is explicitly incomplete and cannot be styled as a recommendation
- **User shares URL →** Share link contains only calculation state; no email or personal data embedded
- **User returns later →** No session persists; they start fresh from the tool page (see AF-1 reload behavior)

**Recovery:**
- If calculation errors: previous valid inputs preserved; error message with correlation ID; retry option
- If browser refresh: all local input lost; user re-enters (no anonymous persistence)
- If share URL is corrupted or expired: user starts calculation from scratch

**Persistent outcome:** Nothing persists anonymously. No cookie-based tracking of results. Analytics events (`tool_viewed`, `calculation_started`, `calculation_completed`) are aggregate and contain no recipe data. The only persistent anonymous artifact is the share URL itself, which encodes state in the URL parameters.

---

### AF-2: Homepage → Guide → Embedded Tool → Continue to Connected Tool

**Premise:** A soapmaker reads a substantive guide, uses an embedded calculator within it, and continues the result into a compatible connected tool.

**Preconditions:** None. Public guide page with embedded tool.

**Steps:**
1. User lands on a guide page (e.g., `/guides/true-cost-of-handmade-soap`)
2. Guide contains substantive content with an embedded calculator tool
3. User reads the guide, then uses the embedded calculator
4. User enters inputs in the embedded tool; calculation produces results
5. Guide shows the tool result inline with explanatory context
6. User clicks "Continue to full tool" or "Carry this to pricing/scaling"
7. Relevant inputs transfer to the connected tool with visible editable fields
8. User continues the connected workflow without re-entering any data

**Observable result:** User reads guide content and completes a calculation with transferred context. The connection between guide and tool is visible and traceable.

**Branches:**
- **User reads guide but doesn't use tool →** Guide stands alone as content; no calculation state
- **User uses embedded tool but doesn't continue →** Calculation result remains on the guide page
- **User continues →** Context transfers (see OF-1 for what carries forward with an account)

**Recovery:**
- If embedded tool fails: guide content remains fully readable; error message near the tool; retry option
- If transfer fails: user can manually re-enter inputs in the connected tool; the guide page still shows the original result

**Persistent outcome:** Guide page content is public and persists. Calculation state is ephemeral without account. Analytics record aggregate tool-view and calculation-completed events.

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
- **URL is corrupted/expired →** User starts from the tool's empty state; error message explains the URL is invalid
- **User modifies transferred values →** Calculation updates; new share URL can be generated

**Recovery:**
- If URL parameters are malformed: graceful degradation to empty tool state; informational message
- If calculation on loaded state produces errors: user can edit problematic fields; error states preserve all valid inputs

**Persistent outcome:** Nothing persists server-side. The share URL is the only carrier of state. If the user closes the browser, the shared state is gone unless they bookmark the URL or create an account.

---

### AF-4: Homepage → Blog/Editorial → Embedded Tool → Export

**Premise:** A user discovers content via search, reads an editorial page, uses an embedded tool, and exports the result.

**Preconditions:** None. Public blog or guide page.

**Steps:**
1. User finds a blog post or editorial page via search or social
2. Page contains substantive content with an embedded calculator
3. User reads the article; the article explains methodology and assumptions
4. User interacts with the embedded calculator within the article context
5. User exports or prints the calculation result
6. Page footer shows related tools and guides

**Observable result:** User consumed editorial content and completed a calculation with a downloadable/printable result.

**Branches:**
- **User reads but doesn't use the embedded tool →** Article content is the deliverable
- **User uses tool and exports →** Result artifact delivered
- **User follows a related-tool link →** Flow transitions to another tool (see AF-1 or OF-1)

**Recovery:**
- If embedded tool fails on the editorial page: article remains readable; error localized to the tool section
- If export fails: user can retry; calculation state is preserved

**Persistent outcome:** Blog/guide content is public and indexed. Calculation state is ephemeral. Aggregate analytics events only.

---

## 3. Optional-account flows (anonymous base + account branch)

### OF-1: Homepage → Tool → Calculation → Account Save → Persist → Continue Across Tools

**Premise:** A user completes a calculation anonymously, then optionally creates an account to persist the result and carry context forward across multiple tools.

**Preconditions:** None to start. Account creation is an optional later step.

**Steps:**
1. User enters a public tool page (no auth)
2. User completes a calculation with their inputs
3. User sees the complete result with assumptions, formula revision, and warnings
4. User clicks "Save" or "Create account to keep this"
5. If new user: signup form appears (email + password, or OAuth); email is pre-filled from any earlier capture if available
6. Account created; calculation result is saved as the user's first Recipe/Batch Context
7. User sees confirmation that data is persisted
8. User can now continue to any compatible tool; inputs transfer without re-entry
9. User can create share URLs for anonymous sharing while keeping the original in their account

**Observable result:** User has an account with persisted calculation data and can continue to connected tools without re-entry.

**Branches:**
- **User declines account →** Calculation remains ephemeral; user can still export/share (see AF-1)
- **User creates account →** All data from the current session is associated with the account; future sessions restore this context
- **User already has account →** Login prompt; after auth, the calculation is saved to their existing account

**Recovery:**
- If signup fails: all entered inputs preserved; error message specific to the failure; retry option
- If session expires during account creation: inputs preserved locally; user re-authenticates and data syncs
- If server error during save: local state preserved; user can retry save; clear "save failed" state with retry button

**Persistent outcome:** Recipe/Batch Context is persisted in the user's cloud account. It carries forward to all compatible tools. Formula version is immutable once saved. Account also enables: cross-device sync, historical comparisons, reusable supplier cost records, inventory management, and batch/lot records.

---

### OF-2: Anonymous Calculation → Account → Cross-Tool Continuation → Full Lifecycle

**Premise:** A user starts with one tool anonymously, creates an account, and uses the connected utility hub to move through the full lifecycle (recipe → sizing → costing → pricing → production → market planning).

**Preconditions:** User has completed at least one anonymous calculation and optionally created an account.

**Steps:**
1. User uses a tool anonymously (e.g., formulation calculator)
2. User creates an account to persist the recipe (see OF-1)
3. User continues to a compatible tool (e.g., sizing calculator); recipe inputs transfer automatically
4. User modifies sizing parameters; new recipe version is created from the previous version
5. User moves to costing tool; ingredient costs, packaging, labor inputs transfer
6. User moves to pricing tool; cost data, target margin, channel fees transfer
7. User moves to market planning (craft-fair break-even); pricing data transfers
8. At each step, the user sees what was inherited and what is editable
9. User can export/share at any point
10. User can review the full history of recipe versions and batch contexts

**Observable result:** User sees a connected workflow where data carries forward across multiple tools. Each tool shows its inputs, outputs, and what was inherited from the previous step.

**Branches:**
- **User stops at any tool →** All completed steps are saved; user can return later
- **User skips tools →** Only the tools they used have data; no forced progression
- **User creates new recipe from a version →** New version branches from the original; original remains immutable

**Recovery:**
- If tool fails mid-flow: completed steps are saved; user can resume from the last successful step
- If account data is corrupted: server-side backup recovery; last-known good state restored
- If data sync conflict: user sees conflict resolution UI; last-write-wins with manual override option

**Persistent outcome:** Complete production lifecycle is persisted in the user's account:
- Recipe versions (immutable after creation)
- Batch contexts (each derived from a recipe version)
- Cost records (linked to batches)
- Production plans and cure schedules
- Market/planning results
- Historical comparison data across versions

---

### OF-3: Account → Multi-Device Sync → Inventory → Reorder

**Premise:** A user with an account accesses their data across devices and manages ingredient inventory and purchase planning.

**Preconditions:** User has an account with persisted recipe/batch data and cost records.

**Steps:**
1. User logs in on a device (any device)
2. Account data syncs: recipes, batches, costs, inventory
3. User views ingredient/packaging requirements from their recipes
4. User sees requirements minus current stock (if stock records exist)
5. User creates purchase plan with supplier comparison
6. User can track inventory depletion across batches
7. User can reorder when stock is low

**Observable result:** User sees synchronized data across devices with inventory status and purchase planning.

**Branches:**
- **No stock records yet →** Requirements shown without subtraction; user can add stock manually
- **User switches devices →** Data syncs from cloud; last state restored
- **User is offline →** Local cached data displayed; mutations queued for sync when online

**Recovery:**
- If sync fails: cached data shown; "last synced" timestamp visible; changes queue locally and sync when restored
- If conflict between devices: last-write-wins with manual resolution option
- If account is deleted: all user data removed per retention policy; share URLs for anonymous data remain valid (they contain no personal data)

**Persistent outcome:** Cloud-persisted account data syncs across devices. Inventory records persist. Purchase plans persist. Cost records accumulate historical value.

---

### OF-4: Anonymous User → Share URL → Account Creation → Recover Session

**Premise:** A user shares a calculation via URL, another user opens it, the second user creates an account, and the calculation moves to their account.

**Preconditions:** Valid share URL exists (created by any user).

**Steps:**
1. User A creates a share URL from their anonymous calculation
2. User B opens the share URL in a browser
3. Tool loads with User A's calculation state
4. User B can use, modify, and recalculate the shared state
5. If User B wants to save: they create an account
6. After account creation, the modified calculation is saved to User B's account (not User A's)
7. User B can now continue, share, or export from their account

**Observable result:** User B sees the shared state loaded, can modify it, and can save it to their own account.

**Branches:**
- **User B doesn't create an account →** Work remains ephemeral; can still export/share
- **User B creates account →** Modified state saved to User B's account; no personal data from User A is transferred
- **User B modifies and shares again →** New share URL created with User B's modifications

**Recovery:**
- If User B abandons mid-session: all work is lost (no anonymous persistence)
- If share URL is shared to many users: each user gets their own ephemeral copy; only account-saved data persists

**Persistent outcome:** Only User B's account data persists. User A's original remains unchanged. Share URL remains valid and shows the original User A state (not User B's modifications).

---

## 4. Error states and recovery

### E-1: Calculation Error

**Trigger:** Deterministic calculation produces unexpected result or validation failure.

**Behavior:**
- Previous valid inputs preserved in the form
- Error message identifies the specific issue
- Warning state includes words/icon (not color only)
- Retry option available at the failure site
- Correlation/reference ID shown only if useful for support

**Recovery:** User edits the problematic input; calculation re-runs; if resolved, the error clears and the result updates.

**Persistent outcome:** None (calculation state is ephemeral unless saved to account).

---

### E-2: Save Failure

**Trigger:** Server-side save fails (network error, server error, auth failure).

**Behavior:**
- Save state shows "Save failed — Retry"
- All user data preserved locally
- No false "Auto-saved" message
- User can retry the save action
- If account exists, local queue attempts sync when connection restores

**Recovery:** User clicks Retry; save attempts again. If persistent failure, user is informed with a clear next action (check connection, try again later).

**Persistent outcome:** If save succeeds: data persisted to account. If save fails: data remains in local state with "Save failed" status visible.

---

### E-3: Tool Loading Failure

**Trigger:** Tool page fails to load (API error, timeout, server unavailable).

**Behavior:**
- Error message with clear description
- Retry button at the failure site
- If cached data exists (from account), show cached data with "last synced" timestamp
- Skeleton loading states for server-loading content
- No blank shell

**Recovery:** User clicks Retry; tool attempts to load again. If persistent, user can try a different browser or device.

**Persistent outcome:** Account data persists server-side; cached local state may be stale but available.

---

### E-4: Share URL Corruption/Expiry

**Trigger:** Share URL is malformed, tampered with, or expired.

**Behavior:**
- Informational message: "This link is no longer valid. Start a new calculation."
- Tool loads with empty state
- No data lost from the user's own account (if logged in)

**Recovery:** User starts a new calculation from the tool page. If logged in, they can access previously saved work.

**Persistent outcome:** None from the corrupted share URL. Account data unaffected.

---

## 5. Context transfer between connected tools

### Transfer protocol

When a user moves from Tool A to Tool B:

1. **Source tool exports:** Only fields the user entered or explicitly accepted
2. **Target tool imports:** Transferred fields populate editable input fields
3. **Visual transfer indicators:** Target tool shows which fields were inherited and from which tool
4. **Editable by default:** All transferred values are editable, not read-only
5. **Version creation:** If a recipe is involved, a new RecipeVersion is created from the previous version (immutable chain)
6. **Formula revision:** Each version records the formula revision used
7. **No data loss:** If a field cannot transfer, it appears empty with a note explaining why

### What transfers

| From → To | Transfers |
|-----------|-----------|
| Formulation → Sizing | Oil blend, percentages, superfat, lye concentration |
| Formulation → Costing | Oil blend, batch weight, ingredient list |
| Sizing → Costing | Target batch weight, recipe version reference |
| Costing → Pricing | Full cost breakdown, yield, cost per unit |
| Pricing → Market | Price, margin, product mix, channel fees |
| Market → Production | Batch count, dates, capacity requirements |
| Production → Cure | Batch context, cure interval, dates |
| Any → Export/Share | Current calculation state, formula revision, assumptions |

### What does NOT transfer

- Personal data (email, name) unless explicitly entered in the target tool
- Account credentials
- Previous calculation history (unless logged into account)
- Analytics identifiers

---

## 6. Reload and re-entry behavior

### Without account (anonymous)

| What persists | What does not persist |
|---------------|----------------------|
| Nothing (ephemeral) | All inputs, all calculation state |
| Share URL (if created and bookmarked) | Session data |
| Browser form autofill (if supported) | Tool position/scroll |
| Analytics aggregate events (no recipe data) | Any user-specific state |

**Re-entry behavior:** User opens the tool page → starts from empty state. If they have a share URL bookmarked, they can reopen it. Otherwise, they re-enter everything.

### With account

| What persists | What does not persist |
|---------------|----------------------|
| All saved recipes and versions | Draft state in progress (unless explicitly saved) |
| Batch contexts and records | Unsaved form inputs |
| Cost records and history | Making Mode timer state |
| Inventory/stock records | Cure observation drafts |
| Supplier cost records | Session authentication token (handled by NextAuth) |
| Account settings | Transient UI state (expanded/collapsed panels) |

**Re-entry behavior:** User logs in → dashboard loads with saved data. Active batches show last-known state. Making Mode resumes from last saved step. Cure observations show last recorded day. Drafts that were not explicitly saved are not restored (with "Save failed" state preserved if the save failed).

---

## 7. Persistent outcomes summary

### Anonymous user outcomes

- No persistent data (ephemeral only)
- Share URL is the only persistent artifact (contains calculation state, no personal data)
- Aggregate analytics events (tool_viewed, calculation_started, calculation_completed) — no recipe data
- Email only if explicitly exchanged for a specific delivered artifact with consent

### Account-holding user outcomes

- Immutable RecipeVersion chain (each version is a snapshot)
- Batch records linked to recipe versions
- Cost records linked to batches
- Cure observations linked to batches
- Production plans and dates
- Historical comparison data across versions
- Inventory/stock records
- Supplier cost records
- Account settings and preferences
- All data syncs across devices
- All data can be exported

### Shared across both

- Share URLs (created by either anonymous or account users)
- Aggregate analytics events (no PII, no recipe data)
- Email delivery confirmations (if email exchanged)
- Affiliate link click events (if clicked)

---

## 8. Flow matrix

| Flow ID | Entry | Auth | Core action | Transfer | Persistent outcome |
|---------|-------|------|-------------|----------|-------------------|
| AF-1 | Homepage/Tool | None | Calculate → Export/Share | None | None (ephemeral) |
| AF-2 | Guide | None | Read → Calculate → Continue | Guide→Tool | None (ephemeral) |
| AF-3 | Share URL | None | Re-enter → Continue | URL→Tool | None (ephemeral) |
| AF-4 | Blog/Editorial | None | Read → Calculate → Export | Article→Tool | None (ephemeral) |
| OF-1 | Homepage/Tool | Optional | Calculate → Save → Account | Tool→Account | Recipe/Batch Context |
| OF-2 | Anonymous→Account | Optional | Full lifecycle continuation | Cross-tool | Full production lifecycle |
| OF-3 | Account | Account | Multi-device → Inventory | Account→Account | Cloud data, inventory |
| OF-4 | Share URL→Account | Optional | Open share → Save | URL→Account | Copy of calculation in new account |

---

## 9. Anti-patterns explicitly excluded

This flow documentation does **not** include:

- **Exit-intent email capture:** No popups or modals triggered by mouse movement toward the browser close button
- **Fake case studies:** No fabricated user stories or "Sarah went from spreadsheet to SoapCraft Pro" narratives
- **Mandatory gates:** No email requirement before viewing results; no account requirement to use any tool
- **Fake social proof:** No fabricated user counts, ratings, or testimonials
- **Dark patterns:** No confusing unsubscribe, no hidden account deletion, no pre-checked opt-ins
- **Drip sequences as primary conversion:** Email delivery only for specific delivered artifacts with explicit consent
- **Gated calculators:** Every tool result is available without login

---

## 10. Measurement events

All analytics events follow the approved event contract from `product/PRODUCT-CONTRACT-UTILITY-HUB.md` §11:

- `tool_viewed` — page loaded with tool
- `calculation_started` — user began entering inputs
- `calculation_completed` — result produced
- `connected_tool_opened` — user moved to a connected tool
- `plan_exported` — print/export/share action
- `share_link_created` — share URL generated
- `email_delivery_confirmed` — artifact delivered to email (consent-based)
- `affiliate_link_clicked` — affiliate link clicked
- `account_save_requested` — user clicked save/create account
- `workspace_interest_submitted` — user expressed interest in workspace

**Privacy constraint:** Analytics contain no recipes, notes, addresses, or any PII. PostHog events follow the approved event contract and omit sensitive values.

---

*Document version 2.0 — Utility hub model. Replaces traffic-first flows v1.0.*
*Companion to: `product/PRODUCT-CONTRACT-UTILITY-HUB.md`, `product/PRD.md`, `product/DESIGN.md`, `product/ARCHITECTURE.md`*
