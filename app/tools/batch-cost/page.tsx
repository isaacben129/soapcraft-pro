// ── SLICE-002: Canonical /tools/batch-cost ──
// Wired through the real RecipeBatchContextV1 interface.
// Context persistence, share, export, and reset all functional.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import { BatchCostingForm } from "@/components/shared/batch-costing-form";

import { ShareDecodeWidget } from "@/components/shared/share-decode-widget";

export const metadata: Metadata = pageMetadata({
  title: "Batch Cost Calculator — Know Your Cost Per Bar",
  description:
    "Calculate the real cost per bar of handmade soap. Enter ingredient costs, batch yield, and target margin. Free, no signup required.",
  path: "/tools/batch-cost",
});

export default function BatchCostPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/tools/batch-cost" className="hover:text-foreground transition-colors">Batch Cost Calculator</Link></li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Batch Cost Calculator</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Know exactly what each bar costs before you price it. Enter your ingredient costs, batch yield, and target margin. Get real-time results — no signup, no account, no credit card.
          </p>


          <section className="mt-12" aria-labelledby="calculator">
            <h2 id="calculator" className="font-display text-2xl font-bold text-foreground mb-6">Calculate Your Cost Per Bar</h2>
            <BatchCostingForm />
          </section>

          {/* Share decode import seam */}
          <section className="mt-12" aria-labelledby="import">
            <h2 id="import" className="font-display text-xl font-semibold text-foreground mb-4">Import Shared Context</h2>
            <ShareDecodeWidget />
          </section>

          <section className="mt-12" aria-labelledby="formula">
            <h2 id="formula" className="font-display text-xl font-semibold text-foreground mb-4">How Cost Per Bar Works</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Cost per bar</strong> = Total ingredient cost ÷ Number of saleable bars</li>
              <li><strong className="text-foreground">Suggested price</strong> = Cost per bar × (1 + Target margin)</li>
              <li><strong className="text-foreground">Target margin</strong> = Percentage above cost to cover packaging, labor, and profit</li>
            </ul>
          </section>
        </div>
      </article>
    </main>
  );
}
