/** 빌드 타임 포스트 쿼리 API. Mock 데이터 기반이며 Supabase 마이그레이션 시 함수 시그니처는 유지한다. */

import type { Post } from '@/shared/types/post';
import type { CategorySlug } from '@/shared/types/category';
import { MOCK_POSTS } from '@/features/post-feed/mock/posts';

/** Stable newest-first sort. Operates on a shallow copy to avoid mutation. */
function sortByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

/** Returns all posts sorted newest-first. */
export async function getAllPosts(): Promise<Post[]> {
  return sortByDateDesc(MOCK_POSTS);
}

/** Returns all posts in a top-level category, sorted newest-first. */
export async function getPostsByCategory(category: CategorySlug): Promise<Post[]> {
  const filtered = MOCK_POSTS.filter((p) => p.category === category);
  return sortByDateDesc(filtered);
}

/** Returns posts in a specific sub-category, sorted newest-first. */
export async function getPostsBySubCategory(
  category: CategorySlug,
  subCategory: string,
): Promise<Post[]> {
  const filtered = MOCK_POSTS.filter(
    (p) => p.category === category && p.sub_category === subCategory,
  );
  return sortByDateDesc(filtered);
}

/**
 * Looks up a single post by its URL slug.
 * Returns `undefined` when no match is found (caller decides how to 404).
 */
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return MOCK_POSTS.find((p) => p.slug === slug);
}

/** Returns sponsored posts sorted newest-first (Right Sidebar / In-Feed Ad). */
export async function getSponsoredPosts(): Promise<Post[]> {
  const filtered = MOCK_POSTS.filter((p) => p.is_sponsored);
  return sortByDateDesc(filtered);
}

/** Returns Editor's Pick posts sorted newest-first (Right Sidebar). */
export async function getRecommendedPosts(): Promise<Post[]> {
  const filtered = MOCK_POSTS.filter((p) => p.is_recommended);
  return sortByDateDesc(filtered);
}

/** Returns the total number of published posts. */
export async function getPostCount(): Promise<number> {
  return MOCK_POSTS.length;
}

/**
 * Returns a page of posts across all categories.
 *
 * @param page    1-based page number.
 * @param perPage Posts per page. Defaults to 9 (matches 3-column grid).
 */
export async function getPaginatedPosts(
  page: number,
  perPage = 9,
): Promise<{ posts: Post[]; totalPages: number }> {
  const sorted = sortByDateDesc(MOCK_POSTS);
  const totalPages = Math.ceil(sorted.length / perPage);
  const from = (page - 1) * perPage;
  const posts = sorted.slice(from, from + perPage);
  return { posts, totalPages };
}

/**
 * Returns a page of posts within a top-level category.
 *
 * @param page    1-based page number.
 * @param perPage Posts per page. Defaults to 9.
 */
export async function getPaginatedPostsByCategory(
  category: CategorySlug,
  page: number,
  perPage = 9,
): Promise<{ posts: Post[]; totalPages: number }> {
  const sorted = sortByDateDesc(MOCK_POSTS.filter((p) => p.category === category));
  const totalPages = Math.ceil(sorted.length / perPage);
  const from = (page - 1) * perPage;
  const posts = sorted.slice(from, from + perPage);
  return { posts, totalPages };
}

/**
 * Returns a page of posts within a specific sub-category.
 *
 * @param page    1-based page number.
 * @param perPage Posts per page. Defaults to 9.
 */
export async function getPaginatedPostsBySubCategory(
  category: CategorySlug,
  subCategory: string,
  page: number,
  perPage = 9,
): Promise<{ posts: Post[]; totalPages: number }> {
  const sorted = sortByDateDesc(
    MOCK_POSTS.filter((p) => p.category === category && p.sub_category === subCategory),
  );
  const totalPages = Math.ceil(sorted.length / perPage);
  const from = (page - 1) * perPage;
  const posts = sorted.slice(from, from + perPage);
  return { posts, totalPages };
}
