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
  labelPosition?: LabelPosition;
}

export default function ActionButton({
  label,
  color,
  size,
  fontSize,
  onClick,
  labelPosition = "bottom",
}: ActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

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
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
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
    <div
      className="flex flex-col items-center justify-center"
      onClick={onClick}
    >
      {ButtonAndLabel}
    </div>
  );
}
