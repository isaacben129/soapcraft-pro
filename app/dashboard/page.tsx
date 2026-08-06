// ── Dashboard ──────────────────────────
// SaaS-style dashboard with header, KPI cards,
// production pipeline, outcomes, and activity ledger.
// Populated, partial, empty, loading, and error states.
// Desktop and mobile approved screenshots.
// Every row exposes parent/context and one next action.

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DashboardHeader,
  KPICard,
  ChartCard,
  BarChart,
} from "@/components/shared";
import { AttentionRow } from "@/components/shared/attention-row";
import { EmptyState } from "@/components/shared/empty-state";
import { ActivityRow } from "@/components/shared/activity-row";
import { StatusLabel } from "@/components/shared/status-label";

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

// KPI mock data
const kpiData = [
  { label: "Active Batches", value: "2", change: "+1 this week", changeDirection: "up" as const },
  { label: "Recipes", value: "12", change: "+3 new", changeDirection: "up" as const },
  { label: "Cure Days", value: "5", change: "Avg across active", changeDirection: "neutral" as const },
  { label: "Cost/Bar", value: "$2.40", change: "-$0.15 vs last", changeDirection: "down" as const },
];

// Chart mock data — batches per week
const weeklyBatchData = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 0 },
  { label: "Wed", value: 2 },
  { label: "Thu", value: 1 },
  { label: "Fri", value: 3 },
  { label: "Sat", value: 0 },
  { label: "Sun", value: 1 },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen">
        <DashboardHeader />
        <div className="flex-1 container mx-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg px-5 py-4 animate-pulse">
                  <div className="h-3 w-20 bg-clay rounded mb-3" />
                  <div className="h-8 w-12 bg-clay rounded" />
                </div>
              ))}
            </div>
            <div className="h-48 bg-card border border-border rounded-lg animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col min-h-screen">
        <DashboardHeader />
        <div className="flex-1 container mx-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <EmptyState
              title="Failed to load dashboard"
              description={error}
              action={
                <button
                  onClick={() => window.location.reload()}
                  className="inline-block px-4 py-2 bg-action text-action-text rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
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
      <DashboardHeader />

      <div className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* KPI row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-label="Key metrics">
            {kpiData.map((kpi) => (
              <KPICard key={kpi.label} {...kpi} />
            ))}
          </section>

          {/* Needs attention */}
          {data.attentionItems.length > 0 && (
            <section className="mb-8" aria-label="Needs attention">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                Needs Attention
              </h2>
              <div className="space-y-3">
                {data.attentionItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <AttentionRow
                      title={item.label}
                      description={item.description}
                      variant={
                        item.type === "active-making"
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

          {/* Two-column layout: Pipeline + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Active pipeline */}
            <section className="lg:col-span-3" aria-label="Active production pipeline">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                Active Pipeline
              </h2>
              <div className="space-y-3">
                {data.activePipeline.map((batch) => (
                  <Link
                    key={batch.id}
                    href={`/batches/${batch.id}`}
                    className="block bg-card border border-border rounded-lg px-5 py-4 hover:shadow-elevation-1 transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-foreground text-sm">
                          {batch.name}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {batch.recipeName}
                        </span>
                      </div>
                      <StatusLabel status="pending" />
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Day {batch.currentDay}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-action font-medium">
                        → {batch.nextAction}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Weekly batch chart */}
            <section className="lg:col-span-2" aria-label="Weekly batch chart">
              <ChartCard title="Batches This Week" subtitle="New batches created">
                <BarChart data={weeklyBatchData} barHeight={20} gap={6} height={180} />
              </ChartCard>
            </section>
          </div>

          {/* Recent outcomes + Activity ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent outcomes */}
            <section aria-label="Recent outcomes">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                Recent Outcomes
              </h2>
              <div className="bg-card border border-border rounded-lg shadow-sm divide-y divide-rule">
                {data.recentOutcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          outcome.outcome === "success"
                            ? "bg-success"
                            : outcome.outcome === "partial"
                            ? "bg-warning"
                            : "bg-destructive"
                        }`}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {outcome.recipeName}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {outcome.occurredAt}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity ledger */}
            <section aria-label="Activity ledger">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                Activity Ledger
              </h2>
              <div className="bg-card border border-border rounded-lg shadow-sm divide-y divide-rule">
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
          </div>

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
                  className="inline-block px-4 py-2 bg-action text-action-text rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
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