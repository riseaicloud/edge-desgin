"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "../utils"

export interface NumberFieldProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "value" | "onChange" | "type"> {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** 输入框外层容器的类名（组件本身是 `relative` 定位容器 + 绝对定位的加减按钮） */
  className?: string
}

/**
 * 数字步进器 —— 居中数值 + 左右两侧的减/加按钮。
 *
 * 用于「值有明确上下界、以固定步长调整」的偏好项（字号、侧栏宽度一类）。
 * 相比滑块的好处是能看到精确值；相比分段器的好处是不必把连续区间硬切成几档。
 *
 * **为什么是自实现而不是包一层 primitive**：Radix 没有 NumberField（Vue 侧的 reka-ui 才有），
 * 而这个控件的全部复杂度就是"钳制到 [min,max] + 键盘上下键 + 到界禁用按钮"，包一层反而更绕。
 *
 * 输入采取「编辑时不拦、提交时钳制」：直接钳制会让用户从 16 删到空、想输 9 都做不到
 * （删成空的瞬间被拉回 min）。所以输入过程保留原始字符串，blur / Enter 时才归一。
 */
const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ value, onValueChange, min, max, step = 1, disabled, className, ...props }, ref) => {
    // 编辑中的原始文本。null 表示"未在编辑"，显示受控值。
    const [draft, setDraft] = React.useState<string | null>(null)

    const clamp = React.useCallback(
      (n: number) => {
        let v = n
        if (min !== undefined) v = Math.max(min, v)
        if (max !== undefined) v = Math.min(max, v)
        return v
      },
      [min, max]
    )

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
      <div className={cn("relative", className)}>
        <button
          type="button"
          tabIndex={-1}
          aria-label="减少"
          disabled={disabled || atMin}
          onClick={() => nudge(-step)}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-3 disabled:cursor-not-allowed disabled:opacity-20"
        >
          <Minus className="size-4" />
        </button>

        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          disabled={disabled}
          value={draft ?? String(value)}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit(e.currentTarget.value)
            else if (e.key === "ArrowUp") {
              e.preventDefault()
              nudge(step)
            } else if (e.key === "ArrowDown") {
              e.preventDefault()
              nudge(-step)
            }
          }}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-5 py-1 text-center text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />

        <button
          type="button"
          tabIndex={-1}
          aria-label="增加"
          disabled={disabled || atMax}
          onClick={() => nudge(step)}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-3 disabled:cursor-not-allowed disabled:opacity-20"
        >
          <Plus className="size-4" />
        </button>
      </div>
    )
  }
)
NumberField.displayName = "NumberField"

export { NumberField }
