// ── Public Recipe Scaling API ──────────────
// No auth required. Accepts original recipe ingredients and scale factor.
// Returns scaled ingredient amounts.

import { NextRequest, NextResponse } from "next/server";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface RecipeScalingInput {
  ingredients: Ingredient[];
  scaleFactor: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients, scaleFactor } = body as RecipeScalingInput;

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "At least one ingredient is required" },
        { status: 400 }
      );
    }

    if (!scaleFactor || scaleFactor <= 0) {
      return NextResponse.json(
        { error: "Scale factor must be a positive number" },
        { status: 400 }
      );
    }

    const scaledIngredients = ingredients.map((ing) => ({
      ...ing,
      scaledAmount: Math.round(ing.amount * scaleFactor * 100) / 100,
    }));

    return NextResponse.json({
      originalIngredients: ingredients,
      scaleFactor,
      scaledIngredients,
      totalOriginalAmount: ingredients.reduce((sum, ing) => sum + ing.amount, 0),
      totalScaledAmount: ingredients.reduce((sum, ing) => sum + ing.amount * scaleFactor, 0),
    });
  } catch (error) {
    console.error("Recipe scaling error:", error);
    return NextResponse.json(
      { error: "Failed to scale recipe" },
      { status: 500 }
    );
  }
}
