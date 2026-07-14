"use client"

import React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, cn } from "@riseaicloud/ui"
import type { ChartConfig } from "@riseaicloud/ui"

// ==================== Types ====================

export interface DataPoint {
  time: number
  value: number
}

export interface MonitoringChartConfig {
  label: string
  color?: string
  unit?: string
  formatTooltip?: (value: number, timestamp: number) => React.ReactNode
}

export interface MonitoringChartProps {
  title: string
  icon: React.ReactNode
  currentValue: string
  data: DataPoint[]
  config: MonitoringChartConfig
  expanded: boolean
  onToggle: () => void
  timeRange?: string
  height?: number
  loading?: boolean
  className?: string
}

// ==================== Constants ====================

export const DEFAULT_MONITORING_COLOR = '#059669'

// ==================== Utilities ====================

export const formatTime = (timestamp: number, timeRange: string = '24h'): string => {
  const realTimestamp = timestamp < 10000000000 ? timestamp * 1000 : timestamp
  const date = new Date(realTimestamp)

  if (timeRange === '7d') {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const defaultTickFormatter = (value: any): string => {
  let timestamp = value
  if (typeof value === 'string') {
    timestamp = parseInt(value)
  }

  if (timestamp < 10000000000) {
    timestamp = timestamp * 1000
  }

  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    return value.toString()
  }

  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const defaultYTickFormatter = (value: number): string => {
  return Number(value).toFixed(2)
}

const defaultTooltipContent = (
  config: MonitoringChartConfig,
  timeRange: string
) => {
  const TooltipComponent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value as number
      const timestamp = typeof label === 'string' ? parseInt(label) : label
      const timeStr = formatTime(timestamp, timeRange)

      return (
        <div style={{
          backgroundColor: '#374151',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          color: 'white'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{timeStr}</div>
          {config.formatTooltip ? (
            config.formatTooltip(value, timestamp)
          ) : (
            <div>{config.label}: {value.toFixed(2)}{config.unit || ''}</div>
          )}
        </div>
      )
    }
    return null
  }

  TooltipComponent.displayName = 'TooltipComponent'
  return TooltipComponent
}

// ==================== Component ====================

export function MonitoringChart({
  title,
  icon,
  currentValue,
  data,
  config,
  expanded,
  onToggle,
  timeRange = '24h',
  height = 200,
  loading = false,
  className
}: MonitoringChartProps) {
  const chartColor = config.color || DEFAULT_MONITORING_COLOR

  const chartConfig: ChartConfig = {
    value: {
      label: config.label,
      color: chartColor,
    },
  }

  return (
    <div className={cn("bg-white rounded border border-gray-200", className)}>
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
        style={{backgroundColor: expanded ? '#F9FBFD' : 'white'}}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <span className="text-xs text-gray-500">当前: {currentValue}</span>
          {loading && (
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-gray-600"></div>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4" style={{backgroundColor: 'white'}}>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={height}>
              <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                  left: 12,
                  right: 12,
                  top: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  tickFormatter={defaultTickFormatter}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, 'dataMax']}
                  type="number"
                  tickCount={6}
                  tickFormatter={defaultYTickFormatter}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={defaultTooltipContent(config, timeRange)}
                />
                <Area
                  dataKey="value"
                  type="monotone"
                  fill={chartColor}
                  fillOpacity={0.1}
                  stroke={chartColor}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </div>
  )
}
