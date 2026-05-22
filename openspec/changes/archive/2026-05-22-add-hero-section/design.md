## Context

当前项目为 Vite + React 19 默认模板，无任何业务组件。需要新增 Hero Section 作为个人品牌站的首屏内容。项目部署在 GitHub Pages（base path `/my-website/`），要求首屏加载 < 2s，不引入额外 npm 依赖。

## Goals / Non-Goals

**Goals:**
- 实现全屏 Hero Section，包含个人信息、粒子背景、亮/暗模式切换
- 零新增 npm 依赖（Canvas API 原生实现粒子效果）
- Tailwind v4 CSS class 驱动的暗色模式，状态持久化到 localStorage
- 组件结构清晰，便于后续扩展

**Non-Goals:**
- 不实现任何入场动画或过渡动画
- 不实现导航栏
- 不引入路由库（CTA 使用锚点滚动）
- 不做后端 API

## Decisions

### 决策 1：粒子动画使用 Canvas API 手写，不引入 tsParticles

**选择**：Canvas 2D API + `requestAnimationFrame`

**原因**：tsParticles tree-shaken 后约 60KB，加上 React binding 约 80KB，与"首屏 < 2s"约束存在张力。手写 Canvas 粒子代码约 80-100 行，零包体积增加，完全满足本项目需求（静态粒子漂浮 + 连线效果）。

**备选方案**：tsParticles（已排除，包体积）；纯 CSS 动画（粒子数量受限，视觉效果弱）

---

### 决策 2：暗色模式使用 class 策略（`dark` class 加在 `<html>`）

**选择**：`document.documentElement.classList.toggle('dark')` + localStorage 持久化

**原因**：Tailwind v4 支持 `dark:` 前缀 + `.dark` class 策略，无需额外配置。相比 `prefers-color-scheme` only 方案，支持用户手动覆盖系统偏好。

**初始化顺序**：在 `main.tsx` 的 React 挂载前同步读取 localStorage，避免暗色模式闪烁（FOUC）。

---

### 决策 3：CTA 使用锚点滚动，不引入 react-router

**选择**：`<a href="#projects">` + CSS `scroll-behavior: smooth`

**原因**：当前页面为单页结构，无需路由。锚点方案零依赖，与 GitHub Pages 静态部署完全兼容。后续扩展为多页时可替换为 `<Link>`。

---

### 决策 4：组件拆分策略

```
src/
├── components/
│   ├── HeroSection.tsx     ← Hero 容器（布局 + 内容文案）
│   └── ParticleCanvas.tsx  ← Canvas 粒子（纯渲染，无业务逻辑）
└── hooks/
    └── useTheme.ts         ← 主题状态管理（读/写 localStorage）
```

`ParticleCanvas` 作为纯展示组件接受 `theme` prop，在 `useEffect` 内操作 Canvas，组件卸载时清理 `requestAnimationFrame` 和 `resize` 监听器。

## Risks / Trade-offs

- **Canvas resize 闪烁** → 监听 `window resize`，重置 `canvas.width/height` 并重新初始化粒子位置；使用 `debounce` 避免频繁触发
- **prefers-reduced-motion** → Canvas 动画在检测到 `prefers-reduced-motion: reduce` 时停止 `requestAnimationFrame`，粒子静止显示
- **GitHub Pages base path** → 所有静态资源通过 `import` 引入或放在 `public/` 目录，不使用绝对路径 `/assets/xxx`
- **FOUC（暗色模式闪烁）** → 在 `index.html` 的 `<head>` 中内联一段同步 JS 脚本，读取 localStorage 并立即设置 `<html class="dark">`，在 React 挂载前执行
