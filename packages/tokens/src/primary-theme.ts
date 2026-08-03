/**
 * Edge Design System — Primary theme builder
 *
 * 换主色的机制是「覆盖 `--primary` 一个变量」（见 docs/customization/colors 的 Overriding
 * Tokens）。但一个主色不是一个 hex —— 它是四个值：浅色主色、暗色主色、以及**两种模式下各自
 * 的前景色**。后两个是最容易做错的部分，所以由本包负责算，消费方只需给出色值。
 *
 * **本文件刻意只提供算法、不提供主题目录。**「我们对外给用户哪几个主题、叫什么名」是产品
 * 决策，随时会加会删；固化成库的公开 API 会让加删主题变成版本事件。同仓的 `themes.ts` 就是
 * 前车之鉴：6 套 chrome 皮肤发成了公开 API，库内部一行没用过，现在想折叠进变量体系却必须走
 * deprecate 过渡期。目录放消费方，加一个主题改一行、不发包。
 */

import { darkColors, lightColors } from './colors'

/** 一个主色在明暗两态下的完整取值。均为 HSL 通道值，不含 `hsl()` 包裹，与其余 token 同格式。 */
export interface PrimaryTheme {
  /** 浅色模式的 `--primary` */
  light: string
  /** 暗色模式的 `--primary` */
  dark: string
  /** 浅色模式的 `--primary-foreground` */
  fgLight: string
  /** 暗色模式的 `--primary-foreground` */
  fgDark: string
}

/**
 * 前景色的两个候选，直接取自语义 token，避免另立常量后与 token 漂移。
 * 注意它们并非「浅色用前者、暗色用后者」—— 选哪个只取决于**主色本身的明度**，与当前是不是
 * 暗色模式无关。这正是不能沿用 token 默认值的原因：`darkColors['primary-foreground']` 是近黑，
 * 因为 tokens 的暗色 `--primary` 是亮蓝；一旦把暗色主色换成偏深的彩色，近黑前景就读不了了。
 */
const FG_ON_DARK_COLOR = lightColors['primary-foreground'] // 近白，压在深色主色上
const FG_ON_LIGHT_COLOR = darkColors['primary-foreground'] // 近黑，压在亮色主色上

/**
 * 白色前景的对比度低于此值时改用深色前景。
 *
 * 取阈值而非「选对比度更高的那个」：后者会把常规的品牌蓝也判成深字（白 4.81 / 深 4.34，
 * 两者很接近），而蓝底黑字不是任何设计系统的做法。只有明显读不了的（亮黄、亮绿一类）才翻。
 */
const WHITE_CONTRAST_FLOOR = 3.5

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const round1 = (x: number) => Math.round(x * 10) / 10

/** hex → HSL 通道值字符串，如 `'212 100% 45%'`。无法解析时返回 tokens 的默认主色。 */
export function hexToHslChannels(hex: string): string {
  const rgb = parseHex(hex)
  if (!rgb) return lightColors.primary
  const [r, g, b] = rgb.map((v) => v / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return `${round1(h)} ${round1(s * 100)}% ${round1(l * 100)}%`
}

/** sRGB 相对亮度（WCAG 定义），用于选前景色。 */
function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex)
  if (!rgb) return 0
  const [r, g, b] = rgb.map((v) => {
    const x = v / 255
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** 该主色上应该用近白还是近黑前景。 */
function pickForeground(hex: string): string {
  const contrastWithWhite = 1.05 / (relativeLuminance(hex) + 0.05)
  return contrastWithWhite < WHITE_CONTRAST_FLOOR ? FG_ON_LIGHT_COLOR : FG_ON_DARK_COLOR
}

/**
 * 由品牌色生成一套完整的主色取值。
 *
 * ```ts
 * // 彩色主题:明暗同色(深浅两态下同一个品牌色都成立)
 * buildPrimaryTheme('#006BE6')
 *
 * // 单色主题:浅色用近黑、暗色用近白 —— 主色是中性的,灰只用于色块标识
 * buildPrimaryTheme('#0A0A0B', '#FAFAFA')
 *
 * // 用户取色器同一条路,自定义不是特例
 * buildPrimaryTheme(pickedHex)
 * ```
 *
 * 算出来的值不满意就别用这个函数 —— `PrimaryTheme` 是公开类型，直接给字面量即可完全手控。
 *
 * @param light  浅色模式的主色（hex）
 * @param dark   暗色模式的主色（hex）。省略则与 `light` 相同
 */
export function buildPrimaryTheme(light: string, dark: string = light): PrimaryTheme {
  return {
    light: hexToHslChannels(light),
    dark: hexToHslChannels(dark),
    fgLight: pickForeground(light),
    fgDark: pickForeground(dark),
  }
}
