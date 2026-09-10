import type { ReactNode } from "react";
import Link from "next/link";
export default function ToolLanding({title,description,children}:{title:string;description:string;children?:ReactNode}){return <main><nav><Link href="/tools">All tools</Link></nav><h1>{title}</h1><p>{description}</p>{children ?? <p>Enter your values to calculate a result. Save or share the resulting recipe context when ready.</p>}</main>}
