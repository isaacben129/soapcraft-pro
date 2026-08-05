import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Package, Leaf, DollarSign, Settings, ChevronDown } from "lucide-react";

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
  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/recipes", label: "Recipes", icon: BookOpen },
    { href: "/batches", label: "Batches", icon: Package },
    { href: "/cure", label: "Cure", icon: Leaf },
    { href: "/costing", label: "Costing", icon: DollarSign },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* App rail */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 border-r border-rule bg-rail flex flex-col items-center py-4 gap-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="w-10 h-10 flex items-center justify-center rounded-md text-rail-muted hover:text-rail-foreground hover:bg-rail/80 transition-colors"
              aria-label={item.label}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}

        {/* Bottom region */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <Link
            href="/settings"
            className="w-10 h-10 flex items-center justify-center rounded-md text-rail-muted hover:text-rail-foreground hover:bg-rail/80 transition-colors"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-16 flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}