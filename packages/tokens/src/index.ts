/**
 * @riseaicloud/tokens — Edge Design System Design Tokens
 *
 * Central source of truth for colors, typography, spacing, motion, and themes.
 * Import individual modules for tree-shaking, or use this barrel export.
 */

// Colors
export {
  lightColors,
  darkColors,
  cockpitColors,
  topologyColors,
  darkCockpitColors,
  darkTopologyColors,
  statusColors,
  surfaceColors,
  chartColors,
} from './colors'
export type {
  SemanticColorKey,
  CockpitColorKey,
  TopologyColorKey,
  StatusColorKey,
  SurfaceColorKey,
  ChartColorKey,
} from './colors'

// Typography
export {
  fontFamily,
  fontSize,
  fontSizeBase,
  fontWeight,
  letterSpacing,
} from './typography'
export type { FontSize, FontWeight } from './typography'

// Spacing & Layout
export {
  spacing,
  radius,
  radiusBase,
  shadows,
  zIndex,
  breakpoints,
  container,
} from './spacing'
export type {
  SpacingKey,
  RadiusKey,
  ShadowKey,
  ZIndexKey,
  BreakpointKey,
} from './spacing'

// Motion
export {
  duration,
  easing,
  keyframes,
  animation,
} from './motion'
export type { DurationKey, EasingKey, AnimationKey } from './motion'

// Primary theme builder —— 由品牌色算出明暗两态的主色与前景色。
// 只给算法不给目录:「提供哪几个主题」是产品决策,固化成公开 API 会让加删主题变成版本事件。
export { buildPrimaryTheme, hexToHslChannels } from './primary-theme'
export type { PrimaryTheme } from './primary-theme'

// Themes
export {
  themes,
  getTheme,
  registerTheme,
} from './themes'
export type { Theme, ThemeColors, ThemeName } from './themes'
