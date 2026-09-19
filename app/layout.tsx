import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { Providers } from "@/app/providers";
import { Footer, Navbar, JsonLd } from "@/components/shared";
import { SITE_URL } from "@/lib/seo/site-url";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SoapCraft Pro — Recipe, Batch & Profitability Workspace",
  description:
    "Deterministic lye calculations, guided batch production, cure tracking, and cost-per-bar analysis for serious soap makers.",
  openGraph: {
    title: "SoapCraft Pro",
    description:
      "The soap maker's workspace — verified calculations, batch tracking, and cost analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} font-sans`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Navbar />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
