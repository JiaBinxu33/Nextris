import React from "react";
import ActionButton from "@/app/components/ActionButton";
import { useStore } from "@/app/store";

// ResetButton 现在只是 ActionButton 的一个特定配置版本
export default function Rotate() {
  const { rotateTetromino } = useStore();
  const handleClick = () => {
    console.log(1);
    rotateTetromino();
  };
  return (
    <ActionButton
      label="旋转"
      color="bg-blue-600"
      size={5}
      fontSize={1}
      labelPosition={"top-right"}
      onClick={handleClick}
    />
  );
}
