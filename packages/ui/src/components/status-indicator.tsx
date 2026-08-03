import * as React from "react"
import { cn } from "../utils"

export type StatusVariant = "success" | "warning" | "error" | "info" | "neutral" | "default"

export interface StatusIndicatorProps {
  /** Status variant controlling the color */
  variant?: StatusVariant
  /** Whether to show the animated ping effect */
  animated?: boolean
  /** Size of the indicator dot */
  size?: "sm" | "md" | "lg"
  /** Optional label text displayed next to the dot */
  label?: string
  /** Additional CSS classes */
  className?: string
}

const variantColors: Record<StatusVariant, { dot: string; ping: string }> = {
  success: { dot: "bg-green-500", ping: "bg-green-400" },
  warning: { dot: "bg-yellow-500", ping: "bg-yellow-400" },
  error: { dot: "bg-red-500", ping: "bg-red-400" },
  info: { dot: "bg-blue-500", ping: "bg-blue-400" },
  neutral: { dot: "bg-muted-foreground", ping: "bg-muted-foreground/60" },
  default: { dot: "bg-muted-foreground", ping: "bg-muted-foreground/60" },
}

const sizeMap: Record<"sm" | "md" | "lg", string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-3 w-3",
}

export function StatusIndicator({
  variant = "default",
  animated = false,
  size = "md",
  label,
  className,
}: StatusIndicatorProps) {
  const colors = variantColors[variant]
  const dotSize = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("relative flex", dotSize)}>
        {animated && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              colors.ping
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full",
            dotSize,
            colors.dot
          )}
        />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}
