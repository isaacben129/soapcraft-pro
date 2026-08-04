// ── Batches Portfolio ──────────────────
// R4.2: List/filter/status/next action,
// minimal dashboard active-pipeline query/rows for current batches.

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ObjectHeader } from "@/components/shared/object-header";
import { StatusLabel } from "@/components/shared/status-label";
import { EmptyState } from "@/components/shared/empty-state";
import { AttentionRow } from "@/components/shared/attention-row";

interface Batch {
  id: string;
  name: string;
  recipeName: string;
  version: number;
  lifecycleStatus: "draft" | "making" | "curing" | "completed" | "archived";
  startedAt: string;
  currentDay: number;
  yieldBars: number;
  costStatus: "complete" | "incomplete";
  nextAction: string;
  updatedAt: string;
}

const mockBatches: Batch[] = [
  {
    id: "1",
    name: "Olive & Coconut — Batch 1",
    recipeName: "Simple Castile",
    version: 1,
    lifecycleStatus: "making",
    startedAt: "2026-07-20",
    currentDay: 2,
    yieldBars: 10,
    costStatus: "incomplete",
    nextAction: "Check trace and pour",
    updatedAt: "2026-07-22",
  },
  {
    id: "2",
    name: "Shea Butter Blend — Batch 1",
    recipeName: "Luxury Shea",
    version: 2,
    lifecycleStatus: "curing",
    startedAt: "2026-07-18",
    currentDay: 5,
    yieldBars: 8,
    costStatus: "complete",
    nextAction: "Log observation",
    updatedAt: "2026-07-23",
  },
  {
    id: "3",
    name: "Castile Reserve — Batch 1",
    recipeName: "Simple Castile",
    version: 1,
    lifecycleStatus: "completed",
    startedAt: "2026-07-10",
    currentDay: 14,
    yieldBars: 12,
    costStatus: "complete",
    nextAction: "Archive",
    updatedAt: "2026-07-24",
  },
];

const statusFilters = ["all", "making", "curing", "completed", "draft", "archived"] as const;

export default function BatchesPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockBatches.filter((b) => {
      const matchesFilter = filter === "all" || b.lifecycleStatus === filter;
      const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  // Active pipeline: current batches (making + curing)
  const activePipeline = mockBatches.filter(
    (b) => b.lifecycleStatus === "making" || b.lifecycleStatus === "curing"
  );

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <ObjectHeader
            title="Batches"
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Batches" }]}
            action={
              <Link
                href="/batches/new"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                New Batch
              </Link>
            }
          />

          {/* Active pipeline (dashboard) */}
          {activePipeline.length > 0 && (
            <section className="mt-8" aria-label="Active pipeline">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Active Pipeline
              </h2>
              <div className="space-y-3">
                {activePipeline.map((batch) => (
                  <Link
                    key={batch.id}
                    href={`/batches/${batch.id}`}
                    className="block p-4 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-foreground">
                          {batch.name}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          v{batch.version} — {batch.recipeName}
                        </span>
                      </div>
                      <StatusLabel
                        status={
                          batch.lifecycleStatus === "making"
                            ? "pending"
                            : "active"
                        }
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Day {batch.currentDay}</span>
                      <span aria-hidden="true">·</span>
                      <span>{batch.yieldBars} bars</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-primary font-medium">
                        → {batch.nextAction}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Filters */}
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search batches..."
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground"
            />
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filter === s
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Batch list */}
          <div className="mt-6 space-y-3">
            {filtered.length === 0 ? (
              <EmptyState
                title="No batches found"
                description={
                  search
                    ? "No batches match your search."
                    : filter === "all"
                    ? "Start a batch from a recipe to track your production."
                    : `No ${filter} batches.`
                }
                action={
                  search || filter !== "all" ? undefined : (
                    <Link
                      href="/batches/new"
                      className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Start a Batch
                    </Link>
                  )
                }
              />
            ) : (
              filtered.map((batch) => (
                <Link
                  key={batch.id}
                  href={`/batches/${batch.id}`}
                  className="block p-4 rounded-lg border bg-card hover:shadow-elevation-1 transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">
                        {batch.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{batch.recipeName}</span>
                        <span aria-hidden="true">·</span>
                        <span>v{batch.version}</span>
                        <span aria-hidden="true">·</span>
                        <span>{batch.yieldBars} bars</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusLabel
                        status={
                          batch.lifecycleStatus === "making"
                            ? "pending"
                            : batch.lifecycleStatus === "curing"
                            ? "active"
                            : batch.lifecycleStatus === "completed"
                            ? "complete"
                            : batch.lifecycleStatus === "archived"
                            ? "canceled"
                            : "draft"
                        }
                      />
                      {batch.costStatus === "incomplete" && (
                        <span className="text-xs text-warning">Cost incomplete</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Started {batch.startedAt}
                    </span>
                    {batch.lifecycleStatus === "making" && (
                      <span className="text-muted-foreground">
                        Day {batch.currentDay}
                      </span>
                    )}
                    {batch.lifecycleStatus === "curing" && (
                      <span className="text-muted-foreground">
                        Day {batch.currentDay} of cure
                      </span>
                    )}
                    <span className="ml-auto text-primary font-medium">
                      {batch.nextAction} →
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
