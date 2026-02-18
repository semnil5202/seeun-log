/**
 * Post query API — build-time data access layer for the Astro SSG client.
 *
 * All functions are async so the call-site code is identical whether we are
 * reading from the in-memory mock (now) or from Supabase (later).
 *
 * MIGRATION PATH: Replace the MOCK_POSTS import and the in-memory filter/sort
 * logic with a Supabase client call. Function signatures must NOT change.
 *
 * PERF: Results are sorted by created_at descending (newest first) at the
 * bottom of every query to mirror the `ORDER BY created_at DESC` index that
 * is recommended in docs/database.md.
 */

import type { Post } from '@/types/post';
import type { CategorySlug } from '@/types/category';
import { MOCK_POSTS } from '@/lib/mock/posts';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Stable newest-first sort. Operates on a shallow copy to avoid mutation. */
function sortByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns all posts sorted newest-first.
 *
 * COST: Full table scan on mock data. Supabase replacement should use:
 *   .select("*").order("created_at", { ascending: false })
 */
export async function getAllPosts(): Promise<Post[]> {
  return sortByDateDesc(MOCK_POSTS);
}

/**
 * Returns all posts in a top-level category, sorted newest-first.
 *
 * PERF: Supabase replacement benefits from the `category` index recommended
 * in docs/database.md.
 */
export async function getPostsByCategory(category: CategorySlug): Promise<Post[]> {
  const filtered = MOCK_POSTS.filter((p) => p.category === category);
  return sortByDateDesc(filtered);
}

/**
 * Returns posts in a specific sub-category, sorted newest-first.
 *
 * PERF: Supabase replacement benefits from the compound `(category, sub_category)`
 * index recommended in docs/database.md.
 */
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
 *
 * PERF: Supabase replacement should use `.eq("slug", slug).single()` which
 * hits the unique slug index directly.
 */
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return MOCK_POSTS.find((p) => p.slug === slug);
}

/**
 * Returns sponsored posts sorted newest-first (Right Sidebar / In-Feed Ad).
 *
 * PERF: Supabase replacement benefits from the `is_sponsored` index.
 */
export async function getSponsoredPosts(): Promise<Post[]> {
  const filtered = MOCK_POSTS.filter((p) => p.is_sponsored);
  return sortByDateDesc(filtered);
}

/**
 * Returns Editor's Pick posts sorted newest-first (Right Sidebar).
 *
 * PERF: Supabase replacement benefits from the `is_recommended` index.
 */
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
 *
 * PERF: Supabase replacement should use `.range(from, to)` with
 * `{ count: "exact" }` to get total count in a single request.
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
