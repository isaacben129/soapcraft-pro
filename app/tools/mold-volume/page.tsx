// ── SLICE-001: Canonical /tools/mold-volume ──
// Canonical route for mold volume calculator.
// Renders the same content as /calculators/mold-volume.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import { MoldVolumeForm } from "@/components/shared/mold-volume-form";

export const metadata: Metadata = pageMetadata({
  title: "Mold Volume Calculator — Size Your Soap Mold",
  description:
    "Calculate how much soap your mold will hold. Enter mold dimensions or volume. Get the estimated batch weight. Free, no signup required.",
  path: "/tools/mold-volume",
});

export default function MoldVolumePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/tools/mold-volume" className="hover:text-foreground transition-colors">Mold Volume Calculator</Link></li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Mold Volume Calculator</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Before you pour, you need to know how much soap your mold will hold. A mold that's too small means an overflow. A mold that's too large means wasted effort. Enter your mold dimensions and get the estimated batch weight instantly.
          </p>
          <section className="mt-12" aria-labelledby="calculator">
            <h2 id="calculator" className="font-display text-2xl font-bold text-foreground mb-6">Calculate Mold Volume</h2>
            <MoldVolumeForm />
          </section>
        </div>
      </article>
    </main>
  );
}
