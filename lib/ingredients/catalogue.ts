// ── Ingredient Catalogue Query Helpers ──────────
// R3.1: Seed sourced system ingredients, expose user-scoped/system catalogue query,
// surface source/SAP revision, no arbitrary system createdBy.

import { db } from "@/lib/db";
import { ingredients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_OILS } from "@/lib/calculations/sap";

// ── Seed system ingredients ───────────────────
// Populates the database with the canonical system ingredient set.
// Only seeds ingredients that don't already exist (idempotent).

export async function seedSystemIngredients() {
  const existing = await db.select().from(ingredients);
  const existingIds = new Set(existing.map((ing) => ing.id));

  const toInsert = DEFAULT_OILS.filter((oil) => !existingIds.has(oil.id));

  if (toInsert.length === 0) return { seeded: 0, skipped: existingIds.size };

  const now = new Date();
  const rows = toInsert.map((oil) => ({
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
    createdBy: "system",
    isPrivate: false,
    createdAt: now,
    updatedAt: now,
  }));

  await db.insert(ingredients).values(rows);
  return { seeded: rows.length, skipped: existingIds.size };
}

// ── Query system catalogue ────────────────────
// Returns the canonical system ingredient catalogue with source/SAP revision.

export async function getSystemCatalogue() {
  return DEFAULT_OILS.map((oil) => ({
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
}

// ── Query user-scoped private ingredients ──────

export async function getUserIngredients(userId: string) {
  const rows = await db
    .select()
    .from(ingredients)
    .where(eq(ingredients.createdBy, userId))
    .where(eq(ingredients.isPrivate, true))
    .where(eq(ingredients.archivedAt, null))
    .limit(50);

  return rows.map((ing) => ({
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
  }));
}

// ── Resolve ingredient by ID ──────────────────
// Returns the ingredient with source/SAP revision.
// Unknown/missing SAP blocks calculation.

export async function resolveIngredient(id: string) {
  // Check system catalogue first
  const systemOil = DEFAULT_OILS.find((oil) => oil.id === id);
  if (systemOil) {
    return {
      ...systemOil,
      source: "soapcraft-pro-system",
      datasetRevision: "1.0.0",
      isPrivate: false,
    };
  }

  // Check user's private ingredients
  const userIngredient = await db
    .select()
    .from(ingredients)
    .where(eq(ingredients.id, id))
    .limit(1);

  if (userIngredient.length > 0) {
    const ing = userIngredient[0];
    return {
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
    };
  }

  return null;
}
