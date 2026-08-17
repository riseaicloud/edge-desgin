import * as React from "react"
import { cn } from "../utils"

export interface ProgressRingProps {
  /** Progress percentage (0-100) */
  value: number
  /** SVG size in pixels */
  size?: number
  /** Ring stroke width */
  strokeWidth?: number
  /** Color of the progress arc */
  color?: string
  /** Color of the background track */
  trackColor?: string
  /** Content displayed in the center of the ring */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

export function ProgressRing({
  value,
  size = 65,
  strokeWidth = 6,
  // 默认跟主题：SVG stroke 收 CSS 变量字符串即可。旧默认 #52c41a（AntD 绿）/
  // #e5e7eb 是外来固定色，暗色与换主题都不跟随；显式传 color 的调用方不受影响。
  color = "hsl(var(--primary))",
  trackColor = "hsl(var(--muted))",
  children,
  className,
}: ProgressRingProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100)
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = `${(clampedValue / 100) * circumference} ${circumference}`

  return (
    <div className={cn("relative inline-flex", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
