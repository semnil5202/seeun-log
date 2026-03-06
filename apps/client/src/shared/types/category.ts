export type CategorySlug = string;

export type SubCategorySlug = string;

export type AllSubCategorySlug = string;

export type CategoryNode = {
  slug: CategorySlug;
  label: string;
  subCategories: { slug: string; label: string }[];
};
