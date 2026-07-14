'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

export type MetricFormat = 'number' | 'percentage' | 'bytes' | 'rate'

export interface MetricCardProps {
  icon: LucideIcon
  title: string
  value: number | string
  unit?: string
  /** 数值格式化方式 */
  format?: MetricFormat
  /** 趋势方向，影响数值颜色 */
  trend?: 'up' | 'down' | 'stable'
  isLoading?: boolean
  error?: boolean
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatValue(val: number | string, fmt: MetricFormat): string {
  if (typeof val === 'string') return val

  switch (fmt) {
    case 'percentage':
      return `${(val * 100).toFixed(1)}%`
    case 'bytes':
      if (val >= 1024 * 1024 * 1024) return `${(val / (1024 * 1024 * 1024)).toFixed(1)} GB`
      if (val >= 1024 * 1024) return `${(val / (1024 * 1024)).toFixed(1)} MB`
      if (val >= 1024) return `${(val / 1024).toFixed(1)} KB`
      return `${val} B`
    case 'rate':
      if (val >= 1024 * 1024) return `${(val / (1024 * 1024)).toFixed(1)} MB/s`
      if (val >= 1024) return `${(val / 1024).toFixed(1)} KB/s`
      return `${val} B/s`
    case 'number':
    default:
      return typeof val === 'number' ? val.toLocaleString() : String(val)
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * 监控指标展示卡片组件（K8s 感知）
 *
 * 用于显示集群、节点、工作负载等监控指标，支持多种数值格式化方式。
 * 属于 Layer 3 (@riseaicloud/components)，不直接调用 API。
 *
 * @example
 * ```tsx
 * import { MetricCard } from '@riseaicloud/components'
 * import { Cpu } from 'lucide-react'
 *
 * <MetricCard
 *   icon={Cpu}
 *   title="CPU 使用率"
 *   value={0.625}
 *   format="percentage"
 *   trend="stable"
 * />
 * ```
 */
export function MetricCard({
  icon: Icon,
  title,
  value,
  unit = '',
  format = 'number',
  trend,
  isLoading = false,
  error = false,
}: MetricCardProps) {
  const getValueColor = () => {
    if (error) return 'text-red-600'
    if (isLoading) return 'text-gray-400'
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      case 'stable':
      default:
        return 'text-gray-900'
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 h-6 w-16 rounded" />
        ) : error ? (
          <p className="text-lg font-semibold text-red-600">错误</p>
        ) : (
          <p className={`text-2xl font-semibold ${getValueColor()}`}>
            {formatValue(value, format)}
            {unit && !['percentage', 'bytes', 'rate'].includes(format) && (
              <span className="text-base text-gray-500 ml-1">{unit}</span>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
