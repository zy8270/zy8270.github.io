<script setup lang="ts">
/**
 * 下载按钮：版本号、文件名、链接全部来自最新 Release，不写死在文档里。
 *
 * 默认走 Cloudflare R2 镜像（国内直连 GitHub 常超时），并在下方给出
 * GitHub 备用链接——两个链接同时可见，用户可自行切换。
 * 页面打开时若发现 GitHub 上有更新版本，会自动换成新链接。
 */
import { computed } from 'vue'
import { useLatestRelease } from '../composables/useLatestRelease'

const release = useLatestRelease()

const label = computed(() => release.value.apkName || '下载最新版 APK')
const mirrored = computed(() => !!release.value.mirrorUrl)
const primaryHost = computed(() => (mirrored.value ? 'Cloudflare 镜像' : 'GitHub Releases'))
</script>

<template>
  <div class="release-download">
    <!-- 模板里 ref 会被自动解包，不能再写 .value -->
    <p class="release-download__row">
      <a class="VPButton brand" :href="release.downloadUrl">
        ⬇️ 下载 {{ label }}
      </a>
    </p>

    <p class="release-download__meta">
      <span>当前下载源：{{ primaryHost }}</span>
      <a v-if="mirrored" class="release-download__alt" :href="release.githubUrl">
        GitHub 备用链接
      </a>
    </p>

    <p v-if="!mirrored" class="release-download__hint">
      ⏳ 镜像同步中（通常发版后几分钟内完成），当前直接从 GitHub 下载。
    </p>
  </div>
</template>

<style>
/* 不加 scoped：按钮样式统一定义在 custom.css 的 .vp-doc .VPButton 里 */
.release-download {
  margin: 26px 0;
}
.release-download__row {
  margin: 0;
}
.release-download__meta {
  margin: 10px 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.release-download__alt {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.release-download__hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
</style>
