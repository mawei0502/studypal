## ADDED Requirements

### Requirement: Hero Section 提供锚点 ID 供导航定位

Hero Section 的根 `<section>` 元素 SHALL 携带 `id="hero"` 属性，供导航栏链接进行锚点跳转定位。

#### Scenario: 导航栏点击"首页"跳转到 Hero Section

- **GIVEN** 用户已滚动离开 Hero Section
- **WHEN** 用户点击导航栏中的"首页"链接
- **THEN** 页面平滑滚动回 Hero Section 顶部，内容不被固定导航栏遮挡

#### Scenario: 直接访问带锚点的 URL（边界情况）

- **GIVEN** 用户通过 URL `/#hero` 直接访问页面
- **WHEN** 页面加载完成
- **THEN** 页面定位到 Hero Section，导航栏正常渲染在顶部
