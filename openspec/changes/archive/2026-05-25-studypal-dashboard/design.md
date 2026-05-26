## Context

当前应用是 React 19 + Vite 7 + TypeScript 的单页静态品牌站，无路由库、零网络请求、所有数据硬编码在 `src/data/projects.ts`。本次设计将其重构为以 Dashboard 为核心的学习工具型 SPA，并为后续接入 FastAPI 后端、AI 能力、用户认证打基础。

**关键约束**：
- 部署在 GitHub Pages（仅静态托管，无运行时）
- 必须复用已有组件，不推倒重来
- 本次不引入后端、AI、鉴权（见 proposal 的 Out of Scope）
- 必须显式留出"后续无痛接入 API"的扩展点

## Goals / Non-Goals

**Goals:**
- 在前端引入清晰的"公开页 / 应用页"双布局架构
- Dashboard 内部具备可扩展的 widget 容器，未来新增 widget 不影响既有 widget
- mock 数据层的接口形状与未来后端 API 对齐，使后续替换"零改动 UI 组件"
- 复用 100% 既有品牌站组件（迁移到 `/about-me`）
- 保持 GitHub Pages 部署可用，无服务端配置依赖

**Non-Goals:**
- 不优化性能到极致（除懒加载 recharts 外不做更多 code splitting）
- 不实现 widget 拖拽 / 自定义排序
- 不引入设计系统库（Radix / shadcn 等）
- 不引入状态管理库（React 内置足够）
- 不为 mock 数据建立"假后端"（如 MSW），直接 import 静态数据

## Decisions

### D1：路由库选 react-router v6，路由模式选 HashRouter

**选型**：`react-router-dom@^6`，使用 `HashRouter`

**理由**：
- v6 是当前稳定主流版本，社区资料最多
- GitHub Pages 不支持服务端路由 fallback，BrowserRouter 在子路径刷新会 404
- HashRouter（URL 形如 `/MyWebsite/#/dashboard`）零服务端依赖，最低风险
- SPA 404 fallback 方案（`404.html` hack）虽然 URL 更干净，但增加部署复杂度，且与 base path `/MyWebsite/` 组合时容易出错

**备选方案对比**：

| 方案 | URL 形态 | 优点 | 缺点 |
|------|---------|------|------|
| BrowserRouter + 404.html | `/MyWebsite/dashboard` | URL 干净 | 部署 hack、易踩坑 |
| **HashRouter** ⭐ | `/MyWebsite/#/dashboard` | 零配置、稳 | URL 带 `#` |
| TanStack Router | — | 类型安全 | 学习成本、社区资料少 |

回滚方案已在 proposal 中列出。

### D2：双布局架构 PublicLayout / AppLayout

**结构**：

```
<HashRouter basename="...">
  <Routes>
    <Route element={<AppLayout />}>      ← 应用壳（左侧栏 + 主区）
      <Route path="/" element={<DashboardPage />} />
    </Route>
    <Route element={<PublicLayout />}>   ← 公共壳（顶部 Navbar）
      <Route path="/about-me" element={<BrandPage />} />
    </Route>
  </Routes>
</HashRouter>
```

**理由**：Dashboard（信息密度高、需侧栏）与品牌站（剧院级首屏、粒子背景）视觉语法相反，不应共用同一 Layout。两套 Layout 通过共享 `useTheme` + Tailwind token 保持品牌一致性。

### D3：目录结构

```
src/
├── App.tsx                       ← 仅返回 <Router> + <Routes>
├── main.tsx                      ← 不变
├── routes.tsx                    ← 集中导出路由配置（便于后续懒加载）
├── layouts/
│   ├── AppLayout.tsx             ← Dashboard 应用壳
│   └── PublicLayout.tsx          ← 品牌站公共壳
├── pages/
│   ├── DashboardPage.tsx         ← 组装 4 个 widget
│   └── BrandPage.tsx             ← 组装 Hero/Project/About（旧首页内容搬过来）
├── components/
│   ├── Navbar.tsx                ← 拆分为 PublicNavbar + DashboardSidebar
│   ├── PublicNavbar.tsx          ← 新：从 Navbar 拆出公共版
│   ├── DashboardSidebar.tsx      ← 新：左侧栏
│   ├── HeroSection.tsx           ← 不动
│   ├── ProjectSection.tsx        ← 不动
│   ├── AboutSection.tsx          ← 不动
│   ├── ProjectCard.tsx           ← 不动
│   ├── ParticleCanvas.tsx        ← 不动
│   └── dashboard/                ← 新：所有 widget 集中
│       ├── StatsCards.tsx        ← 统计卡片
│       ├── DailyGoals.tsx        ← 每日目标
│       ├── AiSuggestions.tsx     ← AI 建议
│       └── TrendChart.tsx        ← 趋势图（动态加载 recharts）
├── data/
│   ├── projects.ts               ← 不动
│   ├── mockStats.ts              ← 新
│   ├── mockGoals.ts              ← 新
│   ├── mockSuggestions.ts        ← 新
│   └── mockTrends.ts             ← 新
└── hooks/
    └── useTheme.ts               ← 不动
```

### D4：组件层级图

```
<App>
 └── <HashRouter>
      └── <Routes>
           │
           ├── <AppLayout>                   ← path=/
           │    │   ┌──────────────────────────────────────┐
           │    │   │ <DashboardSidebar>                   │
           │    │   │   • Logo "StudyPal"                  │
           │    │   │   • NavItem × N (Dashboard/About...) │
           │    │   │   • <ThemeToggle> (复用 useTheme)    │
           │    │   └──────────────────────────────────────┘
           │    │   ┌──────────────────────────────────────┐
           │    │   │ <main> ← <Outlet>                    │
           │    │   │  └── <DashboardPage>                 │
           │    │   │       ├─ <StatsCards>                │
           │    │   │       │    └─ <StatCard> × 4 (mock)  │
           │    │   │       ├─ <DailyGoals>                │
           │    │   │       │    └─ <GoalItem> × N         │
           │    │   │       ├─ <AiSuggestions>             │
           │    │   │       │    └─ <SuggestionCard> × N   │
           │    │   │       └─ <TrendChart>                │
           │    │   │            ├─ <RangeToggle>          │
           │    │   │            └─ <Recharts.LineChart>   │
           │    │   └──────────────────────────────────────┘
           │
           └── <PublicLayout>                ← path=/about-me
                │   ┌──────────────────────────────────────┐
                │   │ <PublicNavbar>                       │
                │   │   • 品牌名 / NavLinks / ThemeToggle  │
                │   └──────────────────────────────────────┘
                │   ┌──────────────────────────────────────┐
                │   │ <main> ← <Outlet>                    │
                │   │  └── <BrandPage>                     │
                │   │       ├─ <HeroSection> ← 不动        │
                │   │       │   └─ <ParticleCanvas>        │
                │   │       ├─ <ProjectSection> ← 不动     │
                │   │       └─ <AboutSection> ← 不动       │
                │   └──────────────────────────────────────┘
```

### D5：mock 数据接口契约（未来 API 端点规范）

虽然本次不实现后端，但所有 mock 数据的 TypeScript 类型即未来 API 响应 schema 的契约。组件只依赖类型，未来切换为 fetch 调用时 widget 无需改动。

**`mockStats.ts`** — 未来对应 `GET /api/stats/summary`：

```ts
export interface StatsSummary {
  totalStudyMinutes: number      // 累计学习分钟
  completedTasks: number         // 已完成任务数
  currentStreakDays: number      // 当前连续打卡天数
  longestStreakDays: number      // 历史最长连续打卡
}
```

**`mockGoals.ts`** — 未来对应 `GET /api/goals/today`、`PATCH /api/goals/:id`：

```ts
export interface DailyGoal {
  id: string
  title: string
  completed: boolean
  estimatedMinutes: number
}
```

**`mockSuggestions.ts`** — 未来对应 `GET /api/ai/suggestions`：

```ts
export interface AiSuggestion {
  id: string
  title: string
  reason: string                 // 推荐理由（mock 文本）
  estimatedMinutes: number
  tags: string[]
}
```

**`mockTrends.ts`** — 未来对应 `GET /api/stats/trends?range=week|month`：

```ts
export interface TrendPoint {
  date: string                   // YYYY-MM-DD
  studyMinutes: number
}
export interface TrendSeries {
  range: 'week' | 'month'
  points: TrendPoint[]
}
```

未来引入后端时只需新增一层 `src/services/api.ts`（fetch 封装），把上述 `mockXxx` 替换为 `fetchXxx()` 调用。widget 内 props/state 形状不变。

### D6：图表库选 Recharts，懒加载

**理由**：
- 与 React 生态契合（声明式、组件化）
- 暗色模式可通过传 `stroke/fill` 实现
- 体积 ~50KB gzipped，可接受
- 通过 `const Recharts = lazy(() => import('recharts'))` 懒加载，避免污染 Dashboard 首屏

**备选**：Chart.js（命令式、需 wrapper）、react-sparklines（太轻，缺功能）。

### D7：状态管理 = 仅 useState

mock 数据是静态常量直接 import，每日目标的勾选状态用 `useState` 局部存。无需 Context / Redux / Zustand。理由：本次无跨页面共享状态，且 out-of-scope 明确不做持久化。

### D8：响应式策略

- 桌面优先（≥ 1024px 双栏，sidebar + main）
- 平板（768~1024px）sidebar 折叠为 icon 列
- 手机（< 768px）sidebar 隐藏，顶部加汉堡菜单按钮（本次仅占位，不实现抽屉）
- 见 Out of Scope：移动端深度适配延后

## Risks / Trade-offs

| 风险 | 影响 | Mitigation |
|------|------|-----------|
| HashRouter URL 带 `#`，不利 SEO | 仅 Dashboard 受影响，品牌页可单独优化 | Dashboard 本就需登录，SEO 不是关键 |
| Recharts 包体 50KB 拖慢首屏 | TTI 增加 | 通过 `React.lazy` + `Suspense` 懒加载，仅 Dashboard 路由触发 |
| `<Navbar />` 拆分为 PublicNavbar / DashboardSidebar 两份代码 | 主题切换按钮、品牌色等可能漂移 | 抽出 `<ThemeToggle>` 子组件复用，色板用 Tailwind token 不硬编码 |
| 用户访问旧 `https://mawei0502.github.io/MyWebsite/`（无 hash）的链接进入 Dashboard 而非品牌站 | 旧外链可能感知不到品牌内容 | 在 Dashboard 顶部预留"了解作者 → /about-me"入口 |
| react-router v6 与 React 19 兼容性 | 个别 hook 行为可能有差 | 已知 `react-router-dom@^6.28` 兼容 React 19；安装时锁定 minor |
| 一次性引入路由 + 拆 Layout + 4 个 widget，PR 太大 | review 难度 | tasks.md 中按 phase 拆分，每个 phase 单独 review |

## Migration Plan

1. **Phase 1 基础设施**：引入 react-router，建立 `/` 与 `/about-me` 两条路由，确保品牌站迁移后视觉等价
2. **Phase 2 应用壳**：搭建 `AppLayout` + `DashboardSidebar`，Dashboard 页面用占位内容
3. **Phase 3 widget**：逐个实现 StatsCards → DailyGoals → AiSuggestions → TrendChart
4. **Phase 4 验收**：lighthouse / 手动测试 / 暗色模式 / 响应式回归

回滚方案：见 proposal.md 第 4 节，4 种降级路径已就绪。

## Open Questions

1. `/` 路径是否真的应该指向 Dashboard？还是 `/dashboard`？（当前决策：`/` = Dashboard，因为这是新主入口）
2. `DashboardSidebar` 中"关于作者"项是否直接外链到 `/about-me`？还是放在 sidebar 底部小角落？
3. 趋势图默认展示周还是月？（暂定：周）
4. AI 建议的"刷新"按钮是真的随机抽 mock，还是仅 UI 动效？（暂定：从 mock 数组中随机抽 3 条）

以上问题在 specs 阶段或 apply 阶段如有阻塞会回头确认。
