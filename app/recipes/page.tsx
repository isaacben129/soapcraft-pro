// ── Recipe Portfolio ─────────────────────────
// R3.4: User-scoped recipe list/search/filter/sort,
// recipe detail, version history/diff, create new version,
// duplicate/archive, batches section valid empty state.

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ObjectHeader } from "@/components/shared/object-header";
import { StatusLabel } from "@/components/shared/status-label";
import { EmptyState } from "@/components/shared/empty-state";
import { LedgerRow } from "@/components/shared/ledger-row";

// ── Mock data (will be replaced with API call) ──

interface Recipe {
  id: string;
  name: string;
  method: "CP" | "HP" | "MP";
  version: number;
  status: "draft" | "active" | "archived";
  updatedAt: string;
  createdAt: string;
  warnings: number;
  totalWeight: number;
}

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

const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Simple Castile",
    method: "CP",
    version: 1,
    status: "active",
    updatedAt: "2026-07-20",
    createdAt: "2026-07-15",
    warnings: 0,
    totalWeight: 1000,
  },
  {
    id: "2",
    name: "Luxury Shea Blend",
    method: "CP",
    version: 2,
    status: "active",
    updatedAt: "2026-07-18",
    createdAt: "2026-07-10",
    warnings: 1,
    totalWeight: 1500,
  },
  {
    id: "3",
    name: "Archived Oatmeal",
    method: "HP",
    version: 1,
    status: "archived",
    updatedAt: "2026-06-30",
    createdAt: "2026-06-01",
    warnings: 0,
    totalWeight: 800,
  },
];

const mockVersions: Record<string, Version[]> = {
  "1": [
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
  ],
  "2": [
    {
      id: "v2-1",
      version: 1,
      name: "Luxury Shea Blend",
      oilBlend: [
        { oilId: "shea-butter", percent: 40 },
        { oilId: "olive-oil", percent: 60 },
      ],
      superfatPercent: 8,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2.5,
      calculatedLyeNaOH: 180,
      calculatedLyeKOH: 260,
      calculatedWater: 450,
      calculatedFragranceLoad: 3,
      totalWeight: 1500,
      warnings: [],
      createdAt: "2026-07-10",
    },
    {
      id: "v2-2",
      version: 2,
      name: "Luxury Shea Blend",
      oilBlend: [
        { oilId: "shea-butter", percent: 40 },
        { oilId: "olive-oil", percent: 55 },
        { oilId: "castor-oil", percent: 5 },
      ],
      superfatPercent: 8,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2.5,
      calculatedLyeNaOH: 185,
      calculatedLyeKOH: 265,
      calculatedWater: 455,
      calculatedFragranceLoad: 3,
      totalWeight: 1500,
      warnings: [
        { type: "warning", message: "Castor oil at 5% — high lather, use sparingly" },
      ],
      createdAt: "2026-07-18",
    },
  ],
  "3": [
    {
      id: "v3-1",
      version: 1,
      name: "Archived Oatmeal",
      oilBlend: [
        { oilId: "olive-oil", percent: 70 },
        { oilId: "coconut-oil", percent: 30 },
      ],
      superfatPercent: 5,
      lyeConcentrationPercent: 33,
      waterToLyeRatio: 2.5,
      calculatedLyeNaOH: 150,
      calculatedLyeKOH: 215,
      calculatedWater: 375,
      calculatedFragranceLoad: 0,
      totalWeight: 800,
      warnings: [],
      createdAt: "2026-06-01",
    },
  ],
};

// ── Recipe Portfolio Page ──

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "archived">("all");
  const [sort, setSort] = useState<"updated" | "created" | "name">("updated");

  const filtered = useMemo(() => {
    let result = mockRecipes.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || r.status === filter;
      return matchesSearch && matchesFilter;
    });

    result.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "created") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return result;
  }, [search, filter, sort]);

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <ObjectHeader
            title="Recipes"
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Recipes" }]}
            action={
              <Link
                href="/recipes/new"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                New Recipe
              </Link>
            }
          />

          {/* Search, filter, sort */}
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-2 rounded-lg border bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="px-3 py-2 rounded-lg border bg-background text-foreground"
            >
              <option value="updated">Sort by Updated</option>
              <option value="created">Sort by Created</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          {/* Recipe list */}
          <div className="mt-6 space-y-3">
            {filtered.length === 0 ? (
              <EmptyState
                title="No recipes found"
                description={
                  search
                    ? "No recipes match your search."
                    : filter === "all"
                    ? "Create your first recipe to get started."
                    : `No ${filter} recipes.`
                }
                action={
                  search || filter !== "all" ? undefined : (
                    <Link
                      href="/recipes/new"
                      className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      New Recipe
                    </Link>
                  )
                }
              />
            ) : (
              filtered.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="block p-4 rounded-lg border bg-card hover:shadow-elevation-1 transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{recipe.method}</span>
                        <span aria-hidden="true">·</span>
                        <span>v{recipe.version}</span>
                        <span aria-hidden="true">·</span>
                        <span>{recipe.totalWeight}g</span>
                        {recipe.warnings > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-warning">{recipe.warnings} warning(s)</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusLabel
                        status={
                          recipe.status === "active"
                            ? "active"
                            : recipe.status === "archived"
                            ? "canceled"
                            : "pending"
                        }
                      />
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {recipe.updatedAt}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Recipe Detail Page ──
// This would be at /recipes/[recipeId]/page.tsx

interface RecipeDetailProps {
  params: Promise<{ id: string }>;
}

export function RecipeDetail({ params }: RecipeDetailProps) {
  // In production, fetch recipe and versions from API
  // This is a placeholder for the detail view
  return null;
}
