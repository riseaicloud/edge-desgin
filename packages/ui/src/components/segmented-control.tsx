"use client"

// SegmentedControl —— radio 语义的按钮化外观（对齐 Element Plus el-radio-button 的地位，
// shadcn 无此组件）。底座 Radix RadioGroup：必选、不可取消、方向键导航、name 表单集成。
//
// 与家族其它成员的分工：
//   - RadioGroup/RadioGroupItem：圆点 + 文字（经典表单形态）
//   - RadioGroup + Field*：带描述 / Choice Card 卡片
//   - SegmentedControl（本组件）：按钮化外观，options 数组一行用（选项常来自接口）
//
// 判据（勿用错组件）：值要作为参数提交 → 本组件/RadioGroup；纯切视图不提交 → Tabs；
// 允许"全不选"的筛选 → ToggleGroup。
//
// 偏好约束（rise-global 偏好面板）：圆角全走 var 档（用户拨 0 即方角）；四个 variant
// 的选中态一律 primary 系配对——跟随 6 档主题（含近黑中性色），参考图里的深色只是
// 中性色主题下的呈现，不是固定色。

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

const rootVariants = cva("inline-flex", {
  variants: {
    variant: {
      pill: "items-center gap-1 rounded-lg bg-muted p-1",
      solid: "items-stretch rounded-md border border-input bg-background overflow-hidden",
      outline: "items-stretch rounded-md border border-input bg-background overflow-hidden",
      chips: "flex-wrap items-center gap-2",
    },
  },
  defaultVariants: { variant: "pill" },
})

const itemVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        pill: [
          "h-8 px-3 rounded-md border border-border bg-background text-foreground/80",
          "hover:text-foreground",
          "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary",
        ],
        solid: [
          // 首尾格补与容器一致的圆角：容器 overflow-hidden 只能裁背景，
          // 裁不了选中描边/填充的直角——不补圆角，选中首尾项时四角包不住。
          "h-9 px-4 text-foreground/80 border-l border-input first:border-l-0 first:rounded-l-md last:rounded-r-md",
          "hover:text-primary",
          "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:hover:text-primary-foreground",
        ],
        outline: [
          "h-9 px-4 text-foreground/80 border-l border-input first:border-l-0 first:rounded-l-md last:rounded-r-md",
          "hover:text-primary",
          "data-[state=checked]:text-primary data-[state=checked]:ring-1 data-[state=checked]:ring-inset data-[state=checked]:ring-primary data-[state=checked]:z-[1]",
        ],
        chips: [
          "h-9 px-3 rounded-md border border-input bg-background text-foreground/80",
          "hover:border-primary/50 hover:text-foreground",
          "data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary",
        ],
      },
    },
    defaultVariants: { variant: "pill" },
  }
)

export interface SegmentedOption {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
      "orientation" | "children"
    >,
    VariantProps<typeof rootVariants> {
  options: SegmentedOption[]
}

const SegmentedControl = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  SegmentedControlProps
>(({ className, variant, options, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    orientation="horizontal"
    className={cn(rootVariants({ variant }), className)}
    {...props}
  >
    {options.map((opt) => (
      <RadioGroupPrimitive.Item
        key={opt.value}
        value={opt.value}
        disabled={opt.disabled}
        className={cn(itemVariants({ variant }))}
      >
        {opt.icon}
        {opt.label}
      </RadioGroupPrimitive.Item>
    ))}
  </RadioGroupPrimitive.Root>
))
SegmentedControl.displayName = "SegmentedControl"

export { SegmentedControl }
