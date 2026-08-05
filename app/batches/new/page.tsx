// ── Batch Creation Page ──────────────────
// R4.1: Select exact recipe version, copy planned measurement snapshot,
// create user-owned batch, activity event, dashboard/list visibility.
// Later recipe edit does not alter batch plan.
// Unsaved recipe draft cannot start batch.
// Cross-user version ID denied.

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ObjectHeader } from "@/components/shared/object-header";
import { StatusLabel } from "@/components/shared/status-label";
import { EmptyState } from "@/components/shared/empty-state";
import { AttentionRow } from "@/components/shared/attention-row";
import { SaveIndicator } from "@/components/shared/save-indicator";
import { LedgerRow } from "@/components/shared/ledger-row";

interface RecipeVersion {
  id: string;
  version: number;
  name: string;
  oilBlend: Array<{ oilId: string; percent: number }>;
  superfatPercent: number;
  lyeConcentrationPercent: number;
  waterToLyeRatio: number;
  calculatedLyeNaOH: number;
  calculatedLyeKOH: number;
  calculatedWater: number;
  calculatedFragranceLoad: number;
  totalWeight: number;
  warnings: Array<{ type: string; message: string }>;
  createdAt: string;
}

interface Recipe {
  id: string;
  name: string;
  method: string;
  currentVersion: number;
}

export default function NewBatchPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  const [versions, setVersions] = useState<RecipeVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [batchName, setBatchName] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch user's recipes
  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data.recipes || []))
      .catch(() => {});
  }, []);

  // Fetch versions when recipe is selected
  useEffect(() => {
    if (!selectedRecipe) {
      setVersions([]);
      setSelectedVersion("");
      return;
    }

    fetch(`/api/recipes/${selectedRecipe}/versions`)
      .then((res) => res.json())
      .then((data) => setVersions(data.versions || []))
      .catch(() => setVersions([]));
  }, [selectedRecipe]);

  const selectedVersionData = versions.find((v) => v.id === selectedVersion);
  const isUnsavedDraft = versions.length === 0;

  async function handleCreate() {
    if (!selectedRecipe || !selectedVersion || !batchName.trim()) return;

    setSaveState("saving");
    setSaveError(null);

    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: selectedRecipe,
          versionId: selectedVersion,
          batchName: batchName.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create batch");
      }

      const data = await res.json();
      setSaveState("saved");

      // Redirect to batch detail after short delay
      setTimeout(() => {
        window.location.href = `/batches/${data.id}`;
      }, 1500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to create batch");
      setSaveState("error");
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <ObjectHeader
            title="Start New Batch"
            breadcrumbs={[
              { label: "Batches", href: "/batches" },
              { label: "New Batch" },
            ]}
          />

          {/* Recipe selection */}
          <section className="mt-6 bg-card rounded-lg border p-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              1. Select Recipe
            </h2>
            {recipes.length === 0 ? (
              <EmptyState
                title="No recipes available"
                description="Create a recipe first, then start a batch from it."
                action={
                  <Link
                    href="/recipes/new"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Create Recipe
                  </Link>
                }
              />
            ) : (
              <select
                value={selectedRecipe}
                onChange={(e) => {
                  setSelectedRecipe(e.target.value);
                  setSelectedVersion("");
                }}
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
              >
                <option value="">— Select a recipe —</option>
                {recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} (v{r.currentVersion})
                  </option>
                ))}
              </select>
            )}
          </section>

          {/* Version selection */}
          {selectedRecipe && versions.length > 0 && (
            <section className="mt-4 bg-card rounded-lg border p-4">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                2. Select Version
              </h2>
              <div className="space-y-3">
                {versions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVersion(v.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedVersion === v.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        v{v.version} — {v.name}
                      </span>
                      <StatusLabel
                        status={
                          v.version === versions[versions.length - 1]?.version
                            ? "active"
                            : "draft"
                        }
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-3 text-xs text-muted-foreground">
                      <span>NaOH: {v.calculatedLyeNaOH}g</span>
                      <span>KOH: {v.calculatedLyeKOH}g</span>
                      <span>Water: {v.calculatedWater}g</span>
                      <span>Superfat: {v.superfatPercent}%</span>
                    </div>
                    {v.warnings.length > 0 && (
                      <div className="mt-2">
                        {v.warnings.map((w, i) => (
                          <div
                            key={i}
                            className={`text-xs px-2 py-1 rounded ${
                              w.type === "danger"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            {w.message}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Batch name */}
          {selectedVersion && (
            <section className="mt-4 bg-card rounded-lg border p-4">
              <h2 className="font-display text-lg font-bold text-foreground mb-4">
                3. Name Your Batch
              </h2>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g., Olive &amp; Coconut — Batch 1"
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
              />

              {/* Planned snapshot summary */}
              {selectedVersionData && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Planned Snapshot (v{selectedVersionData.version})
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <LedgerRow
                      label="Lye NaOH"
                      planned={selectedVersionData.calculatedLyeNaOH}
                      unit="g"
                    />
                    <LedgerRow
                      label="Lye KOH"
                      planned={selectedVersionData.calculatedLyeKOH}
                      unit="g"
                    />
                    <LedgerRow
                      label="Water"
                      planned={selectedVersionData.calculatedWater}
                      unit="g"
                    />
                    <LedgerRow
                      label="Fragrance"
                      planned={selectedVersionData.calculatedFragranceLoad}
                      unit="%"
                    />
                    <LedgerRow
                      label="Total Weight"
                      planned={selectedVersionData.totalWeight}
                      unit="g"
                    />
                    <LedgerRow
                      label="Superfat"
                      planned={selectedVersionData.superfatPercent}
                      unit="%"
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Save state */}
          <SaveIndicator state={saveState} />

          {/* Save error */}
          {saveError && (
            <AttentionRow
              title="Batch creation failed"
              description={saveError}
              variant="danger"
            />
          )}

          {/* Create button */}
          {selectedVersion && (
            <button
              onClick={handleCreate}
              disabled={
                saveState === "saving" ||
                !batchName.trim() ||
                isUnsavedDraft
              }
              className="mt-4 w-full py-3 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveState === "saving"
                ? "Creating Batch..."
                : "Start Batch"}
            </button>
          )}

          {/* Unsaved draft guard */}
          {isUnsavedDraft && selectedRecipe && (
            <AttentionRow
              title="Cannot start batch from unsaved draft"
              description="Save the recipe first before starting a batch."
              variant="warning"
            />
          )}
        </div>
      </div>
    </main>
  );
}
