/** 제품 리뷰 전용 필드 — 제품명, 구매처, 가격. */

import type { FocusEvent } from 'react';
import type { UseFormRegister, UseFormSetValue } from 'react-hook-form';

import type { PostFormValues } from '../types/form';

type ProductReviewFieldsProps = {
  register: UseFormRegister<PostFormValues>;
  setValue: UseFormSetValue<PostFormValues>;
};

export function ProductReviewFields({ register, setValue }: ProductReviewFieldsProps) {
  const handlePricePrefixBlur = (e: FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val && !val.endsWith(' ')) {
      setValue('pricePrefix', val + ' ');
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div>
        <label className="mb-1 block text-base font-bold">
          제품명
        </label>
        <input
          type="text"
          {...register('productName')}
          placeholder="제품명을 입력해주세요."
          className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex gap-2">
        <div className="grow basis-0">
          <label className="mb-1 block text-base font-bold">
            구매처
          </label>
          <input
            type="text"
            {...register('purchaseSource')}
            placeholder="구매처명을 입력해주세요."
            className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="grow basis-0">
          <label className="mb-1 block text-base font-bold">구매 링크</label>
          <input
            type="url"
            {...register('purchaseLink')}
            placeholder="https://..."
            className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="grow-[2] basis-0">
          <label className="mb-1 block text-base font-bold">가격 설명</label>
          <input
            type="text"
            {...register('pricePrefix', { onBlur: handlePricePrefixBlur })}
            placeholder="ex) 메인 메뉴 평균 가격: "
            className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="grow basis-0">
          <div className="mb-1 flex items-baseline justify-between">
            <label className="text-base font-bold">
              금액
            </label>
            <span className="text-[12px] text-muted-foreground">(단위: 만원)</span>
          </div>
          <input
            type="number"
            {...register('price')}
            placeholder="금액"
            className="h-9 w-full border border-input bg-transparent px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
}
