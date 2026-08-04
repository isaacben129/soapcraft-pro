// ── Ingredient Cost Records API ──────────────
// R6.1: Add/edit/archive purchase costs, unit normalization, supplier/effective date, user ownership.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ingredientCostRecords } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// ── Unit normalization ──────────────────────
// Converts cost per unit to a common base unit (grams).

const UNIT_TO_GRAMS: Record<string, number> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
};

export function normalizeToGrams(costPerUnit: number, unit: string): number {
  const gramsPerUnit = UNIT_TO_GRAMS[unit];
  if (!gramsPerUnit) {
    throw new Error(`Unknown unit: ${unit}. Supported: g, kg, oz, lb`);
  }
  return costPerUnit / gramsPerUnit;
}

export function normalizeCost(costPerUnit: number, fromUnit: string, toUnit: string): number {
  const costPerGram = normalizeToGrams(costPerUnit, fromUnit);
  const gramsPerTarget = UNIT_TO_GRAMS[toUnit];
  if (!gramsPerTarget) {
    throw new Error(`Unknown target unit: ${toUnit}`);
  }
  return costPerGram * gramsPerTarget;
}

// ── GET /api/ingredient-costs ──────────────
// Returns user's ingredient cost records, grouped by ingredient.

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const records = await db
      .select()
      .from(ingredientCostRecords)
      .where(and(
        eq(ingredientCostRecords.userId, session.user.id),
        eq(ingredientCostRecords.archivedAt, null)
      ))
      .orderBy(ingredientCostRecords.effectiveDate);

    // Group by ingredientId for normalized cost lookup
    const byIngredient = new Map<string, typeof records>();
    for (const record of records) {
      const existing = byIngredient.get(record.ingredientId) || [];
      existing.push(record);
      byIngredient.set(record.ingredientId, existing);
    }

    // Build normalized cost per gram for each ingredient
    const normalizedCosts: Record<string, { costPerGram: number; unit: string; source: string; effectiveDate: string }> = {};
    for (const [ingredientId, ingredientRecords] of byIngredient) {
      // Use the most recent effective record
      const latest = ingredientRecords[ingredientRecords.length - 1];
      normalizedCosts[ingredientId] = {
        costPerGram: normalizeToGrams(latest.costPerUnit, latest.unit),
        unit: "g",
        source: latest.source || "unknown",
        effectiveDate: latest.effectiveDate.toISOString(),
      };
    }

    return NextResponse.json({
      records,
      normalizedCosts,
      unitConversions: UNIT_TO_GRAMS,
    });
  } catch (error) {
    console.error("Ingredient costs GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredient costs" },
      { status: 500 }
    );
  }
}

// ── POST /api/ingredient-costs ─────────────
// Create a new ingredient cost record.

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      ingredientId,
      costPerUnit,
      unit,
      currency,
      source,
      effectiveDate,
    } = body as {
      ingredientId: string;
      costPerUnit: number;
      unit: string;
      currency?: string;
      source?: string;
      effectiveDate: string;
    };

    // Validate required fields
    if (!ingredientId || costPerUnit == null || !unit || !effectiveDate) {
      return NextResponse.json(
        { error: "ingredientId, costPerUnit, unit, and effectiveDate are required" },
        { status: 400 }
      );
    }

    // Validate unit
    if (!UNIT_TO_GRAMS[unit]) {
      return NextResponse.json(
        { error: `Invalid unit: ${unit}. Supported: g, kg, oz, lb` },
        { status: 400 }
      );
    }

    // Validate cost is positive
    if (costPerUnit <= 0) {
      return NextResponse.json(
        { error: "costPerUnit must be a positive number" },
        { status: 400 }
      );
    }

    const newRecord = {
      id: crypto.randomUUID(),
      ingredientId,
      userId: session.user.id,
      costPerUnit,
      unit,
      currency: currency || "USD",
      source: source || "",
      effectiveDate: new Date(effectiveDate),
      archivedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(ingredientCostRecords).values(newRecord);

    return NextResponse.json({
      id: newRecord.id,
      ingredientId: newRecord.ingredientId,
      costPerUnit: newRecord.costPerUnit,
      unit: newRecord.unit,
      costPerGram: normalizeToGrams(newRecord.costPerUnit, newRecord.unit),
    });
  } catch (error) {
    console.error("Ingredient costs POST error:", error);
    return NextResponse.json(
      { error: "Failed to create ingredient cost record" },
      { status: 500 }
    );
  }
}

// ── PATCH /api/ingredient-costs/[id] ──────
// Archive a cost record (soft delete).

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id query parameter is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(ingredientCostRecords)
      .where(and(
        eq(ingredientCostRecords.id, id),
        eq(ingredientCostRecords.userId, session.user.id)
      ))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "Record not found or access denied" },
        { status: 404 }
      );
    }

    await db
      .update(ingredientCostRecords)
      .set({ archivedAt: new Date(), updatedAt: new Date() })
      .where(eq(ingredientCostRecords.id, id));

    return NextResponse.json({ id, archivedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Ingredient costs PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to archive ingredient cost record" },
      { status: 500 }
    );
  }
}
