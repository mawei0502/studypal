## Why

个人品牌站目前的 `<title>` 为占位文字 "my-website"，没有 description meta 标签，也没有 `robots.txt`。这意味着搜索引擎无法正确识别网站主题和作者身份，分享到社交媒体时也无法展示丰富预览卡片，导致个人品牌无法通过搜索引擎和社交平台有效传播。

## What Changes

- 修改 `index.html`：设置准确的 `<title>`、`<meta name="description">`、Open Graph 标签（`og:title` / `og:description` / `og:url` / `og:type`）、Twitter Card 标签
- 语义化 HTML 审查：确认 `<header>`、`<main>`、`<section>`、`<article>` 等语义标签正确使用（`App.tsx` / 各组件）
- 新增 `public/robots.txt`：允许 Google 等主流爬虫索引全站，并声明 Sitemap 路径
- 新增 `public/sitemap.xml`：静态站点地图，列出各主要锚点页面
- `index.html` 补充 `<html lang="zh-CN">` 语言属性

**out-of-scope（严禁开发）：**
- 动态 meta 标签（无路由，无需 React Helmet 等运行时方案）
- Google Analytics / 统计脚本接入
- 结构化数据（JSON-LD Schema.org）
- 自动 Sitemap 生成工具链

## Capabilities

### New Capabilities

- `seo-basics`: HTML meta 标签、robots.txt、sitemap.xml、语义化 HTML 的规范定义

### Modified Capabilities

（无——SEO 是纯静态文件与 HTML head 层面的变更，不涉及已有功能域的行为规范修改）

## Impact

- 修改文件：`index.html`（title、description、OG/Twitter meta、lang 属性）
- 修改文件：`src/App.tsx`（确认 `<main>` 语义包裹）
- 新增文件：`public/robots.txt`
- 新增文件：`public/sitemap.xml`
- 无新 npm 依赖
- 不影响现有组件逻辑和样式
