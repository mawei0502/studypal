## Phase 1. HTML head meta 标签

- [x] 1.1 修改 `index.html`：将 `<html lang="en">` 改为 `<html lang="zh-CN">`
- [x] 1.2 修改 `index.html`：将 `<title>my-website</title>` 改为准确的作者与身份标题
- [x] 1.3 修改 `index.html`：在 `<head>` 中添加 `<meta name="description">` 标签（≤160字符）
- [x] 1.4 修改 `index.html`：添加 Open Graph 标签（`og:title`、`og:description`、`og:url`、`og:type`）
- [x] 1.5 修改 `index.html`：添加 Twitter Card 标签（`twitter:card`、`twitter:title`、`twitter:description`）

> **Phase 1 完成后请 review 并确认，再继续 Phase 2**

---

## Phase 2. robots.txt 与 sitemap.xml

- [x] 2.1 新增 `public/robots.txt`：声明 `User-agent: *`、`Allow: /`、`Sitemap:` 指向完整 URL
- [x] 2.2 新增 `public/sitemap.xml`：包含网站首页绝对 URL、`<lastmod>`、`<changefreq>monthly</changefreq>`

> **Phase 2 完成后请 review 并确认，再继续 Phase 3**

---

## Phase 3. 语义化 HTML 审查与修复

- [x] 3.1 审查 `src/App.tsx`：确认 Section 内容区有 `<main>` 语义标签包裹，若无则添加
- [x] 3.2 审查各 Section 组件（HeroSection、ProjectSection）：确认根元素为 `<section>`（含 `id` 属性）
- [x] 3.3 运行 `npm run build`，确认构建无 TypeScript 错误，`dist/` 中存在 `robots.txt` 和 `sitemap.xml`

> **Phase 3 完成后请 review 并确认，变更实现完毕**
