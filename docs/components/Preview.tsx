import React from 'react'

interface PreviewProps {
  children: React.ReactNode
  /** Optional label shown at top-right */
  label?: string
  /** Extra class names for the preview area */
  className?: string
  /** Center items vertically and horizontally */
  center?: boolean
  /** Use dark background for preview */
  dark?: boolean
  /** Override background color (e.g. '#EFF4F9' for Edge Console page background) */
  bgColor?: string
}

/**
 * Preview wrapper for live component demos in MDX docs.
 *
 * Usage in MDX:
 * ```mdx
 * import { Button } from '@riseaicloud/ui'
 * import { Preview } from '../../components/Preview'
 *
 * <Preview>
 *   <Button>Default</Button>
 *   <Button variant="destructive">Delete</Button>
 * </Preview>
 * ```
 */
export function Preview({ children, label, className = '', center = true, dark = false, bgColor }: PreviewProps) {
  return (
    <div className="my-4 rounded-lg border border-border not-prose">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-muted/50 border-b border-border rounded-t-lg">
        <span className="text-xs text-muted-foreground font-medium">Preview</span>
        {label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </div>
      {/* Content area */}
      <div
        className={[
          'p-6 min-h-[80px] rounded-b-lg',
          center ? 'flex flex-wrap items-center gap-3' : '',
          !bgColor ? (dark ? 'bg-[#1e293b]' : 'bg-[#EFF4F9]') : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={bgColor ? { backgroundColor: bgColor } : undefined}
      >
        {children}
      </div>
    </div>
  )
}
