'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '../utils'

export interface KPICardProps {
  /** 图标 */
  icon: LucideIcon
  /** 指标标题 */
  title: string
  /** 主要数值 */
  value: number | string
  /** 单位（可选） */
  unit?: string
  /** 变化趋势（可选） */
  trend?: {
    value: number
    isPositive: boolean
  }
  /** 图标背景色类名 */
  iconBgColor?: string
  /** 图标颜色类名 */
  iconColor?: string
  className?: string
}

/**
 * KPI 统计卡片组件
 *
 * 用于展示关键性能指标，支持趋势指示器。
 *
 * @example
 * ```tsx
 * import { KPICard } from '@riseaicloud/ui'
 * import { Activity } from 'lucide-react'
 *
 * <KPICard
 *   icon={Activity}
 *   title="活跃节点"
 *   value={42}
 *   trend={{ value: 5, isPositive: true }}
 * />
 * ```
 */
export function KPICard({
  icon: Icon,
  title,
  value,
  unit,
  trend,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  className,
}: KPICardProps) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded p-4', className)}>
      {/* Icon + Trend row */}
      <div className="flex items-center justify-between mb-3">
        <div className={cn('p-2 rounded', iconBgColor)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
        {trend && (
          <div
            className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
      </div>

      {/* Title */}
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  )
}
