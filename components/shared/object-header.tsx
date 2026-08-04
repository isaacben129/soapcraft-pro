// ── ObjectHeader / Breadcrumbs ─────────────────────

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ObjectHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  className?: string;
}

export function ObjectHeader({
  title,
  breadcrumbs,
  action,
  className = "",
}: ObjectHeaderProps) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="mx-1">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-foreground transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
