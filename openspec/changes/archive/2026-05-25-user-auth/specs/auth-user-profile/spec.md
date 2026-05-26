## ADDED Requirements

### Requirement: Profile Read API

系统 SHALL 提供 `GET /api/v1/users/me`，返回当前已认证用户的 `UserProfile`，包含字段：`id`、`email`、`display_name`、`avatar_url`（可为 null）、`current_streak_days`（整数）、`level`（整数，初始值 1）、`created_at`（ISO 8601）。未携带有效 access token 时 SHALL 返回 HTTP 401。

#### Scenario: 已认证用户获取 Profile

- **WHEN** 客户端携带有效 access token 调用 `GET /api/v1/users/me`
- **THEN** 服务器 SHALL 返回 HTTP 200 及完整 `UserProfile` 对象

#### Scenario: 未认证请求（错误场景）

- **WHEN** 请求缺少或携带无效 Authorization header
- **THEN** 服务器 SHALL 返回 HTTP 401

### Requirement: Profile Update API

系统 SHALL 提供 `PATCH /api/v1/users/me`，接受可选字段 `avatar_url`（URL 字符串）与 `display_name`（字符串，1–50 字符）。更新成功时返回更新后的完整 `UserProfile`。

#### Scenario: 更新头像 URL

- **WHEN** 客户端发送 `{ "avatar_url": "https://example.com/avatar.png" }` 到 `PATCH /api/v1/users/me`
- **THEN** 服务器 SHALL 返回 HTTP 200
- **AND** 响应体 `avatar_url` SHALL 等于提交的新值

#### Scenario: avatar_url 格式无效（错误场景）

- **WHEN** 客户端发送不以 `http://` 或 `https://` 开头的字符串作为 `avatar_url`
- **THEN** 服务器 SHALL 返回 HTTP 422

### Requirement: Profile Page UI

前端 SHALL 在 `/profile` 路由（受保护）提供 Profile 页面，展示用户头像（`<img>` 含 fallback 占位）、显示名、连续学习天数与用户等级徽章。页面数据 SHALL 通过 `GET /api/v1/users/me` 获取。

#### Scenario: 正常渲染 Profile

- **WHEN** 已登录用户访问 `/profile`
- **THEN** 页面 SHALL 展示从 API 获取的头像、显示名、连续天数与等级
- **AND** 数据加载完成前 SHALL 显示骨架占位

#### Scenario: 头像 URL 为空时显示占位头像

- **WHEN** `avatar_url` 为 null 或空字符串
- **THEN** 页面 SHALL 显示默认头像（如用户名首字母或通用图标），MUST NOT 显示破损图片图标
