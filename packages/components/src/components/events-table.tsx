'use client'

import React from 'react'
import { Info, AlertTriangle, X } from 'lucide-react'
import { EmptyState, LoadingOverlay, cn } from '@riseaicloud/ui'

export interface EventInfo {
  id?: number | string
  /** 事件类型: Normal | Warning | Error */
  type: string
  /** 事件原因 */
  reason: string
  /** 事件消息 */
  message: string
  /** 最后发生时间（ISO 字符串） */
  timestamp: string
  /** 发生次数 */
  count: number
  /** 来源组件 */
  source: string
}

export interface EventsTableProps {
  events: EventInfo[]
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  emptyDescription?: string
  className?: string
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function getEventIcon(type: string) {
  switch (type) {
    case 'Normal':
      return <Info className="h-4 w-4 text-green-500" />
    case 'Warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'Error':
      return <X className="h-4 w-4 text-red-500" />
    default:
      return <Info className="h-4 w-4 text-gray-500" />
  }
}

function getEventTypeColor(type: string) {
  switch (type) {
    case 'Normal':
      return 'text-green-600'
    case 'Warning':
      return 'text-yellow-600'
    case 'Error':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

function getEventTypeLabel(type: string) {
  switch (type) {
    case 'Normal':
      return '正常'
    case 'Warning':
      return '警告'
    case 'Error':
      return '错误'
    default:
      return type
  }
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  if (diffMinutes > 0) return `${diffMinutes}m ago`
  return '刚刚'
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * 标准事件列表组件（Layer 3 - 知道 K8s 事件概念）
 *
 * 用于展示 Kubernetes 资源的事件信息，支持加载状态、错误状态和空状态展示。
 * 属于 @riseaicloud/components，因为它理解 K8s 事件类型（Normal/Warning/Error）。
 *
 * @example
 * ```tsx
 * import { EventsTable } from '@riseaicloud/components'
 *
 * <EventsTable
 *   events={eventsList}
 *   loading={isLoading}
 *   error={errorMessage}
 *   emptyMessage="暂无事件"
 * />
 * ```
 */
export function EventsTable({
  events,
  loading = false,
  error = null,
  emptyMessage = '暂无事件',
  emptyDescription = '该资源暂未产生任何事件',
  className,
}: EventsTableProps) {
  if (error) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4" style={{ backgroundColor: '#F9FBFD' }}>
          <div className="text-sm text-gray-600">共 {events.length} 个事件</div>
        </div>

        {/* Table */}
        <div className="relative">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-white h-12">
                <th className="text-left px-4 font-medium text-gray-700 w-28">类型</th>
                <th className="text-left px-4 font-medium text-gray-700 w-40">原因</th>
                <th className="text-left px-4 font-medium text-gray-700 w-48">发生时间</th>
                <th className="text-left px-4 font-medium text-gray-700 w-40">来源</th>
                <th className="text-left px-4 font-medium text-gray-700">消息</th>
              </tr>
            </thead>
            <tbody className={loading ? 'opacity-60 pointer-events-none' : ''}>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4">
                    <EmptyState loading={loading} title={emptyMessage} />
                  </td>
                </tr>
              ) : (
                events.map((event, index) => (
                  <tr
                    key={event.id ?? index}
                    className="border-b border-gray-100 hover:bg-gray-50 h-12"
                  >
                    <td className="px-4">
                      <div className="flex items-center space-x-2">
                        {getEventIcon(event.type)}
                        <span className={getEventTypeColor(event.type)}>
                          {getEventTypeLabel(event.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4">
                      <span className="font-medium text-gray-900">{event.reason}</span>
                    </td>
                    <td className="px-4">
                      <div className="space-y-1">
                        <span className="text-gray-900">{formatTime(event.timestamp)}</span>
                        {event.count > 1 && (
                          <div className="text-xs text-gray-500">
                            （近 7 天发生 {event.count} 次）
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4">
                      <span className="text-gray-900">{event.source}</span>
                    </td>
                    <td className="px-4">
                      <span className="text-gray-900">{event.message}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <LoadingOverlay loading={loading} />
        </div>
      </div>
    </div>
  )
}
