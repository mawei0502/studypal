## Why

当前个人品牌站是单页静态展示（Hero + Projects + About），缺少帮助用户长期学习的核心能力。我们要把品牌站重构为 **StudyPal 学习 Dashboard**，让网站从"展示型"演进为"工具型"，承担个人学习追踪、每日目标管理、学习趋势分析等核心使用场景。

本次重构是后续接入 FastAPI 后端、AI 建议、用户认证等能力的基础设施铺垫，但本次变更**仅完成前端结构与 mock 数据驱动的可视化交付**。

## What Changes

- **路由架构切换**：引入 react-router，默认路由 `/` 由原品牌站改为 StudyPal Dashboard；原品牌站组件迁移到 `/about-me` 子路由保留
- **新增 Dashboard 应用壳**：包含左侧导航栏（logo / 主菜单 / 主题切换）+ 顶部条 + 主区网格容器，采用 `<AppLayout>` 与 `<PublicLayout>` 两套布局分离
- **新增 4 个 Dashboard widget**（均使用 mock 数据驱动）：
  - 数据统计卡片：累计学习时长、已完成任务数、连续打卡天数等 KPI
  - 每日目标清单：可勾选的目标条目，状态保存在组件本地
  - AI 建议学习面板：展示 mock 推荐内容卡片，UI 占位为后续真实 AI 接入预留
  - 周/月趋势图：使用 Recharts 渲染学习时长折线/柱状图，支持周/月切换
- **新增 mock 数据层**：在 `src/data/` 下新增 `mockStats.ts`、`mockGoals.ts`、`mockSuggestions.ts`、`mockTrends.ts`，接口形状对齐未来后端 API 的预期 schema
- **复用已有资产**：`useTheme` hook、Tailwind 设计 token、暗色模式、`ParticleCanvas`（可选用于 `/about-me`）、`Navbar` 中的主题切换按钮全部沿用
- **品牌站组件原样迁移**：`HeroSection` / `ProjectSection` / `AboutSection` / `ProjectCard` 不重写，仅挂载到 `/about-me` 路由下

### Out of Scope（不做的事项）

- ❌ 后端 API（所有数据均来自 mock 常量或本地状态）
- ❌ 真实 AI 功能调用（AI 建议面板仅展示静态 mock 卡片）
- ❌ 用户认证与登录态
- ❌ 数据持久化（除 `useTheme` 已有的 localStorage 外，不引入新的存储）
- ❌ Dashboard 内部子路由 / widget 详情展开页
- ❌ 移动端深度适配（保证基础响应式即可，主要面向桌面端）
- ❌ 国际化（仍仅简体中文）

## Capabilities

### New Capabilities

> 命名约定：`ui-*` 前缀表示 UI 域（CLAUDE.md "按业务域组织"），后续可有 `auth-*`、`ai-*` 等其他域。openspec 工具要求 capability 名为单层 kebab-case，因此用 `-` 而非 `/` 分隔域与子能力。

- `ui-dashboard-shell`：Dashboard 整体框架。覆盖应用级路由配置（`/` → Dashboard，`/about-me` → 品牌站）、`AppLayout` / `PublicLayout` 切分、左侧导航栏、主区 grid 容器
- `ui-study-stats`：学习数据统计卡片。覆盖 KPI 卡片展示、mock 数据接入契约、空态/加载态
- `ui-daily-goals`：每日目标清单。覆盖目标条目展示、勾选状态切换、空态
- `ui-ai-suggestions`：AI 建议学习面板。覆盖 mock 推荐内容卡片列表展示、"刷新建议"按钮交互（仅前端模拟）
- `ui-study-trends`：周/月趋势图。覆盖图表渲染、周/月时间范围切换、空态/数据异常态

### Modified Capabilities

无 —— `openspec/specs/` 当前为空，没有既有 spec 需要修改。原品牌站组件作为"路由迁移"处理，不涉及行为变更，故不产生 delta spec。

## Impact

### 受影响的文件 / 模块

- `src/App.tsx`：从直接组合 section 改为路由配置入口
- `src/main.tsx`：包裹 Router（具体路由实现见 design.md）
- `src/components/Navbar.tsx`：锚点链接改为 `<Link>` 跳转；可能拆分为 `PublicNavbar` 与 `DashboardSidebar` 两个组件
- `src/components/HeroSection.tsx` / `ProjectSection.tsx` / `AboutSection.tsx` / `ProjectCard.tsx` / `ParticleCanvas.tsx`：**不修改源码**，仅挂载位置变更
- `src/data/projects.ts`：保留，作为 `/about-me` 数据源
- 新增目录：`src/pages/`、`src/layouts/`、`src/components/dashboard/`
- 新增数据：`src/data/mockStats.ts`、`mockGoals.ts`、`mockSuggestions.ts`、`mockTrends.ts`

### 依赖变更

- **新增**：`react-router-dom`（路由）、`recharts`（趋势图渲染）
- **保留**：React 19、Vite 7、Tailwind v4、TypeScript 全部不变
- **不引入**：状态管理库（React 内置即可）、UI 组件库（继续手写 Tailwind）

### 部署影响

- GitHub Pages 路由方案需在 design.md 中决策（候选：HashRouter 或 SPA 404 fallback）
- `vite.config.ts` 的 `base: '/MyWebsite/'` 不变
- `npm run build` 产出仍为纯静态 `dist/`，仍可通过 `npm run deploy` 部署
- 包体积新增：react-router ~10KB gzipped，recharts ~50KB gzipped；首屏仍可控制在 2s 内（趋势图可懒加载）

### 性能影响

- recharts 体积较大 → 通过动态 `import()` 懒加载，仅在进入 Dashboard 时拉取
- 所有图片继续保持 lazy loading（既有约束）
- 粒子背景 ParticleCanvas 仅在 `/about-me` 启用，不进入 Dashboard 首屏

### 回滚方案（路由架构切换为高风险点）

1. **路由导致 GH Pages 路径异常且短时不可修复** → `git revert` 本次变更，回退到当前稳定的品牌站 commit `df11792`
2. **Dashboard 视觉不达预期但路由可用** → 保留 react-router 基础设施，将 `/` 临时改回挂载品牌站，仅 `/dashboard` 暴露新版
3. **recharts 包体超预算** → 替换为 `react-sparklines` 或自绘 SVG（接口已通过 mock 数据层解耦，替换不影响 widget 调用方）
4. **react-router 在 GH Pages 表现不佳** → 回退为 HashRouter（最低风险方案）
