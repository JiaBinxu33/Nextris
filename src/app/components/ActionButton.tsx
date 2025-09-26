"use client";

import React, { useState } from "react";
import clsx from "clsx";

type LabelPosition = "bottom" | "top-right";

interface ActionButtonProps {
  label: string;
  color: string;
  size: number;
  fontSize: number;
  onClick?: () => void;
  onMouseDown?: () => void; // 1. 新增 onMouseDown prop
  onMouseUp?: () => void; // 2. 新增 onMouseUp prop
  onMouseLeave?: () => void; // 3. 新增 onMouseLeave, 防止鼠标移出时按钮卡住
  labelPosition?: LabelPosition;
}
export default function ActionButton({
  label,
  color,
  size,
  fontSize,
  onClick,
  onMouseDown, // 接收 onMouseDown
  onMouseUp, // 接收 onMouseUp
  onMouseLeave, // 接收 onMouseLeave
  labelPosition = "bottom",
}: ActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  // 4. 在内部事件处理函数中，调用从 props 传入的函数
  const handleMouseDown = () => {
    setIsPressed(true);
    onMouseDown?.(); // 如果 onMouseDown 存在，则调用它
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    onMouseUp?.(); // 如果 onMouseUp 存在，则调用它
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    onMouseLeave?.(); // 如果 onMouseLeave 存在，则调用它
  };

  const ButtonAndLabel = (
    <>
      <div
        className={clsx(
          "rounded-full flex items-center justify-center cursor-pointer transition-all duration-100 ease-out",
          color
        )}
        style={{
          width: `calc(var(--block-size) * ${size})`,
          height: `calc(var(--block-size) * ${size})`,
          boxShadow: isPressed
            ? `
              inset 0 calc(var(--block-size) * 0.2) calc(var(--block-size) * 0.2) rgba(0,0,0,0.8),
              inset 0 calc(var(--block-size) * -0.2) calc(var(--block-size) * 0.2) rgba(255,255,255,0.8)
            `
            : `
              inset 0 calc(var(--block-size) * 0.2) calc(var(--block-size) * 0.2) rgba(255,255,255,0.8),
              inset 0 calc(var(--block-size) * -0.2) calc(var(--block-size) * 0.2) rgba(0,0,0,0.8)
            `,
        }}
        // 5. 将内部事件处理器绑定到按钮上
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      />
      <p
        className={clsx(
          "text-black",
          labelPosition === "bottom" && "mt-[calc(var(--block-size)*0.5)]",

          // --- 关键修改在这里 ---
          // 将 translate 的幅度从 1/4 增加到 1/2
          labelPosition === "top-right" &&
            "absolute top-0 right-0 translate-x-[100%] -translate-y-1/4"
        )}
        style={{
          fontSize: `calc(var(--block-size) * ${fontSize})`,
        }}
      >
        {label}
      </p>
    </>
  );

  if (labelPosition === "top-right") {
    return <div className="relative">{ButtonAndLabel}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {ButtonAndLabel}
    </div>
  );
}
