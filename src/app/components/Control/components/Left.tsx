"use client";
import { observer } from "mobx-react-lite"; // 1. 导入 observer
import React from "react";
import { useStore } from "@/app/store";
import ActionButton from "@/app/components/ActionButton";

// 2. 将组件用 observer() 包裹
const Left = observer(() => {
  const { moveTetromino, isGameStarted, adjustStartLevel } = useStore();
  const handleClick = () => {
    if (isGameStarted) {
      moveTetromino("left");
    } else {
      adjustStartLevel("left");
    }
  };
  return (
    <ActionButton
      label="左移"
      color="bg-blue-600"
      size={5}
      fontSize={1}
      onClick={handleClick}
    />
  );
});

export default Left;
