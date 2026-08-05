// ── Recipe Detail / Version History ──────────
// R3.4: Recipe detail, version history/diff,
// create new version, duplicate/archive,
// batches section valid empty state.

"use client";

import { useState } from "react";
import Link from "next/link";
import { ObjectHeader } from "@/components/shared/object-header";
import { StatusLabel } from "@/components/shared/status-label";
import { EmptyState } from "@/components/shared/empty-state";
import { LedgerRow } from "@/components/shared/ledger-row";
import { AttentionRow } from "@/components/shared/attention-row";

// ── Mock data ──

interface Version {
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
  method: "CP" | "HP" | "MP";
  currentVersion: number;
  status: "active" | "draft" | "archived";
  batchesCount: number;
  totalWeight: number;
  updatedAt: string;
}

const recipe: Recipe = {
  id: "1",
  name: "Simple Castile",
  method: "CP",
  currentVersion: 1,
  status: "active",
  batchesCount: 3,
  totalWeight: 1000,
  updatedAt: "2026-07-20",
};

const versions: Version[] = [
  {
    id: "v1-1",
    version: 1,
    name: "Simple Castile",
    oilBlend: [{ oilId: "olive-oil", percent: 100 }],
    superfatPercent: 8,
    lyeConcentrationPercent: 33,
    waterToLyeRatio: 2.5,
    calculatedLyeNaOH: 134,
    calculatedLyeKOH: 192,
    calculatedWater: 335,
    calculatedFragranceLoad: 0,
    totalWeight: 1000,
    warnings: [],
    createdAt: "2026-07-15",
  },
  {
    id: "v1-2",
    version: 2,
    name: "Simple Castile — 5% Superfat",
    oilBlend: [{ oilId: "olive-oil", percent: 100 }],
    superfatPercent: 5,
    lyeConcentrationPercent: 33,
    waterToLyeRatio: 2.5,
    calculatedLyeNaOH: 130,
    calculatedLyeKOH: 187,
    calculatedWater: 325,
    calculatedFragranceLoad: 0,
    totalWeight: 1000,
    warnings: [],
    createdAt: "2026-07-18",
  },
];

// ── Diff helper ──

function diffVersions(a: Version, b: Version): Array<{ field: string; from: string; to: string }> {
  const diffs: Array<{ field: string; from: string; to: string }> = [];

  if (a.superfatPercent !== b.superfatPercent) {
    diffs.push({ field: "Superfat", from: `${a.superfatPercent}%`, to: `${b.superfatPercent}%` });
  }
  if (a.lyeConcentrationPercent !== b.lyeConcentrationPercent) {
    diffs.push({ field: "Lye Conc.", from: `${a.lyeConcentrationPercent}%`, to: `${b.lyeConcentrationPercent}%` });
  }
  if (a.waterToLyeRatio !== b.waterToLyeRatio) {
    diffs.push({ field: "Water Ratio", from: `${a.waterToLyeRatio}:1`, to: `${b.waterToLyeRatio}:1` });
  }
  if (a.calculatedLyeNaOH !== b.calculatedLyeNaOH) {
    diffs.push({ field: "Lye NaOH", from: `${a.calculatedLyeNaOH}g`, to: `${b.calculatedLyeNaOH}g` });
  }
  if (a.calculatedLyeKOH !== b.calculatedLyeKOH) {
    diffs.push({ field: "Lye KOH", from: `${a.calculatedLyeKOH}g`, to: `${b.calculatedLyeKOH}g` });
  }
  if (a.calculatedWater !== b.calculatedWater) {
    diffs.push({ field: "Water", from: `${a.calculatedWater}g`, to: `${b.calculatedWater}g` });
  }
  if (a.calculatedFragranceLoad !== b.calculatedFragranceLoad) {
    diffs.push({ field: "Fragrance", from: `${a.calculatedFragranceLoad}%`, to: `${b.calculatedFragranceLoad}%` });
  }

  // Oil blend diff
  const aOils = a.oilBlend.map((o) => `${o.oilId} ${o.percent}%`).join(", ");
  const bOils = b.oilBlend.map((o) => `${o.oilId} ${o.percent}%`).join(", ");
  if (aOils !== bOils) {
    diffs.push({ field: "Oil Blend", from: aOils, to: bOils });
  }

  return diffs;
}

// ── Page ──

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([
    versions[versions.length - 1]?.id || "",
    versions[0]?.id || "",
  ]);

  const versionA = versions.find((v) => v.id === selectedVersions[0]);
  const versionB = versions.find((v) => v.id === selectedVersions[1]);
  const diffs = versionA && versionB ? diffVersions(versionA, versionB) : [];

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <ObjectHeader
            title={recipe.name}
            breadcrumbs={[
              { label: "Recipes", href: "/recipes" },
              { label: recipe.name },
            ]}
            action={
              <div className="flex gap-2">
                <Link
                  href={`/recipes/${recipe.id}/duplicate`}
                  className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm hover:bg-muted transition-colors"
                >
                  Duplicate
                </Link>
                <Link
                  href={`/recipes/${recipe.id}/archive`}
                  className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm hover:bg-muted transition-colors"
                >
                  Archive
                </Link>
              </div>
            }
          />

          {/* Current version badge */}
          <div className="mt-4 flex items-center gap-3">
            <StatusLabel status="active" />
            <span className="text-sm text-muted-foreground">
              v{recipe.currentVersion} · {recipe.method} · {recipe.totalWeight}g
            </span>
          </div>

          {/* Version history */}
          <section className="mt-8" aria-label="Version history">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Version History
            </h2>
            <div className="space-y-3">
              {versions.map((version, i) => (
                <div
                  key={version.id}
                  className={`p-4 rounded-lg border ${
                    version.version === recipe.currentVersion
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground">
                        v{version.version}
                      </span>
                      {version.version === recipe.currentVersion && (
                        <span className="ml-2 text-xs text-primary">Current</span>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {version.createdAt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/recipes/${recipe.id}/versions/${version.version}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View
                      </Link>
                      {version.version < recipe.currentVersion && (
                        <Link
                          href={`/batches/new?recipe=${recipe.id}&version=${version.version}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Start Batch
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="mt-3 grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">NaOH:</span>{" "}
                      <span className="font-medium tabular-nums">
                        {version.calculatedLyeNaOH}g
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">KOH:</span>{" "}
                      <span className="font-medium tabular-nums">
                        {version.calculatedLyeKOH}g
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Water:</span>{" "}
                      <span className="font-medium tabular-nums">
                        {version.calculatedWater}g
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Superfat:</span>{" "}
                      <span className="font-medium tabular-nums">
                        {version.superfatPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Version diff */}
          {versions.length >= 2 && (
            <section className="mt-8" aria-label="Version comparison">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Compare Versions
              </h2>
              <div className="flex gap-3 mb-4">
                <select
                  value={selectedVersions[0]}
                  onChange={(e) =>
                    setSelectedVersions([e.target.value, selectedVersions[1]])
                  }
                  className="flex-1 px-3 py-2 rounded-lg border bg-background text-foreground"
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      v{v.version} ({v.createdAt})
                    </option>
                  ))}
                </select>
                <span className="self-center text-muted-foreground">vs</span>
                <select
                  value={selectedVersions[1]}
                  onChange={(e) =>
                    setSelectedVersions([selectedVersions[0], e.target.value])
                  }
                  className="flex-1 px-3 py-2 rounded-lg border bg-background text-foreground"
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.id}>
                      v{v.version} ({v.createdAt})
                    </option>
                  ))}
                </select>
              </div>

              {diffs.length > 0 ? (
                <div className="space-y-2">
                  {diffs.map((diff, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border bg-card text-sm"
                    >
                      <span className="font-medium text-foreground">
                        {diff.field}
                      </span>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <span className="text-muted-foreground">
                          {diff.from}
                        </span>
                        <span className="text-foreground">{diff.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No differences between selected versions.
                </p>
              )}
            </section>
          )}

          {/* Create new version */}
          <section className="mt-8" aria-label="Create new version">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Create New Version
            </h2>
            <AttentionRow
              title="Editing creates a new version"
              description="It never mutates a version used by a batch. The current version remains unchanged."
              variant="info"
            />
            <Link
              href={`/recipes/${recipe.id}/edit`}
              className="mt-4 block inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Edit Recipe → New Version
            </Link>
          </section>

          {/* Batches section */}
          <section className="mt-8" aria-label="Batches from this recipe">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Batches
            </h2>
            {recipe.batchesCount === 0 ? (
              <EmptyState
                title="No batches yet"
                description="Start a batch from this recipe to track your production."
                action={
                  <Link
                    href={`/batches/new?recipe=${recipe.id}&version=${recipe.currentVersion}`}
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Start Batch
                  </Link>
                }
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {recipe.batchesCount} batch(es) made from this recipe.
                <Link
                  href={`/batches?recipe=${recipe.id}`}
                  className="ml-2 font-medium text-primary hover:underline"
                >
                  View all →
                </Link>
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
