## ADDED Requirements

### Requirement: Conversation Management API

系统 SHALL 为每个已认证用户维护一条活跃 conversation。`GET /api/v1/chat/conversation` SHALL 返回该用户当前活跃 conversation（不存在则自动创建）。`DELETE /api/v1/chat/conversation` SHALL 删除当前活跃 conversation 的所有 messages，并将 conversation 重置为空（不删除 conversation 记录本身）。

#### Scenario: 首次获取 conversation（自动创建）

- **WHEN** 已认证用户首次调用 `GET /api/v1/chat/conversation`
- **THEN** 服务器 SHALL 返回 HTTP 200 及新建的 `Conversation` 对象（含 `id`、`user_id`、`created_at`）

#### Scenario: 获取历史消息

- **WHEN** 已认证用户调用 `GET /api/v1/chat/conversation/messages`
- **THEN** 服务器 SHALL 返回按 `created_at` 升序排列的 `Message[]`（含 `id`、`role`、`content`、`created_at`）

#### Scenario: 清空会话（错误场景：未认证）

- **WHEN** 未携带有效 token 调用 `DELETE /api/v1/chat/conversation`
- **THEN** 服务器 SHALL 返回 HTTP 401

### Requirement: Streaming Chat API

系统 SHALL 提供 `POST /api/v1/chat/stream` 端点，接受 `content`（用户消息）、`conversation_id` 与可选 `context`（用户学习数据）。端点 SHALL 以 `text/event-stream` 格式流式返回 AI 回复 token，每个事件格式为 `data: {"token": "..."}` 或流结束标志 `data: [DONE]`。请求处理前 SHALL 将用户消息写入数据库；流完成后 SHALL 将完整 assistant 消息写入数据库。

#### Scenario: 成功流式对话

- **WHEN** 已认证用户发送 `{ content: "我今天该学什么？", conversation_id: "...", context: {...} }`
- **THEN** 服务器 SHALL 以 `text/event-stream` 响应
- **AND** 依次推送多个 `data: {"token": "..."}` 事件，最终推送 `data: [DONE]`

#### Scenario: AI 回复包含学习上下文

- **WHEN** `context.streak_days = 7`、`context.completed_tasks = 10` 随请求传入
- **THEN** system prompt SHALL 包含这些数值，AI 回复内容 SHALL 体现个性化建议（如提到连续天数）

#### Scenario: DeepSeek API 调用失败（错误场景）

- **WHEN** DeepSeek API 返回非 2xx 或网络超时
- **THEN** 服务器 SHALL 推送 `data: {"error": "AI 服务暂时不可用"}` 后关闭流
- **AND** 已写入的用户消息 SHALL 仍保留在数据库

#### Scenario: 未认证请求（错误场景）

- **WHEN** 请求未携带有效 Bearer token
- **THEN** 服务器 SHALL 返回 HTTP 401，不建立 SSE 连接
