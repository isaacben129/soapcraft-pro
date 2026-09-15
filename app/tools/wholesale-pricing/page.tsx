import type { Metadata } from "next";
import Link from "next/link";
import { PlanningToolForm } from "@/components/shared/planning-tool-form";
import { ToolSeo } from "@/components/shared/tool-seo";
import { getToolMetadata } from "@/lib/seo/tool-seo";

export const metadata: Metadata = getToolMetadata("wholesale-pricing");

export default function WholesalePricingPage() {
  return <main className="min-h-screen"><ToolSeo slug="wholesale-pricing" /><section className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 lg:pt-20"><Link href="/tools" className="text-sm font-semibold text-primary hover:underline">← All tools</Link><div className="mt-8 max-w-3xl"><p className="eyebrow">Sell with a clear basis</p><h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Wholesale pricing without the spreadsheet fog.</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">Start with the cost per bar you actually know. Compare a wholesale scenario with a simple retail scenario, then carry the decision into your next tool.</p></div><div className="mt-10"><PlanningToolForm kind="wholesale" /></div></section></main>;
}
