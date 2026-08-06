// ── DashboardHeader ──────────────────────────────
// Top header bar for the SaaS dashboard.
// Includes command palette trigger, search, and user menu.

"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, User, ChevronDown, LogOut } from "lucide-react";
import { CommandBar } from "@/components/shared/command-bar";

export function DashboardHeader() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-canvas border-b border-rule">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: page title */}
        <div className="flex items-center gap-3">
          <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            SoapCraft Pro
          </span>
        </div>

        {/* Center: command palette trigger */}
        <div className="hidden md:block w-72">
          <CommandBar />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 w-9 h-9 rounded-md hover:bg-muted transition-colors"
              aria-label="User menu"
            >
              <div className="w-7 h-7 rounded-full bg-action flex items-center justify-center text-action-text text-xs font-bold">
                S
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-elevation-3 py-1 z-50">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Settings
                </Link>
                <hr className="my-1 border-rule" />
                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors text-left">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
