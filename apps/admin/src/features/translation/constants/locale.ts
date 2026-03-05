import type { TranslationLocale } from '@/shared/types/post';

export const LOCALE_LABELS: Record<TranslationLocale, string> = {
  en: 'English',
  ja: '日本語',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  id: 'Bahasa Indonesia',
  vi: 'Tiếng Việt',
  th: 'ภาษาไทย',
};

export const LOCALE_FILTER_LABELS: Record<'ko' | TranslationLocale, string> = {
  ko: '한국어',
  en: '영어',
  ja: '일본어',
  'zh-CN': '중국어',
  'zh-TW': '대만어',
  id: '인도네시아어',
  vi: '베트남어',
  th: '태국어',
};
