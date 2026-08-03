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

        {/* Mold Volume Calculator */}
        <div className="border-t border-border pt-6 mt-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Mold Volume Calculator
          </h3>
          <MoldVolumeCalculator />
        </div>
      </div>
    </div>
  );
}

function MoldVolumeCalculator() {
  const [moldLength, setMoldLength] = useState("");
  const [moldWidth, setMoldWidth] = useState("");
  const [moldDepth, setMoldDepth] = useState("");
  const [moldUnit, setMoldUnit] = useState<"cm" | "in">("cm");
  const [result, setResult] = useState<{
    volume: number;
    oilWeight: number;
    waterWeight: number;
    lyeWeight: number;
  } | null>(null);

  function calculate() {
    const length = Number(moldLength);
    const width = Number(moldWidth);
    const depth = Number(moldDepth);
    if (!length || !width || !depth) return;

    // Volume in cubic units
    const volume = length * width * depth;

    // Convert to liters (1 cubic cm = 0.001 liters, 1 cubic inch = 0.016387 liters)
    const volumeLiters =
      moldUnit === "cm" ? volume * 0.001 : volume * 0.016387;

    // Oil weight = volume in liters * 0.9 (soap density approx)
    const oilWeight = volumeLiters * 0.9;

    // Water = 2.5 * lye weight (standard ratio)
    // Lye = oil weight * 0.13 (approximate SAP for mixed oils)
    const lyeWeight = oilWeight * 0.13;
    const waterWeight = lyeWeight * 2.5;

    setResult({
      volume: Math.round(volume * 100) / 100,
      oilWeight: Math.round(oilWeight * 100) / 100,
      waterWeight: Math.round(waterWeight * 100) / 100,
      lyeWeight: Math.round(lyeWeight * 100) / 100,
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Length ({moldUnit})</label>
          <input
            type="number"
            value={moldLength}
            onChange={(e) => setMoldLength(e.target.value)}
            placeholder="e.g., 20"
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Width ({moldUnit})</label>
          <input
            type="number"
            value={moldWidth}
            onChange={(e) => setMoldWidth(e.target.value)}
            placeholder="e.g., 10"
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Depth ({moldUnit})</label>
          <input
            type="number"
            value={moldDepth}
            onChange={(e) => setMoldDepth(e.target.value)}
            placeholder="e.g., 8"
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">Unit</label>
        <div className="flex gap-3">
          {(["cm", "in"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setMoldUnit(u)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                moldUnit === u
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:bg-accent"
              }`}
            >
              {u === "cm" ? "Centimeters" : "Inches"}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={calculate}
        className="w-full py-2 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        Calculate
      </button>
      {result && (
        <div className="bg-card rounded-lg border p-4 space-y-2">
          <h4 className="font-semibold text-foreground">Results</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Mold Volume:</span>{" "}
              <span className="font-medium text-foreground">
                {result.volume} {moldUnit === "cm" ? "cm³" : "in³"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Oil Weight:</span>{" "}
              <span className="font-medium text-foreground">
                {result.oilWeight}g
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Water:</span>{" "}
              <span className="font-medium text-foreground">
                {result.waterWeight}g
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Lye (NaOH):</span>{" "}
              <span className="font-medium text-foreground">
                {result.lyeWeight}g
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            These are estimates. Always verify with your recipe calculator before
            making a batch.
          </p>
        </div>
      )}
    </div>
  );
}
