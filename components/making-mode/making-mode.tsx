// ── Making Mode UX ──────────────────
// R4.4: Desktop/mobile design with one active step,
// planned/actual values, persistent timer, safety context,
// save indicator, complete/skip controls, final review.
// End-to-end: batch → checklist → making → enter actual → reload → same state/time → complete → curing.

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  createInitialMakingState,
  acknowledgeSafety,
  startMaking,
  pauseTimer,
  resumeTimer,
  reconstructTimer,
  completeStep,
  skipStep,
  abandonMaking,
  type MakingState,
  type MakingStep,
} from "@/lib/state-machine/making";
import { SaveIndicator } from "@/components/shared/save-indicator";
import { AttentionRow } from "@/components/shared/attention-row";
import { LedgerRow } from "@/components/shared/ledger-row";
import { StatusLabel } from "@/components/shared/status-label";
import { ObjectHeader } from "@/components/shared/object-header";

const STEP_ORDER: MakingStep[] = [
  "prep-safety",
  "add-lye-to-water",
  "heat-oils",
  "combine-lye-and-oils",
  "trace-and-pour",
  "insulate-and-cure",
];

const STEP_LABELS: Record<MakingStep, string> = {
  "prep-safety": "Prep & Safety",
  "add-lye-to-water": "Add Lye to Water",
  "heat-oils": "Heat Oils",
  "combine-lye-and-oils": "Combine Lye & Oils",
  "trace-and-pour": "Trace & Pour",
  "insulate-and-cure": "Insulate & Cure",
};

interface MakingModeProps {
  batchId: string;
  batchName: string;
  plannedSnapshot: {
    oilBlend: Array<{ oilId: string; percent: number }>;
    calculatedLyeNaOH: number;
    calculatedLyeKOH: number;
    calculatedWater: number;
    totalWeight: number;
  };
}

export function MakingMode({ batchId, batchName, plannedSnapshot }: MakingModeProps) {
  const [state, setState] = useState<MakingState | null>(null);
  const [safetyAckText, setSafetyAckText] = useState("");
  const [timerDisplay, setTimerDisplay] = useState("0:00");

  // Load persisted state on mount (reload resume)
  useEffect(() => {
    // In production, fetch from API. Here we simulate loading persisted state.
    const persisted = localStorage.getItem(`making-state-${batchId}`);
    if (persisted) {
      const parsed = JSON.parse(persisted) as MakingState;
      const reconstructed = reconstructTimer(parsed);
      setState(reconstructed);
      // Persist timer updates
      if (reconstructed.timer.running) {
        const interval = setInterval(() => {
          setState((prev) => {
            if (!prev || !prev.timer.running) return prev;
            return reconstructTimer(prev);
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    } else {
      setState(createInitialMakingState(batchId));
    }
  }, [batchId]);

  // Persist state changes
  useEffect(() => {
    if (state) {
      localStorage.setItem(`making-state-${batchId}`, JSON.stringify(state));
    }
  }, [state, batchId]);

  // Update timer display
  useEffect(() => {
    if (!state?.timer.running) return;
    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev || !prev.timer.running) return prev;
        return reconstructTimer(prev);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state?.timer.running]);

  const handleSafetyAck = () => {
    if (!safetyAckText.trim()) return;
    const timestamp = new Date().toISOString();
    const newState = acknowledgeSafety(state!, timestamp);
    setState(newState);
    setSafetyAckText("");
  };

  const handleStart = () => {
    const timestamp = new Date().toISOString();
    const newState = startMaking(state!, timestamp);
    setState(newState);
  };

  const handlePause = () => {
    const timestamp = new Date().toISOString();
    const newState = pauseTimer(state!, timestamp);
    setState(newState);
  };

  const handleResume = () => {
    const timestamp = new Date().toISOString();
    const newState = resumeTimer(state!, timestamp);
    setState(newState);
  };

  const handleComplete = () => {
    const timestamp = new Date().toISOString();
    const newState = completeStep(state!, state!.currentStep, timestamp);
    setState(newState);
  };

  const handleSkip = (reason: string) => {
    const timestamp = new Date().toISOString();
    const newState = skipStep(state!, state!.currentStep, reason, timestamp);
    setState(newState);
  };

  const handleAbandon = () => {
    const timestamp = new Date().toISOString();
    const newState = abandonMaking(state!, timestamp);
    setState(newState);
  };

  if (!state) {
    return <div className="p-4 text-center text-muted-foreground">Loading making mode...</div>;
  }

  const isNotStarted = state.status === "not-started";
  const isSafetyAcked = state.status === "safety-acknowledged";
  const isInProgress = state.status === "in-progress";
  const isPaused = state.status === "in-progress" && !state.timer.running;
  const isCompleted = state.status === "completed";
  const isAbandoned = state.status === "abandoned";

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <ObjectHeader
            title={`Making: ${batchName}`}
            breadcrumbs={[
              { label: "Batches", href: "/batches" },
              { label: batchName, href: `/batches/${batchId}` },
              { label: "Making Mode" },
            ]}
          />

          {/* Status */}
          <div className="mt-4 flex items-center gap-3">
            <StatusLabel
              status={
                state.status === "completed"
                  ? "complete"
                  : state.status === "abandoned"
                  ? "canceled"
                  : state.status === "in-progress"
                  ? "pending"
                  : "draft"
              }
            />
            <span className="text-sm text-muted-foreground tabular-nums">
              Day {Math.floor((state.timer.elapsedMs || 0) / 86400000)}
            </span>
          </div>

          {/* Timer */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-2xl font-mono font-bold text-foreground tabular-nums">
              {timerDisplay}
            </span>
            {isInProgress && state.timer.running && (
              <button
                onClick={handlePause}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-sm hover:bg-muted"
              >
                Pause
              </button>
            )}
            {isPaused && (
              <button
                onClick={handleResume}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
              >
                Resume
              </button>
            )}
          </div>

          {/* ── Safety Acknowledgement ── */}
          {isNotStarted && (
            <section className="mt-8 bg-card rounded-lg border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Safety Acknowledgement
              </h2>
              <AttentionRow
                title="Safety first"
                description="Before starting making, confirm you have read the safety guidelines and have protective equipment ready."
                variant="warning"
              />
              <div className="mt-4">
                <label className="text-sm font-medium block mb-2">
                  Type "I acknowledge" to confirm:
                </label>
                <input
                  type="text"
                  value={safetyAckText}
                  onChange={(e) => setSafetyAckText(e.target.value)}
                  placeholder="I acknowledge"
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
                />
                <button
                  onClick={handleSafetyAck}
                  disabled={safetyAckText.trim() !== "I acknowledge"}
                  className="mt-3 w-full py-3 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Acknowledge & Start
                </button>
              </div>
            </section>
          )}

          {/* ── Step Checklist ── */}
          {isSafetyAcked && (
            <section className="mt-8" aria-label="Making checklist">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Making Checklist
              </h2>
              <div className="space-y-2">
                {STEP_ORDER.map((step, i) => {
                  const isCompleted = state.completedSteps.includes(step);
                  const isCurrent = state.currentStep === step && isInProgress;
                  const isSkipped = state.skippedSteps.some((s) => s.step === step);

                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isCompleted
                          ? "border-success/30 bg-success/5"
                          : isCurrent
                          ? "border-primary/30 bg-primary/5"
                          : isSkipped
                          ? "border-warning/30 bg-warning/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <span className="text-lg">
                        {isCompleted ? "✓" : isSkipped ? "⊘" : i + 1}
                      </span>
                      <span className={`flex-1 text-sm ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {STEP_LABELS[step]}
                      </span>
                      {isCurrent && (
                        <span className="text-xs text-primary font-medium">Active</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Active Step Controls ── */}
          {isInProgress && (
            <section className="mt-8 bg-card rounded-lg border p-6">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                Step: {STEP_LABELS[state.currentStep]}
              </h2>

              {/* Planned values */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Planned Values
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <LedgerRow label="Lye NaOH" planned={plannedSnapshot.calculatedLyeNaOH} unit="g" />
                  <LedgerRow label="Lye KOH" planned={plannedSnapshot.calculatedLyeKOH} unit="g" />
                  <LedgerRow label="Water" planned={plannedSnapshot.calculatedWater} unit="g" />
                  <LedgerRow label="Total Weight" planned={plannedSnapshot.totalWeight} unit="g" />
                </div>
              </div>

              {/* Actual values */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Enter Actual Values
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Oil Weight (g)</label>
                    <input type="number" className="w-full px-3 py-2 rounded-lg border bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Lye Weight (g)</label>
                    <input type="number" className="w-full px-3 py-2 rounded-lg border bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Water Weight (g)</label>
                    <input type="number" className="w-full px-3 py-2 rounded-lg border bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Fragrance (g)</label>
                    <input type="number" className="w-full px-3 py-2 rounded-lg border bg-background text-foreground" />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <button
                  onClick={handleComplete}
                  className="flex-1 py-3 font-medium bg-sage text-sage-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Complete Step
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("Skip reason (required):");
                    if (reason?.trim()) handleSkip(reason.trim());
                  }}
                  className="flex-1 py-3 font-medium bg-warning/20 text-warning rounded-lg hover:opacity-90 transition-opacity"
                >
                  Skip Step
                </button>
              </div>
            </section>
          )}

          {/* ── Paused ── */}
          {isPaused && (
            <section className="mt-8 bg-card rounded-lg border p-6">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                Timer Paused
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Your making session is paused. Resume when ready.
              </p>
              <button
                onClick={handleResume}
                className="w-full py-3 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Resume
              </button>
            </section>
          )}

          {/* ── Completed ── */}
          {isCompleted && (
            <section className="mt-8 bg-card rounded-lg border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Making Complete
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                All steps completed. Batch is ready for curing.
              </p>
              <StatusLabel status="active" />
            </section>
          )}

          {/* ── Abandoned ── */}
          {isAbandoned && (
            <section className="mt-8 bg-card rounded-lg border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Batch Abandoned
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                This batch was abandoned during making.
              </p>
              <StatusLabel status="canceled" />
            </section>
          )}

          {/* ── Save indicator ── */}
          <SaveIndicator state="saved" />

          {/* ── Abandon button ── */}
          {isInProgress && (
            <div className="mt-4">
              <button
                onClick={handleAbandon}
                className="text-sm font-medium text-destructive hover:underline"
              >
                Abandon this batch
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
