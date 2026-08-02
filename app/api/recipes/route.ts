import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/schema";
import { recipes, recipeVersions } from "@/db/schema";
import { calculateFormulation } from "@/lib/calculations/sap";

export async function GET() {
  try {
    const allRecipes = await db.select().from(recipes).orderBy(recipes.createdAt);
    return NextResponse.json(allRecipes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      method,
      oilBlend,
      superfatPercent,
      lyeConcentrationPercent,
      waterToLyeRatio,
      propertyRanges,
    } = body;
    const fragranceLoadPercent = body.fragranceLoadPercent ?? body.fragranceLoad ?? 0;

    if (!name || !oilBlend || oilBlend.length === 0) {
      return NextResponse.json(
        { error: "Name and oil blend are required" },
        { status: 400 }
      );
    }

    const calculated = calculateFormulation({
      oilBlend,
      superfatPercent,
      lyeConcentrationPercent,
      waterToLyeRatio,
      fragranceLoadPercent,
    });

    const [recipe] = await db.insert(recipes).values({
      id: crypto.randomUUID(),
      name,
      method,
      createdBy: "user",
      isCurated: 0,
    }).returning();

    await db.insert(recipeVersions).values({
      id: crypto.randomUUID(),
      recipeId: recipe.id,
      version: 1,
      name,
      method,
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
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
