"use client";

import { useState } from "react";
import { Recipe } from "@/components/recipe-library/recipe-library";
import { calculateFormulation } from "@/lib/calculations/sap";

const TEMPLATE_RECIPES: Recipe[] = [
  {
    id: "castile",
    name: "Castile Soap",
    method: "cp",
    oilBlend: [{ oilId: "olive-oil", percent: 100 }],
    superfatPercent: 8,
    lyeConcentrationPercent: 33,
    waterToLyeRatio: 2.5,
    warnings: [],
    createdAt: new Date(),
  },
  {
    id: "french-milled",
    name: "French Milled Soap",
    method: "cp",
    oilBlend: [
      { oilId: "tallow", percent: 70 },
      { oilId: "castor-oil", percent: 30 },
    ],
    superfatPercent: 5,
    lyeConcentrationPercent: 33,
    waterToLyeRatio: 2.5,
    warnings: [],
    createdAt: new Date(),
  },
  {
    id: "milk-soap",
    name: "Milk Soap",
    method: "cp",
    oilBlend: [
      { oilId: "coconut-oil", percent: 30 },
      { oilId: "olive-oil", percent: 50 },
      { oilId: "shea-butter", percent: 20 },
    ],
    superfatPercent: 8,
    lyeConcentrationPercent: 33,
    waterToLyeRatio: 2.5,
    warnings: [],
    createdAt: new Date(),
  },
  {
    id: "coconut-castile",
    name: "Coconut Castile",
    method: "cp",
    oilBlend: [
      { oilId: "olive-oil", percent: 70 },
      { oilId: "coconut-oil", percent: 30 },
    ],
    superfatPercent: 8,
    lyeConcentrationPercent: 33,
    waterToLyeRatio: 2.5,
    warnings: [],
    createdAt: new Date(),
  },
  {
    id: "luxury-bar",
    name: "Luxury Bar Soap",
    method: "cp",
    oilBlend: [
      { oilId: "olive-oil", percent: 40 },
      { oilId: "coconut-oil", percent: 25 },
      { oilId: "palm-oil", percent: 20 },
      { oilId: "shea-butter", percent: 10 },
      { oilId: "castor-oil", percent: 5 },
    ],
    superfatPercent: 8,
    lyeConcentrationPercent: 33,
    waterToLyeRatio: 2.5,
    warnings: [],
    createdAt: new Date(),
  },
];

export function TemplateRecipes() {
  const [selectedTemplate, setSelectedTemplate] = useState<Recipe | null>(null);
  const [customized, setCustomized] = useState<Recipe | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);

  const handleSelectTemplate = (template: Recipe) => {
    setSelectedTemplate(template);
    setCustomized({ ...template });
    setShowCustomize(true);
  };

  const handleCustomize = (updatedRecipe: Recipe) => {
    setCustomized(updatedRecipe);
  };

  const handleUseTemplate = () => {
    if (customized) {
      // In a real app, this would save to personal library and redirect
      console.log("Using customized template:", customized);
      alert("Template saved to your recipe library!");
      setShowCustomize(false);
      setSelectedTemplate(null);
      setCustomized(null);
    }
  };

  if (!selectedTemplate && !showCustomize) {
    return (
      <div className="space-y-6">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Template Recipes
        </h2>
        <p className="text-sm text-muted-foreground">
          Start with a proven formulation and customize it to your needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATE_RECIPES.map((template) => (
            <div
              key={template.id}
              className="group border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 text-2xl">
                  {template.method === "cp" ? "⚗️" : "🧼"}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.method === "cp"
                      ? "Cold Process"
                      : template.method === "hp"
                      ? "Hot Process"
                      : "Melt & Pour"}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap gap-2">
                  {template.oilBlend.map((oil) => (
                    <span
                      key={oil.oilId}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs"
                    >
                      {oil.percent}%
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Superfat: {template.superfatPercent}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!selectedTemplate && !showCustomize ? (
        <>
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Template Recipes
            </h2>
            <p className="text-sm text-muted-foreground">
              Start with a proven formulation and customize it to your needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATE_RECIPES.map((template) => (
                <div
                  key={template.id}
                  className="group border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 text-2xl">
                      {template.method === "cp" ? "⚗️" : "🧼"}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {template.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.method === "cp"
                          ? "Cold Process"
                          : template.method === "hp"
                          ? "Hot Process"
                          : "Melt & Pour"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-wrap gap-2">
                      {template.oilBlend.map((oil) => (
                        <span
                          key={oil.oilId}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs"
                        >
                          {oil.percent}%
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Superfat: {template.superfatPercent}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {selectedTemplate ? `Customize: ${selectedTemplate.name}` : "Customizing template..."}
            </h2>
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setCustomized(null);
                setShowCustomize(false);
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Recipe Customizer would go here - for now simplified view */}
          <div className="border rounded-lg p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Customized Recipe
            </h3>
            {customized && (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">Method:</span>{" "}
                      <span className="font-medium text-foreground">
                        {customized.method === "cp"
                          ? "Cold Process"
                          : customized.method === "hp"
                          ? "Hot Process"
                          : "Melt & Pour"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Superfat:</span>{" "}
                      <span className="font-medium text-foreground">
                        {customized.superfatPercent}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-muted-foreground">Oil Blend:</span>{" "}
                    <span className="font-medium text-foreground">
                      {customized.oilBlend
                        .map((oil) => `${oil.percent}% ${oil.oilId}`)
                        .join(", ")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleUseTemplate}
                  className="w-full py-3 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Use This Recipe
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}