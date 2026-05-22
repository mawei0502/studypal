## ADDED Requirements

### Requirement: 项目卡片网格展示

ProjectSection SHALL 渲染在 Hero Section 正下方，根元素携带 `id="projects"` 属性。内容 SHALL 以响应式网格布局展示至少 4 个项目卡片，每张卡片 SHALL 包含：项目截图（或占位图）、项目名称、项目简介。桌面端（≥ 640px）显示 2 列，移动端显示 1 列。所有图片 SHALL 使用 `loading="lazy"`。

#### Scenario: 桌面端正常展示 4 个项目卡片

- **GIVEN** 用户在宽度 ≥ 640px 的设备上访问页面
- **WHEN** 页面滚动至 ProjectSection
- **THEN** 页面显示 2 列网格，每列各 2 张卡片，卡片内容（截图/名称/简介）完整可见

#### Scenario: 移动端响应式布局

- **GIVEN** 用户在宽度 < 640px 的移动设备上访问
- **WHEN** 页面滚动至 ProjectSection
- **THEN** 卡片改为单列垂直排列，内容不溢出，不出现横向滚动条

#### Scenario: 截图图片未加载完成时（边界情况）

- **GIVEN** 网络较慢，截图图片尚未加载
- **WHEN** 用户滚动至项目卡片
- **THEN** 卡片显示科技感渐变色占位块，不出现破损图片图标，不抛出 JS 错误

---

### Requirement: 鼠标悬浮微特效

项目卡片 SHALL 在鼠标悬浮时呈现微特效：卡片向上位移并阴影加深，效果通过 CSS transition 平滑过渡，不依赖 JavaScript。

#### Scenario: 悬浮时触发微特效

- **GIVEN** 用户在桌面端浏览项目卡片
- **WHEN** 鼠标移入卡片区域
- **THEN** 卡片平滑上移约 8px，阴影加深，过渡时长约 300ms

#### Scenario: 鼠标移出时复原

- **GIVEN** 卡片处于悬浮激活状态
- **WHEN** 鼠标移出卡片区域
- **THEN** 卡片平滑恢复原始位置和阴影，无卡顿

#### Scenario: 移动端触屏设备无悬浮态（边界情况）

- **GIVEN** 用户使用触屏设备
- **WHEN** 用户点击或滑动经过卡片
- **THEN** 不触发永久悬浮状态，卡片外观正常，不影响点击交互

---

### Requirement: GitHub 链接外部跳转

每个项目卡片 SHALL 包含一个 GitHub 链接。点击后 SHALL 在新标签页打开目标 URL，不影响当前页面浏览。链接 SHALL 包含 `rel="noopener noreferrer"` 属性。

#### Scenario: 点击 GitHub 链接

- **GIVEN** 用户浏览项目卡片
- **WHEN** 用户点击卡片上的 GitHub 链接按钮
- **THEN** 在新标签页打开对应 GitHub 仓库，当前页面保持不变

#### Scenario: GitHub URL 为空或占位值（边界情况）

- **GIVEN** 某个项目的 `githubUrl` 字段为空字符串
- **WHEN** 用户点击该项目的 GitHub 按钮
- **THEN** 链接不跳转或跳转至当前页，不抛出错误，页面正常渲染
