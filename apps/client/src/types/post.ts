import type { CategorySlug, AllSubCategorySlug } from "./category";
import type { Locale } from "./common";

export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: CategorySlug;
  sub_category: AllSubCategorySlug;
  thumbnail: string;
  is_sponsored: boolean;
  is_recommended: boolean;
  rating: number;
  place_name: string;
  address: string;
  price_level: string;
  created_at: string;
  updated_at: string;
}

export interface PostTranslation {
  id: string;
  post_id: string;
  locale: Locale;
  title: string;
  description: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface LocalizedPost extends Omit<Post, "title" | "description" | "content"> {
  title: string;
  description: string;
  content: string;
  locale: Locale;
}
