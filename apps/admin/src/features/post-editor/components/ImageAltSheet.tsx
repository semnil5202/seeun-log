'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

import type { ImageAlt } from '@/features/translation/types';

type ImageAltSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  imageAlts: ImageAlt[];
  onComplete: (alts: ImageAlt[]) => void;
};

export function extractImageSrcs(html: string): string[] {
  if (typeof window === 'undefined') return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const imgs = doc.querySelectorAll('img');
  return Array.from(imgs)
    .map((img) => img.getAttribute('src'))
    .filter((src): src is string => !!src);
}

export function ImageAltSheet({
  open,
  onOpenChange,
  content,
  imageAlts,
  onComplete,
}: ImageAltSheetProps) {
  const imageSrcs = useMemo(() => extractImageSrcs(content), [content]);

  const [alts, setAlts] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (!open) return;
    const map = new Map<string, string>();
    for (const item of imageAlts) {
      map.set(item.src, item.alt);
    }
    setAlts(map);
  }, [open, imageAlts]);

  const handleAltChange = (src: string, alt: string) => {
    setAlts((prev) => {
      const next = new Map(prev);
      next.set(src, alt);
      return next;
    });
  };

  const allFilled = imageSrcs.length > 0 && imageSrcs.every((src) => (alts.get(src) ?? '').trim());

  const handleComplete = () => {
    const result: ImageAlt[] = imageSrcs.map((src) => ({
      src,
      alt: (alts.get(src) ?? '').trim(),
    }));
    onComplete(result);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-[688px]">
        <SheetHeader>
          <SheetTitle className="text-lg">이미지 alt 입력</SheetTitle>
          <SheetDescription className="text-base">
            각 이미지에 대한 설명을 입력해주세요. SEO에 직접 반영됩니다.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {imageSrcs.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              본문에 이미지가 없습니다.
            </p>
          ) : (
            <div className="space-y-6">
              {imageSrcs.map((src, i) => (
                <div key={src} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 pt-1 text-sm font-medium text-muted-foreground">
                      {i + 1}.
                    </span>
                    <img
                      src={src}
                      alt=""
                      className="h-20 w-28 shrink-0 rounded border object-cover"
                    />
                  </div>
                  <Input
                    value={alts.get(src) ?? ''}
                    onChange={(e) => handleAltChange(src, e.target.value)}
                    placeholder="예: 강남 파스타 맛집 내부 전경"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {imageSrcs.length > 0 && (
          <div className="border-t px-4 py-4">
            <button
              type="button"
              onClick={handleComplete}
              disabled={!allFilled}
              className="w-full h-10 bg-primary-600 text-sm font-bold text-white shadow-xs transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              완료
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
