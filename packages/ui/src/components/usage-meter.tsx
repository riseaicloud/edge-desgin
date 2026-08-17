"use client"

// UsageMeter —— 资源用量行（标签 + 迷你进度条 + 百分比 + 悬停明细），
// CAMP 资源池/节点的 vGPU/算力/显存 用量列表同款。组合封装：Progress + Tooltip。
//
// 配色两种模式：
//   - tone 固定档：primary（默认，跟主题）/ success / warning / danger
//   - tone="auto"：按水位取语义色（<70 绿、70–90 黄、≥90 红）——水位语义的
//     绿=充裕/红=告急是固定色相（同 StatusIndicator 的规范：色相即语义，
//     不随品牌主题反转）
//
// 悬停明细走 Tooltip（一眼看完、无需交互）；需要可交互的富内容请用 PropertyHoverCard。

import * as React from "react"
import { cn } from "../utils"
import { Progress } from "./progress"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip"

export interface UsageMeterDetail {
  label: React.ReactNode
  value?: React.ReactNode
}

export interface UsageMeterProps {
  label: React.ReactNode
  /** 0–100，越界自动钳制 */
  percent: number
  tone?: "primary" | "success" | "warning" | "danger" | "auto"
  /**
   * 运行时动态填充色（任意 CSS 颜色值，如接口下发的厂商色）。设置后覆盖 tone。
   * 编译期能确定的颜色请优先用 tone 或 barClassName（跟随主题/语义规范）。
   */
  color?: string
  /** 悬停明细（如 总量/已分配/剩余）；数组渲染为「- label value」行，也可传 ReactNode */
  details?: UsageMeterDetail[] | React.ReactNode
  /** 隐藏右侧百分比文字 */
  showPercent?: boolean
  className?: string
  /** 进度条宽高覆盖（默认 h-1.5 w-20） */
  barClassName?: string
  /** 标签宽度覆盖（默认 min-w-12） */
  labelClassName?: string
}

const TONE_CLASSES = {
  primary: "[&>div]:bg-primary",
  success: "[&>div]:bg-green-500",
  warning: "[&>div]:bg-amber-500",
  danger: "[&>div]:bg-red-500",
} as const

export function UsageMeter({
  label,
  percent,
  tone = "primary",
  color,
  details,
  showPercent = true,
  className,
  barClassName,
  labelClassName,
}: UsageMeterProps) {
  const p = Math.max(0, Math.min(100, percent))
  const resolvedTone =
    tone === "auto" ? (p >= 90 ? "danger" : p >= 70 ? "warning" : "success") : tone

  const row = (
    <div
      className={cn(
        "flex items-center gap-3 py-1 text-sm",
        details && "-mx-1.5 rounded px-1.5 hover:bg-accent/50",
        className
      )}
    >
      <span className={cn("min-w-12 shrink-0 text-muted-foreground", labelClassName)}>
        {label}
      </span>
      <Progress
        value={p}
        // 动态色经 CSS 变量注入：类名本身是静态的（能被 Tailwind 扫描生成），
        // 颜色值走 style——动态拼类名（bg-[${hex}]）JIT 不会生成，是坑。
        style={color ? ({ "--um-color": color } as React.CSSProperties) : undefined}
        className={cn(
          "h-1.5 w-20 bg-muted",
          color ? "[&>div]:bg-[var(--um-color)]" : TONE_CLASSES[resolvedTone],
          barClassName
        )}
      />
      {showPercent && (
        <span className="shrink-0 tabular-nums text-foreground/80">{Math.round(p)}%</span>
      )}
    </div>
  )

  if (!details) return row

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{row}</TooltipTrigger>
        <TooltipContent side="right" className="text-sm">
          {Array.isArray(details) ? (
            <div className="space-y-0.5">
              <div className="font-medium">{label}</div>
              {details.map((d, i) => (
                <div key={i}>
                  - {d.label} {d.value}
                </div>
              ))}
            </div>
          ) : (
            details
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
