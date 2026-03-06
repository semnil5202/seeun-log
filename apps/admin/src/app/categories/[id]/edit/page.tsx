'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SlugField } from '@/shared/components/slug/SlugField';
import { CATEGORY_OPTIONS } from '@/features/post-editor/constants/category';

import type { Category } from '@/shared/types/post';

type MockCategory = {
  id: string;
  type: 'parent' | 'child';
  name: string;
  slug: string;
  parentCategory?: Category;
  isMultilingual?: boolean;
};

const MOCK_CATEGORY_DB: Record<string, MockCategory> = {
  delicious: { id: 'delicious', type: 'parent', name: '맛집', slug: 'delicious' },
  cafe: { id: 'cafe', type: 'parent', name: '카페', slug: 'cafe' },
  travel: { id: 'travel', type: 'parent', name: '여행', slug: 'travel' },
  korean: {
    id: 'korean',
    type: 'child',
    name: '한식',
    slug: 'korean',
    parentCategory: 'delicious',
    isMultilingual: true,
  },
  western: {
    id: 'western',
    type: 'child',
    name: '양식',
    slug: 'western',
    parentCategory: 'delicious',
    isMultilingual: true,
  },
  japanese: {
    id: 'japanese',
    type: 'child',
    name: '일식',
    slug: 'japanese',
    parentCategory: 'delicious',
    isMultilingual: true,
  },
  pub: {
    id: 'pub',
    type: 'child',
    name: '주점',
    slug: 'pub',
    parentCategory: 'delicious',
    isMultilingual: false,
  },
  hotplace: {
    id: 'hotplace',
    type: 'child',
    name: '핫플',
    slug: 'hotplace',
    parentCategory: 'cafe',
    isMultilingual: true,
  },
  study: {
    id: 'study',
    type: 'child',
    name: '카공',
    slug: 'study',
    parentCategory: 'cafe',
    isMultilingual: true,
  },
  domestic: {
    id: 'domestic',
    type: 'child',
    name: '국내',
    slug: 'domestic',
    parentCategory: 'travel',
    isMultilingual: true,
  },
  overseas: {
    id: 'overseas',
    type: 'child',
    name: '해외',
    slug: 'overseas',
    parentCategory: 'travel',
    isMultilingual: true,
  },
  accommodation: {
    id: 'accommodation',
    type: 'child',
    name: '숙소',
    slug: 'accommodation',
    parentCategory: 'travel',
    isMultilingual: false,
  },
};

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const mockData = MOCK_CATEGORY_DB[id];

  if (!mockData) {
    return (
      <div className="space-y-4">
        <Link
          href="/categories"
          className="inline-flex text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <p className="text-muted-foreground">카테고리를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return mockData.type === 'parent' ? (
    <ParentCategoryEdit data={mockData} />
  ) : (
    <ChildCategoryEdit data={mockData} />
  );
}

function ParentCategoryEdit({ data }: { data: MockCategory }) {
  const [name, setName] = useState(data.name);
  const [slug, setSlug] = useState(data.slug);
  const [dialogType, setDialogType] = useState<'slug' | 'name' | null>(null);

  const handleSubmit = () => {
    if (!name.trim() || !slug.trim()) return;

    const slugChanged = slug !== data.slug;
    const nameChanged = name !== data.name;

    if (slugChanged) {
      setDialogType('slug');
    } else if (nameChanged) {
      setDialogType('name');
    } else {
      toast.info('변경된 내용이 없습니다.');
    }
  };

  const handleConfirm = () => {
    setDialogType(null);
    // TODO: updateCategory Server Action 호출
    toast.success('카테고리가 수정되었습니다.');
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/categories"
          className="mb-3 inline-flex text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold">카테고리 수정</h1>
        <p className="mt-1 text-sm text-muted-foreground">대분류 카테고리를 수정합니다.</p>
      </div>

      <div className="space-y-6 rounded-lg border bg-card p-6">
        <h2 className="text-base font-bold">대분류 카테고리 수정</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              카테고리명 <span className="text-primary-600">*</span>
            </label>
            <Input
              placeholder="예: 맛집"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            슬러그 <span className="text-primary-600">*</span>
          </label>
          <SlugField
            sourceText={name}
            value={slug}
            onChange={setSlug}
            placeholder="예: delicious"
          />
        </div>

        <div className="flex justify-end">
          <Button disabled={!name.trim() || !slug.trim()} onClick={handleSubmit}>
            수정
          </Button>
        </div>
      </div>

      <AlertDialog open={dialogType === 'slug'} onOpenChange={() => setDialogType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>slug 변경 경고</AlertDialogTitle>
            <AlertDialogDescription>
              slug 수정 시 기존 경로로 접근할 경우 리다이렉트가 발생하여 크롤러에 영향이 갑니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialogType === 'name'} onOpenChange={() => setDialogType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>카테고리명 변경</AlertDialogTitle>
            <AlertDialogDescription>
              대분류 카테고리를 {data.name}에서 → {name}으로 수정하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ChildCategoryEdit({ data }: { data: MockCategory }) {
  const [parent, setParent] = useState<Category>(data.parentCategory!);
  const [name, setName] = useState(data.name);
  const [slug, setSlug] = useState(data.slug);
  const [dialogType, setDialogType] = useState<'slug' | 'name' | null>(null);

  const handleSubmit = () => {
    if (!parent || !name.trim() || !slug.trim()) return;

    const slugChanged = slug !== data.slug;
    const nameChanged = name !== data.name || parent !== data.parentCategory;

    if (slugChanged) {
      setDialogType('slug');
    } else if (nameChanged) {
      setDialogType('name');
    } else {
      toast.info('변경된 내용이 없습니다.');
    }
  };

  const handleConfirm = () => {
    setDialogType(null);
    // TODO: updateCategory Server Action 호출
    toast.success('카테고리가 수정되었습니다.');
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/categories"
          className="mb-3 inline-flex text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold">카테고리 수정</h1>
        <p className="mt-1 text-sm text-muted-foreground">소분류 카테고리를 수정합니다.</p>
      </div>

      <div className="space-y-6 rounded-lg border bg-card p-6">
        <h2 className="text-base font-bold">소분류 카테고리 수정</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              대분류 <span className="text-primary-600">*</span>
            </label>
            <Select value={parent} onValueChange={(v) => setParent(v as Category)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              카테고리명 <span className="text-primary-600">*</span>
            </label>
            <Input
              placeholder="예: 한식"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            슬러그 <span className="text-primary-600">*</span>
          </label>
          <SlugField
            sourceText={name}
            value={slug}
            onChange={setSlug}
            placeholder="예: korean"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="multilingual-check"
              className="size-4 accent-primary-600"
              checked={data.isMultilingual ?? false}
              disabled
            />
            <label
              htmlFor="multilingual-check"
              className="text-sm font-medium text-muted-foreground"
            >
              다국어 지원
            </label>
          </div>
          <Button disabled={!parent || !name.trim() || !slug.trim()} onClick={handleSubmit}>
            수정
          </Button>
        </div>
      </div>

      <AlertDialog open={dialogType === 'slug'} onOpenChange={() => setDialogType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>slug 변경 경고</AlertDialogTitle>
            <AlertDialogDescription>
              slug 수정 시 기존 경로로 접근할 경우 리다이렉트가 발생하여 크롤러에 영향이 갑니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialogType === 'name'} onOpenChange={() => setDialogType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>카테고리명 변경</AlertDialogTitle>
            <AlertDialogDescription>
              소분류 카테고리를 {data.name}에서 → {name}으로 수정하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
