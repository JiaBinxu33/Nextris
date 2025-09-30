import React from "react";
import ActionButton from "@/components/ActionButton"; // 导入我们刚创建的通用按钮
import { useStore } from "@/store";
import { useTranslations } from "next-intl";

export default function MusicButton() {
  const { toggleMusic } = useStore();
  const t = useTranslations("Control");

  return (
    <ActionButton
      label={t("music")}
      color="bg-red-600"
      size={2.5}
      fontSize={0.8}
      onClick={toggleMusic}
    />
  );
}
