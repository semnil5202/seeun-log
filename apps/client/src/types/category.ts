export const CATEGORY_SLUGS = ["delicious", "cafe", "travel"] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const SUB_CATEGORY_MAP = {
  delicious: ["korean", "western", "japanese", "pub"],
  cafe: ["hotplace", "study"],
  travel: ["domestic", "overseas", "accommodation"],
} as const;

export type SubCategorySlug<C extends CategorySlug = CategorySlug> =
  (typeof SUB_CATEGORY_MAP)[C][number];

export type AllSubCategorySlug =
  (typeof SUB_CATEGORY_MAP)[CategorySlug][number];

export interface CategoryNode {
  slug: CategorySlug;
  label: string;
  subCategories: { slug: string; label: string }[];
}
