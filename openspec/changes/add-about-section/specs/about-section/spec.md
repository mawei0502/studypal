## ADDED Requirements

### Requirement: 个人简介区域展示

AboutSection SHALL 渲染在 ProjectSection 正下方，根元素携带 `id="about"` 属性。桌面端（≥768px）SHALL 采用左右两栏布局：左栏展示个人头像（或渐变占位块），右栏展示三段个人简介文字。移动端 SHALL 改为纵向堆叠（头像在上，文字在下）。所有图片 SHALL 使用 `loading="lazy"`。头像图片缺失时 SHALL 显示科技感渐变色占位块，不出现破损图标。

#### Scenario: 桌面端正常展示个人简介

- **GIVEN** 用户在宽度 ≥ 768px 的设备上访问页面
- **WHEN** 页面滚动至 AboutSection
- **THEN** 页面显示左右两栏：左栏为头像图片（或占位块），右栏为三段文字简介，内容完整可见，不溢出

#### Scenario: 移动端响应式布局

- **GIVEN** 用户在宽度 < 768px 的移动设备上访问
- **WHEN** 页面滚动至 AboutSection
- **THEN** 头像显示在上方，三段文字简介显示在下方，纵向堆叠，不出现横向滚动条

#### Scenario: 头像图片未加载（边界情况）

- **GIVEN** 头像图片文件不存在或网络加载失败
- **WHEN** 用户滚动至 AboutSection
- **THEN** 显示科技感渐变色占位块，不出现破损图片图标，不抛出 JS 错误

---

### Requirement: 品牌标签展示

AboutSection SHALL 在个人简介文字下方展示品牌标签"赋范空间"。标签 SHALL 以视觉突出的方式呈现（圆角边框 + violet 色系），支持亮/暗模式颜色变体。

#### Scenario: 品牌标签正常显示

- **GIVEN** 用户浏览 AboutSection
- **WHEN** 页面渲染完成
- **THEN** "赋范空间"标签显示在简介文字下方，视觉风格与网站整体科技感一致，在亮色和暗色模式下均清晰可见

#### Scenario: 暗色模式下品牌标签颜色适配（边界情况）

- **GIVEN** 用户切换至暗色模式
- **WHEN** AboutSection 渲染
- **THEN** 品牌标签颜色切换为暗色变体，不出现对比度不足的可读性问题
