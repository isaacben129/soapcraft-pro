import { Metadata } from "next";
import { SITE_URL } from "./site-url";

export function pageMetadata(args: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
}): Metadata {
  const { title, description, path, type = "website", image } = args;
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: "SoapCraft Pro",
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
    },
  };
}

export function articleMetadata(args: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  author: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const { title, description, path, publishedAt, author, image, imageAlt } =
    args;
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      publishedTime: publishedAt,
      authors: [author],
      siteName: "SoapCraft Pro",
      ...(image
        ? { images: [{ url: image, alt: imageAlt || title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
    },
  };
}
