// ── Batch Costing Calculator ───────────────
// Intent: commercial — soapmakers pricing their product
// Primary keyword: "soap batch costing calculator"
// Product bridge: Free tool, no auth. Email capture → drip sequence → Pro offer.
// This is the top-of-funnel wedge: calculate → capture → convert.
// This is a Server Component — metadata export is allowed here.
// BatchCostingForm is a Client Component imported below.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import { BatchCostingForm } from "@/components/shared/batch-costing-form";

export const metadata: Metadata = pageMetadata({
  title: "Batch Costing Calculator — Know Your Cost Per Bar",
  description:
    "Calculate the real cost per bar of handmade soap. Enter ingredient costs, batch yield, and target margin. Free, no signup required.",
  path: "/calculators/batch-costing",
});

export default function BatchCostingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* ── Breadcrumb ── */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/calculators/batch-costing" className="hover:text-foreground transition-colors">Batch Costing Calculator</Link></li>
            </ol>
          </nav>

          {/* ── Hero ── */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Batch Costing Calculator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Know exactly what each bar costs before you price it. Enter your
            ingredient costs, batch yield, and target margin. Get real-time
            results — no signup, no account, no credit card.
          </p>

          {/* ── How It Works ── */}
          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="sr-only">How it works</h2>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">1</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Enter costs</h3>
                <p className="text-sm text-muted-foreground">Add your ingredient costs, batch yield, and target margin.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">2</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Get results</h3>
                <p className="text-sm text-muted-foreground">See cost per bar, ingredient totals, and suggested selling price.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">3</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Save & convert</h3>
                <p className="text-sm text-muted-foreground">Download a worksheet, subscribe to Pro, or track batches in your workspace.</p>
              </div>
            </div>
          </section>

          {/* ── Calculator ── */}
          <section className="mt-12" aria-labelledby="calculator">
            <h2 id="calculator" className="font-display text-2xl font-bold text-foreground mb-6">
              Calculate Your Cost Per Bar
            </h2>
            <BatchCostingForm />
          </section>

          {/* ── Formula ── */}
          <section className="mt-12" aria-labelledby="formula">
            <h2 id="formula" className="font-display text-xl font-semibold text-foreground mb-4">
              How Cost Per Bar Works
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Cost per bar</strong> = Total ingredient cost ÷ Number of saleable bars</li>
              <li><strong className="text-foreground">Suggested price</strong> = Cost per bar × (1 + Target margin)</li>
              <li><strong className="text-foreground">Target margin</strong> = Percentage above cost to cover packaging, labor, and profit</li>
            </ul>
          </section>

          {/* ── FAQ ── */}
          <section className="mt-12" aria-labelledby="faq">
            <h2 id="faq" className="font-display text-xl font-semibold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground">Do I need an account to use this calculator?</h3>
                <p className="mt-1">No. This calculator works entirely without signup. Enter your costs and get results immediately.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Should I include labor in the cost per bar?</h3>
                <p className="mt-1">That is a business decision, not a calculation one. This calculator gives you the ingredient cost baseline so you can allocate labor separately.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">What if my batch yields less than expected?</h3>
                <p className="mt-1">Adjust the batch yield input to match your actual result. The calculator updates in real time.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Can I track my batches over time?</h3>
                <p className="mt-1">Yes. Create a free SoapCraft Pro account to save recipes, track batches, and monitor cost history.</p>
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="mt-12 text-center">
            <Link
              href="/recipes/new"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-action text-action-text rounded-md font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Start a recipe free
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Free tier includes 3 recipes, 1 active batch. No credit card required.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

