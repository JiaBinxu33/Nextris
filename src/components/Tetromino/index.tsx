import useTetrominoShape from "@/utils/hooks/useTetrominoShape";
import TetrominoTemplate from "./components/TetrominoTemplate";
import { TetrominoShape } from "@/static/shaps";

interface ITetrominoProps {
  shape: TetrominoShape;
  isColumn?: boolean; // 加回 isColumn
  showBackground?: boolean;
  rows?: number;
  cols?: number;
}

export default function Tetromino({
  shape,
  isColumn,
  showBackground,
  rows,
  cols,
}: ITetrominoProps) {
  // 1. 核心逻辑：如果 isColumn 为 true，我们强制从 2x4 的数据源生成
  const sourceRows = isColumn ? 2 : rows;
  const sourceCols = isColumn ? 4 : cols;

  let tetrominoData = useTetrominoShape(shape, sourceRows, sourceCols);

  if (showBackground) {
    tetrominoData = tetrominoData.map((block) => ({
      ...block,
      isHidden: false,
    }));
  }

  return (
    <div className="flex-shrink-0">
      <TetrominoTemplate
        tetrominoData={tetrominoData}
        isColumn={isColumn} // 2. 将 isColumn 传递下去
        rows={rows}
        cols={cols}
      ></TetrominoTemplate>
    </div>
  );
}
