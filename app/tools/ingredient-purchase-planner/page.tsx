import type { Metadata } from "next";
import Link from "next/link";
import { PlanningToolForm } from "@/components/shared/planning-tool-form";
import { ToolSeo } from "@/components/shared/tool-seo";
import { getToolMetadata } from "@/lib/seo/tool-seo";

export const metadata: Metadata = getToolMetadata("ingredient-purchase-planner");

export default function IngredientPurchasePlannerPage() {
  return <main className="min-h-screen"><ToolSeo slug="ingredient-purchase-planner" /><section className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 lg:pt-20"><Link href="/tools" className="text-sm font-semibold text-primary hover:underline">← All tools</Link><div className="mt-8 max-w-3xl"><p className="eyebrow">Buy what the plan needs</p><h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Turn a requirement into a buying decision.</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">Start with one ingredient requirement, subtract usable stock, and see how many packs are needed. This is planning data; it does not silently deplete inventory.</p></div><div className="mt-10"><PlanningToolForm kind="purchase" /></div></section></main>;
}
