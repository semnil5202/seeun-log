import type { Locale } from './common';

export type SeoMeta = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  locale: Locale;
  type?: 'website' | 'article';
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type BlogPostingSchema = {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image: string;
  url: string;
  authorName: string;
};

export type ReviewSchema = {
  itemReviewed: {
    type: 'Restaurant' | 'Place';
    name: string;
    address: string;
  };
  reviewRating: number;
  authorName: string;
};
