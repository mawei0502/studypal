## ADDED Requirements

### Requirement: Chat Page Layout

前端 SHALL 在 `/chat` 路由（受保护）提供 ChatPage，包含：顶部标题栏（含"新对话"按钮）、可滚动消息列表区域、底部输入框。页面 SHALL 在加载时调用 `GET /api/v1/chat/conversation/messages` 恢复历史消息，消息列表为空时 SHALL 显示引导提示文案（如"向 AI 助手提问，获取个性化学习建议"）。

#### Scenario: 加载历史消息

- **WHEN** 已登录用户进入 `/chat`
- **THEN** 页面 SHALL 请求历史消息并渲染，消息列表 SHALL 自动滚动至最新一条

#### Scenario: 空会话显示引导文案

- **WHEN** 当前 conversation 无历史消息
- **THEN** 页面 SHALL 显示引导提示文案，MUST NOT 显示空白区域或报错

#### Scenario: 新对话按钮清空会话

- **WHEN** 用户点击"新对话"按钮
- **THEN** 前端 SHALL 调用 `DELETE /api/v1/chat/conversation`
- **AND** 消息列表 SHALL 清空，显示引导文案

### Requirement: Message Bubbles

用户消息 SHALL 右对齐，使用 violet 背景色气泡；AI 助手消息 SHALL 左对齐，使用白色/gray-900 背景气泡。AI 消息内容 SHALL 以 Markdown 格式渲染（支持加粗、列表、代码块），用户消息 SHALL 以纯文本渲染。流式 AI 回复进行中 SHALL 显示打字光标动效。

#### Scenario: 用户消息气泡样式

- **WHEN** 用户发送一条消息
- **THEN** 该消息 SHALL 以右对齐气泡形式立即显示在列表末尾

#### Scenario: AI 消息 Markdown 渲染

- **WHEN** AI 回复包含 Markdown（如 `**加粗**`、代码块）
- **THEN** 消息气泡 SHALL 渲染为格式化 HTML，而非原始 Markdown 文本

#### Scenario: 流式打字光标

- **WHEN** AI 回复流式传输中
- **THEN** 当前 assistant 消息气泡末尾 SHALL 显示闪烁光标，流结束后 SHALL 光标消失

### Requirement: Message Input

底部输入框 SHALL 支持多行文本（`<textarea>`），Enter 键发送消息（Shift+Enter 换行）。发送中 SHALL 禁用输入框与发送按钮（防止重复提交）。消息发送后 SHALL 清空输入框，并触发消息列表自动滚动至底部。

#### Scenario: Enter 发送消息

- **WHEN** 用户在输入框输入文本后按 Enter（非 Shift+Enter）
- **THEN** 前端 SHALL 立即显示用户消息气泡并发起流式请求，输入框 SHALL 清空

#### Scenario: 流式接收期间禁用输入（错误防护）

- **WHEN** AI 回复流式传输进行中
- **THEN** 发送按钮与输入框 SHALL 处于 disabled 状态，不接受新输入

#### Scenario: 自动滚动至最新消息

- **WHEN** 新消息追加（用户发送或 AI 逐 token 追加）
- **THEN** 消息列表 SHALL 自动滚动至底部，MUST NOT 在用户手动向上滚动时强制回底
