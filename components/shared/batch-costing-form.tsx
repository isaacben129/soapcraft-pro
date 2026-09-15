"use client";
// ── Batch Costing Form ───────────────────
// Interactive client-side calculator. Used on both
// /calculators/batch-costing and /calculators/soap-cost-calculator.
// No auth required.

import { useState } from "react";
import { Calculator, Plus, Trash2, AlertTriangle } from "lucide-react";
import { RecipeBatchContextManagerComponent } from "@/components/shared/recipe-batch-context";
import { IngredientPicker } from "@/components/shared/ingredient-picker";
import type { RecipeBatchContextManager } from "@/lib/context/RecipeBatchContextV1";
import type { CostingContext } from "@/lib/schemas/context-schema";

interface IngredientRow {
  name: string;
  selectedId: string | null;
  costPerUnit: string;
  unit: string;
  quantity: string;
}

export function BatchCostingForm() {
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { name: "", selectedId: null, costPerUnit: "", unit: "g", quantity: "" },
  ]);
  const [fragranceCost, setFragranceCost] = useState("");
  const [otherCosts, setOtherCosts] = useState("");
  const [batchYieldBars, setBatchYieldBars] = useState("");
  const [pricingMode, setPricingMode] = useState<"gross_margin" | "markup">("gross_margin");
  const [targetPercentage, setTargetPercentage] = useState("40");
  const [result, setResult] = useState<{
    totalCost: number;
    costPerBar: number;
    suggestedPrice: number;
    ingredientCostTotal: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextManager, setContextManager] = useState<RecipeBatchContextManager | null>(null);
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", selectedId: null, costPerUnit: "", unit: "g", quantity: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof IngredientRow, value: string | null) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const calculate = async () => {
    const validIngredients = ingredients.filter((ing) => ing.name && ing.selectedId && ing.costPerUnit && ing.quantity);
    if (validIngredients.length === 0) {
      setError("Choose an ingredient from the catalog, or explicitly choose a custom ingredient, then add cost and quantity");
      return;
    }
    if (!batchYieldBars || Number(batchYieldBars) <= 0) {
      setError("Enter a valid batch yield (number of bars)");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/calculate/batch-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredientCosts: validIngredients.map((ing) => ({
            name: ing.name,
            costPerUnit: Number(ing.costPerUnit),
            unit: ing.unit,
            quantity: Number(ing.quantity),
          })),
          fragranceCost: Number(fragranceCost) || 0,
          otherCosts: Number(otherCosts) || 0,
          batchYieldBars: Number(batchYieldBars),
          [pricingMode === "gross_margin" ? "targetGrossMargin" : "targetMarkupPercent"]: Number(targetPercentage) || 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          totalCost: data.totalCost,
          costPerBar: data.costPerBar,
          suggestedPrice: data.suggestedPrice,
          ingredientCostTotal: data.ingredientCostTotal,
        });
        const costing: CostingContext = {
          sourceTool: "TOOL-COST",
          acceptedAt: new Date().toISOString(),
          sourceRevision: String(data.costBasisRevision ?? 0),
          totalCost: data.totalCost,
          costPerMadeUnit: data.costPerBar,
          costPerSaleableUnit: data.costPerSaleableUnit ?? data.costPerBar,
          ingredientCostTotal: data.ingredientCostTotal,
          fragranceCost: data.fragranceCost ?? (Number(fragranceCost) || 0),
          packagingCost: 0,
          laborCost: 0,
          overheadCost: 0,
          otherCosts: data.otherCosts ?? (Number(otherCosts) || 0),
          currency: data.currency ?? "USD",
          missingCostBasis: data.missingCostBasis ?? [],
          completeness: (data.missingCostBasis?.length ?? 0) > 0 ? "incomplete" : "complete",
          origin: "calculated",
        };
        contextManager?.updateSection("costing", costing);
      } else {
        const err = await response.json();
        setError(err.error || "Calculation failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-canvas rounded-lg border border-rule p-6 space-y-6">
        <RecipeBatchContextManagerComponent
          sourceTool="TOOL-COST"
          units={{ mass: "g", dimensions: "cm" }}
          onManagerReady={setContextManager}
        />
        {/* Ingredient rows */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-foreground">Ingredients</h3>
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-1 text-sm text-action hover:text-action-hover transition-colors"
            >
              <Plus className="h-4 w-4" /> Add ingredient
            </button>
          </div>
          <div className="space-y-4">
            <div className="hidden grid-cols-[minmax(0,1fr)_7rem_5rem_7rem_auto] gap-2 px-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-muted sm:grid" aria-hidden="true">
              <span>Ingredient</span><span>Cost</span><span>Unit</span><span>Quantity</span><span />
            </div>
            {ingredients.map((ing, index) => (
              <div key={index} className="grid grid-cols-[minmax(0,1fr)_minmax(4.5rem,7rem)] gap-2 border border-rule bg-sheet p-3 sm:grid-cols-[minmax(0,1fr)_7rem_5rem_7rem_auto] sm:border-0 sm:bg-transparent sm:p-0">
                <IngredientPicker
                  value={ing.name}
                  selectedId={ing.selectedId}
                  rowLabel={`Ingredient ${index + 1}`}
                  onChange={(value, selectedId) => {
                    const updated = [...ingredients];
                    updated[index] = { ...updated[index], name: value, selectedId };
                    setIngredients(updated);
                  }}
                />
                <input
                  type="number"
                  aria-label={`Ingredient ${index + 1} cost per unit`}
                  placeholder="Cost per unit"
                  value={ing.costPerUnit}
                  onChange={(e) => updateIngredient(index, "costPerUnit", e.target.value)}
                  className="w-full px-3 py-2 bg-sheet border border-rule rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-action"
                />
                <select
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                  className="w-full px-3 py-2 bg-sheet border border-rule rounded-md text-foreground text-sm focus:outline-none focus:border-action"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="oz">oz</option>
                  <option value="lb">lb</option>
                </select>
                <input
                  type="number"
                  aria-label={`Ingredient ${index + 1} quantity`}
                  placeholder="Quantity"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                  className="w-full px-3 py-2 bg-sheet border border-rule rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-action"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    aria-label={`Remove ingredient ${index + 1}`}
                    className="flex min-h-11 min-w-11 items-center justify-center p-2 text-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fragrance & other costs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="fragrance-cost" className="text-sm text-foreground block mb-1">Fragrance cost ($)</label>
            <input
              id="fragrance-cost"
              type="number"
              placeholder="0"
              value={fragranceCost}
              onChange={(e) => setFragranceCost(e.target.value)}
              className="w-full px-3 py-2 bg-sheet border border-rule rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-action"
            />
          </div>
          <div>
            <label htmlFor="other-costs" className="text-sm text-foreground block mb-1">Other costs ($)</label>
            <input
              id="other-costs"
              type="number"
              placeholder="0"
              value={otherCosts}
              onChange={(e) => setOtherCosts(e.target.value)}
              className="w-full px-3 py-2 bg-sheet border border-rule rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-action"
            />
          </div>
          <div>
            <label htmlFor="batch-yield-bars" className="text-sm text-foreground block mb-1">Batch yield (bars)</label>
            <input
              id="batch-yield-bars"
              type="number"
              placeholder="42"
              value={batchYieldBars}
              onChange={(e) => setBatchYieldBars(e.target.value)}
              className="w-full px-3 py-2 bg-sheet border border-rule rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-action"
            />
          </div>
        </div>

        {/* Target percentage with mode selector */}
        <div>
          <div className="flex items-center gap-4 mb-2">
            <label htmlFor="target-price-basis" className="text-sm text-foreground block mb-0">Target price basis</label>
            <select
              id="target-price-basis"
              value={pricingMode}
              onChange={(e) => setPricingMode(e.target.value as "gross_margin" | "markup")}
              className="px-3 py-1.5 bg-sheet border border-rule rounded-md text-foreground text-sm focus:outline-none focus:border-action"
            >
              <option value="gross_margin">Target Gross Margin</option>
              <option value="markup">Target Markup</option>
            </select>
          </div>
          <label htmlFor="target-percentage" className="text-sm text-foreground block mb-1">
            {pricingMode === "gross_margin" ? "Target gross margin (%)" : "Target markup (%)"}
          </label>
          <input
            id="target-percentage"
            type="number"
            placeholder={pricingMode === "gross_margin" ? "40" : "40"}
            value={targetPercentage}
            onChange={(e) => setTargetPercentage(e.target.value)}
            className="w-32 px-3 py-2 bg-sheet border border-rule rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-action"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Calculate button */}
        <button
          type="button"
          onClick={calculate}
          disabled={loading}
          className="w-full px-6 py-3 bg-action text-action-text rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Calculating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculate Cost Per Bar
            </span>
          )}
        </button>

        {!result && !error && (
          <div className="border border-dashed border-rule bg-sheet/70 p-5" aria-live="polite">
            <p className="text-sm font-semibold text-foreground">Your cost breakdown will appear here.</p>
            <p className="mt-1 text-sm text-muted-foreground">Add the ingredient costs and batch yield, then calculate when you are ready.</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-ledger rounded-lg border border-rule p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground">Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-canvas rounded-md p-4">
                <p className="text-sm text-foreground">Total ingredient cost</p>
                <p className="font-mono text-xl font-bold text-ink">${result.ingredientCostTotal.toFixed(2)}</p>
              </div>
              <div className="bg-canvas rounded-md p-4">
                <p className="text-sm text-foreground">Cost per bar</p>
                <p className="font-mono text-xl font-bold text-action">${result.costPerBar.toFixed(2)}</p>
              </div>
              <div className="bg-canvas rounded-md p-4">
                <p className="text-sm text-foreground">Suggested selling price</p>
                <p className="font-mono text-xl font-bold text-success">${result.suggestedPrice.toFixed(2)}</p>
              </div>
              <div className="bg-canvas rounded-md p-4">
                <p className="text-sm text-foreground">Total batch cost</p>
                <p className="font-mono text-xl font-bold text-ink">${result.totalCost.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="px-6 py-2.5 border border-rule rounded-md font-medium text-sm hover:bg-ledger transition-colors"
              >
                Recalculate
              </button>
            </div>
          </div>
        )}
      </div>

    </>
  );
}
