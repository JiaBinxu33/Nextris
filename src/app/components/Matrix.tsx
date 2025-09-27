"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/app/store";
import Block from "@/app/components/Block";
import { GRID_HEIGHT, GRID_WIDTH } from "@/app/static/grid";
import Welcome from "@/app/components/Welcome";

const Matrix = observer(() => {
  // 2. 从 store 中获取游戏结束状态和重启方法
  const { renderGrid, isGameStarted } = useStore();

  return (
    // 3. 将根 div 设为 relative，为内部的 GameOver 组件提供定位参考
    <div
      className="relative inline-flex 
      justify-center items-center 
      border-[calc(var(--block-size)*0.1)] 
      border-black 
      border-solid
      p-[calc(var(--block-size)*0.2)]"
    >
      {!isGameStarted && <Welcome />}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_WIDTH}, calc(var(--block-size)))`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, calc(var(--block-size)))`,
          gap: `calc(var(--block-size) * 0.1)`,
        }}
      >
        {renderGrid.map((row, y) =>
          row.map((cellState, x) => (
            <Block key={`${y}-${x}`} state={cellState} />
          ))
        )}
      </div>
    </div>
  );
});

export default Matrix;
