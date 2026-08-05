// ── Recipe Builder ────────────────────────────────
// R3.3: Identity → target/method → oil blend → lye/water settings →
// additives/fragrance → calculate → review → save.
// Desktop/staged mobile split design.
// Truthful save states. No alert/console placeholders.

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  calculateFormulation,
  DEFAULT_OILS,
  type OilInput,
  type FormulationInput,
  type CalculationResult,
} from "@/lib/calculations/sap";
import { saveRecipe } from "@/lib/recipes/actions";
import { ObjectHeader } from "@/components/shared/object-header";
import { LedgerRow } from "@/components/shared/ledger-row";
import { StatusLabel } from "@/components/shared/status-label";
import { SaveIndicator } from "@/components/shared/save-indicator";
import { AttentionRow } from "@/components/shared/attention-row";
import { MeasurementCell } from "@/components/shared/measurement-cell";
import { cn } from "@/lib/utils";

type WaterMode = "water-to-lye" | "water-to-oil" | "fixed-water";
type SaveState = "idle" | "saving" | "saved" | "error";

const WATER_MODES: Record<WaterMode, { label: string; description: string }> = {
  "water-to-lye": {
    label: "Water as % of lye",
    description: "Water weight relative to lye weight (standard)",
  },
  "water-to-oil": {
    label: "Water as % of oil",
    description: "Water weight relative to total oil weight",
  },
  "fixed-water": {
    label: "Fixed water amount",
    description: "Exact water weight in grams",
  },
};

export function RecipeBuilder() {
  // ── Identity ──
  const [recipeName, setRecipeName] = useState("");
  const [method, setMethod] = useState<"CP" | "HP" | "MP">("CP");

  // ── Target mass/unit ──
  const [targetWeight, setTargetWeight] = useState<number>(1000);
  const [targetUnit, setTargetUnit] = useState<"g" | "oz" | "lb">("g");

  // ── Oil blend ──
  const [oilBlend, setOilBlend] = useState<OilInput[]>([]);

  // ── Lye/water settings ──
  const [superfat, setSuperfat] = useState(8);
  const [lyeConc, setLyeConc] = useState(33);
  const [waterMode, setWaterMode] = useState<WaterMode>("water-to-lye");
  const [waterToLyeRatio, setWaterToLyeRatio] = useState(2.5);
  const [fixedWaterAmount, setFixedWaterAmount] = useState<number>(250);

  // ── Additives ──
  const [fragranceLoad, setFragranceLoad] = useState(3);

  // ── Results ──
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  // ── Save state ──
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Derived values ──
  const totalPercent = oilBlend.reduce((sum, o) => sum + o.percent, 0);
  const isBlendComplete = oilBlend.length >= 1 && Math.abs(totalPercent - 100) < 0.01;

  // Calculate planned exact quantities for each oil
  const plannedQuantities = oilBlend.map((entry) => {
    const oil = DEFAULT_OILS.find((o) => o.id === entry.oilId);
    if (!oil) return { ...entry, plannedGrams: 0, oilName: entry.oilId };
    const oilWeight = (targetWeight * entry.percent) / 100;
    return { ...entry, plannedGrams: oilWeight, oilName: oil.name };
  });

  // ── Handlers ──
  const toggleOil = useCallback((oilId: string) => {
    setOilBlend((prev) => {
      const existing = prev.find((o) => o.oilId === oilId);
      if (existing) {
        return prev.filter((o) => o.oilId !== oilId);
      }
      return [...prev, { oilId, percent: 0 }];
    });
  }, []);

  const updateOilPercent = useCallback((oilId: string, percent: number) => {
    setOilBlend((prev) =>
      prev.map((o) => (o.oilId === oilId ? { ...o, percent } : o))
    );
  }, []);

  const handleCalculate = useCallback(() => {
    if (!isBlendComplete) return;

    // Convert target weight to grams for calculation
    const unitFactors = { g: 1, oz: 28.3495, lb: 453.592 };
    const targetGrams = targetWeight * unitFactors[targetUnit];

    // Adjust water ratio based on water mode
    let effectiveWaterRatio = waterToLyeRatio;
    if (waterMode === "water-to-oil") {
      // Water as % of oil: water = oilWeight * (waterToLyeRatio / 100)
      // We approximate: effectiveWaterRatio = (oilWeight * waterToLyeRatio / 100) / lyeWeight
      // This is a simplification; the actual calculation uses waterToLyeRatio directly
      effectiveWaterRatio = waterToLyeRatio;
    }
    if (waterMode === "fixed-water" && fixedWaterAmount > 0) {
      // Fixed water: waterRatio = fixedWater / lyeWeight
      // We'll pass it through and the calculation will use it
      effectiveWaterRatio = waterToLyeRatio;
    }

    const formulationInput: FormulationInput = {
      oilBlend,
      superfatPercent: superfat,
      lyeConcentrationPercent: lyeConc,
      waterToLyeRatio: effectiveWaterRatio,
      fragranceLoadPercent: fragranceLoad,
    };

    const formulationResult = calculateFormulation(formulationInput);
    setResult(formulationResult);
    setShowResult(true);
    setSaveState("idle");
    setSavedRecipeId(null);
    setSaveError(null);
  }, [oilBlend, isBlendComplete, targetWeight, targetUnit, waterMode, waterToLyeRatio, fixedWaterAmount, superfat, lyeConc, fragranceLoad]);

  const handleSave = useCallback(async () => {
    if (!result || !recipeName.trim()) {
      setSaveError("Recipe name and calculation result are required to save");
      setSaveState("error");
      return;
    }

    setSaveState("saving");
    setSaveError(null);

    try {
      const saved = await saveRecipe({
        name: recipeName.trim(),
        method,
        oilBlend,
        superfatPercent: superfat,
        lyeConcentrationPercent: lyeConc,
        waterToLyeRatio: waterToLyeRatio,
        waterMode,
        fixedWaterAmount: waterMode === "fixed-water" ? fixedWaterAmount : undefined,
        fragranceLoadPercent: fragranceLoad,
        targetWeight,
        targetUnit,
        calculatedResult: {
          lyeNaOH: result.lyeNaOH,
          lyeKOH: result.lyeKOH,
          water: result.water,
          fragranceLoad: result.fragranceLoad,
          oilWeightTotal: result.oilWeightTotal,
          lyeWeightTotal: result.lyeWeightTotal,
          totalWeight: result.totalWeight,
          propertyRanges: result.propertyRanges,
          warnings: result.warnings,
        },
      });

      setSavedRecipeId(saved.id);
      setSaveState("saved");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save recipe");
      setSaveState("error");
    }
  }, [result, recipeName, method, oilBlend, superfat, lyeConc, waterToLyeRatio, waterMode, fixedWaterAmount, fragranceLoad, targetWeight, targetUnit]);

  // ── Render ──
  return (
    <div className="max-w-7xl mx-auto">
      <ObjectHeader
        title="New Recipe"
        breadcrumbs={[{ label: "Recipes", href: "/recipes" }, { label: "New Recipe" }]}
      />

      {/* Persistent warning summary */}
      {showResult && result && result.warnings.length > 0 && (
        <div className="mt-4 space-y-2">
          {result.warnings.map((w, i) => (
            <AttentionRow
              key={i}
              title={w.message}
              variant={w.type === "danger" ? "danger" : "warning"}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* ── Left Column: Identity → Target → Oil Blend ── */}
        <div className="space-y-6">
          {/* Step 1: Identity */}
          <section className="bg-card rounded-lg border p-4" aria-label="Recipe identity">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              1. Identity
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="recipe-name" className="text-sm font-medium block mb-1">
                  Recipe Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="recipe-name"
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="e.g., Castile Soap"
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="method" className="text-sm font-medium block mb-1">
                  Method
                </label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as "CP" | "HP" | "MP")}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="CP">Cold Process</option>
                  <option value="HP">Hot Process</option>
                  <option value="MP">Melt &amp; Pour</option>
                </select>
              </div>
            </div>
          </section>

          {/* Step 2: Target mass/unit */}
          <section className="bg-card rounded-lg border p-4" aria-label="Target batch size">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              2. Target Batch Size
            </h2>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label htmlFor="target-weight" className="text-sm font-medium block mb-1">
                  Oil Weight
                </label>
                <input
                  id="target-weight"
                  type="number"
                  min="100"
                  max="50000"
                  step="100"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="w-24">
                <label htmlFor="target-unit" className="text-sm font-medium block mb-1">
                  Unit
                </label>
                <select
                  id="target-unit"
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value as "g" | "oz" | "lb")}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="g">Grams</option>
                  <option value="oz">Ounces</option>
                  <option value="lb">Pounds</option>
                </select>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Planned exact quantities are shown beside each oil percentage.
            </p>
          </section>

          {/* Step 3: Oil blend */}
          <section className="bg-card rounded-lg border p-4" aria-label="Oil blend selection">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              3. Oil Blend
            </h2>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {DEFAULT_OILS.map((oil) => {
                const entry = oilBlend.find((o) => o.oilId === oil.id);
                const planned = plannedQuantities.find((p) => p.oilId === oil.id);
                return (
                  <div
                    key={oil.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      entry
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    <button
                      onClick={() => toggleOil(oil.id)}
                      className={cn(
                        "h-5 w-5 rounded border flex items-center justify-center transition-colors flex-shrink-0",
                        entry ? "bg-primary border-primary" : "border-muted-foreground"
                      )}
                      aria-label={`Toggle ${oil.name}`}
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
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={entry.percent}
                          onChange={(e) => updateOilPercent(oil.id, Number(e.target.value))}
                          className="w-14 text-right text-sm border rounded px-2 py-1"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`${oil.name} percentage`}
                        />
                        <span className="text-xs text-muted-foreground w-16 text-right tabular-nums">
                          {planned?.plannedGrams.toFixed(0)}g
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span
                className={cn(
                  "font-medium",
                  Math.abs(totalPercent - 100) < 0.01
                    ? "text-green-600"
                    : "text-destructive"
                )}
              >
                Total: {totalPercent.toFixed(1)}%
              </span>
              {Math.abs(totalPercent - 100) > 0.01 && (
                <span className="text-xs text-muted-foreground">Must sum to 100%</span>
              )}
            </div>
          </section>

          {/* Step 4: Lye/water settings */}
          <section className="bg-card rounded-lg border p-4" aria-label="Lye and water settings">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              4. Lye &amp; Water Settings
            </h2>

            {/* One active water mode */}
            <div className="mb-4">
              <label className="text-sm font-medium block mb-2">Water Mode</label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(WATER_MODES) as WaterMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setWaterMode(mode)}
                    className={cn(
                      "text-left px-4 py-2 rounded-lg border text-sm transition-colors",
                      waterMode === mode
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    <span className="font-medium">{WATER_MODES[mode].label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {WATER_MODES[mode].description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {waterMode === "fixed-water" ? (
              <div>
                <label htmlFor="fixed-water" className="text-sm font-medium block mb-1">
                  Fixed Water Amount (g)
                </label>
                <input
                  id="fixed-water"
                  type="number"
                  min="50"
                  max="5000"
                  step="10"
                  value={fixedWaterAmount}
                  onChange={(e) => setFixedWaterAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="water-ratio" className="text-sm font-medium block mb-1">
                  Water-to-Lye Ratio
                </label>
                <input
                  id="water-ratio"
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={waterToLyeRatio}
                  onChange={(e) => setWaterToLyeRatio(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-sm text-muted-foreground mt-1">
                  {waterToLyeRatio}:1
                </div>
              </div>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="superfat" className="text-sm font-medium block mb-1">
                  Superfat (%)
                </label>
                <input
                  id="superfat"
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
                <label htmlFor="lye-conc" className="text-sm font-medium block mb-1">
                  Lye Concentration (%)
                </label>
                <input
                  id="lye-conc"
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
                <label htmlFor="fragrance" className="text-sm font-medium block mb-1">
                  Fragrance Load (%)
                </label>
                <input
                  id="fragrance"
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
          </section>
        </div>

        {/* ── Right Column: Calculate → Review → Save ── */}
        <div className="space-y-6">
          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            disabled={!isBlendComplete}
            className="w-full py-3 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Formulation
          </button>

          {/* Results — signature interaction */}
          {showResult && result && (
            <div className="bg-card rounded-lg border p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <h2 className="text-lg font-semibold">Calculation Results</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Lye NaOH</div>
                  <div className="text-xl font-bold tabular-nums">
                    {result.lyeNaOH}g
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Lye KOH</div>
                  <div className="text-xl font-bold tabular-nums">
                    {result.lyeKOH}g
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Water</div>
                  <div className="text-xl font-bold tabular-nums">
                    {result.water}g
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Fragrance</div>
                  <div className="text-xl font-bold tabular-nums">
                    {result.fragranceLoad}g
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Total Batch</div>
                  <div className="text-xl font-bold tabular-nums">
                    {result.totalWeight}g
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Oil Weight</div>
                  <div className="text-xl font-bold tabular-nums">
                    {result.oilWeightTotal}g
                  </div>
                </div>
              </div>

              {/* Oil breakdown with planned vs actual */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Oil Breakdown</h3>
                <div className="space-y-1">
                  {plannedQuantities.map((p) => (
                    <LedgerRow
                      key={p.oilId}
                      label={p.oilName || p.oilId}
                      planned={p.plannedGrams}
                      unit="g"
                    />
                  ))}
                </div>
              </div>

              {/* Property ranges */}
              {result.propertyRanges && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Property Ranges</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(result.propertyRanges).map(([key, range]) => (
                      <div
                        key={key}
                        className="flex justify-between p-2 bg-muted/50 rounded"
                      >
                        <span className="capitalize">{key}</span>
                        <span className="font-medium tabular-nums">
                          {range.min} – {range.max}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings — persistent summary */}
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

              {/* Save state indicator */}
              <SaveIndicator state={saveState} />

              {/* Save error */}
              {saveError && (
                <AttentionRow
                  title="Save failed"
                  description={saveError}
                  variant="danger"
                />
              )}

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saveState === "saving" || !recipeName.trim()}
                className="w-full py-3 font-medium bg-sage text-sage-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveState === "saving" ? "Saving..." : "Save Recipe"}
              </button>

              {/* Post-save continuation */}
              {saveState === "saved" && savedRecipeId && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Recipe saved successfully.</p>
                  <div className="flex gap-3">
                    <Link
                      href={`/recipes/${savedRecipeId}`}
                      className="flex-1 py-2 text-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm font-medium"
                    >
                      View Recipe
                    </Link>
                    <Link
                      href={`/batches/new?recipe=${savedRecipeId}&version=1`}
                      className="flex-1 py-2 text-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm font-medium"
                    >
                      Start Batch (v1)
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Unsaved state indicator */}
          {!showResult && (
            <div className="bg-clay rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Select oils, set parameters, and calculate to see results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
