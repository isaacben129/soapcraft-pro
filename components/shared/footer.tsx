import Link from "next/link";

const links = [
  ["All tools", "/tools"],
  ["Methodology", "/methodology"],
  ["Safety", "/safety"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <p className="font-display text-lg font-bold text-foreground">SoapCraft Pro</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Public soapmaking calculators and connected planning tools. Chemistry outputs are decision support, not a safety or regulatory certification.</p>
        </div>
        <nav aria-label="Legal and methodology" className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {links.map(([label, href]) => <Link key={href} href={href} className="text-muted-foreground hover:text-foreground">{label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}
