import { SHAPE_DEFINITIONS, TetrominoShape } from "@/static/shaps"; // 1. 导入 TetrominoShape 类型

interface ITetrominoData {
  location: number[];
  isActive: boolean;
  isHidden: boolean;
}

// 2. 将 'shape' 参数的类型从 string 修改为 TetrominoShape
export default function useTetrominoShape(
  shape: TetrominoShape,
  rows: number = 4,
  cols: number = 4
): ITetrominoData[] {
  const activeLocations = SHAPE_DEFINITIONS[shape]?.[0] || [];

  const grid: ITetrominoData[] = [];
  // 循环使用传入的 rows 和 cols
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      const positionKey = `${i}-${j}`;
      const isActive = activeLocations.includes(positionKey);

      grid.push({
        isActive: isActive,
        isHidden: !isActive,
        location: [i, j],
      });
    }
  }

  return grid;
}