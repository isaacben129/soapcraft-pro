# SoapCraft Pro — Studio Forge Build Order (Revised)

> The complete build order for SoapCraft Pro, revised per PRD critique.
> MVP is 4 modules, not 12. AI is a formulation assistant, not a recipe generator.
> Lye calculation is deterministic and authoritative. Community is v2.
> This replaces the generic Studio Forge pipeline with a product-specific,
> UX-hardened build sequence.

---

## 0. UX Upgrade to Studio Forge (unchanged from v1)

The default Studio Forge pipeline gets a UX layer at every stage, not a polish
pass at the end. Three sources power the upgrade:

| Source | What It Adds | When It Kicks In |
|--------|-------------|------------------|
| **`app-life-and-style`** skill | App Life Spec, signature interaction design, motion language, onboarding flow, retention surfaces | S2 (DESIGN.md) — mandatory before any implementation |
| **`impeccable-design`** skill | Anti-generic pass, hard bans list | S5 (CI) — automated quality gate, plus manual pass before S7 merge |
| **`ui-ux-pro-max-skill`** repo | 84 UI styles, 192 product types, 192 color palettes, 74 font pairings, 99 UX guidelines, 161 reasoning rules | S1 (brief stage) — design intelligence at the brief stage |

**Skills to load:**
- `app-life-and-style` — load at S2, reference through S7
- `impeccable-design` — load at S5, reference through S7
- `plan` — load at S3 for bite-sized UX task decomposition
- `studio-app-implementation` — load at S4 for mockup-first UI workflow

**Repos (cloned at project start):**
- `github.com/nextlevelbuilder/ui-ux-pro-max-skill` → `references/ui-ux-pro-max-skill`
- `github.com/pbakaus/impeccable` → `/tmp/impeccable` (source for `scan-generic.sh`)

---

## 1. S0 — Reconnoiter (Week 0)

### Standard S0
- Check if SoapCraft Pro project exists on disk
- If yes, treat existing PRD as source of truth; build missing artifacts
- If no, proceed to S1

### UX Addition: UX Audit of Existing Work
- If a SoapCalc integration exists, audit its UX: what works, what's missing
- Identify the top 3 UX friction points in the existing soap-making tool landscape
- Document in `product/UX-AUDIT.md`

### Output
```
product/
  ├── PRD.md (or reference to existing)
  ├── DESIGN.md (or reference to existing)
  └── UX-AUDIT.md (NEW — UX friction audit of existing tools)
```

---

## 2. S1 — Reverse-Prompt (Week 1)

### Standard S1
- Expand the idea into `brief.md`: problem, users, outcomes, scope, non-goals, stack

### UX Addition: Load ui-ux-pro-max-skill Context
- Before writing the brief, query the ui-ux-pro-max-skill database for:
  - "SaaS product onboarding" — best practices for first-time user flows
  - "calculator UX" — patterns for math-heavy tools
  - "recipe interface" — patterns for structured input/output
- Record the top 3 relevant patterns in `brief.md` under `UX Patterns`

### brief.md Additions
```markdown
## UX Patterns (from ui-ux-pro-max-skill)
1. [Pattern name] — [source style] — [why it fits SoapCraft]
2. [Pattern name] — [source style] — [why it fits SoapCraft]
3. [Pattern name] — [source style] — [why it fits SoapCraft]

## Design Hypothesis
- Hypothesis: A deterministic formulation engine that shows exact calculations
  before the user mixes anything will reduce batch failures by 30%
- Metric to prove: % of users who complete a full recipe creation flow
  (start → save) in their first session
```

### Output
```
brief.md (expanded with UX patterns and design hypothesis)
```

---

## 3. S2 — PRD + Design (Weeks 1–2)

### Standard S2
- Write `product/PRD.md` (30 sections)
- Write `product/DESIGN.md`

### UX Addition: App Life Spec (MANDATORY — from app-life-and-style)

Before writing DESIGN.md, write the App Life Spec inside it. This is the
single most important UX document for the product.

```markdown
## App Life Spec

- **Core loop:** User opens SoapCraft Pro → builds a recipe with verified calculations → logs a batch with actual measurements → tracks cure with honest estimates → knows what each bar costs → refines the next recipe based on outcomes
- **Moment of truth:** The moment the Recipe Builder shows the calculated lye amount, water, and property ranges after the user sets their oil percentages. This is where the user decides "this tool is precise and trustworthy."
- **Goal metric:** First-session recipe completion rate (start → save). Target: 60% in month 1, 75% by month 3.
- **User constraint:** Never slow down the formulation flow. Every step must be faster than the user's current method (pen + paper + Google). Calculations must be instant (< 100ms).
- **Personality role:** Calm precision. The tool feels like a meticulous chemist's notebook — not a sales pitch, not a tutorial, not a magic trick.
- **Surface plan:**
  - In-app: Recipe Builder → Batch Log + Making Mode → Cure Tracker → Costing
  - Onboarding: 3-step quiz → first recipe → first batch log → first cure observation
  - Empty states: "Your first recipe is one oil selection away"
  - Error states: "Please fix the following: [specific validation errors]"
  - Retention cue: "Your last batch was 3 days ago — log an observation"
- **Accessibility budget:** Reduced motion supported, keyboard navigable, screen-reader labels on all inputs, minimum 16px body text, contrast ratio 4.5:1 minimum
```

### DESIGN.md Additions
- Include the App Life Spec above
- Include the signature interaction specification (from app-life-and-style §1):
  ```
  Trigger: User sets oil percentages and clicks Calculate
  Before: Input form with oil selection and sliders
  During: Deterministic engine calculates → result panel reveals with property ranges and warnings
  After: Lye amount, water amount, fragrance load, property ranges shown
  Feedback: Subtle checkmark animation on each calculated metric
  Metric: % of first-session users who save the recipe
  ```
- Include the motion vocabulary (from app-life-and-style §2):
  - Navigation: directional slide, 200ms ease-out
  - Submit/commit: control transforms into committed state, immediate visible result
  - Loading/resolution: instant for deterministic calc (< 100ms). For AI requests: honest progress with estimated time
  - Success: brief scale + opacity, proportionate to the action
  - Error: preserve user input, explain next action, offer undo
- Include the first-use guidance design (from app-life-and-style §3):
  - Onboarding: contextual action chips, not a tutorial
  - First screen: "Build better soap with verified calculations" — one CTA: "Get Started"
  - First recipe: pre-selected oils based on quiz answers
  - First batch: "Ready to make it? Start your first batch" — one CTA
  - First cure observation: "How's your soap looking after 3 days?" — quick observation log

### Output
```
product/PRD.md (30 sections, revised: 4-module MVP, deterministic engine, relational data model)
product/DESIGN.md (includes App Life Spec, signature interaction, motion vocabulary, first-use guidance, accessibility)
```

---

## 4. S3 — Plan (Weeks 2–3)

### Standard S3
- PRD → bite-sized TDD tickets on kanban board

### UX Addition: UX Task Tickets

Every module gets at least one UX task alongside its functional task.
UX tasks cover: onboarding flow, empty states, error states, loading states,
transitions, micro-interactions, accessibility.

### Build Order (Task Sequence)

```
WAVE 1 — Foundation (deterministic calculation engine first)
│
├── T1: Onboarding flow + experience assessment quiz
│   ├── UX: 3-step quiz with contextual chips (not a tutorial)
│   ├── TDD: quiz renders → user selects → state persists → next screen
│   └── App Life Spec reference: first-use guidance §3
│
├── T2: Ingredient database + SAP calculation engine
│   ├── UX: instant calculation results (< 100ms), validation warnings
│   ├── TDD: input oils + percentages → correct lye + water output → matches SoapCalc for same inputs
│   └── CRITICAL: This is the safety-critical foundation. Unit tests for every calculation scenario.
│
├── T3: Recipe Builder — core form + calculation display
│   ├── UX: oil selection with SAP values, property ranges shown, warnings panel
│   ├── TDD: select oils → set percentages → calculate → save → load saved recipe
│   └── App Life Spec reference: moment of truth
│
├── T4: Batch Log — input logging + Making Mode (guided, not hands-free)
│   ├── UX: form auto-populates from recipe, reduces typing; large tap targets; persistent timers
│   ├── TDD: create batch → log inputs → save → list batches
│   └── App Life Spec reference: preserve user input on error
│
WAVE 2 — Core product features
│
├── T5: Cure Tracker — estimated windows + observation logging
│   ├── UX: honest progress state (not fake completion), estimated window not declaration
│   ├── TDD: log cure date → track days → log pH/hardness → user marks complete
│   └── App Life Spec reference: loading/resolution — honest progress
│
├── T6: Costing — cost per batch + cost per bar
│   ├── UX: real-time cost update as inputs change, clear margin visualization
│   ├── TDD: input costs → calculate per-bar → show target price → save
│   └── App Life Spec reference: success feedback — proportionate
│
├── T7: Recipe Library — browse + search + filter + save
│   ├── UX: card layout with property ranges, tag filtering, curated + personal
│   ├── TDD: list recipes → filter → search → save → view details
│   └── App Life Spec reference: empty state handling
│
├── T8: Free tier (calculator + 3 recipes + 1 active batch)
│   ├── UX: clear upgrade prompt, never block core functionality
│   ├── TDD: free features work → upgrade CTA appears → paid features gated
│
WAVE 3 — Polish + launch
│
├── T9: Pro trial flow (30 days or one complete batch cycle)
│   ├── UX: no credit card required, progress preserved, clear end date
│   ├── TDD: start trial → use features → trial ends → upgrade prompt
│
├── T10: Impeccable design pass (run scan-generic.sh)
│   ├── Apply all hard bans from impeccable-design skill
│   ├── Fix: per-section eyebrows, identical card grids, glassmorphism,
│   │        image-hover zoom, gray-on-dark, side-stripe borders,
│   │        pure black, hero-metric template, soft 12px radius
│   └── Verify: scan-generic.sh passes, visual audit complete
│
├── T11: Accessibility audit
│   ├── Keyboard navigation, screen reader labels, reduced motion,
│   │   contrast ratios, touch targets, text scaling
│   └── App Life Spec reference: accessibility budget
│
├── T12: Onboarding flow polish (based on first-user feedback)
│   ├── Iterate on quiz, first recipe, first batch log flow
│   └── Measure: first-session recipe completion rate
│
└── T13: Launch checklist + monitoring
    ├── Post-launch instrumentation events (App Life Spec reference)
    ├── Error tracking, performance monitoring
    ├── SEO content (10 pages: calculators + guides + troubleshooting)
    └── Community seeding (r/soapmaking, SoapCalc, Soapmaking Forum)
```

### Output
```
tasks.json (kanban manifest with 13 tasks across 3 waves)
gh_ids.json (GitHub issue IDs for each task)
```

---

## 5. S4 — Parallel Build (Weeks 3–6)

### Build Order by Wave

**Wave 1 (Foundation):** T1, T2, T3, T4 — run in parallel
- T2 (SAP calculation engine) is the safety-critical foundation — prioritize it
- T1 (onboarding) is the first user-facing screen — prioritize it
- T3 (Recipe Builder) depends on T2 (calculation engine) — coordinate
- T4 (Batch Log + Making Mode) depends on T3 (Recipe Builder) — coordinate

**Wave 2 (Core features):** T5, T6, T7, T8 — run in parallel after Wave 1 merges
- Cure Tracker and Costing are independent
- Recipe Library depends on T3 (Recipe Builder) — wait for merge
- Free tier depends on T1 (onboarding) and T3 (Recipe Builder) — wait for merge

**Wave 3 (Polish + launch):** T9–T13 — sequential, after all previous waves merge
- Impeccable pass (T10) must run after all UI is in place
- Accessibility audit (T11) must run after all UI is in place
- Onboarding polish (T12) uses real user data from Wave 1-2
- SEO content can start in parallel (no code dependencies)

### UX Implementation Rules (from studio-app-implementation)

1. **Mockup-first for any UI/screen change.** Before writing code for a
   screen, generate a mockup, send to Isaac, get approval, then implement.
2. **Reuse existing components.** Do not introduce a parallel UI system.
   Use the app's own component library.
3. **Apply the App Life Spec at every implementation step.** Each task
   must reference the specific App Life Spec field it addresses.
4. **Apply the impeccable-design pass before merging.** Every PR must pass
   scan-generic.sh before it can be merged.
5. **Instrument the signature interaction.** Every task that touches the
   core loop must include an analytics event for the moment of truth.
6. **Deterministic calculations must be tested.** Every PR that touches
   the calculation engine must include unit tests that verify against
   known SoapCalc outputs.

### Output
```
13 PRs merged to main (all CI green, all scan-generic.sh passing)
```

---

## 6. S5 — Strict CI (Ongoing)

### Standard S5
- Lint + typecheck, tests + 80% coverage, build, gitleaks + semgrep,
  conventional-commit lint, 800-line PR cap, no force-push

### UX Addition: Design Quality Gates in CI
- `scan-generic.sh` (from impeccable-design skill) runs on every PR
  - Fails if any banned pattern detected (eyebrows, identical card grids,
    glassmorphism, image-hover zoom, gray-on-dark, side-stripe borders,
    pure black, hero-metric template, soft 12px radius)
- App Life Spec compliance check: every PR that touches UI must reference
  an App Life Spec field in the PR description
- Accessibility check: contrast ratios, touch targets, keyboard navigation
  verified on every PR that changes visible UI
- Calculation accuracy check: every PR that touches the SAP calculation
  engine must pass unit tests that verify against known SoapCalc outputs

### Output
```
CI pipeline: lint → typecheck → test (80% coverage) → build →
             gitleaks + semgrep → scan-generic.sh → conventional-commit lint →
             calculation accuracy tests
```

---

## 7. S6 — Review (Ongoing)

### Standard S6
- Refute-don't-approve; verify the test actually fails without the code

### UX Addition: UX Review Checklist
Every PR is reviewed against:
- [ ] App Life Spec field referenced and implemented correctly
- [ ] Signature interaction behavior preserved (no regression)
- [ ] Motion adds causality, not decoration
- [ ] Empty state handled (not just the happy path)
- [ ] Error state handled (not just success)
- [ ] Reduced motion respected
- [ ] Keyboard navigation works
- [ ] Screen reader labels present
- [ ] Contrast ratio 4.5:1 minimum
- [ ] scan-generic.sh passes
- [ ] No banned patterns from impeccable-design hard bans list
- [ ] Calculation accuracy verified (for PRs touching the engine)

### Output
```
PR reviews include UX checklist alongside functional review
```

---

## 8. S7 — Merge (Ongoing)

### Standard S7
- `gh pr merge --auto --squash` only when CI is green and review passed

### UX Addition: Merge Gate
- PR cannot merge unless:
  1. CI is green (standard)
  2. Review passed (standard)
  3. scan-generic.sh passes (UX gate)
  4. UX checklist is complete (UX gate)
  5. App Life Spec field documented (UX gate)
  6. Calculation accuracy tests pass (safety gate, for PRs touching the engine)

### Output
```
Merges require: green CI + approved review + UX pass + spec compliance + calculation accuracy
```

---

## 9. S8 — Ship (Week 6+)

### Standard S8
- Postiz MCP drafts/distributes launch content

### UX Addition: Post-Launch UX Instrumentation
- Track the App Life Spec goal metric: first-session recipe completion rate
- Track signature interaction: % of users who save a recipe after calculations are shown
- Track retention surfaces: which empty state prompts lead to action
- Track onboarding flow: drop-off at each step of the 3-step quiz
- Track error states: how often users hit errors, do they recover
- Track motion: are animations helping or hindering? (via user feedback)
- Track calculation accuracy: compare SoapCraft Pro outputs against SoapCalc for known inputs

### Launch Content (Postiz)
- Blog post: "The Soap Making Workspace That Gets the Math Right"
- SEO content: 10 pages across 4 pillars (calculators, guides, troubleshooting, ingredient pages)
- Community seeding: r/soapmaking, SoapCalc community, Soapmaking Forum, Handcrafted Soap and Cosmetic Guild
- Launch offer: Pro trial (30 days or one complete batch cycle, no credit card)

### Output
```
SoapCraft Pro launched (4-module MVP)
Pro trial active
SEO content live
Community seeding in progress
UX instrumentation tracking
```

---

## 10. Files Created/Updated

| File | Description |
|------|-------------|
| `/opt/data/studio/apps/soapcraft-pro/brief.md` | S1 output — revised: 4-module MVP, deterministic engine, AI as assistant |
| `/opt/data/studio/apps/soapcraft-pro/product/PRD.md` | S2 output — revised: 4 modules, relational data model, feature gates, fixed scope |
| `/opt/data/studio/apps/soapcraft-pro/product/DESIGN.md` | S2 output — revised: App Life Spec, signature interaction, motion vocabulary, first-use guidance |
| `/opt/data/ideas/soap-making-build-order.md` | Original build order (v1 — superseded by this revised version) |
| `/opt/data/ideas/soap-making-final-offer.md` | Original offer design (v1 — superseded by revised PRD) |
