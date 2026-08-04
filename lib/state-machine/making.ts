// ── Making State Machine ──────────────────
// R4.3: State machine for batch making lifecycle.
// RED tests for checklist gate, ordered completion, skip reason,
// timer start/pause/resume/reconstruction, reload resume,
// completion transaction to curing, abandon path, idempotent/retried writes.
// Safety acknowledgement required before start.
// Completion transaction moves batch to curing.

export type MakingStep =
  | "prep-safety"
  | "add-lye-to-water"
  | "heat-oils"
  | "combine-lye-and-oils"
  | "trace-and-pour"
  | "insulate-and-cure";

export type MakingStatus =
  | "not-started"
  | "safety-acknowledged"
  | "in-progress"
  | "paused"
  | "completed"
  | "abandoned";

export interface MakingState {
  batchId: string;
  status: MakingStatus;
  currentStep: MakingStep;
  completedSteps: MakingStep[];
  skippedSteps: Array<{ step: MakingStep; reason: string }>;
  timer: {
    running: boolean;
    startedAt: string | null;
    pausedAt: string | null;
    totalPausedMs: number;
    elapsedMs: number;
  };
  safetyAcknowledged: boolean;
  safetyAcknowledgedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StepTransition {
  step: MakingStep;
  action: "complete" | "skip";
  skipReason?: string;
}

export interface SafetyAck {
  acknowledged: boolean;
  timestamp: string;
}

// ── State machine logic ──

const STEP_ORDER: MakingStep[] = [
  "prep-safety",
  "add-lye-to-water",
  "heat-oils",
  "combine-lye-and-oils",
  "trace-and-pour",
  "insulate-and-cure",
];

export function createInitialMakingState(batchId: string): MakingState {
  return {
    batchId,
    status: "not-started",
    currentStep: "prep-safety",
    completedSteps: [],
    skippedSteps: [],
    timer: {
      running: false,
      startedAt: null,
      pausedAt: null,
      totalPausedMs: 0,
      elapsedMs: 0,
    },
    safetyAcknowledged: false,
    safetyAcknowledgedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function acknowledgeSafety(state: MakingState, timestamp: string): MakingState {
  if (state.status !== "not-started") {
    throw new Error("Safety acknowledgement only allowed before making starts");
  }

  return {
    ...state,
    status: "safety-acknowledged",
    safetyAcknowledged: true,
    safetyAcknowledgedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function startMaking(state: MakingState, timestamp: string): MakingState {
  if (!state.safetyAcknowledged) {
    throw new Error("Safety acknowledgement required before starting making");
  }
  if (state.status === "completed" || state.status === "abandoned") {
    throw new Error(`Cannot start making from ${state.status} state`);
  }

  return {
    ...state,
    status: "in-progress",
    timer: {
      ...state.timer,
      running: true,
      startedAt: timestamp,
      pausedAt: null,
      totalPausedMs: 0,
      elapsedMs: state.timer.elapsedMs,
    },
    updatedAt: timestamp,
  };
}

export function pauseTimer(state: MakingState, timestamp: string): MakingState {
  if (state.status !== "in-progress" || !state.timer.running) {
    throw new Error("Timer can only be paused when making is in progress and running");
  }

  return {
    ...state,
    timer: {
      ...state.timer,
      running: false,
      pausedAt: timestamp,
      totalPausedMs: state.timer.totalPausedMs + (new Date(timestamp).getTime() - new Date(state.timer.startedAt!).getTime()),
      elapsedMs: state.timer.elapsedMs,
    },
    updatedAt: timestamp,
  };
}

export function resumeTimer(state: MakingState, timestamp: string): MakingState {
  if (state.status !== "in-progress" || state.timer.running || !state.timer.pausedAt) {
    throw new Error("Timer can only be resumed when making is in progress and paused");
  }

  return {
    ...state,
    timer: {
      ...state.timer,
      running: true,
      startedAt: timestamp,
      pausedAt: null,
      totalPausedMs: state.timer.totalPausedMs,
      elapsedMs: state.timer.elapsedMs,
    },
    updatedAt: timestamp,
  };
}

export function reconstructTimer(state: MakingState): MakingState {
  // Reload resume: if timer was running, calculate elapsed time
  if (state.status !== "in-progress" || !state.timer.running || !state.timer.startedAt) {
    return state;
  }

  const now = Date.now();
  const startedAt = new Date(state.timer.startedAt).getTime();
  const pausedTotal = state.timer.totalPausedMs;
  const elapsed = now - startedAt - pausedTotal;

  return {
    ...state,
    timer: {
      ...state.timer,
      elapsedMs: Math.max(0, elapsed),
    },
  };
}

export function completeStep(state: MakingState, step: MakingStep, timestamp: string): MakingState {
  // Checklist gate: steps must be completed in order
  const stepIndex = STEP_ORDER.indexOf(step);
  const currentIndex = STEP_ORDER.indexOf(state.currentStep);

  if (stepIndex !== currentIndex) {
    throw new Error(`Step ${step} is not the current step. Current step is ${state.currentStep}`);
  }

  const newCompleted = [...state.completedSteps, step];
  const nextIndex = stepIndex + 1;

  // Check if all steps are done
  if (nextIndex >= STEP_ORDER.length) {
    // All steps completed — transition to curing
    return {
      ...state,
      status: "completed",
      currentStep: step,
      completedSteps: newCompleted,
      timer: {
        ...state.timer,
        running: false,
        pausedAt: null,
        elapsedMs: state.timer.elapsedMs,
      },
      updatedAt: timestamp,
    };
  }

  return {
    ...state,
    currentStep: STEP_ORDER[nextIndex],
    completedSteps: newCompleted,
    updatedAt: timestamp,
  };
}

export function skipStep(state: MakingState, step: MakingStep, reason: string, timestamp: string): MakingState {
  const stepIndex = STEP_ORDER.indexOf(step);
  const currentIndex = STEP_ORDER.indexOf(state.currentStep);

  if (stepIndex !== currentIndex) {
    throw new Error(`Step ${step} is not the current step. Current step is ${state.currentStep}`);
  }

  if (!reason.trim()) {
    throw new Error("Skip reason is required");
  }

  const newSkipped = [...state.skippedSteps, { step, reason }];
  const nextIndex = stepIndex + 1;

  if (nextIndex >= STEP_ORDER.length) {
    return {
      ...state,
      status: "completed",
      currentStep: step,
      completedSteps: [...state.completedSteps],
      skippedSteps: newSkipped,
      timer: {
        ...state.timer,
        running: false,
        pausedAt: null,
        elapsedMs: state.timer.elapsedMs,
      },
      updatedAt: timestamp,
    };
  }

  return {
    ...state,
    currentStep: STEP_ORDER[nextIndex],
    skippedSteps: newSkipped,
    updatedAt: timestamp,
  };
}

export function abandonMaking(state: MakingState, timestamp: string): MakingState {
  if (state.status === "completed") {
    throw new Error("Cannot abandon a completed batch");
  }

  return {
    ...state,
    status: "abandoned",
    timer: {
      ...state.timer,
      running: false,
      pausedAt: null,
      elapsedMs: state.timer.elapsedMs,
    },
    updatedAt: timestamp,
  };
}

// ── Idempotent transition ──

export interface TransitionResult {
  state: MakingState;
  applied: boolean;
  version: string;
}

export function applyTransition(
  state: MakingState,
  transition: StepTransition | SafetyAck,
  timestamp: string
): TransitionResult {
  // Idempotency check: if the transition has already been applied, return as-is
  if ("acknowledged" in transition) {
    if (state.safetyAcknowledged && state.safetyAcknowledgedAt === transition.timestamp) {
      return { state, applied: false, version: state.updatedAt };
    }
    const newState = acknowledgeSafety(state, transition.timestamp);
    return { state: newState, applied: true, version: newState.updatedAt };
  }

  if (transition.action === "complete") {
    // Check if step was already completed
    if (state.completedSteps.includes(transition.step)) {
      return { state, applied: false, version: state.updatedAt };
    }
    const newState = completeStep(state, transition.step, timestamp);
    return { state: newState, applied: true, version: newState.updatedAt };
  }

  if (transition.action === "skip") {
    // Check if step was already skipped
    if (state.skippedSteps.some((s) => s.step === transition.step)) {
      return { state, applied: false, version: state.updatedAt };
    }
    const newState = skipStep(state, transition.step, transition.skipReason || "", timestamp);
    return { state: newState, applied: true, version: newState.updatedAt };
  }

  return { state, applied: false, version: state.updatedAt };
}
