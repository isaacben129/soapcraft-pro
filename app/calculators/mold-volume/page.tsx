// ── Mold Volume Calculator ─────────────
// Intent: informational — soapmakers sizing molds
// Primary keyword: "soap mold volume calculator"
// Product bridge: Free tool, no auth. Email capture → drip sequence → Pro offer.
// This is a Server Component — metadata export is allowed here.
// MoldVolumeForm is a Client Component imported below.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import { MoldVolumeForm } from "@/components/shared/mold-volume-form";

export const metadata: Metadata = pageMetadata({
  title: "Mold Volume Calculator — Size Your Soap Mold",
  description:
    "Calculate how much soap your mold will produce. Enter mold dimensions or volume. Get the estimated batch weight. Free, no signup required.",
  path: "/calculators/mold-volume",
});

export default function MoldVolumePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/calculators/mold-volume" className="hover:text-foreground transition-colors">Mold Volume Calculator</Link></li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Mold Volume Calculator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Before you pour, you need to know how much soap your mold will hold. A mold that's too small means an overflow. A mold that's too large means wasted effort. Enter your mold dimensions and get the estimated batch weight instantly.
          </p>

          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="sr-only">How it works</h2>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">1</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Enter dimensions</h3>
                <p className="text-sm text-muted-foreground">Add length, width, and height of your mold.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">2</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Calculate</h3>
                <p className="text-sm text-muted-foreground">Get the estimated batch weight in grams.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">3</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Plan your batch</h3>
                <p className="text-sm text-muted-foreground">Use the result to plan your ingredient quantities.</p>
              </div>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="calculator">
            <h2 id="calculator" className="font-display text-2xl font-bold text-foreground mb-6">
              Calculate Mold Volume
            </h2>
            <MoldVolumeForm />
          </section>
        </div>
      </article>
    </main>
  );
}
