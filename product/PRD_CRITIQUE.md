# SoapCraft Pro Rescue PRD Critique

**Reviewed baseline:** `ed27e22`
**Reviewed artifacts:** PRD v3, DESIGN v3, code audit, product flow, rescue build order, product brief
**Method:** Independent adversarial review against current code and cross-document consistency.

## Verdict

The rescue plan now addresses the actual product failure: SoapCraft Pro is coded as disconnected tools and demos rather than one owned recipe-to-batch lifecycle. The revised dashboard, homepage, blog, data, route, and UX requirements are specific enough to replace that model.

The plan is suitable for ticket-by-ticket implementation by a cheaper model **only if the stop gates are followed**. It is not permission for a model to improvise chemistry policy, data migration, pricing, template validity, or legal retention.

## Blockers found and resolved

### 1. Coding model could invent safety-critical thresholds

**Risk:** The first draft required “domain-reviewed” limits but did not stop implementation until approval.

**Resolution:** PRD §8 and build ticket R1.1 now require a named human/domain approver and a version-controlled contract/source manifest before calculation work proceeds. This includes supported alkalis/modes, boundaries, dual-lye semantics, purity, and planned-vs-actual variance behavior.

**Remaining human decision:** Approve the actual values and sources. They are intentionally not invented in planning.

### 2. Migration ticket could destroy or mis-own production data

**Risk:** Current relationships can cascade-delete historical batches, and current ownership fields do not map cleanly to authenticated users.

**Resolution:** R1.3 now mandates inventory, verified backup, field mapping, additive nullable migration, backfill verification, orphan quarantine, pre/post lineage comparison, and recovery planning. Drop/recreate and delete-to-pass approaches are forbidden.

### 3. Measurement truth could be duplicated

**Risk:** The code already uses broad JSON blobs. The first rescue draft named both Batch actuals and Making Session actuals without declaring one owner.

**Resolution:** Batch now owns normalized actual measurement line items. Making Session owns workflow state and references those measurement IDs. Historical recipe and calculator snapshots are explicitly versioned. Batch cost lines preserve cost-basis references.

## High findings found and resolved

### Undefined homepage category routes

Resolved to canonical blog filters:

```text
/blog?category=calculations
/blog?category=recipes
/blog?category=guides
/blog?category=troubleshooting
```

`View all articles` resolves to `/blog`. No Business category ships without content.

### Template contradiction

Templates are conditional. If no product/domain-approved launch templates with provenance exist, all template controls are omitted and recipe creation starts blank.

### Ambiguous batch events

The flow now distinguishes:

```text
Create → draft + batch_created
Confirm plan → ready_to_make + batch_ready_to_make
Start Making Mode → making + batch_started
```

Analytics uses the same event boundaries.

### Dashboard sequencing contradiction

Wave 4 now includes a minimal active-pipeline dashboard slice when batch persistence ships. Wave 7 adds full attention derivation, cure/cost enrichment, recipe outcomes, and activity. A batch no longer has to be “dashboard visible” before any dashboard query exists.

### Pricing before policy

Homepage pricing content is blocked on product decision R9.2. Before approval, the homepage may show only a neutral link to `/pricing`; it may not preserve or invent prices, tiers, trials, or limits.

### Cure language implying safety

`Healthy` and `ready candidate` were removed. The factual grouping is:

- overdue observation
- due observation
- curing
- estimated window reached
- completed

Required copy:

> Estimated window reached — review observations; only you can mark ready.

### Static blog fallback ambiguity

Repository content is validated at build time. Malformed content blocks the build. Zero valid posts produces a bounded editorial empty state. A remote-CMS availability fallback is not implied.

### Cure photo scope

Photos are deferred. They require a separate object-storage, authorization, file-validation, retention, export, and deletion contract.

### Stale audit claims

The audit is pinned to `ed27e22`. The stale `useEffect` import claim and old “PRD requires a trial” wording were corrected.

## Medium findings found and resolved

### Status vocabularies

DESIGN now separates:

- batch lifecycle
- calculation validation severity
- persistence status
- attention reason
- subscription state

They are not forced into one enum.

### Dashboard failed-save source

Dashboard no longer assumes transient client save failures are queryable. Save recovery remains local to the affected editor unless a durable outbox/failure model is designed later.

### Concurrent edit behavior

MVP uses optimistic revision checks. On conflict, preserve the local draft and offer reload or copy-to-new-edit. No automatic merge is implied.

### Global search

Deferred from rescue MVP rather than rendering a nonfunctional command-bar control.

### Canonical legal/reset routes

Canonical legal and reset-completion routes are now named in the PRD. Account deletion is blocked on product/legal retention, anonymization, billing, and recovery decisions.

### Synthetic homepage proof

The required proof is a real rendering of production application components using production-shaped synthetic data clearly labelled **Example**. It must not appear to be customer activity.

### Idempotency

The PRD now defines user + operation + mutation UUID scope, uniqueness, payload-hash conflict, exact replay behavior, and provider event IDs for webhook idempotency.

## Complaint-specific review

### Dashboard

The current dashboard is five hard-coded tool cards. The rescue plan explicitly replaces it with:

1. Needs attention rows
2. Active production pipeline
3. Recent recipes and outcomes
4. Activity ledger
5. One New command

Each row requires object lineage, factual status/evidence, and one next action. Empty/loading/partial-error/mobile behavior is specified. This directly answers the complaint rather than restyling the card grid.

### Homepage

The current page uses equal feature cards, emoji, unsupported capability claims, and no editorial module. The rescue plan requires connected production proof, calculation provenance, plan-vs-actual evidence, integrated article content, valid imagery, semantic theme verification, and claim truth checks.

### Blog

The current blog filter does not filter, public links use the wrong path family, image fields are not rendered, and article rendering is simplistic. R8.1 now owns canonical routes, functional query-state filtering, semantic article rendering, images/alt text, related articles, and structured data.

## Remaining explicit decisions

These are not plan defects; they are stop gates:

1. Authoritative ingredient/SAP/property sources and named reviewer
2. First-release alkalis, methods, water modes, purity behavior, numeric boundaries, and variance policy
3. Free/trial/paid policy and server-enforced limits
4. Rescue cost scope for labor, packaging, and overhead
5. Default cure observation cadence
6. Whether verified templates ship and who approves them
7. Owned homepage/blog image assets
8. Account-deletion/retention/anonymization policy

## Final implementation warning

A cheaper model should receive one build-order ticket at a time plus the linked PRD/DESIGN/flow sections. It should not be asked to “implement the PRD” in one run. The rescue depends on disciplined seams and verification gates; broad parallel generation would recreate the same amalgamation problem.
