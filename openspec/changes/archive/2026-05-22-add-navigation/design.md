## Context

项目已有 HeroSection + ParticleCanvas + useTheme，dark class 策略已就位，`scroll-behavior: smooth` 已全局配置。Navbar 是新增的跨页面固定组件，需要与已有主题系统集成，不引入新依赖。

## Goals / Non-Goals

**Goals:**
- 固定顶部 Navbar，毛玻璃背景，品牌标识 + 导航链接
- 复用现有 `useTheme` hook，保持主题一致性
- 锚点平滑滚动，处理 fixed navbar 遮挡内容的偏移问题
- 零新增 npm 依赖

**Non-Goals:**
- 不实现移动端汉堡菜单
- 不实现搜索、下拉菜单、登录注册
- 不追踪当前激活的导航项（active state）

## Decisions

### 决策 1：Navbar 放置位置在 App.tsx 最顶层，独立于 HeroSection

**选择**：`App.tsx` 中 `<Navbar />` 置于 `<HeroSection />` 之前，使用 `position: fixed` 悬浮在所有内容之上。

**原因**：Navbar 是全局组件，不属于任何单一 Section；放在 App 层可以让后续所有 Section 自动享受导航覆盖，无需逐个 Section 改动。

---

### 决策 2：毛玻璃效果使用 Tailwind `backdrop-blur-md` + 半透明背景

**选择**：`bg-white/70 dark:bg-gray-900/70 backdrop-blur-md`

**原因**：Tailwind v4 原生支持，零额外代码。与页面的科技感渐变背景形成自然层次感，粒子背景透过导航栏隐约可见，视觉统一。

**备选方案**：纯不透明背景（视觉割裂感强，放弃）；CSS `filter: blur`（会影响子元素，放弃）

---

### 决策 3：锚点跳转使用 `scroll-margin-top` 解决 fixed navbar 遮挡

**选择**：为每个目标 section 添加 `scroll-margin-top: 64px`（导航栏高度）

**原因**：fixed navbar 会遮挡锚点跳转的目标内容。CSS `scroll-margin-top` 是专为此场景设计的属性，浏览器原生支持，零 JS，比手动计算 `scrollTop` 更健壮。

**实现**：在 `index.css` 中添加 `[id] { scroll-margin-top: 4rem; }` 统一处理所有锚点。

---

### 决策 4：不复用 useTheme，Navbar 直接读取 `<html>` class 判断当前主题

**选择**：Navbar 自身不持有主题状态，主题切换按钮保留在 HeroSection（已有实现）。Navbar 仅通过 Tailwind `dark:` 前缀响应主题变化。

**原因**：避免 `useTheme` 在多个组件中重复实例化（各自维护独立 state，可能不同步）。主题切换职责已在 HeroSection 明确，Navbar 只需 CSS 响应，无需 JS 感知主题状态。

## Risks / Trade-offs

- **fixed navbar 与 Hero 全屏高度冲突** → HeroSection 的 `min-h-screen` 实际首屏会被 navbar 遮挡顶部 64px。解决方案：为 HeroSection 添加 `pt-16`（padding-top: 4rem）补偿
- **backdrop-blur 在旧版浏览器不支持** → 优雅降级为纯半透明背景，不影响功能，仅视觉效果退化
- **scroll-margin-top 固定值** → 若后续 navbar 高度变化，需同步更新。当前 navbar 高度固定为 `h-16`（4rem），风险可控
