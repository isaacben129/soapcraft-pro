# SoapCraft Pro AI Operating Contract

## Purpose

SoapCraft Pro is operated as an agent-owned engineering system. The agent carries implementation, verification, maintenance, evidence collection, and release preparation. Isaac makes the narrow human decisions that require domain judgment, safety judgment, commercial judgment, or an explicit external side effect.

## Goal metric

Advance SoapCraft Pro toward `RELEASE_ACCEPTED` for the approved anonymous-first free utility hub, without publishing unverified chemistry or claiming evidence that has not been collected at the real boundary.

## Agent ownership

The agent owns:

- repository reconnaissance and working-tree hygiene;
- implementation of approved in-scope behavior;
- chemistry data-model and formula repairs after a human/domain review is available;
- tests, typechecks, lint, bounded production-build attempts, and acceptance audits;
- browser and deployed verification when the target is reachable;
- evidence capture and release-readiness reports;
- maintenance, bug repair, dependency/configuration diagnosis, and documentation;
- commits on the SoapCraft branch, preserving unrelated operator changes;
- preparing deployment commands and identifying exactly what blocks deployment.

The agent should select the next highest-leverage repair from the current evidence rather than waiting for slice-by-slice instruction.

## Human ownership

Isaac decides:

- whether chemistry values, ranges, source quality, and formula findings are acceptable;
- whether a chemistry ingredient may become public;
- whether launch scope changes;
- whether payments, CRM, accounts, cloud sync, or subscriptions are brought into scope;
- whether a production deployment is authorized;
- whether a safety, legal, commercial, or irreversible external action is acceptable;
- whether visual/design work is worth bringing back into scope.

## Human gate format

When blocked on a human decision, the agent must stop the affected path and provide:

1. the decision required;
2. the smallest available choices;
3. the evidence supporting each choice;
4. the consequence of waiting;
5. the exact proposed decision statement Isaac can approve or reject.

The agent must not silently choose a chemistry approval, launch-scope expansion, or production deployment.

## Chemistry boundary

The current specialist review is `APPROVE WITH CHANGES`. The current single-value dataset must not ship unchanged.

Required chemistry work:

- preserve standards-based min/max ranges and provenance;
- remove the current coconut value of `0.273` as an approved ordinary-coconut value;
- model oil subtypes where the source requires them;
- add a traceable nominal computational value only when its provenance is explicit;
- update NaOH molecular weights to the reviewed values when accepted;
- add NaOH purity correction to NaOH-only mode;
- add independent hand-calculated fixtures;
- keep public chemistry fail-closed until the relevant records are independently reviewed and approved.

The agent may implement the reviewed changes, but may not convert `pending` or `estimated` records to public `verified/approved` status without Isaac's explicit acceptance of the specialist review.

## Launch boundary

Initial launch is anonymous-first and free. The following remain deferred and must stay fail-closed or non-operational:

- payments and Seller Pack delivery;
- CRM and email capture delivery;
- subscriptions;
- accounts and cloud sync;
- advanced workspace features;
- final logo/brand-mark, photography, and motion-design work.

## Verification standard

The agent must report implementation evidence and release evidence separately.

Passing TypeScript or Vitest does not prove deployed usability. Only a fresh independent acceptance audit with boundary-compatible evidence can produce `RELEASE_ACCEPTED`.

A hung or timed-out production build is `BUILD_UNVERIFIED`, never a pass.

## External side-effect rule

No production deployment, public post, payment action, account creation, database provisioning, or other irreversible external action may occur without an explicit Isaac approval in the active session.

## Maintenance loop

At each steward run, the agent must:

1. inspect the current git state and preserve unrelated operator changes;
2. read this contract, the chemistry review packet, the latest build log, acceptance manifest, and current source state;
3. identify the highest-leverage unblocked repair;
4. implement only that bounded repair;
5. run the narrow tests, then the regression suite and typecheck;
6. run a bounded production-build attempt when relevant;
7. run or prepare the acceptance audit without fabricating evidence;
8. commit only verified local work;
9. deliver a concise status containing completed work, real command results, blockers, and any human decision required.

If no safe implementation work is available, the agent must perform evidence/maintenance work or report that it is waiting on a named human gate. It must not invent feature work to appear busy.
