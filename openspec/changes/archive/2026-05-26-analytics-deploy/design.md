## Context

StudyPal 当前在 Dashboard 上使用 mock 数据展示统计卡片和趋势图。学习日历和成就系统尚未实现。侧边栏导航项顺序为 Dashboard、我的 Profile、AI 助手、关于作者，需要调整为以学习数据为中心的结构。

后端已有 FastAPI + SQLite + Alembic 基础设施和用户认证系统。数据库已有 `users`、`conversations`、`messages` 表。

## Goals / Non-Goals

**Goals:**
- 学习日历 heatmap 组件，展示过去 365 天的学习活跃度
- 成就系统，自动根据学习行为解锁成就徽章
- 左侧导航栏重构：学习数据、AI 对话建议、学习目标
- 统计数据从 mock 迁移到 FastAPI 数据库聚合查询
- 后端部署到 Railway，前端部署到 GitHub Pages

**Non-Goals:**
- 实时通知（WebSocket）
- 数据导出（CSV/Excel）
- 成就分享到社交平台
- 自定义成就创建

## Decisions

### D1: 新增 study_logs 表记录每日学习行为

每日学习行为由 `study_logs` 表记录（每条记录 = 用户某天的学习摘要）。日历 heatmap 和成就系统都读取此表。AI 对话完成后自动写入学习日志。

**理由：** 统一数据源，避免日历和成就各自维护独立数据。`study_logs` 结构简单，支持按日期范围高效聚合查询。

**选择 SQLite 理由：** 单用户场景，SQLite 的日期聚合函数（`strftime`）完全够用，无需引入 PostgreSQL。

### D2: 成就系统采用声明式配置 + 数据库检查

成就定义在 Python 配置中（名称、描述、图标、解锁条件），后端通过定时/按需检查用户 `study_logs` 和 `stats` 判断是否解锁。已解锁记录写入 `user_achievements` 表。

**理由：** 声明式配置便于后续增删成就，无需改表结构。条件检查逻辑集中在后端，前端只负责渲染。

### D3: 侧边栏导航重构为学习数据、AI 对话建议、学习目标

现有侧边栏导航项重新排序：学习数据（`/` 路由）、AI 对话建议（`/chat`）、学习目标（`/goals`）。"我的 Profile"和"关于作者"降级为次要导航或移除。

**理由：** 产品定位从"通用 Dashboard"转向"学习工具"，导航应以学习任务为中心组织。

### D4: 部署采用 Railway (后端) + GitHub Pages (前端)

后端部署到 Railway 作为 FastAPI 应用，通过 `railway.json` 配置启动命令。前端通过 GitHub Actions 自动部署到 GitHub Pages，`VITE_API_BASE_URL` 环境变量指向 Railway 后端地址。

**理由：** Railway 提供免费 tier、自动 HTTPS、PostgreSQL 可选。与 GitHub Pages 分离部署，后端可独立扩缩容。

### D5: 统计数据 API 从 study_logs 聚合而非单独建表

`GET /api/v1/analytics/stats` 从 `study_logs` 聚合计算：总学习分钟数、已完成任务数、当前连续天数、最长连续天数。不需要单独建 stats 表。

**理由：** `study_logs` 是数据源，聚合查询实时反映最新状态，避免数据冗余和同步问题。

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/analytics/stats` | 聚合统计数据（总分钟、完成任务、连续天数） |
| GET | `/api/v1/analytics/calendar` | 日历 heatmap 数据（year, 返回每日学习分钟数） |
| GET | `/api/v1/analytics/achievements` | 成就列表及用户解锁状态 |
| POST | `/api/v1/analytics/study-log` | 记录一次学习活动（由 AI 对话或任务完成触发） |

## Data Model

### study_logs
```sql
CREATE TABLE study_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    date TEXT NOT NULL,           -- '2026-05-25'
    study_minutes INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)        -- 每人每天一条
);
```

### achievements
```sql
CREATE TABLE achievements (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,    -- 'first_login', 'streak_7', etc.
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    condition_type TEXT NOT NULL, -- 'streak_days', 'total_minutes', 'total_tasks'
    condition_value INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### user_achievements
```sql
CREATE TABLE user_achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    achievement_id TEXT NOT NULL REFERENCES achievements(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);
```

## Component Tree

```
AppLayout
├── DashboardSidebar (重构导航项)
│   ├── 学习数据      → /
│   ├── AI 对话建议   → /chat
│   └── 学习目标      → /goals
│
├── DashboardPage (/)
│   ├── StatsCards (API 数据)
│   ├── StudyCalendar (heatmap)
│   └── StudyTrends (周/月趋势)
│
├── ChatPage (/chat)
│   └── (已有 AI 对话)
│
├── GoalsPage (/goals)
│   └── DailyGoals (已有)
│
└── AchievementsPage (/achievements)
    └── AchievementGrid
        └── AchievementCard × N
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| SQLite 并发写入压力 | 保持 SQLite WAL 模式，单用户场景无压力 |
| 成就条件变更导致旧数据重新计算 | 成就检查按需触发，不依赖历史快照 |
| 部署后 API 地址硬编码 | 使用 `VITE_API_BASE_URL` 环境变量，dev/prod 自动切换 |
| Railway 免费 tier 休眠 | Railway 支持保留策略 + 定时健康检查保活 |
