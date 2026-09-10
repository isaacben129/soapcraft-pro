// ── SLICE-001: Retired route redirect ──
// /subscription is retired from nav/sitemap. Redirects to canonical /tools.
import { redirect } from "next/navigation";
export default function SubscriptionRedirect() { redirect("/tools"); }
