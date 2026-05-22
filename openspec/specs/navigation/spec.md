### Requirement: 固定顶部导航栏

Navbar SHALL 固定在视口顶部（`position: fixed`），始终可见，不随页面内容滚动消失。背景 SHALL 使用毛玻璃效果（`backdrop-blur` + 半透明色），支持亮色/暗色模式。

#### Scenario: 页面加载后导航栏可见

- **GIVEN** 用户访问网站首页
- **WHEN** 页面完成渲染
- **THEN** 导航栏固定显示在页面顶部，左侧展示品牌标识，右侧展示导航链接

#### Scenario: 页面向下滚动时导航栏保持固定

- **GIVEN** 页面内容超出视口高度
- **WHEN** 用户向下滚动页面
- **THEN** 导航栏始终固定在视口顶部，不随内容滚动消失

#### Scenario: 毛玻璃效果在两种主题下均正常显示

- **GIVEN** 用户处于亮色或暗色模式
- **WHEN** 导航栏渲染
- **THEN** 亮色模式下显示白色半透明背景，暗色模式下显示深色半透明背景，两者均有背景模糊效果

#### Scenario: 旧版浏览器不支持 backdrop-blur（边界情况）

- **GIVEN** 用户使用不支持 `backdrop-filter` 的旧版浏览器
- **WHEN** 导航栏渲染
- **THEN** 降级为纯半透明背景色，导航栏仍可正常使用，不出现视觉错误

---

### Requirement: 导航链接平滑滚动

导航栏右侧 SHALL 包含三个链接：首页（`#hero`）、项目（`#projects`）、联系我（`#contact`）。点击任意链接 SHALL 触发平滑滚动至对应 section，且目标 section 内容不被固定导航栏遮挡。

#### Scenario: 点击导航链接跳转到对应 section

- **GIVEN** 用户在任意位置浏览页面
- **WHEN** 用户点击导航栏中的"项目"链接
- **THEN** 页面平滑滚动至 `id="projects"` 的 section，内容顶部不被导航栏遮挡

#### Scenario: 目标 section 尚不存在（边界情况）

- **GIVEN** 页面中尚未添加 `id="contact"` 的 section
- **WHEN** 用户点击"联系我"链接
- **THEN** 页面滚动到底部或无明显跳动，不抛出 JS 错误，导航栏保持正常显示
