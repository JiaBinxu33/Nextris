import React from "react";
import clsx from "clsx";

interface IisActive {
  isActive?: boolean;
  isHidden?: boolean;
}

export default function Block({
  isActive = false,
  isHidden = false,
}: IisActive) {
  const opacityClass = clsx({
    "opacity-0": isHidden, // 如果 isHidden 为 true，应用 'opacity-0'
    "opacity-100": !isHidden && isActive, // 如果不隐藏且激活，应用 'opacity-100'
    "opacity-20": !isHidden && !isActive, // 如果不隐藏且不激活，应用 'opacity-20'
  });
  return (
    <div
      className={`
        box-border
        w-[var(--block-size)]
        h-[var(--block-size)] 
        border-black 
        border-solid 
        relative  /* 父容器必须是 relative */
        ${opacityClass}
      `}
      style={{
        borderWidth: `calc(var(--block-size) * 0.1)`,
      }}
    >
      <div
        className={` bg-black  absolute`}
        style={
          {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            // 宽度和高度的计算保持不变
            width: `calc(var(--block-size) * 0.8 * 0.8)`,
            height: `calc(var(--block-size) * 0.8 * 0.8)`,
          } as React.CSSProperties
        }
      ></div>
    </div>
  );
}
