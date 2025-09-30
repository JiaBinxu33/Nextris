"use client";
import { observer } from "mobx-react-lite"; // 1. 导入 observer
import React from "react";
import ActionButton from "@/components/ActionButton";
import { useStore } from "@/store";
import { useTranslations } from "next-intl";

// 2. 将组件用 observer() 包裹
const Drop = observer(() => {
  const { dropTetromino } = useStore();
  const handleClick = () => {
    dropTetromino();
  };
  const t = useTranslations("Control");
  return (
    <ActionButton
      label={t("drop")}
      color="bg-blue-600"
      size={8}
      fontSize={1}
      onClick={handleClick}
    />
  );
});

export default Drop;
