// ── SLICE-001: Legacy redirect ──
// This page has moved to the canonical route /tools/mold-volume.
import { redirect } from "next/navigation";
export default function LegacyMoldVolumePage() {
  redirect("/tools/mold-volume");
}
