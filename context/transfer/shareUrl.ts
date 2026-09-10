import type { RecipeContext } from "../RecipeBatchContext";
const PREFIX = "sc1.";
export function encodeShareUrl(context: RecipeContext, origin = ""): string { const payload = Buffer.from(JSON.stringify(context), "utf8").toString("base64url"); return `${origin}/share?context=${PREFIX}${payload}`; }
export function decodeShareContext(value: string): RecipeContext { const payload = value.startsWith(PREFIX) ? value.slice(PREFIX.length) : value; const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as RecipeContext; if (parsed.version !== 1 || !Array.isArray(parsed.ingredients)) throw new Error("Invalid recipe context"); return parsed; }
