"use client"

import * as React from "react"
import { SearchableSelect, SearchableSelectOption } from "@riseaicloud/ui"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NamespaceData {
  metadata: {
    name: string
    annotations?: Record<string, string>
  }
}

export interface NamespaceSelectorProps {
  /** Current selected namespace name */
  value: string
  /** Callback when selection changes */
  onValueChange: (value: string) => void
  /** Namespace data to display */
  namespaces: NamespaceData[]
  /** Whether data is loading */
  loading?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Additional CSS classes */
  className?: string
  /** Width of the selector */
  width?: string | number
  /** Whether to include "All Namespaces" option */
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

function namespacesToOptions(
  namespaces: NamespaceData[],
  includeAll: boolean
): SearchableSelectOption[] {
  const options: SearchableSelectOption[] = []

  if (includeAll) {
    options.push({ value: 'all', label: '所有命名空间' })
  }

  return options.concat(
    namespaces.map((namespace) => ({
      value: namespace.metadata.name,
      label: namespace.metadata.annotations?.['theriseunion.io/alias-name'] || namespace.metadata.name,
    }))
  )
}

function filterNamespaces(
  namespaces: NamespaceData[],
  query: string
): NamespaceData[] {
  if (!query.trim()) return namespaces

  const lowerQuery = query.toLowerCase()
  return namespaces.filter((namespace) => {
    const name = namespace.metadata.name.toLowerCase()
    const alias = (namespace.metadata.annotations?.['theriseunion.io/alias-name'] || '').toLowerCase()
    return name.includes(lowerQuery) || alias.includes(lowerQuery)
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NamespaceSelector({
  value,
  onValueChange,
  namespaces,
  loading = false,
  placeholder = "选择命名空间",
  className,
  width,
  includeAllOption = true,
  onSearch,
  onLoadMore,
  hasMore,
}: NamespaceSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  // Server-side mode: use namespaces directly (parent handles filtering)
  // Static mode: filter namespaces client-side
  const filteredNamespaces = React.useMemo(() => {
    if (onSearch) return namespaces
    return filterNamespaces(namespaces, searchQuery)
  }, [namespaces, searchQuery, onSearch])

  const options = React.useMemo(() => {
    return namespacesToOptions(filteredNamespaces, includeAllOption)
  }, [filteredNamespaces, includeAllOption])

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
      searchPlaceholder="搜索命名空间名称..."
      className={className}
      width={width}
      emptyText="未找到匹配的命名空间"
      loadingText="加载命名空间中..."
      clearable
    />
  )
}
