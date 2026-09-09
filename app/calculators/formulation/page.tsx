import type { Metadata } from "next";
import Link from "next/link";
import { isPublicChemistryEnabled } from "@/lib/calculations/chemistry";
import { LEGACY_OILS, isPubliclyUsable } from "@/lib/calculations/ingredient-dataset";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Soap Formulation Calculator — Verification Status",
  description:
    "See how SoapCraft Pro calculates NaOH, KOH, mixed alkali, superfat, purity, and water. Public chemistry remains disabled until ingredient source records pass independent review.",
  path: "/calculators/formulation",
});

export default function FormulationCalculatorPage() {
  const publicIngredientCount = LEGACY_OILS.filter((oil) => isPubliclyUsable(oil.id)).length;
  const calculatorAvailable = isPublicChemistryEnabled() && publicIngredientCount > 0;

  return (
    <main className="min-h-screen">
      <article className="container mx-auto max-w-4xl px-4 py-14 md:py-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span>Formulation calculator</span>
        </nav>

        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-action">
          Deterministic chemistry engine v2.0.0
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
          Soap formulation calculator
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          The calculation engine is implemented, but the public calculator is intentionally unavailable
          while its ingredient source manifest is independently reviewed. SoapCraft Pro will not turn
          provisional SAP values into production chemistry results merely because the interface is ready.
        </p>

        <section
          aria-labelledby="availability-heading"
          className="mt-10 rounded-xl border border-warning/40 bg-warning/5 p-6 md:p-8"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-warning">Release gate active</p>
              <h2 id="availability-heading" className="mt-2 font-display text-2xl font-bold text-foreground">
                {calculatorAvailable ? "Public calculation is enabled" : "Source verification is still in progress"}
              </h2>
            </div>
            <span className="w-fit rounded-full border border-warning/40 px-3 py-1 text-xs font-semibold text-foreground">
              {publicIngredientCount} approved ingredients
            </span>
          </div>
          {!calculatorAvailable && (
            <p className="mt-4 leading-7 text-muted-foreground">
              The public API returns a typed unavailable response and performs no chemistry calculation.
              It can be enabled only after the production flag is set and every selected ingredient has
              both a verified source status and an approved reviewer state.
            </p>
          )}
        </section>

        <section aria-labelledby="engine-contract" className="mt-14">
          <h2 id="engine-contract" className="font-display text-2xl font-bold text-foreground">
            What the engine calculates
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              ["Explicit oil mass", "The recipe starts from the oil mass you enter. There is no hidden 1,000 g calculation base."],
              ["NaOH, KOH, or mixed alkali", "Mixed recipes use KOH share of alkali equivalents, not an apparent percentage of the final gram weights."],
              ["One recipe-level superfat", "The discount is applied once to both pure alkali requirements before each alkali is corrected for purity."],
              ["Three water modes", "Water-to-lye ratio and lye concentration use the total as-supplied alkali mass. Water as percent of oils uses oil mass."],
              ["Separate weighed masses", "Results keep pure requirements, NaOH as supplied, KOH as supplied, and total alkali as supplied distinct."],
              ["Full internal precision", "The dependency chain remains unrounded. Rounding is reserved for display and export boundaries."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="release-requirements" className="mt-14 border-t border-border pt-10">
          <h2 id="release-requirements" className="font-display text-2xl font-bold text-foreground">
            What must happen before this opens
          </h2>
          <ol className="mt-6 space-y-5 text-muted-foreground">
            <li><strong className="text-foreground">1. Source every production SAP record.</strong> Each oil needs a stable ID, KOH-basis value, source identifier, method, dates, status, and reviewer state.</li>
            <li><strong className="text-foreground">2. Review the manifest independently.</strong> Legacy values remain provisional and cannot become public merely by being copied into the new schema.</li>
            <li><strong className="text-foreground">3. Verify reference cases.</strong> NaOH, KOH, mixed-alkali, purity, superfat, and all water modes need hand calculations and cross-calculator comparisons.</li>
            <li><strong className="text-foreground">4. Approve safety language.</strong> Public instructions and warnings require independent domain review before release.</li>
          </ol>
        </section>

        <section aria-labelledby="not-included" className="mt-14 border-t border-border pt-10">
          <h2 id="not-included" className="font-display text-2xl font-bold text-foreground">
            Claims this calculator will not make
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            The engine does not manufacture hardness, cleansing, conditioning, or skin-performance ranges.
            It does not infer an IFRA fragrance limit from an oil selection. Those outputs require different
            evidence: sourced fatty-acid composition for formulation indicators, and an exact supplier
            certificate with Category 9 mapping for fragrance limits.
          </p>
        </section>

        <section className="mt-14 rounded-xl bg-muted p-6 md:p-8">
          <h2 className="font-display text-xl font-bold text-foreground">Tools available while verification continues</h2>
          <p className="mt-2 text-muted-foreground">
            You can use the non-chemistry business calculators without an account while the formulation release gate remains closed.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/calculators/batch-costing" className="rounded-md bg-action px-5 py-3 text-sm font-semibold text-action-text hover:opacity-90">
              Batch costing
            </Link>
            <Link href="/calculators/wholesale-pricing" className="rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted">
              Wholesale pricing
            </Link>
            <Link href="/calculators/recipe-scaling" className="rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted">
              Recipe scaling
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
