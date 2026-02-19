import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/shared/types/common';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getLocalePath(path: string, locale: Locale): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return cleanPath;
  return `/${locale}${cleanPath}`;
}

export function getHreflangEntries(path: string): { locale: Locale; href: string }[] {
  return LOCALES.map((locale) => ({
    locale,
    href: getLocalePath(path, locale),
  }));
}

export function getXDefaultHref(path: string): string {
  return getLocalePath(path, DEFAULT_LOCALE);
}
