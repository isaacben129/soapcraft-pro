// ── MobileNav ────────────────────────────────────────────
// Mobile navigation with command bar trigger.

"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◆" },
  { href: "/recipes", label: "Recipes", icon: "📋" },
  { href: "/batches", label: "Batches", icon: "📦" },
  { href: "/cure", label: "Cure", icon: "🌿" },
  { href: "/costing", label: "Costing", icon: "💰" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-elevation-2 flex items-center justify-center text-lg"
        aria-label="Open navigation"
      >
        ☰
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <nav
            className="fixed bottom-0 left-0 right-0 bg-canvas border-t border-border rounded-t-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg font-bold">Navigation</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground" aria-label="Close navigation">
                ✕
              </button>
            </div>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
