"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type ToolKind = "wholesale" | "ready" | "purchase";

const config = {
  wholesale: {
    title: "Wholesale pricing",
    endpoint: "/api/calculate/wholesale-pricing",
    intro: "Turn your real unit cost into a quote you can explain. Start with a cost basis, then compare wholesale and retail outcomes.",
  },
  ready: {
    title: "Ready-by planner",
    endpoint: "/api/calculate/production",
    intro: "Work backward from the date your stock needs to be ready. This planner gives you the required batch count and latest pour date.",
  },
  purchase: {
    title: "Ingredient purchase planner",
    endpoint: "/api/calculate/purchasing",
    intro: "Subtract usable stock from a requirement, then calculate the packs you actually need to buy.",
  },
} as const;

export function PlanningToolForm({ kind }: { kind: ToolKind }) {
  const [values, setValues] = useState<Record<string, string>>(
    kind === "wholesale"
      ? { cost: "2.40", batch: "40", margin: "35", retail: "2" }
      : kind === "ready"
        ? { units: "48", yield: "12", ready: "2026-11-15", cure: "42", buffer: "2", lead: "0" }
        : { required: "2400", onHand: "800", pack: "1000" },
  );
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const meta = config[kind];
  const update = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const number = (key: string) => Number(values[key]);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setResult(null);
    const body = kind === "wholesale"
      ? { productionCostPerBar: number("cost"), batchSize: number("batch"), desiredMargin: number("margin"), retailMultiplier: number("retail") }
      : kind === "ready"
        ? { saleableUnitsRequired: number("units"), expectedYieldPerBatch: number("yield"), readyByDate: values.ready, cureDays: number("cure"), unmoldCutBufferDays: number("buffer"), productionLeadTimeDays: number("lead") }
        : { required: number("required"), onHand: number("onHand"), packSize: number("pack"), unit: "g" };
    try {
      const response = await fetch(meta.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Check the inputs and try again.");
      setResult(data);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not calculate this plan."); }
  }

  const field = (key: string, label: string, suffix?: string, type = "number") => (
    <label className="block text-sm font-medium text-foreground">{label}<span className="mt-2 flex items-center rounded-lg border border-input bg-background shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15"><input required type={type} min={type === "number" ? "0" : undefined} step={type === "number" ? "any" : undefined} value={values[key]} onChange={(event) => update(key, event.target.value)} className="min-h-12 w-full bg-transparent px-4 outline-none" />{suffix && <span className="pr-4 text-sm text-muted-foreground">{suffix}</span>}</span></label>
  );

  return <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
    <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-5 shadow-[0_18px_60px_-36px_hsl(var(--primary)/.45)] sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        {kind === "wholesale" && <>{field("cost", "Production cost per bar", "$", "number")}{field("batch", "Saleable bars in batch")}{field("margin", "Target markup", "%")}{field("retail", "Retail multiplier", "×")}</>}
        {kind === "ready" && <>{field("units", "Saleable units required")}{field("yield", "Saleable units per batch")}{field("ready", "Ready-by date", undefined, "date")}{field("cure", "User-selected interval", "days")}{field("buffer", "Unmold / cut buffer", "days")}{field("lead", "Other lead time", "days")}</>}
        {kind === "purchase" && <>{field("required", "Requirement", "g")}{field("onHand", "On hand", "g")}{field("pack", "Pack size", "g")}</>}
      </div>
      <button className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto" type="submit">Calculate {kind === "purchase" ? "purchase need" : "plan"}</button>
      {error && <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
    </form>
    <aside className="rounded-3xl bg-foreground p-6 text-background sm:p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-background/55">What this gives you</p><p className="mt-4 text-lg leading-8 text-background/80">{meta.intro}</p>{result ? <Result kind={kind} data={result} /> : <p className="mt-8 border-t border-background/15 pt-5 text-sm leading-6 text-background/55">Your result will appear here. Nothing is sent to an account.</p>}</aside>
  </div>;
}

function Result({ kind, data }: { kind: ToolKind; data: Record<string, unknown> }) {
  const purchase = data.purchases as Array<Record<string, unknown>> | undefined;
  let rows: string[][];
  if (kind === "wholesale") {
    rows = [["Wholesale / bar", `$${Number(data.wholesalePricePerBar).toFixed(2)}`], ["Wholesale / batch", `$${Number(data.wholesalePricePerBatch).toFixed(2)}`], ["Retail / bar", `$${Number(data.retailPricePerBar).toFixed(2)}`], ["Retail profit", `$${Number(data.retailProfit).toFixed(2)}`]];
  } else if (kind === "ready") {
    rows = [["Batches required", String(data.batchesRequired)], ["Latest pour date", new Date(String(data.pourDate)).toISOString().slice(0, 10)]];
  } else {
    const first = purchase?.[0];
    rows = [["Shortage", `${Number(first?.shortage ?? 0)} g`], ["Packs required", String(first?.packsRequired ?? 0)], ["Quantity to buy", `${String(first?.quantityToBuy ?? 0)} g`]];
  }
  return <div className="mt-7 border-t border-background/15 pt-6"><div className="space-y-4">{rows.map(([label, value]) => <div key={label} className="flex items-end justify-between gap-4"><span className="text-sm text-background/60">{label}</span><strong className="font-mono text-xl tabular-nums">{value}</strong></div>)}</div><Link href="/tools" className="mt-7 inline-flex text-sm font-semibold text-background underline decoration-background/30 underline-offset-4 hover:decoration-background">Continue to another tool →</Link></div>;
}
