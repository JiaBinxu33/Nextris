"use client";
import Screen from "@/app/components/Screen";
import Tetromino from "@/app/components/Tetromino";
import { TetrominoShape } from "@/app/static/shaps";
import { useState, useEffect } from "react";
import { StoreContext, matrixStore } from "@/app/store";
import Control from "@/app/components/Control";
import { SPEEDS } from "@/app/static/shaps";

const DashLine = ({ position }: { position: "left" | "right" }) => (
  <div className="flex gap-x-[calc(var(--block-size)*0.5)]">
    {position === "left" && (
      <div className="w-[calc(var(--block-size)*3)] h-[calc(var(--block-size)*0.5)] bg-black"></div>
    )}
    <div className="w-[calc(var(--block-size)*0.5)] h-[calc(var(--block-size)*0.5)] bg-black"></div>
    <div className="w-[calc(var(--block-size)*0.5)] h-[calc(var(--block-size)*0.5)] bg-black"></div>
    <div className="w-[calc(var(--block-size)*0.5)] h-[calc(var(--block-size)*0.5)] bg-black"></div>
    {position === "right" && (
      <div className="w-[calc(var(--block-size)*3)] h-[calc(var(--block-size)*0.5)] bg-black"></div>
    )}
  </div>
);

export default function GameBoy() {
  const [blockSize, setBlockSize] = useState(20);
  const handleGetBlockSize = (blockSize: number) => {
    setBlockSize(blockSize);
  };
  const { S, O, L, J, T, Z, I, T_MIRROR, I_MIRROR } = TetrominoShape;

  // --- 核心修改在这里 ---
  useEffect(() => {
    let gameLoopTimeout: NodeJS.Timeout | null = null;

    const loop = () => {
      // 在循环的每一次执行时，都直接从 store 中获取最新的状态
      const {
        isGameStarted,
        isPaused,
        isGameOver,
        isAnimating,
        speedLevel, // 关键：在这里获取最新的 speedLevel
      } = matrixStore;

      if (isGameStarted && !isPaused && !isGameOver && !isAnimating) {
        if (!matrixStore.willCollide()) {
          matrixStore.moveTetromino();
        } else {
          matrixStore.settleTetromino();
        }
      }

      // 1. 根据最新的 speedLevel 计算出下一次循环的间隔时间
      const currentSpeed = SPEEDS[speedLevel - 1];

      // 2. 使用 setTimeout 来安排下一次循环
      //    这样每次循环的间隔时间都可以是动态的
      gameLoopTimeout = setTimeout(loop, currentSpeed);
    };

    // 启动第一次循环
    loop();

    // 组件卸载时，清除定时器
    return () => {
      if (gameLoopTimeout) {
        clearTimeout(gameLoopTimeout);
      }
    };
  }, []); // 3. 空依赖数组，确保这个 useEffect 只运行一次，循环逻辑在内部自持

  return (
    <StoreContext.Provider value={matrixStore}>
      <div
        className="h-full bg-amber-500 rounded-xl aspect-[2/3] relative"
        style={
          {
            "--block-size": `${blockSize}px`,
          } as React.CSSProperties
        }
      >
        <div
          className={`
          w-[80%] 
          h-[58%] 
          border-[calc(var(--block-size)*0.5)] 
          border-black 
          border-t-0
          absolute
          top-[6.5%]
          left-[10%]
        `}
        >
          <div
            className="flex
          items-center
          justify-between
          -translate-y-[calc(var(--block-size)*0.86)]
          w-full
          "
          >
            <DashLine position="left" />
            <h1 className="text-black text-[calc(var(--block-size)*1.5)]">
              俄罗斯方块
            </h1>
            <DashLine position="right" />
          </div>
        </div>
        <Screen onBlockSizeChange={handleGetBlockSize}></Screen>
        <div
          className="
        absolute
        top-[6.5%]
        left-[calc(var(--block-size)*0.5)]
        "
        >
          <Tetromino shape={Z} isColumn />
          <Tetromino shape={T_MIRROR} isColumn />
          <Tetromino shape={O} isColumn />
          <Tetromino shape={I} isColumn />
          <Tetromino shape={T} isColumn />
          <Tetromino shape={L} isColumn />
        </div>
        <div
          className="
        absolute
        top-[6.5%]
        right-[calc(var(--block-size)*0.5)]
        "
        >
          <Tetromino shape={S} isColumn />
          <Tetromino shape={T} isColumn />
          <Tetromino shape={O} isColumn />
          <Tetromino shape={I_MIRROR} isColumn />
          <Tetromino shape={T_MIRROR} isColumn />
          <Tetromino shape={J} isColumn />
        </div>
        <Control></Control>
      </div>
    </StoreContext.Provider>
  );
}
