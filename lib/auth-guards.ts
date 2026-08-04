// ── Auth ownership guards ──────────────────────────────────────
// Reusable server helpers for session-based ownership checks.
// All guards are server-side only — never trust client-provided IDs.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, recipes, recipeVersions, batches, cureObservations, batchCosts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ── Types ────────────────────────────────────────────────────────

export interface AuthContext {
  userId: string;
  email: string;
  name: string | null;
}

export type OwnershipResult =
  | { authorized: true; user: AuthContext }
  | { authorized: false; reason: "unauthenticated" | "forbidden" };

// ── Guard 1: require session user ────────────────────────────────

export async function requireSessionUser(): Promise<OwnershipResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { authorized: false, reason: "unauthenticated" };
  }

  return {
    authorized: true,
    user: {
      userId: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? null,
    },
  };
}

// ── Guard 2: load owned recipe ───────────────────────────────────

export async function loadOwnedRecipe(
  recipeId: string,
  userId: string
): Promise<{ authorized: true; recipe: typeof recipes.$inferSelect } | { authorized: false; reason: "not_found" | "forbidden" }> {
  const [recipe] = await db
    .select()
    .from(recipes)
    .where(and(eq(recipes.id, recipeId), eq(recipes.createdBy, userId)))
    .limit(1);

  if (!recipe) {
    return { authorized: false, reason: "not_found" };
  }

  return { authorized: true, recipe };
}

// ── Guard 3: load owned recipe version ───────────────────────────

export async function loadOwnedRecipeVersion(
  versionId: string,
  userId: string
): Promise<{ authorized: true; version: typeof recipeVersions.$inferSelect; recipe: typeof recipes.$inferSelect } | { authorized: false; reason: "not_found" | "forbidden" }> {
  const [version] = await db
    .select()
    .from(recipeVersions)
    .where(eq(recipeVersions.id, versionId))
    .limit(1);

  if (!version) {
    return { authorized: false, reason: "not_found" };
  }

  // Verify the recipe belongs to the user
  const [recipe] = await db
    .select()
    .from(recipes)
    .where(and(eq(recipes.id, version.recipeId), eq(recipes.createdBy, userId)))
    .limit(1);

  if (!recipe) {
    return { authorized: false, reason: "forbidden" };
  }

  return { authorized: true, version, recipe };
}

// ── Guard 4: load owned batch through userId ────────────────────

export async function loadOwnedBatch(
  batchId: string,
  userId: string
): Promise<{ authorized: true; batch: typeof batches.$inferSelect } | { authorized: false; reason: "not_found" | "forbidden" }> {
  const [batch] = await db
    .select()
    .from(batches)
    .where(and(eq(batches.id, batchId), eq(batches.userId, userId)))
    .limit(1);

  if (!batch) {
    return { authorized: false, reason: "not_found" };
  }

  return { authorized: true, batch };
}

// ── Guard 5: verify child ownership through parent ──────────────

export async function verifyChildOwnership(
  parentType: "recipe" | "batch",
  parentId: string,
  childId: string,
  userId: string
): Promise<{ authorized: true } | { authorized: false; reason: "forbidden" }> {
  if (parentType === "recipe") {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.id, parentId), eq(recipes.createdBy, userId)))
      .limit(1);

    if (!recipe) {
      return { authorized: false, reason: "forbidden" };
    }
  } else if (parentType === "batch") {
    const [batch] = await db
      .select()
      .from(batches)
      .where(and(eq(batches.id, parentId), eq(batches.userId, userId)))
      .limit(1);

    if (!batch) {
      return { authorized: false, reason: "forbidden" };
    }
  }

  return { authorized: true };
}

// ── Guard 6: curated read policy ─────────────────────────────────
// List queries only return current user plus explicitly curated public data.
// Client-provided owner IDs are ignored.

export async function curatedReadPolicy(
  userId: string,
  entityType: "recipe" | "batch" | "cost"
) {
  if (entityType === "recipe") {
    const userRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.createdBy, userId));

    const publicRecipes = await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.isCurated, 1), eq(recipes.createdBy, userId)));

    return {
      userItems: userRecipes,
      publicItems: publicRecipes,
      // Client-provided owner filters are ignored — only the authenticated user's data is returned
    };
  }

  if (entityType === "batch") {
    const userBatches = await db
      .select()
      .from(batches)
      .where(eq(batches.userId, userId));

    return {
      userItems: userBatches,
      // Client-provided owner filters are ignored
    };
  }

  if (entityType === "cost") {
    const userCosts = await db
      .select()
      .from(batchCosts)
      .where(eq(batchCosts.userId, userId));

    return {
      userItems: userCosts,
      // Client-provided owner filters are ignored
    };
  }

  return { userItems: [], publicItems: [] };
}

// ── Helper: invalidate cache after mutation ──────────────────────

export function invalidateCache(path: string) {
  revalidatePath(path);
}
