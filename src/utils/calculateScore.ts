// src/app/utils/calculateScore.ts
import { CLEAR_POINTS, GameLevel ,BASE_POINTS_PER_PIECE,LEVEL_BONUS_MULTIPLIER } from "@/static/shaps";

interface CalculateScoreParams {
  /** 当前的总分数 */
  currentScore: number;
  /** 本次操作消除的行数 (0, 1, 2, 3, or 4) */
  clearedLines: number;
  /** 游戏当前的等级 (1-6) */
  level: GameLevel;
}

/**
 * 计算游戏得分的辅助函数
 * @param params - 包含当前分数、消除行数和等级的对象
 * @returns 返回计算后的新总分
 */
export function calculateScore({
  currentScore,
  clearedLines,
  level,
}: CalculateScoreParams): number {
  let pointsToAdd = 0;

  // 1. 计算消除行带来的得分
  if (clearedLines > 0) {
    pointsToAdd = CLEAR_POINTS[clearedLines - 1] || 0;
  } 
  // 2. 如果没有消除行，则只计算等级带来的基础分
  else {

    pointsToAdd = BASE_POINTS_PER_PIECE + (level - 1) * LEVEL_BONUS_MULTIPLIER;
  }

  return currentScore + pointsToAdd;
}