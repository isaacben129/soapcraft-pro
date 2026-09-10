// ── Blog Index ────────────────────────────────
// R8.1: Canonical /blog, featured/latest/category filter,
// semantic article rendering, images/alt text, related articles,
// Article/Breadcrumb JSON-LD, redirect old URLs.

import { Metadata } from "next";
import Link from "next/link";
import { blogPosts, getBlogPostsByCategory } from "@/lib/blog";
import { serializeJsonLd } from "@/lib/seo/json-ld";

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

const categories = [
  "All",
  "Soap Calculators",
  "Soap Recipes",
  "Soap Making Guides",
  "Troubleshooting",
];

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

// Featured posts: first 3 published posts
const featured = blogPosts.slice(0, 3);

async function BlogContent({ category }: { category: string }) {
  const posts =
    category && category !== "All"
      ? getBlogPostsByCategory(category)
      : blogPosts;

  return (
    <>
      {/* Category filter */}
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <a
            key={cat}
            href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              cat === category
                ? "bg-action text-action-text border-action"
                : "border-rule text-ink-muted hover:bg-ledger hover:text-ink"
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {/* Featured section */}
      <section className="mt-12" aria-label="Featured articles">
        <h2 className="font-display text-xl font-bold text-ink mb-4">
          Featured
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.slice(0, 3).map((post) => (
            <article
              key={post.slug}
              className="border border-rule rounded-lg p-6 hover:shadow-elevation-1 transition-shadow"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                  loading="lazy"
                />
              )}
              <div className="text-sm text-ink-muted mb-2">
                {post.category} · {post.readingTime} min read
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                {post.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Latest articles */}
      <section className="mt-12" aria-label="Latest articles">
        <h2 className="font-display text-xl font-bold text-ink mb-4">
          Latest
        </h2>
        {posts.length === 0 ? (
          <p className="text-ink-muted text-sm">
            No articles found in this category yet.
          </p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border-b border-rule pb-8 last:border-0"
              >
                <div className="flex items-center gap-2 text-sm text-ink-muted mb-2">
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
                <h2 className="font-display text-xl font-semibold text-ink">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">
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
                      className="rounded-full bg-ink-muted/10 px-3 py-1 text-xs text-ink-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category || "";

  return (
    <main className="flex flex-col min-h-screen">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogJsonLd) }}
      />

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-ink-muted">
              <li>
                <Link href="/" className="hover:text-ink transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="mx-1">
                /
              </li>
              <li className="text-ink">Blog</li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Blog
          </h1>
          <p className="mt-4 text-lg text-ink-muted">
            Deterministic guides, verified recipes, and troubleshooting for
            serious soap makers.
          </p>

          <BlogContent category={activeCategory} />
        </div>
      </section>
    </main>
  );
}
