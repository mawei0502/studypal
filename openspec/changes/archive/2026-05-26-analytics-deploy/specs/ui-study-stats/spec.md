## MODIFIED Requirements

### Requirement: Stats Cards Display

`<StatsCards>` 组件 SHALL 渲染 4 个 KPI 卡片，分别展示：累计学习时长（分钟）、已完成任务数、当前连续打卡天数、历史最长连续打卡天数。全部四项数据 SHALL 从 `GET /api/v1/analytics/stats` 获取，不再使用 `mockStats` 常量。加载期间 SHALL 显示骨架占位，API 失败时 SHALL 显示 "—" 占位符。

#### Scenario: 渲染 4 张统计卡片

- **WHEN** 用户进入 Dashboard
- **THEN** `<StatsCards>` SHALL 在主区顶部渲染 4 张卡片
- **AND** 卡片排布在桌面端 SHALL 为单行 4 列，在平板端 SHALL 为 2 行 2 列

#### Scenario: 显示后端聚合数据

- **WHEN** `GET /api/v1/analytics/stats` 返回 `{ totalStudyMinutes: 2000, completedTasks: 50, currentStreakDays: 7, longestStreakDays: 31 }`
- **THEN** 四张卡片 SHALL 分别显示对应数值，MUST NOT 显示 mock 值

#### Scenario: 加载中显示骨架

- **WHEN** `GET /api/v1/analytics/stats` 请求尚未返回
- **THEN** 四张卡片 SHALL 全部显示骨架占位（灰色 animated pulse）

#### Scenario: API 请求失败降级展示

- **WHEN** `GET /api/v1/analytics/stats` 返回非 2xx 或网络错误
- **THEN** 四张卡片 SHALL 全部显示 "—" 占位符
- **AND** MUST NOT 抛出运行时错误
