## ADDED Requirements

### Requirement: Stats Cards Display

`<StatsCards>` 组件 SHALL 渲染 4 个 KPI 卡片，分别展示：累计学习时长（分钟）、已完成任务数、当前连续打卡天数、历史最长连续打卡天数。每张卡片 MUST 包含：图标、指标名称（中文）、数值、单位。

#### Scenario: 渲染 4 张统计卡片
- **WHEN** 用户进入 Dashboard
- **THEN** `<StatsCards>` SHALL 在主区顶部渲染 4 张卡片
- **AND** 卡片排布在桌面端 SHALL 为单行 4 列，在平板端 SHALL 为 2 行 2 列

#### Scenario: 数值正确反映 mock 数据
- **WHEN** mock 数据 `totalStudyMinutes = 1842`
- **THEN** 对应卡片 SHALL 显示数值 "1842" 与单位 "分钟"

### Requirement: Empty and Invalid State

当 `stats` 为 `undefined`、`null`，或任何字段为非数字时，`<StatsCards>` SHALL 显示占位骨架（4 张灰色占位卡片），MUST NOT 抛出运行时错误或显示 `NaN` / `undefined`。

#### Scenario: 数据为空
- **WHEN** `<StatsCards stats={undefined}>`
- **THEN** 组件 SHALL 渲染 4 张占位骨架卡片
- **AND** DOM 文本 MUST NOT 包含字符串 "undefined" 或 "NaN"

#### Scenario: 数据字段类型错误（错误场景）
- **WHEN** 传入 `stats` 中 `totalStudyMinutes` 为非数字（如字符串或 NaN）
- **THEN** 该卡片 SHALL 显示 "—" 占位符
- **AND** 其他正常字段的卡片 SHALL 不受影响继续展示真实数值
