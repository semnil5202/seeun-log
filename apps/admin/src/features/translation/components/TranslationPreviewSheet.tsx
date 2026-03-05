'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

import type { TranslationResult } from '../types';
import { LOCALE_LABELS } from '../constants/locale';

type TranslationPreviewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalTitle: string;
  originalContent: string;
  translations: TranslationResult[];
};

export function TranslationPreviewSheet({
  open,
  onOpenChange,
  originalTitle,
  originalContent,
  translations,
}: TranslationPreviewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[688px]">
        <SheetHeader>
          <SheetTitle>번역본 확인</SheetTitle>
          <SheetDescription>한국어 원문과 다국어 번역본을 확인합니다.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <section>
            <h3 className="text-sm font-bold text-primary-600">한국어 (원문)</h3>
            <h4 className="mt-2 text-lg font-bold">{originalTitle}</h4>
            <div
              className="prose prose-sm mt-2 max-w-none"
              dangerouslySetInnerHTML={{ __html: originalContent }}
            />
          </section>

          {translations.map((tr) => (
            <section key={tr.locale}>
              <Separator className="my-6" />
              <h3 className="text-sm font-bold text-primary-600">
                {LOCALE_LABELS[tr.locale]}
              </h3>
              <h4 className="mt-2 text-lg font-bold">{tr.title}</h4>
              {tr.place_name && (
                <p className="mt-1 text-sm text-muted-foreground">{tr.place_name}</p>
              )}
              {tr.address && (
                <p className="text-sm text-muted-foreground">{tr.address}</p>
              )}
              <div
                className="prose prose-sm mt-2 max-w-none"
                dangerouslySetInnerHTML={{ __html: tr.content }}
              />
            </section>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
