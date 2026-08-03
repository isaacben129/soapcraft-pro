import { calculateFormulation, DEFAULT_OILS } from "@/lib/calculations/sap";

const features = [
  {
    name: "Recipe Builder",
    description: "Deterministic formulation with verified calculations. 150+ oils, full fatty acid profiles, property predictions, and batch scaling.",
    href: "/recipes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    name: "Batch Log + Making Mode",
    description: "Guided CP batch production with structured logging. Timers, temperature tracking, and step-by-step checklists.",
    href: "/batches",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    name: "Cure Tracker",
    description: "Estimated cure window with observation logging. Honest estimates, not AI predictions — you decide when it's done.",
    href: "/cure",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    name: "Cost Per Batch / Per Bar",
    description: "Ingredient cost catalogue with per-batch and per-bar costing. Know what each bar costs before you pour.",
    href: "/costing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

export default function Home() {
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
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground leading-tight">
              Build better soap with verified calculations
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              Deterministic lye math, batch tracking, cure monitoring, and cost-per-bar analysis — all in one workspace.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="/recipes/new"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-primary-foreground font-medium text-sm tracking-wide transition-opacity hover:opacity-90 shadow-sm"
              >
                Start building
              </a>
              <a
                href="/recipes"
                className="inline-flex items-center justify-center rounded-md border border-border px-8 py-3 text-foreground font-medium text-sm tracking-wide transition-opacity hover:bg-muted"
              >
                Browse recipes
              </a>
            </div>
          </div>

          {/* Live calculation preview */}
          <div className="max-w-2xl mx-auto mb-20">
            <div className="rounded-lg border border-border bg-card p-8 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">Demo calculation</h2>
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
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="bg-muted/50 border-y border-border">
          <div className="container mx-auto px-4 py-20 max-w-4xl">
            <h2 className="font-display text-3xl font-bold tracking-tight mb-4 text-foreground">Everything you need</h2>
            <p className="text-muted-foreground mb-12 max-w-lg">A complete workspace for soap making — from formulation to cost analysis.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <a
                  key={feature.name}
                  href={feature.href}
                  className="group rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feature.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="container mx-auto px-4 py-20 max-w-4xl">
          <h2 className="font-display text-3xl font-bold tracking-tight mb-4 text-foreground">How it works</h2>
          <p className="text-muted-foreground mb-12 max-w-lg">Three steps from idea to finished bar.</p>
          <ol className="space-y-8">
            <li className="flex gap-6 items-start">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                1
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Select your oils</h3>
                <p className="text-muted-foreground leading-relaxed">Choose from 150+ oils with full fatty acid profiles. Set percentages and watch the calculations update instantly.</p>
              </div>
            </li>
            <li className="flex gap-6 items-start">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                2
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Get verified calculations</h3>
                <p className="text-muted-foreground leading-relaxed">Deterministic lye, water, and property predictions — no AI guesswork, no surprises.</p>
              </div>
            </li>
            <li className="flex gap-6 items-start">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                3
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Track and cost your batch</h3>
                <p className="text-muted-foreground leading-relaxed">Log the batch, follow Making Mode step-by-step, monitor cure progress, and know your cost per bar.</p>
              </div>
            </li>
          </ol>
        </section>

        {/* CTA */}
        <section className="bg-muted/50 border-y border-border">
          <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight mb-4 text-foreground">Ready to build?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Start with the calculator — free, no signup, no limits on the basic tools.</p>
            <a
              href="/recipes/new"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-primary-foreground font-medium text-sm tracking-wide transition-opacity hover:opacity-90 shadow-sm"
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