## Why

学习数据目前分散在 mock 数据和 AI 对话上下文中，缺少统一的可视化分析面板。用户需要一个直观的统计面板来追踪学习日历、解锁成就，并完成部署上线让真实用户可访问。

## What Changes

- 新增学习日历组件（heatmap 风格），展示每日学习活跃度
- 新增成就系统，展示已解锁/待解锁的成就徽章
- 重构左侧导航栏为：学习数据、AI 对话建议、学习目标
- 统计卡片数据从 mock 迁移到 FastAPI 数据库聚合 API
- 部署上线：后端部署到云服务，前端部署到 GitHub Pages

## Capabilities

### New Capabilities

- `study-calendar`: 学习日历组件，heatmap 风格展示每日学习活跃度，从后端 API 获取日历数据
- `achievement-system`: 成就系统，包含成就列表、解锁条件、进度展示

### Modified Capabilities

- `ui-dashboard-shell`: 侧边栏导航项重构为"学习数据"、"AI 对话建议"、"学习目标"三项
- `ui-study-stats`: 统计数据从 mock 数据迁移为 FastAPI 数据库聚合 API 返回
- `ui-daily-goals`: 学习目标区域作为独立路由接入侧边栏"学习目标"导航

## Impact

- 后端新增 `/api/v1/analytics/calendar`、`/api/v1/analytics/achievements`、`/api/v1/analytics/stats` 三个聚合查询端点
- 前端新增 `CalendarPage`、`AchievementsPage` 页面和路由
- `DashboardSidebar` 导航项重新排序
- 部署流程：后端部署到 Railway/Render 等 PaaS，前端 GitHub Pages 通过环境变量配置 API 地址
- 新增数据库迁移：achievements 表和 study_logs 表
