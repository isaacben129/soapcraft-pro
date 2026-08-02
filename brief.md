# SoapCraft Pro — brief.md (Revised)

> Produced by the `studio-build` pipeline, S1 agent.
> UX patterns sourced from `ui-ux-pro-max-skill` (nextlevelbuilder/ui-ux-pro-max-skill).
> Design framework: `impeccable` (pbakaus/impeccable) + `app-life-and-style` skill.
> Freshness check: `web_extract https://registry.npmjs.org/next/latest` → **next@16.2.10** (node >=20.9.0).
> Stack leanings below are version-verified, not memorized.
>
> **Revision notes:** MVP shrunk to 4 modules. AI is a formulation assistant, not a recipe generator. Lye calculation is deterministic and authoritative. Community is v2. Cure system provides estimated windows, not declarations.

## One-liner

SoapCraft Pro is a recipe, batch, and profitability workspace for serious soap makers. It combines verified formulation calculations, guided batch production, cure tracking, and real cost-per-bar analysis. AI helps users understand trade-offs and refine recipes — the calculator is the authority, not the AI.

## Problem

Soap makers — especially serious home crafters and micro-business sellers — juggle fragmented tools to make a single bar of soap: SoapCalc for lye math, spreadsheets for recipes, Google for troubleshooting, separate calculators for pricing, and Facebook groups for community knowledge. Each tool is a friction point: data lives in 5+ places, there's no unified batch tracking, no structured cure logging, and no clear cost-per-bar analysis. The result: failed batches, wasted ingredients, guesswork on pricing, and a steep learning curve that drives beginners away from the craft.

**Current workarounds and their pain:**
- SoapCalc (lye calculator only, no batch tracking, no outcome prediction)
- Spreadsheets (manual, error-prone, no community data, no versioning)
- Facebook groups (unstructured Q&A, no persistent knowledge)
- Pen & paper (lost recipes, no outcome tracking, no cost analysis)

## Target users

- **Serious Hobbyist (primary):** Makes soap regularly, has 10+ recipes, wants better results and fewer failed batches. Job-to-be-done: "Help me make better soap with less waste and less guesswork." Willing to pay for a tool that saves them time and ingredients.
- **Micro-Business Seller (secondary):** Sells on Etsy/Shopify, needs to track costs and pricing per bar. Job-to-be-done: "Help me know what my soap costs and what to charge for it." Willing to pay for business-tier features (v2).
- **Beginner (tertiary):** Just started, overwhelmed by lye calculations and safety concerns. Job-to-be-done: "Help me make my first batch successfully without messing up." Starts with free tier, converts to Pro when confident.

## Differentiators

1. **Deterministic formulation engine** — verified SAP calculations, not AI improvisation. Every lye amount is calculated, not guessed.
2. **Batch-to-batch learning** — structured logging creates a personal dataset that improves over time. No other tool connects recipe → batch → outcome → recommendation.
3. **Honest cure tracking** — estimated windows with user-controlled completion, not AI declarations of "ready."
4. **Real cost-per-bar analysis** — lightweight cost catalogue with target margin pricing, not just a calculator.
5. **SoapCalc integration** — import/export for data migration, not competition. Users don't lose their existing data.
6. **Curated recipe library** — verified formulations, not a wild west of unvalidated recipes.

## Constraints

- Must integrate with SoapCalc (import/export) for data migration
- Must be a self-paced SaaS (no cohort programs, no consulting, no white-label)
- Free tier must include lye calculator (compete with SoapCalc on utility)
- AI features require an LLM API (OpenRouter/Claude via OpenRouter) — used for explanation only, never for quantity generation
- Must be SEO-driven for organic acquisition (programmatic SEO for oil combinations, troubleshooting pages)
- Community seeding in r/soapmaking (81K members), SoapCalc community, Soapmaking Forum, Handcrafted Soap and Cosmetic Guild
- Budget: $0 software cost for MVP (self-hosted stack, AI API pay-per-use)
- No mobile app in v1 — web-first, responsive design, mobile-optimized
- AI never invents chemical quantities — the calculator is the authority

## Tech leanings (version-verified)

- **Web framework:** Next.js 16.2.10 (App Router, React 19) — verified current via npm registry
- **AI/LLM:** OpenRouter API (access to Claude, GPT, and other models via unified endpoint) — industry standard for multi-model access; used for explanation/assistance only
- **Database:** PostgreSQL (via Neon or Supabase for managed hosting) — relational model with first-class entities for ingredient, recipe versioning, batch, cure observation, cost record
- **Auth:** NextAuth.js (Auth.js) — current major version, supports credentials + OAuth
- **Styling:** Tailwind CSS 4.x + shadcn/ui — current versions, component library
- **AI integration:** `@ai-sdk/openrouter` or direct fetch to OpenRouter API — used for formulation assistance, not formulation generation
- **Hosting:** Vercel (free tier for MVP, scales with usage)
- **SEO:** Next.js built-in metadata API + programmatic routes for oil calculator pages and troubleshooting articles
- **CI:** GitHub Actions with `scan-generic.sh` (impeccable design quality gate)
- **No heavy deps** — reuse studio primitives (Hermes skills, Postiz for launch)

## Success metrics

- **Activation:** % of first-session users who complete a full recipe creation flow (start → save). Target: 60% month 1, 75% by month 3.
- **Retention:** D7 retention rate (users who return within 7 days of first session). Target: 40% month 1.
- **Revenue:** $200K ARR by end of Year 1 (500 Pro users at $99/yr + 50 Business users at $299/yr in v2).
- **SEO traffic:** 5,000 organic visits/month by month 6 (10+ programmatic SEO pages in v1, expanded in v2).
- **Community:** Curated recipe library with 50+ verified recipes by month 6. Public sharing and community features in v2.
- **Free-to-Pro conversion:** 3–5% (industry benchmark for SaaS with free tier).
- **Calculation accuracy:** > 95% match with SoapCalc for identical inputs.

## Risks

1. **Deterministic calculation errors** — if the SAP values or calculation logic is wrong, users lose trust immediately and safety is at stake. Mitigation: validate against SoapCalc for all common oil combinations. Write unit tests for every calculation scenario. Include prominent safety disclaimers.
2. **Low adoption of the 4-module MVP** — if users want AI formulation and community in v1, they may not adopt. Mitigation: position the deterministic engine as the differentiator ("precise, not magical"). Add AI assistance and community in v2 based on user feedback.
3. **SoapCalc competition** — SoapCalc is entrenched and free. Mitigation: don't compete on lye calculation (that's their lane), compete on the full workspace. Offer SoapCalc import/export as a bridge, not a replacement.

## In scope (v1)

- Recipe Builder (deterministic calculation engine + formulation assistance)
- Batch Log + Making Mode (guided production with structured logging)
- Cure Tracker (estimated windows + observation logging + user-decided completion)
- Cost Per Batch / Per Bar (lightweight cost catalogue + pricing)
- Recipe Library (curated + personal, browse, search, filter, save)
- Free tier (calculator, 3 recipes, 1 active batch, curated library)
- Pro tier ($12/month or $99/year — everything above)
- Pro trial (30 days or one complete batch cycle, no credit card)
- SoapCalc import/export (CSV)
- SEO content (10 pages in v1: calculators + guides + troubleshooting)
- App Life Spec with signature interaction, motion vocabulary, first-use guidance
- Impeccable design pass on every PR

## Out of scope (v1)

- Public community features (Q&A, forums, public sharing) — v2
- AI-generated "perfect" recipes — AI assists, never invents quantities
- Full inventory management — lightweight cost catalogue in v1, full inventory in v2
- AI Troubleshooter — v2
- Fragrance Engine (pairing suggestions) — v2
- Beginner's adaptive learning path — v2
- AI predictions (outcome prediction based on batch history) — v2
- Etsy/Shopify integration — v2
- Compliance reports (checklists and documentation only in v1, full reports in v2)
- Mobile app (v1 is web-only; mobile considered for v2)
- Multi-language support (v1 is English only)
- AI cure readiness declarations — estimated windows only

## Open questions

- Does SoapCalc have an API or only manual export/import? (verify via SoapCalc community)
- What is the current OpenRouter pricing for Claude/GPT models used in formulation assistance? (verify via OpenRouter API docs)
- What SAP values should be included in the default ingredient database? (start with top 20 oils by community usage)
- What is the acceptable AI formulation accuracy threshold before launch? (recommend: > 80% user satisfaction on first recipe)
- Preferred default persona voice: calm precision (not playful, not salesy) — confirm with Isaac
- What is the target first-user onboarding time? (recommend: < 3 minutes to first recipe)
- What is the exact free-tier limitation for recipes? (recommend: 3 recipes on free tier)
- What happens to Pro data after cancellation? (recommend: read-only access for 30 days, then data export)
- How does trial expiry affect existing batches and cure reminders? (recommend: cure reminders continue, new features gated)
