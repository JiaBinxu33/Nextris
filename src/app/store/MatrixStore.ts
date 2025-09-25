// src/app/store/MatrixStore.ts

import { makeAutoObservable, computed ,runInAction } from "mobx";
import { GRID_HEIGHT, GRID_WIDTH, GRID_BLOCK_STATE } from "@/app/static/grid"; // 1. 导入 GRID_BLOCK_STATE
import { SHAPE_DEFINITIONS, TetrominoShape } from "@/app/static/shaps";
import { getRandomTetromino } from "@/app/utils/getRandomTeromino";

// --- 类型定义 ---
// 2. 更新 CellState 类型，使其使用 GRID_BLOCK_STATE 的值
export type CellState = (typeof GRID_BLOCK_STATE)[keyof typeof GRID_BLOCK_STATE];
export type Grid = CellState[][];
type Direction = 'down' | 'left' | 'right';

// 3. 更新 createEmptyGrid 以使用 HIDDEN 状态
const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.HIDDEN));

interface ICurrentTetromino {
  shape: TetrominoShape;
  position: {
    x: number;
    y: number;
  };
}

export class MatrixStore {
  // --- 状态 (State) ---
  grid: Grid = createEmptyGrid();
  currentTetromino: ICurrentTetromino | null = null;
  nextTetromino: ICurrentTetromino | null = null;

  constructor() {
    makeAutoObservable(this, {
      renderGrid: computed,
    });
  }

  // --- 计算值 (Computed Value) ---
  get renderGrid(): Grid {
    const gridCopy = this.grid.map(row => [...row]);

    if (this.currentTetromino) {
      const { shape, position } = this.currentTetromino;
      const shapeLayout = SHAPE_DEFINITIONS[shape] || [];
      
      shapeLayout.forEach(posKey => {
        const [row, col] = posKey.split('-').map(Number);
        const blockX = position.x + col - 2;
        const blockY = position.y + row - 1;

        if (gridCopy[blockY] && gridCopy[blockY][blockX] !== undefined) {
          // 4. 将正在下落的方块渲染为 VISIBLE 状态
          gridCopy[blockY][blockX] = GRID_BLOCK_STATE.VISIBLE;
        }
      });
    }

    return gridCopy;
  }

  // --- 动作 (Actions) ---
  
  // 5. 重构 settleTetromino 以实现 SETTLED 效果
  settleTetromino = () => {
    if (!this.currentTetromino) {
      return;
    }

    // --- 步骤 1: 将当前方块以“SETTLED”状态立即“画”在背景网格上 ---
    const settledGrid = this.renderGrid;
    for (let y = 0; y < settledGrid.length; y++) {
      for (let x = 0; x < settledGrid[y].length; x++) {
        // 将新固定的 VISIBLE 块变成 SETTLED 块，用于播放闪烁动画
        if (
          settledGrid[y][x] === GRID_BLOCK_STATE.VISIBLE &&
          this.grid[y][x] === GRID_BLOCK_STATE.HIDDEN
        ) {
          settledGrid[y][x] = GRID_BLOCK_STATE.SETTLED;
        }
      }
    }
    this.grid = settledGrid; // UI 立即显示闪烁（变淡）的方块

    // --- 步骤 2: 立即切换到下一个方块，让玩家恢复控制 ---
    this.currentTetromino = this.nextTetromino;
    this.spawnNextTetromino(getRandomTetromino());

    // --- 步骤 3: 在后台调度一个“清理”任务 ---
    // 这个任务只负责将闪烁的方块变成永久固化的方块，不影响玩家当前的操作
    setTimeout(() => {
      runInAction(() => {
        const finalGrid = this.grid.map((row) =>
          row.map((cell) =>
            cell === GRID_BLOCK_STATE.SETTLED ? GRID_BLOCK_STATE.VISIBLE : cell
          )
        );
        this.grid = finalGrid; // 更新网格，闪烁效果结束
      });
    }, 200); // 闪烁动画的持续时间
  };

  spawnTetromino = (shape: TetrominoShape) => {
    this.currentTetromino = {
      shape: shape,
      position: { x: 4, y: 0 },
    };
  };

  spawnNextTetromino = (shape: TetrominoShape) => {
    this.nextTetromino = {
      shape: shape,
      position: { x: 4, y: 0 },
    };
  };
  
  willCollide = (direction: Direction = 'down') => {
    if (!this.currentTetromino) {
      return false;
    }

    let ghostPosition = { ...this.currentTetromino.position };
    if (direction === 'down') {
      ghostPosition.y += 1;
    } else if (direction === 'left') {
      ghostPosition.x -= 1;
    } else if (direction === 'right') {
      ghostPosition.x += 1;
    }

    const ghostTetromino = {
      ...this.currentTetromino,
      position: ghostPosition,
    };

    const { shape, position } = ghostTetromino;
    const shapeLayout = SHAPE_DEFINITIONS[shape] || [];

    for (const posKey of shapeLayout) {
      const [row, col] = posKey.split('-').map(Number);
      const absoluteX = position.x + col - 2;
      const absoluteY = position.y + row - 1;

      if (absoluteX < 0 || absoluteX >= GRID_WIDTH) {
        return true;
      }
      if (absoluteY >= GRID_HEIGHT) {
        return true;
      }
      if (absoluteY < 0) {
        continue;
      }
      
      // 6. 更新碰撞检测逻辑：任何非 HIDDEN 的块都是障碍物
      if (this.grid[absoluteY] && this.grid[absoluteY][absoluteX] !== GRID_BLOCK_STATE.HIDDEN) {
        return true;
      }
    }

    return false;
  };

  moveTetromino = (direction:Direction = "down") =>{
    if (!this.currentTetromino){
      return
    }
    if(direction === 'right' && !this.willCollide("right")){
      this.currentTetromino.position.x += 1;
    }
    if(direction === 'left' && !this.willCollide("left")){
      this.currentTetromino.position.x -= 1;
    }
    if(direction === 'down' && !this.willCollide("down")){
      this.currentTetromino.position.y += 1;
    }
  }


}