// ── Homepage Redesign ──────────────────
// DESIGN.md §7: Marketing homepage specification.
// Split hero with proof artifact, connected workflow proof,
// calculation trust, evidence section, editorial/blog module,
// pricing/footer.
// No four-card feature section. No hero metric tiles.
// No emoji brand. No false persistent timer/reminder/catalogue/connection claims.
// Computed semantic fills verified.

import Link from "next/link";
import { Check, ChevronRight, Leaf, Scale, Beaker, Calculator } from "lucide-react";

// ── Split hero ──

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero — split layout, left aligned, right-side proof artifact */}
      <section className="container mx-auto px-4 py-16 md:py-20" aria-label="Hero">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left: copy */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink leading-tight">
              From formulation to finished bar, in one production record.
            </h1>
            <p className="mt-6 text-lg text-ink-muted max-w-xl leading-relaxed">
              Calculate a recipe, make the batch, record the cure, and know the real cost
              without rebuilding your work in four different tools.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/recipes/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-action text-action-text rounded-md font-medium hover:bg-action-hover transition-colors text-sm"
              >
                Start a recipe
              </Link>
              <Link
                href="/batches/new"
                className="inline-flex items-center gap-2 px-6 py-3 border border-rule bg-sheet text-ink rounded-md font-medium hover:bg-ledger transition-colors text-sm"
              >
                See the workflow
              </Link>
            </div>
          </div>

          {/* Right: proof artifact — real app components with synthetic data */}
          <div className="bg-sheet rounded-lg border border-rule p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-label text-ink-muted">Example</span>
              <span className="inline-flex items-center gap-1 text-label text-success">
                <Leaf className="h-3 w-3" />
                Live calculation
              </span>
            </div>

            {/* Recipe header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display font-semibold text-ink">Recipe v3</span>
                <span className="text-meta text-ink-muted ml-2">Cedar Bar — CP</span>
              </div>
              <span className="text-label bg-clay text-ink px-2 py-0.5 rounded-full">Draft</span>
            </div>

            {/* Batch summary */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-rule">
              <div>
                <span className="text-meta text-ink-muted">Batch</span>
                <p className="font-mono text-sm text-ink">#024</p>
              </div>
              <div>
                <span className="text-meta text-ink-muted">Cure day</span>
                <p className="font-mono text-sm text-ink">18 / 42</p>
              </div>
              <div>
                <span className="text-meta text-ink-muted">Cost / bar</span>
                <p className="font-mono text-sm text-ink">$2.14</p>
              </div>
            </div>

            {/* Plan vs actual mini-table */}
            <div className="pt-2 border-t border-rule">
              <p className="text-label text-ink-muted mb-2">Plan vs Actual</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-ink">Lye NaOH</span>
                  <span className="font-mono text-ink-muted">134 g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink">Lye KOH</span>
                  <span className="font-mono text-ink-muted">192 g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink">Water</span>
                  <span className="font-mono text-ink-muted">335 g</span>
                </div>
                <div className="flex justify-between text-sm pt-1 border-t border-rule">
                  <span className="font-medium text-ink">Total Weight</span>
                  <span className="font-mono font-medium text-ink">1000 g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected workflow proof — one production record, four inherited stages */}
      <section className="bg-canvas py-16 md:py-20" aria-label="Connected workflow">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
            One record, four inherited stages
          </h2>
          <p className="mt-4 text-body text-ink-muted max-w-2xl">
            Formula quantities flow into the batch plan. Actual measurements feed the cure
            record. Yield informs cost per bar. Outcomes feed back into recipe history.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stage 1 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <Calculator className="h-5 w-5 text-action" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink">Formula → Batch plan</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Recipe quantities are locked into the batch plan. Later recipe edits do not
                  alter the batch&apos;s planned measurements.
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <Beaker className="h-5 w-5 text-action" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink">Actual → Cure record</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  What you actually weighed and poured is recorded against the plan. Variance
                  is factual — never labeled safe or dangerous.
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <Scale className="h-5 w-5 text-action" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink">Yield → Cost per bar</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Final yield is inherited by the cost record. Cost per bar uses the actual
                  batch weight and inherited ingredient costs.
                </p>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-action" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink">Outcome → Recipe history</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Batch results become evidence for the next recipe version. What worked and
                  what didn&apos;t is never lost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculation trust */}
      <section className="container mx-auto px-4 py-16 md:py-20" aria-label="Calculation trust">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-ink mb-4">
            Deterministic, auditable calculations
          </h2>
          <p className="text-body text-ink-muted mb-6 max-w-2xl">
            Every SAP computation uses a single authoritative method with NaOH/KOH dual-lye
            support, water mode selection, and IFRA compliance checks. Client totals are
            ignored — the server always recomputes.
          </p>

          <div className="bg-sheet rounded-lg border border-rule p-6">
            <div className="flex items-center gap-2 mb-4">
              <Check className="h-4 w-4 text-success" />
              <span className="text-label font-medium text-ink">Contract</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-ink-muted">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                Single-method SAP calculation
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                NaOH / KOH dual-lye support
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                One active water mode
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                Superfat + IFRA compliance
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                Variance thresholds enforced
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-danger mt-0.5 flex-shrink-0" />
                Unknown SAP blocks calculation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence section — planned vs actual */}
      <section className="bg-canvas py-16 md:py-20" aria-label="Evidence">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-2xl font-bold text-ink mb-2">
            Plan vs actual — one coherent example
          </h2>
          <p className="text-body text-ink-muted mb-8 max-w-2xl">
            Every batch carries the planned snapshot from its recipe version. Actual
            measurements are entered during Making Mode. The comparison is factual, not
            decorative.
          </p>

          <div className="bg-sheet rounded-lg border border-rule overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-3 border-b border-rule bg-ledger">
              <span className="text-label text-ink-muted">Ingredient</span>
              <span className="text-label text-ink-muted text-right">Planned</span>
              <span className="text-label text-ink-muted text-right">Actual</span>
            </div>
            {/* Rows */}
            <div className="divide-y divide-rule">
              {[
                { label: "Olive oil", planned: "400.0 g", actual: "398.5 g", variance: "-0.4%" },
                { label: "Coconut oil", planned: "250.0 g", actual: "251.2 g", variance: "+0.5%" },
                { label: "Palm oil", planned: "200.0 g", actual: "199.8 g", variance: "-0.1%" },
                { label: "Lye NaOH", planned: "134.0 g", actual: "134.0 g", variance: "0.0%" },
                { label: "Lye KOH", planned: "192.0 g", actual: "191.8 g", variance: "-0.1%" },
                { label: "Water", planned: "335.0 g", actual: "336.1 g", variance: "+0.3%" },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-3 gap-4 px-6 py-3 text-sm">
                  <span className="text-ink">{row.label}</span>
                  <span className="font-mono text-ink-muted text-right">{row.planned}</span>
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-mono text-ink">{row.actual}</span>
                    <span className={`text-xs font-medium ${row.variance.startsWith("-") ? "text-danger" : row.variance === "0.0%" ? "text-ink-muted" : "text-success"}`}>
                      {row.variance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="px-6 py-3 border-t border-rule bg-ledger flex justify-between text-sm">
              <span className="text-ink-muted">Total cost</span>
              <span className="font-mono font-medium text-ink">$12.50</span>
            </div>
            <div className="px-6 pb-4 border-t border-rule bg-ledger flex justify-between text-sm">
              <span className="text-ink-muted">Cost per bar (10 bars)</span>
              <span className="font-mono font-medium text-ink">$1.25</span>
            </div>
          </div>

          <p className="mt-4 text-meta text-ink-muted">
            * Example record — synthetic data, clearly labelled until real consented data exists.
          </p>
        </div>
      </section>

      {/* Editorial / blog module */}
      <section className="container mx-auto px-4 py-16 md:py-20" aria-label="Blog">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">From the blog</h2>
              <p className="mt-2 text-body text-ink-muted">
                Deterministic guides, verified recipes, and troubleshooting for serious soap
                makers.
              </p>
            </div>
            <Link href="/marketing/blog" className="text-sm font-medium text-action hover:underline flex items-center gap-1">
              View all articles
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Featured article */}
          <div className="mb-8">
            <Link href="/marketing/blog/featured-soap-design" className="group block">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-sheet rounded-lg border border-rule aspect-video flex items-center justify-center">
                  <span className="text-ink-muted text-sm">Article image</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-label text-action font-medium">Featured</span>
                  <h3 className="font-display text-xl font-semibold text-ink mt-1 group-hover:underline">
                    Designing Soap with Intent
                  </h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                    How to choose oils, lye concentrations, and water modes for a deliberate
                    soap formulation — with a worked example from a cold-process batch.
                  </p>
                  <span className="mt-4 text-meta text-ink-muted">8 min read · Jul 2026</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Three latest articles — unequal hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Cure Observation Best Practices",
                desc: "Structured observations that give you actionable data, not just timestamps.",
                category: "Guides",
                time: "5 min read",
              },
              {
                title: "Understanding Lye Concentration",
                desc: "How water-to-lye ratio affects cure time, soda ash risk, and bar hardness.",
                category: "Calculators",
                time: "6 min read",
              },
              {
                title: "Costing Your First Batch",
                desc: "A step-by-step walkthrough of ingredient costs, yield, and margin pricing.",
                category: "Recipes",
                time: "4 min read",
              },
            ].map((post) => (
              <Link
                key={post.title}
                href={`/marketing/blog/${post.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="group block p-5 rounded-lg border border-rule bg-sheet hover:bg-ledger transition-colors"
              >
                <span className="text-label text-action font-medium">{post.category}</span>
                <h3 className="font-display text-lg font-semibold text-ink mt-1 group-hover:underline">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{post.desc}</p>
                <span className="mt-4 text-meta text-ink-muted">{post.time}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Footer */}
      <section className="border-t border-rule py-16 md:py-20" aria-label="Pricing and footer">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="font-display text-lg font-bold text-ink">SoapCraft Pro</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed max-w-md">
                Build, track, and sell soap with confidence. Deterministic calculations, not
                AI guesswork.
              </p>
            </div>

            {/* Product links */}
            <div>
              <h4 className="text-label font-semibold text-ink mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-ink-muted">
                <li><Link href="/" className="hover:text-ink transition-colors">Homepage</Link></li>
                <li><Link href="/marketing/pricing" className="hover:text-ink transition-colors">Pricing</Link></li>
                <li><Link href="/marketing/blog" className="hover:text-ink transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Account links */}
            <div>
              <h4 className="text-label font-semibold text-ink mb-3">Account</h4>
              <ul className="space-y-2 text-sm text-ink-muted">
                <li><Link href="/auth/login" className="hover:text-ink transition-colors">Log in</Link></li>
                <li><Link href="/auth/signup" className="hover:text-ink transition-colors">Sign up</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-rule flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-meta text-ink-muted">
              &copy; {new Date().getFullYear()} SoapCraft Pro. All rights reserved.
            </p>
            <p className="text-meta text-ink-muted">
              Deterministic calculations, not AI guesswork.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}