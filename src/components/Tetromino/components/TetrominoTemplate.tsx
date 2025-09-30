import Block from "@/components/Block";

interface ITetrominoData {
  location: number[];
  isActive?: boolean;
  isHidden?: boolean;
}

// 1. 在 Props 接口中加回 isColumn
interface TetrominoTemplateProps {
  tetrominoData?: ITetrominoData[];
  isColumn?: boolean; // 用于垂直显示
  rows?: number;
  cols?: number;
}

export default function TetrominoTemplate({
  tetrominoData = [],
  isColumn,
  rows = 4,
  cols = 4,
}: TetrominoTemplateProps) {
  let finalTetrominoData = tetrominoData;

  // 2. 核心修复：将 isColumn 的数据转换逻辑加回来
  if (isColumn && tetrominoData.length > 0) {
    const reorderedData: ITetrominoData[] = [];
    const numSourceRows = 2; // 源数据是 2x4
    const numSourceCols = 4;
    // 遍历目标网格 (4x2)
    for (let i = 0; i < numSourceCols; i++) {
      // 4 行
      for (let j = 0; j < numSourceRows; j++) {
        // 2 列
        // 这是一个将 4x2 坐标映射回原始 2x4 数组索引的公式
        const originalRow = j;
        const originalCol = numSourceCols - 1 - i;
        const originalIndex = originalRow * numSourceCols + originalCol;
        if (tetrominoData[originalIndex]) {
          reorderedData.push(tetrominoData[originalIndex]);
        }
      }
    }
    finalTetrominoData = reorderedData;
  }

  return (
    <div
      className="inline-grid gap-[calc(var(--block-size)*0.1)]"
      style={{
        // 3. 让 Grid 布局响应 isColumn
        gridTemplateRows: `repeat(${isColumn ? 4 : rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${isColumn ? 2 : cols}, minmax(0, 1fr))`,
      }}
    >
      {finalTetrominoData.map((item, index) => (
        <Block
          isActive={item.isActive}
          isHidden={item.isHidden}
          key={index}
        ></Block>
      ))}
    </div>
  );
}
