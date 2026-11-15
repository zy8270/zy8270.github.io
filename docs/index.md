---
layout: home

hero:
  name: 工程水印相机
  text: 拍完就是成片
  tagline: 拍照、录像前实时预览水印，按下快门就把水印烧进文件。<br>16 款模板、液态玻璃折射、工程组一键换工地 —— 开源、无广告、无登录、无云同步。
  image:
    src: /icon.png
    alt: 工程水印相机
  actions:
    - theme: brand
      text: 下载安卓版
      link: /download
    - theme: alt
      text: 五分钟上手
      link: /tutorial
    - theme: alt
      text: 说明书
      link: /wiki/start

features:
  - icon: 🏗️
    title: 水印所见即所得
    details: 取景器里看到什么样，成片就是什么样。水印直接烧录进 JPEG / MP4，不依赖元数据，发给谁都看得见。
  - icon: 🪟
    title: 液态玻璃折射
    details: 内置 iOS 风格液态玻璃卡，边缘折射 + 色散实时采样相机画面；拍照、录像、批量加水印都走同一套着色器。
  - icon: 🗂️
    title: 16 款内置模板
    details: 经典工程蓝、今日·工程、马克·打卡、极简白影…… 14 款原生 Canvas 直绘 + 2 款网页模板，支持导入导出。
  - icon: 📍
    title: 自动定位与天气
    details: 中文地址多级兜底、天气带 emoji，可手动定格。地址与天气持久缓存，没网也不空白。
  - icon: 🔀
    title: 工程组一键切换
    details: 多个工地各自一套水印，相机底栏直接换，不用每次进编辑器重设。文件名自动带工程名。
  - icon: ✏️
    title: 拍照确认与标注
    details: 快门后先预览：箭头、矩形、笔刷、文字随手标注，逐笔撤销，确认无误再保存。
  - icon: 🧩
    title: 连拍拼图
    details: 一次走访拍多张，按红头模板拼成一张记录页；还能从相册多选加图混排，直接发给客户。
  - icon: 🛡️
    title: 防伪码与品牌角标
    details: 成片右下角可选 14 位内容指纹，配合脚本校验照片是否被改过；品牌角标可换成自己的标识。
---

<div class="shot-grid">
  <figure>
    <img src="/shots/home-glass.webp" alt="主界面" />
    <figcaption>主界面 · 水印所见即所得</figcaption>
  </figure>
  <figure>
    <img src="/shots/editor-glass.webp" alt="水印编辑器" />
    <figcaption>水印编辑器 · 参数实时预览</figcaption>
  </figure>
  <figure>
    <img src="/shots/annotate.webp" alt="拍照确认标注" />
    <figcaption>拍照确认 · 手势标注</figcaption>
  </figure>
  <figure>
    <img src="/shots/addwatermark.webp" alt="批量加水印" />
    <figcaption>给已有图片加水印</figcaption>
  </figure>
</div>

## 为什么做这个应用

因为被广告恶心到了，且 AI 正好赋予了我掀桌子的效率与技术实力。

engCamera 是一个开源的 Android 工程水印相机：**水印在烧录时就画进像素里**，拍完即成品；所有数据都在本机，不上传、不登录、不联网也能拍。

- **不做云端**：没有账号、没有同步、没有广告 SDK，也不收集任何照片内容
- **不做后期**：不需要导出到别的软件再加水印，快门一按即成片
- **不做凑合**：定位、天气、方向、比例、画质都按真实设备能力来，不糊弄

::: tip 适合谁
施工单位 / 监理 / 装修 / 物业巡检 / 设备点检 / 安全巡查 —— 任何需要"照片自带时间地点说明"的场景。
:::

## 主要能力一览

| 能力 | 说明 |
| --- | --- |
| 实时预览水印 | 预览、拍照、录像共用同一套排版与几何，所见即所得 |
| 烧录成片 | 照片直接画进 JPEG；录像走 Media3 Transformer 逐帧合成 |
| 16 款模板 | 14 款原生 + 2 款网页模板，每款有独立可调项 |
| 液态玻璃 | AGSL 实时折射（预览）+ 同款着色器 CPU 移植（成片），录像逐帧 GPU 折射 |
| 工程组 | 多套水印配置，底栏一键切换，文件名带工程名 |
| 字段系统 | 工程名称 / 时间 / 位置 / 天气 / 备注 / 计数 / 自定义，可增删排序显隐 |
| 定位与天气 | FusedLocation + 系统 Geocoder + 在线反查三级兜底；Open-Meteo 天气 |
| 拍照确认 | 箭头 / 矩形 / 笔刷 / 文字标注，六色 + 自由选色，逐笔撤销 |
| 连拍拼图 | 连拍多张按模板拼成一张记录页；可从相册多选加图混排（相册图不烧水印） |
| 防伪码 | 14 位内容指纹，配合脚本校验照片是否被改过（默认关） |
| 品牌角标 | 成片右下角品牌标识，可换文字、可从相册导入自己的图片（默认开） |
| 地址选项 | 地址拆成 8 个层级，自由开关与排序，默认隐藏国家与邮编 |
| 批量加水印 | 相册多选最多 30 张，逐张标注后依次保存 |
| 中英双语 | 跟随系统 / 中文 / English，界面与模板标签即时切换 |
| 明暗主题 | 跟随系统 / 日间 / 夜间 |
| 自定义保存路径 | 默认 `DCIM/Camera`，可选任意文件夹（SAF） |

<div class="home-cta">
  <a class="VPButton medium brand" href="/download">⬇️ 下载安卓版 Release</a>
</div>
