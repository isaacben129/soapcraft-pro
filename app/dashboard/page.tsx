// ── Dashboard ──────────────────────────
// R7.2: Replace five-card directory with Needs attention rows,
// Active production pipeline, Recent recipes/outcomes,
// Activity ledger, New command.
// Populated, partial, empty, loading, and error states.
// Desktop and mobile approved screenshots.
// Every row exposes parent/context and one next action.

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ObjectHeader } from "@/components/shared/object-header";
import { StatusLabel } from "@/components/shared/status-label";
import { EmptyState } from "@/components/shared/empty-state";
import { AttentionRow } from "@/components/shared/attention-row";
import { LedgerRow } from "@/components/shared/ledger-row";
import { ActivityRow } from "@/components/shared/activity-row";

interface DashboardData {
  attentionItems: Array<{
    type: string;
    label: string;
    description: string;
    priority: number;
    href: string;
  }>;
  activePipeline: Array<{
    id: string;
    name: string;
    recipeName: string;
    nextAction: string;
    currentDay: number;
  }>;
  recentOutcomes: Array<{
    id: string;
    recipeName: string;
    outcome: string;
    occurredAt: string;
  }>;
  activityEvents: Array<{
    id: string;
    action: string;
    entityType: string;
    entityName: string;
    timestamp: string;
  }>;
}

// Mock data for populated state
const mockData: DashboardData = {
  attentionItems: [
    { type: "active-making", label: "Making: Olive & Coconut — Batch 1", description: "Check trace and pour", priority: 100, href: "/batches/1" },
    { type: "cure-due", label: "Due: Shea Butter Blend — Batch 1", description: "Next observation: 2026-07-27", priority: 50, href: "/batches/2" },
    { type: "missing-cost", label: "Missing cost: Castile Reserve — Batch 1", description: "Simple Castile — cost data incomplete", priority: 30, href: "/batches/3" },
  ],
  activePipeline: [
    { id: "1", name: "Olive & Coconut — Batch 1", recipeName: "Simple Castile", nextAction: "Check trace and pour", currentDay: 2 },
    { id: "2", name: "Shea Butter Blend — Batch 1", recipeName: "Luxury Shea", nextAction: "Log observation", currentDay: 5 },
  ],
  recentOutcomes: [
    { id: "o1", recipeName: "Simple Castile", outcome: "success", occurredAt: "2026-07-24" },
    { id: "o2", recipeName: "Luxury Shea", outcome: "partial", occurredAt: "2026-07-22" },
  ],
  activityEvents: [
    { id: "a1", action: "created", entityType: "batch", entityName: "Olive & Coconut — Batch 1", timestamp: "2026-07-20T10:00:00Z" },
    { id: "a2", action: "updated", entityType: "cure-observation", entityName: "Day 3 observation", timestamp: "2026-07-23T09:00:00Z" },
    { id: "a3", action: "completed", entityType: "making-step", entityName: "Trace & pour", timestamp: "2026-07-20T14:30:00Z" },
  ],
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <ObjectHeader title="Dashboard" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />
            <EmptyState title="Loading dashboard..." description="Fetching your active production data." />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <ObjectHeader title="Dashboard" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />
            <EmptyState
              title="Failed to load dashboard"
              description={error}
              action={
                <button
                  onClick={() => window.location.reload()}
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Retry
                </button>
              }
            />
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <ObjectHeader
            title="Dashboard"
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
          />

          {/* Needs attention */}
          {data.attentionItems.length > 0 && (
            <section className="mt-8" aria-label="Needs attention">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Needs Attention
              </h2>
              <div className="space-y-3">
                {data.attentionItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="block"
                  >
                    <AttentionRow
                      title={item.label}
                      description={item.description}
                      variant={
                        item.type === "active-making"
                          ? "danger"
                          : item.type === "cure-overdue"
                          ? "danger"
                          : item.type === "cure-due"
                          ? "warning"
                          : "info"
                      }
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Active production pipeline */}
          {data.activePipeline.length > 0 && (
            <section className="mt-8" aria-label="Active production pipeline">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Active Production Pipeline
              </h2>
              <div className="space-y-3">
                {data.activePipeline.map((batch) => (
                  <Link
                    key={batch.id}
                    href={`/batches/${batch.id}`}
                    className="block p-4 rounded-lg border bg-card hover:shadow-elevation-1 transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-foreground">
                          {batch.name}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {batch.recipeName}
                        </span>
                      </div>
                      <StatusLabel status="pending" />
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Day {batch.currentDay}</span>
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

          {/* Recent recipes/outcomes */}
          {data.recentOutcomes.length > 0 && (
            <section className="mt-8" aria-label="Recent outcomes">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Recent Outcomes
              </h2>
              <div className="space-y-3">
                {data.recentOutcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div>
                      <span className="font-medium text-foreground">
                        {outcome.recipeName}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {outcome.outcome}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {outcome.occurredAt}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Activity ledger */}
          {data.activityEvents.length > 0 && (
            <section className="mt-8" aria-label="Activity ledger">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Activity Ledger
              </h2>
              <div className="space-y-2">
                {data.activityEvents.map((event) => (
                  <ActivityRow
                    key={event.id}
                    action={event.action}
                    entityType={event.entityType}
                    entityName={event.entityName}
                    timestamp={event.timestamp}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {data.attentionItems.length === 0 &&
            data.activePipeline.length === 0 &&
            data.recentOutcomes.length === 0 &&
            data.activityEvents.length === 0 && (
            <EmptyState
              title="Nothing to show yet"
              description="Start a batch or create a recipe to see your dashboard populate."
              action={
                <Link
                  href="/batches/new"
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Start a Batch
                </Link>
              }
            />
          )}
        </div>
      </div>
    </main>
  );
}
