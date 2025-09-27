"use client";
import { observer } from "mobx-react-lite"; // 1. 导入 observer
import React from "react";
import ActionButton from "@/app/components/ActionButton";
import { useStore } from "@/app/store";

// 2. 将组件用 observer() 包裹
const Right = observer(() => {
  const { moveTetromino, isGameStarted, adjustStartLevel } = useStore();
  const handleClick = () => {
    if (isGameStarted) {
      moveTetromino("right");
    } else {
      adjustStartLevel("right");
    }
  };
  return (
    <ActionButton
      label="右移"
      color="bg-blue-600"
      size={5}
      fontSize={1}
      onClick={handleClick}
    />
  );
});

export default Right;
