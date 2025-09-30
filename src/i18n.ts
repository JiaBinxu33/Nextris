export const locales = ['en', 'zh'] as const;
export const defaultLocale = 'en'; // 默认语言
export type Locale = typeof locales[number];
