import Block from "@/app/components/Block";
import clsx from "clsx";

// --- 接口和默认数据部分保持不变 ---

interface ITetrominoData {
  location: number[];
  isActive?: boolean;
  isHidden?: boolean;
  showBackground?: boolean;
}

interface TetrominoTemplateProps {
  tetrominoData?: ITetrominoData[];
  isColumn?: boolean;
}

const defaultTetrominoData: ITetrominoData[] = [];
for (let i = 0; i < 2; i++) {
  for (let j = 0; j < 4; j++) {
    defaultTetrominoData.push({
      isActive: false,
      isHidden: false,
      location: [i, j],
    });
  }
}

export default function TetrominoTemplate({
  tetrominoData = defaultTetrominoData,
  isColumn,
}: TetrominoTemplateProps) {
  // 1. 根据 isColumn 状态决定最终要渲染的数据
  //    这是解决布局切换的关键
  let finalTetrominoData = tetrominoData;
  if (isColumn) {
    // 当需要垂直布局时，我们对数组进行重新排序
    const reorderedData: ITetrominoData[] = [];
    const numRows = 4;
    const numCols = 2;
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        // 这是一个将 4x2 坐标映射回原始 2x4 数组索引的公式
        const originalRow = j;
        const originalCol = numRows - 1 - i;
        const originalIndex = originalRow * 4 + originalCol;
        reorderedData.push(tetrominoData[originalIndex]);
      }
    }
    finalTetrominoData = reorderedData;
  }

  return (
    <div
      className={clsx(
        "inline-grid gap-[calc(var(--block-size)*0.1)]",
        // 2. 根据 isColumn 状态，简单地切换 grid 的行列类
        isColumn ? "grid-rows-4 grid-cols-2" : "grid-rows-2 grid-cols-4"
      )}
    >
      {finalTetrominoData.map((item, index) => (
        <Block
          isActive={item.isActive}
          isHidden={item.isHidden}
          // 使用 index 作为 key，因为位置会变
          key={index}
        ></Block>
      ))}
    </div>
  );
}
