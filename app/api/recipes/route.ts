import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/schema";
import { recipes, recipeVersions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

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
    const { name, method, oilBlend, superfatPercent, lyeConcentrationPercent, waterToLyeRatio } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Recipe name is required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const [recipe] = await db
      .insert(recipes)
      .values({
        id: uuid(),
        name,
        method: method ?? "cp",
        createdBy: "user",
        isCurated: 0,
      })
      .returning();

    await db.insert(recipeVersions).values({
      id: uuid(),
      recipeId: recipe.id,
      version: 1,
      name,
      method: method ?? "cp",
      oilBlend: oilBlend ?? [],
      superfatPercent: superfatPercent ?? 5,
      lyeConcentrationPercent: lyeConcentrationPercent ?? 33,
      waterToLyeRatio: waterToLyeRatio ?? 2.5,
      calculatedLyeNaOH: 0,
      calculatedLyeKOH: 0,
      calculatedWater: 0,
      calculatedFragranceLoad: 0,
      propertyRanges: null,
      warnings: [],
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}