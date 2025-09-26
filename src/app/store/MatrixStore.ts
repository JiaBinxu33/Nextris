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
  rotationIndex: number; // 追踪当前是哪个旋转形态
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
      const { shape, position, rotationIndex } = this.currentTetromino;
      // 2. 根据 rotationIndex 从 SHAPE_DEFINITIONS 获取正确的形状
      const shapeLayout = SHAPE_DEFINITIONS[shape]?.[rotationIndex] || [];
      
      shapeLayout.forEach(posKey => {
        const [row, col] = posKey.split('-').map(Number);
        // 3. 调整坐标计算的基准，以 4x4 网格的中心 (大约 2.5) 为准
        const blockX = position.x + col - 2.5; 
        const blockY = position.y + row - 2.5;

        if (gridCopy[Math.floor(blockY)] && gridCopy[Math.floor(blockY)][Math.floor(blockX)] !== undefined) {
          gridCopy[Math.floor(blockY)][Math.floor(blockX)] = GRID_BLOCK_STATE.VISIBLE;
        }
      });
    }

    return gridCopy;
  }

  // --- 动作 (Actions) ---
  
  // 5. 重构 settleTetromino 以实现 SETTLED 效果
  settleTetromino = () => {
    if (!this.currentTetromino) return;

    // 固化逻辑的第一部分：标记为 SETTLED
    const settledGrid = this.renderGrid;
    for (let y = 0; y < settledGrid.length; y++) {
      for (let x = 0; x < settledGrid[y].length; x++) {
        if (
          settledGrid[y][x] === GRID_BLOCK_STATE.VISIBLE &&
          this.grid[y][x] === GRID_BLOCK_STATE.HIDDEN
        ) {
          settledGrid[y][x] = GRID_BLOCK_STATE.SETTLED;
        }
      }
    }
    this.grid = settledGrid;
    this.currentTetromino = null; // 立即清空，防止渲染冲突

    // 固化逻辑的第二部分：变为 VISIBLE 并检查消行
    setTimeout(() => {
      runInAction(() => {
        const finalGrid = this.grid.map((row) =>
          row.map((cell) =>
            cell === GRID_BLOCK_STATE.SETTLED ? GRID_BLOCK_STATE.VISIBLE : cell
          )
        );
        this.grid = finalGrid;

        // --- 新增的消行逻辑 ---
        this.checkAndClearLines();
      });
    }, 50); // 缩短固化闪烁时间
  };
  
  // --- 新增：检查并处理消行的主方法 ---
  checkAndClearLines = () => {
    const linesToClear: number[] = [];
    
    // 1. 从下到上检查每一行是否已满
    for (let y = 0; y < GRID_HEIGHT; y++) {
      const isLineFull = this.grid[y].every(
        (cell) => cell === GRID_BLOCK_STATE.VISIBLE
      );
      if (isLineFull) {
        linesToClear.push(y);
      }
    }

    // 2. 如果有需要消除的行
    if (linesToClear.length > 0) {
      this.animateAndClear(linesToClear);
    } else {
      // 3. 如果没有，则正常生成下一个方块
      this.spawnNext();
    }
  };

  // --- 新增：处理闪烁动画和删除的核心方法 ---
  animateAndClear = async (lines: number[]) => {
    // 闪烁三次
    for (let i = 0; i < 3; i++) {
      await this.flashLines(lines, GRID_BLOCK_STATE.CLEARING); // 变为 CLEARING (消失)
      await new Promise(resolve => setTimeout(resolve, 100));
      await this.flashLines(lines, GRID_BLOCK_STATE.VISIBLE); // 变为 VISIBLE (出现)
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 动画结束后，执行删除和下落
    runInAction(() => {
      let newGrid = this.grid.filter((_, index) => !lines.includes(index));
      
      const emptyLine = Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.HIDDEN);
      for (let i = 0; i < lines.length; i++) {
        newGrid.unshift([...emptyLine]);
      }
      
      this.grid = newGrid;
      this.spawnNext(); // 生成下一个方块
    });
  };

  // --- 新增：一个辅助方法，用于切换行的状态 ---
  flashLines = (lines: number[], state: CellState) => {
    runInAction(() => {
      const newGrid = this.grid.map((row, y) => {
        if (lines.includes(y)) {
          return row.map(() => state);
        }
        return row;
      });
      this.grid = newGrid;
    });
  };
  
  // --- 新增：生成下一个方塊的通用方法 ---
  spawnNext = () => {
    this.currentTetromino = this.nextTetromino;
    this.spawnNextTetromino(getRandomTetromino());
  }
  
  spawnTetromino = (shape: TetrominoShape) => {
    this.currentTetromino = {
      shape: shape,
      rotationIndex: 0,
      position: { x: 4, y: 0 },
    };
  };

  spawnNextTetromino = (shape: TetrominoShape) => {
    this.nextTetromino = {
      shape: shape,
      rotationIndex: 0,
      position: { x: 4, y: 0 },
    };
  };
  
  willCollide = (
    // a. 它可以接收一个可选的“幽灵方块”对象用于预测
    ghostTetromino: ICurrentTetromino | null = null, 
    // b. 如果不传幽灵方块，则根据方向来自己创建一个 (兼容移动)
    direction: Direction = 'down'
  ) => {
    // 如果连当前方块都没有，那就不可能碰撞
    if (!this.currentTetromino) {
      return true; // 返回 true 以阻止任何操作
    }

    // c. 决定我们到底要测试哪个方块
    const ghostToTest = ghostTetromino || this.createGhostForMove(direction);
    if (!ghostToTest) {
      return true;
    }

    const { shape, position, rotationIndex } = ghostToTest;
    const shapeLayout = SHAPE_DEFINITIONS[shape]?.[rotationIndex] || [];

    for (const posKey of shapeLayout) {
      const [row, col] = posKey.split('-').map(Number);
      const absoluteX = Math.floor(position.x + col - 2.5);
      const absoluteY = Math.floor(position.y + row - 2.5);

      if (absoluteX < 0 || absoluteX >= GRID_WIDTH) {
        return true; // 撞到左右墙壁
      }
      if (absoluteY >= GRID_HEIGHT) {
        return true; // 撞到下边界
      }
      if (absoluteY < 0) {
        continue; // 在屏幕上方，不算碰撞
      }
      if (this.grid[absoluteY] && this.grid[absoluteY][absoluteX] !== GRID_BLOCK_STATE.HIDDEN) {
        return true; // 撞到已固定的方块
      }
    }

    return false; // 如果所有检测都通过，则没有碰撞
  };
  
  // d. 这是一个新的辅助函数，专门为移动操作创建“幽灵”
  createGhostForMove = (direction: Direction): ICurrentTetromino | null => {
    if (!this.currentTetromino) return null;

    let { x, y } = this.currentTetromino.position;
    if (direction === 'down') y += 1;
    if (direction === 'left') x -= 1;
    if (direction === 'right') x += 1;
    
    return { ...this.currentTetromino, position: { x, y } };
  }

  moveTetromino = (direction: Direction = "down") => {
    if (!this.currentTetromino) {
      return;
    }

    // 核心修改：在调用 willCollide 时，
    // 第一个参数传 null (因为我们希望它在内部根据 direction 创建 ghost)，
    // 第二个参数传递 direction。
    if (direction === "right" && !this.willCollide(null, "right")) {
      this.currentTetromino.position.x += 1;
    }
    if (direction === "left" && !this.willCollide(null, "left")) {
      this.currentTetromino.position.x -= 1;
    }
    if (direction === "down" && !this.willCollide(null, "down")) {
      this.currentTetromino.position.y += 1;
    }
  };
  rotateTetromino = () => {
    if (!this.currentTetromino) {
      return;
    }
    const { shape, rotationIndex, position } = this.currentTetromino;
    const rotationStates = SHAPE_DEFINITIONS[shape];
    
    // 1. 计算出“下一个”旋转状态的索引
    const nextRotationIndex = (rotationIndex + 1) % rotationStates.length;

    // 2. 创建一个代表旋转后状态的“幽灵方块”
    const ghostForRotate: ICurrentTetromino = {
      shape: shape,
      rotationIndex: nextRotationIndex, // 使用新的索引
      position: position, // 位置暂时不变
    };

    // 3. 使用我们强大的新 willCollide 函数来预测旋转是否可行
    if (!this.willCollide(ghostForRotate)) {
      // 4. 如果预测没有碰撞，就安全地更新当前方块的旋转索引
      this.currentTetromino.rotationIndex = nextRotationIndex;
    }
    // （高级技巧：如果碰撞了，还可以尝试左右移动一格再试，即“踢墙”，但我们暂时不实现）
  };

  dropTetromino = () =>{
   
    if (!this.currentTetromino) return null;

    let { x, y } = this.currentTetromino.position;

    const ghostTetromino = { ...this.currentTetromino, position: { x, y } };
    // 触碰到方块为结束条件
    while(!this.willCollide(ghostTetromino)){
      ghostTetromino.position.y++;
    }
    ghostTetromino.position.y --;
    this.currentTetromino = ghostTetromino;
    this.settleTetromino();
  }
}