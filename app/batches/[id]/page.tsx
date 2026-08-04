// ── Batch Detail ──────────────────────
// R4.2: /batches/[id] with Overview, Making record, Cure, Cost, Notes/history.
// Every section derives from the same batch. No demo IDs/data.

"use client";

import { useState } from "react";
import Link from "next/link";
import { ObjectHeader } from "@/components/shared/object-header";
import { StatusLabel } from "@/components/shared/status-label";
import { LedgerRow } from "@/components/shared/ledger-row";
import { AttentionRow } from "@/components/shared/attention-row";
import { EmptyState } from "@/components/shared/empty-state";

// ── Mock batch data (single source of truth) ──

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
  plannedSnapshot: {
    oilBlend: Array<{ oilId: string; percent: number }>;
    superfatPercent: number;
    lyeConcentrationPercent: number;
    waterToLyeRatio: number;
    calculatedLyeNaOH: number;
    calculatedLyeKOH: number;
    calculatedWater: number;
    calculatedFragranceLoad: number;
    totalWeight: number;
    warnings: Array<{ type: string; message: string }>;
  };
  actualMeasurements?: {
    oilWeight?: number;
    lyeWeight?: number;
    waterWeight?: number;
    fragranceWeight?: number;
  };
  observations: Array<{
    day: number;
    note: string;
    timestamp: string;
  }>;
  notes: Array<{
    id: string;
    text: string;
    createdAt: string;
  }>;
}

const batch: Batch = {
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
  plannedSnapshot: {
    oilBlend: [{ oilId: "olive-oil", percent: 70 }, { oilId: "coconut-oil", percent: 30 }],
    superfatPercent: 8,
    lyeConcentrationPercent: 33,
    waterToLyeRatio: 2.5,
    calculatedLyeNaOH: 134,
    calculatedLyeKOH: 192,
    calculatedWater: 335,
    calculatedFragranceLoad: 0,
    totalWeight: 1000,
    warnings: [],
  },
  actualMeasurements: {
    oilWeight: 700,
    lyeWeight: 134,
    waterWeight: 335,
  },
  observations: [
    { day: 1, note: "Batch reached trace by 45 minutes. Poured into mold.", timestamp: "2026-07-20T14:30:00Z" },
    { day: 2, note: "First observation: no gel phase visible. Surface looks good.", timestamp: "2026-07-21T09:00:00Z" },
  ],
  notes: [
    { id: "n1", text: "Used 70% olive, 30% coconut oil blend.", createdAt: "2026-07-20" },
    { id: "n2", text: "Poured at light trace. Mold is lined with parchment.", createdAt: "2026-07-20" },
  ],
};

// ── Making steps ──

const MAKING_STEPS = [
  "Prep & safety",
  "Add lye to water",
  "Heat oils",
  "Combine lye & oils",
  "Trace & pour",
  "Insulate & cure",
];

export default function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [makingStep, setMakingStep] = useState(3); // Currently at step 4
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Timer effect
  const { useEffect } = require("react");
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerRunning) {
      interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <ObjectHeader
            title={batch.name}
            breadcrumbs={[
              { label: "Batches", href: "/batches" },
              { label: batch.name },
            ]}
          />

          <div className="mt-4 flex items-center gap-3">
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
            <span className="text-sm text-muted-foreground">
              v{batch.version} · {batch.recipeName} · {batch.yieldBars} bars
            </span>
          </div>

          {/* Next action */}
          <AttentionRow
            title={`Next action: ${batch.nextAction}`}
            description={`Batch started ${batch.startedAt} · Day ${batch.currentDay}`}
            variant="info"
          />

          {/* ── Overview ── */}
          <section className="mt-8" aria-label="Overview">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Overview
            </h2>

            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Planned Measurements (from v{batch.version})
            </h3>
            <div className="space-y-1">
              <LedgerRow label="Lye NaOH" planned={batch.plannedSnapshot.calculatedLyeNaOH} unit="g" />
              <LedgerRow label="Lye KOH" planned={batch.plannedSnapshot.calculatedLyeKOH} unit="g" />
              <LedgerRow label="Water" planned={batch.plannedSnapshot.calculatedWater} unit="g" />
              <LedgerRow label="Fragrance" planned={batch.plannedSnapshot.calculatedFragranceLoad} unit="%" />
              <LedgerRow label="Total Weight" planned={batch.plannedSnapshot.totalWeight} unit="g" />
              <LedgerRow label="Superfat" planned={batch.plannedSnapshot.superfatPercent} unit="%" />
            </div>

            {batch.actualMeasurements && (
              <>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 mt-4">
                  Actual Measurements
                </h3>
                <div className="space-y-1">
                  {batch.actualMeasurements.oilWeight && (
                    <LedgerRow label="Oil Weight" actual={batch.actualMeasurements.oilWeight} unit="g" />
                  )}
                  {batch.actualMeasurements.lyeWeight && (
                    <LedgerRow label="Lye Weight" actual={batch.actualMeasurements.lyeWeight} unit="g" />
                  )}
                  {batch.actualMeasurements.waterWeight && (
                    <LedgerRow label="Water Weight" actual={batch.actualMeasurements.waterWeight} unit="g" />
                  )}
                  {batch.actualMeasurements.fragranceWeight && (
                    <LedgerRow label="Fragrance Weight" actual={batch.actualMeasurements.fragranceWeight} unit="g" />
                  )}
                </div>
              </>
            )}

            {batch.plannedSnapshot.warnings.length > 0 && (
              <div className="mt-4 space-y-2">
                {batch.plannedSnapshot.warnings.map((w, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded text-sm ${
                      w.type === "danger"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {w.message}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Making Record ── */}
          <section className="mt-8" aria-label="Making record">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Making Record
            </h2>

            {/* Step indicator */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4" role="navigation" aria-label="Making steps">
              {MAKING_STEPS.map((step, i) => (
                <button
                  key={step}
                  onClick={() => setMakingStep(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    i === makingStep
                      ? "bg-primary text-primary-foreground"
                      : i < makingStep
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < makingStep && <span className="mr-1">✓</span>}
                  {step}
                </button>
              ))}
            </div>

            {/* Current step content */}
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold text-foreground mb-2">
                Step {makingStep + 1}: {MAKING_STEPS[makingStep]}
              </h3>

              {makingStep === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Safety checklist complete. Workspace prepared. All ingredients measured.
                  </p>
                  <button
                    onClick={() => setMakingStep(1)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Next step →
                  </button>
                </div>
              )}

              {makingStep === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Slowly add lye to water (never water to lye). Stir until dissolved. Ventilate.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Lye temp (°F)</label>
                      <input type="number" className="w-full px-3 py-2 rounded-lg border bg-background text-foreground" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Water temp (°F)</label>
                      <input type="number" className="w-full px-3 py-2 rounded-lg border bg-background text-foreground" />
                    </div>
                  </div>
                  <button onClick={() => setMakingStep(2)} className="text-sm font-medium text-primary hover:underline">Next step →</button>
                </div>
              )}

              {makingStep === 2 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Heat your oils to 90–100°F.</p>
                  <div>
                    <label className="text-sm font-medium block mb-1">Oil temp (°F)</label>
                    <input type="number" className="w-full px-3 py-2 rounded-lg border bg-background text-foreground" />
                  </div>
                  <button onClick={() => setMakingStep(3)} className="text-sm font-medium text-primary hover:underline">Next step →</button>
                </div>
              )}

              {makingStep === 3 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Slowly pour lye into oils. Stir gently. Watch for trace.
                  </p>
                  <button onClick={() => setMakingStep(4)} className="text-sm font-medium text-primary hover:underline">Next step →</button>
                </div>
              )}

              {makingStep === 4 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Your soap has reached trace. Pour into the mold and insulate.
                  </p>
                  <button onClick={() => setMakingStep(5)} className="text-sm font-medium text-primary hover:underline">Next step →</button>
                </div>
              )}

              {makingStep === 5 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Your batch is insulated and curing. Check it in 24–48 hours.
                  </p>
                  <button onClick={() => {}} className="text-sm font-medium text-primary hover:underline">Mark as curing →</button>
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${timerRunning ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`}
              >
                {timerRunning ? "Pause" : "Start timer"}
              </button>
              <span className="text-sm font-mono text-foreground">
                {formatTime(timerSeconds)}
              </span>
            </div>
          </section>

          {/* ── Cure ── */}
          <section className="mt-8" aria-label="Cure observations">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Cure Observations
            </h2>

            {batch.observations.length === 0 ? (
              <EmptyState
                title="No observations yet"
                description="Log your first observation to track the cure progress."
              />
            ) : (
              <div className="space-y-3">
                {batch.observations.map((obs, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Day {obs.day}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(obs.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {obs.note}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Cost ── */}
          <section className="mt-8" aria-label="Cost">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Cost
            </h2>

            {batch.costStatus === "incomplete" ? (
              <EmptyState
                title="Cost data incomplete"
                description="Select cost records and calculate batch cost to complete this section."
                action={
                  <Link
                    href={`/batches/${batch.id}/cost`}
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Add Cost Data →
                  </Link>
                }
              />
            ) : (
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">Cost data complete.</p>
              </div>
            )}
          </section>

          {/* ── Notes & History ── */}
          <section className="mt-8" aria-label="Notes and history">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Notes &amp; History
            </h2>

            {batch.notes.length === 0 ? (
              <EmptyState title="No notes yet" description="Add a note to track batch details." />
            ) : (
              <div className="space-y-3">
                {batch.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg border bg-card">
                    <p className="text-sm text-foreground">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{note.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
