// ── SLICE-001: Legacy redirect ──
// This page has moved to the canonical route /tools/batch-cost.
import { redirect } from "next/navigation";
export default function LegacySoapCostCalculatorPage() {
  redirect("/tools/batch-cost");
}
