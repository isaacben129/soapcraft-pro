import { calculateFormulation, DEFAULT_OILS } from "@/lib/calculations/sap";

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero */}
      <section className="max-w-2xl mx-auto text-center mb-20">
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground leading-tight">
          Build better soap with verified calculations
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
          SoapCraft Pro gives you deterministic lye math, batch tracking,
          cure monitoring, and cost-per-bar analysis — all in one workspace.
        </p>
        <a
          href="/recipes/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-primary-foreground font-medium text-sm tracking-wide transition-opacity hover:opacity-90"
        >
          Start building
        </a>
      </section>

      {/* Workflow */}
      <section className="max-w-2xl mx-auto mb-20">
        <h2 className="font-display text-2xl font-semibold mb-10 text-foreground">The workflow</h2>
        <ol className="space-y-6">
          <li className="flex gap-4 items-start">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
              1
            </span>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Select your oils</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Set percentages from a library of 150+ oils with full fatty acid profiles.</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
              2
            </span>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Get verified calculations</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Instant lye, water, and property predictions — deterministic, not AI-generated.</p>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
              3
            </span>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Track and cost your batch</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Log the batch, monitor cure progress, and know your cost per bar before you pour.</p>
            </div>
          </li>
        </ol>
      </section>

      {/* Demo calculation */}
      <section className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl font-semibold mb-6 text-foreground">Live calculation</h2>
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground mb-6">
            60% Olive + 30% Coconut + 10% Shea Butter, 8% superfat, 33% lye, 2.5:1 water
          </p>
          <dl className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <dt className="text-muted-foreground text-label">Lye NaOH</dt>
              <dd className="font-display text-2xl font-bold text-foreground">{demo.lyeNaOH}g</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground text-label">Water</dt>
              <dd className="font-display text-2xl font-bold text-foreground">{demo.water}g</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground text-label">Fragrance Load</dt>
              <dd className="font-display text-2xl font-bold text-foreground">{demo.fragranceLoad}g</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground text-label">Warnings</dt>
              <dd className="font-display text-2xl font-bold text-foreground">{demo.warnings.length}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
