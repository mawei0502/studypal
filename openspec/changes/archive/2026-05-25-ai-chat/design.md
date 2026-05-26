## Context

项目已具备 FastAPI 后端（SQLite + Alembic）、JWT 认证、React 前端。本次引入 DeepSeek Chat API 流式调用，需要新增对话数据模型、SSE 端点，以及前端实时渲染能力。

---

## Goals / Non-Goals

**Goals:**
- SSE 流式推送 AI 回复，用户无需等待完整响应
- AI 回复携带用户学习上下文（streak、completed tasks、study minutes）
- 对话历史持久化，刷新页面后可恢复
- Markdown 内容正确渲染（代码块、列表、加粗）

**Non-Goals:**
- 语音/文件、模型切换、对话导出、多会话管理 UI

---

## Decisions

### D1：SSE over WebSocket

DeepSeek 返回 token-by-token 流；SSE（Server-Sent Events）是单向推送，配合 `sse-starlette` 实现简单，无需维护 WebSocket 连接状态。前端使用 `EventSource` API（不需要额外依赖）或 `fetch` + `ReadableStream` 读取。

### D2：对话模型设计（一用户一活跃会话）

每个用户维护一条"活跃 conversation"，页面加载时获取或创建。简化 UI，不做多会话切换（out-of-scope）。

```
users (已有)
  │
  └── conversations (1:N)
        id, user_id, created_at, title
        │
        └── messages (1:N)
              id, conversation_id, role (user|assistant), content, created_at
```

### D3：System Prompt 学习上下文注入

每次请求时，从 `users.me` 读取 `current_streak_days`、`level`，从 `mockStats`（前端传递或后端读取）注入 system prompt。MVP 阶段由前端请求体携带 `context` 字段，后端拼接 prompt。

### D4：前端流式接收方案

使用 `fetch` + `response.body.getReader()` 读取 SSE 字节流（比 EventSource 更容易在 React 中管理状态）。每收到一个 token 追加到当前 assistant 消息，触发 re-render。

### D5：Markdown 渲染

使用 `react-markdown`（轻量，支持 GFM），仅对 assistant 消息渲染，user 消息纯文本显示。

---

## Component Hierarchy

```
App (HashRouter + AuthProvider)
└── AppLayout
    └── /chat → ChatPage (protected)
        ├── ConversationHeader    # 标题 + 新建会话按钮
        ├── MessageList           # 消息列表容器，auto-scroll
        │   ├── MessageBubble (role=user)     # 右对齐，纯文本
        │   └── MessageBubble (role=assistant)# 左对齐，ReactMarkdown
        │       └── StreamingCursor           # 流式打字光标
        └── ChatInput             # 文本框 + 发送按钮，支持 Enter 发送
```

---

## API Endpoints

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|---------|
| `GET` | `/api/v1/chat/conversation` | Bearer | — | `Conversation` (当前或新建) |
| `GET` | `/api/v1/chat/conversation/messages` | Bearer | — | `Message[]` |
| `POST` | `/api/v1/chat/stream` | Bearer | `{ content, context?, conversation_id }` | `text/event-stream` (SSE token chunks) |
| `DELETE` | `/api/v1/chat/conversation` | Bearer | — | 204 (清空当前会话) |

**SSE 事件格式：**
```
data: {"token": "你好"}
data: {"token": "，我是"}
data: [DONE]
```

**ChatStreamRequest schema：**
```json
{
  "content": "string",
  "conversation_id": "uuid",
  "context": {
    "streak_days": 7,
    "level": 1,
    "completed_tasks": 47,
    "total_study_minutes": 1842
  }
}
```

---

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| DeepSeek API Key 泄露 | 存于 `backend/.env`，`.gitignore` 排除，代码中只读环境变量 |
| SSE 连接中断（网络抖动） | 前端 `finally` 块标记流结束，消息仍保存 |
| 长对话 token 超限 | 发送最近 20 条消息历史，System Prompt 固定约 200 tokens |
| react-markdown XSS | 使用默认 sanitize，不允许 `dangerouslySetInnerHTML` |

---

## Migration Plan

1. 新增 `backend/.env.example`（含 `DEEPSEEK_API_KEY=your-key-here`），更新 `.gitignore`
2. 新增 Conversation、Message 模型，生成 Alembic 迁移并 `alembic upgrade head`
3. 前端安装 `react-markdown`
4. 后端安装 `httpx`、`sse-starlette`
5. `/chat` 路由与 Sidebar 项独立添加，不影响现有功能
