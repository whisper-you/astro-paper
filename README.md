# 雨天的烟花 🎇

![Rainy Day Fireworks](public/favicon.svg)
![Debian](https://img.shields.io/badge/Debian-D70A53?style=for-the-badge&logo=debian&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)

“雨天的烟花”是一个基于 AstroPaper 主题构建的个人技术博客。它专注于记录 Linux (Debian) 使用心得、前端开发技术以及 AI Agent (LangGraph/RAG) 的学习历程。

访问地址：[雨天的烟花 - 个人博客](https://your-blog.pages.dev/) (请替换为你自己的 Cloudflare URL)

## 🔥 核心特性

- [x] **类型安全**: 基于 TypeScript 和 Astro 的强类型 Markdown 支持。
- [x] **极致性能**: 优秀的 Lighthouse 满分表现。
- [x] **响应式设计**: 完美适配 Debian KDE 桌面、平板及手机移动端。
- [x] **搜索功能**: 内置模糊搜索，快速定位技术笔记。
- [x] **AI 友好**: 专为记录 AI 相关技术（如 LangChain/RAG）优化的排版。
- [x] **自动化部署**: 通过 GitHub Actions 与 Cloudflare Pages 实现自动构建。

## 🚀 项目结构

在“雨天的烟花”中，主要的目录结构如下：

```bash
/
├── public/          # 静态资源（Favicon, 站点图标等）
├── src/
│   ├── assets/      # 全局图标与图片
│   ├── components/  # Astro 组件
│   ├── content/     # 所有的博客文章 (Markdown/MDX)
│   │   └── blog/    # 存放分类文章（如 _LangChain/）
│   ├── config.ts    # 站点全局配置文件 (在这里修改站点名、作者)
│   └── pages/       # 路由页面
└── astro.config.ts  # Astro 核心配置
```
