## Why

个人品牌站目前只有 Hero Section 和项目展示区，缺少介绍创作者身份与价值观的"关于我"区域。访客看完项目后，无法进一步了解这个人是谁、有什么背景、代表什么品牌——导致品牌建立链路断裂。

## What Changes

- 新增 `AboutSection` 组件，插入在 ProjectSection 下方
- 左右两栏布局：左侧个人照片，右侧三段文字简介
- 下方展示品牌标签"赋范空间"
- Navbar 添加"关于我"导航锚点链接（指向 `#about`）
- `App.tsx` 集成新 Section

**out-of-scope（严禁开发）：**
- 联系我表单
- 社交媒体链接区域
- 邮件收集或任何表单控件

## Capabilities

### New Capabilities

- `about-section`: 个人简介区域，包含照片、三段文字简介、品牌标签展示

### Modified Capabilities

- `navigation`: Navbar 新增"关于我"导航项（指向 `#about` 锚点），需在 delta spec 中补充该导航项行为

## Impact

- 新增文件：`src/components/AboutSection.tsx`
- 修改文件：`src/App.tsx`（插入 `<AboutSection />`）、`src/components/Navbar.tsx`（新增导航项）
- 照片资源放置：`public/about/avatar.jpg`（初期用渐变占位块，字段预留）
- 无新依赖引入
