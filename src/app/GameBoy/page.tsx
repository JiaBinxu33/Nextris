"use client";
import Screen from "@/app/components/Screen";
import Tetrimino from "@/app/components/Tetromino";
import { TetrominoShape } from "@/app/static/shaps";
import { useState, useEffect } from "react";
import { StoreContext, matrixStore } from "@/app/store"; // 1. 导入我们创建的 Context 和实例
import { getRandomTetromino } from "@/app/utils/getRandomTeromino";
import Control from "@/app/components/Control";

const DashLine = ({ position }: { position: "left" | "right" }) => (
  <div className="flex gap-x-[calc(var(--block-size)*0.5)]">
    {position === "left" && (
      <div className="w-[calc(var(--block-size)*3)] h-[calc(var(--block-size)*0.5)] bg-black"></div>
    )}
    <div className="w-[calc(var(--block-size)*0.5)] h-[calc(var(--block-size)*0.5)] bg-black"></div>
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
  useEffect(() => {
    // 1. 游戏开始时，初始化“当前”和“下一个”方块
    matrixStore.spawnTetromino(getRandomTetromino());
    matrixStore.spawnNextTetromino(getRandomTetromino());

    // 2. 游戏主循环
    const gameLoop = setInterval(() => {
      if (!matrixStore.willCollide()) {
        matrixStore.moveTetromino();
      } else {
        matrixStore.settleTetromino();
      }
    }, 1000);

    return () => {
      clearInterval(gameLoop);
    };
  }, []);
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
          <Tetrimino shape={Z} isColumn></Tetrimino>
          <Tetrimino shape={T_MIRROR} isColumn></Tetrimino>
          <Tetrimino shape={O} isColumn></Tetrimino>
          <Tetrimino shape={I} isColumn></Tetrimino>
          <Tetrimino shape={T} isColumn></Tetrimino>
          <Tetrimino shape={L} isColumn></Tetrimino>
        </div>
        <div
          className="
        absolute
        top-[6.5%]
        right-[calc(var(--block-size)*0.5)]
        "
        >
          <Tetrimino shape={S} isColumn></Tetrimino>
          <Tetrimino shape={T} isColumn></Tetrimino>
          <Tetrimino shape={O} isColumn></Tetrimino>
          <Tetrimino shape={I_MIRROR} isColumn></Tetrimino>
          <Tetrimino shape={T_MIRROR} isColumn></Tetrimino>
          <Tetrimino shape={J} isColumn></Tetrimino>
        </div>
        <Control></Control>
      </div>
    </StoreContext.Provider>
  );
}
