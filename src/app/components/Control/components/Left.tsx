import React from "react";
import { useStore } from "@/app/store";
import ActionButton from "@/app/components/ActionButton";

// ResetButton 现在只是 ActionButton 的一个特定配置版本
export default function Left() {
  const { moveTetromino } = useStore();
  const handleClick = () => {
    moveTetromino("left");
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
}
