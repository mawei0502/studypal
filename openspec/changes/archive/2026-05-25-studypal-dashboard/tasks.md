## 1. Phase 1：路由基础设施 + 品牌站迁移

- [x] 1.1 安装依赖：`npm i react-router-dom@^6.28`（不引入 BrowserRouter 之外的额外包）
- [x] 1.2 新建 `src/layouts/` 目录与 `src/pages/` 目录（验证目录结构对齐 design.md D3）
- [x] 1.3 创建 `src/pages/BrandPage.tsx`：原 `App.tsx` 中 `<HeroSection />` + `<ProjectSection />` + `<AboutSection />` 组合直接搬过来，**MUST NOT** 修改这些组件内部代码
- [x] 1.4 创建 `src/components/PublicNavbar.tsx`：将原 `Navbar.tsx` 复制一份，菜单项保留但去掉 `#contact` 死链，锚点跳转保留用于品牌页单页内跳转
- [x] 1.5 创建 `src/layouts/PublicLayout.tsx`：渲染 `<PublicNavbar />` + `<main><Outlet /></main>`
- [x] 1.6 改写 `src/App.tsx`：包裹 `<HashRouter>`，注册 `/about-me` → `<PublicLayout>` → `<BrandPage>`，根 `/` 暂时也指向 `<BrandPage>`（占位，留待 Phase 2 替换）
- [x] 1.7 **验证步骤 (Phase 1)**：
  - 运行 `npm run dev`，访问 `/MyWebsite/#/about-me` 视觉与原品牌站等价
  - 访问 `/MyWebsite/#/` 显示同样品牌站内容（占位）
  - 暗色模式切换在两个路径下都正常
  - `npm run build` 成功，dist/ 产出无 TS 错误
  - **暂停等待用户 review，确认后进入 Phase 2**

## 2. Phase 2：Dashboard 应用壳

- [x] 2.1 抽出 `src/components/ThemeToggle.tsx`：把 `Navbar.tsx` 中主题切换按钮抽成独立组件，`PublicNavbar` 内改为引用此组件（避免 Phase 3 中 Sidebar 重复实现）
- [x] 2.2 创建 `src/components/DashboardSidebar.tsx`：左侧栏含 "StudyPal" logo、菜单项 "Dashboard"（路由 `/`）与 "关于作者"（路由 `/about-me`）、底部 `<ThemeToggle />`；激活态使用 `react-router-dom` 的 `NavLink` 自动管理；响应式断点对齐 spec `Sidebar Responsive Behavior`
- [x] 2.3 创建 `src/layouts/AppLayout.tsx`：左侧 `<DashboardSidebar />` + 主区 `<main><Outlet /></main>`，整体 `min-h-screen` 与 Tailwind grid 布局
- [x] 2.4 创建 `src/pages/DashboardPage.tsx`：先做占位骨架（4 个灰色 placeholder 卡 + 1 个图表区占位），不接 widget
- [x] 2.5 更新 `src/App.tsx` 路由表：`/` 改为 `<AppLayout>` → `<DashboardPage>`；`/about-me` 保持 `<PublicLayout>` → `<BrandPage>`；新增 `*` 兜底重定向到 `/`
- [x] 2.6 **验证步骤 (Phase 2)**：
  - `/` 渲染左侧栏 + 占位主区，无品牌站内容
  - `/about-me` 渲染顶部 Navbar + 品牌站，无左侧栏
  - 主题切换在两侧 Layout 之间持久化（刷新后状态保留）
  - sidebar 在窗口宽度 < 768px 时隐藏，宽度 768~1024px 时仅图标
  - **暂停等待用户 review，确认后进入 Phase 3**

## 3. Phase 3：Widget 实现（mock 数据驱动）

### 3.A 数据层（先建后用）

- [x] 3.A.1 创建 `src/data/mockStats.ts`：导出 `interface StatsSummary` 与 `mockStats` 常量（字段对齐 design.md D5）
- [x] 3.A.2 创建 `src/data/mockGoals.ts`：导出 `interface DailyGoal` 与 `mockGoals` 常量（5~7 条样例）
- [x] 3.A.3 创建 `src/data/mockSuggestions.ts`：导出 `interface AiSuggestion` 与 `mockSuggestions` 常量（6~8 条样例，便于刷新随机抽取）
- [x] 3.A.4 创建 `src/data/mockTrends.ts`：导出 `interface TrendPoint`、`TrendSeries` 与 `mockTrends` 常量（含 `week` 7 点、`month` ~30 点）

### 3.B 统计卡片

- [x] 3.B.1 创建 `src/components/dashboard/StatsCards.tsx`：实现 spec `ui-study-stats` 全部 requirements，含空态/异常字段降级
- [x] 3.B.2 在 `DashboardPage` 顶部挂载 `<StatsCards />`

### 3.C 每日目标

- [x] 3.C.1 创建 `src/components/dashboard/DailyGoals.tsx`：含 `GoalItem` 子组件、`useState` 管理勾选状态、空态文案
- [x] 3.C.2 在 `DashboardPage` 主区左列挂载 `<DailyGoals />`

### 3.D AI 建议面板

- [x] 3.D.1 创建 `src/components/dashboard/AiSuggestions.tsx`：含 `SuggestionCard` 子组件、"刷新建议" 按钮（Math.random 抽 3 条）、空态、异常条目跳过逻辑
- [x] 3.D.2 在 `DashboardPage` 主区右列挂载 `<AiSuggestions />`

### 3.E 趋势图

- [x] 3.E.1 安装依赖：`npm i recharts`
- [x] 3.E.2 创建 `src/components/dashboard/TrendChart.tsx`：使用 `React.lazy(() => import('recharts'))` 懒加载；含周/月切换 `RangeToggle`、`Suspense` fallback 骨架、错误边界降级
- [x] 3.E.3 在 `DashboardPage` 底部挂载 `<TrendChart />`

- [x] 3.F **验证步骤 (Phase 3)**：
  - 4 张统计卡片显示正确数值、暗色模式正常
  - 每日目标可勾选/取消，刷新后状态回到 mock 初始值（符合 spec 限制）
  - "刷新建议" 按钮重新抽取 3 条卡片
  - 趋势图周/月切换刷新图表，暗色模式色板正确
  - `npm run build` 后构建产物中确认 recharts 在独立 chunk（通过 `dist/assets/` 文件名验证）
  - 控制台无 error / warning（除了刻意的异常数据 warning）
  - **暂停等待用户 review，确认后进入 Phase 4**

## 4. Phase 4：验收与清理

- [x] 4.1 全量回归：依次访问 `/`、`/about-me`、未知路径（应重定向 `/`），所有路径正常
- [x] 4.2 暗色模式回归：在每个路径下切换主题，确认无样式漂移
- [x] 4.3 响应式回归：在桌面（1280px）、平板（900px）、手机（420px）三档断点目测 Dashboard 与品牌站布局
- [x] 4.4 性能粗测：浏览器 DevTools 看 Dashboard 首屏 JS 体积，确认未把 recharts 打入主 bundle
- [x] 4.5 用 `openspec validate studypal-dashboard --strict` 验证所有 spec 通过
- [x] 4.6 检查 `package.json` 与 `package-lock.json` 同步提交；确认无遗留 console.log 与未使用的 import
- [x] 4.7 更新 `README.md`（可选）：新增 "本地预览 Dashboard" 段落
- [x] 4.8 **验证步骤 (Phase 4)**：
  - 所有验收项通过
  - `npm run lint` 通过
  - `npm run build` 通过
  - 准备提 PR，准备执行 `/opsx:archive studypal-dashboard`
