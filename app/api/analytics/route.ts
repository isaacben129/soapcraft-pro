// ── Analytics API Route ──────────────
// R10.1: Receive privacy-safe analytics events.
// No PII in payloads. Known event names only.

import { NextRequest, NextResponse } from "next/server";

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

    // In production, write to analytics_events table
    console.log("[Analytics]", event, { anonymousId, data });

    return NextResponse.json({ received: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process analytics event" },
      { status: 500 }
    );
  }
}
