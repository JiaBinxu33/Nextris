/*
 * MatrixStore
 * - 负责俄罗斯方块的网格状态、当前/下一方块、分数、关卡、动画与音频控制
 * - 使用 MobX 管理状态，向视图层提供可观察的渲染网格
 */
// src/app/store/MatrixStore.ts

import { makeAutoObservable, computed, runInAction } from "mobx";
import { GRID_HEIGHT, GRID_WIDTH, GRID_BLOCK_STATE } from "@/static/grid";
import { SHAPE_DEFINITIONS, TetrominoShape ,BASE_POINTS_PER_PIECE,LEVEL_BONUS_MULTIPLIER ,GameLevel ,CLEAR_POINTS } from "@/static/shaps";
import { getRandomTetromino } from "@/utils/getRandomTeromino";
import {calculateScore} from "@/utils/calculateScore"
import { audioService } from "@/services/audioService";
import { loadState } from "@/services/storageService";

// 单元格状态别名
export type CellState =
  (typeof GRID_BLOCK_STATE)[keyof typeof GRID_BLOCK_STATE];
export type Grid = CellState[][];
// 方向类型
type Direction = "down" | "left" | "right";

// 创建空矩阵
const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_HEIGHT }, () =>
    Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.HIDDEN)
  );

// 根据起始行数创建初始矩阵（底部随机挖洞的障碍行）
const createStartGrid = (startLines: number): Grid => {
  if (startLines === 0) {
    return createEmptyGrid();
  }
  const grid: Grid = [];
  // 生成底部障碍行（每行随机 1~3 个空洞）
  for (let i = 0; i < startLines; i++) {
    const line = Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.VISIBLE);
    const holes = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < holes; j++) {
      const holeIndex = Math.floor(Math.random() * GRID_WIDTH);
      line[holeIndex] = GRID_BLOCK_STATE.HIDDEN;
    }
    grid.push(line);
  }
  // 顶部补充空行
  const emptyLinesToAdd = GRID_HEIGHT - startLines;
  for (let i = 0; i < emptyLinesToAdd; i++) {
    grid.unshift(Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.HIDDEN));
  }
  return grid;
};

export interface ICurrentTetromino {
  // 方块类型
  shape: TetrominoShape;
  // 旋转状态索引
  rotationIndex: number;
  // 左上角参考点坐标
  position: {
    x: number;
    y: number;
  };
}

export class MatrixStore {
  // 渲染所用网格
  grid: Grid = createEmptyGrid();
  // 当前活动方块
  currentTetromino: ICurrentTetromino | null = null;
  // 下一个方块（用于预览）
  nextTetromino: ICurrentTetromino | null = null;
  // 游戏是否结束
  isGameOver: boolean = false;
  // 是否处于动画播放中（屏蔽交互）
  isAnimating: boolean = false;
  // 是否暂停
  isPaused:boolean = false;
  // 累计消除行数
  clearedLines:number = 0;
  // 当前速度等级（1~6）
  speedLevel:GameLevel = 1;
  // 游戏是否已开始（控制欢迎页/主界面）
  isGameStarted: boolean = false;
  // 当前分数
  points: number = 0;
  // 音乐开关
  musicOn: boolean = true;
  // 最高分
  maxScore: number = 0;
  // 上次得分
  lastScore: number = 0;
  // 起始障碍行数（0~10）
  startLines: number = 0;

  constructor() {
    makeAutoObservable(this, {
      renderGrid: computed,
    });
    audioService.init();
    // 可选：从本地存储恢复状态
    // this.hydrateState();
  }

  // 从本地存储恢复状态
  hydrateState = () => {
    const savedState = loadState();
    if (savedState) {
      runInAction(() => {
        this.grid = savedState.grid;
        this.currentTetromino = savedState.currentTetromino;
        this.nextTetromino = savedState.nextTetromino;
        this.isGameStarted = savedState.isGameStarted;
        this.points = savedState.points;
        this.clearedLines = savedState.clearedLines;
        this.speedLevel = savedState.speedLevel;
        this.musicOn = savedState.musicOn;
        this.maxScore = savedState.maxScore || 0;
        this.lastScore = savedState.lastScore || 0;
        audioService.setMuted(!this.musicOn);
      });
    }
  }

  // 计算属性：叠加当前活动方块后的渲染网格
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

  // --- 动画与游戏状态 ---

  // 触发游戏结束与收尾动画
  gameOver = () => {
    // 动画播放中避免重复触发
    if (this.isAnimating) return;
    audioService.playGameOver(); 

    this.isGameOver = true;
    this.isAnimating = true;
    this.currentTetromino = null; // 立即清除当前方块
    this.playGameOverAnimation();
  };

  // 游戏结束动画：
  // 1) 自下而上填充；2) 短暂停顿；3) 自上而下清空；4) 重置状态
  playGameOverAnimation = async () => {
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      await new Promise((resolve) => setTimeout(resolve, 40));
      runInAction(() => {
        // 直接修改 grid 以驱动重新渲染
        this.grid[y] = Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.VISIBLE);
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    for (let y = 0; y < GRID_HEIGHT; y++) {
      await new Promise((resolve) => setTimeout(resolve, 40));
      runInAction(() => {
        this.grid[y] = Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.HIDDEN);
      });
    }

    runInAction(() => {
      this.isAnimating = false;
      this.isGameStarted = false; // 切回“未开始”，显示欢迎页
      this.lastScore = this.points;
      if (this.points > this.maxScore) {
        this.maxScore = this.points;
      }
      this.resetGame();

    });
  };

  // 开始新游戏：设置初始状态并生成当前/下一个方块
  startGame = () => {
    if (this.isGameStarted) return;
    audioService.playStart();
    runInAction(() => {
      this.isGameStarted = true;
      this.isPaused = false;
      this.isGameOver = false;
      // 使用起始行数生成初始矩阵
      this.grid = createStartGrid(this.startLines);
      this.clearedLines = 0;
      this.points = 0;
    });
    
    this.spawnTetromino(getRandomTetromino());
    this.spawnNextTetromino(getRandomTetromino());
  };
  
  // 将当前方块固定到网格中，并进行结算与消行检测
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
    this.points += BASE_POINTS_PER_PIECE + (this.speedLevel - 1) * LEVEL_BONUS_MULTIPLIER;
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
  
  // 检测满行并触发清除动画与得分结算
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
      audioService.playClear();
      runInAction(() => {
        this.clearedLines += linesToClear.length;
        const clearBonus = CLEAR_POINTS[linesToClear.length - 1] || 0;
        this.points += clearBonus;
        this.points = calculateScore({
          currentScore: this.points,
          clearedLines: linesToClear.length,
          level: this.speedLevel,
        });
      });
      this.animateAndClear(linesToClear);
    } else {
      this.spawnNext();
    }
  };

  // 清除动画：闪烁后删除满行并补齐空行
  animateAndClear = async (lines: number[]) => {
    for (let i = 0; i < 3; i++) {
      await this.flashLines(lines, GRID_BLOCK_STATE.CLEARING);
      await new Promise(resolve => setTimeout(resolve, 100));
      await this.flashLines(lines, GRID_BLOCK_STATE.VISIBLE);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    runInAction(() => {
      const newGrid = this.grid.filter((_, index) => !lines.includes(index));
      const emptyLine = Array(GRID_WIDTH).fill(GRID_BLOCK_STATE.HIDDEN);
      for (let i = 0; i < lines.length; i++) {
        newGrid.unshift([...emptyLine]);
      }
      this.grid = newGrid;
      this.spawnNext();
    });
  };

  // 让指定行以给定状态闪烁（用于清除动画）
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
  
  // 进入下一回合：将预览方块设为当前方块，并生成新的预览
  spawnNext = () => {
    this.currentTetromino = this.nextTetromino;
    this.spawnNextTetromino(getRandomTetromino());
  }

  // 生成当前方块（初始位置在顶部中央）
  spawnTetromino = (shape: TetrominoShape) => {
    this.currentTetromino = {
      shape: shape,
      rotationIndex: 0,
      position: { x: 5, y: 0 },
    };
  };

  // 生成下一个方块（仅用于预览，不参与碰撞）
  spawnNextTetromino = (shape: TetrominoShape) => {
    this.nextTetromino = {
      shape: shape,
      rotationIndex: 0,
      position: { x: 5, y: 0 },
    };
  };
  
  // 碰撞检测：给定方向或幽灵方块，判断是否会越界或触碰到已占用单元
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
  
  // 基于当前方块与方向创建“幽灵方块”，用于移动/旋转前的检测
  createGhostForMove = (direction: Direction): ICurrentTetromino | null => {
    if (!this.currentTetromino) return null;
    let { x, y } = this.currentTetromino.position;
    if (direction === 'down') y += 1;
    if (direction === 'left') x -= 1;
    if (direction === 'right') x += 1;
    return { ...this.currentTetromino, position: { x, y } };
  }

  // 按方向移动当前方块（带音效），暂停时无效
  moveTetromino = (direction: Direction = "down") => {
    if (!this.currentTetromino || this.isPaused) return;
    
    let moved = false;
    if (direction === "right" && !this.willCollide(null, "right")) {
      this.currentTetromino.position.x += 1;
      moved = true;
    }
    if (direction === "left" && !this.willCollide(null, "left")) {
      this.currentTetromino.position.x -= 1;
      moved = true;
    }
    if (direction === "down" && !this.willCollide(null, "down")) {
      this.currentTetromino.position.y += 1;
      moved = true;
    }

    if (moved) {
      audioService.playMove();
    }
  };

  // 在未开始状态调整速度等级（1~6，循环切换）
  adjustStartLevel = (direction: 'left' | 'right') => {
    if (this.isGameStarted) return;

    runInAction(() => {
      let newLevel = this.speedLevel;
      if (direction === 'right') {
        newLevel = (newLevel + 1 > 6) ? 1 : (newLevel + 1) as GameLevel;
      } else {
        newLevel = (newLevel - 1 < 1) ? 6 : (newLevel - 1) as GameLevel;
      }
      this.speedLevel = newLevel;
    });
  };

  // 旋转当前方块（若旋转后不碰撞）
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
      audioService.playRotate();
    }
  };

  // 一键下落：若未开始则先开始；否则坠到最低处并结算
  dropTetromino = () =>{
    if (!this.isGameStarted) {
      this.startGame();
      return;
    }

    if (!this.currentTetromino || this.isPaused) {
      return;
    }
    audioService.playDrop(); 
    const { x, y } = this.currentTetromino.position;
    const ghostTetromino = { ...this.currentTetromino, position: { x, y } };
    while(!this.willCollide(ghostTetromino)){
      ghostTetromino.position.y++;
    }
    ghostTetromino.position.y --;
    this.currentTetromino = ghostTetromino;
    this.settleTetromino();
  }

  // 立即结束（清空 current 与 grid）
  gameEnd = () =>{
    this.currentTetromino = null;
    this.grid = []
  }

  // 重置为初始状态
  resetGame = () => {
    this.grid = createEmptyGrid();
    this.currentTetromino = null; // 重置当前方块
    this.nextTetromino = null;
    this.isGameOver = false;
    this.clearedLines = 0; 
    this.isPaused = false;
    this.startLines = 0;
  };

  // 切换暂停（未开始时自动开始；结束/动画中无效）
  togglePause = () =>{
    if (!this.isGameStarted) {
      this.startGame();
      return;
    }
    if (this.isGameOver || this.isAnimating) return;
    this.isPaused = !this.isPaused;
  }

  // 设置速度等级
  setSpeedLevel = (level:GameLevel) =>{
    this.speedLevel = level
  }

  // 切换音乐开关
  toggleMusic = () => {
    runInAction(() => {
      this.musicOn = !this.musicOn;
      audioService.setMuted(!this.musicOn);
    });
  };

  // 在未开始状态调整起始障碍行数（0~10，循环切换）
  adjustStartLines = (direction: 'up' | 'down') => {
    if (this.isGameStarted) return;
    runInAction(() => {
      let newLines = this.startLines;
      if (direction === 'up') {
        newLines = newLines + 1 > 10 ? 0 : newLines + 1;
      } else { // 'down'
        newLines = newLines - 1 < 0 ? 10 : newLines - 1;
      }
      this.startLines = newLines;
    });
  };

}