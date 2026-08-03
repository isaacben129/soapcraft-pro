import { Suspense } from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PricingPage } from "@/components/subscription/pricing-page";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Check } from "lucide-react";

async function getCurrentTier() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return "free";
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  return (user?.subscriptionTier as string) || "free";
}

export const metadata = {
  title: "Subscription — SoapCraft Pro",
  description:
    "Manage your SoapCraft Pro subscription. Choose between Free and Pro tiers.",
};

export default async function SubscriptionPage() {
  const currentTier = await getCurrentTier();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2 font-display font-bold tracking-tight">
            <span className="text-xl">🧼</span>
            <span>SoapCraft Pro</span>
          </a>
          <nav className="flex items-center gap-1 text-sm" aria-label="Workflow navigation">
            <a href="/recipes" className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Recipes</a>
            <span className="text-border mx-1">/</span>
            <a href="/batches" className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Batches</a>
            <span className="text-border mx-1">/</span>
            <a href="/cure" className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Cure</a>
            <span className="text-border mx-1">/</span>
            <a href="/costing" className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Costing</a>
            <span className="text-border mx-1">/</span>
            <a href="/subscription" className="px-3 py-1.5 rounded-md text-foreground bg-muted font-medium">Subscription</a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Subscription
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your plan and billing. Upgrade to Pro for unlimited recipes, batches, and full access.
          </p>
        </div>

        {/* Current tier badge */}
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase">
            {currentTier === "pro" ? "Pro" : "Free"}
          </span>
          <span className="text-sm text-muted-foreground">
            {currentTier === "pro"
              ? "You have access to all Pro features"
              : "Upgrade to unlock unlimited recipes and batches"}
          </span>
        </div>

        {/* Pricing page with tier context */}
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
          <PricingPage currentTier={currentTier} />
        </Suspense>

        {/* Tier details section */}
        <div className="mt-16 rounded-md border border-border bg-card p-8">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Tier details
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Free Tier Details */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm">🧼</span>
                Free Tier
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Full lye calculator with SAP verification
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Save up to 3 recipes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  1 active batch at a time
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Basic cure tracking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  No credit card required
                </li>
              </ul>
            </div>

            {/* Pro Tier Details */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm">⚡</span>
                Pro Tier
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Everything in Free, plus…
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Unlimited recipes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Unlimited active batches
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Full cure tracking dashboard
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Cost analysis per batch &amp; per bar
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Recipe library with search
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Full batch history
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Priority support
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison table section */}
        <div className="mt-16">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Comparison table
          </h2>
          <div className="overflow-hidden rounded-md border border-border bg-card">
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
                    Price
                  </td>
                  <td className="px-6 py-4 text-center text-muted-foreground">
                    $0/mo
                  </td>
                  <td className="px-6 py-4 text-center text-foreground font-medium">
                    $12/mo or $99/yr
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-foreground font-medium">
                    Calculator
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

        {/* Upgrade/Downgrade actions */}
        <div className="mt-16 flex flex-col items-center gap-4 rounded-md border border-border bg-card p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Ready to upgrade?
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            {currentTier === "free"
              ? "Upgrade to Pro and get unlimited recipes, batches, and full access to all features."
              : "You&apos;re on the Pro plan. You can downgrade to Free at any time."}
          </p>
          <div className="flex gap-4">
            {currentTier === "free" ? (
              <a
                href="/subscription"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 shadow-sm"
              >
                Upgrade to Pro
              </a>
            ) : (
              <>
                <a
                  href="/subscription"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 shadow-sm"
                >
                  Manage Plan
                </a>
                <a
                  href="/subscription"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
                >
                  Downgrade
                </a>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>SoapCraft Pro — Deterministic calculations, not AI guesswork.</p>
          <p className="mt-1">Questions? Contact support@soapcraft.pro</p>
        </div>
      </footer>
    </div>
  );
}