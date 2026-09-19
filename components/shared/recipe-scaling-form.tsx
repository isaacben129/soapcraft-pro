"use client";

import { useState } from "react";
import { AlertTriangle, Calculator, Plus, Trash2 } from "lucide-react";
import { EmailCaptureModal } from "@/components/shared/email-capture-modal";

interface IngredientRow { name: string; weight: string; }
type ScaleMode = "proportional" | "recalculation";

export function RecipeScalingForm() {
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { name: "Olive Oil", weight: "" }, { name: "Coconut Oil", weight: "" },
  ]);
  const [totalTarget, setTotalTarget] = useState("");
  const [mode, setMode] = useState<ScaleMode>("proportional");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ scaleFactor: number; scaledIngredients: { name: string; scaledWeight: string; originalWeight: string }[]; totalOriginal: number; totalScaled: number } | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const updateIngredient = (index: number, field: keyof IngredientRow, value: string) => setIngredients((current) => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const removeIngredient = (index: number) => setIngredients((current) => current.length > 1 ? current.filter((_, i) => i !== index) : current);

  const calculate = () => {
    setError("");
    if (mode === "recalculation") { setResult(null); setError("Formulation recalculation is unavailable until the chemistry evidence boundary is approved. Choose proportional resize for this worksheet."); return; }
    const target = Number(totalTarget);
    const totalOriginal = ingredients.reduce((sum, item) => sum + Math.max(0, Number(item.weight) || 0), 0);
    if (!Number.isFinite(target) || target <= 0) { setResult(null); setError("Enter a target batch weight greater than zero."); return; }
    if (totalOriginal <= 0) { setResult(null); setError("Add at least one ingredient weight greater than zero."); return; }
    const scaleFactor = target / totalOriginal;
    setResult({ scaleFactor, totalOriginal, totalScaled: target, scaledIngredients: ingredients.map((item) => ({ name: item.name || "Unnamed ingredient", originalWeight: item.weight || "0", scaledWeight: ((Number(item.weight) || 0) * scaleFactor).toFixed(1) })) });
  };

  return <div className="space-y-8">
    <section className="border border-border bg-card p-5 sm:p-7" aria-labelledby="scaling-inputs-heading">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 id="scaling-inputs-heading" className="text-section">Recipe inputs</h2><p className="mt-1 text-sm text-muted-foreground">Use proportional resize when you want to copy the recipe’s existing quantities. It does not recalculate chemistry.</p></div><label className="min-w-56 text-sm font-medium text-foreground">Scale mode<select value={mode} onChange={(event) => { setMode(event.target.value as ScaleMode); setResult(null); }} className="mt-2 min-h-11 w-full rounded border border-input bg-background px-3"><option value="proportional">Proportional resize</option><option value="recalculation">Formulation recalculation (gated)</option></select></label></div>
      <div className="mt-7 overflow-x-auto"><div className="min-w-[34rem]"><div className="grid grid-cols-[minmax(12rem,1fr)_8rem_7rem] gap-3 border-b border-border pb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground"><span>Ingredient</span><span>Weight</span><span>Remove</span></div>{ingredients.map((ingredient, index) => <div className="mt-3 grid grid-cols-[minmax(12rem,1fr)_8rem_7rem] items-center gap-3" key={index}><label className="sr-only" htmlFor={`ingredient-name-${index}`}>Ingredient {index + 1} name</label><input id={`ingredient-name-${index}`} type="text" value={ingredient.name} onChange={(event) => updateIngredient(index, "name", event.target.value)} className="min-h-11 rounded border border-input bg-background px-3 text-sm" /><label className="sr-only" htmlFor={`ingredient-weight-${index}`}>Ingredient {index + 1} weight in grams</label><div className="flex min-h-11 items-center rounded border border-input bg-background"><input id={`ingredient-weight-${index}`} type="number" min="0" step="any" value={ingredient.weight} onChange={(event) => updateIngredient(index, "weight", event.target.value)} className="w-full bg-transparent px-3 outline-none" /><span className="pr-3 text-xs text-muted-foreground">g</span></div><button type="button" aria-label={`Remove ${ingredient.name || `ingredient ${index + 1}`}`} onClick={() => removeIngredient(index)} className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-muted-foreground hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Trash2 className="h-4 w-4" aria-hidden="true" />Remove</button></div>)}</div></div>
      <button type="button" onClick={() => setIngredients((current) => [...current, { name: "", weight: "" }])} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"><Plus className="h-4 w-4" aria-hidden="true" />Add ingredient</button>
      <div className="mt-7 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><label className="text-sm font-medium text-foreground">Target batch weight<span className="mt-2 flex min-h-11 items-center rounded border border-input bg-background"><input type="number" min="0" step="any" value={totalTarget} onChange={(event) => setTotalTarget(event.target.value)} className="w-full bg-transparent px-3 outline-none" /><span className="pr-3 text-sm text-muted-foreground">g</span></span></label><button type="button" onClick={calculate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Calculator className="h-4 w-4" aria-hidden="true" />Scale recipe</button></div>
      {error && <p role="alert" className="mt-4 flex gap-2 border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />{error}</p>}
    </section>
    <section aria-live="polite" className="border border-border bg-card p-5 sm:p-7"><h2 className="text-section">Scaled output</h2><p className="mt-1 text-sm text-muted-foreground">The result will show the factor, original total, target total, and each scaled ingredient.</p>{result ? <><dl className="mt-6 grid gap-4 sm:grid-cols-3"><div><dt className="text-sm text-muted-foreground">Scale factor</dt><dd className="mt-1 font-mono text-xl">{result.scaleFactor.toFixed(3)}×</dd></div><div><dt className="text-sm text-muted-foreground">Original total</dt><dd className="mt-1 font-mono text-xl">{result.totalOriginal.toFixed(1)} g</dd></div><div><dt className="text-sm text-muted-foreground">Target total</dt><dd className="mt-1 font-mono text-xl">{result.totalScaled.toFixed(1)} g</dd></div></dl><div className="mt-6 divide-y divide-border border-y border-border">{result.scaledIngredients.map((item, index) => <div className="flex justify-between gap-4 py-3 text-sm" key={index}><span>{item.name}</span><span className="font-mono">{item.originalWeight} g → {item.scaledWeight} g</span></div>)}</div><button type="button" onClick={() => setShowEmailCapture(true)} className="mt-6 min-h-11 border border-border px-4 text-sm font-semibold hover:bg-muted">Save as worksheet</button></> : <div className="mt-6 border border-dashed border-border p-5 text-sm text-muted-foreground">No calculation yet. Your scaled ingredient table will appear here.</div>}</section>
    {showEmailCapture && <EmailCaptureModal isOpen={showEmailCapture} onClose={() => setShowEmailCapture(false)} />}
  </div>;
}
