<script setup lang="ts">
/**
 * 下载按钮：版本号、文件名、链接全部来自最新 Release，不写死在文档里。
 * 页面打开时若发现 GitHub 上有更新版本，会自动换成新链接。
 */
import { computed } from 'vue'
import { useLatestRelease } from '../composables/useLatestRelease'

const release = useLatestRelease()
const label = computed(() => release.value.apkName || '下载最新版 APK')
</script>

<template>
  <!-- 模板里 ref 会被自动解包，不能再写 .value -->
  <p class="release-download">
    <a class="VPButton brand" :href="release.downloadUrl">
      ⬇️ 下载 {{ label }}
    </a>
  </p>
</template>

<style>
/* 不加 scoped：按钮样式统一定义在 custom.css 的 .vp-doc .VPButton 里 */
.release-download {
  margin: 26px 0;
}
</style>
