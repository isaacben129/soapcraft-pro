import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service — Pinterest Integration",
  description:
    "Terms governing the use of SoapCraft Pro's Pinterest integration via Postiz. Covers content licensing, acceptable use, Pinterest Developer compliance, indemnification, and liability limitations.",
  path: "/terms-pinterest",
});

export default function PinterestTermsPage() {
  return <main className="min-h-screen"><article className="container mx-auto max-w-3xl px-4 py-14 md:py-20 prose prose-neutral dark:prose-invert">
    <h1>Terms of Service — Pinterest Integration</h1>
    <p><strong>Effective Date: September 9, 2026.</strong></p>

    <p>These Terms of Service — Pinterest Integration ("Pinterest Terms") govern your use of the Pinterest Integration feature provided by SoapCraft Pro, Inc. ("SoapCraft Pro" or "we") through the Postiz scheduling platform ("Postiz"). These Terms supplement, and are read in conjunction with, the main SoapCraft Pro Terms of Use ("Master Terms"). Where these Pinterest Terms address matters specific to the Pinterest platform, they shall govern over the Master Terms to the extent of any conflict. Capitalized terms used herein but not defined shall have the meanings set forth in the Master Terms.</p>

    <h2>1. Definitions</h2>
    <dl>
      <dt>"Pinterest Integration"</dt>
      <dd>The feature enabling users to connect their SoapCraft Pro account to Pinterest via Postiz for the purpose of scheduling, creating, managing, and publishing Pinterest Pins and Boards.</dd>
      <dt>"Pinterest Developer Terms"</dt>
      <dd>Pinterest's <a href="https://www.pinterest.com/terms/developer/">Developer Terms</a> and <a href="https://policy.pinterest.com/en/developer-guidelines">Developer Guidelines</a>, as published and updated by Pinterest from time to time.</li></dt>
      <dt>"Pin"</dt>
      <dd>A piece of content saved or posted on Pinterest, consisting of an image, description, link, and associated metadata.</dd>
      <dt>"Board"</dt>
      <dd>A collection of Pins organized by a Pinterest user.</dd>
      <dt>"Postiz"</dt>
      <dd>Postiz, Inc., the third-party scheduling platform that facilitates the Pinterest Integration.</dd>
    </dl>

    <h2>2. Acceptance of Terms</h2>
    <p>By enabling, connecting, or using the Pinterest Integration, you ("you" or "your") agree to be bound by these Pinterest Terms, the Master Terms, and the Pinterest Developer Terms. If you do not agree to all of the foregoing, you may not use the Pinterest Integration. The Pinterest Integration is an optional feature; you may continue to use all other SoapCraft Pro services without enabling it.</p>

    <h2>3. Pinterest Developer Compliance</h2>
    <p>SoapCraft Pro operates the Pinterest Integration under a registered Pinterest Developer App and is bound by the Pinterest Developer Terms, which include, without limitation: (a) compliance with Pinterest's Platform Rules and Community Guidelines; (b) adherence to Pinterest's API rate limits and usage policies; (c) proper attribution of Pinterest content; (d) prohibition of unauthorized scraping, data harvesting, or reverse engineering of Pinterest's platform; and (e) compliance with Pinterest's advertising and content policies. SoapCraft Pro is responsible for maintaining its Pinterest Developer App in good standing and for complying with any Pinterest policy changes that may affect the integration.</p>

    <h2>4. Content License</h2>
    <p>You retain all right, title, and interest in and to any content you create, schedule, or publish through the Pinterest Integration ("Your Content"). You hereby grant Pinterest a worldwide, non-exclusive, royalty-free, fully sublicensable license to host, use, reproduce, modify, adapt, publish, translate, create derivative works of, distribute, and display Your Content on Pinterest's platform, solely as enabled by the Pinterest Integration and as permitted by Pinterest's Terms of Service. This license terminates upon disconnection of the Pinterest Integration or deletion of Your Content from Pinterest.</p>
    <p>You represent and warrant that: (a) You own or have sufficient rights to Your Content; (b) Your Content does not infringe any third-party intellectual property rights; (c) Your Content complies with all applicable laws and Pinterest's content policies; and (d) Your Content does not contain misleading, deceptive, or false information.</p>

    <h2>5. Acceptable Use</h2>
    <p>You may not use the Pinterest Integration to:</p>
    <ul>
      <li>Post, schedule, or promote content that violates Pinterest's Community Guidelines, including content that is misleading, spammy, or promotes illegal or harmful activities.</li>
      <li>Create, manage, or operate multiple Pinterest accounts without Pinterest's authorization.</li>
      <li>Use automated means to scrape, harvest, or collect Pinterest user data, content, or engagement metrics beyond what the Pinterest API permits.</li>
      <li>Manipulate, artificially inflate, or fraudulently generate Pinterest metrics including impressions, saves, clicks, or follower counts.</li>
      <li>Impersonate any person, entity, or brand on Pinterest.</li>
      <li>Use the Pinterest Integration for any purpose that violates applicable law or these Terms.</li>
      <li>Reverse engineer, decompile, or disassemble any component of the Pinterest Integration or Pinterest's platform.</li>
      <li>Use the Pinterest Integration to promote products or services that violate Pinterest's advertising policies, including unapproved financial products, adult content, or health claims without substantiation.</li>
    </ul>

    <h2>6. Content Restrictions — Soapmaking and Health-Related Content</h2>
    <p>Given SoapCraft Pro's focus on soapmaking and related products, the following additional restrictions apply to Pinterest content:</p>
    <ul>
      <li>Content must not make unsubstantiated health, safety, or efficacy claims about soap products, ingredients, or formulations.</li>
      <li>Content must include appropriate safety warnings regarding lye handling, caustic materials, and soapmaking processes where applicable.</li>
      <li>Content must not promote homemade soap as a replacement for professional medical, dermatological, or pharmaceutical treatment.</li>
      <li>Content must not contain false or misleading pricing, cost, or profitability claims.</li>
      <li>Content must comply with Pinterest's policies regarding regulated products, including cosmetics and personal care items.</li>
    </ul>

    <h2>7. Postiz as Intermediary</h2>
    <p>Postiz serves as the scheduling and distribution platform between SoapCraft Pro and Pinterest. Postiz handles authentication, token management, API requests, and content delivery to Pinterest. Your relationship with Postiz is governed by Postiz's own terms of service at <a href="https://postiz.com/terms-of-service">https://postiz.com/terms-of-service</a> and its privacy policy at <a href="https://postiz.com/privacy-policy">https://postiz.com/privacy-policy</a>. SoapCraft Pro does not control Postiz's operations, data handling, service availability, or content moderation decisions.</p>

    <h2>8. Account Security</h2>
    <p>You are solely responsible for: (a) the security of your SoapCraft Pro account, Pinterest account, and Postiz account; (b) any activity that occurs under your accounts; and (c) maintaining the confidentiality of your credentials. Authentication to Pinterest is handled exclusively through OAuth tokens managed by Postiz; SoapCraft Pro does not access your Pinterest login credentials. You agree to notify SoapCraft Pro immediately upon becoming aware of any unauthorized access to your accounts.</p>

    <h2>9. Termination and Disconnection</h2>
    <p>Either party may terminate the Pinterest Integration at any time:</p>
    <ul>
      <li><strong>By you:</strong> Disconnect your Pinterest account through the Postiz dashboard or the Pinterest Developer Dashboard. Upon disconnection, SoapCraft Pro will cease all API access to your Pinterest data.</li>
      <li><strong>By SoapCraft Pro:</strong> Suspend or terminate the Pinterest Integration if you violate these Terms, the Master Terms, or the Pinterest Developer Terms. SoapCraft Pro will provide reasonable prior notice where legally required.</li>
    </ul>
    <p>Upon termination, content already published on Pinterest remains subject to Pinterest's Terms of Service and Pinterest's content policies. SoapCraft Pro has no control over Pinterest's retention, display, or removal of published content.</p>

    <h2>10. Disclaimer of Warranties</h2>
    <p>The Pinterest Integration is provided on an "as is" and "as available" basis, without warranties of any kind, whether express or implied, including but not limited to: (a) warranties of merchantability and fitness for a particular purpose; (b) warranties that scheduled Pins will be published at the specified time or in the specified manner; (c) warranties that content will be approved, featured, or promoted by Pinterest; (d) warranties regarding Pinterest engagement metrics, reach, or impressions; and (e) warranties that the integration will be uninterrupted, error-free, or secure.</p>

    <h2>11. Limitation of Liability</h2>
    <p>To the maximum extent permitted by applicable law, neither SoapCraft Pro, Postiz, nor Pinterest shall be liable for any indirect, incidental, special, consequential, or exemplary damages arising from or in connection with the Pinterest Integration, including but not limited to: lost revenue, lost profits, lost data, loss of goodwill, or business interruption, regardless of the theory of liability (contract, tort, negligence, or otherwise), even if we have been advised of the possibility of such damages.</p>
    <p>In no event shall SoapCraft Pro's total liability arising from the Pinterest Integration exceed the aggregate fees paid by you to SoapCraft Pro in the twelve (12) months preceding the claim.</p>

    <h2>12. Indemnification</h2>
    <p>You agree to indemnify, defend, and hold harmless SoapCraft Pro, its officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees and court costs) arising out of or related to: (a) Your use of the Pinterest Integration; (b) Your Content; (c) Your violation of these Terms, the Master Terms, or the Pinterest Developer Terms; (d) Your infringement of any third-party intellectual property or other rights; or (e) any claims made by third parties (including Pinterest) arising from your use of the Pinterest Integration.</p>

    <h2>13. Intellectual Property</h2>
    <p>SoapCraft Pro and its licensors retain all right, title, and interest in and to the Pinterest Integration, including the software, algorithms, and infrastructure enabling the feature. Nothing in these Terms grants you any right, title, or interest in SoapCraft Pro's trademarks, service marks, logos, or trade dress except as expressly authorized. Pinterest's trademarks and intellectual property remain the exclusive property of Pinterest.</p>

    <h2>14. Changes to These Terms</h2>
    <p>We may modify these Pinterest Terms at any time in our sole discretion. Material changes will be communicated via email or through the SoapCraft Pro interface at least 30 days prior to effectiveness. Continued use of the Pinterest Integration following material changes constitutes acceptance of the revised terms. You may terminate the Pinterest Integration if you do not accept the revised terms.</p>

    <h2>15. Governing Law and Jurisdiction</h2>
    <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which SoapCraft Pro is incorporated, without regard to its conflict of law provisions. Any disputes arising from or in connection with these Terms shall be submitted to the exclusive jurisdiction of the courts of the jurisdiction in which SoapCraft Pro is located.</p>

    <h2>16. Severability</h2>
    <p>If any provision of these Terms is found to be unenforceable or invalid by a court of competent jurisdiction, such finding shall not affect the validity of the remaining provisions, which shall continue to be fully enforceable.</p>

    <h2>17. Entire Agreement</h2>
    <p>These Pinterest Terms, together with the Master Terms and the Pinterest Developer Terms, constitute the entire agreement between you and SoapCraft Pro regarding the Pinterest Integration and supersede all prior or contemporaneous agreements, representations, and understandings, whether written or oral, relating to such subject matter.</p>

    <h2>18. Contact</h2>
    <p>For questions about these Terms, to report violations, or to exercise any rights under these Terms, contact:</p>
    <p><a href="mailto:support@soapcraft.pro">support@soapcraft.pro</a><br/>
    SoapCraft Pro, Inc.<br/>
    For Pinterest-specific legal questions, you may contact Pinterest's legal team at <a href="https://help.pinterest.com/">https://help.pinterest.com/</a>.</p>
  </article></main>;
}
