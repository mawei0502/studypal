## ADDED Requirements

### Requirement: AI 助手导航项

`<DashboardSidebar>` SHALL 在现有导航项（Dashboard、我的 Profile、关于作者）之后、之前均可，新增"AI 助手"菜单项，链接至 `/chat` 路由。该菜单项 SHALL 遵循与其他菜单项相同的激活态高亮规则（`NavLink` isActive）与响应式图标/文字显示规则。

#### Scenario: 渲染 AI 助手菜单项

- **WHEN** 已登录用户进入任意 Dashboard 页面
- **THEN** sidebar SHALL 显示"AI 助手"菜单项（图标始终可见，≥lg 宽度时显示文字）

#### Scenario: 点击跳转 /chat

- **WHEN** 用户点击"AI 助手"菜单项
- **THEN** URL SHALL 变为 `/#/chat`
- **AND** "AI 助手"项 SHALL 处于激活态高亮
