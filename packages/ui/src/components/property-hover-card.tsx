"use client"

// PropertyHoverCard —— 悬停显示键值对详情的组合封装（CAMP 设备详情悬浮卡同款：
// 型号文字带虚线下划线，鼠标移入弹出 厂商/型号/算力/设备 ID… 属性列表）。
//
// 底座 HoverCard；行样式是「左标签右值 + 行分隔线」的详情卡风格，与 PropertyList
// 的「label: value」内联网格是两种场景（悬浮详情 vs 页面属性区），只复用
// PropertyItem 数据形状。

import * as React from "react"
import { cn } from "../utils"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card"
import type { PropertyItem } from "./property-list"

export interface PropertyHoverCardProps {
  /** 键值对内容，复用 PropertyList 的 PropertyItem 形状（span 在此无意义，忽略） */
  items: PropertyItem[]
  /** 触发元素 */
  children: React.ReactNode
  /** 触发元素是否带虚线下划线的「可悬停」提示样式。默认 true */
  underline?: boolean
  /** 悬停多久后弹出（ms）。默认 200 */
  openDelay?: number
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  /** 浮层容器类名（默认宽 320，可覆盖） */
  contentClassName?: string
  className?: string
}

export function PropertyHoverCard({
  items,
  children,
  underline = true,
  openDelay = 200,
  side,
  align = "start",
  contentClassName,
  className,
}: PropertyHoverCardProps) {
  return (
    <HoverCard openDelay={openDelay}>
      <HoverCardTrigger asChild>
        <span
          className={cn(
            "inline-flex max-w-full items-center",
            underline &&
              "cursor-default border-b border-dashed border-muted-foreground/50",
            className
          )}
        >
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        className={cn("w-80 p-0", contentClassName)}
      >
        <div className="divide-y divide-border">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-4 py-2.5 text-sm"
            >
              <span className="w-20 shrink-0 text-muted-foreground">
                {item.label}
              </span>
              <span className="min-w-0 flex-1 break-all text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
