# 隐私与权限

## 一句话总结

**照片不出手机。** 应用没有账号、没有云同步、没有广告 SDK，不收集、不上传任何照片内容。

## 权限清单

| 权限 | 用途 | 是否必需 | 拒绝后 |
| --- | --- | --- | --- |
| `CAMERA` | 取景、拍照、录像 | **必需** | 无法拍照 |
| `RECORD_AUDIO` | 录像录音 | 可选 | 录像无声 |
| `ACCESS_FINE_LOCATION` | 精确位置字段 | 可选 | 位置只到城市级或需手动填 |
| `ACCESS_COARSE_LOCATION` | 大致位置 | 可选 | 位置需手动填 |
| `READ_MEDIA_IMAGES` / `READ_MEDIA_VIDEO` | 相册列表、批量加水印选图 | 可选 | 相册空白 |
| `INTERNET` | 天气、在线地址反查、检查更新 | 可选（功能性） | 这些功能不可用，拍照不受影响 |
| `ACCESS_NETWORK_STATE` | 判断网络是否可用 | 可选 | 无影响 |

## 网络请求都发给了谁

| 目的 | 域名 | 发送的数据 | 频率 |
| --- | --- | --- | --- |
| 天气 | `api.open-meteo.com` | 经纬度 | 定位更新时 |
| 地址反查（Geocoder 太粗时） | BigDataCloud API | 经纬度 | 反查失败时 |
| 检查更新 | `api.github.com` | 无（只是 GET 请求） | 每天一次 |

::: warning 明确没有的
- ❌ 没有埋点/统计 SDK
- ❌ 没有广告 SDK
- ❌ 没有崩溃上报服务
- ❌ 不上传照片、录像、水印内容
- ❌ 没有账号系统，不收集任何身份信息
:::

## 数据都存在哪

全部在应用私有目录（DataStore）+ 相册目录：

| 数据 | 位置 |
| --- | --- |
| 工程组、模板、字段值 | 应用私有 DataStore |
| 设置项 | 应用私有 DataStore |
| 地址/天气缓存 | 应用私有 DataStore |
| 照片与录像 | `DCIM/Camera/`（或你选的 SAF 目录） |
| 网页模板缩略图缓存 | 应用私有 `filesDir/webtpl_thumb/` |

卸载应用会清空私有目录（DataStore、缓存），**不会**删除相册里的照片。

## 备份

Android 系统的自动备份（`backup_rules.xml`）默认排除敏感数据。照片不在自动备份范围内。

## 第三方开源组件

| 组件 | 用途 | 许可证 |
| --- | --- | --- |
| [AndroidLiquidGlassView](https://github.com/QmDeve/AndroidLiquidGlassView) | 液态玻璃折射 | MIT |
| CameraX | 相机 | Apache 2.0 |
| Media3 | 视频合成 | Apache 2.0 |
| Coil | 图片加载 | Apache 2.0 |
| ML Kit Barcode | 二维码识别 | Google 条款 |
| Jetpack Compose | UI | Apache 2.0 |

::: tip ML Kit 的说明
二维码识别使用 Google ML Kit 的**设备端**模型，识别在本地完成，不上传图像。
:::

## 应用本身

- 源码：[github.com/zy8270/engCamera](https://github.com/zy8270/engCamera)
- 许可证：MIT
- 你可以自行审计代码、自行编译

## 常见问题

**为什么需要联网权限？**
天气、地址反查、检查更新都需要。这些功能都可以不用（关掉定位、不连网），拍照核心功能完全离线可用。

**能不能不给定位权限？**
能。位置字段手动填写即可，其他功能不受影响。

**照片会不会被上传？**
不会。应用里没有任何上传照片的代码路径。

**应用会不会读我的其他照片？**
只在你主动点"给图片添加水印"并选图时，读取你**选中**的那些图片（系统选择器保证）。相册页只列文件名以 `engCamera_` 开头的文件。
