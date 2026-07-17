/**
 * @riseaicloud/tokens/tailwind-preset
 *
 * Drop-in Tailwind CSS preset that wires up all Edge Design tokens.
 *
 * Usage in tailwind.config.js:
 *
 *   const edgePreset = require('@riseaicloud/tokens/tailwind-preset')
 *   module.exports = { presets: [edgePreset], content: [...] }
 */

import { lightColors, darkColors, cockpitColors, topologyColors } from './colors'
import { fontFamily } from './typography'
import { radius, shadows, zIndex, breakpoints } from './spacing'
import { keyframes, animation } from './motion'

/**
 * Build the Tailwind color config from our semantic color tokens.
 * Each key maps to `hsl(var(--<key>))`.
 */
function buildSemanticColors(tokens: Record<string, string>) {
  const colors: Record<string, string | Record<string, string>> = {}
  const grouped: Record<string, Record<string, string>> = {}

  for (const key of Object.keys(tokens)) {
    const parts = key.split('-')
    if (parts.length === 2) {
      const [group, variant] = parts
      if (!grouped[group]) grouped[group] = {}
      grouped[group][variant] = `hsl(var(--${key}))`
    } else {
      colors[key] = `hsl(var(--${key}))`
    }
  }

  // Merge grouped keys (e.g. primary + primary-foreground)
  for (const [group, variants] of Object.entries(grouped)) {
    if (colors[group]) {
      // Already has a DEFAULT, merge
      colors[group] = { DEFAULT: colors[group] as string, ...variants }
    } else {
      colors[group] = variants
    }
  }

  return colors
}

/**
 * Generate CSS custom property declarations from token objects.
 */
function buildCSSVars(tokens: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(tokens)) {
    vars[`--${key}`] = value
  }
  return vars
}

function buildCockpitCSSVars(tokens: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(tokens)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    vars[`--cockpit-${cssKey}`] = value
  }
  return vars
}

function buildTopologyCSSVars(tokens: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(tokens)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    vars[`--${cssKey}`] = value
  }
  return vars
}

const edgePreset = {
  darkMode: ['class'] as const,
  // Tailwind content-matches even the class selectors that `addBase` emits: if the
  // string "dark" never appears in the consumer's scanned content, the whole `.dark`
  // block is dropped and dark mode silently does nothing. Apps that toggle the class
  // from JS without writing a single `dark:` utility would hit exactly that. Pinning
  // it here means every consumer of the preset is immune by default.
  safelist: ['dark'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: buildSemanticColors(lightColors),
      borderRadius: radius,
      boxShadow: shadows,
      zIndex: Object.fromEntries(
        Object.entries(zIndex).map(([k, v]) => [k, String(v)])
      ),
      fontFamily,
      keyframes,
      animation,
      screens: breakpoints,
    },
  },
  plugins: [
    // Inject CSS custom properties via a Tailwind plugin
    function ({ addBase }: { addBase: (styles: Record<string, Record<string, string>>) => void }) {
      addBase({
        ':root': {
          '--radius': '0.5rem',
          ...buildCSSVars(lightColors as unknown as Record<string, string>),
          ...buildCockpitCSSVars(cockpitColors as unknown as Record<string, string>),
          ...buildTopologyCSSVars({
            'topology-bg': topologyColors.bg,
            cluster: topologyColors.cluster,
            'cluster-foreground': topologyColors.clusterForeground,
            'node-group': topologyColors.nodeGroup,
            'node-group-foreground': topologyColors.nodeGroupForeground,
            node: topologyColors.node,
            'node-foreground': topologyColors.nodeForeground,
          }),
        },
        '.dark': {
          ...buildCSSVars(darkColors as unknown as Record<string, string>),
        },
      })

      // Base layer styles
      addBase({
        '*': { 'border-color': 'hsl(var(--border))' },
        body: {
          'background-color': 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        },
      })
    },
  ],
}

export default edgePreset
export { edgePreset }
