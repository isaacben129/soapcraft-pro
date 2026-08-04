// ── Making State Machine RED Tests ──────────
// R4.3: RED fixtures for making state machine.

import { describe, it, expect } from "vitest";
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
  applyTransition,
  type MakingState,
} from "./making";

describe("Making State Machine", () => {
  const batchId = "test-batch-1";
  const now = new Date().toISOString();
  const later = new Date(Date.now() + 60000).toISOString();

  // ── Initial state ──

  describe("initial state", () => {
    it("creates a state with not-started status", () => {
      const state = createInitialMakingState(batchId);
      expect(state.status).toBe("not-started");
      expect(state.currentStep).toBe("prep-safety");
      expect(state.completedSteps).toEqual([]);
      expect(state.skippedSteps).toEqual([]);
      expect(state.safetyAcknowledged).toBe(false);
    });

    it("has timer in stopped state", () => {
      const state = createInitialMakingState(batchId);
      expect(state.timer.running).toBe(false);
      expect(state.timer.elapsedMs).toBe(0);
    });
  });

  // ── Safety acknowledgement ──

  describe("safety acknowledgement", () => {
    it("requires safety acknowledgement before starting", () => {
      const state = createInitialMakingState(batchId);
      expect(() => startMaking(state, now)).toThrow("Safety acknowledgement required");
    });

    it("allows acknowledgement from not-started state", () => {
      const state = createInitialMakingState(batchId);
      const newState = acknowledgeSafety(state, now);
      expect(newState.status).toBe("safety-acknowledged");
      expect(newState.safetyAcknowledged).toBe(true);
      expect(newState.safetyAcknowledgedAt).toBe(now);
    });

    it("does not allow acknowledgement after making has started", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, later);
      expect(() => acknowledgeSafety(started, later)).toThrow("Safety acknowledgement only allowed before making starts");
    });

    it("is idempotent — same acknowledgement not re-applied", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const result = applyTransition(acked, { acknowledged: true, timestamp: now }, later);
      expect(result.applied).toBe(false);
    });
  });

  // ── Start making ──

  describe("start making", () => {
    it("starts making after safety acknowledgement", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, later);
      expect(started.status).toBe("in-progress");
      expect(started.timer.running).toBe(true);
    });

    it("throws if safety not acknowledged", () => {
      const state = createInitialMakingState(batchId);
      expect(() => startMaking(state, now)).toThrow("Safety acknowledgement required before starting making");
    });

    it("throws if batch is completed", () => {
      const state = createInitialMakingState(batchId);
      const completed = { ...state, status: "completed" as const };
      expect(() => startMaking(completed, now)).toThrow("Cannot start making from completed state");
    });

    it("throws if batch is abandoned", () => {
      const state = createInitialMakingState(batchId);
      const abandoned = { ...state, status: "abandoned" as const };
      expect(() => startMaking(abandoned, now)).toThrow("Cannot start making from abandoned state");
    });
  });

  // ── Timer ──

  describe("timer", () => {
    it("starts timer when making begins", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      expect(started.timer.running).toBe(true);
      expect(started.timer.startedAt).toBe(now);
    });

    it("pauses timer", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      const paused = pauseTimer(started, later);
      expect(paused.timer.running).toBe(false);
      expect(paused.timer.pausedAt).toBe(later);
    });

    it("throws if pausing when not in progress", () => {
      const state = createInitialMakingState(batchId);
      expect(() => pauseTimer(state, now)).toThrow("Timer can only be paused when making is in progress and running");
    });

    it("resumes timer", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      const paused = pauseTimer(started, later);
      const resumed = resumeTimer(paused, later);
      expect(resumed.timer.running).toBe(true);
      expect(resumed.timer.pausedAt).toBeNull();
    });

    it("reconstructs timer on reload", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      // Simulate reload by reconstructing
      const reconstructed = reconstructTimer(started);
      expect(reconstructed.timer.running).toBe(true);
      expect(reconstructed.timer.elapsedMs).toBeGreaterThanOrEqual(0);
    });
  });

  // ── Step completion ──

  describe("step completion", () => {
    it("completes steps in order", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);

      const afterStep1 = completeStep(started, "prep-safety", later);
      expect(afterStep1.completedSteps).toContain("prep-safety");
      expect(afterStep1.currentStep).toBe("add-lye-to-water");
    });

    it("throws if completing out of order", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      expect(() => completeStep(started, "heat-oils", later)).toThrow("Step heat-oils is not the current step");
    });

    it("does not allow re-completing the same step", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      const afterStep1 = completeStep(started, "prep-safety", later);
      const result = applyTransition(afterStep1, { step: "prep-safety", action: "complete" }, later);
      expect(result.applied).toBe(false);
    });

    it("moves to curing when all steps completed", () => {
      let state = createInitialMakingState(batchId);
      state = acknowledgeSafety(state, now);
      state = startMaking(state, now);

      // Complete all steps
      for (const step of ["prep-safety", "add-lye-to-water", "heat-oils", "combine-lye-and-oils", "trace-and-pour", "insulate-and-cure"] as const) {
        state = completeStep(state, step, later);
      }

      expect(state.status).toBe("completed");
    });
  });

  // ── Step skip ──

  describe("step skip", () => {
    it("skips a step with a reason", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);

      const afterSkip = skipStep(started, "prep-safety", "Already done during prep", later);
      expect(afterSkip.skippedSteps).toHaveLength(1);
      expect(afterSkip.skippedSteps[0]).toMatchObject({
        step: "prep-safety",
        reason: "Already done during prep",
      });
      expect(afterSkip.currentStep).toBe("add-lye-to-water");
    });

    it("requires a skip reason", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      expect(() => skipStep(started, "prep-safety", "", later)).toThrow("Skip reason is required");
    });

    it("throws if skipping out of order", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      expect(() => skipStep(started, "heat-oils", "Not needed", later)).toThrow("Step heat-oils is not the current step");
    });

    it("does not allow re-skipping the same step", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      const afterSkip = skipStep(started, "prep-safety", "Already done", later);
      const result = applyTransition(afterSkip, { step: "prep-safety", action: "skip", skipReason: "Already done" }, later);
      expect(result.applied).toBe(false);
    });
  });

  // ── Abandon ──

  describe("abandon", () => {
    it("abandons making", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      const abandoned = abandonMaking(started, later);
      expect(abandoned.status).toBe("abandoned");
      expect(abandoned.timer.running).toBe(false);
    });

    it("throws if abandoning a completed batch", () => {
      const state = createInitialMakingState(batchId);
      const abandoned = { ...state, status: "completed" as const };
      expect(() => abandonMaking(abandoned, now)).toThrow("Cannot abandon a completed batch");
    });
  });

  // ── Idempotent/retried writes ──

  describe("idempotent transitions", () => {
    it("does not double-complete a step", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      const afterStep1 = completeStep(started, "prep-safety", later);
      const result = applyTransition(afterStep1, { step: "prep-safety", action: "complete" }, later);
      expect(result.applied).toBe(false);
      expect(result.state.completedSteps).toHaveLength(1);
    });

    it("does not double-skip a step", () => {
      const state = createInitialMakingState(batchId);
      const acked = acknowledgeSafety(state, now);
      const started = startMaking(acked, now);
      const afterSkip = skipStep(started, "prep-safety", "Not needed", later);
      const result = applyTransition(afterSkip, { step: "prep-safety", action: "skip", skipReason: "Not needed" }, later);
      expect(result.applied).toBe(false);
      expect(result.state.skippedSteps).toHaveLength(1);
    });
  });
});
