#!/usr/bin/env node
/**
 * 构建前抓取 engCamera 最新 Release，写入 docs/.vitepress/release.generated.json。
 *
 * 站点下载页把这份数据渲染进静态 HTML（构建期快照），页面打开后再由前端
 * 向 api.github.com 实时校正一次——所以即使发版后没重新构建，访客看到的
 * 也是最新链接；构建只是给 SSR 内容与搜索引擎一个正确的兜底。
 *
 * 抓取失败时**保留**已有 JSON（不让一次网络抖动把版本号打回旧值），
 * 且以退出码 0 结束，不阻塞构建。
 */
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'zy8270/engCamera'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
/** 构建期快照：被前端 import，渲染进 SSR 产物 */
const OUT = join(ROOT, 'docs/.vitepress/release.generated.json')
/** 同源副本：作为 public 资源发布，运行时优先读它（不受 GitHub API 限流影响） */
const OUT_PUBLIC = join(ROOT, 'docs/public/latest-release.json')

/** R2 镜像公网前缀与路径规则（与 docs/.vitepress/r2.ts、发版 Action 保持一致） */
const R2_PUBLIC_BASE = 'https://pub-dd825b6251784cca9e7de8b1d0942078.r2.dev'
const R2_LATEST_JSON = `${R2_PUBLIC_BASE}/latest.json`

/** 读取 R2 的 latest.json，确认镜像已就绪的 tag；拿不到返回 null（不阻塞构建） */
async function fetchMirror() {
  try {
    const res = await fetch(`${R2_LATEST_JSON}?t=${Date.now()}`, {
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const json = await res.json()
    const tag = String(json?.tag || '').trim()
    const apkName = String(json?.apkName || '').trim()
    return tag && apkName ? { tag, apkName } : null
  } catch {
    return null
  }
}

/** 42920854 → "约 40.9 MB" */
function humanSize(bytes) {
  if (!bytes) return ''
  return `约 ${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** engCamera-v0.6.32-296.apk → 296 */
function versionCodeOf(name) {
  const m = /-(\d+)\.apk$/i.exec(name || '')
  return m ? Number(m[1]) : null
}

/** ISO → 北京时间 YYYY-MM-DD（与 Release 正文里的日期口径一致） */
function dateOf(iso) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso))
}

function toRelease(json, mirror) {
  const tag = String(json.tag_name || '').trim()
  const version = tag.replace(/^v/i, '')
  const apk = (json.assets || []).find((a) => /\.apk$/i.test(a.name || ''))
  if (!tag || !apk) return null
  const githubUrl = apk.browser_download_url
  // 只有 R2 报告过同一 tag 才用镜像地址，避免指向尚未上传的对象（404）
  const mirrorUrl = mirror?.tag === tag ? `${R2_PUBLIC_BASE}/releases/${tag}/${mirror.apkName}` : ''
  return {
    version,
    tag,
    versionCode: versionCodeOf(apk.name),
    apkName: apk.name,
    sizeBytes: apk.size,
    size: humanSize(apk.size),
    sha256: String(apk.digest || '').replace(/^sha256:/i, ''),
    publishedAt: json.published_at || '',
    date: dateOf(json.published_at),
    downloadUrl: mirrorUrl || githubUrl,
    mirrorUrl,
    githubUrl,
    releaseUrl: json.html_url || `https://github.com/${REPO}/releases/tag/${tag}`,
    source: 'api',
    fetchedAt: new Date().toISOString(),
  }
}

async function main() {
  let previous = null
  if (existsSync(OUT)) {
    try {
      previous = JSON.parse(await readFile(OUT, 'utf8'))
    } catch {
      previous = null
    }
  }

  // 镜像状态：拿不到就当未就绪，只影响是否把 R2 设为首选下载源
  const mirror = await fetchMirror()

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'engcamera-site-build',
      },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const release = toRelease(await res.json(), mirror)
    if (!release) throw new Error('release 里找不到 APK 资产')
    const body = JSON.stringify(release, null, 2) + '\n'
    await writeFile(OUT, body, 'utf8')
    await writeFile(OUT_PUBLIC, body, 'utf8')
    console.log(
      `[release] ${release.tag} · vc${release.versionCode} · ${release.size} · ${release.date} · ` +
        (release.mirrorUrl ? 'CF 镜像' : 'GitHub（镜像未就绪）')
    )
  } catch (err) {
    if (previous) {
      console.warn(`[release] 抓取失败（${err.message}），沿用已提交的快照 ${previous.tag}`)
    } else {
      console.error(`[release] 抓取失败且无快照（${err.message}）`)
      process.exit(1)
    }
  }
}

main()
