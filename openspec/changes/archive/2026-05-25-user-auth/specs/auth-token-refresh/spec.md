## ADDED Requirements

### Requirement: Token Refresh API

系统 SHALL 提供 `POST /api/v1/auth/refresh` 端点，接受 Authorization header 中的有效 refresh token。验证通过时 SHALL 返回新的 `access_token`（TTL 15 分钟）。refresh token 本身不更新（sliding window 不在本次 scope 内）。

#### Scenario: 成功刷新

- **WHEN** 客户端携带有效 refresh token 调用 `POST /api/v1/auth/refresh`
- **THEN** 服务器 SHALL 返回 HTTP 200
- **AND** 响应体 SHALL 包含新的 `access_token`，TTL 重置为 15 分钟

#### Scenario: refresh token 已过期（错误场景）

- **WHEN** 客户端携带过期的 refresh token
- **THEN** 服务器 SHALL 返回 HTTP 401
- **AND** `detail` SHALL 为 "Refresh token expired"

### Requirement: Silent Token Refresh

前端 SHALL 实现无感刷新：当任意受保护 API 调用返回 HTTP 401 时，自动使用 refresh token 获取新 access token 并重试原请求。整个过程 MUST 对调用方透明（组件不感知刷新逻辑）。

#### Scenario: access token 过期后自动刷新并重试

- **WHEN** 前端发起受保护 API 请求，服务器因 access token 过期返回 401
- **THEN** 前端 SHALL 自动调用 `/api/v1/auth/refresh`
- **AND** 获取新 access token 后 SHALL 重试原请求
- **AND** 最终响应 SHALL 正常返回给调用组件

#### Scenario: refresh token 也已过期，跳转登录（错误场景）

- **WHEN** 自动刷新时 `/api/v1/auth/refresh` 返回 401
- **THEN** 前端 SHALL 清除所有本地存储的 token
- **AND** SHALL 将用户重定向至 `/login`
