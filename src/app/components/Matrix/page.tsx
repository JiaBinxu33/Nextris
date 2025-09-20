"use client";
import { GRID_HEIGHT, GRID_WIDTH } from "@/app/static/grid";
import Block from "@/app/components/Block/page";
import type { ReactElement } from "react";

export default function Matrix() {
  // --- 计算结束 ---

  const cells: ReactElement[] = [];
  for (let i = 0; i < GRID_HEIGHT; i++) {
    for (let j = 0; j < GRID_WIDTH; j++) {
      cells.push(<Block key={`${i}-${j}`}></Block>);
    }
  }

  return (
    // 使用一个 Flexbox 容器来居中网格，因为计算出的网格不一定会占满全部空间
    <div
      className="inline-flex 
      justify-center items-center 
      border-[calc(var(--block-size)*0.1)] 
      border-black 
      border-solid
      p-[calc(var(--block-size)*0.2)]
    "
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_WIDTH}, calc(var(--block-size)))`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, calc(var(--block-size)))`,
          gap: `calc(var(--block-size) * 0.1)`, // 启用 gap 属性
        }}
      >
        {cells}
      </div>
    </div>
  );
}
