import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORY_OPTIONS, SUB_CATEGORY_MAP } from '../constants/category';

import type { Category, SubCategory } from '@/shared/types/post';

type CategorySelectorProps = {
  category: Category | '';
  subCategory: SubCategory | '';
  onCategoryChange: (value: Category) => void;
  onSubCategoryChange: (value: SubCategory) => void;
};

export function CategorySelector({
  category,
  subCategory,
  onCategoryChange,
  onSubCategoryChange,
}: CategorySelectorProps) {
  const subCategoryOptions = category ? SUB_CATEGORY_MAP[category] : [];

  return (
    <div className="flex gap-3">
      <Select
        value={category}
        onValueChange={(value) => onCategoryChange(value as Category)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="대분류" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={subCategory}
        onValueChange={(value) => onSubCategoryChange(value as SubCategory)}
        disabled={!category}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="소분류" />
        </SelectTrigger>
        <SelectContent>
          {subCategoryOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
