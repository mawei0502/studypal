## ADDED Requirements

### Requirement: User Login API

系统 SHALL 提供 `POST /api/v1/auth/login` 端点，接受 `email` 与 `password`。凭据正确时 SHALL 返回 HTTP 200 及 `access_token`、`refresh_token`。凭据错误时 SHALL 返回 HTTP 401，错误消息 MUST 不区分"用户不存在"与"密码错误"（防枚举攻击）。

#### Scenario: 成功登录

- **WHEN** 客户端发送已注册用户的正确 email + password
- **THEN** 服务器 SHALL 返回 HTTP 200
- **AND** 响应体 SHALL 包含 `access_token`（JWT，TTL 15 分钟）与 `refresh_token`（JWT，TTL 7 天）

#### Scenario: 凭据错误（错误场景）

- **WHEN** 客户端发送错误密码或不存在的 email
- **THEN** 服务器 SHALL 返回 HTTP 401
- **AND** `detail` 消息 SHALL 对两种情况返回相同文案（如 "Invalid credentials"）

### Requirement: Login Form UI

前端 SHALL 在 `/login` 路由提供登录表单，包含 email 输入框、password 输入框与登录按钮。`/login` SHALL 为公开路由；已登录用户访问 `/login` SHALL 被重定向到 `/`。

#### Scenario: 成功登录后跳转 Dashboard

- **WHEN** 用户输入正确凭据并提交
- **THEN** 前端 SHALL 将 token 写入存储
- **AND** 页面 SHALL 跳转至 `/`（Dashboard）

#### Scenario: 登录失败显示错误

- **WHEN** API 返回 401
- **THEN** 表单 SHALL 显示错误提示，MUST NOT 清空密码字段以外的输入

#### Scenario: 受保护路由跳转至登录后重定向回原路径

- **WHEN** 未登录用户访问 `/profile`，被重定向至 `/login`
- **AND** 用户成功登录
- **THEN** 页面 SHALL 跳转至原始目标路径 `/profile`，而非固定 `/`
