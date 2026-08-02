import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/schema";
import { cureObservations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
        batchId: id,
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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const results = await db
      .select()
      .from(cureObservations)
      .where(eq(cureObservations.batchId, id))
      .orderBy(cureObservations.day);

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch observations" },
      { status: 500 }
    );
  }
}