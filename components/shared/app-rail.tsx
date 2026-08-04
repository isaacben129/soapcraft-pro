// ── AppRail ──────────────────────────────────────────────
// Persistent navigation rail for the app shell.

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◆" },
  { href: "/recipes", label: "Recipes", icon: "📋" },
  { href: "/batches", label: "Batches", icon: "📦" },
  { href: "/cure", label: "Cure", icon: "🌿" },
  { href: "/costing", label: "Costing", icon: "💰" },
];

export function AppRail() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 border-r border-border bg-canvas flex flex-col items-center py-4 gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            aria-label={item.label}
            title={item.label}
          >
            {item.icon}
          </Link>
        );
      })}
    </aside>
  );
}
