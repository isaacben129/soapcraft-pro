// ── Soap Recipe Management Software ──────────
// Intent: commercial — users looking for software to manage soap recipes
// Primary keyword: "soap recipe management software"
// Product bridge: SoapCraft Pro locks each recipe version so batches always
//   trace back to the exact formulation that produced them.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Soap Recipe Management Software — Versioned Recipes, Tracked Batches",
  description:
    "Manage soap recipes with version control, batch tracking, and cost analysis. SoapCraft Pro connects formulation to production so every batch traces back to the recipe version that produced it.",
  path: "/soap-recipe-management-software",
});

export default function SoapRecipeManagementPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li>
                <Link href="/soap-recipe-management-software" className="hover:text-foreground transition-colors">
                  Soap Recipe Management Software
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Soap Recipe Management Software
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Soap recipe management is not just storing formulas. It is preserving
            the exact formulation that each batch was made from, so you can trace
            any result back to the recipe version that produced it. SoapCraft Pro
            treats every recipe as a versioned, immutable record.
          </p>

          <section className="mt-10" aria-labelledby="why-versioning">
            <h2 id="why-versioning" className="font-display text-2xl font-bold text-foreground">
              Why Recipe Versioning Matters
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              When you edit a recipe after it has been used in batches, you create
              a problem: which version of the recipe produced which batch? SoapCraft
              Pro solves this by creating a new RecipeVersion on every save. Batches
              reference a specific RecipeVersion, and the current version is tracked
              on the Recipe record. Editing a recipe never retroactively changes
              historical batch records.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="what-to-track">
            <h2 id="what-to-track" className="font-display text-2xl font-bold text-foreground">
              What a Recipe Record Should Include
            </h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>Oil blend with percentages</li>
              <li>Lye type and concentration</li>
              <li>Superfat percentage</li>
              <li>Water ratio or lye concentration</li>
              <li>Additives and their usage rates</li>
              <li>IFRA compliance check</li>
              <li>Property predictions (hardness, lather, moisturizing)</li>
              <li>Safety warnings</li>
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="product-bridge">
            <h2 id="product-bridge" className="font-display text-2xl font-bold text-foreground">
              Try SoapCraft Pro Free
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Start with the calculator, three recipes, and one active batch. When
              you are ready to version your recipes and track batches, upgrade to
              Pro.
            </p>
            <div className="mt-6">
              <Link
                href="/recipes/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-action text-action-text rounded-md font-medium hover:opacity-90 transition-opacity text-sm"
              >
                Start a recipe free
              </Link>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="faq">
            <h2 id="faq" className="font-display text-2xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="mt-4 space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground">Can I organize recipes into folders?</h3>
                <p className="mt-1">
                  Recipe organization is part of the Pro tier. You can filter recipes
                  by ingredient and replicate or refine existing recipes to create
                  new versions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">What happens when I edit a recipe that has been used in batches?</h3>
                <p className="mt-1">
                  SoapCraft Pro creates a new RecipeVersion. Historical batches remain
                  linked to the version they were made from. Nothing changes retroactively.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Can I replicate a recipe and adjust it?</h3>
                <p className="mt-1">
                  Yes. Replicating a recipe creates a new version you can modify
                  without affecting the original. This is the core of versioned
                  recipe management.
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
