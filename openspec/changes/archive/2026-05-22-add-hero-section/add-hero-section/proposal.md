## Why

个人品牌站当前仅有 Vite 默认模板页面，缺乏真正展示个人身份的内容。Hero Section 是访客进入网站后的第一印象，直接决定品牌认知和用户是否继续浏览。

## What Changes

- 新增全屏高度 Hero Section，替换现有 Vite 默认模板内容
- 新增 Canvas 粒子动画背景（CSS 渐变底色 + Canvas 2D 粒子叠加）
- 新增亮色/暗色模式切换按钮，支持手动切换并持久化到 localStorage
- 新增 CTA 按钮，点击后平滑滚动至页面项目区域（锚点 `#projects`）
- 展示内容：姓名、职业头衔、一句话个人介绍

**Out-of-scope（严禁实现）：**
- 不做任何过渡/进入动画效果（fade-in、slide-in 等）
- 不做导航栏（Navbar）
- 不做任何后端 API

## Capabilities

### New Capabilities

- `hero-section`：全屏 Hero 区域，包含个人信息展示、Canvas 粒子背景、亮/暗模式切换、CTA 跳转

### Modified Capabilities

无。当前项目无任何已建立的 spec，无需变更现有规范。

## Impact

- **修改文件**：`src/App.tsx`（移除默认模板内容，引入 HeroSection 组件）
- **新增文件**：
  - `src/components/HeroSection.tsx`
  - `src/components/ParticleCanvas.tsx`
  - `src/hooks/useTheme.ts`
- **依赖变化**：无新增 npm 依赖（Canvas API 原生实现）
- **样式**：`src/index.css` 新增 dark mode class 支持（Tailwind v4 `dark:` 前缀）
- **破坏性变更**：替换 App.tsx 全部默认内容，现有 Vite 模板代码将被清除
