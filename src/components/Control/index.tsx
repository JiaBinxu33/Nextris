import Reset from "./components/Reset";
import Pause from "./components/Pause";
import Music from "./components/Music";
import Drop from "./components/Drop";
import Rotate from "./components/Rotate";
import Left from "./components/Left";
import Down from "./components/Down";
import Right from "./components/Right";

// 这是一个可选的辅助组件，用于显示中间的箭头
const CenterArrows = () => (
  <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
    <div
      className="grid grid-cols-3 grid-rows-3 text-black"
      style={{
        // --- 关键修改在这里：增大网格容器的宽高 ---
        width: `calc(var(--block-size) * 2.5)`, // 从 1.8 增加到 2.5
        height: `calc(var(--block-size) * 2.5)`, // 从 1.8 增加到 2.5
        fontSize: `calc(var(--block-size) * 0.7)`,
      }}
    >
      {/* 单元格定位逻辑保持不变 */}
      <div className="col-start-2 row-start-1 flex justify-center items-start">
        ▲
      </div>
      <div className="col-start-1 row-start-2 flex justify-start items-center">
        ◀
      </div>
      <div className="col-start-3 row-start-2 flex justify-end items-center">
        ▶
      </div>
      <div className="col-start-2 row-start-3 flex justify-center items-end">
        ▼
      </div>
    </div>
  </div>
);

export default function Control() {
  const dPadContainerSize = 15; // 估算一个足够容纳十字布局的容器尺寸 (2.5 * 3)

  return (
    <div
      className="absolute flex items-end"
      style={{
        // 控制整体组件的位置
        bottom: `calc(var(--block-size) * 1)`,
        left: `calc(var(--block-size) * 2)`,
        gap: `calc(var(--block-size) * 3)`, // 左右两组按钮的间距
      }}
    >
      {/* 左侧按钮组 */}
      <div
        className="flex flex-col items-center"
        style={{ gap: `calc(var(--block-size) * 1)` }}
      >
        <div
          className="flex"
          style={{
            gap: `calc(var(--block-size) * 1.3)`,
          }}
        >
          <Reset />
          <Pause />
          <Music />
        </div>
        <Drop />
      </div>

      {/* 右侧方向按钮组 */}
      <div
        className="relative"
        style={{
          width: `calc(var(--block-size) * ${dPadContainerSize})`,
          height: `calc(var(--block-size) * ${dPadContainerSize})`,
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <Rotate />
        </div>
        <div className="absolute top-1/2 left-[3%] -translate-y-1/2">
          <Left />
        </div>
        <div className="absolute top-1/2 right-[3%] -translate-y-1/2">
          <Right />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <Down />
        </div>
        <CenterArrows />
      </div>
    </div>
  );
}
