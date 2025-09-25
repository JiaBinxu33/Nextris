export const GRID_WIDTH: number = 10;
export const GRID_HEIGHT: number = 20;
// 定义间隙与方块大小的比例
export const GAP_RATIO: number = 0.1;

export const GRID_BLOCK_STATE = {
    HIDDEN: 0,   // 隐藏的，或背景
    VISIBLE: 1,  // 可见的，已固化的普通方块
    SETTLED: 2,  // 刚刚固定的方块 (瞬时状态)
  }