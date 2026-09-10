// ── SLICE-001: Legacy redirect ──
// This page has moved to the canonical route /tools/recipe-scaling.
import { redirect } from "next/navigation";
export default function LegacyRecipeScalingPage() {
  redirect("/tools/recipe-scaling");
}
