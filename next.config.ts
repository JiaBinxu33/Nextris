import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

// 你的 GitHub 仓库名称
const repo = 'Nextris'; 

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  // 1. 开启静态导出
  output: 'export',
  
  // 2. 设置基础路径
  // 这样 Next.js 就知道你的网站是放在 /Nextris/ 子目录下的
  basePath: isGithubActions ? `/${repo}` : '',

  // 3. 设置资源前缀
  // 确保所有 CSS, JS, 图片等资源的 URL 都是正确的
  assetPrefix: isGithubActions ? `/${repo}/` : '',

  // 4. (可选但推荐) 禁用图片优化，因为静态导出不支持
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);