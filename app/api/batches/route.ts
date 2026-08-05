// ── Batch Creation API ──────────────────
// R4.1: Select exact version, copy planned measurement snapshot,
// create user-owned batch, activity event, dashboard/list visibility.
// Later recipe edit does not alter batch plan.
// Unsaved recipe draft cannot start batch.
// Cross-user version ID denied.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/schema";
import { batches, recipeVersions, recipes, activityEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";

type OilBlendEntry = { oilId: string; percent: number };

// ── GET /api/batches ───────────────────
// List user's batches with recipe version info.

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userBatches = await db
      .select()
      .from(batches)
      .where(eq(batches.userId, session.user.id))
      .orderBy(batches.createdAt);

    return NextResponse.json({ batches: userBatches });
  } catch (error) {
    console.error("Batches GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}

// ── POST /api/batches ──────────────────
// Create a batch from a recipe version.

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { recipeId, versionId, batchName } = body as {
      recipeId: string;
      versionId: string;
      batchName: string;
    };

    // Validate required fields
    if (!recipeId || !versionId || !batchName?.trim()) {
      return NextResponse.json(
        { error: "recipeId, versionId, and batchName are required" },
        { status: 400 }
      );
    }

    // Verify recipe exists and belongs to user
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.id, recipeId), eq(recipes.createdBy, session.user.id)))
      .limit(1);

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found or access denied" },
        { status: 404 }
      );
    }

    // Verify version exists and belongs to this recipe
    const [version] = await db
      .select()
      .from(recipeVersions)
      .where(and(eq(recipeVersions.id, versionId), eq(recipeVersions.recipeId, recipeId)))
      .limit(1);

    if (!version) {
      return NextResponse.json(
        { error: "Version not found or access denied" },
        { status: 404 }
      );
    }

    // Unsaved recipe draft cannot start batch — check if recipe has at least one completed version
    // (already verified by finding the version above)

    // Copy planned measurement snapshot from version
    // Later recipe edit does not alter batch plan — we snapshot the version data
    const oilBlend = Array.isArray(version.oilBlend)
      ? (version.oilBlend as OilBlendEntry[])
      : [];
    const plannedSnapshot = {
      oilBlend,
      superfatPercent: version.superfatPercent,
      lyeConcentrationPercent: version.lyeConcentrationPercent,
      waterToLyeRatio: version.waterToLyeRatio,
      calculatedLyeNaOH: version.calculatedLyeNaOH,
      calculatedLyeKOH: version.calculatedLyeKOH,
      calculatedWater: version.calculatedWater,
      calculatedFragranceLoad: version.calculatedFragranceLoad,
      warnings: version.warnings,
      datasetRevision: version.datasetRevision,
    };

    const newBatch = {
      id: crypto.randomUUID(),
      recipeVersionId: versionId,
      userId: session.user.id,
      batchName: batchName.trim(),
      plannedSnapshot,
      status: "draft",
      archivedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [batch] = await db.insert(batches).values(newBatch).returning();

    // Append activity event
    await db.insert(activityEvents).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      action: "created",
      entityType: "batch",
      entityId: batch.id,
      payload: {
        entityName: batchName.trim(),
        recipeId,
        recipeName: recipe.name,
        version: version.version,
      },
    });

    return NextResponse.json(
      {
        id: batch.id,
        name: batch.batchName,
        recipeId,
        versionId: batch.recipeVersionId,
        version: version.version,
        plannedSnapshot: batch.plannedSnapshot,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Batch create error:", error);
    return NextResponse.json(
      { error: "Failed to create batch" },
      { status: 500 }
    );
  }
}
