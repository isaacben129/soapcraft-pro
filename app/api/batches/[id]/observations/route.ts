import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/schema";
import { cureObservations, batches } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { day, pH, hardness, notes } = body;

    if (!day || day < 1) {
      return NextResponse.json(
        { error: "Day must be a positive number" },
        { status: 400 }
      );
    }

    const [result] = await db
      .insert(cureObservations)
      .values({
        batchId: params.id,
        day,
        pH: pH ?? null,
        hardness: hardness ?? null,
        notes: notes ?? null,
      })
      .returning();

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save observation" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const results = await db
      .select()
      .from(cureObservations)
      .where(eq(cureObservations.batchId, params.id))
      .orderBy(cureObservations.day);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch observations" },
      { status: 500 }
    );
  }
}