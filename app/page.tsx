import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Beaker,
  BookOpen,
  Check,
  ClipboardList,
  Coins,
  FlaskConical,
  LineChart,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { JsonLd } from "@/components/shared";
import { faqSchema } from "@/lib/seo/structured-data";
import { SITE_URL } from "@/lib/seo/site-url";

export const metadata: Metadata = {
  title: "SoapCraft Pro | Soap Recipe Calculator, Batch Tracker & Cost Tools",
  description:
    "Free soapmaking tools for formulation, lye calculations, batch planning, cure tracking, ingredient costing, and selling-price decisions. Start without an account.",
  keywords: [
    "soap recipe calculator",
    "lye calculator",
    "soap batch tracker",
    "soap cost per bar calculator",
    "cold process soapmaking tools",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "SoapCraft Pro | A clearer way to make, track, and cost soap",
    description:
      "Formulate, calculate, plan, cure, cost, and review soap batches in one connected workspace. Free tools, no account required to start.",
    type: "website",
    url: SITE_URL,
    siteName: "SoapCraft Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoapCraft Pro | Soapmaking tools that keep the batch together",
    description:
      "Free formulation, lye, batch, cure, inventory, and cost tools for soap makers.",
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "Is SoapCraft Pro a free soap recipe calculator?",
    answer:
      "Yes. SoapCraft Pro is being launched as an anonymous-first free utility hub. You can use the public tools without creating an account. The tools are designed to cover more than lye arithmetic: formulate a blend, size a batch, estimate cost per bar, plan production, and carry the context into the next decision.",
  },
  {
    question: "Can I use SoapCraft Pro instead of SoapCalc?",
    answer:
      "SoapCalc is a useful reference for lye calculations. SoapCraft Pro is designed around the work that comes before and after the calculation: recipe versions, batch quantities, actual measurements, cure observations, yield, inventory, and cost. It is not presented as a claim that every calculation source is identical; chemistry records remain source-reviewed and fail-closed until approved.",
  },
  {
    question: "Does SoapCraft Pro require an account?",
    answer:
      "No account is required to begin with the public tools. The current launch is intentionally anonymous-first. Local persistence and shareable context can support a working session, while account sync and cloud persistence remain separate capabilities that will only be introduced when their security and product boundaries are ready.",
  },
  {
    question: "How does SoapCraft Pro handle lye safety?",
    answer:
      "The product treats lye calculation as a safety-sensitive function. Inputs are validated, purity and water modes are explicit, and unapproved chemistry data is not allowed to silently power public calculations. You remain responsible for checking your materials, protective equipment, workspace, method, and finished soap before use.",
  },
  {
    question: "What can I calculate besides lye?",
    answer:
      "The utility hub includes batch sizing, unit conversion, oil and ingredient economics, price and margin calculations, break-even analysis, production planning, cure planning, purchasing, inventory, recipe versions, and shareable recipe context. Each tool is intended to be useful on its own and more useful when connected to the others.",
  },
  {
    question: "Does the calculator use AI to invent a recipe?",
    answer:
      "No. AI may help maintain the product, explain documentation, or identify missing evidence, but it should not invent chemical quantities. The calculation path is deterministic: the same approved inputs and dataset revision should produce the same result, with warnings shown rather than hidden.",
  },
];

const toolGroups = [
  {
    icon: FlaskConical,
    title: "Formulate with context",
    text: "Start with oils, percentages, target oil weight, superfat or lye discount, alkali choice, purity, water mode, fragrance, and additives. The point is not to bury you in settings. It is to make the assumptions visible before you commit a batch to paper or a scale.",
    links: [
      ["Soap recipe calculator", "/tools/recipe-calculator"],
      ["Lye calculator", "/tools/lye-calculator"],
      ["Oil percentage calculator", "/tools/oil-percentage-calculator"],
    ],
  },
  {
    icon: Scale,
    title: "Size without rebuilding",
    text: "A formula is not finished when the percentages add to one hundred. You still need weights for a mold, a target oil mass, a bar count, or a production run. SoapCraft Pro lets you carry the blend into a batch size and keeps the relationship between the formulation and the resulting weights readable.",
    links: [
      ["Batch size calculator", "/tools/batch-size-calculator"],
      ["Unit converter", "/tools/unit-converter"],
      ["Mold volume calculator", "/tools/mold-volume-calculator"],
    ],
  },
  {
    icon: Coins,
    title: "Know the economics",
    text: "Ingredient cost is not the same as selling price, and markup is not the same as margin. Use the cost tools to separate total batch cost, saleable yield, cost per bar, contribution, markup, gross margin, and target price. That separation makes a small soap business easier to reason about.",
    links: [
      ["Soap cost per bar calculator", "/calculators/soap-cost-calculator"],
      ["Selling price calculator", "/tools/selling-price-calculator"],
      ["Break-even calculator", "/tools/break-even-calculator"],
    ],
  },
  {
    icon: ClipboardList,
    title: "Carry the batch through production",
    text: "A plan becomes useful when it survives contact with the workbench. Record what you intended to weigh, what you actually weighed, which version produced the batch, when the batch entered cure, and what you observed. This is the difference between a recipe file and a production record.",
    links: [
      ["Production planner", "/tools/production-planner"],
      ["Cure planner", "/tools/cure-planner"],
      ["Inventory planner", "/tools/inventory-planner"],
    ],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd data={faqSchema(faqs)} />

      <section className="border-b border-border bg-background" aria-labelledby="hero-title">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:px-10 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Soapmaking tools for the whole batch</p>
            <h1 id="hero-title" className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-foreground md:text-7xl">Make the recipe once. Keep the batch together.</h1>
            <p className="mt-8 max-w-2xl text-xl leading-9 text-muted-foreground">SoapCraft Pro is a free, anonymous-first workspace for people who formulate, make, cure, price, and learn from their own soap. Use the calculator when you need the math. Use the connected tools when you need the record to survive the rest of the process.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/tools" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90">Explore the free tools <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/tools/recipe-calculator" className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3.5 font-semibold text-foreground transition hover:bg-muted">Start a recipe</Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">No account required to begin. No credit card. No need to hand your formulation to an AI just to get a number.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm" aria-label="A connected batch record example">
            <div className="flex items-center justify-between border-b border-border pb-5"><span className="text-sm font-semibold text-foreground">Batch record 024</span><span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Cold process</span></div>
            <div className="grid grid-cols-3 gap-4 border-b border-border py-6 text-sm"><div><span className="block text-muted-foreground">Recipe</span><strong>Version 3</strong></div><div><span className="block text-muted-foreground">Cure</span><strong>Day 18 / 42</strong></div><div><span className="block text-muted-foreground">Yield</span><strong>10 bars</strong></div></div>
            <div className="space-y-4 py-6 text-sm"><div className="flex justify-between"><span>Oil blend</span><span className="font-mono text-muted-foreground">1,000 g</span></div><div className="flex justify-between"><span>Lye and water</span><span className="font-mono text-muted-foreground">planned</span></div><div className="flex justify-between"><span>Actual measurements</span><span className="font-mono text-muted-foreground">recorded</span></div><div className="flex justify-between"><span>Cost per bar</span><span className="font-mono font-semibold">$1.25</span></div></div>
            <div className="flex items-center gap-2 border-t border-border pt-5 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> Inputs, assumptions, and changes stay visible.</div>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-6xl px-6 md:px-10">
        <section className="grid gap-10 border-b border-border py-20 md:grid-cols-[0.7fr_1.3fr] md:py-28" aria-labelledby="problem-title">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">The problem</p><h2 id="problem-title" className="mt-4 text-4xl font-semibold leading-tight tracking-tight">A soap batch is more than a recipe.</h2></div>
          <div className="space-y-6 text-lg leading-9 text-muted-foreground"><p>A recipe tells you what you planned to do. It does not automatically tell you what happened. It does not remember which version you used after you changed the coconut percentage. It does not preserve the actual oil weight when the scale stopped at 998 grams. It does not remind you which batch needs an observation, which bars survived the cure, or whether your selling price covers the real yield.</p><p>That missing continuity is where the practical work becomes fragile. Makers copy numbers between a lye calculator, a notebook, a spreadsheet, a timer, an inventory list, and a pricing formula. Every handoff is an opportunity to lose a unit, forget a purity assumption, overwrite a recipe, or mistake a markup for a margin. The tools may each be useful. The system around them is what is usually missing.</p><p>SoapCraft Pro is built around that gap. It treats formulation, production, cure, yield, and economics as connected stages of one batch lifecycle. You can still use a single calculator and leave. But if you keep going, the next tool starts with the context you already created instead of asking you to reconstruct it.</p></div>
        </section>

        <section className="border-b border-border py-20 md:py-28" aria-labelledby="tools-title">
          <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">The free utility hub</p><h2 id="tools-title" className="mt-4 text-4xl font-semibold leading-tight tracking-tight">One place for the decisions around the calculation.</h2><p className="mt-6 text-lg leading-9 text-muted-foreground">The homepage is not a wall of disconnected features. Each group below answers a different question in the soapmaking workflow. Open the tool you need now, then carry the result into the next decision.</p></div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">{toolGroups.map((group) => { const Icon = group.icon; return <section key={group.title} className="rounded-xl border border-border bg-card p-7" aria-labelledby={group.title.replaceAll(" ", "-")}><Icon className="h-7 w-7 text-primary" /><h3 id={group.title.replaceAll(" ", "-")} className="mt-6 text-2xl font-semibold">{group.title}</h3><p className="mt-4 leading-8 text-muted-foreground">{group.text}</p><ul className="mt-6 space-y-3">{group.links.map(([label, href]) => <li key={href}><Link className="inline-flex items-center gap-2 font-medium text-primary hover:underline" href={href}>{label}<ArrowRight className="h-4 w-4" /></Link></li>)}</ul></section>; })}</div>
        </section>

        <section className="grid gap-12 border-b border-border py-20 md:grid-cols-2 md:py-28" aria-labelledby="calculation-title">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Calculation discipline</p><h2 id="calculation-title" className="mt-4 text-4xl font-semibold leading-tight tracking-tight">The number should explain its assumptions.</h2><div className="mt-8 space-y-5 text-lg leading-9 text-muted-foreground"><p>Lye calculation is not a place for a hidden default. The oil mass, oil percentages, saponification data, alkali selection, purity, discount, and water mode all affect the result. SoapCraft Pro is designed so those inputs can be inspected rather than inferred after the fact.</p><p>NaOH-only, KOH-only, and mixed-alkali recipes are treated as distinct choices. A mixed-alkali control describes the KOH share of pure alkali equivalents, not a casual percentage of the final weighed powders. Purity correction happens after the lye discount. Water can be expressed as a ratio, a concentration, or a percentage of oils, but only the selected mode is allowed to determine the result.</p><p>That is a product behavior, not marketing language. The engine validates boundaries, computes deterministically, and exposes warnings when the inputs cannot support a trustworthy answer.</p></div></div>
          <div className="rounded-xl border border-border bg-muted p-8"><div className="flex items-center gap-3"><Beaker className="h-6 w-6 text-primary" /><h3 className="text-xl font-semibold">A transparent release boundary</h3></div><ul className="mt-8 space-y-5 text-muted-foreground"><li className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-primary" /><span>Ingredient records carry source, method, date, status, and reviewer state.</span></li><li className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-primary" /><span>Standards-based ranges are kept separate from nominal computational values.</span></li><li className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-primary" /><span>Unapproved chemistry remains blocked instead of quietly falling back to a legacy estimate.</span></li><li className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-primary" /><span>Independent fixtures test conversion, purity, mixed alkali, and all water modes.</span></li></ul><Link href="/methodology" className="mt-8 inline-flex items-center gap-2 font-medium text-primary hover:underline">Read the calculation methodology <ArrowRight className="h-4 w-4" /></Link></div>
        </section>

        <section className="grid gap-12 border-b border-border py-20 md:grid-cols-[1.2fr_0.8fr] md:py-28" aria-labelledby="record-title">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">From plan to evidence</p><h2 id="record-title" className="mt-4 text-4xl font-semibold leading-tight tracking-tight">A production record is how your next batch gets better.</h2><div className="mt-8 space-y-6 text-lg leading-9 text-muted-foreground"><p>When you make soap regularly, memory becomes an unreliable database. You remember that a batch was soft, but not whether it was cut on day two or day four. You remember that the scent was strong, but not how much fragrance you actually used. You remember a bar that sold well, but not whether the price covered packaging and the bars that never made it to the table.</p><p>SoapCraft Pro gives those observations a place beside the formulation. A recipe version can be treated as the plan. A batch can inherit that plan without being rewritten when the recipe changes later. Actual measurements can be recorded against planned measurements. Cure observations can be structured around dates, hardness, temperature, appearance, and notes. Final yield can feed cost per bar rather than leaving economics based on an optimistic theoretical count.</p><p>The goal is not to turn a creative craft into paperwork. The goal is to make the paperwork useful enough that it returns value. A production record should help you repeat what worked, identify what changed, and make the next decision with evidence instead of a vague memory.</p></div></div>
          <div className="space-y-4"><div className="rounded-xl border border-border p-6"><BookOpen className="h-6 w-6 text-primary" /><h3 className="mt-4 text-xl font-semibold">Cure observations</h3><p className="mt-3 leading-7 text-muted-foreground">Track what you saw and when you saw it. A reminder is not a safety verdict, and the maker remains responsible for evaluating the finished soap.</p></div><div className="rounded-xl border border-border p-6"><LineChart className="h-6 w-6 text-primary" /><h3 className="mt-4 text-xl font-semibold">Cost from actual yield</h3><p className="mt-3 leading-7 text-muted-foreground">Separate batch cost, saleable units, cost per unit, markup, contribution, and gross margin so your price decision has a clear basis.</p></div><div className="rounded-xl border border-border p-6"><ShieldCheck className="h-6 w-6 text-primary" /><h3 className="mt-4 text-xl font-semibold">Visible uncertainty</h3><p className="mt-3 leading-7 text-muted-foreground">If the source or status is not ready, the product should say so. Confidence is earned through evidence, not through a polished number.</p></div></div>
        </section>

        <section className="border-b border-border py-20 md:py-28" aria-labelledby="economics-title">
          <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">The economics of a bar</p><h2 id="economics-title" className="mt-4 text-4xl font-semibold leading-tight tracking-tight">Price from reality, not from ingredient cost alone.</h2><div className="mt-8 space-y-6 text-lg leading-9 text-muted-foreground"><p>Many soap pricing mistakes begin with a true number used in the wrong place. The oils cost $12, so the batch is priced from $12. The batch produces ten bars, so the cost is divided by ten. The maker adds twenty percent, calls it margin, and discovers later that packaging, failed bars, market fees, labor, and unsold inventory were never in the model.</p><p>SoapCraft Pro keeps these concepts separate. Ingredient and additive costs form the batch basis. Actual or expected saleable yield determines cost per bar. A markup answers one question: how much is added to cost. A gross margin answers another: what share of the selling price remains after cost. A break-even calculation answers a third: how many units or dollars are required before the fixed costs are recovered.</p><p>That separation does not tell you what your soap must cost. It gives you a better surface on which to make the decision. You can choose a price based on your market, positioning, packaging, labor, and customer relationship while seeing exactly what the price does to contribution and margin.</p></div></div>
        </section>

        <section className="border-b border-border py-20 md:py-28" aria-labelledby="safety-title"><div className="mx-auto max-w-4xl"><div className="flex items-center gap-3"><ShieldCheck className="h-7 w-7 text-primary" /><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Safety and responsibility</p></div><h2 id="safety-title" className="mt-5 text-4xl font-semibold leading-tight tracking-tight">A calculator is an instrument, not permission.</h2><div className="mt-8 space-y-6 text-lg leading-9 text-muted-foreground"><p>SoapCraft Pro can make arithmetic clearer. It cannot inspect your bottle of lye, verify that an oil is what its label says, judge whether your workspace is ventilated, or decide whether a finished bar is ready for use. Sodium hydroxide and potassium hydroxide are corrosive materials. Water and lye generate heat. A result on a screen does not replace protective equipment, careful weighing, correct storage, labeling, or a method appropriate to your experience.</p><p>The product therefore treats safety as a boundary around the calculation. Input validation is explicit. Chemistry status is visible. Public release is gated on evidence. When a record is not ready, the correct behavior is to block or label it, not to fill the gap with an authoritative-looking guess. Read the safety guidance before using a result, and independently check every formula against your materials and method.</p><Link href="/safety" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">Read the soapmaking safety guidance <ArrowRight className="h-4 w-4" /></Link></div></div></section>

        <section className="border-b border-border py-20 md:py-28" aria-labelledby="workflow-title">
          <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">A calmer workflow</p><h2 id="workflow-title" className="mt-4 text-4xl font-semibold leading-tight tracking-tight">The useful part is what happens between the tools.</h2></div>
            <div className="space-y-6 text-lg leading-9 text-muted-foreground"><p>Soapmaking has a rhythm that does not fit neatly inside one calculator screen. You research an ingredient, choose a formula, make a batch, wait through gel or cure, cut and trim the bars, count what is actually saleable, and then decide whether the recipe deserves another run. The information needed at each stage is connected, but most workflows make you carry it in your head.</p><p>That is why SoapCraft Pro is organized as a utility hub rather than a single oversized form. The formulation tool answers the chemistry question. The sizing tool answers the quantity question. The production view answers the workbench question. The cure view answers the calendar question. The costing tools answer the business question. None of those questions should erase the answer to the one before it.</p><p>You can use the tools in a lightweight way. Start with a calculation, copy the result, and leave. Or you can build a more durable working record using local persistence, recipe versions, batch context, production notes, and actual yield. The product does not require you to become an administrator before you can make a bar. It gives you more structure only when that structure begins paying for itself.</p><p>This matters for beginners because a clear sequence reduces avoidable confusion. It matters for experienced makers because repeated work is where small discrepancies become expensive. A batch that is off by a few grams may be harmless, meaningful, or a sign that the assumptions were not recorded. The tool cannot decide that for you, but it can make the discrepancy visible and give you a place to investigate it.</p><p>It also gives you a better way to explain a batch to another person. If a friend asks why the lye amount changed, you can point to the oil weight, alkali mode, purity, and discount rather than saying that the calculator gave you a different number. If a customer asks how many bars a run produced, the answer can come from the recorded yield rather than the original mold estimate. If you are teaching someone, the sequence makes the decisions visible without pretending that a tool removes the need for judgment. Clear records make collaboration easier because they reduce the amount of context one maker has to keep in their head.</p><p>The best result is not the most impressive number. It is a batch you can explain: which recipe version you used, which material assumptions were active, what you actually weighed, when the batch entered cure, how many usable bars it produced, and what you would change next time. That is the standard this product is being built around.</p></div>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-28" aria-labelledby="faq-title"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Questions before you start</p><h2 id="faq-title" className="mt-4 text-4xl font-semibold leading-tight tracking-tight">A practical tool should be clear about what it is.</h2><div className="mt-10 divide-y divide-border border-y border-border">{faqs.map((faq) => <details key={faq.question} className="group py-6"><summary className="cursor-pointer list-none pr-8 text-lg font-semibold marker:hidden">{faq.question}</summary><p className="mt-4 max-w-2xl leading-8 text-muted-foreground">{faq.answer}</p></details>)}</div></div></section>

        <section className="py-20 text-center md:py-28" aria-labelledby="cta-title"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Start with one useful decision</p><h2 id="cta-title" className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Calculate the batch you are actually about to make.</h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Open the free tools, choose the task in front of you, and keep the assumptions visible. You can start anonymously and decide later whether you need a longer-lived record.</p><div className="mt-9 flex flex-wrap justify-center gap-4"><Link href="/tools" className="inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 font-semibold text-primary-foreground hover:opacity-90">Browse all tools <ArrowRight className="h-4 w-4" /></Link><Link href="/methodology" className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-7 py-3.5 font-semibold hover:bg-muted">See how the calculations work</Link></div></section>
      </article>

      <footer className="border-t border-border bg-muted"><div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_0.6fr_0.6fr] md:px-10"><div><p className="text-xl font-semibold">SoapCraft Pro</p><p className="mt-4 max-w-md leading-7 text-muted-foreground">Free soapmaking tools for formulation, production, cure, inventory, and cost. Built to keep the batch understandable from the first percentage to the last bar.</p></div><div><p className="font-semibold">Tools</p><ul className="mt-4 space-y-3 text-sm text-muted-foreground"><li><Link href="/tools">All tools</Link></li><li><Link href="/tools/recipe-calculator">Recipe calculator</Link></li><li><Link href="/calculators/soap-cost-calculator">Cost per bar</Link></li><li><Link href="/tools/production-planner">Production planner</Link></li></ul></div><div><p className="font-semibold">Learn</p><ul className="mt-4 space-y-3 text-sm text-muted-foreground"><li><Link href="/methodology">Methodology</Link></li><li><Link href="/safety">Safety</Link></li><li><Link href="/blog">Articles</Link></li><li><Link href="/privacy">Privacy</Link></li></ul></div></div><div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-border px-6 py-6 text-sm text-muted-foreground md:flex-row md:justify-between md:px-10"><span>© {new Date().getFullYear()} SoapCraft Pro</span><span>Deterministic calculations. Visible assumptions. Human responsibility.</span></div></footer>
    </main>
  );
}
