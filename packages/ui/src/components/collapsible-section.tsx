"use client"

import * as React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../utils"

export interface CollapsibleSectionProps {
  /** Section title */
  title: string
  /** Optional icon next to the title */
  icon?: React.ReactNode
  /** Optional right-side content (e.g., badge, count) */
  extra?: React.ReactNode
  /** Whether initially expanded */
  defaultExpanded?: boolean
  /** Controlled expanded state */
  expanded?: boolean
  /** Callback when expanded state changes */
  onToggle?: (expanded: boolean) => void
  /** Content inside the collapsible section */
  children: React.ReactNode
  /** Additional CSS classes for the wrapper */
  className?: string
  /** Additional CSS classes for the content area */
  contentClassName?: string
}

export function CollapsibleSection({
  title,
  icon,
  extra,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onToggle,
  children,
  className,
  contentClassName,
}: CollapsibleSectionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const isControlled = controlledExpanded !== undefined
  const isExpanded = isControlled ? controlledExpanded : internalExpanded

  const handleToggle = () => {
    const next = !isExpanded
    if (!isControlled) {
      setInternalExpanded(next)
    }
    onToggle?.(next)
  }

  return (
    <div className={cn("border border-border rounded-lg", className)}>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={handleToggle}
        className={cn(
          "w-full px-4 py-3 flex items-center justify-between",
          "hover:bg-accent/50 transition-colors",
          "text-left"
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
          {extra}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className={cn("px-4 pb-4", contentClassName)}>
          {children}
        </div>
      )}
    </div>
  )
}
