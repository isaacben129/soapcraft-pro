"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Beaker, BookOpen, Calculator, Menu, X } from "lucide-react";
import { useState } from "react";

const primary = [
  { href: "/tools", label: "Toolbox", icon: Calculator },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/methodology", label: "Methodology", icon: Beaker },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return <header className="sticky top-0 z-40 border-b border-border bg-background">
    <nav className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8" aria-label="Main navigation">
      <Link href="/" className="group flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
        <span className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground"><span className="text-lg font-black">S</span></span>
        <span><span className="block font-display text-lg font-bold tracking-tight text-foreground">SoapCraft Pro</span><span className="block text-[10px] font-bold uppercase tracking-[.16em] text-primary">Utility hub</span></span>
      </Link>
      <div className="hidden items-center gap-6 md:flex">{primary.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`inline-flex items-center gap-2 border-b-2 py-5 text-sm font-semibold transition ${active(href) ? "border-primary text-primary" : "border-transparent text-foreground/70 hover:border-primary/40 hover:text-foreground"}`}><Icon className="h-4 w-4" />{label}</Link>)}</div>
      <div className="hidden items-center gap-3 md:flex"><Link href="/tools" className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">Open toolbox <ArrowRight className="h-4 w-4" /></Link></div>
      <button type="button" className="grid h-11 w-11 place-items-center border border-border bg-card text-foreground md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
    </nav>
    {open && <div className="border-t border-border bg-background px-5 py-4 md:hidden"><div className="mx-auto grid max-w-7xl gap-1">{primary.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex min-h-12 items-center gap-3 border-b border-border px-2 font-semibold ${active(href) ? "text-primary" : "text-foreground"}`}><Icon className="h-5 w-5" />{label}</Link>)}<Link href="/tools" onClick={() => setOpen(false)} className="mt-3 flex min-h-12 items-center justify-center bg-primary font-bold text-primary-foreground">Open toolbox</Link></div></div>}
  </header>;
}
