import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SoapCraft Pro — Recipe, Batch & Profitability Workspace",
  description:
    "Deterministic lye calculations, guided batch production, cure tracking, and cost-per-bar analysis for serious soap makers. Start free — no signup required.",
  openGraph: {
    title: "SoapCraft Pro — The Soap Maker's Workspace",
    description:
      "Verified calculations, batch tracking, and cost analysis. Start free with the calculator — no signup required.",
    type: "website",
    url: "https://soapcraft-pro.vercel.app",
    siteName: "SoapCraft Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoapCraft Pro — The Soap Maker's Workspace",
    description:
      "Deterministic lye calculations, guided batch production, cure tracking, and cost-per-bar analysis.",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://soapcraft-pro.vercel.app",
  },
};

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Marketing header — compact, one border/rule, no sticky-glass */}
      <header className="w-full border-b border-rule bg-sheet">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <a
            href="/"
            className="flex items-center gap-2 font-display font-bold tracking-tight text-ink"
          >
            <span className="text-action text-xl">◆</span>
            <span>SoapCraft Pro</span>
          </a>
          <nav
            className="hidden md:flex items-center gap-6 text-sm text-ink-muted"
            aria-label="Marketing navigation"
          >
            <a href="/" className="hover:text-ink transition-colors">
              Home
            </a>
            <a href="/marketing/pricing" className="hover:text-ink transition-colors">
              Pricing
            </a>
            <a href="/marketing/blog" className="hover:text-ink transition-colors">
              Blog
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-ink hover:underline"
            >
              Log in
            </Link>
            <Link
              href="/recipes/new"
              className="inline-flex items-center justify-center rounded-md bg-action px-4 py-2 text-sm font-medium text-action-text transition-opacity hover:opacity-90 shadow-sm"
            >
              Start a recipe
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Marketing footer */}
      <footer className="border-t border-rule py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <p className="font-display font-semibold text-ink mb-2">
                SoapCraft Pro
              </p>
              <p className="text-sm text-ink-muted leading-relaxed max-w-md">
                Deterministic calculations, not AI guesswork. The soap
                maker&apos;s workspace for recipe, batch, and profitability.
              </p>
            </div>
            <div>
              <h4 className="text-label font-semibold text-ink mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-ink-muted">
                <li>
                  <a href="/" className="hover:text-ink transition-colors">
                    Homepage
                  </a>
                </li>
                <li>
                  <a href="/marketing/pricing" className="hover:text-ink transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/marketing/blog" className="hover:text-ink transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-label font-semibold text-ink mb-3">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-ink-muted">
                <li>
                  <a href="/auth/login" className="hover:text-ink transition-colors">
                    Log in
                  </a>
                </li>
                <li>
                  <a href="/auth/signup" className="hover:text-ink transition-colors">
                    Sign up
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-rule pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-meta text-ink-muted">
              &copy; {new Date().getFullYear()} SoapCraft Pro. All rights reserved.
            </p>
            <p className="text-meta text-ink-muted">
              Deterministic calculations, not AI guesswork.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}