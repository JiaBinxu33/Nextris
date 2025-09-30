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
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  labelPosition?: LabelPosition;
}

export default function ActionButton({
  label,
  color,
  size,
  fontSize,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  labelPosition = "bottom",
}: ActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
    onMouseDown?.();
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    onMouseUp?.();
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    onMouseLeave?.();
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
            ? `inset 0 calc(var(--block-size) * 0.2) calc(var(--block-size) * 0.2) rgba(0,0,0,0.8), inset 0 calc(var(--block-size) * -0.2) calc(var(--block-size) * 0.2) rgba(255,255,255,0.8)`
            : `inset 0 calc(var(--block-size) * 0.2) calc(var(--block-size) * 0.2) rgba(255,255,255,0.8), inset 0 calc(var(--block-size) * -0.2) calc(var(--block-size) * 0.2) rgba(0,0,0,0.8)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      />
      <p
        className={clsx(
          "text-black",
          labelPosition === "bottom" && "mt-[calc(var(--block-size)*0.25)]",
          labelPosition === "top-right" &&
            "absolute top-0 right-0 translate-x-[100%] -translate-y-1/4"
        )}
        style={{
          fontSize: `calc(var(--block-size) * ${fontSize})`,
          textAlign: "center",
          display: "inline-block",
          // 固定高度，允许溢出；不省略、不换行
          height: labelPosition === "bottom" ? "2em" : "1.2em",
          lineHeight: 1.1,
          whiteSpace: "nowrap",
          overflow: "visible",
          width:
            labelPosition === "bottom"
              ? `calc(var(--block-size) * ${size})`
              : undefined,
        }}
      >
        {label}
      </p>
    </>
  );

  if (labelPosition === "top-right") {
    return (
      <div
        className="relative"
        style={{ width: `calc(var(--block-size) * ${size})` }}
      >
        {ButtonAndLabel}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ width: `calc(var(--block-size) * ${size})` }}
    >
      {ButtonAndLabel}
    </div>
  );
}
