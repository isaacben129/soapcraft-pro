// ── SLICE-001: Canonical /tools/recipe-scaling ──
// Canonical route for recipe scaling calculator.
// Renders the same content as /calculators/recipe-scaling.

import { Metadata } from "next";
import Link from "next/link";
import { getToolMetadata } from "@/lib/seo/tool-seo";
import { ToolSeo } from "@/components/shared/tool-seo";
import { RecipeScalingForm } from "@/components/shared/recipe-scaling-form";

export const metadata: Metadata = getToolMetadata("recipe-scaling");

export default function RecipeScalingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <ToolSeo slug="recipe-scaling" />
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li><Link href="/tools/recipe-scaling" className="hover:text-foreground transition-colors">Recipe Scaling Calculator</Link></li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Recipe Scaling Calculator</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Scaling a soap recipe from a small test batch to a full production run requires precise math. Change the oil ratios by even a small percentage and your lye calculation shifts. This tool scales your recipe accurately while preserving the exact oil balance you developed.
          </p>
          <section className="mt-12" aria-labelledby="calculator">
            <h2 id="calculator" className="font-display text-2xl font-bold text-foreground mb-6">Scale Your Recipe</h2>
            <RecipeScalingForm />
          </section>
        </div>
      </article>
    </main>
  );
}
