<script setup lang="ts">
/**
 * 最新版本信息表：数据全部来自最新 Release，发版后无需改文档。
 */
import { computed } from 'vue'
import { useLatestRelease } from '../composables/useLatestRelease'

const release = useLatestRelease()

const rows = computed(() => {
  const r = release.value
  return [
    { k: '版本', text: r.version ? `v${r.version}` : '—', code: false },
    { k: 'versionCode', text: r.versionCode ? String(r.versionCode) : '—', code: false },
    { k: '发布日期', text: r.date || '—', code: false },
    { k: '安装包', text: r.apkName || '—', code: true },
    { k: '大小', text: r.size || '—', code: false },
    { k: 'SHA-256', text: r.sha256 || '—', code: true },
    { k: '系统要求', text: 'Android 7.0（API 24）及以上', code: false },
    { k: '签名', text: '项目专属 release keystore', code: false },
  ]
})
</script>

<template>
  <table>
    <thead>
      <tr><th>项</th><th>值</th></tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.k">
        <td>{{ row.k }}</td>
        <td>
          <strong v-if="row.k === '版本'">{{ row.text }}</strong>
          <code v-else-if="row.code">{{ row.text }}</code>
          <span v-else>{{ row.text }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
td code {
  word-break: break-all;
}
</style>
