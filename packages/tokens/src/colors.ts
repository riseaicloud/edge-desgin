/**
 * Edge Design System — Color Tokens
 *
 * All colors are defined as HSL channel values (e.g. "221.2 83.2% 53.3%")
 * so they can be used with Tailwind's opacity modifiers:
 *   bg-primary/50  →  hsl(221.2 83.2% 53.3% / 0.5)
 *
 * CSS custom property names match the Tailwind color keys.
 */

// ---------------------------------------------------------------------------
// Semantic color tokens (HSL channel values, no hsl() wrapper)
// ---------------------------------------------------------------------------

export const lightColors = {
  background: '0 0% 100%',
  foreground: '222.2 84% 4.9%',
  card: '0 0% 100%',
  'card-foreground': '222.2 84% 4.9%',
  popover: '0 0% 100%',
  'popover-foreground': '222.2 84% 4.9%',
  primary: '221.2 83.2% 53.3%',
  'primary-foreground': '210 40% 98%',
  secondary: '210 40% 96%',
  'secondary-foreground': '222.2 84% 4.9%',
  muted: '210 40% 96%',
  'muted-foreground': '215.4 16.3% 46.9%',
  accent: '210 40% 96%',
  'accent-foreground': '222.2 84% 4.9%',
  destructive: '0 84.2% 60.2%',
  'destructive-foreground': '210 40% 98%',
  border: '214.3 31.8% 91.4%',
  input: '214.3 31.8% 91.4%',
  ring: '221.2 83.2% 53.3%',

  // ── Surface scale ────────────────────────────────────────────────────────
  // 页面 chrome 的层次：page（内容区底，最暗）< section < toolbar < card（浮起，最亮）。
  // 这就是 Edge Console 的核心视觉语言——「灰底 + 白卡浮起」。
  // 值 = surfaceColors 的 hex 机械转 HSL，浅色视觉零变化：
  //   page #EFF4F9 / toolbar #F9FBFD / section #F5F7FA / dialog-header #F9FBFF
  // 这三个色在 console 里有 650+ 处硬编码内联样式，token 化后才可能跟主题。
  'surface-page': '210 45.5% 95.7%',
  'surface-toolbar': '210 50% 98.4%',
  'surface-section': '216 33.3% 97.1%',
  'surface-dialog-header': '220 100% 98.8%',
} as const

export const darkColors = {
  background: '222.2 84% 4.9%',
  foreground: '210 40% 98%',
  // 卡片比页面底亮 = 浮起。原值与 background 同为 4.9%（shadcn 的扁平模型，
  // 靠 border 区分层次），与浅色的「灰底 + 白卡浮起」不是同一套设计语言，
  // 且会导致 card 比 surface-page 更暗的倒挂。改为镜像浅色的层次模型。
  // 安全性：改动时暗色实质 0% 落地（全仓库仅 2 文件用 dark:），无存量受影响。
  card: '217 33% 13%',
  'card-foreground': '210 40% 98%',
  popover: '222.2 84% 4.9%',
  'popover-foreground': '210 40% 98%',
  primary: '217.2 91.2% 59.8%',
  'primary-foreground': '222.2 84% 4.9%',
  secondary: '217.2 32.6% 17.5%',
  'secondary-foreground': '210 40% 98%',
  muted: '217.2 32.6% 17.5%',
  'muted-foreground': '215 20.2% 65.1%',
  accent: '217.2 32.6% 17.5%',
  'accent-foreground': '210 40% 98%',
  destructive: '0 62.8% 30.6%',
  'destructive-foreground': '210 40% 98%',
  border: '217.2 32.6% 17.5%',
  input: '217.2 32.6% 17.5%',
  ring: '224.3 76.3% 94.1%',

  // ── Surface scale（暗色）─────────────────────────────────────────────────
  // 镜像浅色的相对层次：page < section < toolbar < card。
  // 色相保持 217–222 冷蓝灰（浅色的品牌感）；饱和度压到 33%（暗色高饱和显脏）。
  // 浅色： page 95.7% < section 97.1% < toolbar 98.4% < card 100%
  // 暗色： page 6%    < section 9%    < toolbar 11%   < card 13%
  'surface-page': '222 47% 6%',
  'surface-toolbar': '217 33% 11%',
  'surface-section': '217 33% 9%',
  'surface-dialog-header': '217 33% 11%',
} as const

// ---------------------------------------------------------------------------
// Cockpit / monitoring dashboard colors (hex values)
// ---------------------------------------------------------------------------

export const cockpitColors = {
  bg: '#F8FAFC',
  bgSecondary: '#FFFFFF',
  bgTertiary: '#F9FAFB',
  bgElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  borderHover: '#CBD5E1',
  text: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#6B7280',
  accent: '#3B82F6',
  accentMuted: 'rgba(59, 130, 246, 0.1)',
  success: '#14B8A6',
  successMuted: 'rgba(20, 184, 166, 0.1)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.1)',
  danger: '#EF4444',
  dangerMuted: 'rgba(239, 68, 68, 0.1)',
  purple: '#8B5CF6',
  purpleMuted: 'rgba(139, 92, 246, 0.1)',
} as const

// ---------------------------------------------------------------------------
// Topology visualization colors
// ---------------------------------------------------------------------------

export const topologyColors = {
  bg: '#F5F7FA',
  cluster: '#2D3748',
  clusterForeground: '#FFFFFF',
  nodeGroup: '#10B981',
  nodeGroupForeground: '#FFFFFF',
  node: '#10B981',
  nodeForeground: '#065F46',
} as const

// ---------------------------------------------------------------------------
// Dark-mode counterparts for the hex palettes above
// ---------------------------------------------------------------------------
// preset 此前只在 `:root` 注入 --cockpit-* / --topology-*，`.dark` 块里没有对应覆盖，
// 于是暗色下监控面板与拓扑图**纹丝不动** —— 注意这不只是"图表配色没跟上"：
// cockpitColors.bg 是 #F8FAFC（近白）、text 是 #1E293B（近黑），不覆盖就意味着
// 整个面板在暗色主题下仍是白底黑字。
//
// 两类值的处理方式不同：
//   - 表面 / 文字 / 边框：随主题反转，取值对齐 slate 家族与 surface scale 的暗色层次
//   - 强调色（accent/success/warning/danger/purple）：暗色下**提亮一档**（Tailwind 500 → 400）。
//     暗背景上原色会显得发闷，提亮才有同等的视觉权重。
//   - muted 变体：不透明度 .1 → .15。10% 的色在暗底上几乎看不出来。

export const darkCockpitColors = {
  bg: '#0F172A',
  bgSecondary: '#1E293B',
  bgTertiary: '#172033',
  bgElevated: '#1E293B',
  border: '#334155',
  borderSubtle: '#1E293B',
  borderHover: '#475569',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  accent: '#60A5FA',
  accentMuted: 'rgba(96, 165, 250, 0.15)',
  success: '#2DD4BF',
  successMuted: 'rgba(45, 212, 191, 0.15)',
  warning: '#FBBF24',
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  danger: '#F87171',
  dangerMuted: 'rgba(248, 113, 113, 0.15)',
  purple: '#A78BFA',
  purpleMuted: 'rgba(167, 139, 250, 0.15)',
} as const

export const darkTopologyColors = {
  bg: '#0F172A',
  // 浅色下 cluster 是深灰底 + 白字；暗色下深灰会与背景糊在一起，故提亮到 slate-600。
  cluster: '#475569',
  clusterForeground: '#F1F5F9',
  // 节点在暗底上要"发光"：亮绿底 + 深绿字，与浅色 node 的（中绿底 + 深绿字）同构。
  nodeGroup: '#34D399',
  nodeGroupForeground: '#052E16',
  node: '#34D399',
  nodeForeground: '#052E16',
} as const

// ---------------------------------------------------------------------------
// Status colors (semantic)
// ---------------------------------------------------------------------------

export const statusColors = {
  success: '#14B8A6',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  neutral: '#6B7280',
} as const

// ---------------------------------------------------------------------------
// Surface / background colors
// ---------------------------------------------------------------------------
// These are the high-frequency background colors used across edge-console.
// #EFF4F9 (page), #F9FBFD (toolbar/form), #F5F7FA (section) account for 650+
// hardcoded inline styles in the console codebase.
//
// ⚠️ @deprecated — 这些 hex 常量只能用于 inline style，不跟主题（切暗色/换色不变）。
// 请改用 lightColors/darkColors 里的 `surface-*` 语义 token，它们经 preset 注入
// CSS 变量并生成 Tailwind 类：
//     style={{ backgroundColor: surfaceColors.page }}   ❌ 不跟主题
//     className="bg-surface-page"                        ✅ 跟主题
// 保留导出仅为向后兼容，将在 2.0 移除。

export const surfaceColors = {
  /** @deprecated 用 `bg-surface-page` 代替 */
  page: '#EFF4F9',
  /** @deprecated 用 `bg-surface-toolbar` 代替 */
  toolbar: '#F9FBFD',
  /** @deprecated 用 `bg-surface-section` 代替 */
  section: '#F5F7FA',
  /** @deprecated 用 `bg-surface-dialog-header` 代替 */
  dialogHeader: '#F9FBFF',
  /** System base background (same as cockpitColors.bg) */
  base: '#F8FAFC',
  /** Pure white elevated surface */
  elevated: '#FFFFFF',
} as const

// ---------------------------------------------------------------------------
// Chart / data-visualization palette
// ---------------------------------------------------------------------------
// Unified palette for recharts, monitoring dashboards, and topology edges.
// Avoids scattering hex literals across individual chart components.

export const chartColors = {
  blue: '#3B82F6',
  green: '#10B981',
  teal: '#14B8A6',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  /** Chart axis / grid line */
  grid: '#E5E7EB',
  /** Chart tick / label text */
  text: '#374151',
  /** Topology edge / connection line */
  connection: '#64748B',
  /** Default monitoring line color */
  monitoring: '#059669',
} as const

export type SemanticColorKey = keyof typeof lightColors
export type CockpitColorKey = keyof typeof cockpitColors
export type TopologyColorKey = keyof typeof topologyColors
export type StatusColorKey = keyof typeof statusColors
export type SurfaceColorKey = keyof typeof surfaceColors
export type ChartColorKey = keyof typeof chartColors
