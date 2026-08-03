# SoapCraft Pro — DESIGN.md (Revised)

> Design document for SoapCraft Pro. Includes the App Life Spec (mandatory per
> app-life-and-style skill), signature interaction specification, motion vocabulary,
> first-use guidance, icon/type system, and accessibility budget.
>
> **Revision notes:** Updated to reflect the 4-module MVP scope. AI is a
> formulation assistant, not a recipe generator. Deterministic calculation
> engine is the foundation. Making Mode is guided, not hands-free.

## App Life Spec

- **Core loop:** User opens SoapCraft Pro → builds a recipe with verified calculations → logs a batch with actual measurements → tracks cure with honest estimates → knows what each bar costs → refines the next recipe based on outcomes
- **Moment of truth:** The moment the Recipe Builder shows the calculated lye amount, water, and property ranges after the user sets their oil percentages. This is where the user decides "this tool is precise and trustworthy."
- **Goal metric:** First-session recipe completion rate (start → save). Target: 60% month 1, 75% by month 3.
- **User constraint:** Never slow down the formulation flow. Every step must be faster than the user's current method (pen + paper + Google). Calculations must be instant (< 100ms).
- **Personality role:** Calm precision. The tool feels like a meticulous chemist's notebook — not a sales pitch, not a tutorial, not a magic trick.
- **Surface plan:**
  - In-app: Recipe Builder → Batch Log + Making Mode → Cure Tracker → Costing
  - Onboarding: 3-step quiz → first recipe → first batch log → first cure observation
  - Empty states: "Your first recipe is one oil selection away"
  - Error states: "Please fix the following: [specific validation errors]"
  - Retention cue: "Your last batch was 3 days ago — log an observation"
- **Accessibility budget:** Reduced motion supported, keyboard navigable, screen-reader labels on all inputs, minimum 16px body text, contrast ratio 4.5:1 minimum

## Signature Interaction

```
Trigger: User sets oil percentages and clicks Calculate
Before: Input form with oil selection and sliders
During: Deterministic engine calculates → result panel reveals with property ranges and warnings
After: Lye amount, water amount, fragrance load, property ranges shown
Feedback: Subtle checkmark animation on each calculated metric
Metric: % of first-session users who save the recipe
```

## Motion Vocabulary

| Interaction | Purpose | Default behavior |
|---|---|---|
| Navigation | Preserve orientation | Directional slide matching information hierarchy; short and restrained (200ms ease-out) |
| Submit/commit | Confirm causality | Control transforms into committed state, with an immediate visible result |
| Loading/resolution | Make waiting intelligible | Instant for deterministic calc (< 100ms). For AI requests: honest progress with estimated time |
| Sheet/modal | Establish a temporary focus layer | Clear origin, deliberate entrance/exit, stable backdrop, accessible dismissal |
| Success/reward | Mark meaningful progress | Brief scale + opacity, proportionate to the action |
| Error/undo | Recover safely | Preserve user input, explain next action, offer undo when the change is reversible |

### Motion Requirements
- Use CSS transitions and React Spring for animations (prefer opacity and transform for performance)
- 150-300ms for small state transitions
- Respect reduced-motion settings (prefers-reduced-motion media query)
- Haptics not applicable (web app)
- Avoid animation that disguises latency — show real pending states

## First-Use Guidance

### Onboarding Flow
```
Promise shown → data/permission requested → first value delivered → repeat-use cue → optional personalization
```

Every onboarding screen needs a job. Remove screens that merely restate marketing.

1. **Welcome screen:** "Build better soap with verified calculations" — one CTA: "Get Started"
2. **Experience quiz:** "How experienced are you?" with contextual chips (not a tutorial): "I make soap every week" / "A few times a month" / "Just starting out"
3. **Goal setting:** "What's your main goal?" with chips: "Hobby" / "Sell at market" / "Sell online"
4. **Method preference:** "Which method?" with chips: "Cold Process" / "Hot Process" / "Melt & Pour"
5. **First recipe:** Recipe Builder with pre-selected oils based on quiz answers — "Here's a starting recipe based on your preferences"
6. **First batch:** "Ready to make it? Start your first batch" — one CTA
7. **First cure observation:** "How's your soap looking after 3 days?" — quick observation log

### Contextual Action Chips
- Use contextual action chips, examples, templates, or starter states when users must formulate a request
- Each suggestion must be: specific to the user's immediate context, executable in one tap, visibly subordinate to the primary input
- Avoid generic "Ask anything" or "Get started" text when the product can safely suggest the next meaningful action

## Icon and Type System

### Type Tokens
```
Display / screen title / section title / body / body emphasis / label / metadata / button
```

- **Display:** Playfair Display, 48-64px, weight 700, line-height 1.1
- **Screen title:** Playfair Display, 32-40px, weight 600, line-height 1.2
- **Section title:** Playfair Display, 24-28px, weight 600, line-height 1.3
- **Body:** DM Sans, 16px, weight 400, line-height 1.6
- **Body emphasis:** DM Sans, 16px, weight 500, line-height 1.6
- **Label:** DM Sans, 14px, weight 500, line-height 1.4
- **Metadata:** DM Sans, 12px, weight 400, line-height 1.4
- **Button:** DM Sans, 14-16px, weight 600, line-height 1.4

### Icon System
- **Family:** Lucide (open-source, consistent stroke weight)
- **Convention:** Outline for inactive, filled for active states
- **Size scale:** 16px (inline), 20px (default), 24px (nav), 32px (featured)
- **Color:** CurrentColor (inherits from parent text color)
- **Semantic mapping:**
  - Navigation: home, library, batches, cost, settings
  - Actions: plus, edit, save, delete, share, download
  - Status: check, alert, loading, error, success
  - Commerce: dollar, tag, chart

## Retention Surface Decisions

| Surface | Job | Tap destination | Refresh/privacy rule | Metric |
|---|---|---|---|---|
| Dashboard cure alert | Surface a changing, actionable state at a moment the app is closed | Deep-link to cure tracker | Never expose sensitive content on shared screens | Cure notification open rate → observation logged rate |
| Recipe recommendation | Keep the core action (building soap) top of mind | Deep-link to recipe | Never expose private batches | Recommendation click rate → recipe save rate |
| Batch reminder | Invite timely action (log observation) | Deep-link to batch | Consent-based, quiet hours respected | Reminder open rate → observation logged rate |

## Gamification and Rewards

- **Streaks:** Track consecutive days of batch logging. Reset after 7 days of inactivity. User-facing explanation: "You've been logging batches for X days straight!"
- **Recovery path:** "You haven't logged a batch in a while. Start a new one?" — never shame the user for missing days
- **Reward alignment:** Streaks support the user's real goal (consistent soap making practice), not manipulation
- **Metrics:** Batch logging frequency, D7/D30 retention, abandonment/complaint rate

## Concept-Demo Storyboard

1. **Starting problem:** "I want to make a hard bar with creamy lather and lavender scent, but I don't know what oils to use or how much lye"
2. **First input:** User opens SoapCraft Pro → Recipe Builder → selects oils and sets percentages
3. **Signature interaction:** System calculates → result panel reveals with property ranges and warnings → oil blend, lye amount, water amount, fragrance load shown
4. **Resulting value:** User sees exactly what to buy and how much to use — no guessing, no failed batches, no safety surprises
5. **Repeat-use cue:** "Save this recipe?" → "Start your first batch?" → "Track your cure?" → "See your costs?"

## Instrumentation Events

See PRD §15 for full event tracking list. Key events tied to App Life Spec:
- `onboarding_started`, `onboarding_complete`
- `recipe_builder_started`, `calculation_performed`, `recipe_saved`
- `batch_started`, `batch_input_logged`, `batch_outcome_logged`
- `making_mode_started`, `step_completed`, `timer_paused`, `timer_resumed`
- `cure_tracking_started`, `ph_logged`, `observation_added`, `cure_marked_complete`
- `cost_calculated`, `target_price_set`
- `library_viewed`, `recipe_searched`, `recipe_viewed`, `recipe_saved`, `recipe_rated`
- `dashboard_viewed`, `quick_action_clicked`

## Accessibility & Performance Acceptance Checks

- **Reduced motion:** All animations respect `prefers-reduced-motion` — fallback to instant state changes
- **Keyboard navigation:** All interactive elements reachable and operable via keyboard
- **Screen reader:** All inputs have associated labels, all images have alt text, all status updates are announced
- **Contrast:** Minimum 4.5:1 for body text, 3:1 for large text (WCAG 2.1 AA)
- **Touch targets:** Minimum 44x44px for interactive elements
- **Text scaling:** Layout works at 200% zoom without horizontal scrolling
- **Performance:** First Contentful Paint < 1.5s, Time to Interactive < 3s, CLS < 0.1

## Design Quality Gates (Impeccable Pass)

Before any PR merge that changes visible UI, verify:
- [ ] No per-section eyebrows (tiny uppercase tracked labels)
- [ ] No identical icon + heading + text card grids
- [ ] No glassmorphism (`backdrop-blur` on headers)
- [ ] No image-hover zoom (`group-hover:scale`)
- [ ] No gray text on colored/dark fills
- [ ] No side-stripe accent borders
- [ ] No pure black (#000) — use ink tone (#0D0D0D)
- [ ] No hero-metric template (big-number + small-label stat cards)
- [ ] No soft 12px radius everywhere — sharpen to 2-4px
- [ ] `scan-generic.sh` passes on every PR

## Design Tokens

```css
:root {
  /* Radius */
  --radius: 4px;

  /* Colors */
  --background: #FAFAF9;
  --foreground: #1C1917;
  --ink: #0D0D0D;
  --ink-foreground: #FAFAF9;
  --muted: #78716C;
  --muted-foreground: #FAFAF9;
  --accent: #D97706;
  --accent-foreground: #FAFAF9;
  --card: #FFFFFF;
  --card-foreground: #1A1A1A;
  --border: #D4CFC8;
  --input: #FFFFFF;

  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Animation */
  --transition-fast: 150ms ease-out;
  --transition-normal: 250ms ease-out;
  --transition-slow: 400ms ease-out;
}
```
