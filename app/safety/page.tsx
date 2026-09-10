import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({ title: "Soapmaking Safety Notice", description: "Safety boundaries for using SoapCraft Pro formulation and production tools.", path: "/safety" });

export default function SafetyPage() {
  return <main className="min-h-screen"><article className="container mx-auto max-w-3xl px-4 py-14 md:py-20 prose prose-neutral dark:prose-invert">
    <h1>Soapmaking safety notice</h1>
    <p><strong>Sodium hydroxide and potassium hydroxide can cause severe chemical burns and eye injury.</strong> Calculator results are not a substitute for training, supplier safety data, accurate scales, ventilation, protective equipment, or an independently reviewed manufacturing process.</p>
    <h2>Before making soap</h2><ul><li>Confirm every ingredient identity, unit, SAP source, concentration, and purity.</li><li>Recalculate the formula independently and compare the weighed alkali and water values.</li><li>Use appropriate eye, skin, and respiratory protection and follow the current safety data sheet for each material.</li><li>Keep children, pets, food, and incompatible materials away from the work area.</li><li>Add alkali according to a validated procedure. Do not improvise handling or mixing steps from a calculator output.</li></ul>
    <h2>What outputs do not establish</h2><p>A formulation result does not establish that a soap is safe for a particular person, compliant in a particular market, correctly preserved, free from allergens, or within a fragrance usage limit. Fragrance limits require the exact supplier certificate and the correct IFRA product category. Selling also requires the maker to satisfy local manufacturing, labeling, claims, tax, and consumer-protection rules.</p>
    <h2>Release controls</h2><p>Safety-critical chemistry routes fail closed unless their source manifest and release controls are approved. Non-chemistry business calculators remain available because they do not calculate caustic alkali quantities.</p>
    <p><Link href="/methodology">Read the calculation methodology</Link> or <Link href="/tools/formulation">check the formulation release status</Link>.</p>
  </article></main>;
}
