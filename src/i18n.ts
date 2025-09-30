// src/i18n/config.ts
export type Locale = (typeof locales)[number];
export const locales = ['zh', 'en'] as const;
export const defaultLocale: Locale = 'zh';