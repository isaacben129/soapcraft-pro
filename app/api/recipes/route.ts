// ── Recipe Create API ────────────────────────────
// R3.2: Authenticate, validate ownership/input, run authoritative calculation
// server-side, create Recipe + Version 1 atomically, persist calculation/dataset
// version and warnings, append activity event.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/schema";
import { recipes, recipeVersions, activityEvents } from "@/db/schema";
import { calculateFormulation } from "@/lib/calculations/sap";
import { eq } from "drizzle-orm";

// ── POST /api/recipes ──────────────────────────
// Create a new recipe with authoritative server-side calculation.

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      notes,
      method,
      oilBlend,
      superfatPercent,
      lyeConcentrationPercent,
      waterToLyeRatio,
      fragranceLoadPercent,
      propertyRanges,
      idempotencyKey,
    } = body as {
      name: string;
      notes?: string;
      method?: string;
      oilBlend: Array<{ oilId: string; percent: number }>;
      superfatPercent: number;
      lyeConcentrationPercent: number;
      waterToLyeRatio: number;
      fragranceLoadPercent?: number;
      propertyRanges?: Record<string, { min: number; max: number }>;
      idempotencyKey?: string;
    };

    // 2. Validate required fields
    if (!name || !oilBlend || oilBlend.length === 0) {
      return NextResponse.json(
        { error: "Name and oil blend are required" },
        { status: 400 }
      );
    }

    // Validate oil blend percentages
    const totalPercent = oilBlend.reduce((sum, o) => sum + o.percent, 0);
    if (Math.abs(totalPercent - 100) > 0.01) {
      return NextResponse.json(
        { error: `Oil percentages sum to ${totalPercent.toFixed(2)}%, not 100%` },
        { status: 400 }
      );
    }

    for (const oil of oilBlend) {
      if (oil.percent <= 0) {
        return NextResponse.json(
          { error: `${oil.oilId} has ${oil.percent}% — must be > 0` },
          { status: 400 }
        );
      }
      if (oil.percent > 100) {
        return NextResponse.json(
          { error: `${oil.oilId} has ${oil.percent}% — must be ≤ 100` },
          { status: 400 }
        );
      }
    }

    // 3. Check for duplicate idempotency key
    if (idempotencyKey) {
      const existing = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, idempotencyKey))
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json(
          { error: "Recipe already exists (duplicate idempotency key)", recipeId: existing[0].id },
          { status: 409 }
        );
      }
    }

    // 4. Run authoritative calculation server-side
    // Client totals are ignored/recomputed
    const fragranceLoad = fragranceLoadPercent ?? 0;
    const calculated = calculateFormulation({
      oilBlend,
      superfatPercent,
      lyeConcentrationPercent,
      waterToLyeRatio,
      fragranceLoadPercent: fragranceLoad,
    });

    // 5. Check for blocking warnings
    const blockingWarnings = calculated.warnings.filter(
      (w) => w.type === "danger"
    );

    if (blockingWarnings.length > 0) {
      return NextResponse.json(
        {
          error: "Recipe has blocking warnings and cannot be saved",
          warnings: blockingWarnings,
        },
        { status: 422 }
      );
    }

    // 6. Create Recipe + Version 1 atomically
    const recipeId = crypto.randomUUID();
    const versionId = crypto.randomUUID();

    const [recipe] = await db.insert(recipes).values({
      id: recipeId,
      name,
      notes: notes ?? "",
      method: method ?? "CP",
      createdBy: session.user.id,
      isCurated: 0,
      currentVersionId: versionId,
    }).returning();

    await db.insert(recipeVersions).values({
      id: versionId,
      recipeId,
      version: 1,
      name,
      notes: notes ?? "",
      method: method ?? "CP",
      oilBlend,
      superfatPercent,
      lyeConcentrationPercent,
      waterToLyeRatio,
      calculatedLyeNaOH: calculated.lyeNaOH,
      calculatedLyeKOH: calculated.lyeKOH,
      calculatedWater: calculated.water,
      calculatedFragranceLoad: calculated.fragranceLoad,
      propertyRanges: propertyRanges ?? calculated.propertyRanges,
      warnings: calculated.warnings,
      datasetRevision: "1.0.0",
    });

    // 7. Append activity event
    await db.insert(activityEvents).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      action: "created",
      entityType: "recipe",
      entityId: recipeId,
      payload: {
        entityName: name,
        version: 1,
        warnings: calculated.warnings.length,
      },
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        id: recipe.id,
        name: recipe.name,
        version: 1,
        warnings: calculated.warnings,
        datasetRevision: "1.0.0",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Recipe create error:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
