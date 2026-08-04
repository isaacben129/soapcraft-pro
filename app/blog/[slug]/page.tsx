// ── Blog Post Page ──────────────────────
// R8.1: Semantic article rendering, images/alt text,
// related articles, Article/Breadcrumb JSON-LD, redirect old URLs.

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogSlugs, getRelatedPosts } from "@/lib/blog";

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

  return {
    title: post.seo.title,
    description: post.seo.description,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      url: `https://soapcraft-pro.vercel.app/blog/${post.slug}`,
      images: post.image
        ? [{ url: post.image, alt: post.imageAlt || post.title }]
        : undefined,
    },
    robots: { index: true, follow: true },
  };
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
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "SoapCraft Pro",
    },
    url: `https://soapcraft-pro.vercel.app/blog/${post.slug}`,
    image: post.image
      ? {
          "@type": "ImageObject",
          url: post.image,
          caption: post.imageAlt || post.title,
        }
      : undefined,
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
        item: "https://soapcraft-pro.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://soapcraft-pro.vercel.app/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: parts[parts.length - 1]?.replace(/-/g, " ") || slug,
        item: `https://soapcraft-pro.vercel.app/blog/${slug}`,
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
              className="w-full rounded-lg border border-border"
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
          __html: JSON.stringify(ArticleJsonLd(post)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(BreadcrumbJsonLd(slug)),
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
                {articlePost.title}
              </li>
            </ol>
          </nav>

          {/* Article header */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>{articlePost.category}</span>
            <span aria-hidden="true">·</span>
            <span>{articlePost.readingTime} min read</span>
            <span aria-hidden="true">·</span>
            <time dateTime={articlePost.publishedAt}>
              {new Date(articlePost.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {articlePost.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {articlePost.description}
          </p>

          {/* Article image with alt text */}
          {articlePost.image && (
            <figure className="mt-6">
              <img
                src={articlePost.image}
                alt={articlePost.imageAlt || articlePost.title}
                className="w-full rounded-lg border border-border"
              />
              {articlePost.imageAlt && (
                <figcaption className="mt-2 text-xs text-muted-foreground text-center">
                  {articlePost.imageAlt}
                </figcaption>
              )}
            </figure>
          )}

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {articlePost.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article content */}
          <div className="mt-12 prose prose-lg max-w-none">
            {formatContent(articlePost.content)}
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-16 pt-8 border-t border-border" aria-label="Related articles">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Related Articles
              </h2>
              <div className="space-y-4">
                {related.map((relatedPost) => (
                  <article
                    key={relatedPost.slug}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    {relatedPost.image && (
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.imageAlt || relatedPost.title}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                        loading="lazy"
                      />
                    )}
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground">
                        <Link href={`/blog/${relatedPost.slug}`} className="hover:underline">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {relatedPost.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}
