// ── SoapCalc Alternative ──────────────────
// Intent: commercial — users evaluating SoapCalc alternatives
// Primary keyword: "soapcalc alternative"
// Product bridge: SoapCraft Pro adds versioned recipes, tracked batches, cure
//   observations, and actual cost-per-bar analysis on top of the calculation.

import { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "SoapCalc Alternative — A Full Workspace, Not Just a Calculator",
  description:
    "SoapCalc is a free lye calculator. SoapCraft Pro is a full workspace for recipe versioning, batch tracking, cure monitoring, and cost analysis. Here is what each tool does and why the gap matters.",
  path: "/compare/soapcalc-alternative",
});

export default function SoapCalcAlternativePage() {
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
                <Link href="/compare/soapcalc-alternative" className="hover:text-foreground transition-colors">
                  SoapCalc Alternative
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            SoapCalc Alternative — A Full Workspace, Not Just a Calculator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            SoapCalc has been the go-to free lye calculator since 2001. It
            handles one task well: converting oil percentages and lye amounts into
            a workable formulation. SoapCraft Pro is built for the workflow that
            comes after the calculation.
          </p>

          <section className="mt-10" aria-labelledby="what-soapcalc-does">
            <h2 id="what-soapcalc-does" className="font-display text-2xl font-bold text-foreground">
              What SoapCalc Does Well
            </h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>Fast lye calculation from oil blends</li>
              <li>Superfat and lye concentration adjustments</li>
              <li>SAP value lookup for common oils</li>
              <li>Free and accessible with no signup</li>
            </ul>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              If you need a one-off calculation, SoapCalc remains a perfectly
              valid tool. It is not the target audience for SoapCraft Pro.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="what-soapcraft-pro-adds">
            <h2 id="what-soapcraft-pro-adds" className="font-display text-2xl font-bold text-foreground">
              What SoapCraft Pro Adds
            </h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Versioned recipes</strong> —
                lock a formulation so batches always trace back to the exact
                recipe version that produced them
              </li>
              <li>
                <strong className="text-foreground">Tracked batches</strong> —
                record planned versus actual measurements for every batch
              </li>
              <li>
                <strong className="text-foreground">Cure observations</strong> —
                structured cure tracking with due-date visibility
              </li>
              <li>
                <strong className="text-foreground">Actual cost per bar</strong> —
                ingredient costs inherited from the recipe version, calculated
                against actual yield
              </li>
              <li>
                <strong className="text-foreground">Making Mode</strong> —
                guided production checklist that gates steps in sequence
              </li>
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="when-to-switch">
            <h2 id="when-to-switch" className="font-display text-2xl font-bold text-foreground">
              When to Switch
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              You should consider SoapCraft Pro when you find yourself copying
              the same recipe into a spreadsheet, a notebook, or a second tool
              to track batches and costs. If you are managing more than a handful
              of recipes and need to compare planned versus actual results, a
              workspace that connects formulation to production to cost becomes
              worth the upgrade.
            </p>
          </section>

          <section className="mt-10" aria-labelledby="product-bridge">
            <h2 id="product-bridge" className="font-display text-2xl font-bold text-foreground">
              Try SoapCraft Pro Free
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Start with the calculator and three recipes. When you are ready to
              version your recipes and track batches, upgrade to Pro.
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
                <h3 className="font-semibold text-foreground">Can I import my SoapCalc recipes?</h3>
                <p className="mt-1">
                  SoapCraft Pro does not yet offer a one-click import from SoapCalc.
                  You can recreate your oil blend in the Recipe Builder and verify
                  the calculation matches your existing data.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Is SoapCraft Pro a replacement for SoapCalc?</h3>
                <p className="mt-1">
                  It replaces the need for a separate calculator when you also need
                  batch tracking, cure monitoring, and cost analysis. If you only
                  need a one-off lye calculation, SoapCalc remains sufficient.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Does SoapCraft Pro use the same SAP values?</h3>
                <p className="mt-1">
                  SoapCraft Pro uses published SAP values and verifies them server-side.
                  Unknown or missing SAP values block the calculation rather than
                  silently substituting an estimate.
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
