import type { Locale } from '@/shared/types/common';
import { DEFAULT_LOCALE } from '@/shared/types/common';
import type { CategoryNode } from '@/shared/types/category';
import { fetchCategoryTree } from '@/features/post-feed/api/categories';

const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  ko: { delicious: '맛집', cafe: '카페', travel: '여행' },
  en: { delicious: 'Food', cafe: 'Cafe', travel: 'Travel' },
  ja: { delicious: 'グルメ', cafe: 'カフェ', travel: '旅行' },
  'zh-CN': { delicious: '美食', cafe: '咖啡厅', travel: '旅行' },
  'zh-TW': { delicious: '美食', cafe: '咖啡廳', travel: '旅行' },
  id: { delicious: 'Kuliner', cafe: 'Kafe', travel: 'Wisata' },
  vi: { delicious: 'Ẩm thực', cafe: 'Quán cà phê', travel: 'Du lịch' },
  th: { delicious: 'ร้านอาหาร', cafe: 'คาเฟ่', travel: 'ท่องเที่ยว' },
};

const SUB_CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  ko: {
    korean: '한식',
    western: '양식',
    japanese: '일식',
    pub: '주점',
    hotplace: '핫플',
    study: '카공',
    domestic: '국내',
    overseas: '해외',
    accommodation: '숙소',
  },
  en: {
    korean: 'Korean',
    western: 'Western',
    japanese: 'Japanese',
    pub: 'Pub',
    hotplace: 'Hot Place',
    study: 'Study Cafe',
    domestic: 'Domestic',
    overseas: 'Overseas',
    accommodation: 'Accommodation',
  },
  ja: {
    korean: '韓国料理',
    western: '洋食',
    japanese: '和食',
    pub: '居酒屋',
    hotplace: '話題の店',
    study: '勉強カフェ',
    domestic: '国内',
    overseas: '海外',
    accommodation: '宿泊',
  },
  'zh-CN': {
    korean: '韩餐',
    western: '西餐',
    japanese: '日料',
    pub: '酒吧',
    hotplace: '网红店',
    study: '学习咖啡厅',
    domestic: '国内',
    overseas: '海外',
    accommodation: '住宿',
  },
  'zh-TW': {
    korean: '韓式料理',
    western: '西式料理',
    japanese: '日式料理',
    pub: '酒吧',
    hotplace: '熱門店',
    study: '讀書咖啡廳',
    domestic: '國內',
    overseas: '海外',
    accommodation: '住宿',
  },
  id: {
    korean: 'Masakan Korea',
    western: 'Masakan Barat',
    japanese: 'Masakan Jepang',
    pub: 'Pub',
    hotplace: 'Tempat Hits',
    study: 'Kafe Belajar',
    domestic: 'Domestik',
    overseas: 'Luar Negeri',
    accommodation: 'Penginapan',
  },
  vi: {
    korean: 'Món Hàn',
    western: 'Món Âu',
    japanese: 'Món Nhật',
    pub: 'Quán nhậu',
    hotplace: 'Quán hot',
    study: 'Quán học bài',
    domestic: 'Trong nước',
    overseas: 'Nước ngoài',
    accommodation: 'Chỗ ở',
  },
  th: {
    korean: 'อาหารเกาหลี',
    western: 'อาหารตะวันตก',
    japanese: 'อาหารญี่ปุ่น',
    pub: 'ผับ',
    hotplace: 'ร้านฮอต',
    study: 'คาเฟ่อ่านหนังสือ',
    domestic: 'ในประเทศ',
    overseas: 'ต่างประเทศ',
    accommodation: 'ที่พัก',
  },
};

export const getCategoryLabel = (category: string, locale: Locale): string =>
  CATEGORY_LABELS[locale]?.[category] ?? category;

export const getSubCategoryLabel = (subCategory: string, locale: Locale): string =>
  SUB_CATEGORY_LABELS[locale]?.[subCategory] ?? subCategory;

/**
 * DB에서 카테고리 트리를 가져와 locale별 레이블로 변환한다.
 * 한국어(DEFAULT_LOCALE)는 DB의 name 필드를 사용하고, 다국어는 레이블 맵을 사용한다.
 */
export const getCategoryTree = async (locale: Locale): Promise<CategoryNode[]> => {
  const tree = await fetchCategoryTree();

  return tree.map((cat) => ({
    slug: cat.slug,
    label: locale === DEFAULT_LOCALE ? cat.name : (CATEGORY_LABELS[locale]?.[cat.slug] ?? cat.name),
    subCategories: cat.subCategories.map((sub) => ({
      slug: sub.slug,
      label:
        locale === DEFAULT_LOCALE
          ? sub.name
          : (SUB_CATEGORY_LABELS[locale]?.[sub.slug] ?? sub.name),
    })),
  }));
};
