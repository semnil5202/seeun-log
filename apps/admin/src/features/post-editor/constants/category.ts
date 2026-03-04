import type { Category, SubCategory } from '@/shared/types/post';

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'delicious', label: '맛집' },
  { value: 'cafe', label: '카페' },
  { value: 'travel', label: '여행' },
];

export const SUB_CATEGORY_MAP: Record<Category, { value: SubCategory; label: string }[]> = {
  delicious: [
    { value: 'korean', label: '한식' },
    { value: 'western', label: '양식' },
    { value: 'japanese', label: '일식' },
    { value: 'pub', label: '주점' },
  ],
  cafe: [
    { value: 'hotplace', label: '핫플' },
    { value: 'study', label: '카공' },
  ],
  travel: [
    { value: 'domestic', label: '국내' },
    { value: 'overseas', label: '해외' },
    { value: 'accommodation', label: '숙소' },
  ],
};
