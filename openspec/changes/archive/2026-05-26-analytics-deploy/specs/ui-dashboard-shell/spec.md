## MODIFIED Requirements

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

### Requirement: Application Routing

应用 SHALL 使用 `react-router-dom` 的 `HashRouter` 提供以下 Dashboard 路由：`/`（学习数据 / DashboardPage）、`/chat`（AI 对话建议 / ChatPage）、`/goals`（学习目标 / GoalsPage）、`/achievements`（成就 / AchievementsPage）。品牌站 `/about-me` 路由保持不变。未匹配路径 SHALL 重定向到 `/`。

#### Scenario: 访问 /goals 展示学习目标页

- **WHEN** 已登录用户访问 `/#/goals`
- **THEN** 页面 SHALL 渲染之前的每日目标组件内容

#### Scenario: 访问 /achievements 展示成就页

- **WHEN** 已登录用户访问 `/#/achievements`
- **THEN** 页面 SHALL 渲染 AchievementGrid 组件

## REMOVED Requirements

### Requirement: AI 助手导航项

**Reason**: 导航项统一重构，AI 助手导航项被"AI 对话建议"替代，功能相同但名称和位置更新。
**Migration**: 使用 "AI 对话建议" 导航项（`/chat` 路由），原功能不变。
