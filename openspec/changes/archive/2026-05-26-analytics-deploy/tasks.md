## 1. 数据库迁移

- [x] 1.1 创建 `backend/app/models/analytics.py`，定义 `StudyLog`、`Achievement`、`UserAchievement` ORM 模型
- [x] 1.2 在 `backend/alembic/env.py` 导入新模型；生成迁移 → `alembic upgrade head`
- [x] 1.3 验证：`sqlite3 studypal.db ".tables"` 输出包含 `study_logs`、`achievements`、`user_achievements`

## 2. 后端 Analytics API

- [x] 2.1 创建 `backend/app/schemas/analytics.py`：`CalendarEntry`、`AchievementOut`、`StatsSummary` schema
- [x] 2.2 创建 `backend/app/routers/analytics.py`：实现 `GET /api/v1/analytics/stats` — 从 `study_logs` 聚合返回统计数据
- [x] 2.3 在 `analytics.py` 实现 `GET /api/v1/analytics/calendar` — 按日期范围返回每日学习分钟数
- [x] 2.4 在 `analytics.py` 实现 `GET /api/v1/analytics/achievements` — 返回成就列表及当前用户解锁状态
- [x] 2.5 在 `analytics.py` 实现 `POST /api/v1/analytics/study-log` — 记录一次学习活动
- [x] 2.6 在 `backend/app/main.py` 注册 analytics router
- [x] 2.7 创建 `backend/seed_achievements.py`：插入初始成就数据（首次登录、连续学习 7 天、学习 1000 分钟等）
- [x] 2.8 验证：curl 测试四个端点返回正确 JSON

## 3. 前端页面与路由重构

- [x] 3.1 在 `src/App.tsx` 新增 `/goals` 和 `/achievements` 受保护路由（`React.lazy` 懒加载 `GoalsPage`、`AchievementsPage`）
- [x] 3.2 重构 `src/components/DashboardSidebar.tsx`：导航项改为"学习数据"（`/`）、"AI 对话建议"（`/chat`）、"学习目标"（`/goals`），移除"Dashboard"、"我的 Profile"、"关于作者"项
- [x] 3.3 创建 `src/pages/GoalsPage.tsx`：将现有 `DailyGoals` 组件包裹为独立页面
- [x] 3.4 创建 `src/pages/AchievementsPage.tsx`：挂载时调用 `GET /api/v1/analytics/achievements`，渲染 `AchievementGrid` 组件
- [x] 3.5 验证：进入 `/goals` 和 `/achievements` 页面正常渲染

## 4. 学习日历组件

- [x] 4.1 创建 `src/components/dashboard/StudyCalendar.tsx`：GitHub-style heatmap 组件，7 行 × ~53 列网格
- [x] 4.2 实现 API 数据加载：挂载时调用 `GET /api/v1/analytics/calendar?year=2026`，映射颜色深度
- [x] 4.3 实现 tooltip：鼠标悬停显示日期和学习分钟数
- [x] 4.4 在 `DashboardPage.tsx` 引入 `StudyCalendar` 组件
- [x] 4.5 验证：Dashboard 页面显示 heatmap 日历

## 5. 成就系统 UI

- [x] 5.1 创建 `src/components/dashboard/AchievementGrid.tsx`：4 列（桌面）/ 2 列（平板）网格布局
- [x] 5.2 创建 `src/components/dashboard/AchievementCard.tsx`：单张成就卡片，支持彩色/灰阶两种状态
- [x] 5.3 验证：AchievementsPage 展示所有成就，已解锁/未解锁状态正确

## 6. StatsCards API 迁移

- [x] 6.1 更新 `src/components/dashboard/StatsCards.tsx`：四项数据从 `GET /api/v1/analytics/stats` 获取，移除对 `mockStats` 的依赖
- [x] 6.2 添加加载骨架和 API 失败降级（"—" 占位符）
- [x] 6.3 验证：TS 编译零错误

## 7. 部署上线

- [x] 7.1 创建 `backend/railway.json`：配置 FastAPI 启动命令和构建流程
- [x] 7.2 创建 `backend/Dockerfile`：生产环境容器镜像
- [x] 7.3 创建 `.github/workflows/deploy-frontend.yml`：GitHub Actions 自动构建前端并部署到 GitHub Pages
- [x] 7.4 创建 `.github/workflows/deploy-backend.yml`：GitHub Actions 自动部署后端到 Railway
- [x] 7.5 创建 `backend/.env.production.example`：生产环境环境变量模板
- [x] 7.6 验证：前端 build 成功；后端 import 正常

## 8. 收尾

- [x] 8.1 TypeScript 编译检查：`npx tsc --noEmit` 零错误
- [x] 8.2 运行 seed 脚本初始化默认成就数据
- [x] 8.3 验证：完整流程完成
