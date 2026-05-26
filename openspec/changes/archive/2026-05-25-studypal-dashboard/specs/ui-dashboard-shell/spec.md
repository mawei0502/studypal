## ADDED Requirements

### Requirement: Application Routing

应用 SHALL 使用 `react-router-dom` 的 `HashRouter` 提供两条主路由：`/` 指向 StudyPal Dashboard，`/about-me` 指向原品牌站内容。未匹配路径 SHALL 重定向到 `/`。

#### Scenario: 访问根路径展示 Dashboard
- **WHEN** 用户访问 `/MyWebsite/#/`
- **THEN** 浏览器 SHALL 渲染 `<DashboardPage>`，包含左侧导航栏与主区 widget 网格

#### Scenario: 访问关于页展示品牌站
- **WHEN** 用户访问 `/MyWebsite/#/about-me`
- **THEN** 浏览器 SHALL 渲染 `<BrandPage>`，包含原 `HeroSection` / `ProjectSection` / `AboutSection`

#### Scenario: 访问未知路径
- **WHEN** 用户访问 `/MyWebsite/#/foo-bar`（未注册路由）
- **THEN** 应用 SHALL 重定向到 `/`，不出现白屏或路由错误

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

`<DashboardSidebar>` SHALL 包含品牌 logo "StudyPal"、至少 2 个导航菜单项（Dashboard、关于作者）、以及主题切换按钮。当前激活路由对应的菜单项 SHALL 以视觉高亮态（如 `bg-violet-100 dark:bg-violet-900/40` 或同等强调样式）显示。

#### Scenario: 渲染默认菜单项
- **WHEN** 用户首次进入 `/`
- **THEN** sidebar SHALL 显示 "Dashboard" 与 "关于作者" 两个菜单项
- **AND** "Dashboard" 项 SHALL 处于激活态

#### Scenario: 点击菜单项跳转
- **WHEN** 用户点击 sidebar 中的 "关于作者" 菜单项
- **THEN** URL SHALL 变为 `/about-me`
- **AND** sidebar 的激活态不再显示在该项上（因为已离开 AppLayout）

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
