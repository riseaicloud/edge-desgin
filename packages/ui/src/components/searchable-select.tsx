"use client"

/**
 * combobox 引擎 —— `Select` 门面（select-facade.tsx）的数据型下拉实现体。
 *
 * ⚠️ 本组件**不再从包入口导出**：公共 API 只有门面 `Select`（一行用）与
 * `SelectRoot` 积木（深度定制）。门面在出现 searchable / multiple / onSearch /
 * onLoadMore / clearable / loading 任一数据型 props 时路由到这里。
 *
 * 相对旧版（手写 absolute 浮层）的三处结构性升级：
 *   1. **Radix Popover 底座** —— Portal 渲染：在 Dialog / overflow 容器里不再被
 *      剪裁（旧版致命伤，平台大量下拉活在弹窗表单里）；自带碰撞翻转定位。
 *   2. **键盘导航 + combobox ARIA** —— ↑↓ 移动、Enter 选中、Esc 关闭、Home/End
 *      跳端点；trigger=combobox、列表=listbox、aria-activedescendant 全套。
 *   3. **搜索框移入浮层**（shadcn Combobox 同款 pattern）—— 旧版是 trigger 原地
 *      变身输入框，焦点管理和 Portal 无法两全。
 *
 * 能力面与旧版兼容：本地/远程搜索双模、滚动分页（onLoadMore/hasMore/loading）、
 * clearable、renderOption、icon/disabled 选项；新增 multiple 多选。
 */

import * as React from "react"
import { useState, useEffect, useRef, useCallback, useId } from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { ChevronDown, Check, X, Search } from "lucide-react"
import { cn } from "../utils"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SearchableSelectOption {
  value: string
  label: string
  /** Optional icon rendered on the left of the option (and the selected value). */
  icon?: React.ReactNode
  /** Disable selecting this option. */
  disabled?: boolean
}

export interface SearchableSelectProps<T extends SearchableSelectOption = SearchableSelectOption> {
  /** 单选值。multiple 时忽略，用 values。 */
  value?: string
  onValueChange?: (value: string) => void
  /** 多选。开启后 trigger 显示已选摘要，点选项不关闭浮层。 */
  multiple?: boolean
  /** 多选值。 */
  values?: string[]
  onValuesChange?: (values: string[]) => void
  options: T[]
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  /** 选项加载中（远程模式由父方控制；也用于滚动分页的请求间隙）。 */
  loading?: boolean
  /** 滚动分页：是否还有下一页。 */
  hasMore?: boolean
  /** 显示搜索框。小型固定枚举可关掉（纯样式下拉）。默认 true。 */
  searchable?: boolean
  disabled?: boolean
  /** 本地过滤器；仅在未提供 onSearch（本地模式）时生效。默认 label 不区分大小写包含。 */
  filterOption?: (input: string, option: T) => boolean
  /** 远程搜索回调（内部已防抖）。提供即切换为远程模式，父方负责返回过滤后的 options。 */
  onSearch?: (query: string) => void
  /** 滚动到底回调（配合 hasMore/loading 组成滚动分页）。 */
  onLoadMore?: () => void
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode
  /** 显示清空按钮（单选清成 ''，多选清成 []）。默认 true。 */
  clearable?: boolean
  emptyText?: string
  loadingText?: string
  noMoreText?: string
  /** 远程搜索防抖毫秒数。默认 300。 */
  debounceMs?: number
  /** 浮层打开回调（常用于首次打开才拉数据）。 */
  onOpen?: () => void
  width?: string | number
  /** 选中对钩位置。与 Radix 引擎的 SelectItem 同名同义，门面统一透传。默认 left。 */
  checkAlign?: "left" | "right"
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SearchableSelect<T extends SearchableSelectOption = SearchableSelectOption>({
  value = "",
  onValueChange,
  multiple = false,
  values = [],
  onValuesChange,
  options,
  placeholder = "请选择",
  searchPlaceholder = "搜索…",
  className,
  loading = false,
  hasMore = false,
  searchable = true,
  disabled = false,
  filterOption,
  onSearch,
  onLoadMore,
  renderOption,
  clearable = true,
  emptyText = "无匹配结果",
  loadingText = "加载中…",
  noMoreText = "没有更多了",
  debounceMs = 300,
  onOpen,
  width,
  checkAlign = "left",
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(-1)

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>()
  const listboxId = useId()

  const isRemote = !!onSearch

  // ── 远程搜索防抖 ──
  useEffect(() => {
    if (!open || !isRemote) return
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      if (open) onSearch!(query.trim())
    }, debounceMs)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open])

  // ── 本地过滤（远程模式下父方已过滤，原样展示）──
  const displayed = React.useMemo(() => {
    if (!searchable || isRemote || !query.trim()) return options
    const q = query.trim()
    const f =
      filterOption ??
      ((input: string, opt: T) => opt.label.toLowerCase().includes(input.toLowerCase()))
    return options.filter((opt) => f(q, opt))
  }, [options, searchable, isRemote, query, filterOption])

  // ── 滚动分页 ──
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!onLoadMore || !hasMore || loading) return
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      if (scrollHeight - scrollTop <= clientHeight + 5) onLoadMore()
    },
    [hasMore, loading, onLoadMore]
  )

  // ── 选中逻辑 ──
  const isSelected = useCallback(
    (v: string) => (multiple ? values.includes(v) : value === v),
    [multiple, values, value]
  )

  const select = (v: string) => {
    if (multiple) {
      onValuesChange?.(values.includes(v) ? values.filter((x) => x !== v) : [...values, v])
      // 多选不关浮层，连续勾选
    } else {
      onValueChange?.(v)
      setOpen(false)
    }
  }

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple) onValuesChange?.([])
    else onValueChange?.("")
  }

  // ── 键盘导航（挂在浮层容器上，搜索框内按键冒泡到这里）──
  const move = (delta: number) => {
    if (!displayed.length) return
    let i = activeIndex
    for (let step = 0; step < displayed.length; step++) {
      i = (i + delta + displayed.length) % displayed.length
      if (!displayed[i].disabled) break
    }
    setActiveIndex(i)
    // 滚动跟随
    listRef.current
      ?.querySelector(`[data-idx="${i}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        move(1)
        break
      case "ArrowUp":
        e.preventDefault()
        move(-1)
        break
      case "Home":
        e.preventDefault()
        setActiveIndex(displayed.findIndex((o) => !o.disabled))
        break
      case "End":
        e.preventDefault()
        for (let i = displayed.length - 1; i >= 0; i--) {
          if (!displayed[i].disabled) {
            setActiveIndex(i)
            break
          }
        }
        break
      case "Enter":
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < displayed.length && !displayed[activeIndex].disabled) {
          select(displayed[activeIndex].value)
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        break
    }
  }

  // ── 开合副作用 ──
  const handleOpenChange = (next: boolean) => {
    if (disabled) return
    setOpen(next)
    if (next) {
      onOpen?.()
      // 高亮当前选中项，无则第一项
      const cur = displayed.findIndex((o) => isSelected(o.value))
      setActiveIndex(cur >= 0 ? cur : displayed.findIndex((o) => !o.disabled))
      // Popover 内容挂载后聚焦搜索框
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      setQuery("")
      setActiveIndex(-1)
    }
  }

  // ── trigger 展示文案 ──
  const selectedOption = options.find((o) => o.value === value)
  const triggerText = multiple
    ? values.length === 0
      ? placeholder
      : values.length <= 2
        ? values
            .map((v) => options.find((o) => o.value === v)?.label ?? v)
            .join("、")
        : `已选 ${values.length} 项`
    : selectedOption?.label || value || placeholder
  const hasSelection = multiple ? values.length > 0 : !!value
  const showClear = clearable && hasSelection && !disabled

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          disabled={disabled}
          className={cn(
            // 与 select.tsx 的 SelectTrigger / Input 同一尺寸基准（h-10）
            "flex h-10 w-full min-w-[120px] items-center justify-between gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-muted-foreground/50",
            className
          )}
          style={width ? { width } : undefined}
        >
          <span
            className={cn(
              "flex flex-1 items-center gap-1.5 truncate text-left",
              !hasSelection && "text-muted-foreground"
            )}
            title={typeof triggerText === "string" ? triggerText : undefined}
          >
            {!multiple && selectedOption?.icon && (
              <span className="inline-flex shrink-0">{selectedOption.icon}</span>
            )}
            <span className="truncate">{triggerText}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {showClear && (
              <X
                className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
                onClick={clear}
                aria-label="清空"
              />
            )}
            <ChevronDown
              className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
            />
          </span>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          // 与 trigger 同宽；Portal + 碰撞翻转由 Radix 负责
          style={{ width: "var(--radix-popover-trigger-width)" }}
          className="z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none"
          onKeyDown={onKeyDown}
          // 焦点交给内部搜索框，不让 Radix 抢
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {searchable && (
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                placeholder={searchPlaceholder}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActiveIndex(0)
                }}
                className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                role="searchbox"
                aria-controls={listboxId}
                aria-activedescendant={
                  activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
                }
              />
            </div>
          )}

          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            className="max-h-60 overflow-y-auto p-1"
            onScroll={handleScroll}
          >
            {displayed.length > 0 ? (
              <>
                {displayed.map((option, idx) => {
                  const selected = isSelected(option.value)
                  return (
                    <div
                      key={option.value}
                      id={`${listboxId}-opt-${idx}`}
                      data-idx={idx}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={option.disabled || undefined}
                      onClick={() => !option.disabled && select(option.value)}
                      onMouseEnter={() => !option.disabled && setActiveIndex(idx)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                        idx === activeIndex && "bg-accent text-accent-foreground",
                        selected && idx !== activeIndex && "bg-accent/50",
                        option.disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {/* 左钩布局：固定宽度的对钩槽位，未选中也占位 —— 各行文本对齐 */}
                      {checkAlign === "left" && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                          {selected && <Check className="h-4 w-4" />}
                        </span>
                      )}
                      <span className="flex flex-1 items-center gap-1.5 truncate">
                        {renderOption ? (
                          renderOption(option, selected)
                        ) : (
                          <>
                            {option.icon && <span className="inline-flex shrink-0">{option.icon}</span>}
                            <span className="truncate">{option.label}</span>
                          </>
                        )}
                      </span>
                      {checkAlign === "right" && selected && (
                        <Check className="h-4 w-4 shrink-0" />
                      )}
                    </div>
                  )
                })}

                {loading && (
                  <div className="px-2 py-1.5 text-center text-sm text-muted-foreground">
                    {loadingText}
                  </div>
                )}
                {isRemote && !hasMore && displayed.length > 1 && !query.trim() && (
                  <div className="px-2 py-1.5 text-center text-sm text-muted-foreground/60">
                    {noMoreText}
                  </div>
                )}
              </>
            ) : (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                {loading ? loadingText : emptyText}
              </div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
