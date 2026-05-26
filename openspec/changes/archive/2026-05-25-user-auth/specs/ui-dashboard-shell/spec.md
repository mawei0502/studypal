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
