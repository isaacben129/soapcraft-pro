// ── Soap Batch Tracking Software ──────────
// Intent: commercial — users looking for software to track soap batches
// Primary keyword: "soap batch tracking software"
// Product bridge: SoapCraft Pro records every batch as a production record
//   tied to a specific recipe version, so you can trace any result back to
//   the formulation that produced it.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Soap Batch Tracking Software — From Recipe to Finished Bar",
  description:
    "Track every soap batch from recipe to finished bar with planned vs actual measurements, cure observations, yield, and cost. SoapCraft Pro connects formulation to production to cost in one record.",
  path: "/soap-batch-tracking-software",
});

export default function SoapBatchTrackingPage() {
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
                <Link href="/soap-batch-tracking-software" className="hover:text-foreground transition-colors">
                  Soap Batch Tracking Software
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Soap Batch Tracking Software
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            A soap batch is more than a date on a calendar. It is a production
            record that connects the formulation, the actual measurements, the
            cure observations, the yield, and the cost. SoapCraft Pro tracks all
            of it in one place so nothing gets lost between the calculator and
            the finished bar.
          </p>

          <section className="mt-10" aria-labelledby="what-a-batch-record-shows">
            <h2 id="what-a-batch-record-shows" className="font-display text-2xl font-bold text-foreground">
              What a Batch Record Shows
            </h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Planned measurements</strong> —
                what the recipe version called for
              </li>
              <li>
                <strong className="text-foreground">Actual measurements</strong> —
                what you actually weighed, with variance shown for each line item
              </li>
              <li>
                <strong className="text-foreground">Trace and pour notes</strong> —
                what happened during making, including acceleration or separation
              </li>
              <li>
                <strong className="text-foreground">Cure observations</strong> —
                hardness, visual notes, and temperature at each check-in
              </li>
              <li>
                <strong className="text-foreground">Final yield</strong> —
                how many bars the batch actually produced
              </li>
              <li>
                <strong className="text-foreground">Actual cost per bar</strong> —
                ingredient costs inherited from the recipe version, calculated
                against actual yield
              </li>
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="why-versioned-recipes-matter">
            <h2 id="why-versioned-recipes-matter" className="font-display text-2xl font-bold text-foreground">
              Why the Recipe Version Matters
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Every batch starts from a specific locked recipe version, not from
              the latest editable draft. This means the planned measurements are
              immutable. If you later change the recipe, the historical batch
              record stays intact and traceable. You can always compare what you
              planned against what you actually did.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="product-bridge">
            <h2 id="product-bridge" className="font-display text-2xl font-bold text-foreground">
              Try SoapCraft Pro Free
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Start with the calculator, three recipes, and one active batch.
              When you are ready to track batches with planned-vs-actual
              measurements and cure observations, upgrade to Pro.
            </p>
            <div className="mt-6">
              <Link
                href="/batches/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-action text-action-text rounded-md font-medium hover:opacity-90 transition-opacity text-sm"
              >
                Start a batch
              </Link>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="faq">
            <h2 id="faq" className="font-display text-2xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="mt-4 space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground">Can I track multiple batches from the same recipe?</h3>
                <p className="mt-1">
                  Yes. Each batch references a specific RecipeVersion, so you can
                  make the same recipe multiple times and compare the results.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">What if I need to correct a measurement I recorded?</h3>
                <p className="mt-1">
                  Batch records are intended to reflect what actually happened.
                  SoapCraft Pro shows the planned versus actual comparison so you
                  can see the variance. Corrections should be noted as new
                  observations, not as retroactive changes to the batch record.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Does SoapCraft Pro send cure reminders?</h3>
                <p className="mt-1">
                  Cure tracking includes dashboard visibility for due batches and
                  overdue-batch indicators. You can manually mark a batch as ready
                  after cure. SoapCraft Pro does not automatically declare a batch
                  safe — that decision remains with the maker.
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
