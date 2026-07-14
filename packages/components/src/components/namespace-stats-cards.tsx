'use client'

import React from 'react'
import { Folder, Package, Server, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@riseaicloud/ui'

export interface NamespaceItem {
  status?: string
  quotas?: {
    pods?: { used?: number }
    services?: { used?: number }
  }
}

export interface NamespaceStatsCardsProps {
  namespaces?: NamespaceItem[]
  loading?: boolean
  className?: string
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function computeStats(namespaces: NamespaceItem[]) {
  const totalNamespaces = namespaces.length
  const healthyNamespaces = namespaces.filter((ns) => ns.status === '活跃').length
  const totalPods = namespaces.reduce((sum, ns) => sum + (ns.quotas?.pods?.used ?? 0), 0)
  const totalServices = namespaces.reduce((sum, ns) => sum + (ns.quotas?.services?.used ?? 0), 0)
  const avgHealthPercentage =
    totalNamespaces > 0 ? Math.round((healthyNamespaces / totalNamespaces) * 100) : 0
  return { totalNamespaces, healthyNamespaces, totalPods, totalServices, avgHealthPercentage }
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * 命名空间统计卡片组件
 *
 * 展示命名空间列表的汇总统计信息（总数、健康数、容器组数、服务数）。
 * 属于 Layer 3 (@riseaicloud/components)，不直接调用 API，数据通过 props 传入。
 *
 * @example
 * ```tsx
 * import { NamespaceStatsCards } from '@riseaicloud/components'
 *
 * <NamespaceStatsCards namespaces={namespaceList} loading={isLoading} />
 * ```
 */
export function NamespaceStatsCards({
  namespaces = [],
  loading = false,
  className,
}: NamespaceStatsCardsProps) {
  const stats = React.useMemo(() => computeStats(namespaces), [namespaces])

  return (
    <Card className={`bg-white border border-gray-200 shadow-sm ${className ?? ''}`}>
      <CardContent className="p-4">
        <div className="text-sm grid grid-cols-4 gap-4">
          {/* 总项目数 */}
          <div className="flex items-center gap-4">
            <Folder className="h-8 w-8 text-gray-400" />
            <div>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-6 w-12 rounded mb-1" />
              ) : (
                <div className="font-medium text-gray-900">{stats.totalNamespaces}</div>
              )}
              <div className="text-gray-600">总项目</div>
            </div>
          </div>

          {/* 健康项目数 */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-600" />
            </div>
            <div>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-6 w-12 rounded mb-1" />
              ) : (
                <div className="font-medium text-green-600">{stats.healthyNamespaces}</div>
              )}
              <div className="text-gray-600">健康项目</div>
            </div>
          </div>

          {/* 总容器组数 */}
          <div className="flex items-center gap-4">
            <Package className="h-8 w-8 text-gray-400" />
            <div>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-6 w-16 rounded mb-1" />
              ) : (
                <div className="font-medium text-gray-900">{stats.totalPods}</div>
              )}
              <div className="text-gray-600">总容器组</div>
            </div>
          </div>

          {/* 总服务数 */}
          <div className="flex items-center gap-4">
            <Server className="h-8 w-8 text-gray-400" />
            <div>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-6 w-16 rounded mb-1" />
              ) : (
                <div className="font-medium text-gray-900">{stats.totalServices}</div>
              )}
              <div className="text-gray-600">总服务</div>
            </div>
          </div>
        </div>

        {/* 平均健康度 */}
        {!loading && stats.totalNamespaces > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">平均健康度</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      stats.avgHealthPercentage >= 90
                        ? 'bg-green-500'
                        : stats.avgHealthPercentage >= 70
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(stats.avgHealthPercentage, 100)}%` }}
                  />
                </div>
                <span
                  className={`font-medium ${
                    stats.avgHealthPercentage >= 90
                      ? 'text-green-600'
                      : stats.avgHealthPercentage >= 70
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {stats.avgHealthPercentage}%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Error variant ────────────────────────────────────────────────────────────

export function NamespaceStatsCardsError({ message }: { message?: string }) {
  return (
    <Card className="bg-red-50 border border-red-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm font-medium">
            {message ?? '项目监控数据获取失败'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
