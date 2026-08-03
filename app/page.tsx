import { calculateFormulation, DEFAULT_OILS } from "@/lib/calculations/sap";

const workflow = [
  {
    step: "01",
    title: "Build a recipe",
    description: "Select oils, set percentages, and get verified calculations in seconds.",
    href: "/recipes/new",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Make the batch",
    description: "Follow Making Mode step-by-step — weigh, mix, trace, pour.",
    href: "/batches",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Track the cure",
    description: "Log observations, monitor progress, and know when it is ready.",
    href: "/cure",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Know the cost",
    description: "Ingredient costs per batch and per bar — with target pricing.",
    href: "/costing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

const demo = calculateFormulation({
  oilBlend: [
    { oilId: "olive-oil", percent: 60 },
    { oilId: "coconut-oil", percent: 30 },
    { oilId: "shea-butter", percent: 10 },
  ],
  superfatPercent: 8,
  lyeConcentrationPercent: 33,
  waterToLyeRatio: 2.5,
  fragranceLoadPercent: 3,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2 font-display font-bold tracking-tight text-lg">
            <span className="text-2xl">🧼</span>
            <span>SoapCraft Pro</span>
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">Recipes</a>
            <a href="/batches" className="text-muted-foreground hover:text-foreground transition-colors">Batches</a>
            <a href="/cure" className="text-muted-foreground hover:text-foreground transition-colors">Cure</a>
            <a href="/costing" className="text-muted-foreground hover:text-foreground transition-colors">Costing</a>
            <a href="/library" className="text-muted-foreground hover:text-foreground transition-colors">Library</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Workspace dashboard — not a feature list */}
        <section className="container mx-auto px-4 py-16 max-w-5xl">
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground leading-tight">
              Your soap workspace
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Formulate, produce, track, and cost — one unified workspace from first pour to final bar.
            </p>
          </div>

          {/* Live demo — the moment of truth */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">Live calculation</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Deterministic &lt;100ms</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                60% Olive + 30% Coconut + 10% Shea Butter, 8% superfat, 33% lye, 2.5:1 water
              </p>
              <dl className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <dt className="text-label text-muted-foreground">Lye NaOH</dt>
                  <dd className="font-display text-3xl font-bold text-primary">{demo.lyeNaOH}g</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-label text-muted-foreground">Water</dt>
                  <dd className="font-display text-3xl font-bold text-primary">{demo.water}g</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-label text-muted-foreground">Fragrance Load</dt>
                  <dd className="font-display text-3xl font-bold text-primary">{demo.fragranceLoad}g</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-label text-muted-foreground">Warnings</dt>
                  <dd className="font-display text-3xl font-bold text-primary">{demo.warnings.length}</dd>
                </div>
              </dl>
              <div className="mt-8 pt-6 border-t border-border">
                <a
                  href="/recipes/new"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-primary-foreground font-medium text-sm tracking-wide transition-opacity hover:opacity-90 shadow-sm"
                >
                  Start building
                </a>
              </div>
            </div>
          </div>

          {/* Workflow — unified progression, not feature cards */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-bold tracking-tight mb-8 text-foreground">The workflow</h2>
            <ol className="space-y-6">
              {workflow.map((step, i) => (
                <li key={step.step} className="flex gap-5 items-start group">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {step.step}
                    </span>
                    {i < workflow.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-2 min-h-[24px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                    <a
                      href={step.href}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      {step.step === "01" ? "Create your first recipe" : step.step === "02" ? "Start a new batch" : step.step === "03" ? "Track your cure" : "Calculate cost per bar"}
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA strip */}
        <section className="bg-muted/50 border-y border-border">
          <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight mb-3 text-foreground">Free to start, Pro to scale</h2>
            <p className="text-sm text-muted-foreground mb-6">Calculator, 3 recipes, 1 active batch — no signup required.</p>
            <a
              href="/recipes/new"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-primary-foreground font-medium text-sm tracking-wide transition-opacity hover:opacity-90 shadow-sm"
            >
              Start building
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">SoapCraft Pro — Deterministic calculations, not AI guesswork.</p>
          <p className="text-sm text-muted-foreground">Free tier: calculator + 3 recipes + 1 active batch</p>
        </div>
      </footer>
    </div>
  );
}