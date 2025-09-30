"use client";
import { observer } from "mobx-react-lite";
import React from "react";
import ActionButton from "@/components/ActionButton";
import { useStore } from "@/store";
import { useTranslations } from "next-intl";

const Rotate = observer(() => {
  // 1. 从 store 获取更多的方法和状态
  const { rotateTetromino, isGameStarted, adjustStartLines } = useStore();
  const t = useTranslations("Control");

  const handleClick = () => {
    // 2. 根据游戏状态执行不同操作
    if (isGameStarted) {
      rotateTetromino();
    } else {
      adjustStartLines("up");
    }
  };
  return (
    <ActionButton
      label={t("rotate")}
      color="bg-blue-600"
      size={5}
      fontSize={1}
      labelPosition={"top-right"}
      onClick={handleClick}
    />
  );
});

export default Rotate;
