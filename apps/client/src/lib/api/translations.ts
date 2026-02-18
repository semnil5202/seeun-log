/**
 * Translation query API — build-time data access layer for the Astro SSG client.
 *
 * Provides locale-aware access to post content. Falls back to the original
 * Korean content when no translation exists for the requested locale.
 *
 * MIGRATION PATH: Replace MOCK_TRANSLATIONS imports with Supabase queries.
 * The compound unique index on (post_id, locale) in docs/database.md means
 * every translation lookup is an O(1) index seek on Supabase — no changes
 * to the function signatures are needed.
 *
 * SECURITY: No user-supplied data is interpolated into queries here.
 * postId and locale are always typed values from internal callers.
 */

import type { Post, PostTranslation, LocalizedPost } from '@/types/post';
import type { Locale } from '@/types/common';
import { MOCK_TRANSLATIONS } from '@/lib/mock/translations';

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the translation for a specific post and locale, or `undefined`
 * when no translation has been created yet.
 *
 * PERF: Supabase replacement:
 *   .from("post_translations")
 *   .select("*")
 *   .eq("post_id", postId)
 *   .eq("locale", locale)
 *   .maybeSingle()
 * — hits the unique compound index (post_id, locale) directly.
 */
export async function getTranslation(
  postId: string,
  locale: Locale,
): Promise<PostTranslation | undefined> {
  return MOCK_TRANSLATIONS.find((t) => t.post_id === postId && t.locale === locale);
}

/**
 * Returns all available translations for a given post, in insertion order.
 * Useful for building hreflang entries on detail pages.
 *
 * PERF: Supabase replacement:
 *   .from("post_translations")
 *   .select("*")
 *   .eq("post_id", postId)
 * — index on post_id in the compound (post_id, locale) index covers this.
 */
export async function getTranslationsForPost(postId: string): Promise<PostTranslation[]> {
  return MOCK_TRANSLATIONS.filter((t) => t.post_id === postId);
}

/**
 * Returns a LocalizedPost — the original Post record enriched with translated
 * title, description, and content for the requested locale.
 *
 * Fallback strategy: if no translation exists the Korean source content is
 * used as-is and `locale` is set to the requested locale (callers can check
 * the locale value to decide whether to show a translation-unavailable notice).
 *
 * @param post   The source Post object fetched from the posts API.
 * @param locale The target locale requested by the page or user.
 */
export async function getLocalizedPost(post: Post, locale: Locale): Promise<LocalizedPost> {
  const translation = await getTranslation(post.id, locale);

  if (translation) {
    return {
      // Spread all non-text fields unchanged (category, slug, thumbnail, etc.)
      ...post,
      // Override the three text fields with translated values
      title: translation.title,
      description: translation.description,
      content: translation.content,
      // Attach the resolved locale so consumers know what was rendered
      locale,
    };
  }

  // Fallback: serve the original Korean content with the requested locale tag.
  // Consumers can detect a missing translation by comparing locale !== "ko".
  return {
    ...post,
    locale,
  };
}
