"use client";

import { useState } from "react";
import { Recipe } from "@/components/recipe-library/recipe-library";
import { calculateFormulation, DEFAULT_OILS } from "@/lib/calculations/sap";

interface RecipeSuggestion {
  oils: { oilId: string; percent: number }[];
  reason: string;
  confidence: number; // 0-1
}

const GOAL_PROFILES: Record<
  string,
  {
    name: string;
    description: string;
    idealOils: { oilId: string; weight: number }[];
  }
> = {
  hard: {
    name: "Hard Bar",
    description: "Long-lasting bar that resists melting in the shower",
    idealOils: [
      { oilId: "coconut-oil", weight: 0.4 },
      { oilId: "palm-oil", weight: 0.3 },
      { oilId: "tallow", weight: 0.3 },
    ],
  },
  creamy: {
    name: "Creamy Lather Lather",
    description: "Rich, creamy, stable lather that feels luxurious",
    idealOils: [
      { oilId: "coconut-oil", weight: 0.3 },
      { oilId: "castor-oil", weight: 0.2 },
      { oilId: "shea-butter", weight: 0.2 },
      { oilId: "avocado-oil", weight: 0.1 },
    ],
  },
  bubbly: {
    name: "Bubbly Lather",
    description: "Big, fluffy bubbles that cleanse effectively",
    idealOils: [
      { oilId: "coconut-oil", weight: 0.5 },
      { oilId: "castor-oil", weight: 0.2 },
      { oilId: "palm-kernel-oil", weight: 0.2 },
      { oilId: "babassu-oil", weight: 0.1 },
    ],
  },
  conditioning: {
    name: "Conditioning",
    description: "Moisturizing, gentle bar that doesn't strip skin",
    idealOils: [
      { oilId: "olive-oil", weight: 0.4 },
      { oilId: "shea-butter", weight: 0.3 },
      { oilId: "avocado-oil", weight: 0.2 },
      { oilId: "castor-oil", weight: 0.1 },
    ],
  },
  balanced: {
    name: "Balanced Bar",
    description: "Good balance of hardness, lather, and conditioning",
    idealOils: [
      { oilId: "olive-oil", weight: 0.3 },
      { oilId: "coconut-oil", weight: 0.25 },
      { oilId: "palm-oil", weight: 0.25 },
      { oilId: "castor-oil", weight: 0.1 },
      { oilId: "shea-butter", weight: 0.1 },
    ],
  },
};

function calculateOilScore(
  oils: { oilId: string; percent: number }[],
  idealOils: { oilId: string; weight: number }[]
): number {
  let score = 0;
  let totalWeight = 0;

  for (const ideal of idealOils) {
    const actual = oils.find((o) => o.oilId === ideal.oilId);
    const actualPercent = actual ? actual.percent / 100 : 0;
    const idealWeight = ideal.weight;

    // Closer to ideal = higher score
    const diff = Math.abs(actualPercent - idealWeight);
    score += Math.max(0, 1 - diff * 2); // Penalize deviations
    totalWeight += 1;
  }

  return totalWeight > 0 ? score / totalWeight : 0;
}

export function RecipeIntelligence() {
  const [goals, setGoals] = useState<Set<string>>(new Set(["balanced"]));
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSuggestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const goalArray = Array.from(goals);
      const suggestions: RecipeSuggestion[] = [];

      // For each goal, generate a suggestion
      goalArray.forEach((goal) => {
        const profile = GOAL_PROFILES[goal];
        if (!profile) return;

        // Convert ideal oils to percentages
        const totalWeight = profile.idealOils.reduce(
          (sum, oil) => sum + oil.weight,
          0
        );
        const oilPercents = profile.idealOils.map((oil) => ({
          oilId: oil.oilId,
          percent: Math.round((oil.weight / totalWeight) * 100),
        }));

        // Ensure total is 100%
        const total = oilPercents.reduce((sum, oil) => sum + oil.percent, 0);
        if (total !== 100 && oilPercents.length > 0) {
          oilPercents[0].percent += (100 - total);
        }

        // Generate a second suggestion with variation
        const variation2: RecipeSuggestion = {
            oils: [...oilPercents],
            reason: `Alternative formulation for ${profile.name} with different oil ratios`,
            confidence: 0.75,
        };

        // Apply some variation to the second suggestion
        if (variation2.oils.length > 1) {
            // Shift 5% from first to second oil
            if (variation2.oils[0].percent >= 5) {
                variation2.oils[0].percent -= 5;
                variation2.oils[1].percent += 5;
            }
        }

        suggestions.push(variation2);
      });

      setSuggestions(suggestions);
      setIsGenerating(false);
    }, 500); // Simulate thinking time
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Recipe Intelligence
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select your goals and get AI-powered oil blend suggestions.
          <br />
          <span className="text-xs text-muted-foreground block">
            (Deterministic calculation is the authority - AI explains and suggests only)
          </span>
        </p>
        <div className="space-y-3">
          <label className="flex items-start gap-2 text-sm font-medium text-foreground">
            What do you want your soap to do?
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(GOAL_PROFILES).map(([key, profile]) => (
              <label
                key={key}
                className={`flex items-center gap-2 px-3 py-2 rounded border ${
                  goals.has(key)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                <input
                  type="checkbox"
                  checked={goals.has(key)}
                  onChange={(e) => {
                    const newGoals = new Set(goals);
                    if (e.target.checked) {
                        newGoals.add(key);
                    } else {
                        newGoals.delete(key);
                    }
                    setGoals(newGoals);
                }}
                  className="h-4 w-4 text-primary"
                />
                <span>{profile.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
            <button
              onClick={generateSuggestions}
              disabled={isGenerating || goals.size === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 ${
                isGenerating || goals.size === 0
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {isGenerating ? "Generating..." : "Get Suggestions"}
            </button>
        </div>
      </div>

      {isGenerating && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-muted-foreground">Thinking...</span>
          </div>
        </div>
      )}

      {!isGenerating && suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">
            Suggested Formulations
          </h3>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-background"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-display text-lg font-semibold text-foreground">
                    Suggestion {index + 1}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-xs">
                    {Math.round(suggestion.confidence * 100)}% match
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {suggestion.reason}
                </p>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Oil Blend:</span>{" "}
                      <span className="font-medium text-foreground">
                        {suggestion.oils
                          .map((oil) => `${oil.percent}% ${oil.oilId}`)
                          .join(", ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Superfat:</span>{" "}
                      <span className="font-medium text-foreground">5%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => {
                      // In a real app, this would open the recipe builder with this formulation
                      alert(
                        "Recipe sent to Recipe Builder! (In a real app, this would pre-fill the form)"
                      );
                    }}
                    className="w-full py-2 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Use This Suggestion
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isGenerating && suggestions.length === 0 && goals.size > 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            Click "Get Suggestions" to see AI-powered oil blend recommendations
          </p>
        </div>
      )}
    </div>
  );
}
