# 下载

## 最新版本

| 项 | 值 |
| --- | --- |
| 版本 | **v0.6.15** |
| versionCode | 259 |
| 发布日期 | 2026-11-03 |
| 安装包 | `engCamera-v0.6.15-259.apk` |
| 大小 | 约 39.4 MB |
| 系统要求 | Android 7.0（API 24）及以上 |
| 签名 | 项目专属 release keystore |

<p style="margin:26px 0">
  <a class="VPButton brand" href="https://github.com/zy8270/engCamera/releases/download/v0.6.15/engCamera-v0.6.15-259.apk">⬇️ 下载 engCamera-v0.6.15-259.apk</a>
</p>

::: warning 关于安装
APK 直接下载自 GitHub Releases，非 Google Play 分发，安装时系统会提示"未知来源应用"——这是侧载的正常提示，允许安装即可。
:::

## 安装步骤

1. 用手机浏览器打开本页，点击上方下载按钮（或从电脑下载后传到手机）
2. 打开系统「文件」应用，点击下载好的 APK
3. 系统若提示"禁止安装未知来源应用"，点击提示中的设置入口，为本文件管理器或浏览器**允许安装未知应用**
4. 返回安装界面，点击「安装」→「打开」
5. 首次启动依次授权：**相机**、**位置**（用于自动定位）、**存储/照片**（用于相册与批量加水印）、**麦克风**（仅录像需要）

::: tip 关于权限
定位权限拒绝也能用，只是位置字段需要手动填写；相机权限是必需的。详见 [隐私与权限](/wiki/privacy)。
:::

## 历史版本

所有版本都在 GitHub Releases 页面上：

👉 [github.com/zy8270/engCamera/releases](https://github.com/zy8270/engCamera/releases)

版本号规则：`v主版本.次版本.修订号`，与 APK 文件名后缀的 `versionCode` 一一对应。同一修订号可能有多个内部构建（versionCode 不同），以 versionCode 更大者为准。

## 更新方式

- **应用内检查**：启动后每天核对一次 GitHub 最新 Release；有新版本时设置页底部出现红点与提示，点击直达下载页
- **手动更新**：下载新版 APK 直接覆盖安装，工程组、模板、设置都会保留（DataStore 数据不随覆盖安装丢失）
- **降级**：Android 不允许直接降级安装，需要先卸载（**会清空应用内所有配置**，请先导出模板）

## 从源码构建

见 [从源码构建](/wiki/build)。

## 验证安装包

如需校验下载完整性，可在电脑上用 `aapt2` 或 `apksigner` 检查：

```bash
aapt2 dump badging engCamera-v0.6.15-259.apk | head -3
# package: name='com.engcamera' versionCode='259' versionName='0.6.15' ...
```
