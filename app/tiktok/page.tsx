// ── TikTok Content Hub ─────────────────
// Short-form video content path for TikTok distribution.
// Each video links to a calculator or guide page.
// SEO: targets "how much does soap cost to make" and related terms.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "TikTok — How Much Does Soap Cost to Make",
  description:
    "Short-form video content for soap makers. See cost calculations, recipes, and tips. Every video links to a free tool.",
  path: "/tiktok/cost-per-bar",
});

export default function TikTokPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/tiktok/cost-per-bar" className="hover:text-foreground transition-colors">TikTok</Link></li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            TikTok for Soap Makers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Short-form video content for soap makers. See cost calculations,
            recipes, and tips. Every video links to a free tool you can use right now.
          </p>

          {/* ── Video Topics ── */}
          <section className="mt-10" aria-labelledby="video-topics">
            <h2 id="video-topics" className="font-display text-xl font-semibold text-foreground mb-4">
              Video Topics
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "How much does soap actually cost to make?",
                  desc: "Cost per bar calculation in 60 seconds",
                  link: "/calculators/batch-costing",
                  duration: "60s",
                },
                {
                  title: "3 beginner soap recipes that won't fail",
                  desc: "Verified formulations with lye calculations",
                  link: "/blog/soap-recipes-for-beginners",
                  duration: "90s",
                },
                {
                  title: "Craft fair pricing mistake (and how to fix it)",
                  desc: "Calculate your break-even before the market",
                  link: "/guides/craft-fair-break-even",
                  duration: "75s",
                },
                {
                  title: "Why your soap didn't trace (fixed)",
                  desc: "Common problems and how to avoid them",
                  link: "/blog/soap-didnt-trace",
                  duration: "60s",
                },
                {
                  title: "Batch costing for wholesale — 3 things to know",
                  desc: "Price your soap right for wholesale orders",
                  link: "/guides/wholesale-pricing-calculator",
                  duration: "90s",
                },
                {
                  title: "Ingredient reorder point calculator",
                  desc: "Never run out of oils during a busy season",
                  link: "/guides/ingredient-reorder-calculation",
                  duration: "60s",
                },
              ].map((video, i) => (
                <Link key={i} href={video.link} className="block bg-canvas rounded-lg border border-rule p-5 hover:border-action transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{video.desc}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground bg-ledger px-2 py-1 rounded">{video.duration}</span>
                  </div>
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
              Try the free batch costing calculator
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Free, no signup, instant results. Every video links to a working tool.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
