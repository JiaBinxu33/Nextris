import React from "react";
import ActionButton from "@/app/components/ActionButton"; // 导入我们刚创建的通用按钮

// ResetButton 现在只是 ActionButton 的一个特定配置版本
export default function ResetButton() {
  return (
    <ActionButton
      label="音效(M)"
      color="bg-red-600"
      size={2.5}
      fontSize={0.8}
    />
  );
}
