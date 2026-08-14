"use client"

// shadcn/ui 原版实现（@radix-ui/react-checkbox 的皮）。
// 曾是隐藏 input + 自绘 div 的手搓版：focus-visible 类写在不可聚焦的 div 上，
// 键盘焦点永不可见。Radix Root 是真按钮，焦点/键盘/表单语义原生齐全。
//
// 对外契约与手搓版保持一致（比 Radix 原生收窄了一处）：
// onCheckedChange 只回调 boolean —— indeterminate 是"父级派生态"（全选框由
// 子项勾选状态算出来），用户点击后只会落到 true/false，存量消费方的
// (checked: boolean) => void 签名不必改。

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "../utils"

export interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    "checked" | "onCheckedChange"
  > {
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, onCheckedChange, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    onCheckedChange={
      onCheckedChange ? (state) => onCheckedChange(state === true) : undefined
    }
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-40",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className="flex items-center justify-center text-current"
    >
      {props.checked === "indeterminate" ? (
        <div className="h-0.5 w-2 bg-current" />
      ) : (
        <Check className="h-3 w-3" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
