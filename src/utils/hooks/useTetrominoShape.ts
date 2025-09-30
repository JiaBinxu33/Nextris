import { SHAPE_DEFINITIONS } from "@/static/shaps";

interface ITetrominoData {
  location: number[];
  isActive: boolean;
  isHidden: boolean;
}

// 确保函数签名可以接收 rows 和 cols
export default function useTetrominoShape(
  shape: string,
  rows: number = 4, // 默认 4 行
  cols: number = 4  // 默认 4 列
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