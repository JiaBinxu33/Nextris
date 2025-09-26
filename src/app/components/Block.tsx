import React from "react";
import clsx from "clsx";
import { GRID_BLOCK_STATE } from "@/app/static/grid";
import type { CellState } from "@/app/store/MatrixStore";

interface IBlockProps {
  state?: CellState;
  isActive?: boolean;
  isHidden?: boolean;
}

export default function Block({
  state,
  isActive,
  isHidden = false,
}: IBlockProps) {
  const finalState =
    state !== undefined
      ? state
      : isActive
      ? GRID_BLOCK_STATE.VISIBLE
      : GRID_BLOCK_STATE.HIDDEN;

  const opacityClass = clsx({
    "opacity-0": isHidden || finalState === GRID_BLOCK_STATE.CLEARING, // CLEARING 状态时也设为透明
    "opacity-100": !isHidden && finalState === GRID_BLOCK_STATE.VISIBLE,
    "opacity-75": !isHidden && finalState === GRID_BLOCK_STATE.SETTLED,
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
        transition-opacity duration-50 /* 让闪烁更快速 */
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
