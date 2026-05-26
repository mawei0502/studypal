## ADDED Requirements

### Requirement: User Registration API

系统 SHALL 提供 `POST /api/v1/auth/register` 端点，接受 `email`（有效格式）和 `password`（≥8 字符）。注册成功时 SHALL 将用户写入数据库（密码以 bcrypt 哈希存储），并在响应体中返回 `access_token`、`refresh_token` 与 `token_type: "bearer"`。

#### Scenario: 成功注册

- **WHEN** 客户端发送 `{ email: "user@example.com", password: "secret123" }` 到 `POST /api/v1/auth/register`
- **THEN** 服务器 SHALL 返回 HTTP 201
- **AND** 响应体 SHALL 包含 `access_token`（JWT）与 `refresh_token`（JWT）

#### Scenario: Email 已存在（错误场景）

- **WHEN** 客户端以已注册的 email 调用注册接口
- **THEN** 服务器 SHALL 返回 HTTP 400
- **AND** 响应体 SHALL 包含 `detail: "Email already registered"`

#### Scenario: 输入校验失败（错误场景）

- **WHEN** 客户端提交 `password` 长度 < 8 或 `email` 格式无效
- **THEN** 服务器 SHALL 返回 HTTP 422

### Requirement: Registration Form UI

前端 SHALL 在 `/register` 路由下提供注册表单，包含 email 输入框、password 输入框、confirm password 输入框与提交按钮。该路由 SHALL 为公开路由（无需登录）。

#### Scenario: 成功提交跳转 Dashboard

- **WHEN** 用户填写有效 email 与匹配密码后提交
- **THEN** 前端 SHALL 将服务端返回的 token 写入存储
- **AND** 页面 SHALL 跳转至 `/`（Dashboard）

#### Scenario: 两次密码不一致（客户端校验）

- **WHEN** password 与 confirm password 字段不一致时用户点击提交
- **THEN** 前端 SHALL 在不发起 API 请求的情况下展示错误提示 "两次密码不一致"

#### Scenario: 服务端错误展示

- **WHEN** API 返回 400（Email 已存在）
- **THEN** 表单 SHALL 在不清空输入框的情况下显示错误文案
