"use client";
import Screen from "@/components/Screen";
import Tetromino from "@/components/Tetromino";
import { TetrominoShape } from "@/static/shaps";
import { useState, useEffect } from "react";
import { StoreContext, matrixStore } from "@/store";
import Control from "@/components/Control";
import { SPEEDS } from "@/static/shaps";
import clsx from "clsx";
import { autorun } from "mobx";
import { saveState } from "@/services/storageService";
import { useTranslations } from "next-intl";
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
  // 2. 【核心修改】新增 isLoading 状态，默认为 true
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("GameBoy");

  // 3. 修改 handleGetBlockSize，当尺寸计算完成后，更新 loading 状态
  const handleGetBlockSize = (newBlockSize: number) => {
    setBlockSize(newBlockSize);
    // 延迟一小段时间再显示，确保浏览器有时间应用新样式
    setTimeout(() => setIsLoading(false), 50);
  };

  const { S, O, L, J, T, Z, I, T_MIRROR, I_MIRROR } = TetrominoShape;

  useEffect(() => {
    // 这个 useEffect 只会在客户端挂载后执行一次
    matrixStore.hydrateState();
  }, []);

  // 游戏主循环 (保持不变)
  useEffect(() => {
    let gameLoopTimeout: NodeJS.Timeout | null = null;
    const loop = () => {
      const { isGameStarted, isPaused, isGameOver, isAnimating, speedLevel } =
        matrixStore;
      if (isGameStarted && !isPaused && !isGameOver && !isAnimating) {
        if (!matrixStore.willCollide()) {
          matrixStore.moveTetromino();
        } else {
          matrixStore.settleTetromino();
        }
      }
      const currentSpeed = SPEEDS[speedLevel - 1];
      gameLoopTimeout = setTimeout(loop, currentSpeed);
    };
    loop();
    return () => {
      if (gameLoopTimeout) {
        clearTimeout(gameLoopTimeout);
      }
    };
  }, []);

  // 键盘事件处理 (保持不变)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { isGameStarted, isAnimating, isGameOver } = matrixStore;
      if (isAnimating || isGameOver) return;
      if (!isGameStarted) {
        if (e.code === "Space" || e.key.toLowerCase() === "p") {
          matrixStore.startGame();
        } else if (e.key === "ArrowLeft") {
          matrixStore.adjustStartLevel("left");
        } else if (e.key === "ArrowRight") {
          matrixStore.adjustStartLevel("right");
        } else if (e.key === "ArrowUp") {
          // 新增
          matrixStore.adjustStartLines("up");
        } else if (e.key === "ArrowDown") {
          // 新增
          matrixStore.adjustStartLines("down");
        }
        return;
      }
      switch (e.key) {
        case "ArrowLeft":
          matrixStore.moveTetromino("left");
          break;
        case "ArrowRight":
          matrixStore.moveTetromino("right");
          break;
        case "ArrowDown":
          matrixStore.moveTetromino("down");
          break;
        case "ArrowUp":
          if (!e.repeat) matrixStore.rotateTetromino();
          break;
      }
      if (e.code === "Space") {
        if (!e.repeat) matrixStore.dropTetromino();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const disposer = autorun(() => {
      // <<<--- 更新 stateToSave 对象
      const stateToSave = {
        grid: matrixStore.grid,
        currentTetromino: matrixStore.currentTetromino,
        nextTetromino: matrixStore.nextTetromino,
        isGameStarted: matrixStore.isGameStarted,
        points: matrixStore.points,
        clearedLines: matrixStore.clearedLines,
        speedLevel: matrixStore.speedLevel,
        musicOn: matrixStore.musicOn,
        maxScore: matrixStore.maxScore, // 新增
        lastScore: matrixStore.lastScore, // 新增
      };
      saveState(stateToSave);
    });
    return () => {
      disposer();
    };
  }, []);

  return (
    <StoreContext.Provider value={matrixStore}>
      {/* 4. 【核心修改】根据 isLoading 状态动态添加 CSS 类 */}
      <div
        className={clsx(
          "h-full bg-amber-500 rounded-xl aspect-[2/3] relative transition-opacity duration-300 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100" // 加载时透明，加载后显示
        )}
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
              {t("title")}
            </h1>
            <DashLine position="right" />
          </div>
        </div>
        {/* 5. 将修改后的 handleGetBlockSize 传递给 Screen 组件 */}
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
