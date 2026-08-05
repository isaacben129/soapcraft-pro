// ── PostHog Analytics Client ──────────────────
// Replaces the stub analytics route with real PostHog forwarding.
// All events are privacy-safe: no PII, no formulation data, no payment details.

import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

// ── Initialise PostHog ────────────────────────
// Call once at app initialisation (e.g. in a root layout or provider).

export function initPostHog(): void {
  if (!POSTHOG_KEY) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Do not capture pageviews automatically — we send explicit events.
    capture_pageview: false,
    // Do not capture page leave events.
    capture_pageleave: false,
    // Use the anonymous ID from localStorage (matches existing pattern).
  });
  posthog.identify(getAnonymousId());
}

// ── Anonymous ID ──────────────────────────────
// Matches the existing localStorage pattern in analytics.ts.

function getAnonymousId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("soapcraft-analytics-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("soapcraft-analytics-id", id);
  }
  return id;
}

// ── Event forwarding ──────────────────────────
// Forward any event to PostHog. Called by the analytics route on the server,
// and by the client-side analytics.ts wrapper on the browser.

export function posthogTrack(
  event: string,
  properties: Record<string, unknown> = {}
): void {
  if (!POSTHOG_KEY || typeof posthog === "undefined") return;

  try {
    posthog.capture(event, {
      ...properties,
      // Always include the anonymous ID for cross-device matching.
      distinct_id: getAnonymousId(),
      // Tag events with the source for filtering.
      source: "soapcraft-pro",
    });
  } catch {
    // PostHog failures must never break the app.
  }
}

// ── SEO funnel events ─────────────────────────
// Pre-built helpers for the SEO acquisition funnel.

export function trackSeoImpression(page: string, query: string, position: number) {
  posthogTrack("seo_impression", { page, query, position });
}

export function trackSeoClick(page: string, query: string, position: number) {
  posthogTrack("seo_click", { page, query, position });
}

export function trackSeoToolStarted(page: string, tool: string) {
  posthogTrack("seo_tool_started", { page, tool });
}

export function trackSeoToolCompleted(page: string, tool: string) {
  posthogTrack("seo_tool_completed", { page, tool });
}

export function trackSeoProductBridgeClick(page: string, productPage: string) {
  posthogTrack("seo_product_bridge_clicked", { page, productPage });
}

export function trackSeoSignup(page: string) {
  posthogTrack("seo_signup", { page });
}

export function trackSeoRecipeSaved(page: string) {
  posthogTrack("seo_recipe_saved", { page });
}

export function trackSeoBatchStarted(page: string) {
  posthogTrack("seo_batch_started", { page });
}

export function trackSeoPaid(page: string) {
  posthogTrack("seo_paid", { page });
}

// ── Product lifecycle events ──────────────────
// Re-export the existing event names for compatibility.

export const POSTHOG_EVENTS = {
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
  CURE_MARKED_READY: "cure.marked_ready",
  CURE_YIELD_REQUESTED: "cure.yield_requested",
  // Cost lifecycle
  COST_CALCULATED: "cost.calculated",
  COST_SAVED: "cost.saved",
  // Auth
  SESSION_STARTED: "session.started",
  SESSION_ENDED: "session.ended",
  // Onboarding
  ONBOARDING_STARTED: "onboarding.started",
  ONBOARDING_STEP_COMPLETED: "onboarding.step_completed",
  ONBOARDING_COMPLETED: "onboarding.completed",
  // SEO funnel
  SEO_IMPRESSION: "seo_impression",
  SEO_CLICK: "seo_click",
  SEO_TOOL_STARTED: "seo_tool_started",
  SEO_TOOL_COMPLETED: "seo_tool_completed",
  SEO_PRODUCT_BRIDGE_CLICKED: "seo_product_bridge_clicked",
  SEO_SIGNUP: "seo_signup",
  SEO_RECIPE_SAVED: "seo_recipe_saved",
  SEO_BATCH_STARTED: "seo_batch_started",
  SEO_PAID: "seo_paid",
} as const;
