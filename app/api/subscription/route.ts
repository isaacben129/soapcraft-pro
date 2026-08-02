import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const tier = req.headers.get("x-subscription-tier") || "free";
  return NextResponse.json({ tier });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tier } = body;

    if (!["free", "pro"].includes(tier)) {
      return NextResponse.json(
        { error: "Invalid tier" },
        { status: 400 }
      );
    }

    return NextResponse.json({ tier, expiresAt: null });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update tier" },
      { status: 500 }
    );
  }
}