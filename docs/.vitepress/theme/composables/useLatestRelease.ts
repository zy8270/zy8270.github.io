/**
 * 最新 Release 数据：构建期快照 + 打开页面时实时校正。
 *
 * 三级来源，逐级更可信：
 * 1. `release.generated.json` —— 构建时由 scripts/fetch-release.mjs 抓取并提交入库，
 *    随静态 HTML 一起产出（SSR 内容正确，搜索引擎看得到）。
 * 2. `/latest-release.json` —— 同一份数据的同源副本，运行时先读它，不受 GitHub
 *    API 限流影响（每日定时重建会刷新它）。
 * 3. `api.github.com/.../releases/latest` —— 实时最新；发版后即使站点还没重建，
 *    访客也能立刻看到新版本与正确的下载链接。
 *
 * 任何一级失败都静默降级到上一级，绝不把已显示的版本号打回旧值。
 */
import { onMounted, ref, type Ref } from 'vue'
import snapshot from '../../release.generated.json'

export interface ReleaseInfo {
  version: string
  tag: string
  versionCode: number | null
  apkName: string
  sizeBytes: number
  size: string
  sha256: string
  publishedAt: string
  date: string
  downloadUrl: string
  releaseUrl: string
  source?: string
  fetchedAt?: string
}

const FALLBACK: ReleaseInfo = {
  version: '0.0.0',
  tag: 'unknown',
  versionCode: null,
  apkName: '',
  sizeBytes: 0,
  size: '',
  sha256: '',
  publishedAt: '',
  date: '',
  downloadUrl: 'https://github.com/zy8270/engCamera/releases/latest',
  releaseUrl: 'https://github.com/zy8270/engCamera/releases',
}

const API = 'https://api.github.com/repos/zy8270/engCamera/releases/latest'
const SAME_ORIGIN = '/latest-release.json'

/** 版本号按数字段逐位比较（与 App 内 UpdateChecker.isNewer 同规则） */
export function isNewer(candidate: string, current: string): boolean {
  const num = (v: string) => (v.match(/\d+/g) || []).map(Number)
  const a = num(candidate)
  const b = num(current)
  for (let i = 0; i < Math.max(a.length, b.length, 1); i++) {
    const x = a[i] ?? 0
    const y = b[i] ?? 0
    if (x !== y) return x > y
  }
  return false
}

function fromGitHubApi(json: any): ReleaseInfo | null {
  const tag = String(json?.tag_name || '').trim()
  const apk = (json?.assets || []).find((a: any) => /\.apk$/i.test(a?.name || ''))
  if (!tag || !apk) return null
  const versionCode = Number((/-(\d+)\.apk$/i.exec(apk.name) || [])[1]) || null
  return {
    version: tag.replace(/^v/i, ''),
    tag,
    versionCode,
    apkName: apk.name,
    sizeBytes: apk.size,
    size: apk.size ? `约 ${(apk.size / 1024 / 1024).toFixed(1)} MB` : '',
    sha256: String(apk.digest || '').replace(/^sha256:/i, ''),
    publishedAt: json.published_at || '',
    date: (json.published_at || '').slice(0, 10),
    downloadUrl: apk.browser_download_url,
    releaseUrl: json.html_url || `https://github.com/zy8270/engCamera/releases/tag/${tag}`,
    source: 'api',
  }
}

const current: Ref<ReleaseInfo> = ref({ ...FALLBACK, ...(snapshot as Partial<ReleaseInfo>) })
let started = false

function upgrade(candidate: ReleaseInfo | null) {
  if (!candidate?.version) return
  if (isNewer(candidate.version, current.value.version)) {
    current.value = candidate
  }
}

async function loadLive() {
  // 同源副本：不受限流，且每日重建会刷新
  try {
    const res = await fetch(`${SAME_ORIGIN}?t=${Date.now()}`, { cache: 'no-store' })
    if (res.ok) upgrade(await res.json())
  } catch {
    /* 忽略：保留构建快照 */
  }

  // 实时 API：发版后无需等待站点重建
  try {
    const res = await fetch(API, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store',
    })
    if (res.ok) upgrade(fromGitHubApi(await res.json()))
  } catch {
    /* 忽略：限流/离线都用上一级数据 */
  }
}

/** 组件里调用：拿到共享的响应式数据，并在客户端挂载后触发一次实时校正 */
export function useLatestRelease() {
  onMounted(() => {
    if (started) return
    started = true
    void loadLive()
  })
  return current
}

/** 供 SSR/非组件场景直接读快照 */
export const releaseSnapshot = current
