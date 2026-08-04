// ── Cure Observation API ──────────────
// R5.1: Create/read/update/delete observations with ownership.
// Computed day from observedAt/cureStartedAt. Structured text/numeric fields.
// Completion/ready transition requires explicit user action.
// Activity events on all mutations.
// Demo route removed. User can correct observation.
// Language/tests never treat elapsed time as safety certification.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/schema";
import { cureObservations, batches, activityEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// ── GET /api/batches/[id]/observations ──────────
// List observations for a batch (user-owned).

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify batch belongs to user
    const [batch] = await db
      .select()
      .from(batches)
      .where(and(eq(batches.id, id), eq(batches.userId, session.user.id)))
      .limit(1);

    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    const observations = await db
      .select()
      .from(cureObservations)
      .where(eq(cureObservations.batchId, id))
      .orderBy(cureObservations.observedAt);

    // Compute day for each observation
    const observationsWithDay = observations.map((obs) => {
      const cureStart = batch.cureStartedAt || batch.createdAt;
      const day = Math.floor(
        (new Date(obs.observedAt).getTime() - new Date(cureStart).getTime()) /
          86400000
      );
      return { ...obs, day };
    });

    return NextResponse.json({ observations: observationsWithDay });
  } catch (error) {
    console.error("Observations GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch observations" },
      { status: 500 }
    );
  }
}

// ── POST /api/batches/[id]/observations ────────
// Create an observation with ownership.

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { observedAt, note, temperature, hardness, color, scent } = body as {
      observedAt: string;
      note: string;
      temperature?: number;
      hardness?: number;
      color?: string;
      scent?: string;
    };

    // Validate required fields
    if (!observedAt || !note?.trim()) {
      return NextResponse.json(
        { error: "observedAt and note are required" },
        { status: 400 }
      );
    }

    // Verify batch belongs to user
    const [batch] = await db
      .select()
      .from(batches)
      .where(and(eq(batches.id, id), eq(batches.userId, session.user.id)))
      .limit(1);

    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    // Compute day from observedAt / cureStartedAt
    const cureStart = batch.cureStartedAt || batch.createdAt;
    const day = Math.floor(
      (new Date(observedAt).getTime() - new Date(cureStart).getTime()) / 86400000
    );

    // Create observation
    const newObservation = {
      id: crypto.randomUUID(),
      batchId: id,
      userId: session.user.id,
      observedAt,
      note: note.trim(),
      temperature: temperature ?? null,
      hardness: hardness ?? null,
      color: color ?? null,
      scent: scent ?? null,
      day,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(cureObservations).values(newObservation);

    // Append activity event
    await db.insert(activityEvents).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      action: "created",
      entityType: "cure-observation",
      entityId: newObservation.id,
      entityName: `Day ${day} observation`,
      details: { batchId: id, day, observedAt },
    });

    return NextResponse.json({ observation: newObservation }, { status: 201 });
  } catch (error) {
    console.error("Observation POST error:", error);
    return NextResponse.json(
      { error: "Failed to create observation" },
      { status: 500 }
    );
  }
}

// ── PUT /api/batches/[id]/observations/[obsId] ──
// Update an observation (user can correct).

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; obsId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, obsId } = await params;
    const body = await req.json();
    const { observedAt, note, temperature, hardness, color, scent } = body as {
      observedAt?: string;
      note?: string;
      temperature?: number;
      hardness?: number;
      color?: string;
      scent?: string;
    };

    // Verify observation belongs to user's batch
    const [obs] = await db
      .select()
      .from(cureObservations)
      .where(
        and(
          eq(cureObservations.id, obsId),
          eq(cureObservations.userId, session.user.id)
        )
      )
      .limit(1);

    if (!obs) {
      return NextResponse.json({ error: "Observation not found" }, { status: 404 });
    }

    // Update observation
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (observedAt) updates.observedAt = observedAt;
    if (note !== undefined) updates.note = note.trim();
    if (temperature !== undefined) updates.temperature = temperature;
    if (hardness !== undefined) updates.hardness = hardness;
    if (color !== undefined) updates.color = color;
    if (scent !== undefined) updates.scent = scent;

    // Recompute day if observedAt changed
    if (observedAt) {
      const [batch] = await db
        .select()
        .from(batches)
        .where(eq(batches.id, id))
        .limit(1);
      const cureStart = batch?.cureStartedAt || batch?.createdAt;
      if (cureStart) {
        updates.day = Math.floor(
          (new Date(observedAt).getTime() - new Date(cureStart).getTime()) / 86400000
        );
      }
    }

    await db
      .update(cureObservations)
      .set(updates)
      .where(eq(cureObservations.id, obsId));

    // Append activity event
    await db.insert(activityEvents).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      action: "updated",
      entityType: "cure-observation",
      entityId: obsId,
      entityName: `Day ${obs.day} observation`,
      details: { batchId: id, observationId: obsId },
    });

    return NextResponse.json({ observation: { ...obs, ...updates } });
  } catch (error) {
    console.error("Observation PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update observation" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/batches/[id]/observations/[obsId] ──
// Delete an observation.

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; obsId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, obsId } = await params;

    // Verify observation belongs to user's batch
    const [obs] = await db
      .select()
      .from(cureObservations)
      .where(
        and(
          eq(cureObservations.id, obsId),
          eq(cureObservations.userId, session.user.id)
        )
      )
      .limit(1);

    if (!obs) {
      return NextResponse.json({ error: "Observation not found" }, { status: 404 });
    }

    await db
      .delete(cureObservations)
      .where(eq(cureObservations.id, obsId));

    // Append activity event
    await db.insert(activityEvents).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      action: "deleted",
      entityType: "cure-observation",
      entityId: obsId,
      entityName: `Day ${obs.day} observation`,
      details: { batchId: id, observationId: obsId },
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Observation DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete observation" },
      { status: 500 }
    );
  }
}