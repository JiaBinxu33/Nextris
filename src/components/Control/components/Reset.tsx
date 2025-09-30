"use client";
import { observer } from "mobx-react-lite"; // 1. 导入 observer
import React from "react";
import ActionButton from "@/components/ActionButton";
import { useStore } from "@/store";
import { useTranslations } from "next-intl";

// 2. 将组件用 observer() 包裹
const Reset = observer(() => {
  const { gameOver } = useStore();
  const t = useTranslations("Control");

  const handleClick = () => {
    gameOver();
  };

  return (
    <ActionButton
      label={t("reset")}
      color="bg-red-600"
      size={2.5}
      fontSize={0.8}
      onClick={handleClick}
    />
  );
});

export default Reset;
