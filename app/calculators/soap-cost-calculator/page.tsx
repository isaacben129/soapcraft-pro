// ── Soap Cost Per Bar Calculator ──────────
// Intent: commercial — micro-business sellers pricing their product
// Primary keyword: "soap cost per bar calculator"
// Product bridge: SoapCraft Pro auto-calculates cost per batch and cost per bar,
//   with target margin pricing and suggested selling price.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Soap Cost Per Bar Calculator — Price Your Handmade Soap",
  description:
    "Calculate the real cost per bar of handmade soap. Includes ingredient costs, batch yield, target margin pricing, and suggested selling price.",
  path: "/calculators/soap-cost-calculator",
});

export default function SoapCostCalculatorPage() {
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
                <Link href="/calculators/soap-cost-calculator" className="hover:text-foreground transition-colors">
                  Soap Cost Calculator
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Soap Cost Per Bar Calculator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Know exactly what each bar costs before you price it. SoapCraft Pro
            auto-calculates cost per batch and cost per bar from your ingredient
            costs and actual yield, so you can set a target margin and publish a
            price with confidence.
          </p>

          <section className="mt-10" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="font-display text-2xl font-bold text-foreground">
              How Cost Per Bar Works
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The cost per bar is the total ingredient cost of a batch divided by
              the number of saleable bars that batch yields. It does not include
              labor, packaging, or overhead — those are separate decisions. What
              SoapCraft Pro tracks is the ingredient cost baseline so you can
              layer your own margin on top.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mt-6">
              The Formula
            </h3>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Cost per bar</strong> = Total
                ingredient cost ÷ Number of saleable bars
              </li>
              <li>
                <strong className="text-foreground">Suggested price</strong> = Cost
                per bar × (1 + Target margin)
              </li>
              <li>
                <strong className="text-foreground">Target margin</strong> = The
                percentage above cost you need to cover packaging, labor, and
                profit
              </li>
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="why-accurate">
            <h2 id="why-accurate" className="font-display text-2xl font-bold text-foreground">
              Why Accurate Yield Matters
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              If your batch yields 42 bars but you assumed 48, your cost per bar
              is wrong by about 14%. SoapCraft Pro records actual yield from each
              batch so the cost calculation reflects reality, not guesswork.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="product-bridge">
            <h2 id="product-bridge" className="font-display text-2xl font-bold text-foreground">
              Try It in SoapCraft Pro
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              SoapCraft Pro auto-calculates cost per batch and cost per bar from
              your ingredient costs and actual yield. Set a target margin and get
              a suggested selling price for every recipe.
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
                <h3 className="font-semibold text-foreground">Should I include labor in the cost per bar?</h3>
                <p className="mt-1">
                  That is a business decision, not a calculation one. SoapCraft Pro
                  gives you the ingredient cost baseline so you can decide how to
                  allocate labor separately.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">What if my batch yields less than expected?</h3>
                <p className="mt-1">
                  SoapCraft Pro tracks actual yield so the cost per bar reflects
                  what you actually produced, not what you planned.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Can I compare margins across recipes?</h3>
                <p className="mt-1">
                  Yes. SoapCraft Pro maintains a cost portfolio so you can compare
                  batch economics and margins across recipes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Does SoapCraft Pro handle packaging costs?</h3>
                <p className="mt-1">
                  Ingredient cost is the baseline. You can add packaging as a
                  separate line item in your cost analysis to get a fully loaded
                  cost per bar.
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
