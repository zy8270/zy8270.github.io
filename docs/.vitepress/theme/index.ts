import DefaultTheme from 'vitepress/theme'
import './custom.css'
import DownloadButton from './components/DownloadButton.vue'
import ReleaseTable from './components/ReleaseTable.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 全局注册：文档里直接写 <DownloadButton /> / <ReleaseTable />，
    // 版本号与下载链接由构建期快照 + 运行时 API 校正共同决定
    app.component('DownloadButton', DownloadButton)
    app.component('ReleaseTable', ReleaseTable)
  },
}
