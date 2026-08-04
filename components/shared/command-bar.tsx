// ── CommandBar ───────────────────────────────────────────
// Quick command palette for keyboard-driven navigation.

"use client";

import { useState, useEffect } from "react";

const commands = [
  { label: "Dashboard", href: "/dashboard", shortcut: "⌘+D" },
  { label: "Recipes", href: "/recipes", shortcut: "⌘+R" },
  { label: "Batches", href: "/batches", shortcut: "⌘+B" },
  { label: "Cure", href: "/cure", shortcut: "⌘+C" },
  { label: "Costing", href: "/costing", shortcut: "⌘+K" },
  { label: "New Recipe", href: "/recipes/new", shortcut: "⌘+N" },
];

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-border bg-canvas px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted transition-colors"
        aria-label="Open command palette"
      >
        Search... <span className="ml-auto text-xs opacity-50">⌘K</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg bg-canvas border border-border rounded-xl shadow-elevation-3 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command..."
              className="w-full px-4 py-3 border-b border-border bg-canvas text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <ul className="max-h-64 overflow-auto">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-muted-foreground">No results</li>
              ) : (
                filtered.map((cmd) => (
                  <li key={cmd.href}>
                    <a
                      href={cmd.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-foreground hover:bg-muted transition-colors"
                    >
                      <span>{cmd.label}</span>
                      <span className="text-xs text-muted-foreground">{cmd.shortcut}</span>
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
