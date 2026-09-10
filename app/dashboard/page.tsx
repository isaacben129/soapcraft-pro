// ── SLICE-001: Retired route redirect ──
// /dashboard is retired from nav/sitemap. Redirects to canonical /tools.
import { redirect } from "next/navigation";
export default function DashboardRedirect() { redirect("/tools"); }
