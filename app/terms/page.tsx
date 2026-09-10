import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({ title: "Terms of Use", description: "Terms governing use of SoapCraft Pro calculators, records, content, and paid resources.", path: "/terms" });

export default function TermsPage() {
  return <main className="min-h-screen"><article className="container mx-auto max-w-3xl px-4 py-14 md:py-20 prose prose-neutral dark:prose-invert">
    <h1>Terms of use</h1><p><strong>Effective date: September 9, 2026.</strong></p>
    <p>By using SoapCraft Pro, you agree to these terms. If you do not agree, do not use the service.</p>
    <h2>Tools are decision support</h2><p>Calculator outputs depend on the inputs, units, material data, and assumptions you provide. Soapmaking involves caustic alkalis, heat, fragrance restrictions, and material variability. You remain responsible for checking measurements, supplier documentation, equipment, protective practices, local rules, labels, and the suitability of any formula before making or selling a product.</p>
    <h2>No professional guarantee</h2><p>SoapCraft Pro provides software and educational information, not chemical, medical, legal, tax, or regulatory advice. An output is not a certification of product safety, regulatory compliance, skin suitability, profitability, or manufacturing quality.</p>
    <h2>Accounts and acceptable use</h2><p>You are responsible for your account credentials and for activity under your account. Do not interfere with the service, attempt unauthorized access, upload unlawful material, or use the product to harm others.</p>
    <h2>Paid resources</h2><p>Any one-time paid resource will show its price and contents before checkout. Payment processing is provided by Dodo Payments. Purchase terms shown at checkout apply in addition to these terms.</p>
    <h2>Availability and liability</h2><p>We may correct, suspend, or change features when needed for safety, security, maintenance, or accuracy. To the maximum extent permitted by law, SoapCraft Pro is provided without warranties and is not liable for indirect, incidental, or consequential loss arising from use of calculator results.</p>
    <h2>Contact</h2><p>Questions about these terms can be sent to <a href="mailto:support@soapcraft.pro">support@soapcraft.pro</a>.</p>
  </article></main>;
}
