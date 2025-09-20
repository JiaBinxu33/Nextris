"use client";
import { useResponsiveBlockSize } from "@/app/utils/useResponsiveBlockSize";
import Matrix from "@/app/components/Matrix/page";
import { useEffect, useRef } from "react";
import React from "react"; // 导入 React

export default function Screen({
  onBlockSizeChange,
}: {
  onBlockSizeChange?: (size: number) => void;
}) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const blockSize = useResponsiveBlockSize(gameContainerRef);

  useEffect(() => {
    if (typeof onBlockSizeChange === "function") {
      onBlockSizeChange(blockSize);
    }
  }, [blockSize, onBlockSizeChange]);

  return (
    <div
      ref={gameContainerRef}
      className="
        h-1/2 w-2/3 bg-[#9ead86] 
        absolute left-1/2 top-1/10 -translate-x-1/2
        relative
      "
      style={
        {
          // "--block-size": `${blockSize}px`,
          padding: `calc(var(--block-size) * 0.9)`,
        } as React.CSSProperties
      }
    >
      {/* 效果层：同时应用 border 和 box-shadow */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          // 1. 使用 border 创建外层的雕刻效果
          borderStyle: "solid",
          borderWidth: `calc(var(--block-size) * 0.5)`,
          borderTopColor: "#5a634a",
          borderLeftColor: "#5a634a",
          borderBottomColor: "#c8d4b3",
          borderRightColor: "#c8d4b3",

          // 2. 使用 inset box-shadow 创建内部的细线
          //    这个阴影会被画在 border 的内侧
          boxShadow: `inset 0 0 0 calc(var(--block-size) * 0.1) black`,
        }}
      ></div>

      {/* 内容层 */}
      <Matrix />
    </div>
  );
}
