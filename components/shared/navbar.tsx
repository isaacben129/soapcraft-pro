"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Beaker, BookOpen, Calculator, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { canonicalRoutes } from "@/lib/routing/canonical-routes";

const primary = [
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/methodology", label: "Methodology", icon: Beaker },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const closeMenus = () => { setOpen(false); setToolsOpen(false); };

  return <header className="sticky top-0 z-40 border-b border-border bg-background">
    <nav className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8" aria-label="Main navigation">
      <Link href="/" className="group flex shrink-0 items-center gap-3" onClick={closeMenus}>
        <span className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground"><span className="text-lg font-black">S</span></span>
        <span><span className="block font-display text-lg font-bold tracking-tight text-foreground">SoapCraft Pro</span><span className="block text-[10px] font-bold uppercase tracking-[.16em] text-primary">Utility hub</span></span>
      </Link>

      <div className="hidden items-center gap-6 md:flex">
        <div className="relative">
          <button type="button" aria-haspopup="menu" aria-expanded={toolsOpen} aria-controls="tools-menu" onClick={() => setToolsOpen((value) => !value)} className={`inline-flex items-center gap-2 border-b-2 py-5 text-sm font-semibold transition ${active("/tools") ? "border-primary text-primary" : "border-transparent text-foreground/70 hover:border-primary/40 hover:text-foreground"}`}>
            <Calculator className="h-4 w-4" />Tools <ChevronDown className={`h-4 w-4 transition ${toolsOpen ? "rotate-180" : ""}`} />
          </button>
          {toolsOpen ? <div id="tools-menu" role="menu" aria-label="Soapmaking tools" className="absolute left-0 top-[60px] z-50 w-[340px] border border-border bg-background p-3 shadow-xl">
            <div className="border-b border-border px-2 pb-3"><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Free utility hub</p><Link href="/tools" role="menuitem" onClick={closeMenus} className="mt-1 block text-sm font-semibold text-foreground hover:text-primary">See every tool and how they connect</Link></div>
            <div className="grid gap-1 pt-2">{canonicalRoutes.map((tool) => <Link key={tool.slug} href={tool.path} role="menuitem" onClick={closeMenus} className="flex items-center justify-between gap-4 px-2 py-2.5 text-sm hover:bg-muted"><span className="font-semibold text-foreground">{tool.title}</span><span className={`shrink-0 text-xs ${tool.isGated ? "text-accent" : "text-muted-foreground"}`}>{tool.isGated ? "Safety-gated" : "Open"}</span></Link>)}</div>
          </div> : null}
        </div>
        {primary.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setToolsOpen(false)} className={`inline-flex items-center gap-2 border-b-2 py-5 text-sm font-semibold transition ${active(href) ? "border-primary text-primary" : "border-transparent text-foreground/70 hover:border-primary/40 hover:text-foreground"}`}><Icon className="h-4 w-4" />{label}</Link>)}
      </div>
      <div className="hidden items-center gap-3 md:flex"><Link href="/tools" onClick={closeMenus} className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">Open toolbox <ArrowRight className="h-4 w-4" /></Link></div>
      <button type="button" className="grid h-11 w-11 place-items-center border border-border bg-card text-foreground md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
    </nav>
    {open ? <div className="border-t border-border bg-background px-5 py-4 md:hidden"><div className="mx-auto grid max-w-7xl gap-1">
      <Link href="/tools" onClick={closeMenus} className={`flex min-h-12 items-center gap-3 border-b border-border px-2 font-semibold ${active("/tools") ? "text-primary" : "text-foreground"}`}><Calculator className="h-5 w-5" />Tools</Link>
      <div className="grid border-b border-border pb-2 pl-10">{canonicalRoutes.map((tool) => <Link key={tool.slug} href={tool.path} onClick={closeMenus} className="flex min-h-10 items-center justify-between py-1 text-sm text-foreground"><span>{tool.title}</span><span className="text-xs text-muted-foreground">{tool.isGated ? "Safety-gated" : "Open"}</span></Link>)}</div>
      {primary.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={closeMenus} className={`flex min-h-12 items-center gap-3 border-b border-border px-2 font-semibold ${active(href) ? "text-primary" : "text-foreground"}`}><Icon className="h-5 w-5" />{label}</Link>)}
    </div></div> : null}
  </header>;
}
