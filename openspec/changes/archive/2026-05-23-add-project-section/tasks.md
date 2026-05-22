## Phase 1. 数据层

- [x] 1.1 创建 `src/data/projects.ts`，定义 `Project` interface（id / name / description / imageUrl / githubUrl）
- [x] 1.2 在 `projects.ts` 中填入 4 个示例项目的静态数据（名称、简介、GitHub 链接、占位 imageUrl）

> **Phase 1 完成后请 review 并确认，再继续 Phase 2**

---

## Phase 2. ProjectCard 组件

- [x] 2.1 创建 `src/components/ProjectCard.tsx`，接受 `Project` prop，渲染卡片基础结构
- [x] 2.2 实现截图区域：有 `imageUrl` 时渲染 `<img loading="lazy">`，无时渲染 CSS 渐变占位块
- [x] 2.3 实现卡片内容区：项目名称（`<h3>`）+ 简介（`<p>`）
- [x] 2.4 实现 GitHub 链接按钮：`target="_blank" rel="noopener noreferrer"`，含 GitHub SVG 图标
- [x] 2.5 添加悬浮微特效：`hover:-translate-y-2 hover:shadow-xl transition-all duration-300`，支持 `dark:` 阴影变体

> **Phase 2 完成后请 review 并确认，再继续 Phase 3**

---

## Phase 3. ProjectSection 组件与集成

- [x] 3.1 创建 `src/components/ProjectSection.tsx`，根元素添加 `id="projects"`，导入 projects 数据
- [x] 3.2 实现区域标题（如"我的项目"）和副标题，支持 `dark:` 颜色变体
- [x] 3.3 实现响应式网格：`grid grid-cols-1 sm:grid-cols-2 gap-6`，遍历渲染 `ProjectCard`
- [x] 3.4 修改 `src/App.tsx`：用 `<ProjectSection />` 替换原有占位 `<section id="projects">`
- [x] 3.5 运行 `npm run build`，确认构建无 TypeScript 错误

> **Phase 3 完成后请 review 并确认，变更实现完毕**
