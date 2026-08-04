// ── Cure Portfolio ──────────────────────
// R5.2: Due/overdue/curing/estimated-window-reached/completed groups,
// observation sheet, timeline/trends, next observation date, Mark ready.
// End-to-end: curing batch → observation → dashboard updates → mark ready → yield request.

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ObjectHeader } from "@/components/shared/object-header";
import { StatusLabel } from "@/components/shared/status-label";
import { EmptyState } from "@/components/shared/empty-state";
import { AttentionRow } from "@/components/shared/attention-row";
import { LedgerRow } from "@/components/shared/ledger-row";

interface CureObservation {
  id: string;
  day: number;
  note: string;
  temperature?: number;
  hardness?: number;
  color?: string;
  scent?: string;
  observedAt: string;
}

interface Batch {
  id: string;
  name: string;
  recipeName: string;
  version: number;
  status: "curing" | "ready" | "completed";
  cureStartedAt: string;
  currentDay: number;
  estimatedCureDays: number;
  observations: CureObservation[];
  nextObservationDate: string;
  yieldRequested: boolean;
  yieldRequestedAt: string | null;
}

const mockBatches: Batch[] = [
  {
    id: "1",
    name: "Olive & Coconut — Batch 1",
    recipeName: "Simple Castile",
    version: 1,
    status: "curing",
    cureStartedAt: "2026-07-20",
    currentDay: 5,
    estimatedCureDays: 14,
    observations: [
      { id: "o1", day: 1, note: "No gel phase visible. Surface looks good.", observedAt: "2026-07-21T09:00:00Z", temperature: 72, hardness: 3 },
      { id: "o2", day: 3, note: "Light gel phase starting. Hardness increasing.", observedAt: "2026-07-23T10:00:00Z", temperature: 70, hardness: 5 },
      { id: "o3", day: 5, note: "Full gel phase. Soap is firm.", observedAt: "2026-07-25T08:00:00Z", temperature: 68, hardness: 7 },
    ],
    nextObservationDate: "2026-07-27",
    yieldRequested: false,
    yieldRequestedAt: null,
  },
  {
    id: "2",
    name: "Shea Butter Blend — Batch 1",
    recipeName: "Luxury Shea",
    version: 2,
    status: "ready",
    cureStartedAt: "2026-07-18",
    currentDay: 14,
    estimatedCureDays: 14,
    observations: [
      { id: "o4", day: 7, note: "Soap is hard and curing well.", observedAt: "2026-07-25T09:00:00Z", temperature: 71, hardness: 8 },
    ],
    nextObservationDate: "2026-07-27",
    yieldRequested: false,
    yieldRequestedAt: null,
  },
  {
    id: "3",
    name: "Castile Reserve — Batch 1",
    recipeName: "Simple Castile",
    version: 1,
    status: "completed",
    cureStartedAt: "2026-07-10",
    currentDay: 14,
    estimatedCureDays: 14,
    observations: [
      { id: "o5", day: 14, note: "Fully cured. Ready for use.", observedAt: "2026-07-24T10:00:00Z", temperature: 69, hardness: 10 },
    ],
    nextObservationDate: "",
    yieldRequested: true,
    yieldRequestedAt: "2026-07-24",
  },
];

const statusGroups = ["all", "curing", "ready", "completed"] as const;

export default function CurePortfolioPage() {
  const [filter, setFilter] = useState<string>("all");

  const grouped = useMemo(() => {
    const filtered = filter === "all"
      ? mockBatches
      : mockBatches.filter((b) => b.status === filter);

    return {
      due: filtered.filter((b) => b.status === "curing" && b.currentDay < b.estimatedCureDays),
      overdue: filtered.filter((b) => b.status === "curing" && b.currentDay >= b.estimatedCureDays),
      ready: filtered.filter((b) => b.status === "ready"),
      completed: filtered.filter((b) => b.status === "completed"),
    };
  }, [filter]);

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <ObjectHeader
            title="Cure Portfolio"
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cure Portfolio" }]}
          />

          {/* Filters */}
          <div className="mt-6 flex gap-2 flex-wrap">
            {statusGroups.map((s) => (
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

          {/* Due group */}
          {grouped.due.length > 0 && (
            <section className="mt-8" aria-label="Due for observation">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Due for Observation
              </h2>
              <div className="space-y-3">
                {grouped.due.map((batch) => (
                  <div key={batch.id} className="p-4 rounded-lg border border-warning/30 bg-warning/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-foreground">{batch.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          v{batch.version} — {batch.recipeName}
                        </span>
                      </div>
                      <StatusLabel status="pending" />
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Day {batch.currentDay} of {batch.estimatedCureDays}</span>
                      <span aria-hidden="true">·</span>
                      <span>Next observation: {batch.nextObservationDate}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link href={`/batches/${batch.id}`} className="text-sm font-medium text-primary hover:underline">
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Overdue group */}
          {grouped.overdue.length > 0 && (
            <section className="mt-8" aria-label="Overdue observations">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Overdue
              </h2>
              <div className="space-y-3">
                {grouped.overdue.map((batch) => (
                  <div key={batch.id} className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-foreground">{batch.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          v{batch.version} — {batch.recipeName}
                        </span>
                      </div>
                      <StatusLabel status="error" />
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Day {batch.currentDay} (past estimated cure)</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-destructive font-medium">Observation overdue</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link href={`/batches/${batch.id}`} className="text-sm font-medium text-primary hover:underline">
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ready group */}
          {grouped.ready.length > 0 && (
            <section className="mt-8" aria-label="Ready for yield">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Ready for Yield
              </h2>
              <div className="space-y-3">
                {grouped.ready.map((batch) => (
                  <div key={batch.id} className="p-4 rounded-lg border border-success/30 bg-success/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-foreground">{batch.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          v{batch.version} — {batch.recipeName}
                        </span>
                      </div>
                      <StatusLabel status="complete" />
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Day {batch.currentDay} of {batch.estimatedCureDays}</span>
                      <span aria-hidden="true">·</span>
                      <span>Cure complete</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link href={`/batches/${batch.id}`} className="text-sm font-medium text-primary hover:underline">
                        View →
                      </Link>
                      {!batch.yieldRequested && (
                        <button className="text-sm font-medium text-sage hover:underline">
                          Request Yield →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed group */}
          {grouped.completed.length > 0 && (
            <section className="mt-8" aria-label="Completed batches">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Completed
              </h2>
              <div className="space-y-3">
                {grouped.completed.map((batch) => (
                  <div key={batch.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-foreground">{batch.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          v{batch.version} — {batch.recipeName}
                        </span>
                      </div>
                      <StatusLabel status="canceled" />
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Day {batch.currentDay} of {batch.estimatedCureDays}</span>
                      <span aria-hidden="true">·</span>
                      <span>Yield requested {batch.yieldRequestedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {mockBatches.length === 0 && (
            <EmptyState
              title="No batches in cure"
              description="Start a batch and move it to curing to track cure progress."
            />
          )}
        </div>
      </div>
    </main>
  );
}
