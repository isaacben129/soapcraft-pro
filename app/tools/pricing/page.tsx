// ── SLICE-001: Retired category page redirect ──
// This page previously held dead content. Now redirects to canonical /tools.
import { redirect } from "next/navigation";
export default function Redirect() { redirect("/tools"); }
