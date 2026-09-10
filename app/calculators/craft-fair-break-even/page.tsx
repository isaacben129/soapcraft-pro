// ── SLICE-001: Legacy redirect ──
// This page has moved to the canonical route /tools/craft-fair-break-even.
import { redirect } from "next/navigation";
export default function LegacyCraftFairBreakEvenPage() {
  redirect("/tools/craft-fair-break-even");
}
