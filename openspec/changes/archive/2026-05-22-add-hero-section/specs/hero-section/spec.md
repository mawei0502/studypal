## ADDED Requirements

### Requirement: 全屏 Hero 区域展示个人信息

Hero Section SHALL 占据完整视口高度（`min-h-screen`），内容在水平和垂直方向居中显示。展示内容包括：姓名（主标题）、职业头衔（副标题）、一句话个人介绍（描述文本）。

#### Scenario: 正常加载时展示个人信息

- **GIVEN** 用户访问网站首页
- **WHEN** 页面完成渲染
- **THEN** 页面 Hero 区域显示姓名、职业头衔、一句话介绍，三者垂直居中排列

#### Scenario: 移动端小屏幕下的响应式布局

- **GIVEN** 用户使用宽度 < 640px 的移动设备访问
- **WHEN** Hero Section 渲染
- **THEN** 所有文字内容自适应缩小，不出现横向滚动条，内容依然居中可读

---

### Requirement: Canvas 粒子背景

Hero Section 背景 SHALL 由两层叠加组成：底层为 CSS 渐变色，上层为 Canvas 2D 绘制的动态粒子（粒子漂浮移动 + 粒子间连线）。粒子层通过 `position: absolute` 覆盖全区域，不遮挡前景文字交互。

#### Scenario: 粒子背景正常渲染

- **GIVEN** 用户访问网站首页
- **WHEN** Hero Section 挂载后
- **THEN** Canvas 元素覆盖整个 Hero 区域，可见粒子在背景中漂浮移动

#### Scenario: 窗口大小改变时 Canvas 自适应

- **GIVEN** Hero Section 已渲染且粒子动画运行中
- **WHEN** 用户调整浏览器窗口大小
- **THEN** Canvas 宽高重置为新的视口尺寸，粒子重新分布，不出现拉伸或空白区域

#### Scenario: 用户开启了 prefers-reduced-motion

- **GIVEN** 操作系统无障碍设置中启用了"减少动画"
- **WHEN** Hero Section 挂载
- **THEN** 粒子保持静止（不调用 `requestAnimationFrame` 循环），背景渐变色正常显示

#### Scenario: 组件卸载时资源清理

- **GIVEN** 粒子动画正在运行
- **WHEN** HeroSection 组件从 DOM 中卸载
- **THEN** `requestAnimationFrame` 被取消，`resize` 事件监听器被移除，无内存泄漏

---

### Requirement: 亮色/暗色模式手动切换

页面 SHALL 提供一个切换按钮，允许用户在亮色和暗色模式之间手动切换。切换状态 SHALL 持久化到 `localStorage`，刷新页面后保持用户上次的选择。页面初始化时 SHALL 优先读取 `localStorage`，其次回落到系统 `prefers-color-scheme`。

#### Scenario: 用户点击切换按钮

- **GIVEN** 当前处于亮色模式
- **WHEN** 用户点击主题切换按钮
- **THEN** 页面切换为暗色模式，`<html>` 元素添加 `dark` class，按钮图标更新为对应状态

#### Scenario: 刷新页面后恢复上次选择

- **GIVEN** 用户曾将主题切换为暗色并关闭页面
- **WHEN** 用户重新打开网站
- **THEN** 页面直接以暗色模式加载，不出现先亮后暗的闪烁（FOUC）

#### Scenario: 首次访问时回落到系统偏好

- **GIVEN** 用户首次访问，localStorage 中无主题记录
- **WHEN** 页面加载
- **THEN** 自动读取 `prefers-color-scheme`，按系统偏好初始化主题

---

### Requirement: CTA 按钮跳转到项目区域

Hero Section SHALL 包含一个 CTA（Call to Action）按钮。点击后 SHALL 平滑滚动到页面 `#projects` 锚点位置。

#### Scenario: 点击 CTA 按钮

- **GIVEN** 用户在 Hero Section 看到 CTA 按钮
- **WHEN** 用户点击该按钮
- **THEN** 页面平滑滚动到 `#projects` 区域

#### Scenario: 页面中不存在 #projects 锚点（边界情况）

- **GIVEN** 页面中尚未添加 `id="projects"` 的区域
- **WHEN** 用户点击 CTA 按钮
- **THEN** 页面滚动到底部或无明显跳动，不抛出 JS 错误，用户体验不中断
