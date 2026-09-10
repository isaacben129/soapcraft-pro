# SoapCraft Pro — Build Log

**Repository:** `/opt/data/studio/apps/soapcraft-pro`
**Branch:** `main`
**Delivery target:** linked Vercel project, but no current release claim
**Operating contract:** anonymous-first, free, tool-first utility hub

## Current contract state — 2026-09-10

- Current planning package: commit `fd3f9d8`.
- Gate C (scope/implementation): **PASS** based on Isaac’s approved anonymous-first utility-hub direction.
- Gate R (skill routing): **PASS**; receipts are in `.studio/skill-receipts.json`.
- Gate A (release): **PENDING**. Only `RELEASE_ACCEPTED` from an independent audit can close it.
- Chemistry: **GATED**. No real formulation result may be represented as publicly usable until the verification gate is independently satisfied.
- Explicitly out of current launch scope: payments, subscriptions, pricing, CRM/email capture, social marketing, mandatory accounts, cloud sync, final branding, and public blog acquisition.

## In progress — SLICE-001: IA Cleanup and Route Normalization

**Goal:** A visitor reaches `/tools`, sees only real tool states, and never hits a fake tool page, pricing/subscription path, or auth gate while using the public utility experience.

### Implemented source changes awaiting browser/deployed verification

- Canonical tool directory introduced at `/tools` with four currently represented non-chemistry tool routes and a non-clickable chemistry-gated status.
- Canonical routes introduced for batch cost, recipe scaling, mold volume, and craft-fair break-even.
- Legacy calculator routes converted toward redirects to canonical tool routes.
- Pricing, subscription, dashboard, and marketing paths removed from the intended public navigation/sitemap model.
- Public-route authorization updated for tools, safety, methodology, privacy, and terms.
- Sitemap and robots were changed to exclude retired routes.

### Static evidence captured

- `npx tsc --noEmit` — passed on current source after clearing a stalled generated `.next` cache.
- `npm test -- --run` — passed: 107 tests across 13 files.
- `git diff --check` — passed.

### Not yet proven

- Browser and deployed behavior for the complete SLICE-001 journey is **UNVERIFIED**.
- Local `npm run dev` failed to become reachable within 60 seconds and emitted no server output; this is the existing local Next runtime/build hang.
- No new production deployment has been made for the route repair.
- No acceptance row is marked VERIFIED.

## Ordered execution queue

1. **SLICE-001** — finish and independently browser-verify IA cleanup and route normalization.
2. **SLICE-002** — rebuild the homepage composition as visual modules, not a 2,000-word text wall.
3. **SLICE-003** — independently inspect constrained `/tools` desktop/mobile catalogue and tool reachability.
4. **SLICE-004** — make the batch-cost calculator a complete anonymous vertical journey with result, local save/export/context handoff, and reload/re-entry.
5. **SLICE-005/006** — recipe scaling, mold volume, craft-fair break-even.
6. **SLICE-007/008** — public support pages and canonical technical SEO.
7. **SLICE-010** — chemistry verification gate only after source/reviewer/fixture evidence.

## Active blockers

1. Local Next dev/build does not become reachable. This blocks local browser E2E, not static type/test checks.
2. Chemistry public release is blocked by independent data-source, reviewer, and fixture requirements.
3. Final visual tokens/brand assets remain provisional pending Isaac’s explicit approval.
4. `RELEASE_ACCEPTED` requires an independent post-build verification pass.
