import type { Locale } from "./common";

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  locale: Locale;
  type?: "website" | "article";
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BlogPostingSchema {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image: string;
  url: string;
  authorName: string;
}

export interface ReviewSchema {
  itemReviewed: {
    type: "Restaurant" | "Place";
    name: string;
    address: string;
  };
  reviewRating: number;
  authorName: string;
}
