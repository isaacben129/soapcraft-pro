import blogData from "./blog-data.json";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: string;
  readingTime: number;
  image: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const blogPosts: BlogPost[] = blogData as BlogPost[];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export const blogCategories = [
  "Soap Calculators",
  "Soap Recipes",
  "Soap Making Guides",
  "Troubleshooting",
];