// 我们不再需要 createEnumObject 了，可以删除这一行
// import createEnumObject from "@/app/utils/createEnumObject"

export const COLUMN_COLS = 2;
export const COLUMN_ROWS = 4;

export enum TetrominoShape {
  O = "o",
  L = "l",
  J = "j",
  T = "t",
  S = "s",
  Z = "z",
  I = "i",
  // T_MIRROR 和 I_MIRROR 仅用于装饰，不需要旋转
  T_MIRROR = "tm",
  I_MIRROR = "im",
}

// 方块形状的定义保持不变
export const SHAPE_DEFINITIONS: Record<TetrominoShape, string[][]> = {
  [TetrominoShape.O]: [
    ["1-2", "1-3", "2-2", "2-3"]
  ],
  [TetrominoShape.I]: [
      ["2-1", "2-2", "2-3", "2-4"],
      ["1-2", "2-2", "3-2", "4-2"]
  ],
  [TetrominoShape.L]: [
      ["1-3", "2-1", "2-2", "2-3"],
      ["1-2", "2-2", "3-2", "3-3"],
      ["2-1", "2-2", "2-3", "3-1"],
      ["1-1", "1-2", "2-2", "3-2"]
  ],
  [TetrominoShape.J]: [
      ["1-1", "2-1", "2-2", "2-3"],
      ["1-2", "1-3", "2-2", "3-2"],
      ["2-1", "2-2", "2-3", "3-3"],
      ["1-2", "2-2", "3-1", "3-2"]
  ],
  [TetrominoShape.S]: [
      ["1-2", "1-3", "2-1", "2-2"],
      ["1-1", "2-1", "2-2", "3-2"]
  ],
  [TetrominoShape.Z]: [
      ["1-1", "1-2", "2-2", "2-3"],
      ["1-2", "2-1", "2-2", "3-1"]
  ],
  [TetrominoShape.T]: [
      ["1-2", "2-1", "2-2", "2-3"],
      ["1-2", "2-2", "2-3", "3-2"],
      ["2-1", "2-2", "2-3", "3-2"],
      ["1-2", "2-1", "2-2", "3-2"]
  ],
  [TetrominoShape.T_MIRROR]: [["1-1", "1-2", "1-3", "2-2"]],
  [TetrominoShape.I_MIRROR]: [["2-1", "2-2", "2-3", "2-4"]],
};

// --- 核心修改：只保留 SPEEDS 数组作为唯一数据源 ---

/**
 * 游戏速度数组。数组索引 + 1 即为游戏等级。
 * 例如：SPEEDS[0] 是等级 1 的速度。
 */
export const SPEEDS = [
  800, // 等级 1
  650, // 等级 2
  500, // 等级 3
  370, // 等级 4
  250, // 等级 5
  160, // 等级 6
] as const;


/**
 * 游戏等级的类型定义。
 * 用于在代码中约束等级的取值范围，确保类型安全。
 */
export type GameLevel = 1 | 2 | 3 | 4 | 5 | 6;


/**
 * 消除行数对应的得分。
 * 索引 0 对应消除 1 行，索引 3 对应消除 4 行。
 */
export const CLEAR_POINTS = [100, 300, 700, 1500];