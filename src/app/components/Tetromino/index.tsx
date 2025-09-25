// components/Tetrimino/page.tsx

import useTetrominoShape from "@/app/utils/hooks/useTetrominoShape";
import TetrominoTemplate from "./components/TetrominoTemplate";
import { TetrominoShape } from "@/app/static/shaps";

interface ITetrominoProps {
  shape: TetrominoShape;
  isColumn?: boolean;
  showBackground?: boolean; // <-- 新增属性
}

export default function Tetromino({
  shape,
  isColumn,
  showBackground,
}: ITetrominoProps) {
  let tetrominoData = useTetrominoShape(shape);

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
        isColumn={isColumn}
      ></TetrominoTemplate>
    </div>
  );
}
