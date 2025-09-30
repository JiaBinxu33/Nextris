// src/app/page.tsx
import GameBoy from "@/GameBoy/page";
import LangSwitch from "@/components/LanguageSwitcher";

export default function Home() {
  // 不再需要处理 params
  return (
    <div className="bg-green-500 w-screen h-screen flex justify-center">
      <GameBoy />
      <LangSwitch></LangSwitch>
    </div>
  );
}
