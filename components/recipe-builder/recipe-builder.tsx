"use client";

import { useState } from "react";
import { calculateFormulation, DEFAULT_OILS, type OilInput, type FormulationInput } from "@/lib/calculations/sap";
import { cn } from "@/lib/utils";

export function RecipeBuilder() {
  const [oilBlend, setOilBlend] = useState<OilInput[]>([]);
  const [superfat, setSuperfat] = useState(8);
  const [lyeConc, setLyeConc] = useState(33);
  const [waterRatio, setWaterRatio] = useState(2.5);
  const [fragranceLoad, setFragranceLoad] = useState(3);
  const [result, setResult] = useState<ReturnType<typeof calculateFormulation> | null>(null);
  const [showResult, setShowResult] = useState(false);

  function toggleOil(oilId: string) {
    setOilBlend((prev) => {
      const existing = prev.find((o) => o.oilId === oilId);
      if (existing) {
        return prev.filter((o) => o.oilId !== oilId);
      }
      return [...prev, { oilId, percent: 0 }];
    });
  }

  function updateOilPercent(oilId: string, percent: number) {
    setOilBlend((prev) =>
      prev.map((o) => (o.oilId === oilId ? { ...o, percent } : o))
    );
  }

  function handleCalculate() {
    try {
      const formulationResult = calculateFormulation({
        oilBlend,
        superfatPercent: superfat,
        lyeConcentrationPercent: lyeConc,
        waterToLyeRatio: waterRatio,
        fragranceLoadPercent: fragranceLoad,
      });
      setResult(formulationResult);
      setShowResult(true);
    } catch (e) {
      setResult(null);
      setShowResult(false);
    }
  }

  const totalPercent = oilBlend.reduce((sum, o) => sum + o.percent, 0);
  const isComplete = oilBlend.length >= 1 && Math.abs(totalPercent - 100) < 0.01;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Build a Recipe</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Oil selection */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Oil Blend</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {DEFAULT_OILS.map((oil) => {
              const entry = oilBlend.find((o) => o.oilId === oil.id);
              return (
                <div
                  key={oil.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                    entry ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                  )}
                >
                  <button
                    onClick={() => toggleOil(oil.id)}
                    className={cn(
                      "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                      entry ? "bg-primary border-primary" : "border-muted-foreground"
                    )}
                  >
                    {entry && <span className="text-xs text-primary-foreground">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{oil.name}</div>
                    <div className="text-xs text-muted-foreground">
                      SAP NaOH: {oil.sapValueNaOH} | KOH: {oil.sapValueKOH}
                    </div>
                  </div>
                  {entry && (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={entry.percent}
                      onChange={(e) => updateOilPercent(oil.id, Number(e.target.value))}
                      className="w-16 text-right text-sm border rounded px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className={cn("font-medium", Math.abs(totalPercent - 100) < 0.01 ? "text-green-600" : "text-destructive")}>
              Total: {totalPercent.toFixed(1)}%
            </span>
            {Math.abs(totalPercent - 100) > 0.01 && (
              <span className="text-xs text-muted-foreground">Must sum to 100%</span>
            )}
          </div>
        </div>

        {/* Right: Parameters + Results */}
        <div className="space-y-6">
          {/* Parameters */}
          <div className="bg-card rounded-lg border p-4 space-y-4">
            <h2 className="text-lg font-semibold">Parameters</h2>

            <div>
              <label className="text-sm font-medium block mb-1">Superfat (%)</label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={superfat}
                onChange={(e) => setSuperfat(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm text-muted-foreground">{superfat}%</div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Lye Concentration (%)</label>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={lyeConc}
                onChange={(e) => setLyeConc(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm text-muted-foreground">{lyeConc}%</div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Water-to-Lye Ratio</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={waterRatio}
                onChange={(e) => setWaterRatio(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm text-muted-foreground">{waterRatio}:1</div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Fragrance Load (%)</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={fragranceLoad}
                onChange={(e) => setFragranceLoad(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm text-muted-foreground">{fragranceLoad}%</div>
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            disabled={!isComplete}
            className="w-full py-3 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate
          </button>

          {/* Results — signature interaction */}
          {showResult && result && (
            <div className="bg-card rounded-lg border p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <h2 className="text-lg font-semibold">Calculation Results</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Lye NaOH</div>
                  <div className="text-xl font-bold">{result.lyeNaOH}g</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Water</div>
                  <div className="text-xl font-bold">{result.water}g</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Fragrance</div>
                  <div className="text-xl font-bold">{result.fragranceLoad}g</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Total Batch</div>
                  <div className="text-xl font-bold">{result.totalWeight}g</div>
                </div>
              </div>

              {/* Property ranges */}
              {result.propertyRanges && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Property Ranges</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(result.propertyRanges).map(([key, range]) => (
                      <div key={key} className="flex justify-between p-2 bg-muted/50 rounded">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium">
                          {range.min} – {range.max}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Warnings</h3>
                  {result.warnings.map((w, i) => (
                    <div
                      key={i}
                      className={cn(
                        "p-2 rounded text-sm",
                        w.type === "danger"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      )}
                    >
                      {w.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
