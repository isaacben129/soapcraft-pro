import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { calculateFormulation } from "@/lib/calculations/sap";
import { authOptions } from "@/lib/auth";

const features = [
  {
    name: "Recipe Builder",
    description:
      "Deterministic formulation with verified calculations. Select oils, set percentages, and get lye, water, and property ranges in milliseconds.",
    icon: "⚗️",
  },
  {
    name: "Batch Log + Making Mode",
    description:
      "Guided CP batch production with structured logging. Step-by-step checklist, persistent timers, and safety warnings.",
    icon: "📋",
  },
  {
    name: "Cure Tracker",
    description:
      "Estimated cure windows with honest progress tracking. Log observations, get reminders, and mark completion when ready.",
    icon: "⏳",
  },
  {
    name: "Cost Per Batch / Per Bar",
    description:
      "Ingredient cost catalogue with real-time cost calculation. Know your cost per bar and set target prices with margin visibility.",
    icon: "💰",
  },
];

const workflow = [
  {
    step: "01",
    title: "Build a recipe",
    description: "Select oils, set percentages, and get verified calculations instantly.",
    cta: "Start building",
    href: "/auth/signup",
  },
  {
    step: "02",
    title: "Make the batch",
    description: "Guided CP production with step-by-step checklist, timers, and safety warnings.",
    cta: "Start a batch",
    href: "/auth/signup",
  },
  {
    step: "03",
    title: "Track the cure",
    description: "Monitor progress with honest estimated windows and observation logging.",
    cta: "Track a cure",
    href: "/auth/signup",
  },
  {
    step: "04",
    title: "Price it out",
    description: "Know your cost per bar and set target prices with margin visibility.",
    cta: "Calculate cost",
    href: "/auth/signup",
  },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  const demoResult = calculateFormulation({
    oilBlend: [
      { oilId: "olive-oil", percent: 60 },
      { oilId: "coconut-oil", percent: 30 },
      { oilId: "shea-butter", percent: 10 },
    ],
    superfatPercent: 5,
    lyeConcentrationPercent: 33,
    waterToLyeRatio: 2.03,
    fragranceLoadPercent: 3,
  });

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              The soap maker&apos;s workspace
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
              Deterministic lye calculations, guided batch production, cure tracking,
              and cost-per-bar analysis. Not a calculator — a workspace.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                Start building
              </a>
              <a
                href="/marketing/pricing"
                className="inline-flex items-center justify-center rounded-md border border-border px-8 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
              >
                View pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
              See it calculate
            </h2>
            <p className="mt-4 text-center text-muted-foreground">
              Deterministic. Instant. Verified against SoapCalc.
            </p>
            <div className="mt-8 rounded-lg bg-background border border-border p-6 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{demoResult.lyeNaOH.toFixed(2)}g</div>
                  <div className="text-sm text-muted-foreground mt-1">Lye (NaOH)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{demoResult.water.toFixed(0)}g</div>
                  <div className="text-sm text-muted-foreground mt-1">Water</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{demoResult.fragranceLoad.toFixed(0)}g</div>
                  <div className="text-sm text-muted-foreground mt-1">Fragrance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{demoResult.totalWeight.toFixed(0)}g</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Weight</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
            Everything in one workspace
          </h2>
          <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
            Recipe Builder, Batch Log, Cure Tracker, and Costing — all connected,
            all in one flow. No switching between tools.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.name} className="rounded-lg border border-border bg-background p-6 shadow-sm">
                <div className="text-2xl mb-3" aria-hidden="true">{feature.icon}</div>
                <h3 className="font-display text-lg font-semibold text-foreground">{feature.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
              From recipe to sale
            </h2>
            <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
              One workspace. Four connected modules. No scattered tools, no manual
              handoffs.
            </p>
            <div className="mt-12 space-y-8">
              {workflow.map((step) => (
                <div key={step.step} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="font-display font-bold text-primary text-lg">{step.step}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    <a
                      href={step.href}
                      className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      {step.cta} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Start free, upgrade when you&apos;re ready
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            The calculator is always free. Pro adds unlimited recipes, batches,
            cure tracking, and cost analysis.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Get started free
            </a>
            <a
              href="/marketing/pricing"
              className="inline-flex items-center justify-center rounded-md border border-border px-8 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
            >
              View pricing
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
