// ── Blog Index ────────────────────────────────
// R8.1: Canonical /blog, featured/latest/category filter,
// semantic article rendering, images/alt text, related articles,
// Article/Breadcrumb JSON-LD, redirect old URLs.

import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — SoapCraft Pro",
  description:
    "Programmatic SEO articles for soap makers: calculators, recipes, guides, and troubleshooting.",
  openGraph: {
    title: "Blog — SoapCraft Pro",
    description:
      "Deterministic soap making guides, verified recipes, and troubleshooting articles.",
    type: "website",
    url: "https://soapcraft-pro.vercel.app/blog",
  },
  robots: { index: true, follow: true },
};

const categories = ["All", "Soap Calculators", "Soap Recipes", "Soap Making Guides", "Troubleshooting"];

// JSON-LD structured data for the blog index
const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "SoapCraft Pro Blog",
  description:
    "Deterministic guides, verified recipes, and troubleshooting for serious soap makers.",
  url: "https://soapcraft-pro.vercel.app/blog",
  publisher: {
    "@type": "Organization",
    name: "SoapCraft Pro",
  },
};

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  // Featured posts: first 3
  const featured = blogPosts.slice(0, 3);

  // Latest posts: most recent first
  const latest = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <main className="flex flex-col min-h-screen">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li className="text-foreground">Blog</li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Deterministic guides, verified recipes, and troubleshooting for
            serious soap makers.
          </p>

          {/* Category filter */}
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((cat) => (
              <a
                key={cat}
                href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>

          {/* Featured section */}
          <section className="mt-12" aria-label="Featured articles">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Featured
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((post) => (
                <article
                  key={post.slug}
                  className="border border-border rounded-lg p-6 hover:shadow-elevation-1 transition-shadow"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.imageAlt || post.title}
                      className="w-full h-40 object-cover rounded-md mb-4"
                      loading="lazy"
                    />
                  )}
                  <div className="text-sm text-muted-foreground mb-2">
                    {post.category} · {post.readingTime} min read
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {post.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Latest articles */}
          <section className="mt-12" aria-label="Latest articles">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Latest
            </h2>
            <div className="space-y-8">
              {latest.map((post) => (
                <article
                  key={post.slug}
                  className="border-b border-border pb-8 last:border-0"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime} min read</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {post.description}
                  </p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.imageAlt || post.title}
                      className="mt-3 w-full h-48 object-cover rounded-md"
                      loading="lazy"
                    />
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
