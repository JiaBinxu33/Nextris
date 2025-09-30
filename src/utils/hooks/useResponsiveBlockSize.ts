import { useState, useLayoutEffect } from "react";
import type { RefObject } from "react";
import { GRID_WIDTH, GRID_HEIGHT, GAP_RATIO } from "@/static/grid";

export function useResponsiveBlockSize(
  containerRef: RefObject<HTMLDivElement | null>
) {
  const [blockSize, setBlockSize] = useState(20); // 默认值

  useLayoutEffect(() => {
    const calculateSize = () => {
      if (containerRef?.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();

        const matrixWidth = width * 0.6;
        const matrixHeight = height * 0.934;

        // --- 精确计算逻辑 ---

        // 定义在 Matrix 组件中使用的 padding 和 border 的比例
        const PADDING_RATIO = 0.2; // 来自 Matrix 组件的 p-[calc(var(--block-size)*0.2)]
        const BORDER_RATIO = 0.1;  // 来自 Matrix 组件的 border-[calc(var(--block-size)*0.1)]

        // 1. 横向总单元数 = 10个方块 + 9个间隙 + 左右padding + 左右border
        const totalHorizontalUnits =
          GRID_WIDTH +
          (GRID_WIDTH - 1) * GAP_RATIO +
          2 * PADDING_RATIO +
          2 * BORDER_RATIO;
        
        // 2. 纵向总单元数 = 20个方块 + 19个间隙 + 上下padding + 上下border
        const totalVerticalUnits =
          GRID_HEIGHT +
          (GRID_HEIGHT - 1) * GAP_RATIO +
          2 * PADDING_RATIO +
          2 * BORDER_RATIO;

        // 3. 分别基于宽度和高度，计算出理论上最大的 blockSize
        const blockSizeBasedOnWidth = matrixWidth / totalHorizontalUnits;
        const blockSizeBasedOnHeight = matrixHeight / totalVerticalUnits;

        // 4. 取其中较小的值，以确保整个网格都能在容器内显示
        const newBlockSize = Math.min(
          blockSizeBasedOnWidth,
          blockSizeBasedOnHeight
        );
        
        setBlockSize(newBlockSize);
      }
    };

    calculateSize(); // 初始计算

    window.addEventListener("resize", calculateSize);
    return () => window.removeEventListener("resize", calculateSize);
  }, [containerRef]);

  return blockSize;
}