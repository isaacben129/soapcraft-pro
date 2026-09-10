# SoapCraft Pro — System Architecture

**Version:** 1.0 — Anonymous-First Utility Hub Architecture
**Companion to:** `product/PRD.md`, `product/DESIGN.md`, `product/FLOWS.md`
**Approved direction:** Isaac, 2026-09-09 — anonymous-first, free, tool-first utility hub
**Date:** 2026-09-10

---

## 1. Canonical route taxonomy

A single canonical public route taxonomy. Legacy URLs are redirect/removal decisions, never parallel product IA.

### 1.1 Active public routes

```text
/                           → Public homepage (marketing/entry → real tools)
/tools                      → Canonical all-tools catalogue
/tools/<tool-slug>          → One canonical route per shipped tool
/methodology                → Public methodology documentation
/safety                     → Public safety information
/privacy                    → Public privacy policy
/terms                      → Public terms of service
/blog                       → Unlaunched/draft content only
```

### 1.2 Retired routes (future cleanup slice)

```text
/pricing                    → Retired from nav/sitemap
/subscription               → Retired from nav/sitemap
/dashboard                  → Retired from nav/sitemap
/marketing/*                → Retired from nav/sitemap
/calculators/*              → Legacy; redirect or remove
/pinterest/*                → Retired from nav/sitemap
/tiktok/*                   → Retired from nav/sitemap
```

### 1.3 Route rules

- One canonical `/tools/<tool-slug>` per shipped tool; no fake tool route exposed
- `/blog` is draft content only; not acquisition scope; no thin SEO expansion
- Pricing, subscription, marketing, email/CRM, social campaign pages are retired from nav/sitemap
- Implementation removal is a future cleanup slice; do not treat retired routes as parallel product IA
- IA cleanup must complete before any routes are exposed

---

## 2. System Boundary Map

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    PUBLIC LAYER (no auth required)                         │
│                                                                             │
│  ┌──────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────┐ │
│  │ Homepage &    │  │ Public Tools  │  │ Support       │  │ Content  │ │
│  │ Tool Directory│  │ Catalogue     │  │ Pages         │  │ Pages    │ │
│  │               │  │               │  │               │  │          │ │
│  │ /             │  │ /tools        │  │ /methodology  │  │ /safety  │ │
│  │ /tools        │  │ /tools/*      │  │ /privacy      │  │ /terms   │ │
│  │ /blog (draft) │  │               │  │ /terms        │  │ /blog/*  │ │
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
│  │ (optional)    │  │               │  │               │  │          │ │
│  │ /auth/*       │  │ /app-shell    │  │ All scoped by │  │ /api/    │ │
│  │ NextAuth      │  │               │  │ userId        │  │ analytics │ │
│  │               │  │               │  │               │  │          │ │
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
│  │  │               │  │ (future)        │  │ (future)       │  │ Aggregate││ │
│  │  │ • Users       │  │ • Tool state  │  │ (future)       │  │ no PII   ││ │
│  │  │ • Recipes     │  │ • Exports     │  │                │  │          ││ │
│  │  │ • Batches     │  │ • Share URLs  │  │                │  │          ││ │
│  │  │ • Costs       │  │               │  │                │  │          ││ │
│  │  │ • Content     │  │               │  │                │  │          ││ │
│  │  └──────────────┘  └───────────────┘  └───────────────┘  └──────────┘│ │
│  │                                                                           │ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Module Boundaries and Interfaces

### 3.1 Public Layer (No Auth)

**Responsibility:** Deliver free tools, guides, content, and the utility hub entry points. No authentication required for any core result.

**Routes:**
- `/` — Homepage with tool directory and featured content
- `/tools` — Complete utility tool catalogue
- `/tools/<tool-slug>` — Individual functional tools (one canonical route per shipped tool)
- `/methodology` — Public methodology documentation
- `/safety` — Public safety information
- `/privacy` — Public privacy policy
- `/terms` — Public terms of service
- `/blog` — Unlaunched/draft content only

**Interfaces:**
- Public tool API: `GET /api/calculate/*` — public, no auth, rate-limited
- Blog content: `GET /api/blog/*` — public, cached
- Content metadata: `GET /api/content/*` — public
- SEO: `GET /robots.txt`, `GET /sitemap.xml` — public
- Analytics: `POST /api/analytics/event` — public, lightweight, no PII
- Share URL: `GET /api/share/:id` — public, decodes state, no auth
- Export: `POST /api/export` — public, generates artifact from calculation state

**Failure modes:**
- Rate limiting on calculator API prevents abuse (public, anonymous usage)
- CDN caching for static pages and public API responses
- Share URL service degrades: tool loads with empty state if URL decoder fails

**Currently exists vs planned:**
- Currently exists: `/calculators/*` (legacy tool paths), `/blog/*`, `/compare/*`
- Planned: `/tools/*` directory structure, `/methodology`, `/safety`, `/privacy`, `/terms` as public support routes

### 3.2 Application Layer (Authenticated — future slice)

**Responsibility:** Account management, cloud persistence, recipe/batch tracking, and optional account features. Account is optional — these features are persistence layers, not gates.

**Routes (future):**
- `/dashboard` — Production workspace (auth required, future slice)
- `/recipes/*` — Recipe creation, versioning, and history (future slice)
- `/batches/*` — Batch tracking and Making Mode (future slice)
- `/costing` — Cost analysis (future slice)
- `/ingredients` — Ingredient inventory (future slice)
- `/settings` — Account settings (future slice)
- `/auth/*` — Authentication (future slice)

**Note:** Account and cloud persistence are future vertical journeys. Current launch is anonymous-first with local state only.

### 3.3 Calculation Engine

**Responsibility:** Deterministic soap formulation and economic calculations. No AI invention.

**Core modules:**
- `lib/calculations/batch-cost.ts` — Batch cost calculation (FIRST PROOF)
- `lib/calculations/sizing.ts` — Sizing, unit conversion, recipe scaling
- `lib/calculations/sap.ts` — Saponification value calculations (GATED)
- `lib/calculations/economics.ts` — Economic calculations (markup, margin)
- `lib/calculations/markets.ts` — Market planning (future)
- `lib/calculations/production.ts` — Production planning (future)
- `lib/calculations/purchasing.ts` — Purchasing planning (future)
- `lib/calculations/versioning.ts` — Formula and data versioning

**Rules:**
- All calculations are deterministic (no AI invention)
- Calculations accept unit inputs and return precise results
- Calculation tests use RED fixtures for verification
- Safety-critical calculations (lye, water ratios) have validated input ranges
- Formula revision numbers are explicit and included in exports
- Money must never be summed across currencies
- Quantities normalized by tested conversion functions
- Rounding is display-only until the final monetary output

**FIRST PROOF modules:** `lib/calculations/batch-cost.ts` with `lib/calculations/batch-cost.test.ts` — confirmed working with test fixtures from source audit.

**GATED modules:** `lib/calculations/sap.ts` and all chemistry-related calculations — not publicly released until verification gate passes.

### 3.4 Content Layer

**Responsibility:** SEO blog, guides, examples, templates, and visual content. Every page must supply at least one quality bar item.

**Modules:**
- `lib/blog.ts` / `lib/blog-data.json` — Blog data management
- `lib/blog-contract.ts` — Content validation rules
- `lib/seo/*` — SEO metadata, intent registry, JSON-LD, sitemap, robots
- `lib/content/*` — Template and guide content metadata
- `lib/analytics/analytics.ts` — Aggregate analytics events (no recipe data)
- `lib/analytics/posthog.ts` — PostHog client integration

**Rules:**
- All blog posts have SEO metadata, content, review status
- Content validated against `blog-contract.ts`
- Every page has `pageMetadata()` with title, description, path, OpenGraph, Twitter
- Sitemap auto-generates from pages and blog posts
- Robots.txt disallows `/api/`, `/auth/`, `/recipes/`, `/batches/`, `/dashboard/`, `/subscription/`
- No page ships solely to meet a word/page quota
- `/blog` is unlaunched/draft content only

### 3.5 Integration Layer

**Responsibility:** Third-party services and distribution channels.

**Services:**
- **Neon + Drizzle:** existing canonical persistence stack for optional accounts (future slice)
- **NextAuth:** existing authentication/session boundary (future slice)
- **PostHog:** aggregate product events only; never recipe, cost, or personally identifying payloads
- **Vercel / GitHub:** deployment and source control
- **Email:** transactional delivery only for an explicitly requested artifact/receipt (future slice)
- **Dodo Payments:** one-time Seller Pack only (future slice — deferred until demand observed)

**Currently exists vs planned:**
- Reuse: Dodo client/configuration code, Neon connection, Drizzle, NextAuth, Vercel, GitHub
- Deferred: subscription plans, workspace billing, CRM sequences, Redis, queues, real-time/WebSocket infrastructure

---

## 4. Canonical Data Ownership

Each domain object has a single canonical owner. Other modules read from or reference the owner; none write independently.

| Domain Object | Canonical Owner | Access Pattern |
|----------------|-----------------|----------------|
| User profile | Users table | User CRUD, self-service (future) |
| Recipe | Recipes table | User CRUD, versioned (future) |
| RecipeVersion | RecipeVersion table | Immutable after creation (future) |
| Batch | Batches table | User CRUD; linked to RecipeVersion (future) |
| Cost record | Costs table | User CRUD; linked to Batch (future) |
| Blog post | Content table | Content team CRUD; public read |
| Guide | Content table | Content team CRUD; public read |
| Share URL | Share table | Generated from calculation state; public read; no auth |
| Analytics event | PostHog | Aggregate; no PII; no recipe data |
| Session | Existing NextAuth strategy | Server-validated identity (future) |

### Data ownership rules

1. **Single writer principle:** Each domain object has exactly one table/module that writes to it
2. **Immutable versions:** RecipeVersion records are immutable once created (future)
3. **Foreign key integrity:** Batches reference RecipeVersion IDs, not Recipe IDs
4. **No cross-module writes:** The Cost module reads from Batch and Ingredient tables but never writes to them
5. **Public data separation:** Blog, guides, and examples live in content tables with public-read access
6. **Share URL state:** Share URLs contain only calculation state; no email, name, or any personal data

---

## 5. Local State vs Cloud Persistence

### Architecture principle

The utility hub operates on a **local-first** model. Cloud persistence is a future slice.

```text
Anonymous user (current launch):
  Local state → Share URL (state encoded in URL) → Ephemeral
  Local state preserved across browser reloads

Account user (future slice):
  Local state → Cloud sync (PostgreSQL) → Multi-device persistence
```

### Local state (current launch)

- Browser localStorage and sessionStorage preserve tool inputs and results
- Share URLs encode calculation state as URL parameters
- No server-side storage for anonymous users
- Local state is browser-scoped and clearly labeled as local-only
- Export preserves data beyond the session

### Cloud persistence (future slice)

- Full Recipe/Batch Context persisted in Neon PostgreSQL through Drizzle ORM
- Explicit server-backed reads/writes
- Optimistic version check; stale mutations receive `409 Conflict`
- Requires account creation; never required for core tools

---

## 6. Auth and Security Model

### Principle: Anonymous reads, optional account writes (future)

```text
Public route → No auth check → Serve content
Public route + calculation → No auth → Compute locally or via public API
Auth route → NextAuth check → Session valid → Serve user data (future)
API route → Session check → userId derived → Scope data by userId (future)
```

### Authentication (future)

- **Method:** NextAuth.js with credentials + OAuth providers
- **Session:** JWT-based with server-side validation
- **Anonymous access:** Full read and calculation access without authentication
- **Account creation:** Optional; email + password or OAuth; never a gate

### Authorization (future)

- **Row-level security:** Every database query scoped by `userId`
- **API middleware:** Public routes have no auth check; private routes validate session
- **Ownership checks:** Every resource access verifies `resource.userId === session.userId`

### Security practices

- No PII in analytics: PostHog events omit email, name, recipe data, and addresses
- No PII in share URLs: Share URL state contains only calculation values
- Email consent: Email is exchanged only for a specific delivered artifact with explicit consent (future)
- Data minimization: Collect only what is needed for the function
- Environment secrets: `NEXTAUTH_SECRET`, `DATABASE_URL`, `DODO_PAYMENTS_SECRET` in `.env.local`; never committed
- Content security: robots.txt disallows protected routes; sitemap excludes private paths
- CORS: API routes configured for same-origin; no cross-origin exposure of private data

---

## 7. Content and SEO Architecture

### Public content surface

Every public page must be:
- Indexable by search engines
- Have complete metadata (title, description, OpenGraph, Twitter, canonical URL, JSON-LD)
- Reachable from the homepage and/or tool directory
- Substantive (meet the quality bar)

### SEO infrastructure

- `app/robots.ts` — Disallows protected routes, points to sitemap
- `app/sitemap.ts` — Generates sitemap from static pages and blog posts
- `lib/seo/site-url.ts` — `NEXT_PUBLIC_SITE_URL` env var for canonical URLs
- `lib/seo/metadata.ts` — `pageMetadata()` helper for all pages
- `lib/seo/intent-registry.ts` — Programmatic SEO page registry
- `lib/seo/json-ld.ts` — Structured data serialization
- `lib/seo/content-validator.ts` — Content validation rules

### Content structure

| Content Type | Route Pattern | Auth | Purpose |
|--------------|---------------|------|---------|
| Homepage | `/` | None | Tool discovery, featured content |
| Tool catalogue | `/tools` | None | Complete tool listing |
| Individual tools | `/tools/*` | None | Functional calculators |
| Blog | `/blog/*` | None | Unlaunched/draft content only |
| Methodology | `/methodology` | None | Substantive methodology |
| Safety | `/safety` | None | Public safety information |
| Privacy | `/privacy` | None | Public privacy policy |
| Terms | `/terms` | None | Public terms of service |

### Content rules

- Every page supplies at least one of: verified working tool, editable worked calculation, downloadable artifact, verified reference data, or substantive synthesis
- No page ships solely to meet word count
- `/blog` is unlaunched/draft content only; no thin SEO expansion
- Pages with overlapping intent are merged, redirected, or canonicalized
- Canonical URLs contain no duplicate `/marketing` tree
- Safety, legal, tax, IFRA, and formulation content requires named sources and reviewer approval

---

## 8. Analytics Architecture

### Principle: Aggregate events, no recipe data

Analytics track user behavior at the aggregate level. No recipe data, notes, addresses, or any PII is ever collected.

### Event contract

Required events:

| Event | Trigger | Properties (no PII) |
|-------|---------|---------------------|
| `tool_viewed` | Tool page loaded | tool_id, source_channel |
| `calculation_started` | User began entering inputs | tool_id |
| `calculation_completed` | Result produced | tool_id, has_missing_inputs |
| `connected_tool_opened` | User moved to connected tool | from_tool, to_tool |
| `plan_exported` | Print/export/share action | tool_id, export_type |
| `share_link_created` | Share URL generated | tool_id |
| `account_save_requested` | User clicked save | tool_id (future) |
| `workspace_interest_submitted` | User expressed workspace interest | tool_id (future) |

**Privacy constraint:** Analytics contain no recipes, notes, addresses, or any PII. PostHog events follow the approved event contract and omit sensitive values.

---

## 9. First proof architecture (Journey 1)

The first vertical journey (batch cost) must demonstrate a genuinely working, non-chemistry tool.

### Architecture for first proof

1. **Homepage (`/`)** — Visual modules distributed with 2,000+ words; hero → tool discovery/value cards → workflow/timeline → UI/proof panels → use-case modules → safety/trust boundary → FAQ → CTA
2. **Tool catalogue (`/tools`)** — Constrained desktop tool catalogue; mobile stacks with no horizontal overflow
3. **Batch Cost tool (`/tools/batch-cost`)** — Genuinely working calculator with:
   - Deterministic calculation from `lib/calculations/batch-cost.ts`
   - Test verification from `lib/calculations/batch-cost.test.ts`
   - Real calculation API route (`app/api/calculate/batch-cost/route.ts`)
   - Visible result with assumptions, warnings, and formula revision
   - Local save, export, and share URL
   - Reload/re-entry preserves context
4. **IA cleanup** — Dead `/tools` directory content removed; empty category pages fixed; pricing/subscription pages removed from nav/sitemap; legacy `/calculators` paths normalized

### What must be true for first proof

- Anonymous user completes the full flow in a fresh browser with no login, email, cookie consent, or payment
- Complete result is visible immediately
- Local save, export, and share URL work
- Reload/re-entry preserves context
- No chemistry is advertised as released
- No pricing or subscription path is visible

---

## 10. Chemistry architecture (gated later)

Chemistry implementation remains a **gated later journey, never first proof**.

- No existing SAP, KOH, mold-density, fragrance, or IFRA logic is made public by middleware-only changes
- Chemistry cannot become public until its deterministic specification, source manifest, effective/revision dates, independent review, hand/reference calculations, and cross-calculator fixtures pass
- The model may research, derive, explain, implement and test chemistry logic, but model output is never the authoritative source of a safety-critical constant or formula
- Differences between authoritative sources must be explained and resolved; values must not be averaged merely to make tests pass
- **No real formulation output is advertised as usable or considered released**

---

## 11. Technical requirements

- Typecheck, lint, unit tests, production build, and anonymous mobile/desktop E2E all pass
- Public page/API responses are 200; sitemap and robots are 200 and correct
- Canonical URLs contain no duplicate `/marketing` tree
- PostHog events follow the approved event contract and omit sensitive values
- No endpoint reports email delivery, save, export, or payment success unless the side effect is verified
- Formula/data revisions are explicit and included in exports
- Error logging does not expose user-entered recipe or contact data
- Pure calculation modules have unit, boundary, property, and unit-conversion round-trip tests
- Independent spreadsheet/reference cases are reviewed before release

---

*Document version 1.0 — Anonymous-first utility hub architecture.*
*Companion to: `product/PRD.md`, `product/DESIGN.md`, `product/FLOWS.md`*
