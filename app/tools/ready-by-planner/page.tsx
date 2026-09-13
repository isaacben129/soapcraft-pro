import type { Metadata } from "next";
import Link from "next/link";
import { PlanningToolForm } from "@/components/shared/planning-tool-form";

export const metadata: Metadata = { title: "Ready-by Planner | SoapCraft Pro", description: "Plan batches backward from a ready-by date and cure interval.", alternates: { canonical: "/tools/ready-by-planner" } };

export default function ReadyByPlannerPage() {
  return <main className="min-h-screen"><section className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 lg:pt-20"><Link href="/tools" className="text-sm font-semibold text-primary hover:underline">← All tools</Link><div className="mt-8 max-w-3xl"><p className="eyebrow">Plan the calendar</p><h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Know when the work needs to start.</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">Choose the units, batch yield, date-only cure interval, and buffer. The planner works backward to the latest pour date without calling the result a safety guarantee.</p></div><div className="mt-10"><PlanningToolForm kind="ready" /></div></section></main>;
}
