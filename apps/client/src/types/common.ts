export const LOCALES = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'id', 'vi', 'th'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ko';

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  id: 'Bahasa Indonesia',
  vi: 'Tiếng Việt',
  th: 'ภาษาไทย',
};
