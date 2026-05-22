## Why

Hero Section 已上线，但页面缺乏全局导航入口，访客无法快速跳转到各内容区域。固定顶部导航栏是个人品牌站的标准交互模式，能显著提升页面可探索性和专业感。

## What Changes

- 新增固定顶部导航栏（`position: fixed`），始终可见，不随页面滚动消失
- 左侧展示个人 Logo 或名字作为品牌标识
- 右侧导航链接：首页（`#hero`）、项目（`#projects`）、联系我（`#contact`）
- 点击链接触发平滑滚动至对应 section
- 导航栏背景使用毛玻璃效果（`backdrop-blur`），与页面内容形成层次感
- 支持亮色/暗色模式

**Out-of-scope（严禁实现）：**
- 不做搜索功能
- 不做多级下拉菜单
- 不做用户登录和注册
- 不做移动端汉堡菜单（Hamburger Menu）

## Capabilities

### New Capabilities

- `navigation`：固定顶部导航栏，包含品牌标识、导航链接、毛玻璃背景、亮/暗模式适配

### Modified Capabilities

- `hero-section`：需为 Hero Section 根元素添加 `id="hero"`，供导航链接锚点定位使用

## Impact

- **新增文件**：`src/components/Navbar.tsx`
- **修改文件**：
  - `src/App.tsx`（引入 Navbar 组件，放置在页面最顶层）
  - `src/components/HeroSection.tsx`（为 section 添加 `id="hero"`）
- **样式**：Tailwind `backdrop-blur`、`bg-white/70`、`dark:bg-gray-900/70`，无新增 npm 依赖
- **已有功能影响**：`scroll-behavior: smooth` 已在 Phase 1 全局配置，锚点跳转直接复用；Hero Section 仅添加 id，不影响现有布局
