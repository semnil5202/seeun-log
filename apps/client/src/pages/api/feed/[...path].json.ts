/** 빌드 타임 피드 JSON 엔드포인트. 무한스크롤 Page 2+ 데이터를 정적 JSON으로 생성한다. */

import type { APIRoute, GetStaticPaths } from 'astro';
import { type Locale, LOCALES } from '@/shared/types/common';
import { CATEGORY_SLUGS, SUB_CATEGORY_MAP, type CategorySlug } from '@/shared/types/category';
import {
  getPaginatedPosts,
  getPaginatedPostsByCategory,
  getPaginatedPostsBySubCategory,
} from '@/features/post-feed/api/posts';
import { getLocalizedPost } from '@/features/post-feed/api/translations';
import { getLocalePath } from '@/shared/lib/i18n/locales';
import { getCategoryLabel } from '@/shared/lib/i18n/categories';
import { t } from '@/shared/lib/i18n/translations';
import type { Post } from '@/shared/types/post';

type FeedPostData = {
  title: string;
  description: string;
  thumbnail: string;
  href: string;
  categoryLabel: string;
  dateStr: string;
  placeName: string | null;
  isSponsored: boolean;
  sponsoredLabel: string;
};

type PathProps = {
  locale: Locale;
  category: CategorySlug | null;
  subCategory: string | null;
  page: number;
  [key: string]: unknown;
};

async function buildFeedPostData(post: Post, locale: Locale): Promise<FeedPostData> {
  const localized = await getLocalizedPost(post, locale);
  const postPath = `/${post.category}/${post.sub_category}/${post.slug}/`;

  return {
    title: localized.title,
    description: localized.description,
    thumbnail: post.thumbnail,
    href: getLocalePath(postPath, locale),
    categoryLabel: getCategoryLabel(post.category, locale),
    dateStr: new Date(post.created_at).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    placeName: post.place_name || null,
    isSponsored: post.is_sponsored,
    sponsoredLabel: t('post.sponsored', locale),
  };
}

async function fetchPage(category: CategorySlug | null, subCategory: string | null, page: number) {
  if (category && subCategory) {
    return getPaginatedPostsBySubCategory(category, subCategory, page);
  }
  if (category) {
    return getPaginatedPostsByCategory(category, page);
  }
  return getPaginatedPosts(page);
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { path: string }; props: PathProps }[] = [];

  for (const locale of LOCALES) {
    // all posts
    const { totalPages: allTotal } = await getPaginatedPosts(1);
    for (let page = 2; page <= allTotal; page++) {
      paths.push({
        params: { path: `${locale}/all/${page}` },
        props: { locale, category: null, subCategory: null, page },
      });
    }

    // category pages
    for (const category of CATEGORY_SLUGS) {
      const { totalPages: catTotal } = await getPaginatedPostsByCategory(category, 1);
      for (let page = 2; page <= catTotal; page++) {
        paths.push({
          params: { path: `${locale}/${category}/${page}` },
          props: { locale, category, subCategory: null, page },
        });
      }

      // subcategory pages
      for (const sub of SUB_CATEGORY_MAP[category]) {
        const { totalPages: subTotal } = await getPaginatedPostsBySubCategory(category, sub, 1);
        for (let page = 2; page <= subTotal; page++) {
          paths.push({
            params: { path: `${locale}/${category}/${sub}/${page}` },
            props: { locale, category, subCategory: sub, page },
          });
        }
      }
    }
  }

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  const { locale, category, subCategory, page } = props as PathProps;

  const { posts, totalPages } = await fetchPage(category, subCategory, page);

  const feedPosts = await Promise.all(posts.map((post) => buildFeedPostData(post, locale)));

  return new Response(
    JSON.stringify({
      posts: feedPosts,
      hasNext: page < totalPages,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
