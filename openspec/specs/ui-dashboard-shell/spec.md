## Purpose

Dashboard 壳层（Shell）负责应用路由、双布局组合与侧边栏导航。提供 `/`（Dashboard）与 `/about-me`（品牌站）两条路由，并通过 `<AppLayout>` / `<PublicLayout>` 两套独立 Layout 分别承载内容。

## Requirements

### Requirement: Application Routing

应用 SHALL 使用 `react-router-dom` 的 `HashRouter` 提供以下 Dashboard 路由：`/`（学习数据 / DashboardPage）、`/chat`（AI 对话建议 / ChatPage）、`/goals`（学习目标 / GoalsPage）、`/achievements`（成就 / AchievementsPage）。品牌站 `/about-me` 路由保持不变。未匹配路径 SHALL 重定向到 `/`。

#### Scenario: 访问根路径展示 Dashboard
- **WHEN** 用户访问 `/MyWebsite/#/`
- **THEN** 浏览器 SHALL 渲染 `<DashboardPage>`，包含左侧导航栏与主区 widget 网格

#### Scenario: 访问关于页展示品牌站
- **WHEN** 用户访问 `/MyWebsite/#/about-me`
- **THEN** 浏览器 SHALL 渲染 `<BrandPage>`，包含原 `HeroSection` / `ProjectSection` / `AboutSection`

#### Scenario: 访问未知路径
- **WHEN** 用户访问 `/MyWebsite/#/foo-bar`（未注册路由）
- **THEN** 应用 SHALL 重定向到 `/`，不出现白屏或路由错误

#### Scenario: 访问 /goals 展示学习目标页

- **WHEN** 已登录用户访问 `/#/goals`
- **THEN** 页面 SHALL 渲染 GoalsPage 内容

#### Scenario: 访问 /achievements 展示成就页

- **WHEN** 已登录用户访问 `/#/achievements`
- **THEN** 页面 SHALL 渲染 AchievementGrid 组件

### Requirement: Dual Layout Composition

应用 SHALL 提供两套独立的 Layout 组件：`<AppLayout>` 用于 Dashboard 路由（含左侧导航栏 + 主区 `<Outlet>`），`<PublicLayout>` 用于品牌站路由（含顶部 `PublicNavbar` + 主区 `<Outlet>`）。两套 Layout MUST 共享 `useTheme` 与 Tailwind 设计 token。

#### Scenario: Dashboard 路由使用 AppLayout
- **WHEN** 当前路由为 `/`
- **THEN** DOM SHALL 包含 `<aside>` 左侧导航容器与主区，不包含品牌站的顶部 Navbar

#### Scenario: 品牌页路由使用 PublicLayout
- **WHEN** 当前路由为 `/about-me`
- **THEN** DOM SHALL 包含顶部固定 Navbar，不包含 Dashboard 的左侧导航栏

#### Scenario: 主题切换跨布局保持一致
- **WHEN** 用户在 Dashboard 触发主题切换
- **AND** 随后导航至 `/about-me`
- **THEN** 品牌站 SHALL 沿用同一主题（`<html>` 的 `dark` class 持久化生效）

### Requirement: Sidebar Navigation

`<DashboardSidebar>` SHALL 提供以下三个导航项并按顺序排列："学习数据"（链接至 `/`）、"AI 对话建议"（链接至 `/chat`）、"学习目标"（链接至 `/goals`）。此外 SHALL 保留用户区域和主题切换按钮。"我的 Profile"和"关于作者"导航项 SHALL 从侧边栏移除。当前激活路由对应的菜单项 SHALL 以视觉高亮态（`bg-violet-100 dark:bg-violet-900/40`）显示。

#### Scenario: 侧边栏展示三个核心导航项

- **WHEN** 已登录用户进入 Dashboard
- **THEN** sidebar SHALL 显示"学习数据"、"AI 对话建议"、"学习目标"三个导航项（按此顺序）
- **AND** SHALL 不包含"Dashboard"、"我的 Profile"或"关于作者"导航项

#### Scenario: 点击"学习数据"导航

- **WHEN** 用户点击 sidebar 中的"学习数据"项
- **THEN** URL SHALL 变为 `/#/`
- **AND** "学习数据"项 SHALL 处于激活态高亮

#### Scenario: 点击"AI 对话建议"导航

- **WHEN** 用户点击 sidebar 中的"AI 对话建议"项
- **THEN** URL SHALL 变为 `/#/chat`
- **AND** "AI 对话建议"项 SHALL 处于激活态高亮

#### Scenario: 点击"学习目标"导航

- **WHEN** 用户点击 sidebar 中的"学习目标"项
- **THEN** URL SHALL 变为 `/#/goals`
- **AND** "学习目标"项 SHALL 处于激活态高亮

#### Scenario: 主题切换按钮可用
- **WHEN** 用户点击 sidebar 底部的主题切换按钮
- **THEN** `<html>` 的 `dark` class SHALL 即时切换
- **AND** 切换后的主题值 SHALL 写入 localStorage

### Requirement: Sidebar Responsive Behavior

`<DashboardSidebar>` SHALL 在视口宽度 ≥ 1024px 时完整展示文字 + 图标；在 768px ≤ 宽度 < 1024px 时仅显示图标列；在宽度 < 768px 时 sidebar SHALL 隐藏，主区占满宽度。

#### Scenario: 桌面宽度下完整展示
- **WHEN** 视口宽度为 1280px
- **THEN** sidebar 宽度 SHALL ≥ 200px，菜单项文字可见

#### Scenario: 移动宽度下隐藏
- **WHEN** 视口宽度为 480px
- **THEN** sidebar SHALL 不占据 DOM 渲染空间（display:none 或 hidden class）
- **AND** 主区 SHALL 占满视口宽度

## ADDED Requirements

### Requirement: Protected Route Guard

应用 SHALL 为所有 Dashboard 路由（`/` 及 `/profile`）包裹 `<ProtectedRoute>` 守卫组件。未持有有效 access token 的用户访问受保护路由时 SHALL 被重定向至 `/login`，原始目标路径 SHALL 通过 router state 传递给登录页。

#### Scenario: 未登录访问 Dashboard 重定向至登录页

- **WHEN** 未登录用户直接访问 `/`（Dashboard）
- **THEN** 应用 SHALL 立即重定向至 `/login`
- **AND** URL SHALL 变为 `/login`，不出现闪烁的 Dashboard 内容

#### Scenario: 已登录用户正常访问受保护路由

- **WHEN** 持有有效 access token 的用户访问 `/`
- **THEN** 应用 SHALL 正常渲染 `<DashboardPage>`，不触发跳转

#### Scenario: 登录后跳回原目标路径

- **WHEN** 未登录用户访问 `/profile` 被重定向至 `/login`，随后成功登录
- **THEN** 应用 SHALL 跳转至 `/profile`，而非固定 `/`

### Requirement: Sidebar User Area

`<DashboardSidebar>` 底部 SHALL 新增用户区域，展示当前用户的头像（圆形裁剪）与显示名（≥ lg 宽度时可见）。区域内 SHALL 包含"退出"操作，点击后 SHALL 清除本地 token 并跳转至 `/login`。

#### Scenario: 渲染已登录用户信息

- **WHEN** 已登录用户进入 Dashboard
- **THEN** sidebar 底部 SHALL 显示用户头像（或默认首字母占位）与显示名

#### Scenario: 点击退出后清除状态

- **WHEN** 用户点击 sidebar 底部的退出按钮
- **THEN** 前端 SHALL 清除 localStorage 中的 refresh token 与内存中的 access token
- **AND** 页面 SHALL 跳转至 `/login`
- **AND** 刷新页面后 SHALL 仍处于未登录状态（无法访问 Dashboard）
