## Purpose

AI 学习建议面板，展示从 mock 数据中抽取的 3 条个性化学习推荐卡片，支持刷新随机抽取，不发起真实 AI 调用。

## Requirements

### Requirement: Suggestion List Rendering

`<AiSuggestions>` 组件 SHALL 从 `src/data/mockSuggestions.ts` 导入 `mockSuggestions`（`AiSuggestion[]`）数组，并以卡片网格形式渲染前 3 条推荐内容。每张卡片 MUST 显示：标题、推荐理由（reason）、预估时长、标签数组（tags）。

#### Scenario: 渲染 3 张推荐卡片
- **WHEN** 用户进入 Dashboard 且 mock 包含至少 3 条建议
- **THEN** `<AiSuggestions>` SHALL 渲染 3 张推荐卡片
- **AND** 卡片排布桌面端 SHALL 为 3 列，平板端 SHALL 为 2 列，手机端 SHALL 为单列

#### Scenario: 标签显示
- **WHEN** 某条建议包含 `tags: ['Python', '基础']`
- **THEN** 对应卡片底部 SHALL 显示两个 tag 徽章（带边框或填充背景的小色块）

### Requirement: Refresh Suggestions Action

`<AiSuggestions>` SHALL 在面板顶部提供"刷新建议"按钮。点击后 SHALL 从 `mockSuggestions` 数组中**随机抽取** 3 条不同建议替换当前显示。本次实现 MUST NOT 发起任何网络请求或真实 AI 调用。

#### Scenario: 刷新按钮替换内容
- **WHEN** 用户点击 "刷新建议" 按钮
- **AND** mock 数组中有超过 3 条建议
- **THEN** 显示的 3 张卡片 SHALL 被重新抽取的 3 条替换
- **AND** 抽取过程 MUST NOT 触发网络请求

#### Scenario: mock 数据不足时刷新
- **WHEN** mock 数组中只有 3 条建议
- **AND** 用户点击 "刷新建议"
- **THEN** 显示内容 SHALL 仍为同样的 3 条
- **AND** 按钮 SHALL 仍可点击，MUST NOT 抛出错误

### Requirement: Empty State and Error Handling

当 mock 数据为空数组时，`<AiSuggestions>` SHALL 显示占位提示文案（如 "暂无建议，稍后再试"）。当数据存在异常时，组件 MUST NOT 让整个 Dashboard 崩溃。

#### Scenario: 空建议数据
- **WHEN** 传入 `<AiSuggestions suggestions={[]}>`
- **THEN** 组件 SHALL 渲染空态提示
- **AND** DOM SHALL 不包含任何 `<SuggestionCard>`

#### Scenario: 数据异常（错误场景）
- **WHEN** 传入的 `suggestions` 含有缺失必需字段（如某条缺 `title`）的对象
- **THEN** 该异常条目 SHALL 被跳过不渲染
- **AND** 其余正常条目 SHALL 继续渲染
- **AND** 控制台 SHOULD 输出一条 warning 提示有异常数据
