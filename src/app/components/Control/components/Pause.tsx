"use client";
import { observer } from "mobx-react-lite"; // 1. 导入 observer
import React from "react";
import ActionButton from "@/app/components/ActionButton";
import { useStore } from "@/app/store";

// 2. 将组件用 observer() 包裹
const Pause = observer(() => {
  const { togglePause } = useStore();

  return (
    <ActionButton
      label="暂停(P)"
      color="bg-red-600"
      size={2.5}
      fontSize={0.8}
      onClick={togglePause}
    />
  );
});

export default Pause;
