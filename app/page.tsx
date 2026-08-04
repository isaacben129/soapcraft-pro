// ── Homepage Redesign ──────────────────
// R8.2: Approved proof-led design.
// Hero with real composite workflow proof, connected lifecycle artifact,
// calculation trust, plan vs actual example, featured plus latest blog,
// pricing/footer.
// No four-card feature section. No hero metric tiles. No emoji brand.
// No false persistent timer/reminder/catalogue/connection claims.
// Computed semantic fills verified.

import Link from "next/link";
import { ObjectHeader } from "@/components/shared/object-header";
import { StatusLabel } from "@/components/shared/status-label";
import { LedgerRow } from "@/components/shared/ledger-row";
import { AttentionRow } from "@/components/shared/attention-row";

// ── Proof-led hero ──

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <section className="text-center py-12 md:py-16" aria-label="Hero">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
              SoapCraft Pro
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Design soap recipes with confidence. Every calculation is
              traceable to its source. Every batch is tracked from pour to
              cure. No black boxes.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/recipes/new"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Start a Recipe
              </Link>
              <Link
                href="/batches/new"
                className="px-6 py-3 bg-sage text-sage-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Start a Batch
              </Link>
            </div>
          </section>

          {/* Composite workflow proof */}
          <section className="mt-12" aria-label="Workflow proof">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              From Recipe to Cure — One Flow
            </h2>

            <div className="space-y-6">
              {/* Step 1: Recipe */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    1. Design
                  </h3>
                  <StatusLabel status="active" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Build a recipe with identity, target mass, oil blend, lye
                  settings, and additives. The calculation runs server-side —
                  your totals are never trusted, always recomputed.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Plan vs Actual
                  </h4>
                  <div className="space-y-1">
                    <LedgerRow label="Lye NaOH" planned={134} actual={134} unit="g" />
                    <LedgerRow label="Lye KOH" planned={192} actual={192} unit="g" />
                    <LedgerRow label="Water" planned={335} actual={335} unit="g" />
                    <LedgerRow label="Total Weight" planned={1000} actual={1000} unit="g" />
                  </div>
                </div>
              </div>

              {/* Step 2: Batch */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    2. Make
                  </h3>
                  <StatusLabel status="pending" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Start a batch from a saved recipe version. The planned
                  measurement snapshot is locked — later recipe edits do not
                  alter the batch plan. Safety acknowledgement is required
                  before making begins.
                </p>
                <AttentionRow
                  title="Safety first"
                  description="Acknowledge safety guidelines before starting. The making checklist gates each step in order."
                  variant="info"
                />
              </div>

              {/* Step 3: Cure */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    3. Cure
                  </h3>
                  <StatusLabel status="active" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Log cure observations with structured fields. The dashboard
                  shows due and overdue batches. Mark a batch ready when cure
                  is complete.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Day 5 of 14</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-primary font-medium">Next observation: 2026-07-27</span>
                </div>
              </div>

              {/* Step 4: Yield */}
              <div className="p-6 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    4. Yield &amp; Cost
                  </h3>
                  <StatusLabel status="complete" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Record yield and cost data. The cost portfolio tracks batch
                  economics with inherited line items from the recipe version.
                  Missing cost basis is always visible — never hidden.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Cost Result
                  </h4>
                  <div className="space-y-1">
                    <LedgerRow label="Total Cost" planned={12.5} unit="$" />
                    <LedgerRow label="Cost per Bar" planned={1.25} unit="$" />
                    <LedgerRow label="Margin" planned={91.7} unit="%" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Calculation trust */}
          <section className="mt-12" aria-label="Calculation trust">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Calculation Trust
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Every calculation is deterministic and auditable. The SAP
              computation uses a single authoritative method with NaOH/KOH
              dual-lye support, water mode selection, and IFRA compliance
              checks. Client totals are ignored — the server always
              recomputes.
            </p>
            <div className="bg-card rounded-lg border p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Contract
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Single-method SAP calculation</li>
                <li>NaOH/KOH dual-lye support</li>
                <li>Water mode: one active mode</li>
                <li>Superfat and IFRA compliance</li>
                <li>Variance thresholds enforced</li>
                <li>Unknown/missing SAP blocks calculation</li>
              </ul>
            </div>
          </section>

          {/* Featured + latest blog */}
          <section className="mt-12" aria-label="Blog">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              From the Blog
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/blog/featured-soap-design"
                className="block p-4 rounded-lg border bg-card hover:shadow-elevation-1 transition-shadow"
              >
                <h3 className="font-semibold text-foreground">
                  Featured: Designing Soap with Intent
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  How to choose oils, lye concentrations, and water modes for
                  a deliberate soap formulation.
                </p>
              </Link>
              <Link
                href="/blog/latest-cure-tips"
                className="block p-4 rounded-lg border bg-card hover:shadow-elevation-1 transition-shadow"
              >
                <h3 className="font-semibold text-foreground">
                  Latest: Cure Observation Best Practices
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Structured observations that give you actionable data, not
                  just timestamps.
                </p>
              </Link>
            </div>
          </section>

          {/* Pricing/Footer */}
          <section className="mt-12 pt-8 border-t border-border" aria-label="Pricing and footer">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  SoapCraft Pro
                </h3>
                <p className="text-sm text-muted-foreground">
                  Build, track, and sell soap with confidence.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Pricing
                </Link>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Blog
                </Link>
                <Link
                  href="/recipes"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Recipes
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
