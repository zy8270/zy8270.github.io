import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '工程水印相机',
  description:
    'engCamera · 工程水印相机：拍照录像前实时预览水印，成片直接烧录；15 款内置模板、液态玻璃、工程组一键切换。开源、无广告、无登录。',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
    ['meta', { name: 'theme-color', content: '#1f6fd0' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '工程水印相机 · engCamera' }],
    [
      'meta',
      {
        property: 'og:description',
        content: '拍照录像前实时预览水印，成片直接烧录。开源工程水印相机，安卓 7.0+。',
      },
    ],
    ['meta', { property: 'og:image', content: '/shots/home.png' }],
  ],
  themeConfig: {
    logo: '/icon.png',
    siteTitle: '工程水印相机',

    nav: [
      { text: '介绍', link: '/intro', activeMatch: '/intro' },
      { text: '下载', link: '/download', activeMatch: '/download' },
      { text: '教程', link: '/tutorial', activeMatch: '/tutorial' },
      {
        text: '说明书',
        link: '/wiki/start',
        activeMatch: '/wiki/',
      },
      { text: '常见问题', link: '/faq', activeMatch: '/faq' },
      {
        text: 'GitHub',
        link: 'https://github.com/zy8270/engCamera',
      },
    ],

    sidebar: {
      '/wiki/': [
        {
          text: '开始',
          items: [
            { text: '安装与首次启动', link: '/wiki/start' },
            { text: '界面总览', link: '/wiki/interface' },
          ],
        },
        {
          text: '拍摄',
          items: [
            { text: '拍照', link: '/wiki/capture' },
            { text: '录像', link: '/wiki/video' },
            { text: '对焦、变焦与镜头', link: '/wiki/focus-zoom' },
            { text: '画质与比例', link: '/wiki/quality' },
          ],
        },
        {
          text: '水印',
          items: [
            { text: '水印编辑器', link: '/wiki/editor' },
            { text: '字段与内容', link: '/wiki/fields' },
            { text: '模板一览', link: '/wiki/templates' },
            { text: '模板导入与导出', link: '/wiki/template-transfer' },
            { text: '液态玻璃', link: '/wiki/liquid-glass' },
            { text: '水印位置与重力', link: '/wiki/position' },
            { text: '防伪码与品牌角标', link: '/wiki/anticounterfeit' },
          ],
        },
        {
          text: '工作流',
          items: [
            { text: '工程组（多工地）', link: '/wiki/project-groups' },
            { text: '拍照确认与标注', link: '/wiki/annotate' },
            { text: '连拍拼图', link: '/wiki/collage' },
            { text: '给已有图片加水印', link: '/wiki/batch-watermark' },
            { text: '相册', link: '/wiki/gallery' },
          ],
        },
        {
          text: '系统与数据',
          items: [
            { text: '定位与天气', link: '/wiki/location-weather' },
            { text: '保存位置与文件名', link: '/wiki/files' },
            { text: '设置项说明', link: '/wiki/settings' },
            { text: '语言与主题', link: '/wiki/appearance' },
            { text: '更新与版本', link: '/wiki/update' },
          ],
        },
        {
          text: '其他',
          items: [
            { text: '常见问题', link: '/wiki/faq' },
            { text: '隐私与权限', link: '/wiki/privacy' },
            { text: '从源码构建', link: '/wiki/build' },
          ],
        },
      ],
      '/tutorial': [
        {
          text: '教程',
          items: [
            { text: '五分钟上手', link: '/tutorial' },
            { text: '工地说实话：从开工到竣工留痕', link: '/tutorial/site-log' },
            { text: '多工地：工程组切换', link: '/tutorial/multi-site' },
            { text: '补拍：给旧照片加水印', link: '/tutorial/retro-watermark' },
          ],
        },
      ],
    },

    outline: { level: [2, 3], label: '本页目录' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zy8270/engCamera' },
    ],

    footer: {
      message: 'MIT License · 无广告 · 无登录 · 无云同步',
      copyright: 'Copyright © 2026 Rnzhy',
    },

    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到日间模式',
    darkModeSwitchTitle: '切换到夜间模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    lastUpdatedText: '最后更新',
    notFound: {
      title: '页面不存在',
      quote: '这个页面可能已经挪位置了，回首页看看吧。',
      linkText: '回首页',
    },
  },
})
