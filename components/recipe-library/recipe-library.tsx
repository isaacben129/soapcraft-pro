"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Recipe {
  id: string;
  name: string;
  method: string;
  oilBlend: Array<{ oilId: string; percent: number }>;
  superfatPercent: number;
  lyeConcentrationPercent: number;
  waterToLyeRatio: number;
  warnings: Array<{ type: "warning" | "danger"; message: string }>;
  createdAt: Date;
}

interface RecipeLibraryProps {
  recipes: Recipe[];
  onSave?: (recipeId: string) => void;
  onSelect?: (recipeId: string) => void;
}

export function RecipeLibrary({ recipes, onSave, onSelect }: RecipeLibraryProps) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");

  const filtered = recipes.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.oilBlend.some((o) => o.oilId.toLowerCase().includes(search.toLowerCase()));
    const matchesMethod = methodFilter === "all" || r.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const methods = Array.from(new Set(recipes.map((r) => r.method).filter(Boolean)));

  return (
    <section className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Recipe Library</h2>
        {onSave && (
          <button
            onClick={() => onSave("")}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Save Recipe
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or oil..."
          className="flex-1 min-w-48 text-sm border rounded px-3 py-2"
        />
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="text-sm border rounded px-3 py-2"
        >
          <option value="all">All Methods</option>
          {methods.map((m) => (
            <option key={m} value={m}>
              {m.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-2">No recipes found.</p>
          <p className="text-sm">
            {recipes.length === 0
              ? "Create your first recipe to get started."
              : "Try a different search or filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              className={cn(
                "p-4 rounded-lg border bg-card cursor-pointer hover:shadow-sm transition-shadow",
                onSelect && "hover:border-primary"
              )}
              onClick={() => onSelect?.(recipe.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{recipe.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {recipe.method?.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                <span>Superfat {recipe.superfatPercent}%</span>
                <span>Lye {recipe.lyeConcentrationPercent}%</span>
                <span>Water {recipe.waterToLyeRatio}:1</span>
              </div>
              {recipe.warnings.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {recipe.warnings.map((w, i) => (
                    <span
                      key={i}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        w.type === "danger"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {w.message}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}