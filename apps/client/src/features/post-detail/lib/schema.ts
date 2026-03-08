import type { BlogPostingSchema } from '@/shared/types/seo';
import type { LocalizedPost } from '@/shared/types/post';
import { SITE_NAME_KO } from '@eunminlog/config/site';

/**
 * BlogPosting JSON-LD 스키마 객체를 생성한다.
 * @param post 로컬라이즈된 포스트
 * @param canonical 정규 URL 경로
 */
export const buildBlogPostingSchema = (
  post: LocalizedPost,
  canonical: string,
): BlogPostingSchema => ({
  title: post.title,
  description: post.description,
  datePublished: post.created_at,
  dateModified: post.updated_at,
  image: post.thumbnail,
  url: canonical,
  authorName: SITE_NAME_KO,
});
