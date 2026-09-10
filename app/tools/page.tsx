import Link from "next/link";
const tools = [
 ["formulation","Formulation calculator","Build a recipe from oil percentages and verified chemistry."],
 ["sizing","Sizing and conversion","Scale recipes, convert units, and fit a mold."],
 ["batch-economics","Batch economics","Understand full batch cost and cost per saleable bar."],
 ["pricing","Pricing","Separate markup from gross-margin pricing."],
 ["markets","Markets and sales","Plan craft-fair break-even and wholesale pricing."],
 ["production","Production and cure","Back-plan ready-by dates and track cure."],
 ["purchasing","Purchasing","Turn requirements into pack-rounded buying quantities."],
];
export default function ToolsPage(){return <main><h1>Soapmaking tools</h1><p>Use the calculators independently or pass a recipe context from one step to the next.</p><div>{tools.map(([slug,title,description])=><article key={slug}><h2><Link href={`/tools/${slug}`}>{title}</Link></h2><p>{description}</p></article>)}</div></main>}
