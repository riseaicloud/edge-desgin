"use client"

// CodeEditor —— 内嵌式代码编辑器（表单字段级），对齐 CAMP `lumi-code-mirror-ide`
// 的生态位（启动命令、脚本、JSON/YAML 片段编辑）。
//
// 底座选 monaco 不选 CodeMirror：@monaco-editor/react 已是本包依赖
// （YamlEditDialog 在用），一包不养两个编辑器引擎。与 YamlEditDialog 的分工：
// 那是「全屏弹窗 + YAML 校验」的组合封装，本组件是可嵌进任意表单的中性字段。
//
// monaco 经 React.lazy 动态加载（同 yaml-edit-dialog 的手法）：不消费本组件的
// 打包姿势不背 monaco wrapper；编辑器本体运行时按需加载。
//
// 「每行一条命令」这类业务语义（提示、按行解析）归消费方，本组件只收中性能力。

import * as React from "react"
import { cn } from "../utils"

const Editor = React.lazy(() => import("@monaco-editor/react"))

export interface CodeEditorProps {
  value?: string
  onChange?: (value: string) => void
  /** monaco 语言 id：shell / yaml / json / dockerfile / plaintext … 默认 shell */
  language?: string
  readOnly?: boolean
  /** 数字按 px 处理。默认 160 */
  height?: string | number
  /** 深色是终端/命令场景的惯例默认；浅色用于与表单融合的场景 */
  theme?: "dark" | "light"
  /** 空值时的占位提示（monaco 无原生 placeholder，覆盖层实现） */
  placeholder?: string
  className?: string
}

export function CodeEditor({
  value = "",
  onChange,
  language = "shell",
  readOnly = false,
  height = 160,
  theme = "dark",
  placeholder,
  className,
}: CodeEditorProps) {
  const loading = (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      加载编辑器...
    </div>
  )

  // 高度落在外层容器上、Editor 撑满：这样 height="100%" 交给父容器决定时
  // 也成立（若落在 Editor 上而外层无高度，容器会塌成 0）。
  return (
    <div
      style={{ height }}
      className={cn(
        "relative overflow-hidden rounded-md border border-input",
        className
      )}
    >
      <React.Suspense fallback={loading}>
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={(v) => onChange?.(v ?? "")}
          theme={theme === "dark" ? "vs-dark" : "light"}
          loading={loading}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineNumbers: "on",
            readOnly,
            wordWrap: "on",
            automaticLayout: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: "line",
            scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
            padding: { top: 8, bottom: 8 },
            tabSize: 2,
          }}
        />
      </React.Suspense>
      {placeholder && !value && (
        <div className="pointer-events-none absolute left-[52px] top-2 font-mono text-sm text-muted-foreground/70">
          {placeholder}
        </div>
      )}
    </div>
  )
}
