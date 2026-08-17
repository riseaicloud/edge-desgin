"use client"

// QuantityInput —— 带单位的资源量输入（K8s Quantity 场景：内存 6 Gi、CPU 500 毫核）。
// 形态：左侧上下步进箭头 + 居中数值 + 右侧单位下拉，一个边框容器内。
//
// 与 NumberField 的分工：NumberField 是纯数字步进（偏好项一类）；本组件多一个
// 单位维度，数值与单位是同一个字段的两半（提交时合成 "6Gi" 由消费方决定格式）。
// 输入行为与 NumberField 同约定：编辑时不拦、blur/Enter 时钳制归一。
//
// 单位换算（6 Gi ↔ 6144 Mi）是业务语义，归消费方；本组件只报告 (value, unit)。

import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "../utils"
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select"

export interface QuantityUnit {
  value: string
  label?: string
}

export interface QuantityInputProps {
  value: number
  onValueChange: (value: number) => void
  unit?: string
  onUnitChange?: (unit: string) => void
  /** 单位列表；空或单个时不渲染下拉，单个时显示为静态文本 */
  units?: Array<string | QuantityUnit>
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
}

export function QuantityInput({
  value,
  onValueChange,
  unit,
  onUnitChange,
  units = [],
  min,
  max,
  step = 1,
  disabled = false,
  className,
}: QuantityInputProps) {
  const [draft, setDraft] = React.useState<string | null>(null)

  const normalized: QuantityUnit[] = units.map((u) =>
    typeof u === "string" ? { value: u, label: u } : { ...u, label: u.label ?? u.value }
  )

  const clamp = (n: number) => {
    let v = n
    if (min !== undefined) v = Math.max(min, v)
    if (max !== undefined) v = Math.min(max, v)
    return v
  }

  const commit = (raw: string) => {
    setDraft(null)
    const n = Number(raw)
    if (raw.trim() !== "" && Number.isFinite(n)) {
      const next = clamp(n)
      if (next !== value) onValueChange(next)
    }
  }

  const nudge = (delta: number) => {
    setDraft(null)
    const next = clamp(value + delta)
    if (next !== value) onValueChange(next)
  }

  const atMin = min !== undefined && value <= min
  const atMax = max !== undefined && value >= max

  return (
    <div
      className={cn(
        "inline-flex h-9 items-stretch overflow-hidden rounded-md border border-input bg-background text-sm",
        "focus-within:ring-1 focus-within:ring-ring",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {/* 步进箭头列 */}
      <div className="flex w-7 flex-col border-r border-input">
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || atMax}
          onClick={() => nudge(step)}
          className="flex flex-1 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          aria-label="增加"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || atMin}
          onClick={() => nudge(-step)}
          className="flex flex-1 items-center justify-center border-t border-input text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          aria-label="减少"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* 数值 */}
      <input
        type="text"
        inputMode="decimal"
        disabled={disabled}
        value={draft ?? String(value)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit((e.target as HTMLInputElement).value)
          if (e.key === "ArrowUp") { e.preventDefault(); nudge(step) }
          if (e.key === "ArrowDown") { e.preventDefault(); nudge(-step) }
        }}
        className="w-0 min-w-0 flex-1 bg-transparent px-2 text-center tabular-nums outline-none disabled:cursor-not-allowed"
      />

      {/* 单位 */}
      {normalized.length > 1 ? (
        <SelectRoot value={unit} onValueChange={onUnitChange} disabled={disabled}>
          <SelectTrigger
            className={cn(
              "h-full w-auto gap-1 rounded-none border-0 border-l border-input bg-transparent px-2.5",
              "focus:ring-0 focus:ring-offset-0"
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {normalized.map((u) => (
              <SelectItem key={u.value} value={u.value}>
                {u.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      ) : normalized.length === 1 ? (
        <span className="flex items-center border-l border-input px-2.5 text-muted-foreground">
          {normalized[0].label}
        </span>
      ) : null}
    </div>
  )
}
