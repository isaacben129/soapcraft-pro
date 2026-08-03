"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Check,
  ArrowRight,
  Zap,
  Clock,
  Shield,
  Sparkles,
  Loader2,
} from "lucide-react";

// ── Tier definitions ──────────────────────────────────────

const FREE_TIER = {
  id: "free",
  name: "Free",
  description: "Get started with the essentials",
  priceMonthly: "$0",
  priceYearly: "$0",
  features: [
    { name: "Calculator", value: true, limit: "Full lye & SAP calculations" },
    { name: "Recipes", value: true, limit: "3 recipes" },
    { name: "Active Batches", value: true, limit: "1 active batch" },
    { name: "Cure Tracking", value: false, limit: null },
    { name: "Cost Analysis", value: false, limit: null },
    { name: "Recipe Library", value: false, limit: null },
    { name: "Batch History", value: false, limit: null },
  ],
  cta: "Start for free",
  popular: false,
};

const PRO_TIER = {
  id: "pro",
  name: "Pro",
  description: "Everything you need to scale",
  priceMonthly: "$12",
  priceYearly: "$99",
  yearlySavings: "Save $45/year",
  features: [
    { name: "Calculator", value: true, limit: "Full lye & SAP calculations" },
    { name: "Recipes", value: true, limit: "Unlimited" },
    { name: "Active Batches", value: true, limit: "Unlimited" },
    { name: "Cure Tracking", value: true, limit: "Full dashboard" },
    { name: "Cost Analysis", value: true, limit: "Per-batch & per-bar" },
    { name: "Recipe Library", value: true, limit: "Unlimited storage" },
    { name: "Batch History", value: true, limit: "Full history" },
  ],
  cta: "Upgrade to Pro",
  popular: true,
};

// ── Component ──────────────────────────────────────────────

interface PricingPageProps {
  currentTier?: "free" | "pro";
  onUpgrade?: (tier: "pro", billingCycle: "monthly" | "yearly") => void;
  onDowngrade?: (tier: "free") => void;
}

export function PricingPage({
  currentTier = "free",
  onUpgrade,
  onDowngrade,
}: PricingPageProps) {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade(
    tier: "pro",
    cycle: "monthly" | "yearly"
  ) {
    setProcessing(tier);
    setError(null);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upgrade",
          tier,
          priceId: cycle === "yearly" ? "price_pro_yearly" : "price_pro_monthly",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to upgrade");
      }

      // If checkout URL is returned, redirect to Dodo Payments checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        onUpgrade?.(tier, cycle);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process upgrade"
      );
    } finally {
      setProcessing(null);
    }
  }

  async function handleDowngrade() {
    setProcessing("free");
    setError(null);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "downgrade", tier: "free" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to downgrade");
      }

      onDowngrade?.("free");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process downgrade"
      );
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Choose your plan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free. Upgrade when you&apos;re ready to scale.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <span
          className={cn(
            "text-sm font-medium",
            billingCycle === "monthly"
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={billingCycle === "yearly"}
          onClick={() => setBillingCycle("yearly")}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            billingCycle === "yearly" ? "bg-primary" : "bg-input"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition-transform",
              billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
        <span
          className={cn(
            "text-sm font-medium",
            billingCycle === "yearly"
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          Yearly
          <span className="ml-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Save 25%
          </span>
        </span>
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-auto max-w-md rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground mb-8">
          {error}
        </div>
      )}

      {/* Pricing cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        {/* Free Tier */}
        <div
          className={cn(
            "relative rounded-md border bg-card p-8 shadow-sm",
            currentTier === "free" && "ring-2 ring-primary"
          )}
        >
          {currentTier === "free" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
              Current plan
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {FREE_TIER.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {FREE_TIER.description}
            </p>
          </div>

          <div className="mb-8">
            <span className="font-display text-4xl font-bold text-foreground">
              {FREE_TIER.priceMonthly}
            </span>
            <span className="text-sm text-muted-foreground">
              /month
            </span>
          </div>

          <ul className="space-y-4 mb-8">
            {FREE_TIER.features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-3">
                {feature.value ? (
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                ) : (
                  <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border border-border" />
                )}
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {feature.name}
                  </span>
                  {feature.limit && (
                    <p className="text-sm text-muted-foreground">
                      {feature.limit}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {currentTier === "free" ? (
            <button
              disabled
              className="flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 opacity-60 cursor-not-allowed"
            >
              Current plan
            </button>
          ) : (
            <button
              onClick={() => handleDowngrade()}
              disabled={processing === "free"}
              className="flex w-full items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {processing === "free" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Downgrade to Free
            </button>
          )}
        </div>

        {/* Pro Tier */}
        <div
          className={cn(
            "relative rounded-md border bg-card p-8 shadow-sm",
            currentTier === "pro" && "ring-2 ring-primary"
          )}
        >
          {PRO_TIER.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
              Most popular
            </div>
          )}
          {currentTier === "pro" && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
              Current plan
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {PRO_TIER.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {PRO_TIER.description}
            </p>
          </div>

          <div className="mb-8">
            <span className="font-display text-4xl font-bold text-foreground">
              {billingCycle === "monthly"
                ? PRO_TIER.priceMonthly
                : PRO_TIER.priceYearly}
            </span>
            <span className="text-sm text-muted-foreground">
              /{billingCycle === "monthly" ? "month" : "year"}
            </span>
            {billingCycle === "yearly" && (
              <p className="mt-1 text-xs text-primary font-medium">
                {PRO_TIER.yearlySavings}
              </p>
            )}
          </div>

          <ul className="space-y-4 mb-8">
            {PRO_TIER.features.map((feature) => (
              <li key={feature.name} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {feature.name}
                  </span>
                  {feature.limit && (
                    <p className="text-sm text-muted-foreground">
                      {feature.limit}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {currentTier === "pro" ? (
            <button
              disabled
              className="flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 opacity-60 cursor-not-allowed"
            >
              Current plan
            </button>
          ) : (
            <button
              onClick={() => handleUpgrade("pro", billingCycle)}
              disabled={processing === "pro"}
              className="flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {processing === "pro" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {billingCycle === "yearly"
                ? `Upgrade to Pro — ${PRO_TIER.priceYearly}/yr`
                : `Upgrade to Pro — ${PRO_TIER.priceMonthly}/mo`}
            </button>
          )}
        </div>
      </div>

      {/* Comparison table */}
      <div className="mt-16 overflow-hidden rounded-md border border-border bg-card">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Feature comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                  Feature
                </th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">
                  Free
                </th>
                <th className="px-6 py-3 text-center font-medium text-muted-foreground">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-6 py-4 text-foreground font-medium">
                  Lye Calculator
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="mx-auto h-4 w-4 text-primary" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="mx-auto h-4 w-4 text-primary" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-foreground font-medium">
                  SAP Values
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="mx-auto h-4 w-4 text-primary" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="mx-auto h-4 w-4 text-primary" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-foreground font-medium">
                  Recipes
                </td>
                <td className="px-6 py-4 text-center text-muted-foreground">
                  3
                </td>
                <td className="px-6 py-4 text-center text-primary font-medium">
                  Unlimited
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-foreground font-medium">
                  Active Batches
                </td>
                <td className="px-6 py-4 text-center text-muted-foreground">
                  1
                </td>
                <td className="px-6 py-4 text-center text-primary font-medium">
                  Unlimited
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-foreground font-medium">
                  Cure Tracking
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="mx-auto h-4 w-4 rounded-full border border-border" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="mx-auto h-4 w-4 text-primary" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-foreground font-medium">
                  Cost Analysis
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="mx-auto h-4 w-4 rounded-full border border-border" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="mx-auto h-4 w-4 text-primary" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-foreground font-medium">
                  Recipe Library
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="mx-auto h-4 w-4 rounded-full border border-border" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="mx-auto h-4 w-4 text-primary" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-foreground font-medium">
                  Batch History
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="mx-auto h-4 w-4 rounded-full border border-border" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="mx-auto h-4 w-4 text-primary" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-foreground font-medium">
                  Priority Support
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="mx-auto h-4 w-4 rounded-full border border-border" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="mx-auto h-4 w-4 text-primary" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-2">
            Can I switch plans anytime?
          </h3>
          <p className="text-sm text-muted-foreground">
            Yes. You can upgrade from Free to Pro at any time. Downgrades take
            effect at the end of your current billing period.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-2">
            Is there a free trial?
          </h3>
          <p className="text-sm text-muted-foreground">
            The Free tier includes the full calculator plus 3 recipes and 1
            active batch — no trial needed to get started.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-2">
            Cancel anytime?
          </h3>
          <p className="text-sm text-muted-foreground">
            Yes. Cancel your Pro subscription and your access continues until
            the end of the billing period. No cancellation fees.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-2">
            Secure payments?
          </h3>
          <p className="text-sm text-muted-foreground">
            Payments are processed securely through Dodo Payments. We never
            store your payment details on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}