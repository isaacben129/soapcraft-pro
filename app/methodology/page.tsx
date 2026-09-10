import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({ title: "Calculation Methodology", description: "How SoapCraft Pro handles units, precision, SAP data, alkali purity, water modes, cost, margin, and uncertainty.", path: "/methodology" });

export default function MethodologyPage() {
  return <main className="min-h-screen"><article className="container mx-auto max-w-3xl px-4 py-14 md:py-20 prose prose-neutral dark:prose-invert">
    <h1>Calculation methodology</h1><p>SoapCraft Pro calculations are deterministic: the same versioned inputs produce the same outputs. The engine keeps full precision through the dependency chain and rounds only for display or export.</p>
    <h2>Formulation chemistry</h2><p>Oil percentages must total 100% and are converted to weights from an explicit target oil mass. Each oil's KOH-basis saponification factor is converted to a NaOH basis using the molecular-mass ratio. Superfat is applied once to the pure alkali demand. NaOH and KOH purity corrections are then applied independently so the result reports the actual as-supplied mass to weigh.</p>
    <p>Mixed-alkali input is defined as KOH's share of pure alkali equivalents, not KOH's apparent share of the final gram weights. Water-to-lye ratio and lye concentration use total as-supplied alkali; water as percent of oils uses oil mass.</p>
    <h2>Data provenance</h2><p>Production ingredient records require a stable identifier, KOH-basis value, source identifier, method, status, and reviewer state. Provisional or synthetic records may be used in tests but cannot authorize public chemistry. A public feature flag alone is not enough: selected ingredients must also be approved.</p>
    <h2>Sizing</h2><p>Mold geometry provides volume, not a universal soap mass. Material density and headspace vary. Capacity results should use a maker's calibrated mold density where available and otherwise remain clearly labeled estimates.</p>
    <h2>Cost and price</h2><p>Batch cost combines the costs supplied for ingredients, packaging, labor, overhead, waste, and yield. Markup and gross margin are different: markup compares profit to cost; gross margin compares profit to selling price. Missing cost bases must be shown rather than silently treated as complete.</p>
    <h2>Known boundaries</h2><p>Calculator outputs do not infer skin performance, guarantee regulatory compliance, or determine IFRA fragrance limits without the exact supplier certificate. See the safety notice before using any chemistry output.</p>
  </article></main>;
}
