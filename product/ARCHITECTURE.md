# SoapCraft Pro — System Architecture

**Version:** 2.0 — Utility hub model
**Companion to:** `product/PRD.md`, `product/DESIGN.md`, `product/FLOWS.md`
**Approved direction:** `product/PRODUCT-CONTRACT-UTILITY-HUB.md` (approved by Isaac, 2026-09-09)
**Date:** 2026-09-09

---

## 1. Vercel Deployment Configuration

```json
{
  "projectId": "prj_J12YtoRr3q5dmazDWsqs2jXLpOqy",
  "orgId": "team_gYtaSveuJSflpubmwIGhFD6Y",
  "projectName": "soapcraft-pro"
}
```

Deployment platform: Vercel. Build command: `next build`. Dev command: `next dev`. Output: `.next`. Framework: Next.js.

---

## 2. System Boundary Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PUBLIC LAYER (no auth required)                         │
│                                                                             │
│  ┌──────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────┐ │
│  │ Homepage &    │  │ Public Tools  │  │ Guides/Blog/  │  │ Content  │ │
│  │ Tool Directory│  │ (calculators, │  │ Examples/     │  │ Pages    │ │
│  │               │  │  sizing, cost,│  │ Templates     │  │          │ │
│  │ /             │  │  markets)     │  │               │  │ /blog/*  │ │
│  │ /tools        │  │ /calculators/*│  │ /guides/*     │  │ /        │ │
│  │ /tools/*      │  │               │  │ /examples/*   │  │ /tools   │ │
│  └──────┬───────┘  └───────┬───────┘  └───────┬───────┘  └────┬─────┘ │
│         │                  │                   │               │         │
│         └──────────────────┼───────────────────┼───────────────┘         │
│                            │                   │                           │
│              ┌─────────────▼───────────────────▼──────────────┐        │
│              │              CDN / Edge (Vercel)                    │        │
│              └────────────────────────────────────────────────┘        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                     APPLICATION LAYER                                      │
│                                                                             │
│  ┌──────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────┐ │
│  │ Auth          │  │ App Shell     │  │ API Routes    │  │ Analytics│ │
│  │               │  │ (workspace)   │  │ (REST)        │  │          │ │
│  │ /auth/*       │  │ /dashboard    │  │               │  │ /api/     │ │
│  │ NextAuth      │  │ /recipes/*    │  │ All scoped by │  │ analytics │ │
│  │ JWT session   │  │ /batches/*    │  │ userId        │  │          │ │
│  │               │  │ /cure/*       │  │               │  │ Aggregate │ │
│  │               │  │ /costing/*    │  │               │  │ events    │ │
│  └──────┬───────┘  └───────┬───────┘  └───────┬───────┘  └────┬─────┘ │
│         │                  │                   │               │         │
├─────────┼──────────────────┼───────────────────┼───────────────┼───────┤
│         │                  │                   │               │         │
│  ┌──────▼──────────────────▼───────────────────▼───────────────▼───────┐ │
│  │                    DATA LAYER                                           │ │
│  │                                                                           │ │
│  │  ┌──────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────┐│ │
│  │  │ Neon/Drizzle │  │ Browser local  │  │ Dodo one-time │  │ PostHog  ││ │
│  │  │ PostgreSQL   │  │ state           │  │ purchase       │  │ (events) ││ │
│  │  │               │  │               │  │ (Seller Pack) │  │          ││ │
│  │  │ • Users       │  │ • Tool state  │  │ • Checkout    │  │ Aggregate││ │
│  │  │ • Recipes     │  │ • Timers      │  │ • Webhooks    │  │ events   ││ │
│  │  │ • Batches     │  │ • Exports     │  │ • Entitlement │  │ no PII   ││ │
│  │  │ • Batch       │  │               │  │ • Plan        │  │          ││ │
│  │  │   versions    │  │               │  │               │  │          ││ │
│  │  • Costs        │  │               │  │               │  │          ││ │
│  │  • Ingredients  │  │               │  │               │  │          ││ │
│  │  • Content      │  │               │  │               │  │          ││ │
│  │  • Inventory    │  │               │  │               │  │          ││ │
│  │  • Suppliers    │  │               │  │               │  │          ││ │
│  └──────────────┘  └───────────────┘  └───────────────┘  └──────────┘│ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Module Boundaries and Interfaces

### 3.1 Public Layer (No Auth)

**Responsibility:** Deliver free tools, guides, content, and the utility hub entry points. No authentication required for any core result.

**Routes:**
- `/` — Homepage with tool directory and featured content
- `/tools` — Complete utility tool directory
- `/tools/formulation/*` — Formulation and chemistry tools
- `/tools/sizing/*` — Sizing and conversion tools
- `/tools/batch-economics` — Batch economics calculator
- `/tools/pricing/*` — Pricing and margin tools
- `/tools/markets/craft-fair-break-even` — Market planning tool
- `/tools/production/ready-by-planner` — Production/cure planning
- `/tools/purchasing/*` — Purchasing and inventory tools
- `/guides/*` — Substantive decision guides
- `/examples/*` — Editable worked calculations
- `/blog/*` — SEO blog content
- `/templates/*` — Downloadable templates (no auth, no email gate — direct download)
- `/compare/*` — Comparison pages
- `/pricing` — Pricing page
- `/pinterest/*` — Pinterest-optimized content
- `/tiktok/*` — TikTok content hub

**Interfaces:**
- Public tool API: `GET /api/calculate/*` — public, no auth, rate-limited
- Email capture: `POST /api/email/capture` — **DEPRECATED per approved product direction** — currently exists in codebase but NOT the approved primary conversion path. Email capture may only be used for specific delivered artifacts with explicit consent (see PRD non-goals)
- Blog content: `GET /api/blog/*` — public, cached
- Content metadata: `GET /api/content/*` — public
- SEO: `GET /robots.txt`, `GET /sitemap.xml` — public
- Analytics: `POST /api/analytics/event` — public, lightweight, no PII
- Share URL: `GET /api/share/:id` — public, decodes state, no auth
- Export: `POST /api/export` — public, generates artifact from calculation state

**Failure modes:**
- Rate limiting on calculator API prevents abuse (public, anonymous usage)
- CDN caching for static pages and public API responses
- Email capture degrades gracefully if CRM is unavailable (store locally, sync later) — **deprecated per approved product direction**
- Share URL service degrades: tool loads with empty state if URL decoder fails

**Currently exists vs planned:**
- Currently exists: `/calculators/*` (legacy tool paths), `/blog/*`, `/compare/*`, basic calculator components
- Planned: `/tools/*` directory structure, `/examples/*`, `/guides/*`, `/tools/purchasing/*`, `/tools/production/*` as comprehensive utility hub routes

---

### 3.2 Application Layer (Authenticated)

**Responsibility:** Production workspace, recipe management, batch tracking, cure, costing, inventory, and account management. Account is optional — these features are persistence layers, not gates.

**Routes:**
- `/dashboard` — Production workspace with attention queue and active pipeline (auth required)
- `/recipes/*` — Recipe creation, versioning, and history (auth required)
- `/batches/*` — Batch tracking, Making Mode, cure (auth required)
- `/curing` — Cure tracker and observation management (auth required)
- `/costing` — Cost analysis and margin calculation (auth required)
- `/ingredients` — Ingredient inventory and cost records (auth required)
- `/library` — Recipe library with version history (auth required)
- `/subscription` — Pro subscription management (auth required)
- `/settings` — Account settings (auth required)
- `/auth/*` — Authentication (signup, login, reset, OAuth)

**Interfaces:**
- Authentication: reuse the existing NextAuth configuration and session strategy; do not introduce a second auth system.
- Persistence: reuse Neon PostgreSQL through the existing Drizzle schema/migration path.
- API routes: every authenticated read and mutation derives `userId` from the server-validated session; request-supplied ownership fields are ignored.
- Middleware separates public and private routes but never substitutes for per-resource ownership checks.
- Making Mode timers persist locally for anonymous use; authenticated persistence uses ordinary versioned REST mutations. Real-time/WebSocket infrastructure is not required.

**Failure modes:**
- Session expiry preserves the local Recipe/Batch Context and asks the user to authenticate before cloud persistence.
- API/database errors leave local state intact, show an explicit unsaved status, and offer retry/export; the UI never claims a cloud save succeeded.
- Concurrent updates use optimistic concurrency (`version`/`updatedAt`). A stale write returns `409 Conflict` with both versions; no silent last-write-wins.
- Cloud unavailability cannot block anonymous calculators.

**Currently exists vs planned:**
- Reuse: NextAuth auth/session code, Neon serverless connection, Drizzle ORM/schema, existing recipe/batch components, and dashboard shell.
- Build: explicit ownership columns/checks, immutable recipe versions, optimistic concurrency, inventory/supplier records, and local-to-cloud import. Multi-device sync means server-backed reads/writes, not real-time infrastructure.

---

### 3.3 Calculation Engine

**Responsibility:** Deterministic soap formulation and economic calculations. No AI invention.

**Core modules:**
- `lib/calculations/sap.ts` — Saponification value calculations (NaOH, KOH, mixed alkali)
- `lib/calculations/batch-cost.ts` — Cost per bar, full batch economics
- `lib/calculations/mold.ts` — Mold volume and capacity calculations
- `lib/calculations/ingredient-cost.ts` — Ingredient cost aggregation and supplier comparison
- `lib/calculations/scale.ts` — Recipe scaling and proportion calculations
- `lib/calculations/production.ts` — Production planning and back-planning calculations
- `lib/calculations/market.ts` — Break-even, margin, contribution calculations

**Rules:**
- All calculations are deterministic (no AI invention)
- Calculations accept unit inputs and return precise results
- Calculation tests use RED fixtures for verification
- Calculations are exposed via public API for calculators and private API for workspace
- Safety-critical calculations (lye, water ratios) have validated input ranges
- Formula revision numbers are explicit and included in exports
- Money must never be summed across currencies
- Quantities normalized by tested conversion functions
- Rounding is display-only until the final monetary output

**Currently exists vs planned:**
- Currently exists: `lib/calculations/batch-cost.ts`, `lib/calculations/sap.ts` with test fixtures
- Planned: Full formulation engine (chemistry subject to verification gate), sizing/conversion engine, market planning engine, production back-planning engine

---

### 3.4 Content Layer

**Responsibility:** SEO blog, guides, examples, templates, and visual content. Every page must supply at least a verified working tool, an editable worked calculation, a useful downloadable artifact, verified reference data, or substantive synthesis.

**Modules:**
- `lib/blog.ts` / `lib/blog-data.json` — Blog data management
- `lib/blog-contract.ts` — Content validation rules
- `lib/seo/*` — SEO metadata, intent registry, JSON-LD, sitemap, robots
- `lib/content/*` — Template and guide content metadata
- `lib/analytics/analytics.ts` — Aggregate analytics events (no recipe data)
- `lib/analytics/posthog.ts` — PostHog client integration

**Rules:**
- All blog posts have SEO metadata, content, review status
- Content validated against `blog-contract.ts` (banned phrases, category rules)
- Every page has `pageMetadata()` with title, description, path, OpenGraph, Twitter
- Sitemap auto-generates from pages and blog posts
- Robots.txt disallows `/api/`, `/auth/`, `/recipes/`, `/batches/`, `/dashboard/`, `/subscription/`
- No page ships solely to meet a word/page quota
- Guide pages should generally provide approximately 1,500+ rendered words where subject warrants
- No automated content publication

**Currently exists vs planned:**
- Currently exists: `lib/blog-contract.ts`, `lib/blog-data.json`, `lib/blog.ts`, `lib/seo/*` directory, `robots.ts`, `sitemap.ts`
- Planned: Comprehensive guide content, example pages, tool documentation pages, substantive editorial content

---

### 3.5 Integration Layer

**Responsibility:** Third-party services, distribution channels, and payment processing.

**Services:**
- **Dodo Payments — one-time Seller Pack only:** reuse the existing integration through a narrow `SellerPackPaymentProvider` interface. Subscription billing remains deferred unless repeat-workspace demand is observed and separately approved.
- **Neon + Drizzle:** existing canonical persistence stack for optional accounts.
- **NextAuth:** existing authentication/session boundary.
- **PostHog:** aggregate product events only; never recipe, cost, or personally identifying payloads.
- **Vercel / GitHub:** deployment and source control.
- **Email:** transactional delivery only for an explicitly requested artifact/receipt or account operation; no exit-intent capture or unconsented drip.

**Seller Pack payment interface:**
1. `POST /api/seller-pack/checkout` accepts a server-known pack ID; price, currency, product mapping, and success URL come from server configuration, never the client.
2. The adapter creates a Dodo one-time checkout and returns only the redirect URL/session identifier.
3. `POST /api/webhooks/dodo` verifies the raw-body signature before parsing or mutating state.
4. Webhook processing is idempotent on provider event ID and transaction ID. Only a verified paid/completed event grants the immutable Seller Pack entitlement.
5. The success page polls server entitlement; the browser redirect alone never grants access.
6. Fulfilment is a versioned download artifact with entitlement checks and an auditable delivery record.
7. Missing Dodo configuration disables checkout visibly; it never simulates success.

**Provider seam:**
```ts
interface SellerPackPaymentProvider {
  createOneTimeCheckout(input: { packId: string; purchaserId?: string }): Promise<{ checkoutId: string; redirectUrl: string }>;
  verifyWebhook(rawBody: Uint8Array, headers: Headers): Promise<VerifiedPaymentEvent>;
}
```

**Currently exists vs planned:**
- Reuse: Dodo client/configuration code, Neon connection, Drizzle, NextAuth, Vercel, GitHub, and current PostHog adapter after payload review.
- Build: the one-time checkout adapter, entitlement/order tables, raw-body webhook verification, idempotency, server-side fulfilment, and transactional receipt path.
- Deferred: subscription plans, workspace billing, CRM sequences, Redis, queues, and real-time/WebSocket infrastructure.

---

## 4. Canonical Data Ownership

Each domain object has a single canonical owner. Other modules read from or reference the owner; none write independently.

| Domain Object | Canonical Owner | Access Pattern |
|----------------|-----------------|----------------|
| User profile | Users table | User CRUD, self-service |
| Recipe | Recipes table | User CRUD, versioned |
| RecipeVersion | RecipeVersion table | Immutable after creation; linked to Recipe |
| Batch | Batches table | User CRUD; linked to RecipeVersion |
| BatchObservation | Observations table | User CRUD; linked to Batch |
| Cost record | Costs table | User CRUD; linked to Batch |
| Ingredient | Ingredients table | User CRUD; linked to User |
| Supplier | Suppliers table | User CRUD; linked to User |
| Inventory record | Inventory table | User CRUD; linked to User |
| Production plan | Production table | User CRUD; linked to Batch |
| Blog post | Content table | Content team CRUD; public read |
| Guide | Content table | Content team CRUD; public read |
| Share URL | Share table | Generated from calculation state; public read; no auth |
| Email capture | CRM | **DEPRECATED** — Public capture; consent-based; not approved primary path |
| Analytics event | PostHog | Aggregate; no PII; no recipe data |
| Seller Pack order/entitlement | Neon tables via Drizzle | Webhook-owned immutable payment state; server-checked download |
| Session | Existing NextAuth strategy | Server-validated identity; no Redis dependency |

### Data ownership rules

1. **Single writer principle:** Each domain object has exactly one table/module that writes to it
2. **Immutable versions:** RecipeVersion records are immutable once created; they are snapshots, not references
3. **Foreign key integrity:** Batches reference RecipeVersion IDs, not Recipe IDs (versions are the working unit)
4. **No cross-module writes:** The Cost module reads from Batch and Ingredient tables but never writes to them
5. **Public data separation:** Blog, guides, and examples live in content tables with public-read access; no user data contamination
6. **Share URL state:** Share URLs contain only calculation state; no email, name, or any personal data

---

## 5. Formula and Data Versioning Strategy

### 5.1 Recipe versioning

Every recipe edit creates a new immutable `RecipeVersion`. The chain is:

```
Recipe v1 → Recipe v2 → Recipe v3
  (immutable)  (immutable)  (immutable)
```

- RecipeVersion contains: full formulation snapshot, SAP values, lye/water amounts, assumptions, warnings, formula revision number, source manifest
- RecipeVersion is created on explicit "Save" action — never auto-saved
- RecipeVersion is referenced by Batches; a batch always uses a specific version
- Formula revision number is explicit and included in all exports and share URLs
- Version diff shows: ingredient added/removed, percentage/weight change, water/superfat/lye change, changed outputs/warnings

### 5.2 Batch versioning

Batches are created from a specific RecipeVersion:

```
RecipeVersion v3 → Batch #024 (inherits v3 state) → BatchObservation → Cost record
```

- Batch records actual measurements, observations, yield, and cost
- Batch inherits from RecipeVersion at creation time
- Actual measurements may differ from planned (plan vs actual visible)
- Batch is immutable once archived; observations can be corrected before archival

### 5.3 Formula versioning

Formula changes are tracked at the RecipeVersion level:

- Each RecipeVersion records the formula revision used (e.g., "SAP table 2024-01-15")
- Source manifest: oils, SAP values, and data sources are recorded per version
- If a source dataset is updated, existing RecipeVersions are NOT modified; new versions use the updated source
- Deterministic: same inputs + same formula revision = same outputs, always

### 5.4 Content versioning

- Blog posts and guides have draft/revision/published states
- Content validation via `blog-contract.ts` before publishing
- Content revisions tracked with timestamps and editor identity
- No automated publication; human review required

---

## 6. Local/Share URL vs Cloud Persistence

### Architecture principle

The utility hub operates on a **local-first, cloud-optional** model.

```
Anonymous user:
  Local state → Share URL (state encoded in URL) → Ephemeral

Account user:
  Local state → Cloud sync (PostgreSQL) → Multi-device persistence
```

### Share URL (anonymous path)

- **What it carries:** Calculation state only — ingredient amounts, percentages, target weights, formula revision, assumptions, warnings
- **What it never carries:** Email, name, address, any personal data, analytics identifiers
- **Encoding:** URL parameters with serialization; compressed to avoid excessive length
- **Lifespan:** Until the URL is closed or the browser is cleared; bookmarkable
- **Access:** Public; anyone with the URL can view/modify the state
- **No server storage:** Share URL state is client-encoded; server does not store share URL data (stateless)
- **Security:** No authentication needed; no personal data exposure

### Cloud persistence (account path)

- **What it stores:** Full Recipe/Batch Context — recipes, versions, batches, observations, costs, inventory, supplier records, production plans
- **Storage:** Existing Neon PostgreSQL connection through Drizzle ORM and versioned migrations
- **Sync:** Explicit server-backed reads/writes; no WebSocket or background queue dependency
- **Concurrency:** Optimistic version check; stale mutations receive `409 Conflict` and require explicit user reconciliation
- **Offline behavior:** Anonymous/local editing and export remain available, but the UI visibly marks cloud changes unsaved until a successful server response
- **Data retention:** User data persists until account deletion; exported data is available before deletion
- **Security:** Every query/mutation is scoped by session-derived `userId`; repository-owned authorization tests cover cross-user denial

### Transition from share URL to account

1. User opens share URL → tool loads with state
2. User clicks "Save to account" → account creation/login flow
3. After auth: calculation state is saved to user's account as a new Recipe/Batch Context
4. The share URL remains valid and shows the original state (not the modified account copy)
5. No personal data from the share URL is associated with the account beyond what the user explicitly enters during signup

---

## 7. Auth and Security Model

### Principle: Anonymous reads, optional account writes

```
Public route → No auth check → Serve content
Public route + calculation → No auth → Compute locally or via public API
Public route + email capture → **DEPRECATED** Explicit consent → CRM integration (not approved primary path)
Auth route → NextAuth check → Session valid → Serve user data
Auth route + no session → Redirect to /auth/login
API route → Session check → userId derived → Scope data by userId
```

### Authentication

- **Method:** NextAuth.js with credentials + OAuth providers
- **Session:** JWT-based with server-side validation
- **Anonymous access:** Full read and calculation access without authentication
- **Account creation:** Optional; email + password or OAuth; no mandatory gates

### Authorization

- **Row-level security:** Every database query scoped by `userId`; users can only access their own data
- **API middleware:** Public routes have no auth check; private routes validate session
- **Ownership checks:** Every resource access verifies `resource.userId === session.userId`
- **Role-based access:** User (standard) and Admin (content management); no other roles planned

### Security practices

- **No PII in analytics:** PostHog events omit email, name, recipe data, and addresses
- **No PII in share URLs:** Share URL state contains only calculation values
- **Email consent:** Email is exchanged only for a specific delivered artifact with explicit consent
- **Data minimization:** Collect only what is needed for the function
- **GDPR-ready:** Account deletion removes all user data; export available before deletion
- **Environment secrets:** `NEXTAUTH_SECRET`, `DATABASE_URL`, `DODO_PAYMENTS_SECRET` in `.env.local`; never committed
- **Content security:** robots.txt disallows protected routes; sitemap excludes private paths
- **CORS:** API routes configured for same-origin; no cross-origin exposure of private data

### Currently exists vs planned

- Currently exists: NextAuth scaffolding, `.env.local` with secrets, `lib/auth.ts`, `lib/auth-guards.ts`
- Planned: Full row-level security policies, complete OAuth integration, account deletion flow, data export endpoint, GDPR compliance audit

---

## 8. Content and SEO Architecture

### Public content surface

Every public page must be:
- Indexable by search engines
- Have complete metadata (title, description, OpenGraph, Twitter, canonical URL, JSON-LD)
- Reachable from the homepage and/or tool directory
- Substantive (minimum quality bar per `product/PRODUCT-CONTRACT-UTILITY-HUB.md` §9)

### SEO infrastructure (currently exists)

- `app/robots.ts` — Disallows protected routes, points to sitemap
- `app/sitemap.ts` — Generates sitemap from static pages and blog posts
- `lib/seo/site-url.ts` — `NEXT_PUBLIC_SITE_URL` env var for canonical URLs
- `lib/seo/metadata.ts` — `pageMetadata()` helper for all pages
- `lib/seo/intent-registry.ts` — Programmatic SEO page registry
- `lib/seo/json-ld.ts` — Structured data serialization
- `lib/seo/content-validator.ts` — Content validation rules
- `lib/seo/content/` — Content metadata for intent pages

### Content structure

| Content Type | Route Pattern | Auth | Purpose |
|--------------|---------------|------|---------|
| Homepage | `/` | None | Tool discovery, featured content |
| Tool directory | `/tools` | None | Complete tool listing |
| Individual tools | `/tools/*` | None | Functional calculators |
| Examples | `/examples/*` | None | Editable worked calculations |
| Guides | `/guides/*` | None | Substantive decision guides |
| Blog | `/blog/*` | None | SEO content, editorial |
| Templates | `/templates/*` | None | Downloadable artifacts |
| Compare | `/compare/*` | None | Factual comparisons |
| Pricing | `/pricing` | None | Subscription information |

### Content rules

- Every page supplies at least one of: verified tool, editable calculation, downloadable artifact, verified reference data, or substantive synthesis
- No page ships solely to meet word count
- Guide pages should be approximately 1,500+ words where subject warrants
- Safety, legal, tax, IFRA, and formulation content requires named sources and reviewer approval
- Pages with overlapping intent are merged, redirected, or canonicalized
- Canonical URLs contain no duplicate `/marketing` tree

### Currently exists vs planned

- Currently exists: `robots.ts`, `sitemap.ts`, `lib/seo/*` directory, `lib/blog-contract.ts`, `lib/blog-data.json`, `lib/blog.ts`
- Planned: Full `/tools/*` route structure, `/examples/*`, substantive `/guides/*`, `/blog/*` expansion, editorial module on homepage

---

## 9. Analytics Architecture

### Principle: Aggregate events, no recipe data

Analytics track user behavior at the aggregate level. No recipe data, notes, addresses, or any PII is ever collected.

### Event contract (approved)

Required events from `product/PRODUCT-CONTRACT-UTILITY-HUB.md` §11:

| Event | Trigger | Properties (no PII) |
|-------|---------|---------------------|
| `tool_viewed` | Tool page loaded | tool_id, source_channel |
| `calculation_started` | User began entering inputs | tool_id |
| `calculation_completed` | Result produced | tool_id, has_missing_inputs |
| `connected_tool_opened` | User moved to connected tool | from_tool, to_tool |
| `plan_exported` | Print/export/share action | tool_id, export_type |
| `share_link_created` | Share URL generated | tool_id |
| `email_delivery_confirmed` | Artifact delivered to email | consent_given |
| `affiliate_link_clicked` | Affiliate link clicked | link_id |
| `account_save_requested` | User clicked save/create account | tool_id |
| `workspace_interest_submitted` | User expressed workspace interest | — |

### Implementation

- **Provider:** PostHog (via `lib/analytics/posthog.ts`)
- **Anonymous ID:** `localStorage.getItem("soapcraft-analytics-id")` — `crypto.randomUUID()` if not present
- **No pageview auto-capture:** Explicit events only (`capture_pageview: false`)
- **No PII:** Events never contain email, name, recipe data, notes, or addresses
- **Error logging:** Does not expose user-entered recipe or contact data
- **Privacy-safe:** Compliant with analytics privacy requirements

### Currently exists vs planned

- Currently exists: `lib/analytics/analytics.ts` with event names defined, `lib/analytics/posthog.ts` client stub, `AnalyticsEvents` constant object
- Planned: Full PostHog initialization, complete event forwarding pipeline, dashboard queries, cohort analysis

---

## 10. Failure Behavior and Recovery

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Calculator engine error | Typed calculation error | Preserve inputs and prior result; show exact blocking field/reason; never substitute |
| Public API rate limit | `429` response | Retry with bounded backoff or use the same deterministic client engine |
| Transactional email unavailable | Delivery failure | Keep paid entitlement and offer authenticated/manual re-download; never claim delivery |
| Database connection lost | Failed server mutation | Keep local state, mark cloud save failed, and offer retry/export; no unimplemented queue claim |
| Stale cloud write | Version mismatch | Return `409 Conflict`; present both versions for explicit reconciliation |
| Deployment fails | Vercel build error | Block promotion or roll back to previous verified deployment |
| Dodo webhook fails verification | Invalid signature/event | Reject without state change and log a redacted correlation ID |
| Duplicate Dodo webhook | Known event/transaction ID | Return success idempotently without duplicating entitlement |
| Content validation fails | Contract check fails | Block publication and show validation errors |
| Share URL decode fails | Malformed/unsupported payload | Preserve no data from it; load empty tool with an explicit message |
| PostHog unavailable | Analytics request fails | Drop the optional event; never block product use or retain sensitive local payloads |
| Save fails | Server error | Display “Save failed — Retry”; preserve all local user data |

### Degradation priorities

1. Core deterministic tools remain available locally when optional services fail.
2. Public content remains available through static/CDN delivery.
3. Account failures preserve local state and state the unsaved condition truthfully.
4. Payment failures never grant or revoke entitlement from an unverified browser redirect.
5. Analytics and email are optional and never block product use.

---

## 11. Migration and Recovery from Existing Production Data

### Current state

The repository at `/opt/data/studio/apps/soapcraft-pro` contains existing production data from a previous development phase:

- `app/` directory with Next.js App Router pages and components
- `lib/` directory with calculation modules, blog data, SEO infrastructure, analytics
- `components/` directory with recipe builder, batch cost, cure tracker, making mode, and other UI components
- `src/` directory with `globals.css` containing the approved design token system
- `product/` directory with existing documentation
- `public/` directory with static assets

### Migration approach

1. **Code migration:** Existing `app/` components and `lib/` modules are the starting point; new utility hub routes (`/tools/*`, `/examples/*`, `/guides/*`) are added alongside existing routes (`/calculators/*`, `/blog/*`)
2. **Design token migration:** `src/globals.css` design tokens are the current approved baseline; mapped to `app/globals.css` Tailwind `@theme` block
3. **Data migration:** Existing database schema migrated to support immutable RecipeVersion chain, inventory tables, supplier tables, and production planning tables
4. **Route migration:** Legacy calculator routes (`/calculators/*`) preserved during transition; new `/tools/*` routes added; `/marketing/*` tree canonicalized
5. **SEO migration:** Existing `lib/seo/*` infrastructure extended; `robots.ts` and `sitemap.ts` updated for new routes

### Recovery procedures

1. **Baseline recovery:** Credential rotation, branch/worktree/stash backup, deployed commit identified
2. **Git recovery:** `.git/index.lock` cleanup if needed; stash recovery via `git stash list`
3. **Database recovery:** Drizzle migrations applied in order; rollback via `drizzle-kit rollback`
4. **Deployment recovery:** Vercel rollback to previous successful deployment; preview deployments for PR validation
5. **Data integrity:** Formula fixtures verify calculation accuracy; RED fixture tests validate against reference cases
6. **Build recovery:** `pnpm install` or clean reinstall if node modules corrupted; `next build` validates production build

### Currently exists vs planned

- Currently exists: Working Next.js app with components, `lib/calculations/batch-cost.ts` and `sap.ts` with tests, `lib/blog-contract.ts`, `lib/seo/*`, `lib/auth.ts`, `lib/auth-guards.ts`, `lib/analytics/analytics.ts`, `lib/analytics/posthog.ts`, `app/globals.css` with design tokens
- Planned: Full utility hub route expansion, inventory/supplier modules, production planning engine, cloud sync infrastructure, complete authentication flow with account management

---

## 12. Infrastructure Notes

### What currently exists

| Component | Status | Details |
|-----------|--------|---------|
| Vercel deployment | Active | Project: `prj_J12YtoRr3q5dmazDWsqs2jXLpOqy`, Org: `team_gYtaSveuJSflpubmwIGhFD6Y` |
| Next.js App Router | Active | `app/` directory with layout, providers, route handlers |
| PostgreSQL (Neon) | Connected | `DATABASE_URL` in `.env.local`, Drizzle ORM |
| Dodo payments | Existing integration to reuse | One-time Seller Pack checkout only; subscription billing deferred |
| PostHog | Existing adapter | Activation/continuation events only after payload review |
| Design tokens | Active | `app/globals.css` with `@theme` block and CSS custom properties |
| SEO infrastructure | Active | `lib/seo/*`, `robots.ts`, `sitemap.ts` |
| Blog system | Active | `lib/blog-contract.ts`, `lib/blog-data.json`, `lib/blog.ts` |
| Calculation engine | Partial | `lib/calculations/batch-cost.ts` and `sap.ts` exist; full chemistry engine pending verification gate |
| Auth | Scaffold | `lib/auth.ts`, `lib/auth-guards.ts` exist; full flow pending |

### What is planned

| Component | Priority | Dependencies |
|-----------|----------|-------------|
| Full `/tools/*` route structure | High | Calculation engine completion |
| Immutable RecipeVersion chain | High | Database schema migration |
| Cloud persistence and multi-device access | Medium | Existing NextAuth + Neon/Drizzle; optimistic concurrency |
| Inventory and supplier management | Medium | Database schema, ownership checks, UI components |
| Production/cure planning engine | Medium | Deterministic date tests |
| Seller Pack one-time purchase | Medium | Dodo adapter, webhook signature/idempotency, entitlement records |
| PostHog activation pipeline | Medium | Payload validation and privacy tests |
| Subscription workspace billing | Deferred | Observed demand plus separate approval |

### Do NOT invent unavailable infrastructure

- No AI-powered calculation engines (deterministic only)
- No automated content publication
- No community/forum features
- No display ad integration
- No general e-commerce catalogue, marketplace, fulfilment system, or bookkeeping suite beyond the single Seller Pack entitlement flow
- No IFRA compliance claims
- No fragrance recommendation engine (subject to verification gate)
- No universal SAP/KOH/mold-density logic (subject to verification gate)

---

*Document version 2.0 — Utility hub model. Replaces traffic-first architecture v1.0.*
*Companion to: `product/PRODUCT-CONTRACT-UTILITY-HUB.md`, `product/PRD.md`, `product/DESIGN.md`, `product/FLOWS.md`*
*Vercel config: `{ "projectId": "prj_J12YtoRr3q5dmazDWsqs2jXLpOqy", "orgId": "team_gYtaSveuJSflpubmwIGhFD6Y", "projectName": "soapcraft-pro" }`*
