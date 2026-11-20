/**
 * R2 镜像的公共地址与对象路径规则。
 *
 * 发版 Action（engCamera/.github/workflows/mirror-to-r2.yml）按同一套规则上传：
 *   releases/<tag>/<apkName>   —— APK 本体（immutable 缓存）
 *   latest.json                —— 最新版本元数据（5 分钟缓存）
 *
 * 换成 R2 自定义域名时只改 R2_PUBLIC_BASE 一处（Action 里那份也要同步改）。
 */

export const R2_PUBLIC_BASE = 'https://pub-dd825b6251784cca9e7de8b1d0942078.r2.dev'

/** 最新版本的元数据（跨域可读，桶上已配 CORS） */
export const R2_LATEST_JSON = `${R2_PUBLIC_BASE}/latest.json`

/** APK 在 R2 上的公网直链；tag 与文件名缺失时返回空串（调用方回退 GitHub） */
export function mirrorUrlFor(tag: string, apkName: string): string {
  if (!tag || !apkName) return ''
  return `${R2_PUBLIC_BASE}/releases/${tag}/${apkName}`
}
