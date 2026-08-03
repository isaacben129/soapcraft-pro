import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoapCraft Pro — Recipe, Batch & Profitability Workspace",
  description: "Deterministic lye calculations, guided batch production, cure tracking, and cost-per-bar analysis for serious soap makers.",
  openGraph: {
    title: "SoapCraft Pro",
    description: "The soap maker's workspace — verified calculations, batch tracking, and cost analysis.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-sans">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <a href="/" className="flex items-center gap-2 font-display font-bold tracking-tight">
                <span className="text-xl">🧼</span>
                <span>SoapCraft Pro</span>
              </a>
              <nav className="flex items-center gap-4 text-sm">
                <a href="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">Recipes</a>
                <a href="/batches" className="text-muted-foreground hover:text-foreground transition-colors">Batches</a>
                <a href="/cure" className="text-muted-foreground hover:text-foreground transition-colors">Cure</a>
                <a href="/costing" className="text-muted-foreground hover:text-foreground transition-colors">Costing</a>
                <a href="/library" className="text-muted-foreground hover:text-foreground transition-colors">Library</a>
              </nav>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
          <footer className="border-t py-4 text-center text-xs text-muted-foreground">
            SoapCraft Pro — Deterministic calculations, not AI guesswork.
          </footer>
        </div>
      </body>
    </html>
  );
}
