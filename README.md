# 工程水印相机 · 官方网站与说明书

[engCamera](https://github.com/zy8270/engCamera)（工程水印相机）的官网与使用说明书，基于 [VitePress](https://vitepress.dev) 构建，托管于 GitHub Pages。

- 线上地址：<https://zy8270.github.io>
- 应用仓库：<https://github.com/zy8270/engCamera>

## 本地开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 输出 docs/.vitepress/dist
npm run preview  # 预览构建产物
```

## 目录结构

```
docs/
├── .vitepress/          配置与主题（config.mts / theme/）
├── public/              静态资源（icon、shots 截图）
├── index.md             首页（layout: home）
├── intro.md             介绍
├── download.md          下载
├── faq.md               常见问题
├── tutorial/            教程
└── wiki/                使用说明书（22 篇）
```

## 内容维护

- 版本号、下载链接：`docs/download.md` 与 `docs/index.md`、`README` 一致，发版时同步更新
- 界面截图：`docs/public/shots/*.webp`，取自 Android 模拟器（Pixel 10 Pro / Android 16）
- 新增 wiki 页面后需在 `docs/.vitepress/config.mts` 的 `sidebar` 里登记，否则左侧目录不显示

## 部署

推送到 `main` 分支即自动构建并部署（`.github/workflows/deploy.yml`）。首次部署需在仓库 Settings → Pages 里把 Source 设为 **GitHub Actions**。

## License

文档内容随 engCamera 项目以 MIT 协议发布。
