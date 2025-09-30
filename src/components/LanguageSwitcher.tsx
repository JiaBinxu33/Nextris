"use client";

import { useLocale } from "next-intl";

// import { Button } from '@/components/ui/button';
import { setLocale } from "@/i18n/index";
import { type Locale, locales } from "@/i18n/config";

export default function LangSwitch() {
  const [ZH, EN] = locales;
  const locale = useLocale();

  // 切换语言
  function onChangeLang(value: Locale) {
    const locale = value as Locale;
    setLocale(locale);
  }

  const isZH = locale === ZH;
  const nextLocale = isZH ? EN : ZH;
  const buttonLabel = isZH ? "中" : "EN";
  const title = isZH ? "切换为英文" : "Switch to Chinese";

  return (
    <button
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-700"
      onClick={() => onChangeLang(nextLocale)}
      aria-label="Toggle Lang"
      title={title}
    >
      <span className="text-xs font-semibold tracking-wide">{buttonLabel}</span>
      <span className="sr-only">Toggle Lang</span>
    </button>
  );
}
