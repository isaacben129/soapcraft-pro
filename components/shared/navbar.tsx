// ── Navbar ──────────────────────────────────
// Top-level navigation for the public site.
// Uses Lucide icons per DESIGN.md §4.5 (no emoji brand).
// SLICE-001: Removed pricing, subscription, and marketing routes from navigation.

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calculator, FlaskConical, ArrowRight } from "lucide-react";

const navItems = [
  { href: "/tools", label: "All tools", icon: Calculator },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-rule bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-ink hover:text-action transition-colors">
            <FlaskConical aria-hidden="true" className="h-5 w-5 text-action" />
            <span>SoapCraft Pro</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-action/10 text-action" : "text-ink-muted hover:text-ink hover:bg-ledger"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-action text-action-text rounded-md font-medium hover:bg-action-hover transition-colors text-sm"
            >
              Open tools
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-md text-ink-muted hover:text-ink hover:bg-ledger transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/95 backdrop-blur" />
          <nav className="absolute top-16 left-0 right-0 p-4 space-y-1" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium ${
                    isActive ? "bg-action/10 text-action" : "text-ink-muted hover:text-ink hover:bg-ledger"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/tools"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-md text-sm font-medium bg-action text-action-text text-center mt-2"
            >
              Open tools
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
