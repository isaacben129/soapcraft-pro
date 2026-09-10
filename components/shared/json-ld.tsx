// ── JsonLd Component ──────────────────────────────────────────
// Renders inline JSON-LD script tags for search engine structured data.
// Use this to inject Organization, Website, Blog, Article, FAQ, BreadcrumbList.

interface JsonLdProps {
  data: unknown;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Multi-schema helper ────────────────────────────────────────
// Combines multiple schemas into a single script tag.

interface JsonLdListProps {
  data: unknown[];
}

export function JsonLdList({ data }: JsonLdListProps) {
  return (
    <>
      {data.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
    </>
  );
}
