"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const STEPS = ["experience", "goal", "method"] as const;
type Step = (typeof STEPS)[number];

interface OnboardingData {
  experienceLevel: "beginner" | "intermediate" | "advanced" | null;
  primaryGoal: "hobby" | "sell" | null;
  methodPreference: "cp" | "hp" | "mp" | null;
}

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner", description: "Just getting started with soap making" },
  { value: "intermediate", label: "Intermediate", description: "Make soap regularly, know the basics" },
  { value: "advanced", label: "Advanced", description: "Seasoned maker, experimenting with recipes" },
];

const GOAL_OPTIONS = [
  { value: "hobby", label: "Hobby", description: "Making soap for personal use and gifting" },
  { value: "sell", label: "Sell", description: "Making soap to sell at markets or online" },
];

const METHOD_OPTIONS = [
  { value: "cp", label: "Cold Process", description: "Classic method, cure required" },
  { value: "hp", label: "Hot Process", description: "Cooked method, shorter cure" },
  { value: "mp", label: "Melt & Pour", description: "Pre-made base, no lye handling" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("experience");
  const [data, setData] = useState<OnboardingData>({
    experienceLevel: null,
    primaryGoal: null,
    methodPreference: null,
  });

  const stepIndex = STEPS.indexOf(step);

  function updateField(field: keyof OnboardingData, value: string) {
    setData((prev) => ({ ...prev, [field]: value as OnboardingData[typeof field] }));
  }

  function next() {
    if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1]);
    } else {
      // Complete onboarding — save and redirect
      router.push("/recipes/new");
    }
  }

  function back() {
    if (stepIndex > 0) {
      setStep(STEPS[stepIndex - 1]);
    }
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                i <= stepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-12 transition-colors",
                  i < stepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border p-6">
        {step === "experience" && (
          <>
            <h2 className="text-xl font-semibold mb-2">What is your experience?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This helps us tailor your first recipe and recommendations.
            </p>
            <div className="space-y-3">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateField("experienceLevel", opt.value)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-colors",
                    data.experienceLevel === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  )}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-sm text-muted-foreground">{opt.description}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "goal" && (
          <>
            <h2 className="text-xl font-semibold mb-2">What is your primary goal?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This shapes your workspace and cost calculations.
            </p>
            <div className="space-y-3">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateField("primaryGoal", opt.value)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-colors",
                    data.primaryGoal === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  )}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-sm text-muted-foreground">{opt.description}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "method" && (
          <>
            <h2 className="text-xl font-semibold mb-2">Preferred method?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Cold Process is the most common for serious soap makers.
            </p>
            <div className="space-y-3">
              {METHOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateField("methodPreference", opt.value)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-colors",
                    data.methodPreference === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  )}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-sm text-muted-foreground">{opt.description}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between mt-6">
        {stepIndex > 0 ? (
          <button
            onClick={back}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={next}
          disabled={
            (step === "experience" && !data.experienceLevel) ||
            (step === "goal" && !data.primaryGoal) ||
            (step === "method" && !data.methodPreference)
          }
          className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {stepIndex === STEPS.length - 1 ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
}
