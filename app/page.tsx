import { calculateFormulation, DEFAULT_OILS } from "@/lib/calculations/sap";

export default function Home() {
  // Demo calculation
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
    <div className="container mx-auto px-4 py-8">
      <section className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Build better soap with verified calculations
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          SoapCraft Pro gives you deterministic lye math, batch tracking,
          cure monitoring, and cost-per-bar analysis — all in one workspace.
        </p>
        <a
          href="/recipes/new"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Get Started
        </a>
      </section>

      <section className="max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6">How it works</h2>
        <ol className="space-y-4 text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
              1
            </span>
            <span>Select your oils and set percentages</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
              2
            </span>
            <span>Get verified lye, water, and property calculations instantly</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
              3
            </span>
            <span>Log your batch, track cure, and know your cost per bar</span>
          </li>
        </ol>
      </section>

      <section className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Demo Calculation</h2>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-4">
            60% Olive + 30% Coconut + 10% Shea Butter, 8% superfat, 33% lye, 2.5:1 water
          </p>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Lye NaOH</dt>
              <dd className="font-medium">{demo.lyeNaOH}g</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Water</dt>
              <dd className="font-medium">{demo.water}g</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Fragrance Load</dt>
              <dd className="font-medium">{demo.fragranceLoad}g</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Warnings</dt>
              <dd className="font-medium">{demo.warnings.length}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
