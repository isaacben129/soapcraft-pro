import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service — Pinterest Integration",
  description:
    "Terms governing the use of SoapCraft Pro's Pinterest integration via Postiz. Covers Pinterest Developer Terms compliance, content licensing, and platform-specific obligations.",
  path: "/terms-pinterest",
});

export default function PinterestTermsPage() {
  return <main className="min-h-screen"><article className="container mx-auto max-w-3xl px-4 py-14 md:py-20 prose prose-neutral dark:prose-invert">
    <h1>Terms of Service — Pinterest Integration</h1>
    <p><strong>Effective date: September 9, 2026.</strong></p>
    <p>These terms govern your use of SoapCraft Pro's Pinterest integration feature, which connects your SoapCraft Pro account to Pinterest through the Postiz platform. These terms supplement the main SoapCraft Pro Terms of Use and address Pinterest-specific obligations.</p>

    <h2>1. Compliance with Pinterest terms</h2>
    <p>By using the Pinterest integration, you agree to comply with Pinterest's <a href="https://www.pinterest.com/terms/">Terms of Service</a>, <a href="https://policy.pinterest.com/en/developer-guidelines">Developer Guidelines</a>, and <a href="https://www.pinterest.com/en/prepolicy/guidelines/">Community Guidelines</a>. SoapCraft Pro operates under a Pinterest Developer App registered with Pinterest and must comply with these requirements on your behalf.</p>

    <h2>2. Content ownership and licensing</h2>
    <p>You retain ownership of all content you create, schedule, or publish through the Pinterest integration. When you pin content to Pinterest, you grant Pinterest a worldwide, non-exclusive, royalty-free license to display, distribute, and serve that content on Pinterest's platform as permitted by Pinterest's Terms of Service. SoapCraft Pro does not claim ownership of Pinterest content.</p>

    <h2>3. Acceptable use</h2>
    <p>You may not use the Pinterest integration to:</p>
    <ul>
      <li>Post content that violates Pinterest's Community Guidelines, including misleading information, spam, or inappropriate content.</li>
      <li>Automatically create Pinterest accounts or boards on behalf of others without explicit authorization.</li>
      <li>Scrape, harvest, or collect Pinterest user data beyond what the Pinterest API permits.</li>
      <li>Use the integration to manipulate Pinterest metrics, including impressions, saves, or engagement through artificial means.</li>
      <li>Impersonate another person or entity on Pinterest.</li>
    </ul>

    <h2>4. Rate limits and API usage</h2>
    <p>Pinterest imposes rate limits on API requests through its developer platform. SoapCraft Pro and Postiz operate within these limits. Excessive or abusive API usage may result in temporary or permanent restriction of the Pinterest integration.</p>

    <h2>5. Postiz as intermediary</h2>
    <p>Postiz serves as the scheduling and distribution platform between SoapCraft Pro and Pinterest. Your relationship with Postiz is governed by Postiz's own terms of service at <a href="https://postiz.com/terms-of-service">https://postiz.com/terms-of-service</a>. SoapCraft Pro does not control Postiz's operations, data handling, or service availability.</p>

    <h2>6. Content restrictions</h2>
    <p>Content posted to Pinterest must comply with Pinterest's content policies, including:</p>
    <ul>
      <li>No adult or sexually explicit content</li>
      <li>No misinformation or misleading claims about products, ingredients, or outcomes</li>
      <li>No copyrighted material without permission</li>
      <li>No content promoting self-harm, illegal activities, or dangerous practices</li>
      <li>Soapmaking content must include appropriate safety warnings where applicable</li>
    </ul>

    <h2>7. Account security</h2>
    <p>You are responsible for securing your Pinterest account credentials and for any activity that occurs under your account. SoapCraft Pro does not access your Pinterest account password — authentication is handled via OAuth tokens managed by Postiz. Do not share your Postiz or SoapCraft Pro credentials with anyone.</p>

    <h2>8. Termination</h2>
    <p>Either party may terminate the Pinterest integration at any time. You may disconnect your Pinterest account through Postiz or the Pinterest Developer Dashboard. Upon termination, SoapCraft Pro will stop accessing Pinterest on your behalf, but content already published on Pinterest will remain according to Pinterest's content policies.</p>

    <h2>9. Disclaimer of warranties</h2>
    <p>The Pinterest integration is provided "as is" without warranties of any kind, whether express or implied. SoapCraft Pro does not guarantee that scheduled pins will be published at the exact scheduled time, that content will be approved by Pinterest, or that engagement metrics will meet your expectations.</p>

    <h2>10. Limitation of liability</h2>
    <p>To the maximum extent permitted by law, SoapCraft Pro is not liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use the Pinterest integration, including lost revenue, lost data, or Pinterest account suspension.</p>

    <h2>11. Changes to these terms</h2>
    <p>We may update these terms to reflect changes in Pinterest's platform policies, API terms, or applicable law. Continued use of the Pinterest integration constitutes acceptance of updated terms.</p>

    <h2>12. Contact</h2>
    <p>Questions about these terms can be sent to <a href="mailto:support@soapcraft.pro">support@soapcraft.pro</a>. Pinterest-specific legal questions can be directed to Pinterest's legal team through <a href="https://help.pinterest.com/">https://help.pinterest.com/</a>.</p>
  </article></main>;
}
