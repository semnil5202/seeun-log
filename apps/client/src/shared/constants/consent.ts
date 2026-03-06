import type { Locale } from '@/shared/types/common';

export const CONSENT_REQUIRED_LOCALES: readonly Locale[] = ['en', 'ja', 'zh-CN', 'th'] as const;

export const CONSENT_COOKIE_NAME = 'cookie_consent';

export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
