// ── SLICE-001: Canonical /tools/craft-fair-break-even ──
// Canonical route for craft fair break-even calculator.
// Renders the same content as /calculators/craft-fair-break-even.

import { Metadata } from "next";
import Link from "next/link";
import { getToolMetadata } from "@/lib/seo/tool-seo";
import { ToolSeo } from "@/components/shared/tool-seo";
import { CraftFairBreakEvenForm } from "@/components/shared/craft-fair-break-even-form";

export const metadata: Metadata = getToolMetadata("craft-fair-break-even");

export default function CraftFairBreakEvenPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <ToolSeo slug="craft-fair-break-even" />
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/tools/craft-fair-break-even" className="hover:text-foreground transition-colors">Craft Fair Break-Even Calculator</Link></li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Craft Fair Break-Even Calculator</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Craft fairs are a great way to sell soap directly to customers — but booth fees, travel, and supplies add up fast. Calculate exactly how many bars you need to sell to break even, so you know your floor before you commit to a show.
          </p>
          <section className="mt-12" aria-labelledby="calculator">
            <h2 id="calculator" className="font-display text-2xl font-bold text-foreground mb-6">Calculate Your Break-Even</h2>
            <CraftFairBreakEvenForm />
          </section>
        </div>
      </article>
    </main>
  );
}
