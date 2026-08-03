import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogSlugs } from "@/lib/blog";

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getBlogPost(params.slug);
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
      url: `https://soapcraft-pro.vercel.app/marketing/blog/${post.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

function formatContent(content: string) {
  return content.split("\n\n").map((paragraph, i) => {
    if (paragraph.startsWith("# ")) {
      return (
        <h1 key={i} className="font-display text-2xl font-bold text-foreground mt-8 mb-4">
          {paragraph.replace("# ", "")}
        </h1>
      );
    }
    if (paragraph.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display text-xl font-semibold text-foreground mt-6 mb-3">
          {paragraph.replace("## ", "")}
        </h2>
      );
    }
    if (paragraph.startsWith("### ")) {
      return (
        <h3 key={i} className="font-display text-lg font-semibold text-foreground mt-4 mb-2">
          {paragraph.replace("### ", "")}
        </h3>
      );
    }
    if (paragraph.startsWith("- ")) {
      return (
        <li key={i} className="text-muted-foreground leading-relaxed ml-4 list-disc">
          {paragraph.replace("- ", "")}
        </li>
      );
    }
    if (paragraph.startsWith("1. ")) {
      return (
        <li key={i} className="text-muted-foreground leading-relaxed ml-4 list-decimal">
          {paragraph.replace("1. ", "")}
        </li>
      );
    }
    return (
      <p key={i} className="text-muted-foreground leading-relaxed mb-4">
        {paragraph}
      </p>
    );
  });
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <main className="flex flex-col min-h-screen">
      <article className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
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
          <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-12 prose prose-lg max-w-none">
            {formatContent(post.content)}
          </div>
        </div>
      </article>
    </main>
  );
}