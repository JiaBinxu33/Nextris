// src/app/store/MatrixStore.ts

import { makeAutoObservable, computed } from "mobx";
import { GRID_HEIGHT, GRID_WIDTH } from "@/app/static/grid";
import { SHAPE_DEFINITIONS, TetrominoShape } from "@/app/static/shaps";
import { getRandomTetromino } from "@/app/utils/getRandomTeromino";

// --- 类型定义 ---
export type CellState = 0 | 1;
export type Grid = CellState[][];



const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));

// 定义当前下落方块的状态
interface ICurrentTetromino {
  shape: TetrominoShape;
  position: {
    x: number;
    y: number;
  };
}

function checkCollision(
    tetromino: ICurrentTetromino | null,
    grid: Grid
  ): boolean {
    // 如果没有方块，自然不会碰撞
    if (!tetromino) {
      return false;
    }
  
    const { shape, position } = tetromino;
    const shapeLayout = SHAPE_DEFINITIONS[shape] || [];
  
    // 遍历组成形状的每一个小方块
    for (const posKey of shapeLayout) {
      const [row, col] = posKey.split('-').map(Number);
  
      // 计算出小方块在主棋盘上的绝对坐标
      const absoluteX = position.x + col - 2; // 微调以使其在2x4格子中居中
      const absoluteY = position.y + row - 1;
  
      // --- 开始进行碰撞检测 ---
  
      // a. 检测是否碰到了左右边界
      if (absoluteX < 0 || absoluteX >= GRID_WIDTH) {
        return true; // 碰撞了
      }
  
      // b. 检测是否碰到了下边界
      if (absoluteY >= GRID_HEIGHT) {
        return true; // 碰撞了
      }
      
      // c. 排除掉顶部还在屏幕外的情况 (y < 0)
      if (absoluteY < 0) {
          continue; // 这个小方块还在屏幕上方，跳过对它的检测
      }
  
      // d. 检测是否碰到了【已经固定】的方块
      //    grid[absoluteY] 确保我们检查的行存在
      if (grid[absoluteY] && grid[absoluteY][absoluteX] === 1) {
        return true; // 碰撞了
      }
    }
  
    // 如果所有小方块都没有碰到任何东西，则返回 false
    return false;
  }

export class MatrixStore {
  // --- 状态 (State) ---
  grid: Grid = createEmptyGrid();
  currentTetromino: ICurrentTetromino | null = null; // 新增：代表正在下落的方块
  nextTetromino:ICurrentTetromino | null = null; 
  constructor() {
    makeAutoObservable(this, {
      renderGrid: computed,
    });
  }

  // --- 计算值 (Computed Value) ---
  // 它会自动将 grid 和 currentTetromino 合并成最终的渲染数据
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
          gridCopy[blockY][blockX] = 1;
        }
      });
    }

    return gridCopy;
  }

  // --- 动作 (Actions) ---
  
  settleTetromino = () => {
    // 1. 检查是否有正在下落的方块，如果没有则什么都不做
    if (!this.currentTetromino) {
      return;
    }

    // 2. 直接用 renderGrid 的当前值来更新 grid
    //    这就是“把数据全部存上去”的核心步骤
    this.grid = this.renderGrid;

    // 用下一块替换当前块
    this.currentTetromino = this.nextTetromino;

    // 继续生成下一块
    this.spawnNextTetromino(getRandomTetromino());
  };

  // 新增：生成一个新的方块并放置在顶部
  spawnTetromino = (shape: TetrominoShape) => {
    this.currentTetromino = {
      shape: shape,
      position: { x: 4, y: 0 }, // 这是方块的初始位置
    };
  };

    // 新增：生成一个新的方块并放置在顶部
    spawnNextTetromino = (shape: TetrominoShape) => {
      this.nextTetromino = {
        shape: shape,
        position: { x: 4, y: 0 }, // 这是方块的初始位置
      };
    };
  
  moveDown = () => {
    // 检查当前是否存在一个正在下落的方块
    if (this.currentTetromino) {
      // 直接修改 position.y 的值，MobX 会自动追踪这个变化
      this.currentTetromino.position.y += 1;
    }
  };

  pengZhuang = (): boolean => {
    // 创建一个“幽灵”方块，代表下一步的位置
    const ghostTetromino = this.currentTetromino ? {
      ...this.currentTetromino,
      position: {
        ...this.currentTetromino.position,
        y: this.currentTetromino.position.y + 1, // 试探下一行
      }
    } : null;

    // 使用我们新的、规范化的函数进行检测
    return checkCollision(ghostTetromino, this.grid);
  }
}