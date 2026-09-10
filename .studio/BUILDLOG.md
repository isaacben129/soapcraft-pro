# SoapCraft Pro — BUILDLOG

**Project:** SoapCraft Pro
**Repository:** `/opt/data/studio/apps/soapcraft-pro`
**Branch:** `main`
**Deployment:** Vercel (linked)
**Start Date:** 2026-09-08

---

## Session Log

### 2026-09-08 — Phase 1: Forge Contract

**Status:** Contract artifacts written

- `product/PRD.md` — existing (1,083 lines), needs traffic-first update
- `product/FLOWS.md` — CREATED (10 customer journeys)
- `product/ARCHITECTURE.md` — CREATED (system boundary map, module interfaces)
- `.studio/acceptance.json` — CREATED (8 capabilities, 6 gate constraints)
- `.studio/slices.json` — CREATED (8 slices, dependency-ordered)
- `.studio/BUILDLOG.md` — THIS FILE

### 2026-09-08 — Phase 2: Experience Routing

**Status:** Specialist skills loaded

- `studio-build` — loaded ✓
- `studio-product-contract` — loaded ✓
- `studio-experience-routing` — loaded ✓
- `studio-slice-delivery` — loaded ✓

### 2026-09-08 — Phase 3: Vertical Slices

**SLICE-001:** SEO Infrastructure and Public Shell — IN PROGRESS
**SLICE-002:** Free Batch-Costing Calculator (No Auth) — PENDING
**SLICE-003:** SEO Landing Pages — PENDING
**SLICE-004:** Blog Content Engine — PENDING
**SLICE-005:** Visual Content Paths (Pinterest/TikTok) — PENDING
**SLICE-006:** Email Capture and Drip Sequence — PENDING
**SLICE-007:** Authentication and Production Workspace — PENDING
**SLICE-008:** Pro Subscription and Dodo Payments — PENDING

---

## Known Issues

1. `NEXT_PUBLIC_SITE_URL` not in `.env.local` — falls back to `https://soapcraft-pro.vercel.app`
2. `soapcraft-pro-fresh` missing SEO layer — needs merge
3. `soapcraft-pro-fresh` missing `node_modules` — needs `npm install`
4. `.env.local` has REDACTED credentials — never expose in output
5. Node modules in `soapcraft-pro` functional but `.soapcraft-node_modules-broken-*` exists
6. Vercel project linked to GitHub repo `isaacben129/soapcraft-pro`
7. PostgreSQL not running locally — database connections need remote
8. Dodo Payments integration exists but webhook lifecycle incomplete

---

## Completed Actions

- [x] Read all existing product contract files
- [x] Read all existing SEO infrastructure
- [x] Read all existing page content
- [x] Read forge skill documentation
- [x] Created `product/FLOWS.md`
- [x] Created `product/ARCHITECTURE.md`
- [x] Created `.studio/acceptance.json`
- [x] Created `.studio/slices.json`
- [x] Created `.studio/BUILDLOG.md` (this file)
- [x] Presented new IA and funnels to user

## Pending Actions

- [ ] SLICE-001: Deploy existing SEO infrastructure to Vercel
- [ ] SLICE-002: Build batch-costing calculator with email capture
- [ ] SLICE-003: Add SEO landing pages
- [ ] SLICE-004: Activate blog engine with first 10 posts
- [ ] SLICE-005: Create Pinterest/TikTok content paths
- [ ] SLICE-006: Build email capture and drip system
- [ ] SLICE-007: Complete auth and production workspace
- [ ] SLICE-008: Complete Dodo Payments integration

---

## Voice Preservation

All copy must preserve Isaac's authentic voice. Do not polish, formalize, or "improve" the creator's language unless explicitly asked.

---

## Non-Negotiable Constraints

- Never modify safety-critical calculation logic without tests and review
- Never allow AI to invent chemistry formulas
- Never fabricate traffic, revenue, or conversion data
- Never deploy broken code
- Always include safety disclaimers on formulation tools

---

### 2026-09-09 — Utility Hub Reset: SLICE-003 Deterministic Formulation Engine

**Implementation status:** `IMPLEMENTED_PENDING_RELEASE_VERIFICATION`
**Public release status:** `BLOCKED_BY_RELEASE_GATES`

- Two delegated Forge builders were used. The first reached its iteration cap in RED; the continuation builder repaired the core engine but timed out before closing the journey boundary.
- A separate Forge acceptance reviewer independently checked formulas and fail-closed behavior.
- Reviewer findings repaired: additives are now included in total batch weight, manifest gate helpers have direct tests, and total-weight arithmetic has a numeric fixture.
- Internal deterministic engine completed with synthetic fixtures and provisional manifest records.
- Public API completed with typed `503` and `422` fail-closed outcomes.
- Public formulation route completed as an indexed verification-status page; it does not expose provisional chemistry output.
- Final verification: 37 focused tests passed, 114 full tests passed, typecheck passed, production build passed, and `git diff --check` passed.
- Evidence: `.studio/evidence/SLICE-003/implementation-verification.md`.
- No public chemistry release is authorized until source, cross-check, safety, and Gate_A receipts are complete.

### 2026-09-09 — Phase 3: SLICE-001 (SEO Infrastructure and Public Shell)

**Status:** IMPLEMENTED, awaiting build verification

- Added `lib/seo/structured-data.ts`: Organization, Website, Blog, Article, BreadcrumbList, FAQ schemas
- Added `components/shared/json-ld.tsx`: JsonLd and JsonLdList React components
- Added `lib/seo/index.ts`: Re-exports all SEO utilities
- Updated `app/layout.tsx`: Organization + Website JSON-LD injected via JsonLd
- Updated `app/page.tsx`: FAQ schema injected via JsonLd on homepage
- Updated `components/shared/index.ts`: Export JsonLd, JsonLdList
- Fixed canonical URL duplicates: /marketing/blog → /blog, /marketing/pricing → /pricing
- Updated sitemap: removed duplicate /marketing paths, added /pricing
- Updated marketing page metadata canonical URLs

Acceptance: UTIL-007 — robots.txt, sitemap, metadata, schema, canonical URLs
Boundary: deployed

### Blocked Gates (NOT implementation-ready):
- CHEM-001 through CHEM-009: SAP dataset source not assigned (no named domain owner)
- CHEM-010: Chemistry verification gate (deterministic spec, independent fixtures, hand calculations)
- SIZE-003, SIZE-006: Mold density reference values not sourced
- SLICE-003, SLICE-004, SLICE-013: BLOCKED pending chemistry gates
- DESIGN-GATE-001 through 004: Brand mark, photography, visual tokens, motion design

### Next: SLICE-002 (Recipe Versioning and Immutability) — depends on SLICE-001
