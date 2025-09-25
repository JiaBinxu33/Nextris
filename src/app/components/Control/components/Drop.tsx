import React from "react";
import ActionButton from "@/app/components/ActionButton";

// ResetButton 现在只是 ActionButton 的一个特定配置版本
export default function Drop() {
  return (
    <ActionButton
      label="掉落(space)"
      color="bg-blue-600"
      size={8}
      fontSize={1}
    />
  );
}
