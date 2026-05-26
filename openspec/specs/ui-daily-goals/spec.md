## Purpose

每日学习目标列表，展示当日目标条目并支持勾选完成交互。数据来源于本地 mock，状态保存在组件本地，不持久化。

## Requirements

### Requirement: Goal List Rendering

`<DailyGoals>` 组件 SHALL 从 `src/data/mockGoals.ts` 导入 `mockGoals` 常量（`DailyGoal[]`）作为初始数据，并以列表形式渲染每个目标条目。每个条目 MUST 显示：复选框、目标标题、预估时长（分钟），并 SHALL 支持暗色模式样式。

#### Scenario: 渲染目标列表
- **WHEN** 用户进入 Dashboard 且 mock 包含 5 条目标
- **THEN** `<DailyGoals>` SHALL 渲染 5 个 `<GoalItem>` 条目
- **AND** 每条 SHALL 显示复选框、标题文字、预估时长（如 "30 分钟"）

#### Scenario: 已完成目标视觉区分
- **WHEN** 某条目标的 `completed === true`
- **THEN** 该条目 SHALL 显示删除线（如 `line-through`）
- **AND** 文字 SHALL 使用次级灰色（如 `text-gray-400 dark:text-gray-500`）

### Requirement: Goal Toggle Interaction

用户 SHALL 能通过点击复选框切换某条目标的 `completed` 状态。状态变更 MUST 立即在 UI 反映，并保存在组件本地 `useState` 中。本次实现 MUST NOT 持久化到 localStorage 或后端。

#### Scenario: 勾选未完成目标
- **WHEN** 用户点击一条 `completed === false` 目标的复选框
- **THEN** 该条目状态 SHALL 切换为 `completed === true`
- **AND** UI SHALL 即时显示删除线与灰色文字

#### Scenario: 取消勾选已完成目标
- **WHEN** 用户点击一条 `completed === true` 目标的复选框
- **THEN** 该条目状态 SHALL 切换为 `completed === false`
- **AND** UI SHALL 恢复正常文字样式

#### Scenario: 刷新页面状态丢失（已知限制）
- **WHEN** 用户勾选若干目标后刷新浏览器
- **THEN** 所有目标的 completed 状态 SHALL 回到 mock 初始值
- **AND** 系统 MUST NOT 抛出错误

### Requirement: Empty State

当目标列表为空（`mockGoals.length === 0` 或外部传入空数组）时，`<DailyGoals>` SHALL 渲染友好空态提示（如 "今天还没有目标，添加一个开始学习吧"），MUST NOT 显示空白容器或运行时错误。

#### Scenario: 空数组渲染空态（错误/边界场景）
- **WHEN** 传入 `<DailyGoals goals={[]}>`
- **THEN** 组件 SHALL 显示空态提示文案
- **AND** DOM SHALL 不包含任何 `<GoalItem>` 元素
- **AND** 组件 MUST NOT 抛出错误
