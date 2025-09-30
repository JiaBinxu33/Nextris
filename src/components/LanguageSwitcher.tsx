"use client";

import { useEffect, useState } from "react";
import { locales, defaultLocale, type Locale } from "@/i18n";

const COOKIE_NAME = "NEXT_LOCALE";

export default function LangSwitch() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // 组件加载时，从 localStorage 读取语言环境
    const savedLocale = localStorage.getItem(COOKIE_NAME) as Locale | null;
    if (savedLocale && locales.includes(savedLocale)) {
      setCurrentLocale(savedLocale);
    }
  }, []);

  function onChangeLang(newLocale: Locale) {
    localStorage.setItem(COOKIE_NAME, newLocale);
    // 重新加载页面以应用新的语言包
    window.location.reload();
  }

  const isZH = currentLocale === "zh";
  const nextLocale = isZH ? "en" : "zh";
  const buttonLabel = isZH ? "中" : "EN";
  const title = isZH ? "切换为英文" : "Switch to Chinese";

  return (
    <button
      className="fixed top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-700"
      onClick={() => onChangeLang(nextLocale)}
      aria-label="Toggle Lang"
      title={title}
    >
      <span className="text-sm font-semibold tracking-wide">{buttonLabel}</span>
      <span className="sr-only">Toggle Lang</span>
    </button>
  );
}
