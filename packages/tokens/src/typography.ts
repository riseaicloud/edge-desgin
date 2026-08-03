/**
 * Edge Design System — Typography Tokens
 */

export const fontFamily = {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
  ],
  mono: [
    '"JetBrains Mono"',
    '"SF Mono"',
    'Monaco',
    '"Cascadia Code"',
    '"Fira Code"',
    'Consolas',
    '"Liberation Mono"',
    'monospace',
  ],
} as const

export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
} as const

/**
 * `--font-size-base` 的默认值 —— 正文基准字号，作用于 `body`。
 *
 * 与 `radiusBase` 同性质：一个可被消费方在 `:root` 或 `<html>` 上覆盖的**杠杆**，
 * 用来支持"字号偏好"这类用户可调项，改一处正文跟随。
 *
 * 刻意**只作用 body、不改根 font-size**：Tailwind 的间距/字号刻度全是 rem，动根字号会
 * 把整套布局一起缩放，blast radius 远超"把正文调大一点"的诉求。组件自己的 `text-xs`
 * / `text-sm` 是绝对 rem 值，不受此变量影响 —— 它只影响没有显式字号 class 的文本。
 *
 * 取值 `16px` = `fontSize.base`(1rem) = 浏览器默认，所以接入本 preset 的项目视觉零变化。
 */
export const fontSizeBase = '16px'

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

export const letterSpacing = {
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

export type FontSize = keyof typeof fontSize
export type FontWeight = keyof typeof fontWeight
