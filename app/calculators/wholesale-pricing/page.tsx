// ── Wholesale Pricing Calculator ──────────
// Intent: commercial — soapmakers pricing for wholesale
// Primary keyword: "wholesale soap pricing calculator"
// Product bridge: Free tool, no auth. Email capture → drip sequence → Pro offer.
// This is a Server Component — metadata export is allowed here.
// WholesalePricingForm is a Client Component imported below.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import { WholesalePricingForm } from "@/components/shared/wholesale-pricing-form";

export const metadata: Metadata = pageMetadata({
  title: "Wholesale Pricing Calculator",
  description:
    "Calculate wholesale prices for your soap. Input production costs and desired margin. Get suggested wholesale prices per bar and per case. Free, no signup required.",
  path: "/calculators/wholesale-pricing",
});

export default function WholesalePricingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/calculators/wholesale-pricing" className="hover:text-foreground transition-colors">Wholesale Pricing Calculator</Link></li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Wholesale Pricing Calculator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Pricing for wholesale is different from retail. Wholesale buyers expect a significant discount, and you need enough margin to cover your production costs at volume. Calculate the right wholesale price so you can confidently approach retailers and distributors.
          </p>

          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="sr-only">How it works</h2>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">1</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Enter costs</h3>
                <p className="text-sm text-muted-foreground">Add your cost per bar and batch expenses.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">2</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Set margins</h3>
                <p className="text-sm text-muted-foreground">Choose your wholesale and retail target margins.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">3</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Get pricing</h3>
                <p className="text-sm text-muted-foreground">See suggested wholesale prices per bar and per case.</p>
              </div>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="calculator">
            <h2 id="calculator" className="font-display text-2xl font-bold text-foreground mb-6">
              Calculate Wholesale Prices
            </h2>
            <WholesalePricingForm />
          </section>
        </div>
      </article>
    </main>
  );
}
