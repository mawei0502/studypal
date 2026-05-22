## Phase 1. 全局样式准备

- [x] 1.1 在 `src/index.css` 中添加 `[id] { scroll-margin-top: 4rem; }`，解决 fixed navbar 遮挡锚点内容问题
- [x] 1.2 为 `src/components/HeroSection.tsx` 的根 `<section>` 添加 `id="hero"`

> **Phase 1 完成后请 review 并确认，再继续 Phase 2**

---

## Phase 2. Navbar 组件实现

- [x] 2.1 创建 `src/components/Navbar.tsx`，搭建基础结构：fixed 定位、`h-16` 高度、左右两侧布局
- [x] 2.2 添加毛玻璃背景：`bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-white/20 dark:border-gray-700/50`
- [x] 2.3 实现左侧品牌标识：`<a href="#hero">` 包裹名字文本，科技感字体样式
- [x] 2.4 实现右侧导航链接列表：首页（`#hero`）、项目（`#projects`）、联系我（`#contact`），支持 `dark:` 变体
- [x] 2.5 为导航链接添加 hover 效果（颜色变化），视觉反馈清晰

> **Phase 2 完成后请 review 并确认，再继续 Phase 3**

---

## Phase 3. 集成与收尾

- [x] 3.1 在 `src/App.tsx` 中引入并渲染 `<Navbar />`，置于 `<HeroSection />` 之前
- [x] 3.2 为 `src/components/HeroSection.tsx` 添加 `pt-16` 补偿 fixed navbar 遮挡的高度
- [x] 3.3 运行 `npm run build`，确认构建无 TypeScript 错误

> **Phase 3 完成后请 review 并确认，变更实现完毕**
