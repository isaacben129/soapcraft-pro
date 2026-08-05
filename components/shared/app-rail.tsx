// ── AppRail ──────────────────────────────────────────────
// Persistent navigation rail for the app shell.
// Uses Lucide icons per DESIGN.md §4.5 (no emoji brand).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Package, Leaf, DollarSign } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recipes", label: "Recipes", icon: BookOpen },
  { href: "/batches", label: "Batches", icon: Package },
  { href: "/cure", label: "Cure", icon: Leaf },
  { href: "/costing", label: "Costing", icon: DollarSign },
];

export function AppRail() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 border-r border-rule bg-rail flex flex-col items-center py-4 gap-1" aria-label="Main navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
              isActive
                ? "bg-action text-action-text"
                : "text-rail-muted hover:text-rail-foreground hover:bg-rail/80"
            }`}
            aria-label={item.label}
            title={item.label}
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
    </aside>
  );
}