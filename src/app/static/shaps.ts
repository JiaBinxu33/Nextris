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

// 核心修改：将 SHAPE_DEFINITIONS 的类型改为 string[][]
// 每个子数组代表一种旋转形态
export const SHAPE_DEFINITIONS: { [key: string]: string[][] } = {
  [TetrominoShape.O]: [
    ["1-2", "1-3", "2-2", "2-3"] // O 型只有一种形态
  ],
  [TetrominoShape.I]: [
      ["2-1", "2-2", "2-3", "2-4"], // 水平
      ["1-2", "2-2", "3-2", "4-2"]  // 垂直
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
  // 装饰用的方块保持不变 (2x4)
  [TetrominoShape.T_MIRROR]: [["1-1", "1-2", "1-3", "2-2"]],
  [TetrominoShape.I_MIRROR]: [["2-1", "2-2", "2-3", "2-4"]],
};