## 1. 后端环境与数据模型

- [x] 1.1 在 `backend/requirements.txt` 追加 `httpx>=0.27.0`、`sse-starlette>=2.1.0`；运行 `pip install -r requirements.txt`
- [x] 1.2 新增 `backend/.env.example`（含 `DEEPSEEK_API_KEY=your-key-here`）；确认 `backend/.env` 已被 `.gitignore` 排除；创建 `backend/.env` 写入真实 API Key
- [x] 1.3 在 `backend/app/core/config.py` 添加 `DEEPSEEK_API_KEY: str` 字段（从 `.env` 读取）
- [x] 1.4 创建 `backend/app/models/conversation.py`：`Conversation`（id UUID、user_id FK、title、created_at）和 `Message`（id UUID、conversation_id FK、role enum 'user'|'assistant'、content Text、created_at）
- [x] 1.5 在 `backend/alembic/env.py` 导入新模型；生成迁移 `alembic revision --autogenerate -m "add conversations and messages"` → `alembic upgrade head`
- [x] 1.6 **验证**：`sqlite3 studypal.db ".tables"` 输出包含 `conversations` 和 `messages`

## 2. 后端 Chat API

- [x] 2.1 创建 `backend/app/schemas/chat.py`：`ConversationOut`、`MessageOut`、`ChatStreamRequest`（content、conversation_id、context 可选）
- [x] 2.2 创建 `backend/app/routers/chat.py`：实现 `GET /api/v1/chat/conversation`（获取或创建当前用户活跃 conversation）和 `GET /api/v1/chat/conversation/messages`（按时间升序返回消息列表）
- [x] 2.3 在 `chat.py` 实现 `POST /api/v1/chat/stream`：写入用户 message → 构建含学习上下文的 system prompt → 以 `httpx.AsyncClient` 调用 DeepSeek stream API → 用 `sse_starlette.EventSourceResponse` 逐 token 转发 → 流完成后写入完整 assistant message；DeepSeek 错误时推送 `{"error": "..."}` 事件
- [x] 2.4 在 `chat.py` 实现 `DELETE /api/v1/chat/conversation`：删除当前 conversation 的所有 messages（保留 conversation 记录），返回 204
- [x] 2.5 在 `backend/app/main.py` 注册 chat router
- [x] 2.6 **验证**：启动后端，curl 测试 `GET /api/v1/chat/conversation` 返回 conversation 对象；`POST /api/v1/chat/stream` 返回 `text/event-stream`

## 3. 前端依赖与基础设施

- [x] 3.1 安装前端依赖：`npm install react-markdown`
- [x] 3.2 在 `src/App.tsx` 新增 `/chat` 受保护路由（`<ProtectedRoute><ChatPage /></ProtectedRoute>`），`React.lazy` 懒加载
- [x] 3.3 在 `src/components/DashboardSidebar.tsx` 新增"AI 助手"导航项（`to: '/chat'`，机器人图标）

## 4. 前端 ChatPage 实现

- [x] 4.1 创建 `src/pages/ChatPage.tsx`：挂载时调用 `GET /api/v1/chat/conversation` 获取 conversation_id，再调用 `GET /api/v1/chat/conversation/messages` 加载历史；空消息时显示引导文案
- [x] 4.2 实现 `MessageBubble` 子组件：user 消息右对齐 violet 气泡（纯文本），assistant 消息左对齐灰/白气泡（`<ReactMarkdown>`）；流式进行中末尾显示闪烁光标 span
- [x] 4.3 实现消息列表区域：`useRef` 指向底部哨兵 div；每次消息追加后调用 `scrollIntoView`；仅在用户未向上滚动时自动滚底（`isAtBottom` flag）
- [x] 4.4 实现 `ChatInput` 子组件：`<textarea>` Enter 发送 / Shift+Enter 换行；流式进行中 disabled；发送后清空；调用 `fetch` + `ReadableStream` 读取 SSE，逐 token 追加到当前 assistant 消息 state
- [x] 4.5 实现"新对话"按钮：调用 `DELETE /api/v1/chat/conversation`，成功后清空本地消息 state，显示引导文案
- [x] 4.6 **验证**：完整流程——登录 → 进入 /chat → 发送消息 → 看到流式 AI 回复 → 刷新页面后历史恢复

## 5. 收尾

- [x] 5.1 TypeScript 编译检查：`npx tsc --noEmit` 零错误
- [x] 5.2 **验证**：`VITE_USE_MOCK_AUTH=true` 时 ChatPage 正常渲染（不因 auth 报错）
