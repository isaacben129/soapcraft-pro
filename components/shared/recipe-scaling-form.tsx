// ── Recipe Scaling Form ────────────────
// Interactive client-side calculator. No auth required.

"use client";

import { useState } from "react";
import { Calculator, Plus, Trash2, AlertTriangle } from "lucide-react";
import { EmailCaptureModal } from "@/components/shared/email-capture-modal";

interface IngredientRow {
  name: string;
  weight: string;
}

export function RecipeScalingForm() {
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { name: "Olive Oil", weight: "" },
    { name: "Coconut Oil", weight: "" },
  ]);
  const [totalTarget, setTotalTarget] = useState("");
  const [result, setResult] = useState<{
    scaleFactor: number;
    scaledIngredients: { name: string; scaledWeight: string; originalWeight: string }[];
    totalOriginal: number;
    totalScaled: number;
  } | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", weight: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof IngredientRow, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const calculate = () => {
    const originalWeights = ingredients
      .map((i) => parseFloat(i.weight))
      .filter((w) => !isNaN(w) && w > 0);
    const totalOriginal = originalWeights.reduce((a, b) => a + b, 0);

    if (totalOriginal <= 0 || !totalTarget || parseFloat(totalTarget) <= 0) {
      setResult(null);
      return;
    }

    const target = parseFloat(totalTarget);
    const scaleFactor = target / totalOriginal;

    const scaledIngredients = ingredients.map((i) => {
      const origWeight = parseFloat(i.weight);
      const scaledWeight = isNaN(origWeight) ? 0 : origWeight * scaleFactor;
      return {
        name: i.name,
        scaledWeight: scaledWeight.toFixed(1),
        originalWeight: i.weight,
      };
    });

    setResult({
      scaleFactor,
      scaledIngredients,
      totalOriginal,
      totalScaled: totalOriginal * scaleFactor,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 items-start">
            <input
              type="text"
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, "name", e.target.value)}
              className="flex-1 px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
            />
            <input
              type="number"
              placeholder="Weight (g)"
              value={ingredient.weight}
              onChange={(e) => updateIngredient(index, "weight", e.target.value)}
              className="w-28 px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={() => removeIngredient(index)}
              className="px-2 py-2 text-muted-foreground hover:text-danger transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addIngredient}
        className="flex items-center gap-1 text-sm text-action hover:text-action-hover transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add ingredient
      </button>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-ink mb-1">Target Batch Weight (g)</label>
          <input
            type="number"
            placeholder="e.g. 2000"
            value={totalTarget}
            onChange={(e) => setTotalTarget(e.target.value)}
            className="w-full px-3 py-2 border border-rule rounded-md text-sm bg-sheet text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={calculate}
          className="px-6 py-2 bg-action text-action-text rounded-md font-medium hover:bg-action-hover transition-colors text-sm flex items-center gap-2"
        >
          <Calculator className="h-4 w-4" />
          Scale Recipe
        </button>
      </div>

      {result && (
        <div className="border border-rule rounded-lg p-6 bg-sheet space-y-4">
          <h3 className="font-display font-semibold text-foreground">
            Scaled Recipe — {result.scaleFactor.toFixed(2)}x
          </h3>
          <div className="space-y-2">
            {result.scaledIngredients.map((ing, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-ink-muted">{ing.name}</span>
                <span className="font-mono text-foreground">{ing.originalWeight}g → {ing.scaledWeight}g</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Original: {result.totalOriginal.toFixed(1)}g → Scaled: {result.totalScaled.toFixed(1)}g
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEmailCapture(true)}
              className="px-4 py-2 border border-rule rounded-md text-sm font-medium text-ink hover:bg-ledger transition-colors"
            >
              Save as Worksheet
            </button>
          </div>
        </div>
      )}

      {showEmailCapture && <EmailCaptureModal isOpen={showEmailCapture} onClose={() => setShowEmailCapture(false)} />}
    </div>
  );
}
