"use client"

import * as React from "react"
import { RotateCw, MoreHorizontal, Download, Columns, Search, X } from "lucide-react"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { Pagination } from "./pagination"
import { LoadingOverlay } from "./loading-overlay"
import { EmptyState } from "./empty-state"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "./dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"
import { cn } from "../utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchFilter {
  key: string
  value: string
}

export interface ColumnDef<T = any> {
  key: string
  title: string
  width?: number | string
  /**
   * Pin this column to the left or right edge — it stays visible while the table
   * scrolls horizontally. Pinned columns should set a numeric `width` so neighbouring
   * pinned columns can be offset correctly (falls back to 150px otherwise).
   */
  fixed?: 'left' | 'right'
  hide?: boolean
  className?: string
  render?: (row: T, index: number) => React.ReactNode
  exportFormatter?: (row: T) => string
  /** Enable this column in the built-in search bar. Default: false. */
  searchable?: boolean
  /** 'text' = free text input; 'select' = dropdown options. Default: 'text'. */
  searchType?: 'text' | 'select'
  /** Options for searchType='select'. */
  searchOptions?: { label: string; value: string }[]
}

export interface RowAction<T = any> {
  label: string
  danger?: boolean
  disabled?: boolean | ((row: T) => boolean)
  hidden?: boolean | ((row: T) => boolean)
  tooltip?: string | ((row: T) => string)
  onClick: (row: T, index: number) => void
}

export interface DeleteConfig<T = any> {
  rowKey?: string
  rowNameKey?: string
  confirmTitle?: string
  confirmText?: string | ((row: T) => string)
  onDelete: (row: T) => Promise<void>
  disabled?: (row: T) => boolean
  hidden?: (row: T) => boolean
  buttonText?: string
}

export interface ExportConfig<T = any> {
  filename?: string
  customExport?: (data: T[], visibleColumns: ColumnDef<T>[]) => string[][]
}

export interface BatchAction<T = any> {
  /** Static text, or a function of the current selection — use the function form to
   *  surface a live count, e.g. `(sel) => \`批量启用 (${sel.filter(...).length})\``. */
  label: string | ((selected: T[]) => string)
  disabled?: (selected: T[]) => boolean
  onClick: (selected: T[]) => void
}

export interface DataTableProps<T = any> {
  // ── Card title (optional) ──
  /** Section title rendered inside the card, above the toolbar (on white).
   *  Omit for an untitled table (default). */
  title?: string
  /** Optional node right-aligned in the title bar (e.g. a control or link).
   *  Only rendered when `title` is set. */
  titleExtra?: React.ReactNode

  // ── Data ──
  data: T[]
  loading?: boolean
  mode?: 'static' | 'remote'
  rowKey?: string

  // ── Columns ──
  columns: ColumnDef<T>[]

  // ── Pagination ──
  currentPage?: number
  pageSize?: number
  totalItems?: number
  pageSizes?: number[]
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void

  // ── Row actions ──
  rowActions?: RowAction<T>[] | ((row: T) => RowAction<T>[])
  collapsedActions?: boolean
  maxVisibleActions?: number
  deleteConfig?: DeleteConfig<T>
  actionsTitle?: string
  stickyActions?: boolean
  /** Width (px) of the actions column. Needed because table-layout:fixed can't size it to
   *  content; increase it for rows with several visible actions. Default 120. */
  actionsWidth?: number

  // ── Batch actions (shown left of toolbarLeft when rows are selected) ──
  batchActions?: BatchAction<T>[]

  // ── Toolbar slots ──
  // Rendered BEFORE the built-in search bar. For context filters that scope
  // the whole list (cluster / tenant selectors), which read left-to-right
  // ahead of search. Regular actions belong in toolbarLeft / toolbarRight.
  toolbarPrefix?: React.ReactNode
  toolbarLeft?: React.ReactNode
  toolbarRight?: React.ReactNode
  toolbarExtra?: React.ReactNode

  // ── Feature flags ──
  showRefresh?: boolean
  showColumnToggle?: boolean
  showSelection?: boolean
  /** Return false to make a row unselectable — its checkbox is disabled and
   *  it is excluded from select-all. Default: every row selectable. */
  isRowSelectable?: (row: T) => boolean
  exportConfig?: ExportConfig<T>

  // ── Callbacks ──
  onRefresh?: () => void
  onSelectionChange?: (rows: T[]) => void
  /** Called when search filters change (remote mode). */
  onSearch?: (filters: SearchFilter[]) => void

  // ── Empty state ──
  emptyText?: string

  // ── Style ──
  minWidth?: number
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveValue<T>(val: boolean | ((row: T) => boolean) | undefined, row: T): boolean {
  if (typeof val === 'function') return val(row)
  return val ?? false
}

function resolveString<T>(val: string | ((row: T) => string) | undefined, row: T): string | undefined {
  if (typeof val === 'function') return val(row)
  return val
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function extractText(node: React.ReactNode): string {
  if (node === null || node === undefined) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (typeof node === 'boolean') return ''
  if (Array.isArray(node)) return node.map(extractText).join(' ').trim()
  if (React.isValidElement(node)) return extractText((node.props as any).children)
  return ''
}

function cellText<T>(row: T, col: ColumnDef<T>, index = 0): string {
  if (col.exportFormatter) return col.exportFormatter(row)
  if (col.render) return extractText(col.render(row, index))
  const val = (row as any)[col.key]
  return val !== undefined && val !== null ? String(val) : ''
}

function downloadCSV(rows: string[][], filename: string) {
  const content = rows.map(row => row.map(escapeCSV).join(',')).join('\n')
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.style.visibility = 'hidden'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function matchesFilter<T>(row: T, col: ColumnDef<T>, value: string): boolean {
  const raw = cellText(row, col)
  if (col.searchType === 'select') return raw === value
  return raw.toLowerCase().includes(value.toLowerCase())
}

// Pinned-column geometry
const SELECTION_COL_WIDTH = 40 // matches the w-10 checkbox column
const FIXED_COL_FALLBACK_WIDTH = 150 // used when a pinned column omits a numeric width

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T = any>({
  data,
  loading = false,
  mode = 'remote',
  rowKey = 'name',
  columns,
  currentPage: externalPage,
  pageSize: externalPageSize,
  totalItems: externalTotal,
  pageSizes = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  rowActions,
  collapsedActions = true,
  maxVisibleActions = 1,
  deleteConfig,
  actionsTitle = '',
  stickyActions = true,
  actionsWidth = 120,
  batchActions,
  toolbarPrefix,
  toolbarLeft,
  toolbarRight,
  toolbarExtra,
  showRefresh = false,
  showColumnToggle = false,
  showSelection = false,
  isRowSelectable,
  exportConfig,
  onRefresh,
  onSelectionChange,
  onSearch,
  emptyText = '暂无数据',
  minWidth,
  className,
  title,
  titleExtra,
}: DataTableProps<T>) {

  // ── Search ──
  const searchableColumns = React.useMemo(() => columns.filter(c => c.searchable), [columns])
  const isSingleSearch = searchableColumns.length === 1
  const isMultiSearch = searchableColumns.length > 1

  // Single field: live text value
  const [singleValue, setSingleValue] = React.useState('')

  // Multi field: committed filters + pending input
  const [activeFilters, setActiveFilters] = React.useState<SearchFilter[]>([])
  const [pendingField, setPendingField] = React.useState<string>(() => searchableColumns[0]?.key ?? '')
  const [pendingValue, setPendingValue] = React.useState('')
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const searchContainerRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (!searchContainerRef.current?.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const pendingFieldDef = searchableColumns.find(c => c.key === pendingField)

  const commitFilter = (key: string, value: string) => {
    if (!key || !value) return
    const next = [...activeFilters.filter(f => f.key !== key), { key, value }]
    setActiveFilters(next)
    setPendingValue('')
    onSearch?.(next)
    // Synchronously move pendingField to first unfiltered column
    const filteredKeys = new Set(next.map(f => f.key))
    const nextField = searchableColumns.find(c => !filteredKeys.has(c.key))?.key
      ?? searchableColumns[0]?.key ?? ''
    if (nextField) setPendingField(nextField)
  }

  const removeFilter = (key: string) => {
    const next = activeFilters.filter(f => f.key !== key)
    setActiveFilters(next)
    onSearch?.(next)
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    onSearch?.([])
  }

  // Notify remote mode when single search changes
  React.useEffect(() => {
    if (!isSingleSearch || !onSearch) return
    onSearch(singleValue ? [{ key: searchableColumns[0].key, value: singleValue }] : [])
  }, [singleValue, isSingleSearch]) // eslint-disable-line

  // ── Internal pagination state (static mode) ──
  const [internalPage, setInternalPage] = React.useState(1)
  const [internalPageSize, setInternalPageSize] = React.useState(externalPageSize ?? 10)

  // Reset page when search changes
  React.useEffect(() => {
    if (mode === 'static') setInternalPage(1)
  }, [singleValue, activeFilters, mode])

  const currentPage = mode === 'static' ? internalPage : (externalPage ?? 1)
  const pageSize = mode === 'static' ? internalPageSize : (externalPageSize ?? 10)

  const handlePageChange = (page: number) => {
    if (mode === 'static') setInternalPage(page)
    onPageChange?.(page)
  }
  const handlePageSizeChange = (size: number) => {
    if (mode === 'static') { setInternalPageSize(size); setInternalPage(1) }
    onPageSizeChange?.(size)
  }

  // ── Static search filtering ──
  const filteredData = React.useMemo(() => {
    if (mode !== 'static') return data
    let result = data

    if (isSingleSearch && singleValue) {
      const col = searchableColumns[0]
      result = result.filter(row => matchesFilter(row, col, singleValue))
    } else if (isMultiSearch && activeFilters.length > 0) {
      result = result.filter(row =>
        activeFilters.every(f => {
          const col = searchableColumns.find(c => c.key === f.key)
          return col ? matchesFilter(row, col, f.value) : true
        })
      )
    }

    return result
  }, [data, mode, isSingleSearch, isMultiSearch, singleValue, activeFilters, searchableColumns])

  const totalItems = mode === 'static' ? filteredData.length : (externalTotal ?? 0)

  // ── Pagination slice ──
  const displayData = React.useMemo(() => {
    if (mode !== 'static') return data
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, data, mode, currentPage, pageSize])

  // ── Column visibility ──
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(
    () => new Set(columns.filter(c => c.hide).map(c => c.key))
  )
  const visibleColumns = React.useMemo(
    () => columns.filter(c => !hiddenColumns.has(c.key)),
    [columns, hiddenColumns]
  )
  const toggleColumn = (key: string) => {
    setHiddenColumns(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // ── Selection ──
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const getRowId = (row: T): string => String((row as any)[rowKey] ?? '')
  const canSelect = (row: T): boolean => isRowSelectable ? isRowSelectable(row) : true
  // Select-all only spans selectable rows; a page of all-unselectable rows shows an empty (not checked) header box.
  const selectableIds = React.useMemo(() => displayData.filter(canSelect).map(getRowId), [displayData, isRowSelectable])
  const allSelected = selectableIds.length > 0 && selectableIds.every(id => selected.has(id))
  const someSelected = selectableIds.some(id => selected.has(id)) && !allSelected

  const toggleAll = () => {
    const next = new Set(selected)
    if (allSelected) { selectableIds.forEach(id => next.delete(id)) }
    else { selectableIds.forEach(id => next.add(id)) }
    setSelected(next)
    onSelectionChange?.(data.filter(row => next.has(getRowId(row))))
  }

  const toggleRow = (row: T) => {
    if (!canSelect(row)) return
    const id = getRowId(row)
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
    onSelectionChange?.(data.filter(r => next.has(getRowId(r))))
  }

  const selectedRows = React.useMemo(
    () => data.filter(row => selected.has(getRowId(row))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, selected]
  )

  // ── Row actions ──
  const getActions = (row: T): RowAction<T>[] => {
    const base: RowAction<T>[] = typeof rowActions === 'function' ? rowActions(row) : (rowActions ?? [])
    const all = [...base]
    if (deleteConfig && !resolveValue(deleteConfig.hidden, row)) {
      all.push({
        label: deleteConfig.buttonText ?? '删除',
        danger: true,
        disabled: deleteConfig.disabled,
        onClick: () => { setDeleteTarget(row); setDeleteOpen(true) },
      })
    }
    return all.filter(a => !resolveValue(a.hidden, row))
  }

  const primaryActions = (row: T) => {
    const all = getActions(row)
    return collapsedActions ? all.slice(0, maxVisibleActions) : all
  }

  const moreActions = (row: T) => {
    if (!collapsedActions) return []
    return getActions(row).slice(maxVisibleActions)
  }

  // ── Delete dialog ──
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<T | null>(null)
  const [deleteLoading, setDeleteLoading] = React.useState(false)

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !deleteConfig) return
    setDeleteLoading(true)
    try {
      await deleteConfig.onDelete(deleteTarget)
      setDeleteOpen(false)
      setDeleteTarget(null)
      onRefresh?.()
    } finally {
      setDeleteLoading(false)
    }
  }

  const deleteItemName = deleteTarget
    ? String((deleteTarget as any)[deleteConfig?.rowNameKey ?? deleteConfig?.rowKey ?? rowKey] ?? '')
    : ''

  const deleteConfirmText = deleteTarget && deleteConfig?.confirmText
    ? resolveString(deleteConfig.confirmText, deleteTarget)
    : '删除后将无法恢复，请确认操作。'

  // ── Export ──
  const [exportLoading, setExportLoading] = React.useState(false)

  const handleExport = async () => {
    if (exportLoading) return
    setExportLoading(true)
    try {
      const exportData = mode === 'static' ? filteredData : displayData
      let rows: string[][]
      if (exportConfig?.customExport) {
        rows = exportConfig.customExport(exportData, columns)
      } else {
        const headers = columns.map(c => c.title)
        const body = exportData.map((row, i) =>
          columns.map(c => cellText(row, c, i))
        )
        rows = [headers, ...body]
      }
      downloadCSV(rows, exportConfig?.filename ?? 'export')
    } finally {
      setExportLoading(false)
    }
  }

  const showActionsColumn = data.some(row => getActions(row).length > 0)

  // ── Pinned (fixed left/right) columns ──
  const colWidthPx = (col: ColumnDef<T>) =>
    typeof col.width === 'number' ? col.width : FIXED_COL_FALLBACK_WIDTH

  const hasLeftFixed = visibleColumns.some(c => c.fixed === 'left')

  // Cumulative left/right sticky offsets per pinned column key.
  const pinnedOffsets = React.useMemo(() => {
    const map: Record<string, { side: 'left' | 'right'; offset: number }> = {}
    let leftAcc = showSelection ? SELECTION_COL_WIDTH : 0
    for (const col of visibleColumns) {
      if (col.fixed === 'left') {
        map[col.key] = { side: 'left', offset: leftAcc }
        leftAcc += colWidthPx(col)
      }
    }
    let rightAcc = showActionsColumn && stickyActions ? actionsWidth : 0
    for (let i = visibleColumns.length - 1; i >= 0; i--) {
      const col = visibleColumns[i]
      if (col.fixed === 'right') {
        map[col.key] = { side: 'right', offset: rightAcc }
        rightAcc += colWidthPx(col)
      }
    }
    return map
  }, [visibleColumns, showSelection, showActionsColumn, stickyActions, actionsWidth])

  // Style/class for a pinned cell (shared by header + body). `hover` picks the body
  // hover background so the sticky cell tracks the row highlight.
  const pinnedCellClass = (col: ColumnDef<T>, hover: boolean) => {
    const pin = pinnedOffsets[col.key]
    if (!pin) return ''
    return cn(
      'sticky bg-white z-10',
      hover && 'group-hover:bg-gray-50',
    )
  }
  const pinnedCellStyle = (col: ColumnDef<T>): React.CSSProperties => {
    const pin = pinnedOffsets[col.key]
    if (!pin) return {}
    return pin.side === 'left' ? { left: pin.offset } : { right: pin.offset }
  }

  // Floor width for the table (sum of column widths). With table-layout:fixed this makes the
  // overflow-x-auto wrapper scroll horizontally when the container is narrower than the total —
  // so explicit `width`s are honoured exactly and width-less columns keep their fallback width
  // instead of being squeezed until content wraps/overlaps.
  const tableMinWidth = React.useMemo(() => {
    let total = showSelection ? SELECTION_COL_WIDTH : 0
    for (const col of visibleColumns) total += colWidthPx(col)
    if (showActionsColumn) total += actionsWidth || FIXED_COL_FALLBACK_WIDTH
    return total
  }, [visibleColumns, showSelection, showActionsColumn, actionsWidth])

  const hasSearch = searchableColumns.length > 0
  const hasToolbar = !!(batchActions || toolbarPrefix || toolbarLeft || toolbarRight || toolbarExtra || showRefresh || showColumnToggle || exportConfig || hasSearch)

  // All searchable columns — re-selecting a field replaces its existing chip
  const availableFields = searchableColumns

  return (
    <TooltipProvider>
      <div className={cn("bg-white border border-gray-200 rounded shadow-sm overflow-hidden", className)}>

        {/* ── Card title (optional) ── */}
        {title && (
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-700">{title}</span>
            {titleExtra}
          </div>
        )}

        {/* ── Toolbar ── */}
        {hasToolbar && (
          <div style={{ backgroundColor: '#F9FBFD' }}>
            <div className="p-4 flex items-center gap-3">
              {/* Prefix slot — context filters (cluster / tenant), before search */}
              {toolbarPrefix && (
                <div className="flex items-center gap-3 flex-shrink-0">
                  {toolbarPrefix}
                </div>
              )}

              {/* Built-in search bar */}
              {hasSearch && (
                <div className="flex-1 min-w-0">
                  {isSingleSearch ? (
                    // ── Single field: live text search ──
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input
                        className="w-full h-8 pl-8 pr-7 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`搜索 ${searchableColumns[0].title}...`}
                        value={singleValue}
                        onChange={e => setSingleValue(e.target.value)}
                      />
                      {singleValue && (
                        <button
                          onClick={() => setSingleValue('')}
                          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    // ── Multi field: chip bar + custom dropdown panel ──
                    <div className="relative" ref={searchContainerRef}>
                      {/* Trigger bar */}
                      <div
                        className={cn(
                          "flex items-center flex-wrap gap-1 min-h-8 px-2 py-1 border rounded bg-white cursor-text",
                          dropdownOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"
                        )}
                        onClick={() => { setDropdownOpen(true); setTimeout(() => searchInputRef.current?.focus(), 0) }}
                      >
                        <Search className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />

                        {/* Active filter chips */}
                        {activeFilters.map(f => {
                          const col = searchableColumns.find(c => c.key === f.key)
                          const displayVal = col?.searchOptions?.find(o => o.value === f.value)?.label ?? f.value
                          return (
                            <span
                              key={f.key}
                              className="inline-flex items-center gap-1 h-5 px-1.5 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200 flex-shrink-0"
                            >
                              {col?.title}: {displayVal}
                              <button
                                onMouseDown={e => { e.stopPropagation(); removeFilter(f.key) }}
                                className="hover:text-blue-900"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          )
                        })}

                        {/* Placeholder */}
                        {activeFilters.length === 0 && (
                          <span className="text-xs text-gray-400">搜索...</span>
                        )}

                        {/* Clear all */}
                        {activeFilters.length > 0 && (
                          <button
                            onMouseDown={e => { e.stopPropagation(); clearAllFilters() }}
                            className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Dropdown panel */}
                      {dropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50">
                          {/* Field tabs */}
                          <div className="flex items-center gap-1 px-2 pt-2 pb-1.5 border-b border-gray-100 flex-wrap">
                            {searchableColumns.map(col => (
                              <button
                                key={col.key}
                                onMouseDown={e => { e.preventDefault(); setPendingField(col.key); setPendingValue(''); searchInputRef.current?.focus() }}
                                className={cn(
                                  "px-2 py-0.5 text-xs rounded border transition-colors",
                                  pendingField === col.key
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "text-gray-600 border-transparent hover:bg-gray-50"
                                )}
                              >
                                {col.title}
                                {activeFilters.find(f => f.key === col.key) && (
                                  <span className="ml-1 inline-block w-1.5 h-1.5 bg-blue-500 rounded-full align-middle" />
                                )}
                              </button>
                            ))}
                          </div>

                          {/* Value area */}
                          <div className="p-2">
                            {pendingFieldDef?.searchType === 'select' ? (
                              <div className="space-y-0.5 max-h-48 overflow-y-auto">
                                {pendingFieldDef.searchOptions?.map(o => (
                                  <button
                                    key={o.value}
                                    onMouseDown={() => { commitFilter(pendingField, o.value); setDropdownOpen(false) }}
                                    className={cn(
                                      "w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-50",
                                      activeFilters.find(f => f.key === pendingField && f.value === o.value)
                                        ? "text-blue-700 bg-blue-50"
                                        : "text-gray-700"
                                    )}
                                  >
                                    {o.label}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <input
                                ref={searchInputRef}
                                value={pendingValue}
                                onChange={e => setPendingValue(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && pendingValue.trim()) {
                                    commitFilter(pendingField, pendingValue.trim())
                                    setDropdownOpen(false)
                                  }
                                  if (e.key === 'Escape') setDropdownOpen(false)
                                  if (e.key === 'Backspace' && !pendingValue && activeFilters.length > 0) {
                                    removeFilter(activeFilters[activeFilters.length - 1].key)
                                  }
                                }}
                                placeholder={`输入${pendingFieldDef?.title ?? ''}，Enter 确认`}
                                className="w-full h-7 px-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                autoFocus
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Left slot — after search bar */}
              {toolbarLeft && (
                <div className="flex items-center gap-3 flex-shrink-0">
                  {toolbarLeft}
                </div>
              )}

              {/* Batch actions — after toolbarLeft, visible only when rows selected */}
              {batchActions && selected.size > 0 && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-500 whitespace-nowrap">已选 {selected.size} 项</span>
                  {batchActions.map((action, i) => {
                    const isDisabled = action.disabled?.(selectedRows) ?? false
                    return (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        disabled={isDisabled}
                        onClick={() => action.onClick(selectedRows)}
                      >
                        {typeof action.label === 'function' ? action.label(selectedRows) : action.label}
                      </Button>
                    )
                  })}
                </div>
              )}

              {/* Right system buttons — ml-auto keeps them pinned right even
                  when there is no flex-1 search bar to consume the space. */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                {showColumnToggle && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="列显隐">
                        <Columns className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {columns.map(col => (
                        <DropdownMenuCheckboxItem
                          key={col.key}
                          checked={!hiddenColumns.has(col.key)}
                          onCheckedChange={() => toggleColumn(col.key)}
                        >
                          {col.title}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {exportConfig && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="导出 CSV"
                    onClick={handleExport}
                    disabled={exportLoading}
                  >
                    <Download className={cn("h-4 w-4", exportLoading && "animate-pulse")} />
                  </Button>
                )}

                {showRefresh && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="刷新"
                    onClick={onRefresh}
                    disabled={loading}
                  >
                    <RotateCw className={cn("h-4 w-4", loading && "animate-spin")} />
                  </Button>
                )}

                {toolbarRight}
              </div>
            </div>

            {toolbarExtra && (
              <div className="px-4 pb-3">
                {toolbarExtra}
              </div>
            )}
          </div>
        )}

        {/* ── Table ── */}
        <div className="overflow-x-auto relative">
          <table
            className="w-full text-xs"
            style={{ tableLayout: 'fixed', minWidth: minWidth ?? tableMinWidth }}
          >
            <thead>
              <tr className="h-12 border-b border-gray-200 bg-white">
                {showSelection && (
                  <th className={cn("w-10 px-4", hasLeftFixed && "sticky left-0 bg-white z-10")}>
                    <Checkbox
                      checked={someSelected ? 'indeterminate' : allSelected}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                )}

                {visibleColumns.map(col => (
                  <th
                    key={col.key}
                    className={cn("px-3 text-left font-medium text-gray-700 whitespace-nowrap", pinnedCellClass(col, false))}
                    style={{
                      // table-layout:fixed needs every column to have a width, or width-less
                      // columns collapse and overlap in a horizontally-scrollable table.
                      // Explicit widths are used as-is; unsized columns fall back to 150px.
                      width: col.width ?? FIXED_COL_FALLBACK_WIDTH,
                      ...pinnedCellStyle(col),
                    }}
                  >
                    {col.title}
                  </th>
                ))}

                {showActionsColumn && (
                  <th
                    className={cn(
                      "px-3 text-left font-medium text-gray-700 whitespace-nowrap",
                      stickyActions && "sticky right-0 bg-white z-10 border-l border-gray-100"
                    )}
                    style={{ width: actionsWidth }}
                  >
                    {actionsTitle}
                  </th>
                )}
              </tr>
            </thead>

            <tbody className={loading ? 'opacity-60 pointer-events-none' : ''}>
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + (showSelection ? 1 : 0) + (showActionsColumn ? 1 : 0)}>
                    <EmptyState title={emptyText} loading={loading} />
                  </td>
                </tr>
              ) : displayData.map((row, index) => {
                const rowId = getRowId(row)
                const primary = primaryActions(row)
                const more = moreActions(row)

                return (
                  <tr key={rowId || index} className="h-12 border-b border-gray-100 hover:bg-gray-50 group">
                    {showSelection && (
                      <td className={cn("px-4", hasLeftFixed && "sticky left-0 bg-white z-10 group-hover:bg-gray-50")}>
                        <Checkbox
                          checked={selected.has(rowId)}
                          disabled={!canSelect(row)}
                          onCheckedChange={() => toggleRow(row)}
                        />
                      </td>
                    )}

                    {visibleColumns.map(col => (
                      <td
                        key={col.key}
                        className={cn("px-3 text-gray-700 overflow-hidden", pinnedCellClass(col, true), col.className)}
                        style={pinnedCellStyle(col)}
                      >
                        {col.render
                          ? col.render(row, index)
                          : ((row as any)[col.key] !== undefined && (row as any)[col.key] !== null)
                            ? String((row as any)[col.key])
                            : <span className="text-gray-400">-</span>
                        }
                      </td>
                    ))}

                    {showActionsColumn && (
                      <td
                        className={cn(
                          "px-3 group-hover:bg-gray-50",
                          stickyActions && "sticky right-0 bg-white z-10 border-l border-gray-100"
                        )}
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-start gap-1 whitespace-nowrap">
                          {primary.map((action, i) => {
                            const isDisabled = resolveValue(action.disabled, row)
                            const tip = resolveString(action.tooltip, row)
                            const btn = (
                              <button
                                key={i}
                                disabled={isDisabled}
                                onClick={() => !isDisabled && action.onClick(row, index)}
                                className={cn(
                                  "h-6 px-2 text-xs rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed",
                                  action.danger ? "text-red-600 hover:text-red-700" : "text-blue-600 hover:text-blue-700"
                                )}
                              >
                                {action.label}
                              </button>
                            )
                            if (tip) {
                              return (
                                <Tooltip key={i}>
                                  <TooltipTrigger asChild>{btn}</TooltipTrigger>
                                  <TooltipContent>{tip}</TooltipContent>
                                </Tooltip>
                              )
                            }
                            return btn
                          })}

                          {more.length > 0 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="h-6 w-6 p-0 inline-flex items-center justify-center rounded hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {more.map((action, i) => {
                                  const isDisabled = resolveValue(action.disabled, row)
                                  return (
                                    <React.Fragment key={i}>
                                      {action.danger && i > 0 && <DropdownMenuSeparator />}
                                      <DropdownMenuItem
                                        disabled={isDisabled}
                                        onClick={() => !isDisabled && action.onClick(row, index)}
                                        className={action.danger ? "text-red-600 focus:text-red-600" : ""}
                                      >
                                        {action.label}
                                      </DropdownMenuItem>
                                    </React.Fragment>
                                  )
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>

          <LoadingOverlay loading={loading} />
        </div>

        {/* ── Pagination ── */}
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          pageSizeOptions={pageSizes}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {deleteConfig && (
        <ConfirmDeleteDialog
          open={deleteOpen}
          onOpenChange={open => { setDeleteOpen(open); if (!open) setDeleteTarget(null) }}
          title={deleteConfig.confirmTitle ?? '确认删除'}
          description={deleteConfirmText ?? '删除后将无法恢复，请确认操作。'}
          itemNames={deleteItemName ? [deleteItemName] : []}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
        />
      )}
    </TooltipProvider>
  )
}
