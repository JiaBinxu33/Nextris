import {TetrominoShape} from "@/static/shaps"
export function getRandomTetromino(): TetrominoShape {
    // 1. 使用 Object.values() 获取枚举的所有值，并存入一个数组
    //    shapes 数组现在会是 ["o", "l", "j", "t", "s", "z", "i", "tm", "im"]
    const allShapes = Object.values(TetrominoShape);
    const playableShapes = allShapes.filter(
        shape => shape !== TetrominoShape.T_MIRROR && shape !== TetrominoShape.I_MIRROR
      );
    // 2. 生成一个 0 到 (数组长度 - 1) 之间的随机整数作为索引
    const randomIndex = Math.floor(Math.random() * playableShapes.length);
  
    // 3. 根据随机索引从数组中返回一个形状值
    return playableShapes[randomIndex];
  }