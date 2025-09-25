"use client";
import { observer } from "mobx-react-lite"; // 1. 导入 observer
import { useResponsiveBlockSize } from "@/app/utils/hooks/useResponsiveBlockSize";
import Matrix from "@/app/components/Matrix";
import { useEffect, useRef } from "react"; // 2. 移除 useState
import Number from "@/app/components/Number";
import React from "react";
import Tetromino from "@/app/components/Tetromino";
import { TetrominoShape } from "@/app/static/shaps";
import { useStore } from "@/app/store";

// 3. 将整个组件用 observer 包裹起来
const Screen = observer(
  ({ onBlockSizeChange }: { onBlockSizeChange?: (size: number) => void }) => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const blockSize = useResponsiveBlockSize(gameContainerRef);
    const { nextTetromino } = useStore(); // 4. 直接从 store 中获取下一个方块的状态

    useEffect(() => {
      if (typeof onBlockSizeChange === "function") {
        onBlockSizeChange(blockSize);
      }
    }, [blockSize, onBlockSizeChange]);

    // 5. 关键：创建一个渲染用的变量。
    //    在服务器和客户端初次渲染时，nextTetromino 可能是 null，
    //    我们提供一个固定的 O 形作为备用，确保初次渲染结果一致。
    const shapeToDisplay = nextTetromino?.shape || TetrominoShape.O;

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
            padding: `calc(var(--block-size) * 0.9)`,
          } as React.CSSProperties
        }
      >
        {/* 效果层... */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            borderStyle: "solid",
            borderWidth: `calc(var(--block-size) * 0.5)`,
            borderTopColor: "#5a634a",
            borderLeftColor: "#5a634a",
            borderBottomColor: "#c8d4b3",
            borderRightColor: "#c8d4b3",
            boxShadow: `inset 0 0 0 calc(var(--block-size) * 0.1) black`,
          }}
        ></div>

        {/* 内容层 */}
        <Matrix />
        <div
          className="absolute right-0 flex flex-col"
          style={{
            width: `calc(var(--block-size) * 9)`,
            top: `0`,
            padding: `calc(var(--block-size) * 1)`,
            gap: `calc(var(--block-size) * 0.5)`,
          }}
        >
          {/* 得分、消除行、级别部分保持不变... */}
          <div>
            <p
              className="text-[var(--block-size)]"
              style={{
                marginBottom: "calc(var(--block-size) * 0.5)",
              }}
            >
              得分
            </p>
            <Number number={0}></Number>
          </div>
          <div>
            <p
              className="text-[calc(var(--block-size)*1)]"
              style={{
                marginBottom: "calc(var(--block-size) * 0.5)",
              }}
            >
              消除行
            </p>
            <Number number={0}></Number>
          </div>
          <div>
            <p
              className="text-[calc(var(--block-size)*1)]"
              style={{
                marginBottom: "calc(var(--block-size) * 0.5)",
              }}
            >
              级别
            </p>
            <Number number={0} length={1}></Number>
          </div>
          <div>
            <p
              className="text-[calc(var(--block-size)*1)]"
              style={{
                marginBottom: "calc(var(--block-size) * 0.5)",
              }}
            >
              下一个
            </p>
            <div className="flex justify-end">
              {/* 6. 使用我们准备好的、绝对一致的 shapeToDisplay 变量 */}
              <Tetromino shape={shapeToDisplay} showBackground />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Screen;
