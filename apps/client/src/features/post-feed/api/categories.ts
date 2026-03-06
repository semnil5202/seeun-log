/** 빌드 타임 카테고리 트리 쿼리 API. Supabase categories 테이블 기반. */

import { supabase } from '@/shared/lib/supabase';

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  parent_id: string | null;
  sort_order: number;
  is_multilingual: boolean;
};

export type CategoryTreeNode = {
  slug: string;
  name: string;
  subCategories: { slug: string; name: string; isMultilingual: boolean }[];
};

export const fetchCategoryTree = async (): Promise<CategoryTreeNode[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name, parent_id, sort_order, is_multilingual')
    .order('sort_order');

  if (error) throw new Error(`fetchCategoryTree failed: ${error.message}`);

  const rows = (data ?? []) as CategoryRow[];
  const idToSlug = new Map<string, string>();
  for (const row of rows) idToSlug.set(row.id, row.slug);

  const parentMap = new Map<string, CategoryTreeNode>();
  for (const row of rows) {
    if (!row.parent_id) {
      parentMap.set(row.slug, { slug: row.slug, name: row.name, subCategories: [] });
    }
  }

  for (const row of rows) {
    if (row.parent_id) {
      const parentSlug = idToSlug.get(row.parent_id);
      if (parentSlug && parentMap.has(parentSlug)) {
        parentMap.get(parentSlug)!.subCategories.push({
          slug: row.slug,
          name: row.name,
          isMultilingual: row.is_multilingual,
        });
      }
    }
  }

  return Array.from(parentMap.values());
};

export const fetchCategorySlugs = async (): Promise<string[]> => {
  const tree = await fetchCategoryTree();
  return tree.map((c) => c.slug);
};

export const fetchSubCategoryMap = async (): Promise<Record<string, string[]>> => {
  const tree = await fetchCategoryTree();
  const result: Record<string, string[]> = {};
  for (const cat of tree) {
    result[cat.slug] = cat.subCategories.map((s) => s.slug);
  }
  return result;
};
