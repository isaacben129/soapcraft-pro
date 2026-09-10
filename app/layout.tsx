import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { Footer, Navbar } from "@/components/shared";
import { SITE_URL } from "@/lib/seo/site-url";
import "./globals.css";

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
    <html lang="en" className="font-sans">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Navbar />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
