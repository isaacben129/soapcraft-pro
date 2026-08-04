import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoapCraft Pro — Workspace",
  description:
    "Your recipe, batch, and profitability workspace.",
};

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* App rail */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 border-r border-border bg-umber-charcoal flex flex-col items-center py-4 gap-2">
        <a
          href="/dashboard"
          className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Dashboard"
        >
          <span className="text-lg">◆</span>
        </a>
        <a
          href="/recipes"
          className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Recipes"
        >
          <span className="text-sm">📋</span>
        </a>
        <a
          href="/batches"
          className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Batches"
        >
          <span className="text-sm">📦</span>
        </a>
        <a
          href="/cure"
          className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Cure"
        >
          <span className="text-sm">🌿</span>
        </a>
        <a
          href="/costing"
          className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Costing"
        >
          <span className="text-sm">💰</span>
        </a>
      </aside>

      {/* Main content */}
      <main className="ml-16 flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
