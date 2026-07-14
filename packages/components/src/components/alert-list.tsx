'use client'

import React from 'react'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertSeverity = 'critical' | 'warning' | 'info'
export type AlertStatus = 'firing' | 'resolved'

export interface AlertLabels {
  namespace?: string
  pod?: string
  [key: string]: string | undefined
}

export interface AlertItem {
  id: string
  /** 告警标题 */
  title: string
  /** 严重级别 */
  severity: AlertSeverity
  /** 告警状态 */
  status: AlertStatus
  /** 描述信息 */
  description?: string
  /** 持续时长 */
  duration: string
  /** 严重级别文本 */
  severityText: string
  /** 告警标签 */
  labels: AlertLabels
}

export interface AlertListProps {
  alerts: AlertItem[]
  loading?: boolean
  error?: string | null
  className?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const severityColors = {
  critical: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    icon: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: 'text-blue-500',
  },
} as const

// ─── AlertRow ─────────────────────────────────────────────────────────────────

function AlertRow({ alert }: { alert: AlertItem }) {
  const colors = severityColors[alert.severity] ?? severityColors.info

  return (
    <div
      className={`border ${colors.border} ${colors.bg} rounded p-3 hover:shadow-sm transition-shadow`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className={`h-4 w-4 ${colors.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {/* Title + severity badge */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-sm font-medium ${colors.text} truncate`}>
              {alert.title}
            </h4>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border} flex-shrink-0`}
            >
              {alert.severityText}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {alert.description ?? '-'}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{alert.duration}</span>
            </div>
            {alert.labels.namespace && (
              <div className="flex items-center gap-1">
                <span className="font-medium">命名空间:</span>
                <span>{alert.labels.namespace}</span>
              </div>
            )}
            {alert.labels.pod && (
              <div className="flex items-center gap-1 truncate">
                <span className="font-medium">Pod:</span>
                <span className="truncate">{alert.labels.pod}</span>
              </div>
            )}
          </div>
        </div>

        {/* Firing indicator */}
        {alert.status === 'firing' && (
          <div
            className={`flex-shrink-0 h-2 w-2 rounded-full ${colors.icon} bg-current animate-pulse`}
          />
        )}
      </div>
    </div>
  )
}

// ─── AlertList ────────────────────────────────────────────────────────────────

/**
 * 告警列表组件
 *
 * 展示持续中的告警列表。属于 Layer 3 (@riseaicloud/components)，不直接调用 API。
 *
 * @example
 * ```tsx
 * import { AlertList } from '@riseaicloud/components'
 *
 * <AlertList alerts={firingAlerts} loading={isLoading} />
 * ```
 */
export function AlertList({ alerts, loading = false, error = null, className }: AlertListProps) {
  if (loading) {
    return (
      <div className={`p-4 text-center text-sm text-gray-500 ${className ?? ''}`}>
        加载中...
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 text-center text-sm text-red-600 ${className ?? ''}`}>
        {error}
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className={`p-8 text-center ${className ?? ''}`}>
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <p className="text-sm text-gray-600">暂无告警</p>
        <p className="text-xs text-gray-500 mt-1">所有服务运行正常</p>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      {alerts.map((alert) => (
        <AlertRow key={alert.id} alert={alert} />
      ))}
    </div>
  )
}

// ─── AlertListContainer ───────────────────────────────────────────────────────

export interface AlertListContainerProps {
  alerts: AlertItem[]
  loading?: boolean
  error?: string | null
  onRefresh?: () => void
  className?: string
}

/**
 * 带标题栏的告警列表容器组件
 *
 * @example
 * ```tsx
 * import { AlertListContainer } from '@riseaicloud/components'
 *
 * <AlertListContainer
 *   alerts={firingAlerts}
 *   loading={isLoading}
 *   onRefresh={refetch}
 * />
 * ```
 */
export function AlertListContainer({
  alerts,
  loading = false,
  error = null,
  onRefresh,
  className,
}: AlertListContainerProps) {
  return (
    <div className={`bg-white rounded border border-gray-200 ${className ?? ''}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-medium text-gray-900">告警列表</h3>
          {!loading && alerts.length > 0 && (
            <span className="text-xs text-gray-500">({alerts.length} 条持续中)</span>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            刷新
          </button>
        )}
      </div>

      {/* List */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <AlertList alerts={alerts} loading={loading} error={error} />
      </div>
    </div>
  )
}
