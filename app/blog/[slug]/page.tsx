// ── Blog Post Page ──────────────────────
// R8.1: Semantic article rendering, images/alt text,
// related articles, Article/Breadcrumb JSON-LD, redirect old URLs.

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogSlugs, getRelatedPosts } from "@/lib/blog";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site-url";
import { articleMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog Post — SoapCraft Pro" };

  return articleMetadata({
    title: post.seo.title,
    description: post.seo.description,
    path: `/blog/${post.slug}`,
    publishedAt: post.publishedAt,
    author: post.author,
    image: `${SITE_URL}${post.image}`,
    imageAlt: post.imageAlt || post.title,
    keywords: post.seo.keywords,
  });
}

// ── JSON-LD structured data ──────────────

function ArticleJsonLd(post: {
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  slug: string;
  category: string;
  image?: string;
  imageAlt?: string;
}) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "SoapCraft Pro",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: post.image ? [`${SITE_URL}${post.image}`] : undefined,
    articleSection: post.category,
  };
}

function BreadcrumbJsonLd(slug: string) {
  const parts = slug.split("/");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: parts[parts.length - 1]?.replace(/-/g, " ") || slug,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };
}

// ── Content formatter ────────────────────

function formatContent(content: string) {
  return content.split("\n\n").map((paragraph, i) => {
    if (paragraph.startsWith("# ")) {
      return (
        <h1
          key={i}
          className="font-display text-2xl font-bold text-foreground mt-8 mb-4"
        >
          {paragraph.replace("# ", "")}
        </h1>
      );
    }
    if (paragraph.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-display text-xl font-semibold text-foreground mt-6 mb-3"
        >
          {paragraph.replace("## ", "")}
        </h2>
      );
    }
    if (paragraph.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="font-display text-lg font-semibold text-foreground mt-4 mb-2"
        >
          {paragraph.replace("### ", "")}
        </h3>
      );
    }
    if (paragraph.startsWith("- ")) {
      return (
        <li
          key={i}
          className="text-muted-foreground leading-relaxed ml-4 list-disc"
        >
          {paragraph.replace("- ", "")}
        </li>
      );
    }
    if (paragraph.startsWith("1. ")) {
      return (
        <li
          key={i}
          className="text-muted-foreground leading-relaxed ml-4 list-decimal"
        >
          {paragraph.replace("1. ", "")}
        </li>
      );
    }
    if (paragraph.startsWith("![") && paragraph.includes("](")) {
      // Inline image syntax: ![alt](url)
      const match = paragraph.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        return (
          <figure key={i} className="my-6">
            <img
              src={match[2]}
              alt={match[1]}
              className="w-full object-cover"
            />
            {match[1] && (
              <figcaption className="mt-2 text-xs text-muted-foreground text-center">
                {match[1]}
              </figcaption>
            )}
          </figure>
        );
      }
    }
    return (
      <p key={i} className="text-muted-foreground leading-relaxed mb-4">
        {paragraph}
      </p>
    );
  });
}

// ── Page component ───────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  return (
    <main className="flex flex-col min-h-screen">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(ArticleJsonLd(post)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(BreadcrumbJsonLd(slug)),
        }}
      />

      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true" className="mx-1">/</li>
              <li className="text-foreground">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Article header */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
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

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {post.description}
          </p>

          {/* Article image with alt text */}
          {post.image && (
            <figure className="mt-6">
              <img
                src={post.image}
                alt={post.imageAlt || post.title}
                className="w-full object-cover"
                width={1600}
                height={1000}
                decoding="async"
              />
              {post.imageAlt && (
                <figcaption className="mt-2 text-xs text-muted-foreground text-center">
                  {post.imageAlt}
                </figcaption>
              )}
            </figure>
          )}

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article content */}
          <div className="mt-12 prose prose-lg max-w-none">
            {formatContent(post.content)}
          </div>

          {post.contextualCTA ? <div className="mt-12 border-y-2 border-primary bg-muted p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Next step</p><h2 className="mt-2 text-2xl font-bold">Take this into your own batch</h2><p className="mt-2 text-muted-foreground">Turn the ideas in this article into a concrete decision with a free SoapCraft Pro tool.</p><Link href={post.contextualCTA.href} className="mt-4 inline-flex font-bold text-primary hover:underline">{post.contextualCTA.text} <span aria-hidden="true" className="ml-2">↗</span></Link></div> : null}

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-16 border-t border-border pt-8" aria-label="Related articles">
              <h2 className="font-display mb-6 text-xl font-bold text-foreground">Related articles</h2>
              <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
                {related.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block border-t-2 border-border pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                    aria-label={`Read ${relatedPost.title}`}
                  >
                    <article>
                      {relatedPost.image && (
                        <div className="mb-4 aspect-[16/10] overflow-hidden bg-muted">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.imageAlt || relatedPost.title}
                            className="h-full w-full object-cover transition-[filter] duration-200 group-hover:brightness-95"
                            width={1600}
                            height={1000}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}
                      <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{relatedPost.category}</p>
                      <h3 className="mt-2 font-display text-base font-semibold text-foreground group-hover:text-primary">{relatedPost.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{relatedPost.description}</p>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}
