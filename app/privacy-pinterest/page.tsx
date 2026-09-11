import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy — Pinterest Integration",
  description:
    "How SoapCraft Pro handles data shared with Pinterest when connecting your account via Postiz. Covers data collection, Pinterest API access, and third-party privacy obligations.",
  path: "/privacy-pinterest",
});

export default function PinterestPrivacyPage() {
  return (
    <main className="min-h-screen"><article className="container mx-auto max-w-3xl px-4 py-14 md:py-20 prose prose-neutral dark:prose-invert">
      <h1>Privacy Policy — Pinterest Integration</h1>
      <p><strong>Effective date: September 9, 2026.</strong></p>
      <p>This privacy policy governs how SoapCraft Pro handles data that is shared with Pinterest when you connect your SoapCraft Pro account to Pinterest through Postiz. It supplements the main SoapCraft Pro Privacy Policy and addresses Pinterest-specific data practices.</p>

      <h2>1. Pinterest as a third-party platform</h2>
      <p>When you connect SoapCraft Pro to Pinterest via Postiz, Pinterest is a separate third-party platform governed by its own privacy policy and terms of service. Pinterest's handling of your data is subject to Pinterest's own privacy practices at <a href="https://policy.pinterest.com/en">https://policy.pinterest.com/en</a>. SoapCraft Pro does not control Pinterest's data practices.</p>

      <h2>2. Data shared with Pinterest</h2>
      <p>When you schedule or publish content to Pinterest through Postiz and SoapCraft Pro, the following data may be transmitted:</p>
      <ul>
        <li><strong>Content and media:</strong> Pins, images, descriptions, and links that you create, schedule, or publish through the SoapCraft Pro interface.</li>
        <li><strong>Account identifiers:</strong> Your Pinterest account identifier and authentication tokens used to authenticate the connection via Postiz.</li>
        <li><strong>Scheduling and publishing metadata:</strong> The timing, frequency, and content categories of your scheduled pins.</li>
        <li><strong>Analytics data:</strong> Pin impressions, clicks, saves, and engagement metrics returned by Pinterest.</li>
      </ul>

      <h2>3. Pinterest API and developer access</h2>
      <p>SoapCraft Pro accesses Pinterest's API through Postiz to read and write Pinterest data. Pinterest requires developers to create a Pinterest App in the Pinterest Developer Dashboard and comply with Pinterest's <a href="https://policy.pinterest.com/en/developer-guidelines">Developer Guidelines</a> and <a href="https://www.pinterest.com/terms/developer/">Developer Terms</a>. SoapCraft Pro's Pinterest App is registered with Pinterest and complies with these requirements.</p>

      <h2>4. Postiz as intermediary</h2>
      <p>Postiz acts as the intermediary platform between SoapCraft Pro and Pinterest. Postiz handles the authentication flow, token management, and API requests to Pinterest. Postiz's handling of your data is governed by Postiz's own privacy policy and terms of service at <a href="https://postiz.com/privacy-policy">https://postiz.com/privacy-policy</a>.</p>

      <h2>5. Data retention</h2>
      <p>Data transmitted to Pinterest through Postiz is retained according to Pinterest's own data retention policies. Pinterest may use aggregated, anonymized analytics data as permitted by its privacy policy. SoapCraft Pro does not retain Pinterest authentication tokens beyond the duration of the connection.</p>

      <h2>6. Your choices</h2>
      <p>You may disconnect your Pinterest account from SoapCraft Pro at any time through Postiz or the Pinterest Developer Dashboard. Disconnecting removes the authentication token and stops future data transmission. You may also request deletion of Pinterest-related data through Pinterest's own account settings.</p>

      <h2>7. Third-party obligations</h2>
      <p>When posting content to Pinterest, you represent that you have the rights to share the content and that it complies with Pinterest's Content Policies and Community Guidelines. SoapCraft Pro does not create, alter, or endorse Pinterest content beyond what you schedule or publish.</p>

      <h2>8. Changes to this policy</h2>
      <p>We may update this Pinterest-specific privacy policy to reflect changes in the integration, Pinterest's platform policies, or applicable law. Continued use of the Pinterest integration constitutes acceptance of updated terms.</p>

      <h2>9. Contact</h2>
      <p>For questions about this privacy policy or your Pinterest data, email <a href="mailto:support@soapcraft.pro">support@soapcraft.pro</a>. For Pinterest-specific data questions, contact Pinterest's support team at <a href="https://help.pinterest.com/">https://help.pinterest.com/</a>.</p>
    </article></main>
  );
}
