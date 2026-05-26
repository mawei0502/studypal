## Context

StudyPal 当前是纯前端应用，所有数据来自 `src/data/*.ts` 硬编码常量。本次变更引入独立的 FastAPI 后端（`backend/`），实现用户身份认证与持久化 Profile 存储。前端与后端通过 REST API 通信，前端 `vite build` 产出仍为纯静态资源，两者部署解耦。

---

## Goals / Non-Goals

**Goals:**
- 提供用户注册、登录、Token 刷新的 REST API
- 用 Alembic 管理数据库 schema 演进
- 前端实现 JWT 无感刷新（access token 过期时自动用 refresh token 换取）
- Dashboard 路由受保护，未登录跳转 `/login`
- 连续学习天数从后端 Profile 读取

**Non-Goals:**
- OAuth / 第三方登录
- 邮箱验证、密码重置
- 后台管理接口
- 学习数据（goals / trends）迁移到后端
- 生产级 token 吊销（黑名单）

---

## Decisions

### D1：后端目录独立于前端（`backend/` vs monorepo）

选择在项目根目录新建 `backend/`，与 `src/`（前端）完全分离。

```
my-website/
├── src/               # React 前端（已有）
├── backend/           # FastAPI 后端（新增）
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/user.py
│   │   ├── schemas/
│   │   ├── routers/
│   │   │   ├── auth.py     # /api/v1/auth/*
│   │   │   └── users.py    # /api/v1/users/*
│   │   └── core/
│   │       ├── security.py  # JWT 工具
│   │       └── config.py    # 环境变量
│   ├── alembic/
│   │   └── versions/
│   └── requirements.txt
├── package.json
└── vite.config.ts
```

**理由**：前端 `npm run build` 不依赖 Python 环境；团队职责分离清晰；未来可独立部署。

---

### D2：JWT 双 Token 策略（access 15 分钟 + refresh 7 天）

- **access token**（15 分钟）：用于所有 API 请求，存于内存（React Context）
- **refresh token**（7 天）：仅用于换取新 access token，存于 `localStorage`

**为何不用 httpOnly Cookie**：GitHub Pages 是静态托管，没有同源后端来设置 Cookie；使用 localStorage 可在本地开发和 GitHub Pages 预览时统一工作。XSS 风险通过短 TTL（15 分钟）降低。

**为何不全放 localStorage**：access token 不落盘，tab 关闭即失效，减少长时间暴露窗口。

---

### D3：前端 Auth 状态用 React Context（不引入 Zustand/Redux）

认证状态仅包含 `{ user, accessToken, login(), logout(), refresh() }`，单一全局状态，Context 完全够用，避免引入新依赖。

---

### D4：SQLite3 作为开发数据库，Alembic 管理迁移

SQLite3 无需独立进程，零配置，适合单人项目。Alembic 抽象了 DB 类型，未来可无缝切换 PostgreSQL（仅需改 `DATABASE_URL`）。

---

### D5：VITE_USE_MOCK_AUTH 开关

新增环境变量 `VITE_USE_MOCK_AUTH=true`，前端跳过认证直接进入 Dashboard（使用 mock 数据）。用于演示、截图和前端开发。

---

## Component Hierarchy

```
App (HashRouter)
└── <AuthProvider>                  # Context: user, token, login(), logout()
    ├── /login          → LoginPage
    │   └── LoginForm               # email + password + submit
    ├── /register       → RegisterPage
    │   └── RegisterForm            # email + password + confirm
    ├── <ProtectedRoute>            # 检查 token，未登录 → /login
    │   └── AppLayout
    │       ├── DashboardSidebar
    │       │   └── UserArea [NEW]  # 底部：头像 + 用户名 + 登出
    │       └── <Outlet>
    │           ├── /           → DashboardPage（已有，StatsCards 读后端）
    │           └── /profile    → ProfilePage [NEW]
    │               └── ProfileForm  # 头像 URL、用户等级展示
    └── /about-me       → BrandPage  # 公开页，不受影响
```

---

## API Endpoints

| Method | Path | Auth | Request Body | Response |
|--------|------|------|-------------|---------|
| `POST` | `/api/v1/auth/register` | — | `{ email, password }` | `{ access_token, refresh_token, token_type }` |
| `POST` | `/api/v1/auth/login` | — | `{ email, password }` | `{ access_token, refresh_token, token_type }` |
| `POST` | `/api/v1/auth/refresh` | refresh token (Bearer) | — | `{ access_token, token_type }` |
| `GET` | `/api/v1/users/me` | access token (Bearer) | — | `UserProfile` |
| `PATCH` | `/api/v1/users/me` | access token (Bearer) | `{ avatar_url?, display_name? }` | `UserProfile` |

**UserProfile schema：**
```json
{
  "id": "uuid",
  "email": "string",
  "display_name": "string",
  "avatar_url": "string | null",
  "current_streak_days": "integer",
  "level": "integer",
  "created_at": "ISO8601"
}
```

---

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| localStorage XSS 暴露 refresh token | 高 | access token 存内存（15 分钟 TTL），减少长期暴露 |
| SQLite 并发写冲突 | 低（单用户原型） | WAL mode 开启；未来可切换 PostgreSQL |
| 本地开发需同时启动前后端 | 低 | Vite proxy 配置，前端 `/api/*` 自动转发到 `localhost:8000` |
| 连续天数计算逻辑缺失 | 中 | MVP 阶段由后端返回静态值，后续迭代实现真实计算 |

---

## Migration Plan

1. 新增 `backend/` 目录，安装 Python 依赖，运行 Alembic 初始迁移
2. 前端 `vite.config.ts` 新增 `/api` 代理（开发环境）
3. 新增 `AuthContext` + `ProtectedRoute`，App 路由更新
4. 连续天数：`StatsCards` 从 `mockStats.currentStreakDays` 改为调用 `/api/v1/users/me`
5. 验证：`VITE_USE_MOCK_AUTH=true` 时行为与现在完全一致（回滚路径）

**回滚**：设置 `VITE_USE_MOCK_AUTH=true`，前端立即恢复 mock 模式，无需代码改动。

---

## Open Questions

- `current_streak_days` MVP 阶段返回固定值（如 `12`）还是立即实现真实计算逻辑？
- 头像是否支持上传文件（需要文件存储），还是仅支持外链 URL？（当前方案：仅 URL）
- 后端是否需要 CORS 白名单配置（GitHub Pages 域名）？
