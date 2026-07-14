'use client'

import React from 'react'
import { EventsTable } from './events-table'
import type { EventInfo } from './events-table'

export type { EventInfo }

export interface EventsViewerProps {
  /** 事件列表 */
  events: EventInfo[]
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  emptyDescription?: string
  className?: string
}

/**
 * K8s 事件查看组件（无 API 感知）
 *
 * 对 EventsTable 的薄包装，提供与 edge-console 中 EventsViewer 一致的接口。
 * 属于 Layer 3 (@riseaicloud/components)，不直接调用 API，数据通过 props 传入。
 *
 * @example
 * ```tsx
 * import { EventsViewer } from '@riseaicloud/components'
 *
 * <EventsViewer
 *   events={events}
 *   loading={isLoading}
 *   error={error}
 *   emptyMessage="暂无事件"
 * />
 * ```
 */
export function EventsViewer({
  events,
  loading = false,
  error = null,
  emptyMessage = '暂无事件',
  emptyDescription = '该资源暂未产生任何事件',
  className,
}: EventsViewerProps) {
  return (
    <EventsTable
      events={events}
      loading={loading}
      error={error}
      emptyMessage={emptyMessage}
      emptyDescription={emptyDescription}
      className={className}
    />
  )
}
