'use client';

import { useState } from 'react';
import { RefreshCwIcon } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import type { TranslationLocale } from '@/shared/types/post';
import type { TranslationResult } from '../types';
import { LOCALE_FILTER_LABELS } from '../constants/locale';

type FilterLocale = 'ko' | TranslationLocale;

const FILTER_KEYS: FilterLocale[] = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'id', 'vi', 'th'];

type TranslationPreviewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalTitle: string;
  originalContent: string;
  originalPlaceName?: string;
  originalAddress?: string;
  translations: TranslationResult[];
  onRetryLocale?: (locale: TranslationLocale) => Promise<TranslationResult>;
  onRetryAll?: () => Promise<void>;
};

export function TranslationPreviewSheet({
  open,
  onOpenChange,
  originalTitle,
  originalContent,
  originalPlaceName,
  originalAddress,
  translations,
  onRetryLocale,
  onRetryAll,
}: TranslationPreviewSheetProps) {
  const [selected, setSelected] = useState<FilterLocale>('en');
  const [retrying, setRetrying] = useState(false);
  const [retryingAll, setRetryingAll] = useState(false);

  const selectedTranslation =
    selected !== 'ko' ? translations.find((tr) => tr.locale === selected) : null;

  const handleRetry = async () => {
    if (!onRetryLocale || selected === 'ko' || retrying) return;
    setRetrying(true);
    try {
      await onRetryLocale(selected);
    } finally {
      setRetrying(false);
    }
  };

  const handleRetryAll = async () => {
    if (!onRetryAll || retryingAll) return;
    setRetryingAll(true);
    try {
      await onRetryAll();
    } finally {
      setRetryingAll(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[688px]">
        <SheetHeader>
          <SheetTitle className="text-lg">번역본 확인</SheetTitle>
          <SheetDescription className="text-base">
            한국어 원문과 다국어 번역본을 확인합니다.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {FILTER_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className={`px-3 py-1 text-sm font-semibold transition-colors ${
                  selected === key
                    ? 'bg-primary-600 text-white'
                    : 'border border-input text-muted-foreground hover:bg-accent'
                }`}
              >
                {LOCALE_FILTER_LABELS[key]}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-5">
            {selected === 'ko' ? (
              <>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">제목</label>
                  <p className="mt-1 text-lg font-bold">{originalTitle}</p>
                </div>
                {originalPlaceName && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">장소</label>
                    <p className="mt-1 text-sm">{originalPlaceName}</p>
                  </div>
                )}
                {originalAddress && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">주소</label>
                    <p className="mt-1 text-sm">{originalAddress}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">본문</label>
                  <div
                    className="prose prose-sm mt-1 max-w-none"
                    dangerouslySetInnerHTML={{ __html: originalContent }}
                  />
                </div>
              </>
            ) : selectedTranslation?.failed ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <p className="text-sm text-destructive">
                  {LOCALE_FILTER_LABELS[selected]} 번역에 실패했습니다.
                </p>
              </div>
            ) : selectedTranslation ? (
              <>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">제목</label>
                  <p className="mt-1 text-lg font-bold">{selectedTranslation.title}</p>
                </div>
                {selectedTranslation.place_name && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">장소</label>
                    <p className="mt-1 text-sm">{selectedTranslation.place_name}</p>
                  </div>
                )}
                {selectedTranslation.address && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">주소</label>
                    <p className="mt-1 text-sm">{selectedTranslation.address}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">본문</label>
                  <div
                    className="prose prose-sm mt-1 max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedTranslation.content }}
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">번역 데이터가 없습니다.</p>
            )}
          </div>

          {selected !== 'ko' && (
            <div className="mt-[40px] flex items-center gap-3">
              {onRetryLocale && (
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={retrying || retryingAll}
                  className="inline-flex items-center gap-1.5 h-9 bg-gray-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                  <RefreshCwIcon className={`size-3.5 ${retrying ? 'animate-spin' : ''}`} />
                  이 언어만 재번역
                </button>
              )}
              {onRetryAll && (
                <button
                  type="button"
                  onClick={handleRetryAll}
                  disabled={retryingAll || retrying}
                  className="inline-flex items-center gap-1.5 h-9 bg-gray-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                  <RefreshCwIcon className={`size-3.5 ${retryingAll ? 'animate-spin' : ''}`} />
                  전체 언어 재번역
                </button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
