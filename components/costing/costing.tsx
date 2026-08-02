"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface IngredientCost {
  oilId: string;
  costPerGram: number;
  weightUsedG: number;
  totalCost: number;
}

interface BatchCostData {
  ingredientCosts: IngredientCost[];
  fragranceCost: number;
  otherCosts: number;
  totalCost: number;
  batchYieldBars: number;
  costPerBar: number;
  targetPricePerBar: number;
  marginPercent: number;
}

interface CostingProps {
  batchName: string;
  costData: BatchCostData;
}

export function Costing({ batchName, costData }: CostingProps) {
  const [ingredientCosts, setIngredientCosts] = useState(costData.ingredientCosts);
  const [fragranceCost, setFragranceCost] = useState(costData.fragranceCost);
  const [otherCosts, setOtherCosts] = useState(costData.otherCosts);
  const [batchYieldBars, setBatchYieldBars] = useState(costData.batchYieldBars);
  const [targetPricePerBar, setTargetPricePerBar] = useState(costData.targetPricePerBar);

  const totalCost =
    ingredientCosts.reduce((sum, ic) => sum + ic.totalCost, 0) +
    fragranceCost +
    otherCosts;

  const costPerBar = batchYieldBars > 0 ? totalCost / batchYieldBars : 0;
  const marginPercent =
    targetPricePerBar > 0 ? ((targetPricePerBar - costPerBar) / targetPricePerBar) * 100 : 0;

  function updateIngredientCost<K extends keyof IngredientCost>(
    index: number,
    field: K,
    value: IngredientCost[K]
  ) {
    const updated = [...ingredientCosts];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "costPerGram" || field === "weightUsedG") {
      updated[index].totalCost = updated[index].costPerGram * updated[index].weightUsedG;
    }
    setIngredientCosts(updated);
  }

  function addIngredient() {
    setIngredientCosts([
      ...ingredientCosts,
      { oilId: "", costPerGram: 0, weightUsedG: 0, totalCost: 0 },
    ]);
  }

  function removeIngredient(index: number) {
    setIngredientCosts(ingredientCosts.filter((_, i) => i !== index));
  }

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Costing — {batchName}</h2>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Ingredient Costs</h3>
        {ingredientCosts.map((ic, i) => (
          <div key={i} className="flex gap-2 items-center flex-wrap p-3 rounded-lg border bg-card">
            <input
              type="text"
              value={ic.oilId}
              onChange={(e) => updateIngredientCost(i, "oilId", e.target.value)}
              placeholder="Oil ID"
              className="w-32 text-sm border rounded px-2 py-1"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              value={ic.costPerGram}
              onChange={(e) => updateIngredientCost(i, "costPerGram", parseFloat(e.target.value) || 0)}
              placeholder="$/g"
              className="w-20 text-sm border rounded px-2 py-1"
            />
            <input
              type="number"
              step="0.1"
              min="0"
              value={ic.weightUsedG}
              onChange={(e) => updateIngredientCost(i, "weightUsedG", parseFloat(e.target.value) || 0)}
              placeholder="g"
              className="w-20 text-sm border rounded px-2 py-1"
            />
            <span className="text-sm text-muted-foreground w-20">${ic.totalCost.toFixed(2)}</span>
            <button
              onClick={() => removeIngredient(i)}
              className="text-sm text-destructive hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addIngredient}
          className="text-sm text-primary hover:underline"
        >
          + Add ingredient
        </button>
      </div>

      <div className="mt-6 space-y-3 p-4 rounded-lg border bg-card">
        <h3 className="text-sm font-medium text-muted-foreground">Other Costs</h3>
        <div className="flex gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Fragrance</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={fragranceCost}
              onChange={(e) => setFragranceCost(parseFloat(e.target.value) || 0)}
              className="w-24 text-sm border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Other</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={otherCosts}
              onChange={(e) => setOtherCosts(parseFloat(e.target.value) || 0)}
              className="w-24 text-sm border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 p-4 rounded-lg border bg-card">
        <h3 className="text-sm font-medium text-muted-foreground">Batch Yield</h3>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Bars produced</label>
          <input
            type="number"
            min="1"
            value={batchYieldBars}
            onChange={(e) => setBatchYieldBars(parseFloat(e.target.value) || 1)}
            className="w-32 text-sm border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="mt-6 space-y-3 p-4 rounded-lg border bg-card">
        <h3 className="text-sm font-medium text-muted-foreground">Pricing</h3>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Target price per bar</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={targetPricePerBar}
            onChange={(e) => setTargetPricePerBar(parseFloat(e.target.value) || 0)}
            className="w-32 text-sm border rounded px-2 py-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total Cost</p>
            <p className="text-lg font-medium">${totalCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cost per Bar</p>
            <p className="text-lg font-medium">${costPerBar.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Target Price</p>
            <p className="text-lg font-medium">${targetPricePerBar.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Margin</p>
            <p
              className={cn(
                "text-lg font-medium",
                marginPercent >= 50
                  ? "text-green-600"
                  : marginPercent >= 30
                    ? "text-yellow-600"
                    : "text-destructive"
              )}
            >
              {marginPercent.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
