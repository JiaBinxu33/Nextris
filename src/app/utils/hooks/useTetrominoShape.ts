import {SHAPE_DEFINITIONS} from "@/app/static/shaps"

// 定义返回的数据结构
interface ITetrominoData {
  location: number[];
  isActive: boolean;
  isHidden: boolean;
}


interface IUseTetrominoShape {
  isMatrix?:boolean,
  shape:string
}

export default function useTetrominoShape(shape:string): ITetrominoData[] {
  // 2. 获取当前形状需要点亮的坐标数组
  const activeLocations = SHAPE_DEFINITIONS[shape] || [];

  // 3. 生成一个完整的 2x4 背景网格
  const grid: ITetrominoData[] = [];
  for (let i = 1; i <= 2; i++) {
    for (let j = 1; j <= 4; j++) {
      const positionKey = `${i}-${j}`;
      // 4. 判断当前坐标是否在需要点亮的坐标数组中
      const isActive = activeLocations.includes(positionKey);

      grid.push({
        isActive: isActive,
        isHidden: !isActive, // 如果不激活，那就隐藏
        location: [i, j],
      });
    }
  }

  return grid;
}