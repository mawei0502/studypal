## MODIFIED Requirements

### Requirement: Stats Cards Display

`<StatsCards>` 组件 SHALL 渲染 4 个 KPI 卡片，分别展示：累计学习时长（分钟）、已完成任务数、当前连续打卡天数、历史最长连续打卡天数。每张卡片 MUST 包含：图标、指标名称（中文）、数值、单位。

`current_streak_days`（当前连续打卡天数）SHALL 从 `GET /api/v1/users/me` 获取，其余三项在本次迭代中 SHALL 继续使用 `mockStats` 常量（待后续迭代迁移）。`current_streak_days` 加载期间 SHALL 显示骨架占位，加载完成后 SHALL 替换为真实数值。

#### Scenario: 渲染 4 张统计卡片

- **WHEN** 用户进入 Dashboard
- **THEN** `<StatsCards>` SHALL 在主区顶部渲染 4 张卡片
- **AND** 卡片排布在桌面端 SHALL 为单行 4 列，在平板端 SHALL 为 2 行 2 列

#### Scenario: 连续天数显示后端真实数据

- **WHEN** `GET /api/v1/users/me` 返回 `{ current_streak_days: 7 }`
- **THEN** 连续打卡天数卡片 SHALL 显示数值 "7"，MUST NOT 显示 mock 值 "12"

#### Scenario: 连续天数加载中显示骨架

- **WHEN** `GET /api/v1/users/me` 请求尚未返回
- **THEN** 连续打卡天数卡片 SHALL 显示骨架占位（灰色 animated pulse），其余 3 张卡片 SHALL 正常展示 mock 数据

#### Scenario: API 请求失败降级展示（错误场景）

- **WHEN** `GET /api/v1/users/me` 返回非 2xx 状态码或网络错误
- **THEN** 连续打卡天数卡片 SHALL 显示 "—" 占位符，MUST NOT 抛出运行时错误
