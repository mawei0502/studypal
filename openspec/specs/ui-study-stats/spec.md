## Purpose

学习统计卡片区域，在 Dashboard 主区顶部以 4 张 KPI 卡片展示核心学习数据，包括累计学习时长、已完成任务数、当前连续打卡天数与历史最长连续打卡天数。

## Requirements

### Requirement: Stats Cards Display

`<StatsCards>` 组件 SHALL 渲染 4 个 KPI 卡片，分别展示：累计学习时长（分钟）、已完成任务数、当前连续打卡天数、历史最长连续打卡天数。每张卡片 MUST 包含：图标、指标名称（中文）、数值、单位。

#### Scenario: 渲染 4 张统计卡片
- **WHEN** 用户进入 Dashboard
- **THEN** `<StatsCards>` SHALL 在主区顶部渲染 4 张卡片
- **AND** 卡片排布在桌面端 SHALL 为单行 4 列，在平板端 SHALL 为 2 行 2 列

### Requirement: Empty and Invalid State

当 API 加载中（loading=true）或请求失败时，`<StatsCards>` SHALL 显示骨架占位或降级提示，MUST NOT 抛出运行时错误或显示 `NaN` / `undefined`。

#### Scenario: 数据为空
- **WHEN** `<StatsCards>` 处于加载中状态
- **THEN** 组件 SHALL 渲染 4 张骨架占位卡片（灰色 animated pulse）

#### Scenario: API 失败降级
- **WHEN** `GET /api/v1/analytics/stats` 请求失败
- **THEN** 所有卡片 SHALL 显示 "—" 占位符，MUST NOT 显示 `NaN` 或 `undefined`

## MODIFIED Requirements

### Requirement: Stats Cards Display

`<StatsCards>` 组件 SHALL 渲染 4 个 KPI 卡片，分别展示：累计学习时长（分钟）、已完成任务数、当前连续打卡天数、历史最长连续打卡天数。每张卡片 MUST 包含：图标、指标名称（中文）、数值、单位。

四项数据 SHALL 从 `GET /api/v1/analytics/stats` 获取，`current_streak_days` 和 `longest_streak_days` 也从 API 而非 mock 数据。加载期间 SHALL 显示骨架占位，加载完成后 SHALL 替换为真实数值。

#### Scenario: 渲染 4 张统计卡片

- **WHEN** 用户进入 Dashboard
- **THEN** `<StatsCards>` SHALL 在主区顶部渲染 4 张卡片
- **AND** 卡片排布在桌面端 SHALL 为单行 4 列，在平板端 SHALL 为 2 行 2 列

#### Scenario: 显示后端真实数据

- **WHEN** `GET /api/v1/analytics/stats` 返回数据
- **THEN** 四张卡片 SHALL 分别显示 `total_study_minutes`、`completed_tasks`、`current_streak_days`、`longest_streak_days`
- **AND** MUST NOT 显示任何 mock 数据值

#### Scenario: 加载中显示骨架

- **WHEN** `GET /api/v1/analytics/stats` 请求尚未返回
- **THEN** 四张卡片 SHALL 同时显示骨架占位（灰色 animated pulse）

#### Scenario: API 请求失败降级展示

- **WHEN** `GET /api/v1/analytics/stats` 返回非 2xx 状态码或网络错误
- **THEN** 所有卡片 SHALL 显示 "—" 占位符，MUST NOT 抛出运行时错误
