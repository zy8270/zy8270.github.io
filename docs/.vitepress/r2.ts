/**
 * R2 镜像的公共地址与对象路径规则。
 *
 * 发版 Action（engCamera/.github/workflows/mirror-to-r2.yml）按同一套规则上传：
 *   releases/<tag>/<apkName>   —— APK 本体（immutable 缓存）
 *   latest.json                —— 最新版本元数据（5 分钟缓存）
 *
 * 用自定义域名 dl.mlmm.eu.org（走 CF 边缘节点，比 r2.dev 开发域名稳定，
 * r2.dev 是 CF 官方标注的测试用域名、有限速）。换域名时只改 R2_PUBLIC_BASE
 * 一处（engCamera 仓库的发版 Action 里那份也要同步改）。
 */

export const R2_PUBLIC_BASE = 'https://dl.mlmm.eu.org'

/** 最新版本的元数据（跨域可读，桶上已配 CORS） */
export const R2_LATEST_JSON = `${R2_PUBLIC_BASE}/latest.json`

/** APK 在 R2 上的公网直链；tag 与文件名缺失时返回空串（调用方回退 GitHub） */
export function mirrorUrlFor(tag: string, apkName: string): string {
  if (!tag || !apkName) return ''
  return `${R2_PUBLIC_BASE}/releases/${tag}/${apkName}`
}
