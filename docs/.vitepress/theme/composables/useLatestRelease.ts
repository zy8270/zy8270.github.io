/**
 * 最新 Release 数据：构建期快照 + 打开页面时实时校正。
 *
 * 下载源分两条腿，默认走 Cloudflare R2（国内直连 github.com 常超时）：
 *   - primary  = R2 直链（mirrorUrl），仅当 R2 上确实有该版本时才用
 *   - fallback = GitHub Release 资产直链（永远存在，作为备用入口）
 *
 * 版本信息来源，逐级更可信：
 * 1. `release.generated.json` —— 构建时由 scripts/fetch-release.mjs 抓取并提交入库，
 *    随静态 HTML 一起产出（SSR 内容正确，搜索引擎看得到）。
 * 2. `/latest-release.json` —— 同一份数据的同源副本，运行时先读它，不受 GitHub
 *    API 限流影响（每日定时重建会刷新它）。
 * 3. R2 的 `latest.json` —— 发版 Action 上传，镜像是否就绪以它为准。
 * 4. `api.github.com/.../releases/latest` —— 实时最新；发版后即使站点还没重建，
 *    访客也能立刻看到新版本号（但若 R2 还没同步，按钮会自动退回 GitHub）。
 *
 * 任何一级失败都静默降级到上一级，绝不把已显示的版本号打回旧值。
 */
import { onMounted, ref, type Ref } from 'vue'
import snapshot from '../../release.generated.json'
import { mirrorUrlFor, R2_LATEST_JSON } from '../../r2'

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
  /** 首选下载地址：R2 镜像就绪时是 R2 直链，否则是 GitHub */
  downloadUrl: string
  /** R2 直链，未镜像时为空串 */
  mirrorUrl: string
  /** GitHub 资产直链，始终可用 */
  githubUrl: string
  releaseUrl: string
  source?: string
  fetchedAt?: string
}

const GITHUB_REPO = 'zy8270/engCamera'

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
  downloadUrl: `https://github.com/${GITHUB_REPO}/releases/latest`,
  mirrorUrl: '',
  githubUrl: `https://github.com/${GITHUB_REPO}/releases/latest`,
  releaseUrl: `https://github.com/${GITHUB_REPO}/releases`,
}

const API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`
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

function humanSize(bytes: number): string {
  return bytes ? `约 ${(bytes / 1024 / 1024).toFixed(1)} MB` : ''
}

function versionCodeOf(name: string): number | null {
  return Number((/-(\d+)\.apk$/i.exec(name || '') || [])[1]) || null
}

/**
 * 统一整理：把镜像地址接上去。
 *
 * 只有 R2 明确报告过该 tag 时（`mirrorTag === tag`）才把 R2 直链设为首选，
 * 否则 downloadUrl 保持 GitHub——避免「GitHub 已发新版但 R2 还没传完」时
 * 把访客送到一个 404 的镜像地址。
 */
function finalize(info: ReleaseInfo, mirrorTag: string): ReleaseInfo {
  const githubUrl = info.githubUrl || info.downloadUrl
  const mirrored = !!mirrorTag && mirrorTag === info.tag
  const mirrorUrl = mirrored ? mirrorUrlFor(info.tag, info.apkName) : ''
  return {
    ...info,
    githubUrl,
    mirrorUrl,
    downloadUrl: mirrorUrl || githubUrl,
  }
}

function fromGitHubApi(json: any): ReleaseInfo | null {
  const tag = String(json?.tag_name || '').trim()
  const apk = (json?.assets || []).find((a: any) => /\.apk$/i.test(a?.name || ''))
  if (!tag || !apk) return null
  const publishedAt = json.published_at || ''
  return {
    version: tag.replace(/^v/i, ''),
    tag,
    versionCode: versionCodeOf(apk.name),
    apkName: apk.name,
    sizeBytes: apk.size,
    size: humanSize(apk.size),
    sha256: String(apk.digest || '').replace(/^sha256:/i, ''),
    publishedAt,
    date: publishedAt.slice(0, 10),
    downloadUrl: apk.browser_download_url,
    mirrorUrl: '',
    githubUrl: apk.browser_download_url,
    releaseUrl: json.html_url || `https://github.com/${GITHUB_REPO}/releases/tag/${tag}`,
    source: 'api',
  }
}

/** R2 的 latest.json（发版 Action 写入），主要用来确认「镜像已就绪」的 tag */
function fromR2(json: any): { tag: string; info: ReleaseInfo | null } | null {
  const tag = String(json?.tag || '').trim()
  if (!tag) return null
  const apkName = String(json?.apkName || '').trim()
  const version = String(json?.version || tag.replace(/^v/i, '')).trim()
  const sizeBytes = Number(json?.sizeBytes) || 0
  const publishedAt = String(json?.publishedAt || '')
  const info: ReleaseInfo | null = apkName
    ? {
        version,
        tag,
        versionCode: Number(json?.versionCode) || versionCodeOf(apkName),
        apkName,
        sizeBytes,
        size: humanSize(sizeBytes),
        sha256: String(json?.sha256 || ''),
        publishedAt,
        date: publishedAt.slice(0, 10),
        downloadUrl: mirrorUrlFor(tag, apkName),
        mirrorUrl: mirrorUrlFor(tag, apkName),
        githubUrl: `https://github.com/${GITHUB_REPO}/releases/download/${tag}/${apkName}`,
        releaseUrl: String(json?.releaseUrl || `https://github.com/${GITHUB_REPO}/releases/tag/${tag}`),
        source: 'r2',
      }
    : null
  return { tag, info }
}

/** 构建期快照里若带了 mirrorUrl，视为该 tag 已镜像 */
const snapshotTag = (snapshot as any)?.mirrorUrl ? String((snapshot as any)?.tag || '') : ''

const current: Ref<ReleaseInfo> = ref(
  finalize({ ...FALLBACK, ...(snapshot as Partial<ReleaseInfo>) }, snapshotTag)
)
/** R2 上确实存在的版本 tag（镜像就绪标志） */
let mirrorTag = snapshotTag
let started = false

function apply(info: ReleaseInfo | null) {
  if (!info?.version) return
  if (isNewer(info.version, current.value.version)) {
    current.value = finalize(info, mirrorTag)
  } else if (info.version === current.value.version) {
    // 同版本：合并（R2 那条带 sha256/size，GitHub 那条带 digest）
    current.value = finalize({ ...current.value, ...info }, mirrorTag)
  }
}

async function loadLive() {
  // ① R2：镜像就绪情况 + 最新版本（国内可达，无 API 限流）
  try {
    const res = await fetch(`${R2_LATEST_JSON}?t=${Date.now()}`, { cache: 'no-store' })
    if (res.ok) {
      const r2 = fromR2(await res.json())
      if (r2) {
        mirrorTag = r2.tag
        // 先按「镜像已就绪」重算当前这条，再考虑升级版本
        current.value = finalize(current.value, mirrorTag)
        apply(r2.info)
      }
    }
  } catch {
    /* 忽略：保留构建快照 */
  }

  // ② 同源副本：不受限流，且每日重建会刷新
  try {
    const res = await fetch(`${SAME_ORIGIN}?t=${Date.now()}`, { cache: 'no-store' })
    if (res.ok) apply(await res.json())
  } catch {
    /* 忽略：保留构建快照 */
  }

  // ③ 实时 API：发版后无需等待站点重建（国内可能打不通，失败即降级）
  try {
    const res = await fetch(API, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store',
    })
    if (res.ok) apply(fromGitHubApi(await res.json()))
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
