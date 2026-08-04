import type { Metadata } from "next";

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
  robots: {
    index: true,
    follow: true,
  },
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
      {/* Marketing header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a
            href="/"
            className="flex items-center gap-2 font-display font-bold tracking-tight text-lg"
          >
            <span className="text-2xl">◆</span>
            <span>SoapCraft Pro</span>
          </a>
          <nav
            className="flex items-center gap-6 text-sm"
            aria-label="Marketing navigation"
          >
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="/pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </a>
            <a
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 shadow-sm"
            >
              Log in
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Marketing footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <p className="font-display font-semibold text-foreground mb-2">
                SoapCraft Pro
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Deterministic calculations, not AI guesswork. The soap
                maker&apos;s workspace for recipe, batch, and profitability.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Homepage
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/auth/login"
                    className="hover:text-foreground transition-colors"
                  >
                    Log in
                  </a>
                </li>
                <li>
                  <a
                    href="/auth/signup"
                    className="hover:text-foreground transition-colors"
                  >
                    Sign up
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} SoapCraft Pro. All rights
              reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Deterministic calculations, not AI guesswork.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
