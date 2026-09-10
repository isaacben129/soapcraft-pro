// ── SLICE-001: Retired route redirect ──
// /pricing is retired from nav/sitemap. Redirects to canonical /tools.
import { redirect } from "next/navigation";
export default function PricingRedirect() { redirect("/tools"); }
