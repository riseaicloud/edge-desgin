"use client"

// ResourceNameCell —— 表格「名称 + ID + 复制」单元格（CAMP 实例/容器列表首列
// 同款：可选图标 + 名称行 + 截断的 ID 行 + 一键复制）。组合封装：CopyButton。
//
// 中性纪律：name/id/icon 都是数据形状，点击跳转由 onNameClick 回调交还消费方
// （路由是业务概念）；「显示别名(原名)」之类的拼装规则也归消费方。

import * as React from "react"
import { cn } from "../utils"
import { CopyButton } from "./copy-button"

export interface ResourceNameCellProps {
  name: React.ReactNode
  /** 第二行的 ID/标识；省略则只显示名称行 */
  id?: string
  /** 左侧图标（尺寸由调用方控制，常用 h-5 w-5 ~ h-8 w-8） */
  icon?: React.ReactNode
  /**
   * ID 行点击（详情跳转的**默认通道**——CAMP 惯例是点 ID 进详情）。
   * 提供后 ID 渲染为链接样式。
   */
  onIdClick?: () => void
  /** 名称行点击（备用通道；与 onIdClick 二选一或并存均可） */
  onNameClick?: () => void
  /** ID 行是否带复制按钮。默认 true */
  copyable?: boolean
  className?: string
}

export function ResourceNameCell({
  name,
  id,
  icon,
  onIdClick,
  onNameClick,
  copyable = true,
  className,
}: ResourceNameCellProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      <div className="min-w-0 flex-1">
        {onNameClick ? (
          <button
            type="button"
            onClick={onNameClick}
            className="block max-w-full truncate text-sm font-medium text-primary hover:underline"
          >
            {name}
          </button>
        ) : (
          <div className="truncate text-sm font-medium text-foreground">{name}</div>
        )}
        {id && (
          <div className="mt-0.5 flex items-center gap-1">
            {onIdClick ? (
              // 可点击但保持 muted 灰（CAMP 惯例：ID 视觉上不做成链接色），
              // 悬停加深 + 下划线给出可点暗示
              <button
                type="button"
                onClick={onIdClick}
                title={id}
                className="truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                {id}
              </button>
            ) : (
              <span className="truncate text-xs text-muted-foreground" title={id}>
                {id}
              </span>
            )}
            {copyable && <CopyButton text={id} />}
          </div>
        )}
      </div>
    </div>
  )
}
