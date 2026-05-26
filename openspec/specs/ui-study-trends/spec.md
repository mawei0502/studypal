## Purpose

学习趋势图表，使用 recharts 渲染折线图展示学习时长趋势，支持周/月视图切换，通过懒加载避免影响首屏 bundle 体积。

## Requirements

### Requirement: Trend Chart Rendering

`<TrendChart>` 组件 SHALL 使用 `recharts` 渲染学习时长趋势图。X 轴为日期（`YYYY-MM-DD`），Y 轴为学习时长（分钟）。数据 SHALL 从 `src/data/mockTrends.ts` 导入 `mockTrends`（`TrendSeries` 类型）。组件 MUST 通过 `React.lazy` 动态导入 `recharts`，仅在组件挂载时拉取，不进入主 bundle。

#### Scenario: 默认渲染周视图
- **WHEN** 用户首次进入 Dashboard
- **THEN** `<TrendChart>` SHALL 渲染默认 `range === 'week'` 的折线图
- **AND** X 轴 SHALL 包含 7 个日期刻度

#### Scenario: 暗色模式适配
- **WHEN** `<html>` 处于 `dark` class 下
- **THEN** 图表的轴线、网格线、文字 SHALL 使用浅色（如 `#9ca3af`）
- **AND** 折线主色 SHALL 使用品牌紫色变体（如 `#a78bfa`）

#### Scenario: recharts 懒加载
- **WHEN** 用户进入 Dashboard
- **THEN** 首屏 JS bundle MUST NOT 包含 recharts 代码
- **AND** 进入 Dashboard 后 SHALL 触发独立的 recharts chunk 加载

### Requirement: Range Toggle

`<TrendChart>` SHALL 在图表顶部提供周/月切换控件（如分段按钮）。切换时 SHALL 立即重新渲染图表，从对应的 mock 数据切片中读取数据点。

#### Scenario: 切换到月视图
- **WHEN** 用户点击 "月" 切换按钮
- **THEN** `range` 状态 SHALL 切换为 `'month'`
- **AND** X 轴 SHALL 包含约 30 个日期刻度（取决于 mock 数据）
- **AND** 折线 SHALL 重新绘制

#### Scenario: 切换控件视觉态
- **WHEN** 当前 range 为 `'week'`
- **THEN** "周" 按钮 SHALL 显示激活态（如填充背景），"月" 按钮 SHALL 显示非激活态

### Requirement: Empty and Error State

当 `points` 数组为空，或 recharts 懒加载失败时，`<TrendChart>` SHALL 渲染占位/错误提示，MUST NOT 让 Dashboard 整体崩溃。加载中 SHOULD 显示骨架占位。

#### Scenario: 数据为空
- **WHEN** 当前 range 对应的 `points.length === 0`
- **THEN** 组件 SHALL 显示提示文案 "暂无数据"
- **AND** DOM SHALL 不渲染图表 SVG 元素

#### Scenario: recharts 加载失败（错误场景）
- **WHEN** recharts 的动态 import 抛出错误（如网络异常）
- **THEN** 组件 SHALL 渲染降级提示（如 "图表加载失败"）
- **AND** Dashboard 其余 widget MUST 不受影响继续可见

#### Scenario: 加载中状态
- **WHEN** recharts chunk 正在请求中
- **THEN** 组件 SHALL 显示骨架占位（如灰色矩形 + 脉冲动画）
- **AND** 加载完成后 SHALL 自动替换为真实图表
