'use client';

import { Suspense, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';

import SearchFilter from '@/shared/components/filter/SearchFilter';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Category, SubCategory } from '@/shared/types/post';

type QueryFormValues = {
  query: string;
};

type CategoryRow = {
  category: Category;
  label: string;
  postCount: number;
  createdAt: string;
};

type SubCategoryRow = {
  category: Category;
  subCategory: SubCategory;
  subCategoryLabel: string;
  postCount: number;
  isMultilingual: boolean;
  createdAt: string;
};

const MOCK_CATEGORIES: CategoryRow[] = [
  { category: 'delicious', label: '맛집', postCount: 28, createdAt: '2026-01-05' },
  { category: 'cafe', label: '카페', postCount: 11, createdAt: '2026-01-05' },
  { category: 'travel', label: '여행', postCount: 18, createdAt: '2026-01-05' },
];

const MOCK_SUB_CATEGORIES: SubCategoryRow[] = [
  { category: 'delicious', subCategory: 'korean', subCategoryLabel: '한식', postCount: 12, isMultilingual: true, createdAt: '2026-01-10' },
  { category: 'delicious', subCategory: 'western', subCategoryLabel: '양식', postCount: 8, isMultilingual: true, createdAt: '2026-01-10' },
  { category: 'delicious', subCategory: 'japanese', subCategoryLabel: '일식', postCount: 5, isMultilingual: true, createdAt: '2026-01-10' },
  { category: 'delicious', subCategory: 'pub', subCategoryLabel: '주점', postCount: 3, isMultilingual: false, createdAt: '2026-01-15' },
  { category: 'cafe', subCategory: 'hotplace', subCategoryLabel: '핫플', postCount: 7, isMultilingual: true, createdAt: '2026-01-10' },
  { category: 'cafe', subCategory: 'study', subCategoryLabel: '카공', postCount: 4, isMultilingual: true, createdAt: '2026-01-12' },
  { category: 'travel', subCategory: 'domestic', subCategoryLabel: '국내', postCount: 10, isMultilingual: true, createdAt: '2026-01-10' },
  { category: 'travel', subCategory: 'overseas', subCategoryLabel: '해외', postCount: 6, isMultilingual: true, createdAt: '2026-01-10' },
  { category: 'travel', subCategory: 'accommodation', subCategoryLabel: '숙소', postCount: 2, isMultilingual: false, createdAt: '2026-01-20' },
];

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoriesContent />
    </Suspense>
  );
}

function CategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, getValues } = useForm<QueryFormValues>({
    defaultValues: {
      query: searchParams.get('q') || '',
    },
  });

  const [appliedQuery, setAppliedQuery] = useState(getValues().query);

  const handleSearch = () => {
    const current = getValues().query;
    setAppliedQuery(current);
    const params = new URLSearchParams();
    if (current) params.set('q', current);
    const qs = params.toString();
    router.replace(qs ? `/categories?${qs}` : '/categories', { scroll: false });
  };

  const groupedData = useMemo(() => {
    const groups: {
      category: CategoryRow;
      subCategories: SubCategoryRow[];
    }[] = [];

    for (const cat of MOCK_CATEGORIES) {
      if (appliedQuery && !cat.label.includes(appliedQuery)) {
        const subs = MOCK_SUB_CATEGORIES.filter(
          (r) => r.category === cat.category && r.subCategoryLabel.includes(appliedQuery),
        );
        if (subs.length > 0) groups.push({ category: cat, subCategories: subs });
      } else {
        const subs = MOCK_SUB_CATEGORIES.filter((r) => r.category === cat.category);
        if (subs.length > 0) groups.push({ category: cat, subCategories: subs });
      }
    }

    return groups;
  }, [appliedQuery]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">카테고리 생성/수정/삭제</h1>
        <p className="mt-1 text-sm text-muted-foreground">카테고리를 관리합니다.</p>
      </div>

      <SearchFilter onSearch={handleSearch}>
        <SearchFilter.Query register={register('query')} placeholder="카테고리명 검색" />
      </SearchFilter>

      <div>
        <div className="mb-3">
          <Button>
            <Plus className="mr-1 h-4 w-4" />새 카테고리 생성
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary-600 hover:bg-primary-600">
                <TableHead className="w-[18%] font-bold text-white">대분류 카테고리명</TableHead>
                <TableHead className="w-[18%] font-bold text-white">소분류 카테고리명</TableHead>
                <TableHead className="text-center font-bold text-white">포함된 글</TableHead>
                <TableHead className="text-center font-bold text-white">다국어 지원 여부</TableHead>
                <TableHead className="text-center font-bold text-white">생성일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                groupedData.flatMap((group) => [
                  <TableRow key={group.category.category} className="bg-muted/50">
                    <TableCell className="py-3 font-bold">{group.category.label}</TableCell>
                    <TableCell />
                    <TableCell className="py-3 text-center">{group.category.postCount}</TableCell>
                    <TableCell />
                    <TableCell className="py-3 text-center">{group.category.createdAt}</TableCell>
                  </TableRow>,
                  ...group.subCategories.map((sub) => (
                    <TableRow key={`${group.category.category}-${sub.subCategory}`}>
                      <TableCell />
                      <TableCell className="py-3">{sub.subCategoryLabel}</TableCell>
                      <TableCell className="py-3 text-center">{sub.postCount}</TableCell>
                      <TableCell className="py-3 text-center">
                        {sub.isMultilingual ? '지원' : '미지원'}
                      </TableCell>
                      <TableCell className="py-3 text-center">{sub.createdAt}</TableCell>
                    </TableRow>
                  )),
                ])
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
