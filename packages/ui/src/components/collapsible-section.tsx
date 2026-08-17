"use client"

import * as React from "react"
import { useState } from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
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

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) {
      setInternalExpanded(next)
    }
    onToggle?.(next)
  }

  // Radix Collapsible 底座（曾是 useState + 条件渲染的手搓折叠——包里两套折叠
  // 实现并存）。收益：aria-expanded/键盘由原语托管，data-state 可挂过渡动画。
  return (
    <CollapsiblePrimitive.Root
      open={isExpanded}
      onOpenChange={handleOpenChange}
      className={cn("border border-border rounded-lg", className)}
    >
      <CollapsiblePrimitive.Trigger asChild>
        <button
          type="button"
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
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className={cn("px-4 pb-4", contentClassName)}>
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}
