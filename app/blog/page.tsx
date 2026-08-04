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
    url: "https://soapcraft-pro.vercel.app/marketing/blog",
  },
  robots: { index: true, follow: true },
};

const categories = ["All", "Soap Calculators", "Soap Recipes", "Soap Making Guides", "Troubleshooting"];

export default function BlogPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Deterministic guides, verified recipes, and troubleshooting for
            serious soap makers.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat}
                href={cat === "All" ? "/marketing/blog" : `/marketing/blog?category=${cat}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>

          <div className="mt-12 space-y-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="border-b border-border pb-8 last:border-0">
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
                  <Link href={`/marketing/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {post.description}
                </p>
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
        </div>
      </section>
    </main>
  );
}