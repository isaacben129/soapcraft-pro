// ── SLICE-001: Retired route redirect ──
// /marketing/pricing is retired from nav/sitemap. Redirects to canonical /tools.
import { redirect } from "next/navigation";
export default function MarketingPricingRedirect() { redirect("/tools"); }
