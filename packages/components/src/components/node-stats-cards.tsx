'use client'

import React from 'react'
import { Server, Cpu, MemoryStick, Activity, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@riseaicloud/ui'

export interface NodeStats {
  totalNodes: number
  readyNodes: number
  avgCpuUsage: number
  avgMemoryUsage: number
}

export interface NodeStatsCardsProps {
  stats?: NodeStats | null
  loading?: boolean
  error?: boolean
  className?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * 节点统计卡片组件
 *
 * 展示节点概览统计信息（总节点数、就绪节点数、平均 CPU、平均内存）。
 * 属于 Layer 3 (@riseaicloud/components)，不直接调用 API，数据通过 props 传入。
 *
 * @example
 * ```tsx
 * import { NodeStatsCards } from '@riseaicloud/components'
 *
 * <NodeStatsCards stats={nodeStats} loading={isLoading} />
 * ```
 */
export function NodeStatsCards({
  stats,
  loading = false,
  error = false,
  className,
}: NodeStatsCardsProps) {
  if (error) {
    return (
      <Card className="bg-red-50 border border-red-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <Activity className="h-5 w-5" />
            <span className="text-sm font-medium">节点监控数据获取失败</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-white border border-gray-200 shadow-sm ${className ?? ''}`}>
      <CardContent className="p-4">
        <div className="text-sm grid grid-cols-4 gap-4">
          {/* 总节点数 */}
          <div className="flex items-center gap-4">
            <Server className="h-8 w-8 text-gray-400" />
            <div>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-6 w-12 rounded mb-1" />
              ) : (
                <div className="font-medium text-gray-900">{stats?.totalNodes ?? 0}</div>
              )}
              <div className="text-gray-600">总节点</div>
            </div>
          </div>

          {/* 就绪节点数 */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-600" />
            </div>
            <div>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-6 w-12 rounded mb-1" />
              ) : (
                <div className="font-medium text-green-600">{stats?.readyNodes ?? 0}</div>
              )}
              <div className="text-gray-600">就绪节点</div>
            </div>
          </div>

          {/* 平均 CPU 使用率 */}
          <div className="flex items-center gap-4">
            <Cpu className="h-8 w-8 text-gray-400" />
            <div>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-6 w-16 rounded mb-1" />
              ) : (
                <div className="font-medium text-gray-900">
                  {stats ? `${stats.avgCpuUsage.toFixed(1)}%` : '0%'}
                </div>
              )}
              <div className="text-gray-600">平均 CPU</div>
            </div>
          </div>

          {/* 平均内存使用率 */}
          <div className="flex items-center gap-4">
            <MemoryStick className="h-8 w-8 text-gray-400" />
            <div>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-6 w-16 rounded mb-1" />
              ) : (
                <div className="font-medium text-gray-900">
                  {stats ? `${stats.avgMemoryUsage.toFixed(1)}%` : '0%'}
                </div>
              )}
              <div className="text-gray-600">平均内存</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
