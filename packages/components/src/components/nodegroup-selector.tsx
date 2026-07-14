"use client"

import * as React from "react"
import { SearchableSelect, SearchableSelectOption } from "@riseaicloud/ui"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NodeGroupData {
  metadata: {
    name: string
    annotations?: Record<string, string>
  }
}

export interface NodeGroupSelectorProps {
  /** Current selected node group name */
  value: string
  /** Callback when selection changes */
  onValueChange: (value: string) => void
  /** Node group data to display */
  nodeGroups: NodeGroupData[]
  /** Whether data is loading */
  loading?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Additional CSS classes */
  className?: string
  /** Width of the selector */
  width?: string | number
  /** Whether to include "All Node Groups" option */
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

function nodeGroupsToOptions(
  nodeGroups: NodeGroupData[],
  includeAll: boolean
): SearchableSelectOption[] {
  const options: SearchableSelectOption[] = []

  if (includeAll) {
    options.push({ value: 'all', label: '所有节点组' })
  }

  return options.concat(
    nodeGroups.map((nodeGroup) => ({
      value: nodeGroup.metadata.name,
      label: nodeGroup.metadata.name,
    }))
  )
}

function filterNodeGroups(
  nodeGroups: NodeGroupData[],
  query: string
): NodeGroupData[] {
  if (!query.trim()) return nodeGroups

  const lowerQuery = query.toLowerCase()
  return nodeGroups.filter((nodeGroup) => {
    const name = nodeGroup.metadata.name.toLowerCase()
    return name.includes(lowerQuery)
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NodeGroupSelector({
  value,
  onValueChange,
  nodeGroups,
  loading = false,
  placeholder = "选择节点组",
  className,
  width,
  includeAllOption = true,
}: NodeGroupSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter node groups based on search query
  const filteredNodeGroups = React.useMemo(() => {
    return filterNodeGroups(nodeGroups, searchQuery)
  }, [nodeGroups, searchQuery])

  // Convert to options
  const options = React.useMemo(() => {
    return nodeGroupsToOptions(filteredNodeGroups, includeAllOption)
  }, [filteredNodeGroups, includeAllOption])

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return (
    <SearchableSelect
      value={value}
      onValueChange={onValueChange}
      options={options}
      onSearch={handleSearch}
      loading={loading}
      placeholder={placeholder}
      searchPlaceholder="搜索节点组名称..."
      className={className}
      width={width}
      emptyText="未找到匹配的节点组"
      loadingText="加载节点组中..."
      clearable
    />
  )
}
