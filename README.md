# 工程水印相机 · 官方网站与说明书

[engCamera](https://github.com/zy8270/engCamera)（工程水印相机）的官网与使用说明书，基于 [VitePress](https://vitepress.dev) 构建，托管于 GitHub Pages。

- 线上地址：<https://zy8270.github.io>
- 应用仓库：<https://github.com/zy8270/engCamera>

## 本地开发

```bash
npm install
npm run dev      # 抓取最新 Release 后启动 dev server（http://localhost:5173）
npm run build    # 抓取最新 Release 后构建，输出 docs/.vitepress/dist
npm run preview  # 预览构建产物
npm run release  # 只抓取 Release 数据，不构建
```

## 目录结构

```
scripts/
└── fetch-release.mjs    构建前抓取 engCamera 最新 Release
docs/
├── .vitepress/          配置与主题（config.mts / theme/）
│   └── release.generated.json   构建期 Release 快照（自动生成）
├── public/              静态资源（icon、shots 截图、latest-release.json）
├── index.md             首页（layout: home）
├── intro.md             介绍
├── download.md          下载
├── faq.md               常见问题
├── tutorial/            教程
└── wiki/                使用说明书（26 篇）
```

## 版本号与下载链接是自动的

**发版后不需要改任何文档。** 链路是三级兜底：

1. **构建期快照** —— `scripts/fetch-release.mjs` 在 `npm run build` 前抓取 engCamera 最新 Release，写入
   `docs/.vitepress/release.generated.json`。下载页用 `<ReleaseTable />` 与 `<DownloadButton />` 渲染它，
   所以静态 HTML 里的版本号、文件名、大小、SHA-256 与下载链接都是正确的（搜索引擎也看得到）。
2. **同源副本** —— 同一份数据同时写到 `docs/public/latest-release.json`，页面打开时先读它（不受 GitHub API 限流影响）。
3. **实时 API** —— 再向 `api.github.com/repos/zy8270/engCamera/releases/latest` 核对一次。若 GitHub 上已有更新版本，
   页面自动切到新版本与新链接——**发版后即使站点还没重建，访客拿到的也是最新链接**。

任何一级失败都静默降级到上一级，绝不把已显示的版本号打回旧值。

组件源码：`docs/.vitepress/theme/components/`（`DownloadButton.vue` / `ReleaseTable.vue`），
数据逻辑：`docs/.vitepress/theme/composables/useLatestRelease.ts`。

## 内容维护

- 界面截图：`docs/public/shots/*.webp`，取自 Android 模拟器（Pixel 10 Pro / Android 16）
- 新增 wiki 页面后需在 `docs/.vitepress/config.mts` 的 `sidebar` 里登记，否则左侧目录不显示

## 部署

推送到 `main` 分支即自动构建并部署（`.github/workflows/deploy.yml`）。首次部署需在仓库 Settings → Pages 里把 Source 设为 **GitHub Actions**。

工作流另外**每天 03:17（UTC）定时重建一次**，把最新 Release 重新烧进静态产物。前端实时校正已保证即时性，
定时重建是为了让 SSR 内容与搜索引擎索引也保持同步。整套机制**不需要任何 secret 或 PAT**。

## License

文档内容随 engCamera 项目以 MIT 协议发布。
