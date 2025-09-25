import React from "react";
import clsx from "clsx";
import { GRID_BLOCK_STATE } from "@/app/static/grid";
import type { CellState } from "@/app/store/MatrixStore";

// 1. 更新 Props 接口，使其可以同时接受新旧两种属性
interface IBlockProps {
  state?: CellState; // 新的 state 属性 (用于 Matrix)
  isActive?: boolean; // 旧的 isActive 属性 (用于 Tetromino)
  isHidden?: boolean;
}

export default function Block({
  state, // 直接接收 state
  isActive, // 同时接收 isActive
  isHidden = false,
}: IBlockProps) {
  // 2. 核心逻辑：决定最终要使用的状态
  //    - 如果 state prop 被传递了 (来自 Matrix), 则优先使用 state。
  //    - 如果 state prop 未定义 (来自 Tetromino), 则根据 isActive 的值来推断状态。
  const finalState =
    state !== undefined
      ? state
      : isActive
      ? GRID_BLOCK_STATE.VISIBLE
      : GRID_BLOCK_STATE.HIDDEN;

  // 3. 根据最终计算出的 finalState 来决定透明度
  const opacityClass = clsx({
    "opacity-0": isHidden,
    "opacity-100": !isHidden && finalState === GRID_BLOCK_STATE.VISIBLE,
    "opacity-50": !isHidden && finalState === GRID_BLOCK_STATE.SETTLED,
    "opacity-20": !isHidden && finalState === GRID_BLOCK_STATE.HIDDEN,
  });

  return (
    <div
      className={`
        box-border
        w-[var(--block-size)]
        h-[var(--block-size)] 
        border-black 
        border-solid 
        relative 
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
            width: `calc(var(--block-size) * 0.8 * 0.8)`,
            height: `calc(var(--block-size) * 0.8 * 0.8)`,
          } as React.CSSProperties
        }
      ></div>
    </div>
  );
}
