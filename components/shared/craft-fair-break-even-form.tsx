"use client";

import { useState } from "react";
import { AlertTriangle, Calculator, Plus, Trash2 } from "lucide-react";
import { EmailCaptureModal } from "@/components/shared/email-capture-modal";

interface ExpenseRow { name: string; amount: string; }

export function CraftFairBreakEvenForm() {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([
    { name: "Booth", amount: "" }, { name: "Travel", amount: "" }, { name: "Packaging", amount: "" }, { name: "Supplies", amount: "" }, { name: "Marketing", amount: "" },
  ]);
  const [pricePerBar, setPricePerBar] = useState("");
  const [itemsSold, setItemsSold] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ totalExpenses: number; contributionPerItem: number; exactBreakEven: number; roundedSalesTarget: number; revenueTarget: number; revenue: number; netProfit: number } | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const update = (index: number, field: keyof ExpenseRow, value: string) => setExpenses((current) => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const calculate = () => {
    setError("");
    const price = Number(pricePerBar); const sold = Number(itemsSold);
    const totalExpenses = expenses.reduce((sum, item) => sum + Math.max(0, Number(item.amount) || 0), 0);
    if (!Number.isFinite(price) || price <= 0) { setResult(null); setError("Enter a price per bar greater than zero."); return; }
    if (!Number.isFinite(sold) || sold < 0) { setResult(null); setError("Items sold cannot be negative."); return; }
    const contributionPerItem = price;
    const exactBreakEven = totalExpenses / contributionPerItem;
    const roundedSalesTarget = Math.ceil(exactBreakEven);
    const revenueTarget = roundedSalesTarget * price;
    const revenue = sold * price;
    setResult({ totalExpenses, contributionPerItem, exactBreakEven, roundedSalesTarget, revenueTarget, revenue, netProfit: revenue - totalExpenses });
  };
  return <div className="space-y-8">
    <section className="border border-border bg-card p-5 sm:p-7"><div><h2 className="text-section">Event costs</h2><p className="mt-1 text-sm text-muted-foreground">Start with the costs you expect for this event. Leave a zero amount when a category does not apply.</p></div><div className="mt-6 overflow-x-auto"><div className="min-w-[34rem]"><div className="grid grid-cols-[minmax(12rem,1fr)_9rem_7rem] gap-3 border-b border-border pb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground"><span>Expense</span><span>Amount ($)</span><span>Remove</span></div>{expenses.map((expense, index) => <div className="mt-3 grid grid-cols-[minmax(12rem,1fr)_9rem_7rem] items-center gap-3" key={index}><label className="sr-only" htmlFor={`expense-name-${index}`}>Expense {index + 1} name</label><input id={`expense-name-${index}`} type="text" value={expense.name} onChange={(event) => update(index, "name", event.target.value)} className="min-h-11 rounded border border-input bg-background px-3 text-sm" /><label className="sr-only" htmlFor={`expense-amount-${index}`}>Amount for {expense.name || `expense ${index + 1}`}</label><div className="flex min-h-11 items-center rounded border border-input bg-background"><span className="pl-3 text-sm text-muted-foreground">$</span><input id={`expense-amount-${index}`} type="number" min="0" step="0.01" value={expense.amount} onChange={(event) => update(index, "amount", event.target.value)} className="w-full bg-transparent px-2 outline-none" /></div><button type="button" aria-label={`Remove ${expense.name || `expense ${index + 1}`}`} onClick={() => setExpenses((current) => current.length > 1 ? current.filter((_, i) => i !== index) : current)} className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-muted-foreground hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Trash2 className="h-4 w-4" aria-hidden="true" />Remove</button></div>)}</div></div><button type="button" onClick={() => setExpenses((current) => [...current, { name: "", amount: "" }])} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"><Plus className="h-4 w-4" aria-hidden="true" />Add expense</button></section>
    <section className="border border-border bg-card p-5 sm:p-7"><h2 className="text-section">Sales scenario</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Price per bar<span className="mt-2 flex min-h-11 items-center rounded border border-input bg-background"><span className="pl-3 text-muted-foreground">$</span><input type="number" min="0" step="0.01" value={pricePerBar} onChange={(event) => setPricePerBar(event.target.value)} className="w-full bg-transparent px-2 outline-none" /></span></label><label className="text-sm font-medium">Items sold (estimated)<input type="number" min="0" step="1" value={itemsSold} onChange={(event) => setItemsSold(event.target.value)} className="mt-2 min-h-11 w-full rounded border border-input bg-background px-3 outline-none" /></label></div><button type="button" onClick={calculate} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Calculator className="h-4 w-4" aria-hidden="true" />Calculate break-even</button>{error && <p role="alert" className="mt-4 flex gap-2 border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />{error}</p>}</section>
    <section aria-live="polite" className="border border-border bg-card p-5 sm:p-7"><h2 className="text-section">Break-even result</h2><p className="mt-1 text-sm text-muted-foreground">See the exact threshold separately from the whole-item sales target.</p>{result ? <dl className="mt-6 grid gap-4 sm:grid-cols-2"><div><dt className="text-sm text-muted-foreground">Total event cost</dt><dd className="mt-1 font-mono text-xl">${result.totalExpenses.toFixed(2)}</dd></div><div><dt className="text-sm text-muted-foreground">Contribution per item</dt><dd className="mt-1 font-mono text-xl">${result.contributionPerItem.toFixed(2)}</dd></div><div><dt className="text-sm text-muted-foreground">Exact break-even</dt><dd className="mt-1 font-mono text-xl">{result.exactBreakEven.toFixed(2)} bars</dd></div><div><dt className="text-sm text-muted-foreground">Rounded sales target</dt><dd className="mt-1 font-mono text-xl">{result.roundedSalesTarget} bars</dd></div><div><dt className="text-sm text-muted-foreground">Revenue target</dt><dd className="mt-1 font-mono text-xl">${result.revenueTarget.toFixed(2)}</dd></div><div><dt className="text-sm text-muted-foreground">Scenario net profit</dt><dd className={`mt-1 font-mono text-xl ${result.netProfit >= 0 ? "text-success" : "text-danger"}`}>${result.netProfit.toFixed(2)}</dd></div></dl> : <div className="mt-6 border border-dashed border-border p-5 text-sm text-muted-foreground">No calculation yet. Your event cost, contribution, and sales target will appear here.</div>}{result && <button type="button" onClick={() => setShowEmailCapture(true)} className="mt-6 min-h-11 border border-border px-4 text-sm font-semibold hover:bg-muted">Save as worksheet</button>}</section>
    {showEmailCapture && <EmailCaptureModal isOpen={showEmailCapture} onClose={() => setShowEmailCapture(false)} />}
  </div>;
}
