'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart'
import type { ChartConfig } from './chart'
import { cn } from '../utils'

export interface ResourceChartDataPoint {
  /** 时间戳或时间标签 */
  time: string | number
  /** 数值 */
  value: number
}

export interface ResourceChartProps {
  /** 图表标题 */
  title: string
  /** 当前使用值（带单位字符串） */
  currentValue: string
  /** 使用百分比 */
  percentage: number
  /** 时间序列数据 */
  timeSeries: ResourceChartDataPoint[]
  /** 图表主题色 */
  color?: string
  /** 数值单位（如 %、GB） */
  unit?: string
  /** 是否显示网格 */
  showGrid?: boolean
  className?: string
}

/**
 * 资源使用率图表组件
 *
 * 用于展示 CPU、内存、磁盘等资源的时间序列使用情况，
 * 包含进度条和面积图。
 *
 * @example
 * ```tsx
 * import { ResourceChart } from '@riseaicloud/ui'
 *
 * <ResourceChart
 *   title="CPU 使用率"
 *   currentValue="2.4 cores"
 *   percentage={62.5}
 *   timeSeries={cpuTimeSeries}
 *   color="#3b82f6"
 *   unit="%"
 * />
 * ```
 */
export function ResourceChart({
  title,
  currentValue,
  percentage,
  timeSeries,
  color = '#3b82f6',
  unit = '%',
  showGrid = true,
  className,
}: ResourceChartProps) {
  const chartConfig: ChartConfig = {
    value: {
      label: title,
      color,
    },
  }

  return (
    <div className={cn('bg-white border border-gray-200 rounded p-4', className)}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          <div className="text-right">
            <span className="text-2xl font-semibold text-gray-900">
              {percentage.toFixed(1)}{unit}
            </span>
            <div className="text-xs text-gray-500 mt-1">{currentValue}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              percentage > 80
                ? 'bg-red-500'
                : percentage > 60
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={timeSeries}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
            )}
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(v) => `${v}${unit}`}
            />
            <ChartTooltip>
              <ChartTooltipContent
                formatter={(value) => `${Number(value).toFixed(2)}${unit}`}
              />
            </ChartTooltip>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
