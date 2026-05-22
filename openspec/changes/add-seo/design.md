## Context

当前 `index.html` 的 `<title>` 为 Vite 默认占位 "my-website"，无任何 meta description，`<html>` 的 `lang` 属性为 "en"（实际内容是中文），不存在 `robots.txt` 和 `sitemap.xml`。这是纯静态单页应用，无路由切换，所有 SEO 相关信息均来自静态 HTML head 和 `public/` 目录下的文件。

## Goals / Non-Goals

**Goals:**
- 正确的 `<title>` 和 `<meta name="description">` 帮助搜索引擎理解页面主题
- Open Graph + Twitter Card meta 标签确保社交分享预览卡片正常展示
- `<html lang="zh-CN">` 声明正确语言，辅助屏幕阅读器和搜索引擎
- `public/robots.txt` 显式允许爬虫，声明 Sitemap 位置
- `public/sitemap.xml` 提供站点地图加速收录
- 语义化 HTML 确认：`<header>`、`<main>`、`<footer>` 结构正确

**Non-Goals:**
- 动态 meta 标签（SPA 无多路由，无需 React Helmet）
- Google Analytics 或任何追踪脚本
- 结构化数据（JSON-LD）
- 自动 sitemap 生成工具链

## Decisions

### 决策 1：所有 SEO meta 直接写入 `index.html`，不用运行时库

**选择**：静态 HTML 硬编码

**原因**：本站是单页应用无路由，所有页面内容在同一 URL 下渲染，meta 信息不需要随路由变化。引入 React Helmet 等库为增加不必要复杂度。静态写入构建产物更可靠，爬虫抓取时直接可见。

**备选**：React Helmet Async — 有运行时依赖，SSR 友好但本站无 SSR，排除。

---

### 决策 2：`og:url` 使用 GitHub Pages 的完整 URL

**选择**：`https://<username>.github.io/my-website/`

**原因**：Open Graph 要求绝对 URL。GitHub Pages 部署地址固定，可在 `index.html` 中硬编码。

---

### 决策 3：`public/sitemap.xml` 只列一条 URL（首页），不列锚点

**选择**：仅列 `https://<username>.github.io/my-website/`

**原因**：锚点（`#about`、`#projects`）是页内导航，不构成独立 URL，搜索引擎不将其视为独立页面。单 URL sitemap 是静态单页应用的正确做法。

---

### 决策 4：语义化 HTML 以审查为主，最小化改动

**选择**：检查 `App.tsx` 是否有 `<main>` 包裹内容区，各 Section 使用 `<section>` / `<article>` 是否正确

**原因**：避免大规模重构引入意外样式问题。已有组件（HeroSection 用 `<section>`、ProjectCard 用 `<article>`）结构基本合理，补充 `<main>` 包裹即可。

## Risks / Trade-offs

- **GitHub username 硬编码** → `og:url` 和 sitemap 中的域名写死，如仓库迁移需手动更新；可接受，个人站极少迁移
- **无动态 title** → 单页应用 title 固定，用户在浏览器标签页无法区分不同 section；无解，属于 SPA 天然限制
- **robots.txt 路径** → GitHub Pages 部署在子路径 `/my-website/`，`robots.txt` 需放在 `public/` 根（Vite 会原样复制），实际访问路径为 `https://<username>.github.io/robots.txt`——注意：该文件作用于整个 GitHub Pages 域，而非仅 `/my-website/` 子路径，这是 GitHub Pages 的已知限制，可接受
