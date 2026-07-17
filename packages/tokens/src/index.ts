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

// Themes
export {
  themes,
  getTheme,
  registerTheme,
} from './themes'
export type { Theme, ThemeColors, ThemeName } from './themes'
