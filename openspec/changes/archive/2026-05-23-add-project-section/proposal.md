## Why

导航栏和 Hero Section 已就位，但 `#projects` 区域仍是占位符，访客点击 CTA 按钮后看不到任何实质内容。项目展示区是个人品牌站的核心价值载体，需要尽快填充真实内容，让访客了解作者的技术能力与成果。

## What Changes

- 新增 `ProjectSection` 组件（`id="projects"`），替换 `App.tsx` 中的占位 section
- 新增 `ProjectCard` 组件，卡片内容包括：项目截图、项目名称、项目简介、GitHub 链接
- 卡片布局采用响应式网格（桌面 2 列，移动 1 列），最少展示 4 个项目
- 鼠标悬浮时触发微特效（上移 + 阴影加深），纯 CSS Tailwind 实现
- 所有项目截图使用 `loading="lazy"`，符合性能约束
- Hero Section CTA 按钮 `href="#projects"` 已正确指向此 section，无需修改代码

**Out-of-scope（严禁实现）：**
- 不做项目详情页
- 不做项目搜索功能
- 不做分页或"加载更多"
- 不做后端 API 或 CMS 集成

## Capabilities

### New Capabilities

- `project-section`：项目展示区，卡片式网格布局，含悬浮微特效和 GitHub 链接

### Modified Capabilities

无。Hero Section 的 CTA 按钮规格不变（`#projects` 锚点已在上一版本正确实现）；本变更仅将 `#projects` 占位内容替换为真实组件，属于实现层变化，不涉及规格行为变更。

## Impact

- **新增文件**：
  - `src/components/ProjectSection.tsx`
  - `src/components/ProjectCard.tsx`
  - `src/data/projects.ts`（项目数据）
- **修改文件**：`src/App.tsx`（用 `<ProjectSection />` 替换占位 section）
- **资源**：项目截图放置于 `public/projects/` 目录，通过相对路径引用
- **依赖变化**：无新增 npm 依赖
- **已有功能影响**：`#projects` 锚点已存在，导航栏"项目"链接和 Hero CTA 按钮均自动生效，无需改动
