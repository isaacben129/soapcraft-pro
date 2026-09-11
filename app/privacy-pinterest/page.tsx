import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy — Pinterest Integration",
  description:
    "How SoapCraft Pro collects, processes, and shares data when connecting to Pinterest via Postiz. Covers data categories, third-party disclosures, international transfers, and your privacy rights.",
  path: "/privacy-pinterest",
});

export default function PinterestPrivacyPage() {
  return (
    <main className="min-h-screen"><article className="container mx-auto max-w-3xl px-4 py-14 md:py-20 prose prose-neutral dark:prose-invert">
      <h1>Privacy Policy — Pinterest Integration</h1>
      <p><strong>Effective Date: September 9, 2026.</strong></p>

      <p>This Privacy Policy — Pinterest Integration ("Pinterest Privacy Policy") governs how SoapCraft Pro, Inc. ("we," "our," or "SoapCraft Pro") collects, processes, stores, and shares personal data in connection with the integration of SoapCraft Pro's services with the Pinterest social media platform ("Pinterest"), administered through the Postiz scheduling platform ("Postiz"). This policy supplements, and is read in conjunction with, the main SoapCraft Pro Privacy Policy. Capitalized terms not defined herein shall have the meanings set forth in the main SoapCraft Pro Privacy Policy and the SoapCraft Pro Terms of Use.</p>

      <h2>1. Definitions</h2>
      <dl>
        <dt>"Pinterest Integration"</dt>
        <dd>The feature enabling users to connect their SoapCraft Pro account to Pinterest through Postiz, permitting the scheduling, publishing, and management of Pinterest Pins and Boards.</dd>
        <dt>"Personal Data"</dt>
        <dd>Any information relating to an identified or identifiable natural person, including but not limited to account identifiers, authentication tokens, content metadata, and usage analytics.</dd>
        <dt>"Postiz"</dt>
        <dd>Postiz, Inc., the third-party social media scheduling platform that serves as the intermediary between SoapCraft Pro and Pinterest, handling authentication, API requests, and token management.</dd>
        <dt>"Pinterest App"</dt>
        <dd>The developer application registered by SoapCraft Pro with Pinterest's Developer Platform, identified under Pinterest's Developer Dashboard.</dd>
      </dl>

      <h2>2. Data Controller and Responsibilities</h2>
      <p>SoapCraft Pro acts as the data controller for Personal Data collected and processed through SoapCraft Pro's core services. When the Pinterest Integration is enabled, SoapCraft Pro and Postiz may each act as separate data controllers or joint data controllers depending on the nature of the data and the purposes of processing. Pinterest, as the recipient platform, acts independently as a data controller for data received through its platform.</p>

      <h2>3. Categories of Personal Data Processed</h2>
      <p>Through the Pinterest Integration, the following categories of Personal Data may be collected, processed, or transmitted:</p>
      <ul>
        <li><strong>Account identifiers:</strong> Pinterest user ID, authentication tokens, OAuth credentials, and connection metadata managed by Postiz.</li>
        <li><strong>Content data:</strong> Pins, descriptions, image URLs, link metadata, board assignments, and scheduling parameters initiated through SoapCraft Pro.</li>
        <li><strong>Usage and analytics data:</strong> Pin impressions, saves, clicks, engagement metrics, and scheduling history returned by Pinterest's API.</li>
        <li><strong>Technical data:</strong> IP addresses, device information, browser characteristics, and diagnostic logs generated during API interactions.</li>
        <li><strong>Communication data:</strong> Email addresses and notification preferences related to Pinterest integration status and scheduling confirmations.</li>
      </ul>

      <h2>4. Legal Basis for Processing</h2>
      <p>We process Personal Data through the Pinterest Integration on the following legal bases:</p>
      <ul>
        <li><strong>Consent:</strong> Where you have explicitly authorized the connection of your Pinterest account through Postiz and consented to data processing as described herein.</li>
        <li><strong>Contractual necessity:</strong> Where processing is necessary to perform the Pinterest Integration service as agreed between you and SoapCraft Pro.</li>
        <li><strong>Legitimate interests:</strong> Where processing serves our legitimate interests in operating the service, preventing abuse, improving functionality, and measuring integration performance, provided such interests do not override your fundamental rights and freedoms.</li>
        <li><strong>Legal obligation:</strong> Where processing is required to comply with applicable data protection, tax, accounting, or other legal obligations.</li>
      </ul>

      <h2>5. Data Sharing and Third-Party Disclosures</h2>
      <p>Your Personal Data may be shared with the following categories of recipients:</p>
      <ul>
        <li><strong>Postiz:</strong> As the intermediary platform, Postiz processes authentication credentials and API requests on behalf of SoapCraft Pro. Postiz's data handling practices are governed by its own privacy policy available at <a href="https://postiz.com/privacy-policy">https://postiz.com/privacy-policy</a>.</li>
        <li><strong>Pinterest:</strong> Content, metadata, and engagement data transmitted to Pinterest are subject to Pinterest's privacy practices, developer guidelines, and terms of service. We encourage you to review Pinterest's privacy policy at <a href="https://policy.pinterest.com/en">https://policy.pinterest.com/en</a>.</li>
        <li><strong>Service providers:</strong> Hosting, analytics (including PostHog), authentication, and payment processing providers who assist in operating the integration.</li>
        <li><strong>Legal authorities:</strong> Where disclosure is required by law, court order, or government investigation.</li>
      </ul>

      <h2>6. International Data Transfers</h2>
      <p>Your Personal Data may be transferred to, processed in, and stored in countries other than your jurisdiction of residence, including the United States and other jurisdictions where our service providers operate. We ensure that such transfers are conducted in accordance with applicable data protection laws and rely on appropriate safeguards, including Standard Contractual Clauses where required.</p>

      <h2>7. Data Retention</h2>
      <p>Personal Data collected through the Pinterest Integration is retained for as long as necessary to fulfill the purposes for which it was collected, including: (a) maintaining the active Pinterest connection; (b) preserving scheduling and publishing history; (c) complying with legal or accounting obligations; and (d) defending legal claims. Upon disconnection of the Pinterest Integration, authentication tokens are revoked and Personal Data associated with the connection is scheduled for deletion or anonymization within 90 days, unless retention is required by law.</p>

      <h2>8. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li><strong>Access:</strong> Obtain a copy of your Personal Data processed through the Pinterest Integration.</li>
        <li><strong>Rectification:</strong> Correct inaccurate or incomplete Personal Data.</li>
        <li><strong>Erasure:</strong> Request deletion of your Personal Data, subject to legal retention exceptions.</li>
        <li><strong>Restriction:</strong> Restrict processing of certain data.</li>
        <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
        <li><strong>Objection:</strong> Object to processing based on legitimate interests or direct marketing.</li>
        <li><strong>Withdrawal of consent:</strong> Withdraw consent at any time without affecting the lawfulness of prior processing.</li>
        <li><strong>Complaint:</strong> Lodge a complaint with a competent data protection authority.</li>
      </ul>
      <p>To exercise any of these rights, contact us at <a href="mailto:support@soapcraft.pro">support@soapcraft.pro</a>.</p>

      <h2>9. Security Measures</h2>
      <p>We implement appropriate technical and organizational measures to protect Personal Data processed through the Pinterest Integration against unauthorized access, disclosure, alteration, or destruction, including: encrypted transmission (TLS/HTTPS), signed OAuth callbacks, access controls, regular security audits, and credential rotation protocols. However, no transmission method over the internet or electronic storage method is 100% secure, and we cannot guarantee absolute security.</p>

      <h2>10. Children's Privacy</h2>
      <p>Our services are not directed to individuals under the age of 16 (or the age of digital consent in your jurisdiction). We do not knowingly collect or process the Personal Data of minors through the Pinterest Integration. If you believe we have inadvertently collected such data, please contact us immediately at <a href="mailto:support@soapcraft.pro">support@soapcraft.pro</a>.</p>

      <h2>11. Changes to This Policy</h2>
      <p>We may update this Pinterest Privacy Policy to reflect changes in the integration, Pinterest's platform policies, applicable data protection laws, or our operational practices. We will notify users of material changes via email or through the SoapCraft Pro interface. Continued use of the Pinterest Integration following notification constitutes acceptance of the updated policy.</p>

      <h2>12. Governing Law and Dispute Resolution</h2>
      <p>This Privacy Policy shall be governed by and construed in accordance with the laws of the jurisdiction in which SoapCraft Pro is incorporated, without regard to its conflict of law provisions. Disputes arising from or in connection with this Privacy Policy shall be resolved through the dispute resolution mechanisms available in the main SoapCraft Pro Terms of Use.</p>

      <h2>13. Contact</h2>
      <p>For questions about this Privacy Policy, your data rights, or to submit a data request, contact:</p>
      <p><a href="mailto:support@soapcraft.pro">support@soapcraft.pro</a><br/>
      SoapCraft Pro<br/>
      For Pinterest-specific data inquiries, you may also contact Pinterest's Data Protection Officer through <a href="https://help.pinterest.com/">https://help.pinterest.com/</a>.</p>
    </article></main>
  );
}
