# Contract Migration: SoapCraft Pro Traffic-First → Anonymous-First Utility Hub

| Field | Value |
|---|---|
| **Migration Date** | 2026-09-10 |
| **Migration Authority** | Isaac, 2026-09-09 |
| **Previous Contract** | Traffic-first (v3.0 PRD / v2.0 FLOWS / v2.0 ARCHITECTURE / v4.0 DESIGN) |
| **Current Contract** | Anonymous-first free utility hub (v1.0) |
| **Build Authorization** | `BUILD_AUTHORIZED` by Isaac on 2026-09-09 |
| **Release Gate** | `RELEASE_ACCEPTED` reserved for post-build independent verification |
| **Chemistry Gate** | GATED until verification gate passes |
| **Gate_C Status** | PASS |
| **Gate_R Status** | PASS |
| **Gate_A Status** | PENDING |

---

## 1. Legacy Contradictions Superseded

The following contradictions existed in the previous traffic-first contract and are resolved by the anonymous-first utility hub contract:

| # | Legacy Contradiction | Resolution |
|---|---|---|
| 1 | `/tools` was a dead directory with no content | `/tools` is now canonical all-tools catalogue (SLICE-001, SLICE-003) |
| 2 | Homepage routes returned 404 | Homepage rebuilt as public marketing/entry with visual modules (SLICE-002) |
| 3 | Category `/tools` pages were empty | All tools consolidated under canonical `/tools/<tool-slug>` routes (SLICE-003) |
| 4 | Legacy `/calculators` contained partial forms | Retired; `/calculators` removed from nav/sitemap; future cleanup slice only |
| 5 | Pricing and subscription pages were exposed | Retired from nav/sitemap; implementation removal is future cleanup slice |
| 6 | Traffic-first metrics (page views, session duration, email capture) | Replaced with utility-first metrics (anonymous completion, connected-tool continuation) |
| 7 | Blog was acquisition/SEO scope | Blog is draft content only, not acquisition scope (SLICE-009) |
| 8 | Email capture and CRM drip were core flows | Removed entirely; no email/CRM slices remain |
| 9 | Social marketing pages were in roadmap | Removed; no social campaign slices remain |
| 10 | Mandatory accounts and cloud sync were planned | Removed; anonymous-first with local save/export only |
| 11 | Chemistry formulation was near-launch | Gated until verification gate passes; never first proof |
| 12 | Brand tokens were treated as final | All design tokens are provisional pending Isaac approval |

---

## 2. Exact Changed IA (Information Architecture)

### Canonical Public Route Taxonomy

| Route | Status | Description |
|---|---|---|
| `/` | Public | Homepage — marketing/entry leading into real tools |
| `/tools` | Public | Canonical all-tools catalogue |
| `/tools/<tool-slug>` | Public | One canonical route per shipped tool (e.g., `/tools/batch-cost`, `/tools/recipe-scaling`) |
| `/methodology` | Public | Public support route |
| `/safety` | Public | Public support route |
| `/privacy` | Public | Public support route |
| `/terms` | Public | Public support route |
| `/blog` | Draft only | Unlaunched/draft content, not acquisition scope |

### Retired Routes (from nav/sitemap only)

| Route | Decision |
|---|---|
| `/pricing` | Retired from nav/sitemap; implementation removal is future cleanup slice |
| `/subscription` | Retired from nav/sitemap; implementation removal is future cleanup slice |
| `/marketing/*` | Retired from nav/sitemap; implementation removal is future cleanup slice |
| `/calculators/*` | Retired; legacy forms superseded by canonical `/tools/<tool-slug>` |
| `/dashboard` | Retired; no mandatory accounts in current launch |
| `/email/*` | Retired; no CRM/email capture in current launch |
| `/social/*` | Retired; no social marketing pages in current launch |

### Legacy URLs as Redirect/Removal Decisions

Legacy URLs are specified as redirect/removal decisions, never as parallel product IA:

- `/calculators/*` → redirect to `/tools` or removed entirely (future cleanup slice)
- `/tools/batch-economics`, `/tools/markets`, `/tools/pricing`, `/tools/production`, `/tools/purchasing`, `/tools/sizing` → removed (dead directory, replaced by canonical `/tools`)
- `/pricing`, `/subscription` → retired from nav/sitemap; implementation removal scheduled as future cleanup slice
- Legacy files preserved in `product/legacy/` for audit only

---

## 3. Contract Gate State

### Gate_C (Implementation Gate)

| Field | Value |
|---|---|
| **Status** | PASS |
| **Authorized By** | Isaac, 2026-09-09 |
| **Scope** | Anonymous-first free utility hub |
| **Every Core Flow Has High-Boundary Row** | YES |
| **Note** | Isaac authorized implementation. IA cleanup must complete before any routes are exposed. |

### Gate_R (Skill Receipt Gate)

| Field | Value |
|---|---|
| **Status** | PASS |
| **All Required Skills Loaded** | YES |
| **Skills** | studio-product-contract, studio-experience-routing, design/ui-ux-pro-max, creative:impeccable-design, design/app-life-and-style |
| **Note** | All skills routed and receipted. See `.studio/skill-receipts.json`. |

### Gate_A (Release Gate)

| Field | Value |
|---|---|
| **Status** | PENDING |
| **Requires** | RELEASE_ACCEPTED after build and verification |
| **Chemistry** | GATED until verification gate passes |
| **Note** | No release, implementation, or test evidence claimed as complete. |

---

## 4. What Remains Blocked

The following items remain blocked pending Isaac action or verification:

| Item | Blocker | Status |
|---|---|---|
| Chemistry formulation features | Verification gate must pass (deterministic spec, source manifest, independent review, hand/reference calculations, cross-calculator fixtures) | BLOCKED |
| Final branding and brand tokens | Isaac approval required; all tokens currently provisional | BLOCKED |
| Retired route implementation removal | Future cleanup slice; not blocking current build | PENDING (future) |
| Blog public launch | Draft content only; not acquisition scope | BLOCKED (not in scope) |
| Release claim | Requires RELEASE_ACCEPTED after independent verification | BLOCKED |
| Any claim of working chemistry tools | Must not pretend chemistry is a working tool until verification passes | BLOCKED |

---

## 5. Build Order Summary

The build order follows dependency-ordered thin vertical journeys:

1. **SLICE-001: IA Cleanup** — Resolve dead `/tools`, fix 404 homepage, remove exposed pricing/subscription, normalize routes. Prerequisite for all other slices.
2. **SLICE-002: Homepage Visual Modules** — Build homepage with 2,000+ words through visual modules.
3. **SLICE-003: Tool Catalogue** — Build constrained `/tools` catalogue with desktop/mobile layouts.
4. **SLICE-004: Batch Cost Calculator** — First proof vertical. Non-chemistry tool with visible result, local save/export, context handoff, reload/re-entry.
5. **SLICE-005–006: Additional Tools** — Recipe scaling, mold-volume, craft-fair-break-even.
6. **SLICE-007–009: Public Support, SEO, Blog** — Support pages, SEO infrastructure, draft blog.
7. **SLICE-010: Chemistry Verification** — Gated until verification gate passes.

---

## 6. Key Contract Decisions Summary

1. **Anonymous-first**: No mandatory accounts, no email capture for core results, no exit-intent popups, no cloud sync
2. **Free utility hub**: Pricing/subscription/payment pages retired from nav/sitemap
3. **No social marketing**: No CRM drip, no social campaign pages
4. **Chemistry gated**: No real formulation output advertised as usable until verification passes
5. **Local-only persistence**: Save/export via browser storage, download, or clipboard; no cloud sync
6. **Provisional tokens**: All design tokens flagged as pending Isaac approval; no new brand tokens invented
7. **Canonical routes**: Single `/tools/<tool-slug>` per tool; legacy URLs are redirect/removal decisions only
8. **First proof is non-chemistry**: Batch cost calculator is the first vertical journey
9. **No release claims**: `RELEASE_ACCEPTED` reserved for post-build independent verification
10. **No test evidence claimed**: All acceptance rows describe observable criteria; do not pretend working tool status

---

## 7. Artifact Migration Map

| Legacy Artifact | New Artifact | Status |
|---|---|---|
| `product/PRD.md` (v3.0 traffic) | `product/legacy/PRD.md.v3-traffic` | Superseded |
| `product/FLOWS.md` (v2.0 traffic) | `product/legacy/FLOWS.md.v2-traffic` | Superseded |
| `product/ARCHITECTURE.md` (v2.0 traffic) | `product/legacy/ARCHITECTURE.md.v2-traffic` | Superseded |
| `product/DESIGN.md` (v4.0 traffic) | `product/legacy/DESIGN.md.v4-traffic` | Superseded |
| `product/PRODUCT-CONTRACT-UTILITY-HUB.md` | `product/legacy/PRODUCT-CONTRACT-UTILITY-HUB.md` | Superseded |
| `product/AI-OPERATING-CONTRACT.md` (legacy) | `product/legacy/AI-OPERATING-CONTRACT.md` | Superseded (replaced by current) |
| — | `product/PRD.md` (v1.0 anonymous-first) | Current |
| — | `product/FLOWS.md` (v1.0 anonymous) | Current |
| — | `product/ARCHITECTURE.md` (v1.0) | Current |
| — | `product/DESIGN.md` (v1.0) | Current |
| — | `product/CONTRACT-MIGRATION.md` (this file) | Current |
| — | `product/AI-OPERATING-CONTRACT.md` (current) | Current |
| — | `.studio/acceptance.json` (v1.0) | Current |
| — | `.studio/slices.json` (v1.0) | Current |
| — | `.studio/skill-receipts.json` (v1.0) | Current |

---

*This migration document records the exact contradictions, changed IA, gate state, and remaining blockers for the anonymous-first free utility hub contract. Legacy files are preserved under `product/legacy/` for audit only.*
