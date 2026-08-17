#!/usr/bin/env node
/**
 * 血缘一致性护栏 —— 防止组件血缘信息在三处（组件文件 / story 副标题 / 文档站
 * 血缘清单）之间漂移。起因：2026-08-17 CollapsibleSection 换 Radix 底座后清单
 * 页更新了、story 副标题漏更新，被用户当场抓到。
 *
 * 检查项：
 *   1. 每个组件文件都登记在 docs/pages/guide/component-registry.mdx
 *   2. 每个组件都有 .stories.tsx（内部实现除外，见 STORYLESS_ALLOWLIST）
 *   3. 每个 story 都有 componentSubtitle
 *   4. story 副标题的血缘档 == 清单页该行的血缘档
 *   5. story 分组（Shadcn 原生 / 二次封装）与血缘档匹配：原版/适配 → Shadcn 原生，
 *      自研/组合封装 → 二次封装
 *
 * 用法：node scripts/lineage-lint.mjs   （发版前必跑，见 STATUS.md 发布检查清单）
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const COMPONENTS_DIR = join(root, 'packages/ui/src/components')
const REGISTRY = join(root, 'docs/pages/guide/component-registry.mdx')

// 不导出的内部实现，允许无 story
const STORYLESS_ALLOWLIST = new Set(['searchable-select'])

const LINEAGES = ['shadcn 原版', 'shadcn 适配', '组合封装', '自研']
const GROUP_OF = {
  'shadcn 原版': 'Shadcn 原生',
  'shadcn 适配': 'Shadcn 原生',
  自研: '二次封装',
  组合封装: '二次封装',
}

const registry = readFileSync(REGISTRY, 'utf8')
const files = readdirSync(COMPONENTS_DIR).filter(
  (f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx')
)

const errors = []
const lineageOf = (text) => LINEAGES.find((l) => text.includes(l))

for (const file of files) {
  const base = file.replace(/\.tsx$/, '')

  // 1. 清单登记
  const row = registry.split('\n').find((l) => l.includes(`| ${file} |`))
  if (!row) {
    errors.push(`${file}: 未登记在 component-registry.mdx`)
    continue
  }
  const registryLineage = lineageOf(row)
  if (!registryLineage) {
    errors.push(`${file}: 清单行未标血缘档（${LINEAGES.join('/')}）`)
    continue
  }

  // 2. story 存在
  const storyPath = join(COMPONENTS_DIR, `${base}.stories.tsx`)
  let story
  try {
    story = readFileSync(storyPath, 'utf8')
  } catch {
    if (!STORYLESS_ALLOWLIST.has(base)) errors.push(`${file}: 缺 ${base}.stories.tsx`)
    continue
  }

  // 3. componentSubtitle 存在
  const subMatch = story.match(/componentSubtitle: '([^']+)'/)
  if (!subMatch) {
    errors.push(`${base}.stories.tsx: 缺 componentSubtitle`)
    continue
  }

  // 4. 血缘档一致
  const storyLineage = lineageOf(subMatch[1])
  if (storyLineage !== registryLineage) {
    errors.push(
      `${base}: 血缘漂移 —— story「${storyLineage ?? '未标'}」 vs 清单「${registryLineage}」`
    )
  }

  // 5. 分组匹配
  // 锚定分组名，避免匹配到 story 数据里的列定义 title
  const titleMatch = story.match(/title: '(Shadcn 原生|二次封装)\//)
  if (titleMatch && titleMatch[1] !== GROUP_OF[registryLineage]) {
    errors.push(
      `${base}: 分组错位 —— story 在「${titleMatch[1]}」组，血缘「${registryLineage}」应在「${GROUP_OF[registryLineage]}」组`
    )
  }
}

if (errors.length) {
  console.error(`✗ 血缘一致性检查失败（${errors.length} 处）：`)
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}
console.log(`✓ 血缘一致性通过：${files.length} 个组件文件，三处信息同步`)
