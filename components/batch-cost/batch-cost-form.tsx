// ── Batch Cost Form ────────────────────────────
// R6.3: Inherited line items from recipe version,
// cost-basis selectors, yield, target margin, persisted result.

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  calculateBatchCost,
  type BatchCostInput,
  type BatchCostResult,
} from "@/lib/calculations/batch-cost";
import { MeasurementCell } from "@/components/shared/measurement-cell";
import { SaveIndicator } from "@/components/shared/save-indicator";
import { AttentionRow } from "@/components/shared/attention-row";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusLabel } from "@/components/shared/status-label";
import { ObjectHeader } from "@/components/shared/object-header";

interface RecipeVersion {
  id: string;
  version: number;
  name: string;
  oilBlend: Array<{ oilId: string; percent: number }>;
  calculatedLyeNaOH: number;
  calculatedLyeKOH: number;
  calculatedWater: number;
  calculatedFragranceLoad: number;
  totalWeight: number;
}

interface CostRecord {
  id: string;
  ingredientId: string;
  costPerUnit: number;
  unit: string;
  source: string;
  effectiveDate: string;
}

interface BatchCostFormProps {
  recipeId: string;
  recipeName: string;
  versionId: string;
  versionNumber: number;
  oilBlend: Array<{ oilId: string; percent: number }>;
  totalWeight: number;
  yieldBars: number;
}

type SelectedCosts = Record<string, string>;

export function BatchCostForm({
  recipeId,
  recipeName,
  versionId,
  versionNumber,
  oilBlend,
  totalWeight,
  yieldBars,
}: BatchCostFormProps) {
  const router = useRouter();
  const [costRecords, setCostRecords] = useState<CostRecord[]>([]);
  const [selectedCosts, setSelectedCosts] = useState<SelectedCosts>({});
  const [fragranceCost, setFragranceCost] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);
  const [targetPricePerBar, setTargetPricePerBar] = useState(0);
  const [batchYieldBars, setBatchYieldBars] = useState(yieldBars);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [result, setResult] = useState<BatchCostResult | null>(null);

  // Fetch cost records on mount
  useEffect(() => {
    fetch("/api/ingredient-costs")
      .then((res) => res.json())
      .then((data) => setCostRecords(data.records || []))
      .catch(() => {});
  }, []);

  // Inherited line items from recipe version
  const inheritedLineItems = oilBlend.map((oil) => {
    const costRecordId = selectedCosts[oil.oilId];
    const costRecord = costRecords.find((c) => c.id === costRecordId);
    const costPerGram = costRecord
      ? costRecord.costPerUnit / 1000 // Convert from per-kg to per-gram if needed
      : 0;

    return {
      oilId: oil.oilId,
      percent: oil.percent,
      weightG: (totalWeight * oil.percent) / 100,
      costRecordId: costRecordId || "",
      costPerGram,
      totalCost: costPerGram > 0 ? costPerGram * ((totalWeight * oil.percent) / 100) : 0,
      hasCostBasis: !!costRecordId,
    };
  });

  const ingredientCostTotal = inheritedLineItems.reduce((sum, item) => sum + item.totalCost, 0);
  const totalCost = ingredientCostTotal + fragranceCost + otherCosts;
  const costPerBar = batchYieldBars > 0 ? totalCost / batchYieldBars : 0;
  const marginPercent =
    targetPricePerBar > 0 ? ((targetPricePerBar - costPerBar) / targetPricePerBar) * 100 : 0;

  const missingCostBasis = inheritedLineItems.filter((item) => !item.hasCostBasis);

  const handleSelectCost = (oilId: string, recordId: string) => {
    setSelectedCosts((prev) => ({ ...prev, [oilId]: recordId }));
  };

  const handleCalculate = () => {
    const input: BatchCostInput = {
      ingredientCosts: inheritedLineItems
        .filter((item) => item.hasCostBasis)
        .map((item) => ({
          ingredientId: item.oilId,
          costPerUnit: item.costPerGram,
          unit: "g",
          quantity: item.weightG,
          quantityUnit: "g",
        })),
      fragranceCost,
      otherCosts,
      batchYieldBars,
      targetPricePerBar,
      costBasisRevision: 1,
    };

    const calcResult = calculateBatchCost(input);
    setResult(calcResult);
  };

  const handleSave = async () => {
    setSaveState("saving");
    setSaveError(null);

    try {
      const res = await fetch("/api/batch-costs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId,
          versionId,
          batchYieldBars,
          targetPricePerBar,
          fragranceCost,
          otherCosts,
          ingredientCosts: inheritedLineItems.map((item) => ({
            ingredientId: item.oilId,
            costRecordId: item.costRecordId,
            costPerGram: item.costPerGram,
            weightG: item.weightG,
            totalCost: item.totalCost,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save batch cost");
      }

      setSaveState("saved");
      setTimeout(() => router.push(`/batches`), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
      setSaveState("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ObjectHeader
        title={`Cost Batch — ${recipeName}`}
        breadcrumbs={[
          { label: "Batches", href: "/batches" },
          { label: recipeName, href: `/recipes/${recipeId}` },
          { label: `v${versionNumber} Cost` },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Inherited line items + cost basis selectors */}
        <div className="space-y-6">
          <section className="bg-card rounded-lg border p-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              Inherited Line Items
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Quantities inherited from recipe v{versionNumber}. Select a cost record for each oil.
            </p>

            <div className="space-y-3">
              {inheritedLineItems.map((item) => (
                <div
                  key={item.oilId}
                  className="p-3 rounded-lg border bg-background"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {item.oilId}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {item.weightG.toFixed(0)}g ({item.percent}%)
                    </span>
                  </div>

                  <MeasurementCell
                    planned={item.weightG}
                    unit="g"
                  />

                  {/* Cost basis selector */}
                  <div className="mt-2">
                    <label className="text-xs text-muted-foreground block mb-1">
                      Cost Basis
                    </label>
                    <select
                      value={item.costRecordId}
                      onChange={(e) => handleSelectCost(item.oilId, e.target.value)}
                      className="w-full px-2 py-1.5 rounded border bg-card text-foreground text-sm"
                    >
                      <option value="">— Select cost record —</option>
                      {costRecords
                        .filter((c) => c.ingredientId === item.oilId)
                        .map((record) => (
                          <option key={record.id} value={record.id}>
                            ${record.costPerUnit.toFixed(2)}/{record.unit} — {record.source}{" "}
                            (eff. {new Date(record.effectiveDate).toLocaleDateString()})
                          </option>
                        ))}
                    </select>
                    {!item.hasCostBasis && (
                      <p className="text-xs text-warning mt-1">
                        No cost basis selected — excluded from total
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {missingCostBasis.length > 0 && (
              <AttentionRow
                title={`${missingCostBasis.length} oil(s) missing cost basis`}
                description="These items are excluded from the total cost. Select a cost record or add one."
                variant="warning"
              />
            )}
          </section>

          {/* Other costs */}
          <section className="bg-card rounded-lg border p-4 space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground">
              Other Costs
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Fragrance</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={fragranceCost}
                  onChange={(e) => setFragranceCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Other</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={otherCosts}
                  onChange={(e) => setOtherCosts(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right: Yield, pricing, result */}
        <div className="space-y-6">
          {/* Yield & pricing */}
          <section className="bg-card rounded-lg border p-4 space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground">
              Yield &amp; Pricing
            </h2>

            <div>
              <label className="text-sm font-medium block mb-1">Batch Yield (bars)</label>
              <input
                type="number"
                min="1"
                value={batchYieldBars}
                onChange={(e) => setBatchYieldBars(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Target Price per Bar
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={targetPricePerBar}
                onChange={(e) => setTargetPricePerBar(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="w-full py-2 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Calculate Cost
            </button>
          </section>

          {/* Result */}
          {result && (
            <section className="bg-card rounded-lg border p-4 space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">
                Cost Result
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Total Cost</div>
                  <div className="text-xl font-bold tabular-nums">
                    ${result.totalCost.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Cost per Bar</div>
                  <div className="text-xl font-bold tabular-nums">
                    ${result.costPerBar.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Cost per Gram</div>
                  <div className="text-xl font-bold tabular-nums">
                    ${result.costPerUnit.toFixed(4)}
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Margin</div>
                  <div
                    className={`text-xl font-bold tabular-nums ${
                      result.marginPercent >= 50
                        ? "text-green-600"
                        : result.marginPercent >= 30
                        ? "text-yellow-600"
                        : "text-destructive"
                    }`}
                  >
                    {result.marginPercent.toFixed(1)}%
                  </div>
                </div>
              </div>

              {result.missingCostBasis.length > 0 && (
                <AttentionRow
                  title="Missing cost basis"
                  description={`${result.missingCostBasis.length} ingredient(s) excluded from total`}
                  variant="warning"
                />
              )}

              {result.warnings.length > 0 && (
                <div className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded text-sm ${
                        w.type === "blocking"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {w.message}
                    </div>
                  ))}
                </div>
              )}

              <SaveIndicator state={saveState} />

              {saveError && (
                <AttentionRow
                  title="Save failed"
                  description={saveError}
                  variant="danger"
                />
              )}

              <button
                onClick={handleSave}
                disabled={saveState === "saving" || missingCostBasis.length === inheritedLineItems.length}
                className="w-full py-3 font-medium bg-sage text-sage-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveState === "saving" ? "Saving..." : "Save Cost Result"}
              </button>

              {saveState === "saved" && (
                <div className="pt-4 border-t border-border">
                  <Link
                    href={`/batches`}
                    className="block text-center text-sm font-medium text-primary hover:underline"
                  >
                    ← Back to Batches
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* Incomplete queue hint */}
          {missingCostBasis.length > 0 && result === null && (
            <AttentionRow
              title="Incomplete cost data"
              description="Select cost records for all oils before calculating."
              variant="info"
            />
          )}
        </div>
      </div>
    </div>
  );
}
