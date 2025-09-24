export enum TetrominoShape {
    O = "o",
    L = "l",
    J = "j",
    T = "t",
    S = "s",
    Z = "z",
    I = "i",
    T_MIRROR = "tm",
    I_MIRROR = "im",
  }
  
 export const SHAPE_DEFINITIONS: { [key: string]: string[] } = {
    // --- 标准形状 ---
    [TetrominoShape.O]: ["1-2", "1-3", "2-2", "2-3"],
    [TetrominoShape.L]: ["1-3", "2-1", "2-2", "2-3"],
    [TetrominoShape.J]: ["1-1", "1-2", "1-3", "2-1"], // J 和 L 在2x4格子中可以相同，通过旋转区分
    [TetrominoShape.S]: ["1-2", "1-3", "2-1", "2-2"],
    [TetrominoShape.Z]: ["1-1", "1-2", "2-2", "2-3"],
    
    // --- T 和 I (以及它们的镜像) ---
  
    // 标准 T 形 (在左侧)
    [TetrominoShape.T]: ["1-2", "2-1", "2-2", "2-3"],
  
    // 标准 I 形 (在左侧)
    [TetrominoShape.I]: ["2-1", "2-2", "2-3", "2-4"],
  
    // T 的镜像 (在右侧)
    [TetrominoShape.T_MIRROR]: ["1-1", "1-2", "1-3", "2-2"], // 形状相同，但您可以为它创建不同的组件实例
  
    // I 的镜像 (在右侧，为了展示效果，我们让它竖直排列)
    [TetrominoShape.I_MIRROR]: ["1-1", "1-2", "1-3", "1-4"],
  };