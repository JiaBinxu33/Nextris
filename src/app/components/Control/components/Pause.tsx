import React from "react";
import ActionButton from "@/app/components/ActionButton";

export default function Pause() {
  return (
    <ActionButton
      label="暂停(P)"
      color="bg-red-600"
      size={2.5}
      fontSize={0.8}
    />
  );
}
