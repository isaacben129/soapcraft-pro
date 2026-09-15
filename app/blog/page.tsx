import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Calculator, CircleDollarSign, Ruler } from "lucide-react";
import { blogPosts, getBlogPostsByCategory } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Soapmaking Blog: Calculators, Recipes & Practical Guides | SoapCraft Pro",
  description:
    "Practical soapmaking guides covering formulation, calculators, recipes, ingredients, production, safety, and selling.",
  path: "/blog",
});

const categories = [
  "All",
  "Soap Calculators",
  "Soap Recipes",
  "Soap Making Guides",
  "Troubleshooting",
  "Ingredients",
  "Production",
  "Safety",
];

const toolLinks = [
  { href: "/tools/mold-volume", label: "Mold volume", icon: Ruler, text: "Size the mold before you scale a recipe." },
  { href: "/tools/recipe-scaling", label: "Recipe scaling", icon: Calculator, text: "Resize a recipe without losing its basis." },
  { href: "/tools/batch-cost", label: "Batch cost", icon: CircleDollarSign, text: "See what each saleable bar really costs." },
];

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE_URL}/blog#blog`,
  name: "SoapCraft Pro Blog",
  description: "Practical, evidence-led soapmaking guides and connected tools.",
  url: `${SITE_URL}/blog`,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  publisher: { "@type": "Organization", name: "SoapCraft Pro", url: SITE_URL },
  blogPost: blogPosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    image: `${SITE_URL}${post.image}`,
  })),
};

function ArticleCard({ post, featured = false }: { post: (typeof blogPosts)[number]; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 ${featured ? "h-full" : ""}`}
      aria-label={`Read ${post.title}`}
    >
      <article className={`flex h-full flex-col border-t-2 border-border transition-colors hover:border-primary ${featured ? "gap-7 pt-5" : "gap-5 pt-5"}`}>
        <div className={`overflow-hidden bg-muted ${featured ? "aspect-[16/8]" : "aspect-[16/10]"}`}>
          <img
            src={post.image}
            alt={post.imageAlt || post.title}
            className="h-full w-full object-cover transition-[filter] duration-200 group-hover:brightness-95"
            width={1600}
            height={1000}
            loading={featured ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{post.category}</p>
          <h2 className={`mt-3 leading-tight text-foreground group-hover:text-primary ${featured ? "max-w-3xl text-3xl sm:text-4xl" : "text-2xl"}`}>
            {post.title}
          </h2>
          <p className={`mt-3 leading-7 text-muted-foreground ${featured ? "max-w-2xl text-lg" : ""}`}>{post.description}</p>
          <p className="mt-auto pt-5 text-sm text-muted-foreground">{post.readingTime} min read <span aria-hidden="true">↗</span></p>
        </div>
      </article>
    </Link>
  );
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category = "All" } = await searchParams;
  const posts = category !== "All" ? getBlogPostsByCategory(category) : blogPosts;
  const [lead, ...rest] = posts;

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogJsonLd) }} />
      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">The journal</p>
            <h1 className="mt-4 max-w-2xl text-5xl leading-[1.02] sm:text-7xl">Better batches start with better decisions.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Useful writing for soap makers who want to understand the numbers, not just press calculate.</p>
          </div>
          <nav className="mt-10 flex max-w-5xl flex-wrap gap-2" aria-label="Filter articles by category">
            {categories.map((item) => (
              <Link
                key={item}
                href={item === "All" ? "/blog" : `/blog?category=${encodeURIComponent(item)}`}
                className={`border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${category === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary hover:text-primary"}`}
                aria-current={category === item ? "page" : undefined}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        {lead ? (
          <div className="grid gap-10 border-b border-border pb-14 md:grid-cols-[1.1fr_.9fr] md:items-end">
            <ArticleCard post={lead} featured />
            <div className="border-t-2 border-accent pl-6 text-sm leading-7 text-muted-foreground">
              <BookOpen className="mb-4 h-6 w-6 text-accent" aria-hidden="true" />
              <p>These articles connect directly to the free tools. Follow the reasoning here, then run your own numbers.</p>
              <Link href="/tools" className="mt-4 inline-flex font-bold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Browse the toolbox <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        ) : (
          <p>No articles found in this category yet.</p>
        )}

        <div className="grid gap-x-10 gap-y-12 pt-14 md:grid-cols-2">
          {rest.map((post) => <ArticleCard key={post.slug} post={post} />)}
        </div>
      </section>

      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="eyebrow">Read, then run it</p><h2 className="mt-3 text-3xl">Tools for the next decision</h2></div>
            <Link href="/tools" className="font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">See all tools <ArrowUpRight className="inline h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {toolLinks.map(({ href, label, icon: Icon, text }) => (
              <Link key={href} href={href} className="group flex gap-4 border-t border-border pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span><span className="block font-bold group-hover:text-primary">{label}</span><span className="mt-1 block text-sm leading-6 text-muted-foreground">{text}</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
