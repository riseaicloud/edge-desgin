"use client"

import * as React from "react"
import { SearchableSelect, SearchableSelectOption } from "@riseaicloud/ui"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ClusterData {
  metadata: {
    name: string
    annotations?: {
      'theriseunion.io/alias-name'?: string
    }
  }
}

export interface ClusterSelectorProps {
  /** Current selected cluster name */
  value: string
  /** Callback when selection changes */
  onValueChange: (value: string) => void
  /** Cluster data to display */
  clusters: ClusterData[]
  /** Whether data is loading */
  loading?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Additional CSS classes */
  className?: string
  /** Width of the selector */
  width?: string | number
  /** Whether to include "All Clusters" option */
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

function getClusterAlias(cluster: ClusterData): string {
  return (
    cluster.metadata.annotations?.['theriseunion.io/alias-name'] ||
    cluster.metadata.name
  )
}

function clustersToOptions(
  clusters: ClusterData[],
  includeAll: boolean
): SearchableSelectOption[] {
  const options: SearchableSelectOption[] = []

  if (includeAll) {
    options.push({ value: 'all', label: '所有集群' })
  }

  return options.concat(
    clusters.map((cluster) => ({
      value: cluster.metadata.name,
      label: getClusterAlias(cluster),
    }))
  )
}

function filterClusters(
  clusters: ClusterData[],
  query: string
): ClusterData[] {
  if (!query.trim()) return clusters

  const lowerQuery = query.toLowerCase()
  return clusters.filter((cluster) => {
    const name = cluster.metadata.name.toLowerCase()
    const alias = getClusterAlias(cluster).toLowerCase()
    return name.includes(lowerQuery) || alias.includes(lowerQuery)
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ClusterSelector({
  value,
  onValueChange,
  clusters,
  loading = false,
  placeholder = "选择集群",
  className,
  width,
  includeAllOption = true,
  onSearch,
  onLoadMore,
  hasMore,
}: ClusterSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  // Server-side mode: use clusters directly (parent handles filtering)
  // Static mode: filter clusters client-side
  const filteredClusters = React.useMemo(() => {
    if (onSearch) return clusters
    return filterClusters(clusters, searchQuery)
  }, [clusters, searchQuery, onSearch])

  const options = React.useMemo(() => {
    return clustersToOptions(filteredClusters, includeAllOption)
  }, [filteredClusters, includeAllOption])

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
      searchPlaceholder="搜索集群名称或别名..."
      className={className}
      width={width}
      emptyText="未找到匹配的集群"
      loadingText="加载集群中..."
      clearable
    />
  )
}
