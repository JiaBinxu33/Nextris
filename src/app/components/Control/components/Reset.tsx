import React from "react";
import ActionButton from "@/app/components/ActionButton"; // 导入我们刚创建的通用按钮

export default function Reset() {
  return (
    <ActionButton
      label="重玩(R)"
      color="bg-red-600"
      size={2.5}
      fontSize={0.8}
    />
  );
}
