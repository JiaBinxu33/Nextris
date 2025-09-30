"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import GameBoy from "@/GameBoy/page";
import LangSwitch from "@/components/LanguageSwitcher";
import { locales, defaultLocale, type Locale } from "@/i18n";
import type { AbstractIntlMessages } from "next-intl";

const COOKIE_NAME = "NEXT_LOCALE";

// 一个简单的加载动画组件
function LoadingSpinner() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-green-500">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-black border-t-transparent"></div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<AbstractIntlMessages | null>(null);
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // 在客户端确定语言环境
    const savedLocale = localStorage.getItem(COOKIE_NAME) as Locale | null;
    const finalLocale =
      savedLocale && locales.includes(savedLocale)
        ? savedLocale
        : defaultLocale;
    setLocale(finalLocale);

    // 异步加载确定语言环境的消息
    async function loadMessages() {
      const msgs = (await import(`../../messages/${finalLocale}.json`)).default;
      setMessages(msgs);
    }

    loadMessages();
  }, []);

  // 当消息正在加载时，显示加载动画
  if (!messages) {
    return <LoadingSpinner />;
  }

  return (
    // 将加载的消息和语言环境提供给所有子组件
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="bg-green-500 w-screen h-screen flex justify-center items-center">
        <GameBoy />
        <LangSwitch />
      </div>
    </NextIntlClientProvider>
  );
}
