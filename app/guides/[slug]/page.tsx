import Link from "next/link";
export default function GuidePage({params}:{params:{slug:string}}){return <main><Link href="/tools">Back to tools</Link><h1>{params.slug.replaceAll("-", " ")}</h1><p>This guide explains the inputs, assumptions, and boundaries of the SoapCraft Pro workflow. Calculations remain separate from commercial recommendations and safety claims.</p></main>}
