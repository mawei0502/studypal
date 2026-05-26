## Why

StudyPal 目前所有用户数据（学习统计、目标、连续天数）均为硬编码 mock，无法跨设备持久化，也无法支持个性化体验。引入用户认证与 Profile 系统，是将 StudyPal 从演示品提升为真正可用的学习工具的第一步。

## What Changes

- 新增 FastAPI 后端服务（`backend/`），提供用户注册、登录、Token 刷新、Profile CRUD 接口
- 新增 SQLite3 数据库 + Alembic 迁移管理
- 前端新增 Login / Register 页面（公开路由）
- 前端新增 Profile 页面（受保护路由）
- 前端新增 JWT token 管理层（access token + refresh token，存储于 localStorage）
- Dashboard 路由受保护：未登录访问 `/` 重定向至 `/login`
- 统计卡片中的"连续学习天数"从 mock 常量改为读取后端真实数据

## Capabilities

### New Capabilities

- `auth-register`: 用户注册（email + password），返回 access token + refresh token
- `auth-login`: 用户登录（email + password），返回 access token + refresh token
- `auth-token-refresh`: 使用 refresh token 换取新 access token（无感刷新）
- `auth-user-profile`: 用户 Profile 的查看与更新（头像 URL、连续学习天数、用户等级）

### Modified Capabilities

- `ui-dashboard-shell`: 添加路由守卫（未登录跳转 `/login`）；Sidebar 底部增加用户头像 + 登出按钮
- `ui-study-stats`: 连续学习天数（`currentStreakDays`）从 mock 改为调用后端 `/api/v1/profile` 返回

## Impact

**新增依赖**：
- 后端：`fastapi`, `uvicorn`, `sqlalchemy`, `alembic`, `python-jose[cryptography]`, `passlib[bcrypt]`, `python-multipart`
- 前端：无新依赖（使用原生 `fetch` + 现有 react-router）

**受影响文件**：
- `src/App.tsx`：新增 `/login`、`/register`、`/profile` 路由；`/` 路由加 `<ProtectedRoute>`
- `src/data/mockStats.ts`：`currentStreakDays` 迁移为 API 调用（其余字段暂保留 mock）
- `src/components/DashboardSidebar.tsx`：底部增加用户区域

**不做（Out of Scope）**：
- 后台管理（用户列表、数据统计后台）
- 第三方 OAuth（GitHub / Google 登录）
- 邮箱验证 / 密码重置流程
- 多设备 token 管理 / token 吊销
- 前端完整测试套件
- 学习数据（goals、suggestions、trends）迁移到后端

**回滚方案**：
- 后端为独立服务（`backend/`），前端 `vite build` 不依赖后端，若后端出现问题可随时将前端还原为 mock 数据模式
- Feature flag：`VITE_USE_MOCK_AUTH=true` 时前端跳过认证，直接加载 Dashboard（开发/演示用）
