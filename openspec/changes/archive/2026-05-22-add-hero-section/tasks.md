## Phase 1. 基础配置与暗色模式初始化

- [x] 1.1 在 `tailwind.config` 或 `index.css` 中确认 Tailwind v4 开启 `darkMode: 'class'` 策略
- [x] 1.2 在 `index.html` 的 `<head>` 中添加内联同步脚本，读取 localStorage 并在 React 挂载前设置 `<html class="dark">`，消除 FOUC
- [x] 1.3 在 `src/index.css` 中添加 `html { scroll-behavior: smooth; }` 全局样式

> **Phase 1 完成后请 review 并确认，再继续 Phase 2**

---

## Phase 2. useTheme Hook

- [x] 2.1 创建 `src/hooks/useTheme.ts`，实现读取 localStorage `theme` 值并回落到 `prefers-color-scheme` 的初始化逻辑
- [x] 2.2 在 `useTheme` 中实现 `toggleTheme` 函数，切换 `<html>` 的 `dark` class 并同步写入 localStorage

> **Phase 2 完成后请 review 并确认，再继续 Phase 3**

---

## Phase 3. ParticleCanvas 组件

- [x] 3.1 创建 `src/components/ParticleCanvas.tsx`，接受 `theme` prop，使用 `useRef` 获取 Canvas DOM 引用
- [x] 3.2 在 `useEffect` 中实现粒子初始化逻辑：随机位置、速度生成 N 个粒子对象
- [x] 3.3 实现 `requestAnimationFrame` 动画循环：更新粒子坐标、绘制粒子圆点、绘制粒子间连线（距离阈值内）
- [x] 3.4 监听 `prefers-reduced-motion`，若为 `reduce` 则跳过动画循环，仅绘制静态粒子
- [x] 3.5 添加 `window resize` 事件监听器（带 debounce），重置 canvas 尺寸并重新初始化粒子
- [x] 3.6 在 `useEffect` 返回的清理函数中取消 `cancelAnimationFrame` 并移除 resize 监听器

> **Phase 3 完成后请 review 并确认，再继续 Phase 4**

---

## Phase 4. HeroSection 组件

- [x] 4.1 创建 `src/components/HeroSection.tsx`，引入 `useTheme` hook 和 `ParticleCanvas` 组件
- [x] 4.2 实现全屏容器（`min-h-screen`）+ 相对定位布局，`ParticleCanvas` 绝对定位于底层
- [x] 4.3 添加 CSS 渐变底色（亮色/暗色各一套，通过 Tailwind `dark:` 前缀切换）
- [x] 4.4 添加个人信息内容区域：姓名（`<h1>`）、职业头衔（`<p>`）、一句话介绍（`<p>`），居中排列
- [x] 4.5 添加主题切换按钮，点击调用 `toggleTheme`，按当前 theme 显示对应图标（☀️/🌙 或 SVG 图标）
- [x] 4.6 添加 CTA 按钮，`href="#projects"`，Tailwind 样式实现科技感按钮外观，支持 `dark:` 变体

> **Phase 4 完成后请 review 并确认，再继续 Phase 5**

---

## Phase 5. 集成与收尾

- [x] 5.1 修改 `src/App.tsx`：移除 Vite 默认模板内容，引入并渲染 `HeroSection` 组件
- [x] 5.2 添加占位 `<section id="projects">` 区域（空内容），确保 CTA 锚点跳转有目标
- [ ] 5.3 本地运行 `npm run dev`，手动验证：粒子背景渲染、亮暗切换、刷新后主题保持、CTA 滚动
- [x] 5.4 运行 `npm run build`，确认构建无 TypeScript 错误

> **Phase 5 完成后请 review 并确认，变更实现完毕**
