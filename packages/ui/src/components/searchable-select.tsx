"use client"

import * as React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronDown, Check, X } from "lucide-react"
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
  /** Current selected value */
  value: string
  /** Callback when selection changes */
  onValueChange: (value: string) => void
  /** Options to display */
  options: T[]
  /** Placeholder text when nothing is selected */
  placeholder?: string
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Additional CSS classes */
  className?: string
  /** Whether options are loading */
  loading?: boolean
  /** Whether there are more items to load */
  hasMore?: boolean
  /** Show the search input. Set false for small fixed-enum selects (styled
   *  dropdown, no search box). Default true. */
  searchable?: boolean
  /** Disable the whole control. */
  disabled?: boolean
  /**
   * Custom local filter. Only used for LOCAL search (i.e. when `onSearch` is not
   * provided). Return true to keep the option for the given input.
   * Default: case-insensitive match on `label`.
   */
  filterOption?: (input: string, option: T) => boolean
  /** Callback when search query changes (debounced by parent). Providing this
   *  switches to REMOTE search — the parent returns the filtered `options`. */
  onSearch?: (query: string) => void
  /** Callback when scroll reaches bottom */
  onLoadMore?: () => void
  /** Custom render function for each option */
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode
  /** Whether to show a clear button */
  clearable?: boolean
  /** Text shown when no results found */
  emptyText?: string
  /** Text shown when loading */
  loadingText?: string
  /** Text shown when all items are loaded */
  noMoreText?: string
  /** Debounce delay in ms (default 300) */
  debounceMs?: number
  /** Callback when dropdown opens */
  onOpen?: () => void
  /** Width style */
  width?: string | number
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SearchableSelect<T extends SearchableSelectOption = SearchableSelectOption>({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
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
  emptyText = "No results found",
  loadingText = "Loading...",
  noMoreText = "No more data",
  debounceMs = 300,
  onOpen,
  width,
}: SearchableSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchMode, setIsSearchMode] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Debounced search
  useEffect(() => {
    if (!isOpen || !onSearch) return

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (isOpen) {
        onSearch(searchQuery.trim())
      }
    }, debounceMs)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery, isOpen, onSearch, debounceMs])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery("")
        setIsSearchMode(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Scroll to load more
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!onLoadMore || !hasMore || loading) return
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      if (scrollHeight - scrollTop <= clientHeight + 5) {
        onLoadMore()
      }
    },
    [hasMore, loading, onLoadMore]
  )

  const handleOpen = () => {
    if (disabled) return
    setIsOpen(true)
    onOpen?.()
  }

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue)
    setIsOpen(false)
    setSearchQuery("")
    setIsSearchMode(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSearchQuery("")
    onValueChange("")
    setIsOpen(true)
  }

  const selectedOption = options.find((opt) => opt.value === value)

  // Local filtering — only when NOT in remote mode (`onSearch` absent) and
  // search is enabled. Remote mode expects the parent to return filtered options.
  const isRemote = !!onSearch
  const displayedOptions = React.useMemo(() => {
    if (!searchable || isRemote || !searchQuery.trim()) return options
    const q = searchQuery.trim()
    const f = filterOption ?? ((input: string, opt: T) => opt.label.toLowerCase().includes(input.toLowerCase()))
    return options.filter((opt) => f(q, opt as T))
  }, [options, searchable, isRemote, searchQuery, filterOption])

  const getDisplayText = () => {
    if (selectedOption) return selectedOption.label
    return value || placeholder
  }
  const showClear = clearable && value && !disabled

  return (
    <div
      ref={dropdownRef}
      className={cn("relative", className)}
      style={width ? { width } : undefined}
    >
      {/* Trigger */}
      <div
        onClick={handleOpen}
        className={cn(
          "w-full min-w-[120px] h-8 px-3 text-sm border border-border rounded bg-background",
          "flex items-center justify-between",
          disabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:border-muted-foreground/50 focus:outline-none cursor-pointer"
        )}
      >
        {isOpen && searchable ? (
          <input
            ref={inputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsSearchMode(true)
            }}
            size={1}
            className="flex-1 min-w-0 outline-none bg-transparent text-sm"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className={cn(
              "truncate text-left flex-1 flex items-center gap-1.5",
              !value && "text-muted-foreground"
            )}
            title={getDisplayText()}
          >
            {selectedOption?.icon && <span className="shrink-0 inline-flex">{selectedOption.icon}</span>}
            {getDisplayText()}
          </span>
        )}

        <div className="flex items-center gap-1">
          {showClear && (
            <X
              className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
          <div
            ref={listRef}
            className="max-h-48 overflow-y-auto"
            onScroll={handleScroll}
          >
            {displayedOptions.length > 0 ? (
              <>
                {displayedOptions.map((option) => {
                  const isSelected = value === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={option.disabled}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      className={cn(
                        "w-full px-3 py-2 text-sm text-left hover:bg-accent",
                        "flex items-center justify-between gap-2",
                        isSelected && "bg-accent text-accent-foreground",
                        option.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                      )}
                    >
                      {renderOption ? (
                        renderOption(option as T, isSelected)
                      ) : (
                        <span className="truncate flex items-center gap-1.5">
                          {option.icon && <span className="shrink-0 inline-flex">{option.icon}</span>}
                          {option.label}
                        </span>
                      )}
                      {isSelected && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  )
                })}

                {loading && (
                  <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                    {loadingText}
                  </div>
                )}

                {isRemote && !hasMore && displayedOptions.length > 1 && !searchQuery.trim() && (
                  <div className="px-3 py-2 text-sm text-muted-foreground/60 text-center">
                    {noMoreText}
                  </div>
                )}
              </>
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                {loading ? loadingText : emptyText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
