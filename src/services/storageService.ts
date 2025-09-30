// app/services/storageService.ts

import { Grid, ICurrentTetromino } from "@/store/MatrixStore";
import { GameLevel, TetrominoShape } from "@/static/shaps";

// 定义存储在 localStorage 中的键名
const STORAGE_KEY = "TETRIS_GAME_STATE";

// 定义我们需要持久化保存的数据结构
export interface IGameState {
    grid: Grid;
    currentTetromino: ICurrentTetromino | null;
    nextTetromino: ICurrentTetromino | null;
    isGameStarted: boolean;
    points: number;
    clearedLines: number;
    speedLevel: GameLevel;
    musicOn: boolean;
    maxScore: number; // 新增
    lastScore: number; // 新增
  }

/**
 * 从 localStorage 加载游戏状态
 * @returns IGameState | null
 */
export function loadState(): IGameState | null {
  // 确保只在浏览器环境中执行
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("无法加载游戏状态", err);
    return null;
  }
}

/**
 * 将游戏状态保存到 localStorage
 * @param state - 要保存的游戏状态对象
 */
export function saveState(state: IGameState): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("无法保存游戏状态", err);
  }
}