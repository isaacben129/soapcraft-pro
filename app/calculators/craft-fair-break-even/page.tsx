// ── Craft Fair Break-Even Calculator ───────
// Intent: commercial — soapmakers selling at craft fairs
// Primary keyword: "craft fair break-even calculator"
// Product bridge: Free tool, no auth. Email capture → drip sequence → Pro offer.
// This is a Server Component — metadata export is allowed here.
// CraftFairBreakEvenForm is a Client Component imported below.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import { CraftFairBreakEvenForm } from "@/components/shared/craft-fair-break-even-form";

export const metadata: Metadata = pageMetadata({
  title: "Craft Fair Break-Even Calculator",
  description:
    "Calculate exactly how many bars you need to sell to cover booth costs. Input expenses and pricing. Find your break-even point. Free, no signup required.",
  path: "/calculators/craft-fair-break-even",
});

export default function CraftFairBreakEvenPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/calculators/craft-fair-break-even" className="hover:text-foreground transition-colors">Craft Fair Break-Even Calculator</Link></li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Craft Fair Break-Even Calculator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Craft fairs are a great way to sell soap directly to customers — but booth fees, travel, and supplies add up fast. Calculate exactly how many bars you need to sell to break even, so you know your floor before you commit to a show.
          </p>

          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="sr-only">How it works</h2>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">1</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Enter expenses</h3>
                <p className="text-sm text-muted-foreground">Add booth fees, travel, table, signage, and other costs.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">2</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Set pricing</h3>
                <p className="text-sm text-muted-foreground">Enter your selling price per bar and any discounts.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">3</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">See your break-even</h3>
                <p className="text-sm text-muted-foreground">Know exactly how many bars to sell to cover costs.</p>
              </div>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="calculator">
            <h2 id="calculator" className="font-display text-2xl font-bold text-foreground mb-6">
              Calculate Your Break-Even
            </h2>
            <CraftFairBreakEvenForm />
          </section>
        </div>
      </article>
    </main>
  );
}
