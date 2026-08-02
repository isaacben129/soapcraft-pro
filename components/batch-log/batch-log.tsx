"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface BatchLogProps {
  recipeName?: string;
  recipeId?: string;
}

export function BatchLog({
  recipeName = "Custom batch",
  recipeId = "manual",
}: BatchLogProps) {
  const [batchName, setBatchName] = useState("");
  const [oilWeight, setOilWeight] = useState("");
  const [lyeWeight, setLyeWeight] = useState("");
  const [waterWeight, setWaterWeight] = useState("");
  const [fragranceWeight, setFragranceWeight] = useState("");
  const [method, setMethod] = useState<"cp" | "hp" | "mp">("cp");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"draft" | "making" | "curing" | "completed" | "archived">("draft");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!batchName.trim()) newErrors.batchName = "Batch name is required";
    if (!oilWeight || Number(oilWeight) <= 0) newErrors.oilWeight = "Oil weight must be > 0";
    if (!lyeWeight || Number(lyeWeight) <= 0) newErrors.lyeWeight = "Lye weight must be > 0";
    if (!waterWeight || Number(waterWeight) <= 0) newErrors.waterWeight = "Water weight must be > 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    // Save batch — in a real app this would POST to the API
    console.log("Batch saved:", {
      recipeId,
      recipeName,
      batchName,
      oilWeight: Number(oilWeight),
      lyeWeight: Number(lyeWeight),
      waterWeight: Number(waterWeight),
      fragranceWeight: Number(fragranceWeight) || 0,
      method,
      notes,
      status,
    });
    setStatus("making");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">New Batch</h1>
      <p className="text-muted-foreground mb-6">
        Recipe: <span className="font-medium text-foreground">{recipeName}</span>
      </p>

      <div className="space-y-6">
        {/* Batch name */}
        <div>
          <label className="text-sm font-medium block mb-1" htmlFor="batch-name">
            Batch Name
          </label>
          <input
            id="batch-name"
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="e.g., Olive & Coconut — Batch 1"
            className={cn(
              "w-full px-3 py-2 rounded-lg border bg-background text-foreground",
              errors.batchName && "border-destructive"
            )}
          />
          {errors.batchName && (
            <p className="text-xs text-destructive mt-1">{errors.batchName}</p>
          )}
        </div>

        {/* Method selector */}
        <div>
          <label className="text-sm font-medium block mb-2">Method</label>
          <div className="flex gap-3">
            {(["cp", "hp", "mp"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                  method === m
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:bg-accent"
                )}
              >
                {m === "cp" ? "Cold Process" : m === "hp" ? "Hot Process" : "Melt & Pour"}
              </button>
            ))}
          </div>
          {method !== "cp" && (
            <p className="text-xs text-muted-foreground mt-2">
              {method === "hp"
                ? "Hot Process: simplified batch log — no guided steps in v1"
                : "Melt & Pour: simplified batch log — no lye calculation needed"}
            </p>
          )}
        </div>

        {/* Actual measurements */}
        <div className="bg-card rounded-lg border p-4 space-y-4">
          <h2 className="text-lg font-semibold">Actual Measurements</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1" htmlFor="oil-weight">
                Oil Weight (g)
              </label>
              <input
                id="oil-weight"
                type="number"
                min="0"
                step="0.1"
                value={oilWeight}
                onChange={(e) => setOilWeight(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border bg-background text-foreground",
                  errors.oilWeight && "border-destructive"
                )}
              />
              {errors.oilWeight && (
                <p className="text-xs text-destructive mt-1">{errors.oilWeight}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1" htmlFor="lye-weight">
                Lye Weight (g)
              </label>
              <input
                id="lye-weight"
                type="number"
                min="0"
                step="0.1"
                value={lyeWeight}
                onChange={(e) => setLyeWeight(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border bg-background text-foreground",
                  errors.lyeWeight && "border-destructive"
                )}
              />
              {errors.lyeWeight && (
                <p className="text-xs text-destructive mt-1">{errors.lyeWeight}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1" htmlFor="water-weight">
                Water Weight (g)
              </label>
              <input
                id="water-weight"
                type="number"
                min="0"
                step="0.1"
                value={waterWeight}
                onChange={(e) => setWaterWeight(e.target.value)}
                className={cn(
                  "w-full px-3 py-2 rounded-lg border bg-background text-foreground",
                  errors.waterWeight && "border-destructive"
                )}
              />
              {errors.waterWeight && (
                <p className="text-xs text-destructive mt-1">{errors.waterWeight}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1" htmlFor="fragrance-weight">
                Fragrance Weight (g)
              </label>
              <input
                id="fragrance-weight"
                type="number"
                min="0"
                step="0.1"
                value={fragranceWeight}
                onChange={(e) => setFragranceWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Safety checklist (CP only) */}
        {method === "cp" && (
          <div className="bg-card rounded-lg border p-4 space-y-3">
            <h2 className="text-lg font-semibold">Safety Checklist</h2>
            <p className="text-sm text-muted-foreground">
              Complete these checks before starting your batch.
            </p>
            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span>I have safety equipment ready (gloves, goggles, long sleeves)</span>
            </label>
            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span>I have verified my lye calculation against the recipe</span>
            </label>
            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span>I have my workspace prepared and all ingredients measured</span>
            </label>
            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <input type="checkbox" className="mt-1" />
              <span>I understand lye is caustic and requires careful handling</span>
            </label>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="text-sm font-medium block mb-1" htmlFor="batch-notes">
            Notes
          </label>
          <textarea
            id="batch-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border bg-background text-foreground resize-none"
            placeholder="Any notes about this batch..."
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Start Batch
        </button>
      </div>
    </div>
  );
}
