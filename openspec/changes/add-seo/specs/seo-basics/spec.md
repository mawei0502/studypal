## ADDED Requirements

### Requirement: HTML head meta 标签

`index.html` SHALL 包含以下 meta 信息：`<title>` 反映作者姓名与身份；`<meta name="description">` 内容不超过 160 字符，描述网站核心价值；`<html>` 的 `lang` 属性 SHALL 设置为 `zh-CN`。Open Graph 标签 SHALL 包含 `og:title`、`og:description`、`og:url`（绝对 URL）、`og:type`（值为 `website`）。Twitter Card 标签 SHALL 包含 `twitter:card`（值为 `summary`）、`twitter:title`、`twitter:description`。

#### Scenario: 搜索引擎爬取页面获取正确标题和描述

- **GIVEN** Google 等爬虫访问网站首页
- **WHEN** 爬虫解析 HTML head
- **THEN** 获取到非占位符的 `<title>` 和 `<meta name="description">`，内容准确反映网站主题和作者身份

#### Scenario: 社交平台分享链接展示预览卡片

- **GIVEN** 用户将网站 URL 分享到微信/微博/Twitter 等平台
- **WHEN** 平台抓取页面 meta 信息
- **THEN** 预览卡片显示正确的标题和描述，而非空白或占位文字

#### Scenario: 缺少 og:image 时社交卡片降级展示（边界情况）

- **GIVEN** `og:image` 未配置（out-of-scope）
- **WHEN** 社交平台生成预览卡片
- **THEN** 仅展示文字卡片（`summary` 类型），不出现破损图片图标，不报错

---

### Requirement: robots.txt 与爬虫策略

`public/robots.txt` SHALL 存在且声明允许所有主流爬虫（`User-agent: *`）访问全站（`Allow: /`），并通过 `Sitemap:` 指令声明 sitemap.xml 的完整 URL。

#### Scenario: Googlebot 请求 robots.txt

- **GIVEN** Googlebot 首次抓取网站
- **WHEN** 爬虫请求 `/robots.txt`
- **THEN** 返回合法的 robots.txt 内容，包含 `User-agent: *`、`Allow: /` 和 `Sitemap:` 声明

#### Scenario: robots.txt 文件不存在（边界情况）

- **GIVEN** 构建产物 `dist/` 目录中不包含 `robots.txt`
- **WHEN** 爬虫请求该文件
- **THEN** 返回 404；本规范要求此情况不得发生，构建验证应确认文件存在

---

### Requirement: 静态 Sitemap

`public/sitemap.xml` SHALL 存在，包含网站首页的完整绝对 URL，`<lastmod>` 使用构建时的日期，`<changefreq>` 声明为 `monthly`。

#### Scenario: 搜索引擎读取 Sitemap 发现页面

- **GIVEN** 搜索引擎爬虫通过 robots.txt 中声明的地址请求 sitemap.xml
- **WHEN** 爬虫解析 XML
- **THEN** 获取到至少一条有效的 URL 条目，指向网站首页的绝对地址

---

### Requirement: 语义化 HTML 结构

页面根结构 SHALL 包含 `<header>`（由 Navbar 提供）、`<main>`（包裹所有 Section 内容）语义标签。各 Section 组件 SHALL 使用 `<section>` 元素作为根元素，并携带 `id` 属性以支持锚点导航。项目卡片 SHALL 使用 `<article>` 元素。

#### Scenario: 屏幕阅读器解析页面结构

- **GIVEN** 视力障碍用户使用屏幕阅读器访问网站
- **WHEN** 阅读器解析 DOM 结构
- **THEN** 能够识别 `<header>`、`<main>` 等语义区域，提供有意义的导航提示

#### Scenario: 爬虫通过语义标签理解内容层级（边界情况）

- **GIVEN** 搜索引擎爬虫解析页面
- **WHEN** 爬虫扫描 HTML 结构
- **THEN** `<main>` 内的内容被识别为页面主体，`<article>` 内的项目卡片内容被视为独立内容单元
