# 从源码构建

## 环境要求

| 项 | 版本 |
| --- | --- |
| JDK | 21（Android Studio 自带 JBR 即可） |
| Android SDK | API 36（compileSdk / targetSdk） |
| Gradle | 由 wrapper 提供（`./gradlew`） |
| 内存 | 建议 ≥ 8 GB |

## 克隆与配置

```bash
git clone git@github.com:zy8270/engCamera.git
cd engCamera
```

在项目根目录创建 `local.properties`：

```properties
sdk.dir=C:/Users/<you>/AppData/Local/Android/Sdk
```

## 构建 Debug 版

```bash
./gradlew assembleDebug
# 输出：app/build/outputs/apk/debug/app-debug.apk
```

## 构建 Release 版

Release 版需要签名配置。在 `app/` 下创建 `keystore.properties`：

```properties
storeFile=../engcamera.keystore
storePassword=<your-password>
keyAlias=<your-alias>
keyPassword=<your-password>
```

然后把你的 keystore 放到项目根目录，再执行：

```bash
./gradlew assembleRelease
# 输出：app/build/outputs/apk/release/app-release.apk
```

::: warning 签名必须用 release
真机安装必须用 `assembleRelease`。debug 包在某些设备上装不上（签名校验不通过）。
:::

## 验证产物

增量编译可能产出**陈旧 APK**（字节数看起来一样但内容旧）。验证版本：

```bash
aapt2 dump badging app/build/outputs/apk/release/app-release.apk | head -3
# package: name='com.engcamera' versionCode='259' versionName='0.6.15' ...
```

::: warning 怀疑构建异常时
执行 `./gradlew :app:clean` 后重新构建。APK 字节数会按签名块台阶跳变，**同字节数不等于同内容**。
:::

## 在 Android Studio 中构建

1. 用 Android Studio 打开项目根目录
2. 等待 Gradle 同步完成
3. 选择 `app` 配置，点 Run

## 项目结构

```
app/src/main/java/com/engcamera/
├── MainActivity.kt          入口、导航、权限
├── EngCameraApp.kt          Application
├── camera/                  相机页、引擎、确认标注
├── editor/                  水印编辑器、模板选择、取色器
├── data/                    数据模型、仓库、模板预设
├── watermark/               水印渲染、浮层、网页渲染、玻璃
├── gallery/                 相册
├── location/                定位与天气
├── projectgroup/            工程组
├── i18n/                    中英词典
├── scan/                    二维码识别
├── sensor/                  重力传感器
├── ui/                      主题、图案背景、图标
├── update/                  更新检查
└── util/                    媒体保存、视频水印、GPU 效果
```

## 关键模块

| 模块 | 职责 |
| --- | --- |
| `CameraEngine.kt` | CameraX 封装：预览/拍照/录像/变焦/对焦/多镜头 |
| `WatermarkRenderer.kt` | 水印排版与绘制（预览与烧录共用） |
| `WatermarkOverlay.kt` | 预览浮层 |
| `WebTemplateRenderer.kt` | 网页模板离屏渲染（WebView 池） |
| `VideoWatermarker.kt` | Media3 Transformer 逐帧烧录 |
| `GlassFrameEffect.kt` | 录像液态玻璃 GLSL |
| `LocationSource.kt` | 定位三级兜底 + 天气 |
| `WatermarkRepository.kt` | DataStore 持久化与迁移 |

## 修改模板

原生模板定义在 `data/TemplatePresets.kt`，绘制在 `watermark/WatermarkRenderer.kt`（各 `renderXxx` 方法）。网页模板的 HTML 也在 `TemplatePresets.kt`。

## 添加界面文案

1. 在代码里用 `I18n.t("中文文案")`
2. 在 `i18n/I18n.kt` 的 `EN_DICT` 里加 `"中文文案" to "English text"`
3. 改中文键时**必须同步改词典键**，否则英文永远回退中文

## 贡献

- 提 Issue：[github.com/zy8270/engCamera/issues](https://github.com/zy8270/engCamera/issues)
- 提 PR 前请先开 Issue 讨论，避免重复劳动
- 提交前跑一遍 `./gradlew assembleDebug` 确保能编译

## 常见问题

**Gradle 同步失败？**
检查 `local.properties` 的 `sdk.dir` 是否正确；国内网络可能需要配置 Gradle 镜像。

**找不到 SDK？**
Android Studio → SDK Manager 安装 API 36 与对应 Build-Tools。

**构建成功但装不上？**
用 release 签名包，或先卸载旧版（签名不一致时 Android 会拒绝覆盖）。
