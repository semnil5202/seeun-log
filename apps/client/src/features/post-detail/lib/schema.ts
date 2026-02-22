import type { BlogPostingSchema, ReviewSchema } from "@/shared/types/seo";
import type { LocalizedPost } from "@/shared/types/post";

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
  authorName: "세은로그",
});

/**
 * Review JSON-LD 스키마 객체를 생성한다. place_name이 없으면 undefined를 반환한다.
 * @param post 로컬라이즈된 포스트
 */
export const buildReviewSchema = (post: LocalizedPost): ReviewSchema | undefined => {
  if (!post.place_name) return undefined;

  return {
    itemReviewed: {
      type: "Restaurant" as const,
      name: post.place_name,
      address: post.address ?? "",
    },
    reviewRating: post.rating,
    authorName: "세은로그",
  };
};
