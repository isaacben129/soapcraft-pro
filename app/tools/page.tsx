import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Soapmaking Tools — Calculators, Planning, and Records",
  description: "Use SoapCraft Pro's free soapmaking calculators and connected planning tools for formulation, sizing, costing, pricing, markets, production, and records.",
  path: "/tools",
});

const groups = [
  {
    title: "Formulate and size",
    description: "Move from an oil formula to a correctly sized batch without hidden assumptions.",
    tools: [
      ["Formulation calculator", "/calculators/formulation", "NaOH, KOH, mixed alkali, superfat, purity, and water calculations. Chemistry opens only after source verification."],
      ["Recipe scaling", "/calculators/recipe-scaling", "Scale ingredient weights to a new batch total while preserving proportions."],
      ["Mold volume", "/calculators/mold-volume", "Estimate mold volume and capacity with explicit dimensions and assumptions."],
    ],
  },
  {
    title: "Cost and price",
    description: "Turn a batch into a per-bar cost and test prices against actual margin targets.",
    tools: [
      ["Batch costing", "/calculators/batch-costing", "Combine ingredients, labor, overhead, packaging, yield, and waste into batch and unit cost."],
      ["Soap cost calculator", "/calculators/soap-cost-calculator", "Work through recipe cost and cost-per-bar decisions."],
      ["Wholesale pricing", "/calculators/wholesale-pricing", "Compare wholesale price, retailer margin, maker margin, and minimum order economics."],
    ],
  },
  {
    title: "Plan sales and production",
    description: "Connect economics to what you need to make, bring, sell, and track.",
    tools: [
      ["Craft fair break-even", "/calculators/craft-fair-break-even", "Calculate event costs, contribution per bar, break-even units, and target-profit units."],
      ["Batch records", "/batches", "Track production batches and their current stage."],
      ["Cure tracking", "/cure", "Record cure dates and observations across active batches."],
      ["Cost portfolio", "/costing", "Review batch cost records and incomplete cost bases."],
    ],
  },
  {
    title: "Save and learn",
    description: "Core calculators remain public. Accounts add saved records and cross-device continuity.",
    tools: [
      ["Recipe library", "/recipes", "Review saved recipe records and versions."],
      ["Guides", "/blog", "Read calculation methods, worked examples, and practical soapmaking guides."],
      ["Methodology and safety", "/methodology", "See formula boundaries, source rules, and what calculator outputs do not prove."],
    ],
  },
] as const;

export default function ToolsPage() {
  return (
    <main className="min-h-screen">
      <article className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-action">Public utility hub</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">Soapmaking tools that pass context forward</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">Use one tool without an account, or carry the same recipe and batch assumptions through sizing, costing, pricing, production, and purchasing. Each result states its inputs instead of hiding defaults.</p>

        <div className="mt-12 space-y-14">
          {groups.map((group) => (
            <section key={group.title} aria-labelledby={group.title.toLowerCase().replaceAll(" ", "-")}>
              <div className="max-w-3xl">
                <h2 id={group.title.toLowerCase().replaceAll(" ", "-")} className="font-display text-2xl font-bold text-foreground md:text-3xl">{group.title}</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{group.description}</p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {group.tools.map(([name, href, description]) => (
                  <Link key={href} href={href} className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-action/50 hover:bg-muted">
                    <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-action">{name}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
                    <span className="mt-5 inline-block text-sm font-semibold text-action">Open tool →</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
