// ── Analytics API Route ──────────────
// R10.1: Receive privacy-safe analytics events.
// Forwards to PostHog when configured.
// No PII in payloads. Known event names only.

import { NextRequest, NextResponse } from "next/server";
import { posthogTrack } from "@/lib/analytics/posthog";

const VALID_EVENTS = new Set([
  // Product lifecycle
  "homepage_viewed",
  "cta_clicked",
  "demo_calculation_viewed",
  "recipe_started",
  "recipe_saved",
  "batch_started",
  "batch_completed",
  "cost_analysis_viewed",
  // SEO funnel
  "seo_impression",
  "seo_click",
  "seo_tool_started",
  "seo_tool_completed",
  "seo_product_bridge_clicked",
  "seo_signup",
  "seo_recipe_saved",
  "seo_batch_started",
  "seo_paid",
  // Auth
  "signup_started",
  "signup_completed",
  "login_started",
  "login_completed",
  // Content production
  "content_topic_selected",
  "content_drafted",
  "content_published",
  "content_rejected",
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, anonymousId, timestamp, data } = body as {
      event: string;
      anonymousId: string;
      timestamp: string;
      data: Record<string, unknown>;
    };

    if (!event || !anonymousId) {
      return NextResponse.json(
        { error: "event and anonymousId are required" },
        { status: 400 }
      );
    }

    if (!VALID_EVENTS.has(event)) {
      return NextResponse.json(
        { error: `Unknown event type: ${event}` },
        { status: 400 }
      );
    }

    // Forward to PostHog if configured
    posthogTrack(event, { ...data, source: "api" });

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", event, { anonymousId, data });
    }

    return NextResponse.json({ received: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process analytics event" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";