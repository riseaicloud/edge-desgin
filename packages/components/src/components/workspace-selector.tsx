"use client"

import * as React from "react"
import { SearchableSelect, SearchableSelectOption } from "@riseaicloud/ui"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WorkspaceData {
  metadata: {
    name: string
    annotations?: Record<string, string>
  }
}

export interface WorkspaceSelectorProps {
  /** Current selected workspace name */
  value: string
  /** Callback when selection changes */
  onValueChange: (value: string) => void
  /** Workspace data to display */
  workspaces: WorkspaceData[]
  /** Whether data is loading */
  loading?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Additional CSS classes */
  className?: string
  /** Width of the selector */
  width?: string | number
  /** Whether to include "All Workspaces" option */
  includeAllOption?: boolean
  // ── Server-side pagination (optional) ────────────────────────────────────
  /** Server-side search callback. When provided, client-side filtering is disabled. */
  onSearch?: (query: string) => void
  /** Server-side load-more callback */
  onLoadMore?: () => void
  /** Whether there are more items to load server-side */
  hasMore?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function workspacesToOptions(
  workspaces: WorkspaceData[],
  includeAll: boolean
): SearchableSelectOption[] {
  const options: SearchableSelectOption[] = []

  if (includeAll) {
    options.push({ value: 'all', label: '所有工作空间' })
  }

  return options.concat(
    workspaces.map((workspace) => ({
      value: workspace.metadata.name,
      label: workspace.metadata.annotations?.['theriseunion.io/alias-name'] || workspace.metadata.name,
    }))
  )
}

function filterWorkspaces(
  workspaces: WorkspaceData[],
  query: string
): WorkspaceData[] {
  if (!query.trim()) return workspaces

  const lowerQuery = query.toLowerCase()
  return workspaces.filter((workspace) => {
    const name = workspace.metadata.name.toLowerCase()
    const alias = (workspace.metadata.annotations?.['theriseunion.io/alias-name'] || '').toLowerCase()
    return name.includes(lowerQuery) || alias.includes(lowerQuery)
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export function WorkspaceSelector({
  value,
  onValueChange,
  workspaces,
  loading = false,
  placeholder = "选择工作空间",
  className,
  width,
  includeAllOption = true,
  onSearch,
  onLoadMore,
  hasMore,
}: WorkspaceSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  // Server-side mode: use workspaces directly (parent handles filtering)
  // Static mode: filter workspaces client-side
  const filteredWorkspaces = React.useMemo(() => {
    if (onSearch) return workspaces
    return filterWorkspaces(workspaces, searchQuery)
  }, [workspaces, searchQuery, onSearch])

  const options = React.useMemo(() => {
    return workspacesToOptions(filteredWorkspaces, includeAllOption)
  }, [filteredWorkspaces, includeAllOption])

  const handleLocalSearch = React.useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return (
    <SearchableSelect
      value={value}
      onValueChange={onValueChange}
      options={options}
      onSearch={onSearch ?? handleLocalSearch}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      loading={loading}
      placeholder={placeholder}
      searchPlaceholder="搜索工作空间名称..."
      className={className}
      width={width}
      emptyText="未找到匹配的工作空间"
      loadingText="加载工作空间中..."
      clearable
    />
  )
}
