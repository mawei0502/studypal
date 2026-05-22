## Context

`AboutSection` 是个人品牌站的第三个 Section，位于 `ProjectSection` 下方。目前 `App.tsx` 中 ProjectSection 之后没有更多内容。Navbar 当前有三个锚点：`#hero`、`#projects`、`#contact`，需要在"项目"和"联系我"之间插入"关于我"（`#about`）。

## Goals / Non-Goals

**Goals:**
- 左右两栏布局（桌面端），左栏头像照片（或占位块），右栏三段文字简介
- 下方展示品牌标签"赋范空间"，视觉上突出
- 支持亮/暗模式，风格与现有科技感设计一致
- Navbar 新增"关于我"导航项

**Non-Goals:**
- 联系表单或任何输入控件
- 社交媒体图标链接
- 动画入场效果

## Decisions

### 决策 1：照片资源放置于 `public/about/avatar.jpg`，初期用渐变占位块

**选择**：`public/about/` 目录 + `import.meta.env.BASE_URL` 拼接路径，缺失时显示渐变占位块

**原因**：与 ProjectCard 图片策略一致，GitHub Pages base path 安全，无 404 控制台报错。用户后续只需把头像文件放到该路径即可自动生效。

**备选**：直接硬编码 URL — 不适合 GitHub Pages 子路径部署。

---

### 决策 2：左右两栏用 Tailwind `flex flex-col md:flex-row` 实现响应式

**选择**：移动端纵向堆叠（照片在上，文字在下），桌面端（≥768px）左右并排

**原因**：与 ProjectSection 的 `sm:grid-cols-2` 断点策略保持一致，`md` 断点适合图文并排的视觉比例。

---

### 决策 3：品牌标签"赋范空间"用独立的 Tag 元素展示

**选择**：`<span>` 标签，圆角边框 + violet 色系，位于简介文字下方

**原因**：视觉上需要与正文文字区分，突出品牌标识感；纯 CSS 实现，无额外依赖。

---

### 决策 4：Navbar 导航项顺序调整为：首页 → 关于我 → 项目 → 联系我

**选择**：在"首页"和"项目"之间插入"关于我"，顺序反映页面从上到下的阅读顺序

**原因**：AboutSection 位于 ProjectSection 下方，导航顺序应与页面滚动顺序一致，帮助用户建立空间感。

## Risks / Trade-offs

- **头像照片暂缺** → 初期用科技感渐变占位块（与 ProjectCard 策略相同），`imageUrl` 字段预留，后续填入路径自动生效
- **Navbar 导航项增加** → 在小屏幕上可能因空间不足而溢出，但当前已有3项且无明显溢出问题，增至4项仍在可接受范围（字数短）
