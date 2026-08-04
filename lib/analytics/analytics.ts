// ── Analytics Wrapper & Lifecycle Events ──────────
// R10.1: Implement PRD event names with privacy-safe payloads.
// Verify dashboards/queries can compute activation and connected completion.
// All lifecycle transitions instrumented. No PII in analytics payloads.

// ── Event names (PRD-defined) ──

export const AnalyticsEvents = {
  // Recipe lifecycle
  RECIPE_CREATED: "recipe.created",
  RECIPE_UPDATED: "recipe.updated",
  RECIPE_VERSION_CREATED: "recipe.version.created",
  RECIPE_ARCHIVED: "recipe.archived",

  // Batch lifecycle
  BATCH_CREATED: "batch.created",
  BATCH_STARTED: "batch.started",
  BATCH_PAUSED: "batch.paused",
  BATCH_RESUMED: "batch.resumed",
  BATCH_COMPLETED: "batch.completed",
  BATCH_ABANDONED: "batch.abandoned",

  // Cure lifecycle
  CURE_OBSERVATION_CREATED: "cure.observation.created",
  CURE_OBSERVATION_UPDATED: "cure.observation.updated",
  CURE_OBSERVATION_DELETED: "cure.observation.deleted",
  CURE_MARKED_READY: "cure.marked_ready",
  CURE_YIELD_REQUESTED: "cure.yield_requested",

  // Cost lifecycle
  COST_CALCULATED: "cost.calculated",
  COST_SAVED: "cost.saved",

  // Authentication
  SESSION_STARTED: "session.started",
  SESSION_ENDED: "session.ended",
  PASSWORD_RESET_REQUESTED: "password.reset_requested",
  PASSWORD_RESET_COMPLETED: "password.reset_completed",

  // Onboarding
  ONBOARDING_STARTED: "onboarding.started",
  ONBOARDING_STEP_COMPLETED: "onboarding.step_completed",
  ONBOARDING_COMPLETED: "onboarding.completed",
} as const;

// ── Privacy-safe payload schema ──
// No PII (no email, no name, no IP, no device fingerprint).
// Only anonymous IDs and event-specific data.

export interface AnalyticsPayload<T = Record<string, unknown>> {
  event: string;
  anonymousId: string;
  timestamp: string;
  data: T;
}

// ── Analytics wrapper ──

class AnalyticsClient {
  private endpoint: string;
  private anonymousId: string;

  constructor() {
    this.endpoint = "/api/analytics";
    this.anonymousId = this.getOrCreateAnonymousId();
  }

  private getOrCreateAnonymousId(): string {
    if (typeof window === "undefined") return "server";
    let id = localStorage.getItem("soapcraft-analytics-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("soapcraft-analytics-id", id);
    }
    return id;
  }

  track<T = Record<string, unknown>>(
    event: string,
    data: T
  ): void {
    const payload: AnalyticsPayload<T> = {
      event,
      anonymousId: this.anonymousId,
      timestamp: new Date().toISOString(),
      data,
    };

    // Send to analytics endpoint (fire-and-forget, no await)
    fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently fail — analytics should never break the app
    });
  }
}

// Singleton instance
export const analytics = new AnalyticsClient();

// ── Lifecycle instrumentation helpers ──

export function trackRecipeCreated(recipeId: string, method: string) {
  analytics.track(AnalyticsEvents.RECIPE_CREATED, { recipeId, method });
}

export function trackRecipeVersionCreated(recipeId: string, version: number) {
  analytics.track(AnalyticsEvents.RECIPE_VERSION_CREATED, { recipeId, version });
}

export function trackBatchCreated(batchId: string, recipeId: string, version: number) {
  analytics.track(AnalyticsEvents.BATCH_CREATED, { batchId, recipeId, version });
}

export function trackBatchStarted(batchId: string) {
  analytics.track(AnalyticsEvents.BATCH_STARTED, { batchId });
}

export function trackBatchCompleted(batchId: string) {
  analytics.track(AnalyticsEvents.BATCH_COMPLETED, { batchId });
}

export function trackBatchAbandoned(batchId: string) {
  analytics.track(AnalyticsEvents.BATCH_ABANDONED, { batchId });
}

export function trackCureObservationCreated(batchId: string, day: number) {
  analytics.track(AnalyticsEvents.CURE_OBSERVATION_CREATED, { batchId, day });
}

export function trackCureMarkedReady(batchId: string) {
  analytics.track(AnalyticsEvents.CURE_MARKED_READY, { batchId });
}

export function trackCureYieldRequested(batchId: string) {
  analytics.track(AnalyticsEvents.CURE_YIELD_REQUESTED, { batchId });
}

export function trackCostCalculated(batchId: string) {
  analytics.track(AnalyticsEvents.COST_CALCULATED, { batchId });
}

export function trackCostSaved(batchId: string) {
  analytics.track(AnalyticsEvents.COST_SAVED, { batchId });
}

export function trackSessionStarted() {
  analytics.track(AnalyticsEvents.SESSION_STARTED, {});
}

export function trackSessionEnded() {
  analytics.track(AnalyticsEvents.SESSION_ENDED, {});
}

export function trackOnboardingStarted() {
  analytics.track(AnalyticsEvents.ONBOARDING_STARTED, {});
}

export function trackOnboardingStepCompleted(step: number) {
  analytics.track(AnalyticsEvents.ONBOARDING_STEP_COMPLETED, { step });
}

export function trackOnboardingCompleted() {
  analytics.track(AnalyticsEvents.ONBOARDING_COMPLETED, {});
}

// ── Activation and connected completion queries ──

// These queries can be run against the analytics events table
// to compute activation and connected completion metrics.

export function activationQuery() {
  // Count unique anonymousIds with session.started event
  // within the last 30 days
  return `
    SELECT COUNT(DISTINCT anonymousId) as activated_users
    FROM analytics_events
    WHERE event = 'session.started'
      AND timestamp >= NOW() - INTERVAL '30 days'
  `;
}

export function connectedCompletionQuery() {
  // Count unique anonymousIds that have both
  // batch.created and batch.completed events
  return `
    SELECT COUNT(DISTINCT a.anonymousId) as completed_users
    FROM analytics_events a
    WHERE a.event = 'batch.created'
      AND EXISTS (
        SELECT 1 FROM analytics_events b
        WHERE b.anonymousId = a.anonymousId
          AND b.event = 'batch.completed'
      )
  `;
}

// ── Analytics API route ──

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, anonymousId, timestamp, data } = body as {
      event: string;
      anonymousId: string;
      timestamp: string;
      data: Record<string, unknown>;
    };

    // Validate required fields
    if (!event || !anonymousId) {
      return new Response(
        JSON.stringify({ error: "event and anonymousId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate event name is a known PRD event
    const validEvents = Object.values(AnalyticsEvents);
    if (!validEvents.includes(event as string)) {
      return new Response(
        JSON.stringify({ error: `Unknown event: ${event}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Store event (in production, write to analytics_events table)
    // For now, log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", event, { anonymousId, data });
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to process analytics event" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
