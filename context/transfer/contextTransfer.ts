import type { RecipeContext } from "../RecipeBatchContext";
export function transferContext(context: RecipeContext, stage: keyof RecipeContext, value: Record<string, unknown>): RecipeContext { return { ...context, [stage]: value }; }
export function mergeContext(base: RecipeContext, update: Partial<RecipeContext>): RecipeContext { return { ...base, ...update, version: 1 }; }
