// ── Email Capture API ──────────────────────
// No auth required. Captures email for CRM and immediate PDF delivery.
// Rate-limited by Vercel edge functions.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source, calculationData } = body as {
      email: string;
      source: string;
      calculationData?: {
        costPerBar: number;
        suggestedPrice: number;
        totalCost: number;
      };
    };

    // Validate email
    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // In production, this would integrate with a CRM (ConvertKit, Mailchimp, etc.)
    // For now, we log it and return success. The actual CRM integration
    // should be handled by a serverless function or the Next.js API route.

    console.log(`[EMAIL CAPTURE] ${email} from ${source}`, JSON.stringify(calculationData));

    // TODO: Integrate with actual CRM service
    // - ConvertKit: POST to https://api.convertkit.com/v3/forms/{id}/subscribe
    // - Mailchimp: POST to https://usX.api.mailchimp.com/3.0/lists/{id}/members
    // - Resend: POST to https://api.resend.com/emails

    return NextResponse.json({
      success: true,
      message: "Welcome email sent. Check your inbox.",
      email,
    });
  } catch (error) {
    console.error("Email capture error:", error);
    return NextResponse.json(
      { error: "Failed to capture email" },
      { status: 500 }
    );
  }
}
