"use client"

/**
 * `Select` —— 平台下拉的**唯一推荐入口**（一行用，AntD 式心智）。
 *
 * ```tsx
 * <Select options={opts} value={v} onValueChange={setV} />                 // 固定枚举
 * <Select options={opts} searchable onSearch={q => refetch(q)} … />        // 远程搜索
 * <Select options={opts} multiple values={vs} onValuesChange={setVs} />    // 多选
 * ```
 *
 * **门面 + 双引擎**：使用者只见一个组件，内部按 props 路由 ——
 *
 *   - 纯枚举形态（无任何数据型 props）→ Radix Select 引擎（原生级表单语义/无障碍）
 *   - 出现 searchable / multiple / onSearch / onLoadMore / clearable / loading
 *     任一 → combobox 引擎（searchable-select.tsx：搜索、滚动分页、多选、clearable）
 *
 * 为什么不做成一个大组件：AntD 单组件路线的组合爆炸（50+ props 两两交互）需要
 * rc-select 级别的维护投入；双引擎把复杂度拦在路由边界上，每个引擎各自保持简单。
 *
 * **props 白名单纪律**：本门面只收中性能力。tags / labelInValue / 自由输入等
 * AntD 式膨胀一律拒收；「数据从哪来」（workspace/镜像/资源池…）的业务语义归
 * `@riseaicloud/components` 的业务选择器（= 数据获取 + 组装本组件）。
 *
 * 深度定制（自定义 trigger、分组 SelectGroup、嵌进复杂表单布局）请用组合式积木：
 * `SelectRoot` + `SelectTrigger` + `SelectContent` + `SelectItem`。
 */

import * as React from "react"
import { cn } from "../utils"
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select"
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "./searchable-select"

// ─── Types ───────────────────────────────────────────────────────────────────

/** 平台下拉选项的标准形状。业务数据在调用侧映射成它，不要反向渗透。 */
export type SelectOption = SearchableSelectOption

export interface SelectProps<T extends SelectOption = SelectOption> {
  /** 选项列表。value 不可为空字符串（Radix 约束，空值用 placeholder 表达）。 */
  options: T[]
  /** 单选值。 */
  value?: string
  onValueChange?: (value: string) => void
  /** 多选（自动启用 combobox 引擎）。 */
  multiple?: boolean
  values?: string[]
  onValuesChange?: (values: string[]) => void
  /**
   * 多选全选行（仅 multiple 生效）。true = 默认文案「全选」，string = 自定义。
   * 远程分页未加载完（hasMore）时勾选框停留半选态并旁注「仅全选已加载」，
   * 打勾只出现在全集确实已选中时——勾选框不撒谎。
   */
  selectAll?: boolean | string
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string | number
  /** 搜索框（自动启用 combobox 引擎）。 */
  searchable?: boolean
  searchPlaceholder?: string
  /** 本地过滤器（searchable 且未提供 onSearch 时生效）。 */
  filterOption?: (input: string, option: T) => boolean
  /** 远程搜索（自动启用 combobox 引擎；内部防抖）。 */
  onSearch?: (query: string) => void
  /** 滚动分页（自动启用 combobox 引擎）。 */
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
  /** 清空按钮（自动启用 combobox 引擎；Radix 引擎无法表达"清空"）。 */
  clearable?: boolean
  /** 自定义选项渲染（仅 combobox 引擎生效）。 */
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode
  emptyText?: string
  loadingText?: string
  noMoreText?: string
  debounceMs?: number
  /** 浮层打开回调（常用于首次打开才拉数据）。 */
  onOpen?: () => void
  /** 选中对钩位置，两个引擎统一生效。默认 left（shadcn 传统）；right=对钩靠最右。 */
  checkAlign?: "left" | "right"
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Select<T extends SelectOption = SelectOption>(props: SelectProps<T>) {
  const {
    options,
    value,
    onValueChange,
    multiple,
    placeholder = "请选择",
    disabled,
    className,
    width,
    searchable,
    onSearch,
    onLoadMore,
    clearable,
    loading,
    renderOption,
    onOpen,
    checkAlign = "left",
  } = props

  // 路由规则：出现任何数据型能力 → combobox 引擎；否则 Radix 引擎。
  // clearable 显式传 true 也走 combobox（Radix Select 没有"清空"这个概念）。
  const needsCombobox =
    !!multiple ||
    !!searchable ||
    !!onSearch ||
    !!onLoadMore ||
    !!clearable ||
    !!loading ||
    !!renderOption

  if (needsCombobox) {
    return (
      <SearchableSelect<T>
        {...props}
        // 搜索框的显隐推导：显式指定 > 隐含需要。远程搜索(onSearch)/本地过滤
        // (filterOption)没有输入框就没意义，必须默认亮；其余场景(纯多选、纯
        // clearable、纯分页)默认不出搜索框。
        searchable={searchable ?? (!!onSearch || !!props.filterOption)}
        clearable={clearable ?? false}
        placeholder={placeholder}
      />
    )
  }

  // ── Radix 引擎：固定枚举 ──
  return (
    <SelectRoot value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn("min-w-[120px]", className)}
        style={width ? { width } : undefined}
        onClick={onOpen ? () => onOpen() : undefined}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled} checkAlign={checkAlign}>
            <span className="flex items-center gap-1.5">
              {opt.icon && <span className="inline-flex shrink-0">{opt.icon}</span>}
              {opt.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}
