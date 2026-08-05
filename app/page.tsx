// ── Homepage ──────────────────
// Conversion-optimized editorial layout.
// Every section serves a conversion purpose:
// trust → value → proof → pricing → action.
// No filler. No generic feature cards. No emoji brand.
// DESIGN.md §4 visual system, §7 marketing spec.

import { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ArrowRight,
  Scale,
  Beaker,
  Calculator,
  BookOpen,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SoapCraft Pro — Recipe, Batch & Profitability Workspace",
  description:
    "Deterministic lye calculations, guided batch production, cure tracking, and cost-per-bar analysis for serious soap makers. Start free — no signup required.",
  openGraph: {
    title: "SoapCraft Pro — The Soap Maker's Workspace",
    description:
      "Verified calculations, batch tracking, and cost analysis. Start free with the calculator — no signup required.",
    type: "website",
    url: "https://soapcraft-pro.vercel.app",
    siteName: "SoapCraft Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoapCraft Pro — The Soap Maker's Workspace",
    description:
      "Deterministic lye calculations, guided batch production, cure tracking, and cost-per-bar analysis.",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://soapcraft-pro.vercel.app",
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* ── Hero ── */}
      <section className="container mx-auto px-4 py-20 md:py-28" aria-label="Hero">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Left: copy */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink leading-[1.05]">
              From formulation to finished bar, in one production record.
            </h1>
            <p className="mt-6 text-lg text-ink-muted max-w-xl leading-relaxed">
              Calculate a recipe, make the batch, record the cure, and know the
              real cost without rebuilding your work in four different tools.
              SoapCraft Pro is a deterministic workspace — not a calculator, not
              a spreadsheet, not a timer. One system for the entire batch
              lifecycle.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/recipes/new"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-action text-action-text rounded-md font-medium hover:bg-action-hover transition-colors text-sm"
              >
                Start a recipe
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/batches/new"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-rule bg-sheet text-ink rounded-md font-medium hover:bg-ledger transition-colors text-sm"
              >
                Start a batch
              </Link>
            </div>
            <p className="mt-5 text-meta text-ink-muted">
              Free tier includes the calculator, 3 recipes, and 1 active batch.
              No credit card required.
            </p>
          </div>

          {/* Right: proof artifact */}
          <div className="bg-sheet rounded-lg border border-rule p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-label text-ink-muted">Example</span>
              <span className="inline-flex items-center gap-1.5 text-label text-success">
                <Check className="h-3.5 w-3.5" />
                Live calculation
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-display font-semibold text-ink">
                  Recipe v3
                </span>
                <span className="text-meta text-ink-muted ml-2">
                  Cedar Bar — Cold Process
                </span>
              </div>
              <span className="text-label bg-clay text-ink px-2.5 py-1 rounded-full">
                Draft
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-rule">
              <div>
                <span className="text-meta text-ink-muted">Batch</span>
                <p className="font-mono text-sm text-ink mt-0.5">#024</p>
              </div>
              <div>
                <span className="text-meta text-ink-muted">Cure day</span>
                <p className="font-mono text-sm text-ink mt-0.5">18 / 42</p>
              </div>
              <div>
                <span className="text-meta text-ink-muted">Cost / bar</span>
                <p className="font-mono text-sm text-ink mt-0.5">$2.14</p>
              </div>
            </div>

            <div className="pt-3 border-t border-rule">
              <p className="text-label text-ink-muted mb-2.5">Plan vs Actual</p>
              <div className="space-y-2">
                {[
                  { label: "Olive oil", planned: "400.0 g", actual: "398.5 g" },
                  { label: "Coconut oil", planned: "250.0 g", actual: "251.2 g" },
                  { label: "Lye NaOH", planned: "134.0 g", actual: "134.0 g" },
                  { label: "Lye KOH", planned: "192.0 g", actual: "191.8 g" },
                  { label: "Water", planned: "335.0 g", actual: "336.1 g" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-ink">{row.label}</span>
                    <span className="font-mono text-ink-muted">
                      {row.planned} → {row.actual}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-rule flex justify-between text-sm">
              <span className="text-ink-muted">Total cost</span>
              <span className="font-mono font-medium text-ink">$12.50</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="bg-canvas py-20 md:py-28" aria-label="The problem">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Soap makers do not need another calculator.
          </h2>
          <p className="mt-5 text-body text-ink-muted max-w-2xl leading-relaxed">
            A serious cold-process batch requires a formulation, a production
            record, cure observations, and a cost analysis. Four different tools
            means four places where context gets lost. A lye calculator does not
            remember what oils you used last time. A spreadsheet does not tell
            you when a batch is due for observation. A notebook does not compute
            the SAP values.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-danger/10 flex items-center justify-center">
                <Scale className="h-5 w-5 text-danger" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink mb-1">
                  Fragmented data
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  When the recipe lives in one tool, the batch in another, and
                  the cost in a third, the connections between them are manual
                  and error-prone. A change to the formulation does not propagate
                  to the batch plan.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink mb-1">
                  Lost context
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Every batch carries decisions from the recipe version that
                  created it. When that context is not preserved, you cannot
                  compare planned versus actual, trace a quality issue back to
                  its source, or use prior results to improve the next version.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The System ── */}
      <section className="container mx-auto px-4 py-20 md:py-28" aria-label="The system">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            One system for the complete batch lifecycle.
          </h2>
          <p className="mt-5 text-body text-ink-muted max-w-2xl leading-relaxed">
            SoapCraft Pro connects every stage of production. A recipe version
            locks the formulation. A batch inherits that version and carries the
            plan forward. Making Mode records what actually happened. Cure
            observations feed the evidence record. Final yield and cost per bar
            complete the picture — and become the basis for the next recipe
            version.
          </p>

          <div className="mt-14 space-y-10">
            {/* Stage 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-md bg-action/10 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-action" />
              </div>
              <div>
                <span className="text-label text-action font-medium">
                  Stage 1 — Formulate
                </span>
                <h3 className="font-display text-xl font-bold text-ink mt-1">
                  Design with deterministic calculations
                </h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  Build a recipe with identity, target mass, oil blend, lye
                  settings, and additives. The SAP computation runs server-side
                  using a single authoritative method with NaOH/KOH dual-lye
                  support, water mode selection, and IFRA compliance checks.
                  Client totals are ignored — the server always recomputes.
                  Unknown or missing SAP values block the calculation with a
                  clear warning, never a silent guess.
                </p>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  Warnings are factual and specific: single oil above 80%, low
                  superfat, high fragrance load. Each warning explains the
                  consequence and leaves the decision to you.
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-md bg-action/10 flex items-center justify-center">
                <Beaker className="h-6 w-6 text-action" />
              </div>
              <div>
                <span className="text-label text-action font-medium">
                  Stage 2 — Produce
                </span>
                <h3 className="font-display text-xl font-bold text-ink mt-1">
                  Start a batch from a locked recipe version
                </h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  A batch is created from a specific recipe version — not the
                  current draft. The planned measurement snapshot is immutable.
                  Later recipe edits do not alter the batch plan. Safety
                  acknowledgement is required before making begins, and the
                  Making Mode checklist gates each step in order.
                </p>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  Actual measurements are recorded against the plan as you work.
                  The comparison is factual: what you weighed versus what the
                  recipe called for. Variance is shown with sign and unit, not
                  color alone.
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-md bg-action/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-action" />
              </div>
              <div>
                <span className="text-label text-action font-medium">
                  Stage 3 — Cure
                </span>
                <h3 className="font-display text-xl font-bold text-ink mt-1">
                  Record observations with structured fields
                </h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  Cure observations use structured fields — temperature, hardness,
                  visual notes — not free-form timestamps. The dashboard shows
                  due and overdue batches so nothing falls through the cracks.
                  Mark a batch ready when cure is complete. The system does not
                  auto-declare safety; that decision stays with you.
                </p>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-md bg-action/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-action" />
              </div>
              <div>
                <span className="text-label text-action font-medium">
                  Stage 4 — Analyze
                </span>
                <h3 className="font-display text-xl font-bold text-ink mt-1">
                  Finalize yield and cost per bar
                </h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                  Record final yield and ingredient costs. Cost per bar uses the
                  actual batch weight and inherited ingredient costs from the
                  recipe version. Missing cost basis is always visible — never
                  hidden. The cost portfolio tracks batch economics so you can
                  compare margins across recipes and batches over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Deterministic Calculation ── */}
      <section className="bg-canvas py-20 md:py-28" aria-label="Calculation trust">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Deterministic, auditable, and traceable.
          </h2>
          <p className="mt-5 text-body text-ink-muted max-w-2xl leading-relaxed">
            Every calculation in SoapCraft Pro uses a single authoritative SAP
            method. The dataset is versioned. The result is reproducible. There
            is no AI in the calculation path, no network call, and no silent
            fallback.
          </p>

          <div className="mt-10 bg-sheet rounded-lg border border-rule p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="h-5 w-5 text-success" />
              <span className="text-label font-medium text-ink">
                Calculation contract
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-ink-muted">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                Single-method SAP calculation from a versioned dataset
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                NaOH and KOH dual-lye support in one unified engine
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                One active water mode at a time; inactive modes cannot influence
                results
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                Superfat and IFRA compliance checks with specific thresholds
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                Variance thresholds enforced; unknown SAP blocks the calculation
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                All numeric boundaries validated before computation begins
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-ink-muted leading-relaxed">
            The calculation engine is the single source of truth. Client-side
            totals are for display only. The server always recomputes. This is
            not a design preference — it is the contract that makes every batch
            record trustworthy.
          </p>
        </div>
      </section>

      {/* ── Plan vs Actual Evidence ── */}
      <section className="container mx-auto px-4 py-20 md:py-28" aria-label="Evidence">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Plan vs actual — one coherent example.
          </h2>
          <p className="mt-5 text-body text-ink-muted max-w-2xl leading-relaxed">
            Every batch carries the planned snapshot from its recipe version.
            Actual measurements are entered during Making Mode. The comparison
            below is a complete worked example showing how the system tracks
            variance across a real cold-process batch.
          </p>

          <div className="mt-8 bg-sheet rounded-lg border border-rule overflow-hidden">
            <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b border-rule bg-ledger">
              <span className="text-label text-ink-muted">Ingredient</span>
              <span className="text-label text-ink-muted text-right">Planned</span>
              <span className="text-label text-ink-muted text-right">Actual</span>
            </div>
            <div className="divide-y divide-rule">
              {[
                {
                  label: "Olive oil (70%)",
                  planned: "400.0 g",
                  actual: "398.5 g",
                  variance: "-0.4%",
                  negative: true,
                },
                {
                  label: "Coconut oil (20%)",
                  planned: "250.0 g",
                  actual: "251.2 g",
                  variance: "+0.5%",
                  negative: false,
                },
                {
                  label: "Palm oil (10%)",
                  planned: "200.0 g",
                  actual: "199.8 g",
                  variance: "-0.1%",
                  negative: true,
                },
                {
                  label: "Lye NaOH",
                  planned: "134.0 g",
                  actual: "134.0 g",
                  variance: "0.0%",
                  negative: false,
                },
                {
                  label: "Lye KOH",
                  planned: "192.0 g",
                  actual: "191.8 g",
                  variance: "-0.1%",
                  negative: true,
                },
                {
                  label: "Water",
                  planned: "335.0 g",
                  actual: "336.1 g",
                  variance: "+0.3%",
                  negative: false,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-3 gap-4 px-6 py-3 text-sm"
                >
                  <span className="text-ink">{row.label}</span>
                  <span className="font-mono text-ink-muted text-right">
                    {row.planned}
                  </span>
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-mono text-ink">{row.actual}</span>
                    <span
                      className={`text-xs font-medium ${
                        row.negative ? "text-danger" : "text-success"
                      }`}
                    >
                      {row.variance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-rule bg-ledger flex justify-between text-sm">
              <span className="text-ink-muted">Total cost</span>
              <span className="font-mono font-medium text-ink">$12.50</span>
            </div>
            <div className="px-6 pb-4 border-t border-rule bg-ledger flex justify-between text-sm">
              <span className="text-ink-muted">Cost per bar (10 bars)</span>
              <span className="font-mono font-medium text-ink">$1.25</span>
            </div>
          </div>

          <p className="mt-5 text-meta text-ink-muted">
            * Example record — synthetic data, clearly labelled until real
            consented data exists. All values are deterministic and reproducible
            from the recipe version.
          </p>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="bg-canvas py-20 md:py-28" aria-label="What is included">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            What SoapCraft Pro includes.
          </h2>
          <p className="mt-5 text-body text-ink-muted max-w-2xl leading-relaxed">
            The Free tier gives you the calculator and a starting point. Pro
            adds the full production workspace. No feature is hidden behind a
            paywall that you need before you can evaluate the product.
          </p>

          <div className="mt-12 space-y-8">
            {/* Free tier */}
            <div className="border border-rule rounded-lg p-6 bg-sheet">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-xl font-bold text-ink">
                  Free
                </h3>
                <span className="text-label font-medium text-ink-muted">
                  $0 / month
                </span>
              </div>
              <p className="text-sm text-ink-muted mb-5">
                Everything you need to evaluate the product and start building
                recipes.
              </p>
              <ul className="space-y-3 text-sm text-ink">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Lye calculator (NaOH + KOH)
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  3 recipes with version history
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  1 active batch per recipe
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Curated recipe library with verified formulations
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  SAP calculations from versioned dataset
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Property ranges and IFRA compliance checks
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Deterministic calculation engine
                </li>
              </ul>
            </div>

            {/* Pro tier */}
            <div className="border-2 border-action rounded-lg p-6 bg-sheet relative">
              <div className="absolute -top-3 left-6 bg-action text-action-text text-label font-medium px-3 py-1 rounded-full">
                Pro
              </div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-xl font-bold text-ink">
                  Pro
                </h3>
                <div>
                  <span className="text-4xl font-bold text-ink">$12</span>
                  <span className="text-sm text-ink-muted">/month</span>
                </div>
              </div>
              <p className="text-sm text-ink-muted mb-5">
                The full production workspace for serious soap makers.
              </p>
              <ul className="space-y-3 text-sm text-ink mb-6">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Everything in Free
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Unlimited recipes and versions
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Unlimited active batches
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Cure Tracker with structured observations
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Cost per batch and cost per bar
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Target margin pricing
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Mold volume calculator
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Making Mode — guided cold-process production
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Template recipes with pre-verified formulations
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  Priority support
                </li>
              </ul>
              <Link
                href="/api/subscription/upgrade"
                className="block text-center rounded-md px-6 py-3 bg-action text-action-text font-medium hover:bg-action-hover transition-colors text-sm"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="container mx-auto px-4 py-20 md:py-28" aria-label="FAQ">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Common questions.
          </h2>

          <div className="mt-10 space-y-6">
            <div className="border-b border-rule pb-6">
              <h3 className="font-display text-lg font-bold text-ink">
                Is SoapCraft Pro a lye calculator?
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                It includes a lye calculator, but that is only one part of the
                system. The calculator is the entry point. The batch record, cure
                observations, yield, and cost analysis are what make SoapCraft Pro
                a production workspace, not a standalone tool.
              </p>
            </div>

            <div className="border-b border-rule pb-6">
              <h3 className="font-display text-lg font-bold text-ink">
                How is the calculation different from SoapCalc?
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                SoapCraft Pro uses the same SAP dataset and calculation method as
                SoapCalc. The difference is in the system around it: recipe
                versioning, batch inheritance, cure tracking, and cost analysis.
                The calculation is the same; the record is connected.
              </p>
            </div>

            <div className="border-b border-rule pb-6">
              <h3 className="font-display text-lg font-bold text-ink">
                Does SoapCraft Pro use AI?
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Not in the calculation path. The SAP computation is deterministic
                and fully auditable. AI may be used in future features for
                explanation and suggestion, but it will never invent chemical
                quantities or silently modify a formulation.
              </p>
            </div>

            <div className="border-b border-rule pb-6">
              <h3 className="font-display text-lg font-bold text-ink">
                What happens to my data?
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Your data is private and owned by you. There is no analytics
                tracking on batch content, no data sharing, and no AI training on
                your formulations. The database is scoped to your user account and
                your account only.
              </p>
            </div>

            <div className="border-b border-rule pb-6">
              <h3 className="font-display text-lg font-bold text-ink">
                Can I cancel anytime?
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Yes. Pro subscriptions can be cancelled at any time. You retain
                access to all Pro features until the current billing period ends.
                No cancellation fees, no data deletion, no lock-in.
              </p>
            </div>

            <div className="pb-6">
              <h3 className="font-display text-lg font-bold text-ink">
                Is there a free trial?
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                The Free tier is always available and includes the full calculator
                with 3 recipes and 1 active batch. You can evaluate the product
                without any commitment. Upgrade to Pro when you need unlimited
                recipes, batches, and the full production workspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-canvas py-20 md:py-28" aria-label="Final CTA">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Start your first production record.
          </h2>
          <p className="mt-5 text-body text-ink-muted leading-relaxed">
            Build a recipe, run the calculation, start a batch, and track it
            through cure to cost. One system. One record. No rebuilding.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/recipes/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-action text-action-text rounded-md font-medium hover:bg-action-hover transition-colors text-sm"
            >
              Start a recipe
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/marketing/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 border border-rule bg-sheet text-ink rounded-md font-medium hover:bg-ledger transition-colors text-sm"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="container mx-auto px-4 py-20 md:py-28" aria-label="Resources">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Resources for serious soap makers.
          </h2>
          <p className="mt-5 text-body text-ink-muted max-w-2xl leading-relaxed">
            Free tools and guides that help you calculate, formulate, track,
            and price your soap — whether you use SoapCraft Pro or not.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <a
              href="/calculators/soap-cost-calculator"
              className="block border border-rule rounded-lg p-6 bg-sheet hover:shadow-elevation-1 transition-shadow"
            >
              <h3 className="font-display text-lg font-bold text-ink">
                Soap Cost Per Bar Calculator
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Calculate the real cost per bar from ingredient costs and
                actual yield. Set a target margin and get a suggested selling
                price.
              </p>
            </a>
            <a
              href="/compare/soapcalc-alternative"
              className="block border border-rule rounded-lg p-6 bg-sheet hover:shadow-elevation-1 transition-shadow"
            >
              <h3 className="font-display text-lg font-bold text-ink">
                SoapCalc Alternative
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                SoapCalc handles lye math. SoapCraft Pro adds versioned
                recipes, tracked batches, cure monitoring, and cost analysis.
              </p>
            </a>
            <a
              href="/soap-recipe-management-software"
              className="block border border-rule rounded-lg p-6 bg-sheet hover:shadow-elevation-1 transition-shadow"
            >
              <h3 className="font-display text-lg font-bold text-ink">
                Soap Recipe Management Software
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                Versioned recipes that never rewrite historical batch records.
                Track formulations, not just formulas.
              </p>
            </a>
            <a
              href="/soap-batch-tracking-software"
              className="block border border-rule rounded-lg p-6 bg-sheet hover:shadow-elevation-1 transition-shadow"
            >
              <h3 className="font-display text-lg font-bold text-ink">
                Soap Batch Tracking Software
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                From recipe to finished bar — planned vs actual measurements,
                cure observations, yield, and cost in one record.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-rule py-14" aria-label="Footer">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h3 className="font-display text-lg font-bold text-ink">
                SoapCraft Pro
              </h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed max-w-md">
                Deterministic calculations, not AI guesswork. The soap maker
                workspace for recipe, batch, and profitability.
              </p>
            </div>
            <div>
              <h4 className="text-label font-semibold text-ink mb-4">
                Product
              </h4>
              <ul className="space-y-2.5 text-sm text-ink-muted">
                <li>
                  <a href="/" className="hover:text-ink transition-colors">
                    Homepage
                  </a>
                </li>
                <li>
                  <a href="/marketing/pricing" className="hover:text-ink transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/marketing/blog" className="hover:text-ink transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/calculators/soap-cost-calculator" className="hover:text-ink transition-colors">
                    Cost Calculator
                  </a>
                </li>
                <li>
                  <a href="/compare/soapcalc-alternative" className="hover:text-ink transition-colors">
                    SoapCalc Alternative
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-label font-semibold text-ink mb-4">
                Account
              </h4>
              <ul className="space-y-2.5 text-sm text-ink-muted">
                <li>
                  <a href="/auth/login" className="hover:text-ink transition-colors">
                    Log in
                  </a>
                </li>
                <li>
                  <a href="/auth/signup" className="hover:text-ink transition-colors">
                    Sign up
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-rule pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-meta text-ink-muted">
              &copy; {new Date().getFullYear()} SoapCraft Pro. All rights reserved.
            </p>
            <p className="text-meta text-ink-muted">
              Deterministic calculations, not AI guesswork.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}