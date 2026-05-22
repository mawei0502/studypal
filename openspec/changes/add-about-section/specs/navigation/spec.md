## MODIFIED Requirements

### Requirement: 导航链接平滑滚动

导航栏右侧 SHALL 包含四个链接：首页（`#hero`）、关于我（`#about`）、项目（`#projects`）、联系我（`#contact`）。点击任意链接 SHALL 触发平滑滚动至对应 section，且目标 section 内容不被固定导航栏遮挡。导航项顺序 SHALL 与页面从上到下的 section 顺序一致。

#### Scenario: 点击"关于我"导航链接跳转到 AboutSection

- **GIVEN** 用户在任意位置浏览页面
- **WHEN** 用户点击导航栏中的"关于我"链接
- **THEN** 页面平滑滚动至 `id="about"` 的 section，内容顶部不被导航栏遮挡

#### Scenario: 点击导航链接跳转到对应 section

- **GIVEN** 用户在任意位置浏览页面
- **WHEN** 用户点击导航栏中的"项目"链接
- **THEN** 页面平滑滚动至 `id="projects"` 的 section，内容顶部不被导航栏遮挡

#### Scenario: 目标 section 尚不存在（边界情况）

- **GIVEN** 页面中尚未添加 `id="contact"` 的 section
- **WHEN** 用户点击"联系我"链接
- **THEN** 页面滚动到底部或无明显跳动，不抛出 JS 错误，导航栏保持正常显示
