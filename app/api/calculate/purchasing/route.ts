import { NextRequest, NextResponse } from "next/server";
import { purchasePlan } from "@/lib/calculations/purchasing";
export async function POST(request: NextRequest) { try { const body = await request.json(); const rows = Array.isArray(body.requirements) ? body.requirements : [body]; return NextResponse.json({ purchases: rows.map(purchasePlan) }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid purchasing request" }, { status: 400 }); } }
