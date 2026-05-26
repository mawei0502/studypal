## 1. 后端项目初始化

- [x] 1.1 创建 `backend/` 目录结构：`app/models/`、`app/schemas/`、`app/routers/`、`app/core/`；新增 `requirements.txt`
- [x] 1.2 在 `requirements.txt` 中声明依赖：`fastapi`、`uvicorn[standard]`、`sqlalchemy`、`alembic`、`python-jose[cryptography]`、`bcrypt`、`python-multipart`；运行 `pip install -r requirements.txt`
- [x] 1.3 创建 `backend/app/database.py`：SQLAlchemy engine（SQLite WAL mode）、SessionLocal、Base
- [x] 1.4 创建 `backend/app/models/user.py`：User 表（id UUID、email unique、hashed_password、display_name、avatar_url nullable、current_streak_days default 0、level default 1、created_at）
- [x] 1.5 初始化 Alembic：`alembic init alembic`，配置 `alembic.ini` 指向 `studypal.db`；生成并执行首次迁移 `alembic revision --autogenerate -m "create users table"` → `alembic upgrade head`
- [x] 1.6 **验证**：确认 `studypal.db` 文件生成，`users` 表结构正确（`sqlite3 studypal.db ".schema users"`）

## 2. 后端认证 API

- [x] 2.1 创建 `backend/app/core/config.py`（Settings via pydantic-settings：`SECRET_KEY`、`ALGORITHM=HS256`、`ACCESS_TOKEN_EXPIRE_MINUTES=15`、`REFRESH_TOKEN_EXPIRE_DAYS=7`）和 `backend/app/core/security.py`（bcrypt hash/verify、JWT create/decode）
- [x] 2.2 创建 `backend/app/schemas/auth.py`：`RegisterRequest`、`LoginRequest`、`TokenResponse`（access_token、refresh_token、token_type）
- [x] 2.3 实现 `backend/app/routers/auth.py`：`POST /api/v1/auth/register`（邮箱重复返回 400，密码 bcrypt 存储，成功返回 201 + tokens）
- [x] 2.4 在 `auth.py` 中实现 `POST /api/v1/auth/login`（凭据错误统一返回 401 "Invalid credentials"）和 `POST /api/v1/auth/refresh`（验证 refresh token，返回新 access token）
- [x] 2.5 创建 `backend/app/main.py`：注册 auth router、添加 CORSMiddleware（开发环境允许 `http://localhost:5175`）
- [x] 2.6 **验证**：backend smoke test PASSED（security utils）；后端启动后可通过 curl 测试三个接口

## 3. 后端用户 Profile API

- [x] 3.1 创建 `backend/app/schemas/user.py`：`UserProfile`（id、email、display_name、avatar_url、current_streak_days、level、created_at）和 `UserUpdateRequest`（avatar_url optional、display_name optional）
- [x] 3.2 实现 `backend/app/routers/users.py`：`GET /api/v1/users/me`（Bearer token 校验，返回 UserProfile）和 `PATCH /api/v1/users/me`（校验 avatar_url 为 http/https URL，返回更新后 UserProfile）；注册到 main.py
- [x] 3.3 **验证**：注册用户后调用 GET /api/v1/users/me 返回含 `current_streak_days: 0`、`level: 1` 的 Profile

## 4. 前端认证基础设施

- [x] 4.1 在 `vite.config.ts` 添加 dev server proxy：`/api` → `http://localhost:8000`（仅开发环境）
- [x] 4.2 创建 `src/services/apiClient.ts`：封装 fetch，自动附加 Authorization header；收到 401 时自动调用 refresh，重试原请求；refresh 也失败则清除 token 并跳转 `/login`
- [x] 4.3 创建 `src/contexts/AuthContext.tsx`：提供 `user`、`accessToken`（内存）、`login()`、`logout()`、`refresh()`；refresh token 持久化至 `localStorage`
- [x] 4.4 创建 `src/components/ProtectedRoute.tsx`：无 token 时重定向 `/login`（携带 `state.from` 保存原路径）
- [x] 4.5 更新 `src/App.tsx`：用 `<AuthProvider>` 包裹全部路由；新增 `/login`、`/register` 公开路由；`/` 和 `/profile` 路由包裹 `<ProtectedRoute>`
- [x] 4.6 **验证**：TypeScript 编译零错误；未登录访问 `/#/` 跳转 `/#/login`；`VITE_USE_MOCK_AUTH=true` 跳过守卫

## 5. 前端登录 / 注册页面

- [x] 5.1 创建 `src/pages/LoginPage.tsx`：email + password 表单，调用 `POST /api/v1/auth/login`，成功后写入 AuthContext 并跳转 `state.from` 或 `/`；失败显示错误文案
- [x] 5.2 创建 `src/pages/RegisterPage.tsx`：email + password + confirm 表单，客户端校验密码一致性后调用注册接口，成功后自动登录跳转 `/`
- [x] 5.3 **验证**：LoginPage 已登录时重定向 `/`；RegisterPage 密码不一致时不发起 API 请求

## 6. Sidebar 用户区域

- [x] 6.1 在 `src/components/DashboardSidebar.tsx` 底部新增 `UserArea` 子组件：从 AuthContext 读取 user，展示圆形头像（无头像时显示邮箱首字母）与 display_name（≥lg 宽度可见）；包含退出按钮
- [x] 6.2 **验证**：UserArea 在 mockAuth 模式下渲染 fallback 首字母；退出调用 logout() + navigate('/login')

## 7. 前端 Profile 页面

- [x] 7.1 创建 `src/pages/ProfilePage.tsx`：调用 `GET /api/v1/users/me`，展示头像、display_name、current_streak_days、level 徽章；加载中显示骨架；avatar_url 为空时显示首字母占位
- [x] 7.2 **验证**：AvatarPlaceholder 在 avatar_url 为 null 时渲染首字母；img 含 onError 降级

## 8. Dashboard 统计卡片接入后端

- [x] 8.1 更新 `src/components/dashboard/StatsCards.tsx`：仅 `current_streak_days` 改为从 `GET /api/v1/users/me` 获取，其余 3 项继续使用 `mockStats`；加载中该卡片显示骨架，失败显示 "—"
- [x] 8.2 **验证**：apiStreak=null → 骨架；apiStreak=undefined（错误）→ "—"；其余 3 张卡片不受 API 状态影响
