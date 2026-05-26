## Purpose

学习日历 heatmap 组件，以 GitHub-style 颜色网格展示每日学习活跃度，数据从后端 `/api/v1/analytics/calendar` API 获取。

## Requirements

### Requirement: Study Calendar API

后端 SHALL 提供 `GET /api/v1/analytics/calendar` 端点，接受可选的 `year` 查询参数（默认当前年），返回 JSON 数组 `[{ date: "2026-01-01", study_minutes: 45 }, ...]`。数据从 `study_logs` 表按日期范围聚合查询。未登录请求 SHALL 返回 401。

#### Scenario: 返回当年日历数据

- **WHEN** 已登录用户请求 `GET /api/v1/analytics/calendar`
- **THEN** 返回状态码 200
- **AND** 响应体 SHALL 为包含 `date` 和 `study_minutes` 的对象数组
- **AND** 数组中每个元素日期 SHALL 在当前年份范围内

#### Scenario: 指定年份查询

- **WHEN** 已登录用户请求 `GET /api/v1/analytics/calendar?year=2025`
- **THEN** 返回状态码 200
- **AND** 所有返回条目的日期 SHALL 属于 2025 年

#### Scenario: 未认证请求

- **WHEN** 未登录用户请求 `GET /api/v1/analytics/calendar`
- **THEN** 返回状态码 401

### Requirement: Study Calendar Component

`<StudyCalendar>` 组件 SHALL 以 GitHub-style heatmap 网格展示过去 365 天的学习活跃度。每格颜色深度 SHALL 映射当日学习分钟数（0 → 无色，>0 → 从浅绿到深绿渐变）。点击某日格 SHALL 显示 tooltip 包含日期和当日学习分钟数。

#### Scenario: 渲染 365 天 heatmap

- **WHEN** Calendar 组件挂载并加载 API 数据
- **THEN** SHALL 渲染 7 行 × ~53 列的颜色网格（每格代表一天）
- **AND** 数据为空的日期 SHALL 渲染为浅灰色/无色块
- **AND** 有学习记录的日期 SHALL 渲染为绿色块，颜色深度与学习时长正相关

#### Scenario: 点击日期显示 tooltip

- **WHEN** 用户将鼠标悬停或点击 heatmap 中的某日格
- **THEN** SHALL 显示 tooltip 气泡，内容为 "2026-01-15：45 分钟"

#### Scenario: API 加载失败显示占位

- **WHEN** calendar API 返回非 2xx 或网络错误
- **THEN** 组件 SHALL 显示灰色占位 heatmap（无颜色变化）
- **AND** SHALL 显示提示文字"日历数据暂时不可用"
