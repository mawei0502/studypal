## Context

`#projects` 锚点目前是 App.tsx 中的一个空占位 section。导航栏"项目"链接和 Hero CTA 按钮均已指向此锚点。本变更用真实的项目展示区替换占位内容，零路由、零后端、静态数据。

## Goals / Non-Goals

**Goals:**
- 响应式卡片网格（桌面 2 列 / 移动 1 列），展示 ≥ 4 个项目
- 每张卡片：截图（lazy load）+ 名称 + 简介 + GitHub 链接
- 纯 CSS 悬浮微特效，零 JS 动画依赖
- 暗色/亮色模式适配

**Non-Goals:**
- 不做项目详情页、搜索、分页
- 不做后端 API 或动态数据源

## Decisions

### 决策 1：项目数据存放在 `src/data/projects.ts` 静态文件

**选择**：TypeScript 常量数组 + `Project` interface

**原因**：个人品牌站项目数量少（4-8 个），无需数据库或 CMS。静态 TS 文件有完整类型安全，构建时 tree-shaken，维护成本最低。

**数据结构：**
```ts
interface Project {
  id: string
  name: string
  description: string
  imageUrl: string
  githubUrl: string
}
```

---

### 决策 2：悬浮微特效用 Tailwind `group` + `hover:` 纯 CSS 实现

**选择**：`hover:-translate-y-2 hover:shadow-xl transition-all duration-300`

**原因**：无需 JS，GPU 加速 transform，性能优，与 out-of-scope"不做动画效果"约束不冲突（此为交互反馈微特效，非入场动画）。

**备选方案**：framer-motion（有依赖，过重）；CSS keyframes（需自定义 class，维护成本高）

---

### 决策 3：ProjectCard 和 ProjectSection 拆分为独立组件

**选择**：
- `ProjectCard.tsx`：接受单个 `Project` prop，负责卡片渲染
- `ProjectSection.tsx`：从 `projects.ts` 导入数据，渲染标题 + 网格

**原因**：关注点分离，ProjectCard 可复用；数据与视图解耦，后续替换真实数据只改 `projects.ts`。

---

### 决策 4：截图资源放置策略

**选择**：`public/projects/` 目录，文件名与 `Project.id` 对应（如 `public/projects/my-website.png`）

**原因**：`public/` 目录内文件在 GitHub Pages 部署后可通过相对 base path 访问，Vite 不处理其内容，避免 base path 导致的资源 404 问题。

**兜底处理**：若截图缺失，显示科技感渐变色占位块（纯 CSS），不用 `<img>` 的 `onerror`，避免控制台报错。

## Risks / Trade-offs

- **截图资源暂缺** → 初期用 CSS 渐变占位块替代，数据结构保留 `imageUrl` 字段，后续填入真实截图路径即可
- **项目数量硬编码** → 目前 4 个静态项目，扩展只需在 `projects.ts` 追加条目，不改组件
- **GitHub Pages base path** → 截图放 `public/projects/`，引用路径用 Vite 的 `import.meta.env.BASE_URL` 拼接，避免 `/my-website/` 前缀问题
