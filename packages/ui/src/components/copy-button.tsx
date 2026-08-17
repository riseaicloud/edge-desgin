"use client"

// CopyButton —— 一键复制小按钮（复制成功切换 ✓ 反馈 1.5s）。
// navigator.clipboard 仅存在于安全上下文（HTTPS/localhost）——平台存在 HTTP
// 部署面（NodePort 直连），必须带 execCommand 兜底，与 SDK generateUUID 同一坑。

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import { cn } from "../utils"

async function copyText(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  // HTTP 兜底：隐藏 textarea + execCommand
  const ta = document.createElement("textarea")
  ta.value = text
  ta.style.position = "fixed"
  ta.style.opacity = "0"
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand("copy")
  } finally {
    document.body.removeChild(ta)
  }
}

export interface CopyButtonProps {
  /** 要复制的文本 */
  text: string
  className?: string
  "aria-label"?: string
}

export function CopyButton({
  text,
  className,
  "aria-label": ariaLabel = "复制",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleCopy = async (e: React.MouseEvent) => {
    // 表格行常挂整行点击跳转，复制不应触发它
    e.stopPropagation()
    await copyText(text)
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm p-0.5",
        "text-muted-foreground transition-colors hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}
