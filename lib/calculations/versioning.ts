import { z } from "zod";
export const recipeVersionSchema = z.object({ id: z.string().min(1), recipeId: z.string().min(1), version: z.number().int().positive(), snapshot: z.unknown(), createdAt: z.string().datetime(), previousVersionId: z.string().optional() });
export type RecipeVersion = z.infer<typeof recipeVersionSchema>;
export function immutableSnapshot<T>(value: T): T { return Object.freeze(structuredClone(value)); }
