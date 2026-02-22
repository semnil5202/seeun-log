import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/shared/types/common';

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

export const getLocalePath = (path: string, locale: Locale): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return cleanPath;
  return `/${locale}${cleanPath}`;
};

export const getHreflangEntries = (path: string): { locale: Locale; href: string }[] =>
  LOCALES.map((locale) => ({
    locale,
    href: getLocalePath(path, locale),
  }));

export const getXDefaultHref = (path: string): string => getLocalePath(path, DEFAULT_LOCALE);
