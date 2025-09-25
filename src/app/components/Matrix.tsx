"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/app/store";
import Block from "@/app/components/Block";
import { GRID_HEIGHT, GRID_WIDTH } from "@/app/static/grid";

const Matrix = observer(() => {
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
        {renderGrid.map((row, y) =>
          row.map((cellState, x) => (
            <Block
              key={`${y}-${x}`}
              // 核心修改：将 cellState 直接作为 state prop 传递
              state={cellState}
            />
          ))
        )}
      </div>
    </div>
  );
});

export default Matrix;
