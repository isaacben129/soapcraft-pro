// ── Recipe Scaling Calculator ───────────
// Intent: informational — soapmakers scaling recipes
// Primary keyword: "soap recipe scaling calculator"
// Product bridge: Free tool, no auth. Email capture → drip sequence → Pro offer.
// This is a Server Component — metadata export is allowed here.
// RecipeScalingForm is a Client Component imported below.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";
import { RecipeScalingForm } from "@/components/shared/recipe-scaling-form";

export const metadata: Metadata = pageMetadata({
  title: "Recipe Scaling Calculator — Scale Soap Recipes Easily",
  description:
    "Scale any soap recipe up or down. Enter your original recipe and desired batch size. Get exact ingredient amounts — free, no signup required.",
  path: "/calculators/recipe-scaling",
});

export default function RecipeScalingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/calculators/recipe-scaling" className="hover:text-foreground transition-colors">Recipe Scaling Calculator</Link></li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Recipe Scaling Calculator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Scaling a soap recipe from a small test batch to a full production run requires precise math. Change the oil ratios by even a small percentage and your lye calculation shifts. This tool scales your recipe accurately while preserving the exact oil balance you developed.
          </p>

          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="sr-only">How it works</h2>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">1</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Enter recipe</h3>
                <p className="text-sm text-muted-foreground">Add your original recipe ingredients and their weights.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">2</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Set target</h3>
                <p className="text-sm text-muted-foreground">Enter the total batch weight you want to produce.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-action/10 flex items-center justify-center">
                <span className="font-display font-bold text-action">3</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Get scaled amounts</h3>
                <p className="text-sm text-muted-foreground">See exact ingredient weights for your scaled batch.</p>
              </div>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="calculator">
            <h2 id="calculator" className="font-display text-2xl font-bold text-foreground mb-6">
              Scale Your Recipe
            </h2>
            <RecipeScalingForm />
          </section>
        </div>
      </article>
    </main>
  );
}
