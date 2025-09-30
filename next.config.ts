import type { NextConfig } from "next";

// 你的 GitHub 仓库名称
const repo = 'Nextris'; 

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const basePath = isGithubActions ? `/${repo}` : '';

const nextConfig: NextConfig = {
  // 1. 开启静态导出
  output: 'export',
  
  // 2. 设置基础路径
  basePath: basePath,

  // 3. (可选但推荐) 禁用图片优化，因为静态导出不支持
  images: {
    unoptimized: true,
  },

  // 4. 【核心修复】将基础路径作为公共环境变量暴露给客户端代码
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

// 我们不再需要 withNextIntl 进行静态客户端渲染
export default nextConfig;