import { NextRequest, NextResponse } from "next/server";
import { calculateBatchCost } from "@/lib/calculations/economics";
export async function POST(request: NextRequest) { try { const input = await request.json(); return NextResponse.json(calculateBatchCost(input)); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid economics request" }, { status: 400 }); } }
