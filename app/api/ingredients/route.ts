// ── Ingredient Catalogue Read Model ──────────────
// R3.1: Seed sourced system ingredients, expose user-scoped/system catalogue query,
// surface source/SAP revision, no arbitrary system createdBy.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ingredients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_OILS } from "@/lib/calculations/sap";

type CatalogueIngredient = (typeof DEFAULT_OILS)[number] & {
  source: string;
  datasetRevision: string;
  isPrivate?: boolean;
};

// ── GET /api/ingredients ───────────────────────────
// Returns the system ingredient catalogue with source/SAP revision.

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // System catalogue is public for authenticated users
    // User-scoped private ingredients are filtered by userId

    // Return the system catalogue (DEFAULT_OILS as the authoritative source)
    const catalogue: CatalogueIngredient[] = DEFAULT_OILS.map((oil) => ({
      id: oil.id,
      name: oil.name,
      nameShort: oil.nameShort,
      sapValueNaOH: oil.sapValueNaOH,
      sapValueKOH: oil.sapValueKOH,
      hardnessFactor: oil.hardnessFactor,
      latherFactor: oil.latherFactor,
      moisturizingFactor: oil.moisturizingFactor,
      cleansingFactor: oil.cleansingFactor,
      conditionFactor: oil.conditionFactor,
      ifraCategory: oil.ifraCategory,
      maxUsagePercent: oil.maxUsagePercent,
      source: "soapcraft-pro-system",
      datasetRevision: "1.0.0",
    }));

    // If user is authenticated, also include their private ingredients
    const userIngredients: CatalogueIngredient[] = session?.user?.id
      ? (
          await db
            .select()
            .from(ingredients)
            .where(eq(ingredients.createdBy, session.user.id))
            .limit(50)
        ).map((ing) => ({
          id: ing.id,
          name: ing.name,
          nameShort: ing.nameShort,
          sapValueNaOH: ing.sapValueNaOH,
          sapValueKOH: ing.sapValueKOH,
          hardnessFactor: ing.hardnessFactor,
          latherFactor: ing.latherFactor,
          moisturizingFactor: ing.moisturizingFactor,
          cleansingFactor: ing.cleansingFactor,
          conditionFactor: ing.conditionFactor,
          ifraCategory: ing.ifraCategory,
          maxUsagePercent: ing.maxUsagePercent,
          source: "user-defined",
          datasetRevision: "1.0.0",
          isPrivate: true,
        }))
      : [];

    return NextResponse.json({
      catalogue,
      userIngredients,
      source: "DEFAULT_OILS in lib/calculations/sap.ts",
      datasetRevision: "1.0.0",
      totalSystemIngredients: catalogue.length,
    });
  } catch (error) {
    console.error("Ingredients GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredients" },
      { status: 500 }
    );
  }
}

// ── POST /api/ingredients ──────────────────────────
// Create a user-defined private ingredient.

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      nameShort,
      sapValueNaOH,
      sapValueKOH,
      hardnessFactor,
      latherFactor,
      moisturizingFactor,
      cleansingFactor,
      conditionFactor,
      ifraCategory,
      maxUsagePercent,
    } = body as {
      name: string;
      nameShort: string;
      sapValueNaOH: number;
      sapValueKOH: number;
      hardnessFactor?: number;
      latherFactor?: number;
      moisturizingFactor?: number;
      cleansingFactor?: number;
      conditionFactor?: number;
      ifraCategory?: string | null;
      maxUsagePercent?: number | null;
    };

    // Validate required fields
    if (!name || !nameShort || sapValueNaOH == null || sapValueKOH == null) {
      return NextResponse.json(
        { error: "name, nameShort, sapValueNaOH, and sapValueKOH are required" },
        { status: 400 }
      );
    }

    // Unknown/missing SAP blocks calculation — validate SAP values are positive
    if (sapValueNaOH <= 0 || sapValueKOH <= 0) {
      return NextResponse.json(
        { error: "SAP values must be positive numbers" },
        { status: 400 }
      );
    }

    const newIngredient = {
      id: crypto.randomUUID(),
      name,
      nameShort,
      sapValueNaOH,
      sapValueKOH,
      hardnessFactor: hardnessFactor ?? 0,
      latherFactor: latherFactor ?? 0,
      moisturizingFactor: moisturizingFactor ?? 0,
      cleansingFactor: cleansingFactor ?? 0,
      conditionFactor: conditionFactor ?? 0,
      ifraCategory: ifraCategory ?? null,
      maxUsagePercent: maxUsagePercent ?? null,
      source: "user-defined",
      createdBy: session.user.id,
      isPrivate: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(ingredients).values(newIngredient);

    return NextResponse.json({
      id: newIngredient.id,
      name: newIngredient.name,
      nameShort: newIngredient.nameShort,
      source: "user-defined",
      datasetRevision: "1.0.0",
    });
  } catch (error) {
    console.error("Ingredients POST error:", error);
    return NextResponse.json(
      { error: "Failed to create ingredient" },
      { status: 500 }
    );
  }
}
