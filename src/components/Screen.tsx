"use client";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";

import { useResponsiveBlockSize } from "@/utils/hooks/useResponsiveBlockSize";
import Matrix from "@/components/Matrix";
import Number from "@/components/Number";
import Tetromino from "@/components/Tetromino";
import { TetrominoShape } from "@/static/shaps";
import { useStore } from "@/store";
import ScoreDisplay from "./ScoreDIsplay";
import { useTranslations } from "next-intl";

// 1. <<<--- 导入我们新创建的组件
import MusicIndicator from "@/components/MusicIndicator";
import PauseIndicator from "@/components/PauseIndicator";

const Screen = observer(
  ({ onBlockSizeChange }: { onBlockSizeChange?: (size: number) => void }) => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("Screen");
    const blockSize = useResponsiveBlockSize(gameContainerRef);
    const {
      nextTetromino,
      clearedLines,
      speedLevel,
      isGameStarted,
      startLines,
    } = useStore();
    useEffect(() => {
      if (typeof onBlockSizeChange === "function") {
        onBlockSizeChange(blockSize);
      }
    }, [blockSize, onBlockSizeChange]);

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
        <Matrix />
        <div
          className="absolute right-0 flex flex-col h-full"
          style={{
            width: `calc(var(--block-size) * 9)`,
            top: `0`,
            padding: `calc(var(--block-size) * 1)`,
            gap: `calc(var(--block-size) * 0.5)`,
          }}
        >
          <ScoreDisplay />
          <div>
            <p
              className="text-[calc(var(--block-size)*1)]"
              style={{
                marginBottom: "calc(var(--block-size) * 0.5)",
              }}
            >
              {isGameStarted ? t("clearedLines") : t("startLines")}
            </p>
            <Number number={isGameStarted ? clearedLines : startLines} />
          </div>
          <div>
            <p
              className="text-[calc(var(--block-size)*1)]"
              style={{ marginBottom: "calc(var(--block-size) * 0.5)" }}
            >
              {t("level")}
            </p>
            <Number number={speedLevel} length={1}></Number>
          </div>
          <div>
            <p
              className="text-[calc(var(--block-size)*1)]"
              style={{ marginBottom: "calc(var(--block-size) * 0.5)" }}
            >
              {t("next")}
            </p>
            <div className="flex justify-end">
              <Tetromino
                shape={shapeToDisplay}
                showBackground
                cols={4}
                rows={2}
              />
            </div>
          </div>

          {/* 2. <<<--- 新增右下角的 UI 容器 */}
          <div
            className="absolute flex items-center"
            style={{
              bottom: `calc(var(--block-size) )`,
              right: `calc(var(--block-size) )`,
              gap: `calc(var(--block-size) * 0.5)`,
            }}
          >
            <MusicIndicator />
            <PauseIndicator />
            <Number isTime />
          </div>
        </div>
      </div>
    );
  }
);

export default Screen;
