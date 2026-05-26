## ADDED Requirements

### Requirement: Achievements API

后端 SHALL 提供 `GET /api/v1/analytics/achievements` 端点。返回 JSON 数组，每个元素包含成就元数据（slug、title、description、icon_url）和当前用户是否已解锁（`unlocked: bool`）、解锁时间（`unlocked_at: string | null`）。未登录请求 SHALL 返回 401。

#### Scenario: 返回成就列表及解锁状态

- **WHEN** 已登录用户请求 `GET /api/v1/analytics/achievements`
- **THEN** 返回状态码 200
- **AND** 响应体 SHALL 为对象数组
- **AND** 每个对象 SHALL 包含 `slug`、`title`、`description`、`unlocked` 字段
- **AND** 已解锁的成就 SHALL 包含 `unlocked_at` 时间戳

#### Scenario: 未认证请求

- **WHEN** 未登录用户请求 `GET /api/v1/analytics/achievements`
- **THEN** 返回状态码 401

### Requirement: Achievement Grid UI

`<AchievementGrid>` 组件 SHALL 以 4 列（桌面端）/ 2 列（平板端）网格展示所有成就。已解锁的成就 SHALL 彩色显示并带"已解锁"标记；未解锁的成就 SHALL 以灰阶显示并显示解锁条件描述。

#### Scenario: 渲染成就网格

- **WHEN** AchievementGrid 组件加载 API 成就数据
- **THEN** SHALL 渲染图标网格布局
- **AND** `unlocked: true` 的卡片 SHALL 彩色显示，右下角显示"已解锁"徽章
- **AND** `unlocked: false` 的卡片 SHALL 灰阶显示，显示解锁条件文字

#### Scenario: API 加载失败

- **WHEN** achievements API 返回非 2xx 或网络错误
- **THEN** 组件 SHALL 显示"成就数据暂时不可用"提示
- **AND** SHALL 包含重试按钮
