// src/app/store/MatrixStore.ts

import { makeAutoObservable, computed, runInAction } from "mobx";
import { GRID_HEIGHT, GRID_WIDTH, GRID_BLOCK_STATE } from "@/app/static/grid";
import { SHAPE_DEFINITIONS, TetrominoShape ,SPEEDS ,GameLevel } from "@/app/static/shaps";
import { getRandomTetromino } from "@/app/utils/getRandomTeromino";

export type CellState =
  (typeof GRID_BLOCK_STATE)[keyof typeof GRID_BLOCK_STATE];
export type Grid = CellState[][];
type Direction = "down" | "left" | "right";

const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_HEIGHT }, () =>
    Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.HIDDEN)
  );

interface ICurrentTetromino {
  shape: TetrominoShape;
  rotationIndex: number;
  position: {
    x: number;
    y: number;
  };
}

export class MatrixStore {
  grid: Grid = createEmptyGrid();
  currentTetromino: ICurrentTetromino | null = null;
  nextTetromino: ICurrentTetromino | null = null;
  isGameOver: boolean = false;
  isAnimating: boolean = false;
  isPaused:boolean = false;
  clearedLines:number = 0;
  speedLevel:number = 1;
  isGameStarted: boolean = false;

  constructor() {
    makeAutoObservable(this, {
      renderGrid: computed,
    });
  }

  get renderGrid(): Grid {
    const gridCopy = this.grid.map((row) => [...row]);
    if (this.currentTetromino) {
      const { shape, position, rotationIndex } = this.currentTetromino;
      const shapeLayout = SHAPE_DEFINITIONS[shape]?.[rotationIndex] || [];
      shapeLayout.forEach((posKey) => {
        const [row, col] = posKey.split("-").map(Number);
        const blockX = position.x + col - 2.5;
        const blockY = position.y + row - 2.5;
        if (
          gridCopy[Math.floor(blockY)] &&
          gridCopy[Math.floor(blockY)][Math.floor(blockX)] !== undefined
        ) {
          gridCopy[Math.floor(blockY)][Math.floor(blockX)] =
            GRID_BLOCK_STATE.VISIBLE;
        }
      });
    }
    return gridCopy;
  }

  // --- 动画与游戏状态核心修改 ---

  gameOver = () => {
    // 防止在动画播放时重复触发
    if (this.isAnimating) return;

    this.isGameOver = true;
    this.isAnimating = true;
    this.currentTetromino = null; // 立即清除当前方块

    this.playGameOverAnimation();
  };

  playGameOverAnimation = async () => {
    // 阶段 1: 从下往上，用 VISIBLE 状态填充 grid
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      await new Promise((resolve) => setTimeout(resolve, 40));
      runInAction(() => {
        // 直接修改 this.grid 来驱动 Matrix 组件的重新渲染
        this.grid[y] = Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.VISIBLE);
      });
    }

    // 填充完毕后，短暂地停顿一下
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 阶段 2: 从上往下，用 HIDDEN 状态清空 grid
    for (let y = 0; y < GRID_HEIGHT; y++) {
      await new Promise((resolve) => setTimeout(resolve, 40));
      runInAction(() => {
        this.grid[y] = Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.HIDDEN);
      });
    }

    // 阶段 3: 动画完全结束后，重置游戏状态
    runInAction(() => {
      this.isAnimating = false;
      this.isGameStarted = false; // 切换到“未开始”状态，以显示欢迎页
      this.resetGame();
    });
  };

  startGame = () => {
    // 3. 只有在游戏未开始时才能开始
    if (this.isGameStarted) return;
    
    this.isGameStarted = true;
    this.resetGame();
    this.spawnTetromino(getRandomTetromino());
    this.spawnNextTetromino(getRandomTetromino());
  };
  
  // ... (其他所有方法如 settleTetromino, moveTetromino 等保持不变)

  settleTetromino = () => {
    if (!this.currentTetromino) return;

    const { shape, position, rotationIndex } = this.currentTetromino;
    const shapeLayout = SHAPE_DEFINITIONS[shape]?.[rotationIndex] || [];
    for (const posKey of shapeLayout) {
        const [row] = posKey.split('-').map(Number);
        const blockY = Math.floor(position.y + row - 2.5);
        if (blockY < 0) {
            this.gameOver();
            return; 
        }
    }
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
    
    this.currentTetromino = null;
    setTimeout(() => {
      runInAction(() => {
        const finalGrid = this.grid.map((row) =>
          row.map((cell) =>
            cell === GRID_BLOCK_STATE.SETTLED ? GRID_BLOCK_STATE.VISIBLE : cell
          )
        );
        this.grid = finalGrid;
        this.checkAndClearLines();
      });
    }, 50);
  };
  
  checkAndClearLines = () => {
    const linesToClear: number[] = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      const isLineFull = this.grid[y].every(
        (cell) => cell === GRID_BLOCK_STATE.VISIBLE
      );
      if (isLineFull) {
        linesToClear.push(y);
      }
    }
    if (linesToClear.length > 0) {
      runInAction(() => {
        this.clearedLines += linesToClear.length;
      });
      this.animateAndClear(linesToClear);
    } else {
      this.spawnNext();
    }
  };

  animateAndClear = async (lines: number[]) => {
    for (let i = 0; i < 3; i++) {
      await this.flashLines(lines, GRID_BLOCK_STATE.CLEARING);
      await new Promise(resolve => setTimeout(resolve, 100));
      await this.flashLines(lines, GRID_BLOCK_STATE.VISIBLE);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    runInAction(() => {
      let newGrid = this.grid.filter((_, index) => !lines.includes(index));
      const emptyLine = Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.HIDDEN);
      for (let i = 0; i < lines.length; i++) {
        newGrid.unshift([...emptyLine]);
      }
      this.grid = newGrid;
      this.spawnNext();
    });
  };

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
  
  spawnNext = () => {
    this.currentTetromino = this.nextTetromino;
    this.spawnNextTetromino(getRandomTetromino());
  }

  spawnTetromino = (shape: TetrominoShape) => {
    this.currentTetromino = {
      shape: shape,
      rotationIndex: 0,
      position: { x: 5, y: 0 },
    };
  };

  spawnNextTetromino = (shape: TetrominoShape) => {
    this.nextTetromino = {
      shape: shape,
      rotationIndex: 0,
      position: { x: 5, y: 0 },
    };
  };
  
  willCollide = (
    ghostTetromino: ICurrentTetromino | null = null, 
    direction: Direction = 'down'
  ) => {
    if (!this.currentTetromino) {
      return true;
    }
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
        return true;
      }
      if (absoluteY >= GRID_HEIGHT) {
        return true;
      }
      if (absoluteY < 0) {
        continue;
      }
      if (this.grid[absoluteY] && this.grid[absoluteY][absoluteX] !== GRID_BLOCK_STATE.HIDDEN) {
        return true;
      }
    }
    return false;
  };
  
  createGhostForMove = (direction: Direction): ICurrentTetromino | null => {
    if (!this.currentTetromino) return null;
    let { x, y } = this.currentTetromino.position;
    if (direction === 'down') y += 1;
    if (direction === 'left') x -= 1;
    if (direction === 'right') x += 1;
    return { ...this.currentTetromino, position: { x, y } };
  }

  moveTetromino = (direction: Direction = "down") => {
    if (!this.currentTetromino || this.isPaused) {
      return;
    }
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

  adjustStartLevel = (direction: 'left' | 'right') => {
    // 此方法只在游戏未开始时生效
    if (this.isGameStarted) return;

    runInAction(() => {
      let newLevel = this.speedLevel;
      if (direction === 'right') {
        // 等级 +1，如果超过6，则循环回到1
        newLevel = (newLevel + 1 > 6) ? 1 : (newLevel + 1);
      } else { // 'left'
        // 等级 -1，如果小于1，则循环回到6
        newLevel = (newLevel - 1 < 1) ? 6 : (newLevel - 1);
      }
      this.speedLevel = newLevel as GameLevel;
    });
  };

  rotateTetromino = () => {
    if (!this.currentTetromino || this.isPaused) {
      return;
    }
    const { shape, rotationIndex, position } = this.currentTetromino;
    const rotationStates = SHAPE_DEFINITIONS[shape];
    const nextRotationIndex = (rotationIndex + 1) % rotationStates.length;
    const ghostForRotate: ICurrentTetromino = {
      shape: shape,
      rotationIndex: nextRotationIndex,
      position: position,
    };
    if (!this.willCollide(ghostForRotate)) {
      this.currentTetromino.rotationIndex = nextRotationIndex;
    }
  };

  dropTetromino = () =>{
    if (!this.isGameStarted) {
      this.startGame();
      return;
    }

    if (!this.currentTetromino || this.isPaused) {
      return;
    }
    
    let { x, y } = this.currentTetromino.position;
    const ghostTetromino = { ...this.currentTetromino, position: { x, y } };
    while(!this.willCollide(ghostTetromino)){
      ghostTetromino.position.y++;
    }
    ghostTetromino.position.y --;
    this.currentTetromino = ghostTetromino;
    this.settleTetromino();
  }

  gameEnd = () =>{
    this.currentTetromino = null;
    this.grid = []
  }

  resetGame = () => {
    this.grid = createEmptyGrid();
    this.currentTetromino = null; // 4. 重置时确保当前方块为空
    this.nextTetromino = null;
    this.isGameOver = false;
    this.clearedLines = 0; 
  };

  togglePause = () =>{
    if (!this.isGameStarted) {
      this.startGame();
      return;
    }
    if (this.isGameOver || this.isAnimating) return;
    this.isPaused = !this.isPaused;
  }

  setSpeedLevel = (level:GameLevel) =>{
    this.speedLevel = level
  }
}