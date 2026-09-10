import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How SoapCraft Pro handles calculator inputs, account data, analytics, email, and payment information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="min-h-screen"><article className="container mx-auto max-w-3xl px-4 py-14 md:py-20 prose prose-neutral dark:prose-invert">
      <h1>Privacy policy</h1><p><strong>Effective date: September 9, 2026.</strong></p>
      <p>SoapCraft Pro is designed so core calculators can be used without creating an account. Calculator inputs may remain in your browser unless you deliberately save or submit them to an account feature.</p>
      <h2>Information we process</h2><ul><li><strong>Account data:</strong> email address, name, authentication records, and saved workspace records when you create an account.</li><li><strong>Tool and usage data:</strong> calculator events, page visits, device and browser information, and diagnostic data used to understand reliability and improve the service. We use PostHog for product analytics when configured.</li><li><strong>Email data:</strong> your address and consent record when you request a resource or opt into messages.</li><li><strong>Payment data:</strong> Dodo Payments processes checkout and payment credentials. SoapCraft Pro receives transaction and entitlement information, not full card details.</li></ul>
      <h2>How information is used</h2><p>We use information to run the requested tools, authenticate accounts, save records, deliver purchased resources, prevent abuse, diagnose failures, and measure whether the product works. We do not sell personal information.</p>
      <h2>Sharing and retention</h2><p>Information is shared only with service providers needed to operate the product, such as hosting, database, analytics, authentication, email, and payment providers. Records are retained only while needed for the service, security, legal obligations, or your requested account history.</p>
      <h2>Your choices</h2><p>You may use public calculators without an account, decline optional email, and request access, correction, export, or deletion of account data. Some transaction records may need to be retained for legal or accounting requirements.</p>
      <h2>Security and contact</h2><p>No online service can guarantee absolute security. We use access controls and signed provider callbacks, and we review release surfaces for credential exposure. For privacy questions or data requests, email <a href="mailto:support@soapcraft.pro">support@soapcraft.pro</a>.</p>
    </article></main>
  );
}
