// ── MobileNav ────────────────────────────────────────────
// Mobile navigation with command bar trigger.
// Uses Lucide icons per DESIGN.md §4.5 (no emoji brand).

"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Package, Leaf, DollarSign, X } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recipes", label: "Recipes", icon: BookOpen },
  { href: "/batches", label: "Batches", icon: Package },
  { href: "/cure", label: "Cure", icon: Leaf },
  { href: "/costing", label: "Costing", icon: DollarSign },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-action text-action-text shadow-elevation-2 flex items-center justify-center"
        aria-label="Open navigation"
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <nav
            className="fixed bottom-0 left-0 right-0 bg-canvas border-t border-rule rounded-t-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg font-bold text-ink">Navigation</h2>
              <button onClick={() => setOpen(false)} className="text-ink-muted" aria-label="Close navigation">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-ink hover:bg-ledger transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}