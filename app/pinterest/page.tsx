// ── Pinterest Content Hub ──────────────
// Visual content path for Pinterest distribution.
// Each pin links to a calculator or guide page.
// SEO: targets "batch costing for soap makers" and related visual terms.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Pinterest — Batch Costing for Soap Makers",
  description:
    "Visual guides and calculators for soap makers. Pin your favorites and calculate costs without signup.",
  path: "/pinterest/batch-costing",
});

export default function PinterestPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/pinterest/batch-costing" className="hover:text-foreground transition-colors">Pinterest</Link></li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Pinterest for Soap Makers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Visual guides and calculators for soap makers. Pin your favorites
            and calculate costs without signup. Every pin links to a working
            tool.
          </p>

          {/* ── Pin Categories ── */}
          <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8" aria-labelledby="pin-categories">
            <h2 id="pin-categories" className="sr-only">Pin categories</h2>

            <Link href="/calculators/batch-costing" className="group">
              <div className="bg-canvas rounded-lg border border-rule p-6 hover:border-action transition-colors">
                <h3 className="font-display font-semibold text-foreground group-hover:text-action transition-colors">
                  Batch Costing Calculator
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Know your cost per bar. No signup required. Pin this for your next batch.
                </p>
              </div>
            </Link>

            <Link href="/guides/craft-fair-break-even" className="group">
              <div className="bg-canvas rounded-lg border border-rule p-6 hover:border-action transition-colors">
                <h3 className="font-display font-semibold text-foreground group-hover:text-action transition-colors">
                  Craft Fair Break-Even Guide
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Calculate how many bars you need to sell to cover costs at craft fairs.
                </p>
              </div>
            </Link>

            <Link href="/guides/cost-per-bar-deep-dive" className="group">
              <div className="bg-canvas rounded-lg border border-rule p-6 hover:border-action transition-colors">
                <h3 className="font-display font-semibold text-foreground group-hover:text-action transition-colors">
                  Cost Per Bar Deep Dive
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Understanding your ingredient costs, yield, and pricing strategy.
                </p>
              </div>
            </Link>

            <Link href="/blog" className="group">
              <div className="bg-canvas rounded-lg border border-rule p-6 hover:border-action transition-colors">
                <h3 className="font-display font-semibold text-foreground group-hover:text-action transition-colors">
                  Blog &amp; Guides
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Verified recipes, safety guides, and troubleshooting for soap makers.
                </p>
              </div>
            </Link>
          </section>

          {/* ── Pin Ideas ── */}
          <section className="mt-12" aria-labelledby="pin-ideas">
            <h2 id="pin-ideas" className="font-display text-xl font-semibold text-foreground mb-4">
              Pin Ideas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Batch Costing Infographic", desc: "Visual breakdown of cost per bar", link: "/calculators/batch-costing" },
                { title: "Craft Fair Pricing Guide", desc: "How to price soap at markets", link: "/guides/craft-fair-break-even" },
                { title: "Ingredient Cost Tracker", desc: "Visual template for tracking costs", link: "/templates/ingredient-reorder-list" },
                { title: "Curing Timeline", desc: "Visual cure schedule for soap makers", link: "/guides/curing-schedule-optimizer" },
                { title: "Recipe Comparison Chart", desc: "Compare oil blends and properties", link: "/recipes" },
                { title: "Safety Checklist", desc: "Lye handling and workspace safety", link: "/blog/soap-making-safety-guide" },
              ].map((pin, i) => (
                <Link key={i} href={pin.link} className="block bg-ledger rounded-md border border-rule p-4 hover:border-action transition-colors">
                  <h3 className="font-semibold text-foreground text-sm">{pin.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{pin.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="mt-12 text-center">
            <Link
              href="/calculators/batch-costing"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-action text-action-text rounded-md font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Calculate your cost per bar
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Free, no signup, instant results. Pin your results and share with the community.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
