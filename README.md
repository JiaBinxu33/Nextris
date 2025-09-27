# 🎮 我的俄罗斯方块 (My Tetris)

一个使用现代 Web 技术构建的经典俄罗斯方块游戏，具有流畅的动画效果和 GameBoy 风格的复古界面。

![Tetris Game](https://img.shields.io/badge/Game-Tetris-blue?style=for-the-badge&logo=gamepad)
![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MobX](https://img.shields.io/badge/MobX-6.13.7-orange?style=for-the-badge&logo=mobx)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ 特性

- 🎯 **经典游戏玩法**: 完整的俄罗斯方块体验，包含所有 7 种经典方块形状
- 🎨 **GameBoy 风格界面**: 复古绿色单色显示风格，重现经典游戏机体验
- 🔄 **流畅动画**: 方块下落、旋转、消除行都有精心设计的动画效果
- 🎮 **完整控制**: 支持键盘控制（方向键、空格键暂停、Z 键旋转、X 键快速下落）
- 💀 **游戏结束动画**: 独特的游戏结束动画效果
- 📱 **响应式设计**: 自适应不同屏幕尺寸
- 🔧 **类型安全**: 完全使用 TypeScript 开发，确保代码质量

## 🚀 技术栈

- **前端框架**: [Next.js 15.5.3](https://nextjs.org/) - React 框架，支持 Turbopack
- **状态管理**: [MobX 6.13.7](https://mobx.js.org/) - 响应式状态管理
- **语言**: [TypeScript 5.0](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集
- **样式**: [Tailwind CSS 4.0](https://tailwindcss.com/) - 实用优先的 CSS 框架
- **构建工具**: Turbopack - 极速构建和热重载

## 🎮 游戏控制

| 键位  | 功能           |
| ----- | -------------- |
| ← →   | 左右移动方块   |
| ↓     | 加速下落       |
| Z     | 逆时针旋转方块 |
| X     | 顺时针旋转方块 |
| 空格  | 暂停/继续游戏  |
| Enter | 瞬间下落       |

## 🎯 游戏规则

1. **方块下落**: 七种不同形状的方块从顶部下落
2. **填充行**: 将方块排列填满水平行
3. **消除行**: 填满的行会被消除，上方的方块会下落
4. **游戏结束**: 当新方块无法放置时游戏结束
5. **动画效果**: 消除行时有闪烁动画，游戏结束有特殊动画

## 🛠 安装和运行

### 环境要求

- Node.js 18.0 或更高版本
- npm、yarn 或 pnpm 包管理器

### 快速开始

1. **克隆项目**

   ```bash
   git clone <your-repo-url>
   cd my-tetris
   ```

2. **安装依赖**

   ```bash
   # 使用 npm
   npm install

   # 使用 yarn
   yarn install

   # 使用 pnpm (推荐)
   pnpm install
   ```

3. **启动开发服务器**

   ```bash
   # 使用 npm
   npm run dev

   # 使用 yarn
   yarn dev

   # 使用 pnpm
   pnpm dev
   ```

4. **打开浏览器**

   访问 [http://localhost:3000](http://localhost:3000) 开始游戏!

### 构建生产版本

```bash
# 构建
npm run build
# 或 yarn build
# 或 pnpm build

# 启动生产服务器
npm run start
# 或 yarn start
# 或 pnpm start
```

## 📁 项目结构

```
my-tetris/
├── src/
│   └── app/
│       ├── components/          # React 组件
│       │   ├── Screen.tsx       # 游戏屏幕组件
│       │   ├── Tetromino.tsx    # 方块组件
│       │   └── Control.tsx      # 控制面板组件
│       ├── store/               # MobX 状态管理
│       │   ├── index.ts         # Store 导出
│       │   └── MatrixStore.ts   # 游戏逻辑状态
│       ├── static/              # 静态配置
│       │   ├── grid.ts          # 网格配置
│       │   └── shaps.ts         # 方块形状定义
│       ├── utils/               # 工具函数
│       │   └── getRandomTeromino.ts
│       ├── GameBoy/             # 主游戏组件
│       │   └── page.tsx
│       ├── globals.css          # 全局样式
│       ├── layout.tsx           # 根布局
│       └── page.tsx             # 首页
├── public/                      # 静态资源
├── package.json                 # 项目配置
└── README.md                    # 项目说明
```

## 🎨 核心功能实现

### 状态管理 (MobX)

使用 MobX 管理游戏状态，包括：

- 游戏网格状态
- 当前下落方块
- 下一个方块预览
- 游戏暂停/结束状态
- 动画状态

### 碰撞检测

精确的碰撞检测算法，支持：

- 边界检测（左右下边界）
- 已固定方块检测
- 旋转碰撞检测

### 动画系统

- **行消除动画**: 闪烁效果突出被消除的行
- **方块固定动画**: 短暂的颜色变化表示方块固定
- **游戏结束动画**: 从下到上填充再清空的特效

## 🎯 核心算法

### 方块旋转系统

每个方块都有多个旋转状态，通过数组索引切换：

```typescript
interface ICurrentTetromino {
  shape: TetrominoShape;
  rotationIndex: number; // 当前旋转状态
  position: { x: number; y: number };
}
```

### 行消除检测

检测并消除填满的行：

```typescript
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
  // ... 动画和清除逻辑
};
```

## 📊 游戏配置

### 网格配置

- **宽度**: 10 格
- **高度**: 20 格
- **方块状态**: HIDDEN、VISIBLE、SETTLED、CLEARING

### 方块形状

支持标准的 7 种俄罗斯方块：

- I (直条)
- O (方块)
- T (T 型)
- S (S 型)
- Z (Z 型)
- J (J 型)
- L (L 型)

## 🚢 部署

### Vercel 部署 (推荐)

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动构建和部署

### 其他平台

项目是标准的 Next.js 应用，可以部署到任何支持 Node.js 的平台：

- Netlify
- Railway
- AWS
- Azure
- Google Cloud Platform

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

该项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🎯 后续计划

- [ ] 添加计分系统
- [ ] 实现等级系统和速度递增
- [ ] 添加音效和背景音乐
- [ ] 实现本地最高分记录
- [ ] 添加移动端触控支持
- [ ] 实现多人对战模式
- [ ] 添加不同主题和皮肤

## 📞 联系

如有问题或建议，请通过以下方式联系：

- 13804970786@163.com

---

**享受游戏吧！🎮**
EOF
