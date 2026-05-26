## Why

StudyPal 目前缺乏互动性：学习数据被动展示，用户无法获得个性化建议。引入 AI 学习助手对话功能，让用户可以基于真实学习上下文（连续天数、目标完成率、学习趋势）与 AI 进行对话，将平台从"数据展示"升级为"主动辅导"。

## What Changes

- 新增后端 `POST /api/v1/chat/stream` 端点，支持 SSE 流式响应，调用 DeepSeek Chat API
- 新增后端对话历史存储（`conversations` + `messages` 表），通过 Alembic 迁移
- AI System Prompt 自动注入当前用户的学习数据（streak days、completed tasks、study minutes）
- 前端新增 `/chat` 路由（受保护），气泡式 ChatPage，支持实时流式渲染、Markdown 解析、自动滚动
- Sidebar 新增"AI 助手"菜单项

## Capabilities

### New Capabilities

- `ai-chat-api`: 后端对话 API——流式端点、对话 CRUD、用户学习上下文注入
- `ai-chat-ui`: 前端 Chat 页面——消息气泡、流式渲染、Markdown 显示、自动滚动

### Modified Capabilities

- `ui-dashboard-shell`: Sidebar 新增"AI 助手"导航项（`/chat` 路由）

## Impact

**新增依赖**：
- 后端：`httpx`（异步 HTTP，调用 DeepSeek）、`sse-starlette`（SSE 流式响应）
- 前端：`react-markdown`（Markdown 渲染）

**受影响文件**：
- `backend/app/main.py`：注册 chat router
- `backend/app/models/`：新增 Conversation、Message 模型
- `src/components/DashboardSidebar.tsx`：新增 AI 助手菜单项
- `src/App.tsx`：新增 `/chat` 受保护路由

**不做（Out of Scope）**：
- 语音输入
- 文件上传
- 模型切换
- 对话搜索 / 导出
- 多 Conversation 管理 UI（仅保留当前会话，历史从后端加载）

**安全注意**：
- DeepSeek API Key 通过 `backend/.env` 中的 `DEEPSEEK_API_KEY` 环境变量注入，**不提交至代码库**

**回滚方案**：
- chat router 可从 `main.py` 中移除，前端 `/chat` 路由及 Sidebar 项独立，回滚不影响现有 Dashboard 与认证功能
