"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/app/store";
import Block from "@/app/components/Block/page";
import { GRID_HEIGHT, GRID_WIDTH } from "@/app/static/grid";

const Matrix = observer(() => {
  // 1. 从 store 中获取【计算好】的 renderGrid 数据
  const { renderGrid } = useStore();

  return (
    <div
      className="inline-flex 
      justify-center items-center 
      border-[calc(var(--block-size)*0.1)] 
      border-black 
      border-solid
      p-[calc(var(--block-size)*0.2)]"
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_WIDTH}, calc(var(--block-size)))`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, calc(var(--block-size)))`,
          gap: `calc(var(--block-size) * 0.1)`,
        }}
      >
        {/* 2. 直接遍历 store 中的 renderGrid 数据来渲染 */}
        {renderGrid.map((row, y) =>
          row.map((cellState, x) => (
            <Block
              key={`${y}-${x}`}
              // 根据 store 中的值 (0 或 1) 来决定 isActive
              isActive={cellState === 1}
            />
          ))
        )}
      </div>
    </div>
  );
});

export default Matrix;
