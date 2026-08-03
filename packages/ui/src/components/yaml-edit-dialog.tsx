"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { AlertCircle, FileText } from "lucide-react"
import Editor from "@monaco-editor/react"
import { load as parseYaml } from "js-yaml"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "./dialog"
import { Button } from "./button"
import { Alert, AlertDescription } from "./alert"


export interface YamlEditDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Shown in the title bar with a FileText icon */
  title: string
  /** Shown inline next to the title (small text) */
  description?: string
  /** Async save callback; required unless readOnly */
  onConfirm?: (yaml: string) => Promise<void>
  /** External loading state (disables editor and buttons) */
  isUpdating?: boolean
  /** YAML content loaded into the editor on open */
  initialYaml?: string
  /** Whether to run YAML/JSON parse validation on change */
  showValidation?: boolean
  /** Renders a "关闭" button only; editor is not editable */
  readOnly?: boolean
}

/**
 * YamlEditDialog — Full-screen YAML editor dialog backed by Monaco Editor.
 *
 * Supports YAML/JSON syntax validation, read-only view mode, and async save.
 * Uses a near-fullscreen layout with a dark Monaco editor on #EFF4F9 background.
 *
 * For a lightweight alternative without Monaco, use `CreateResourceDialog`.
 *
 * **Dependency:** requires `@monaco-editor/react` and Monaco Editor web workers.
 */
export function YamlEditDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isUpdating = false,
  initialYaml = "",
  showValidation = true,
  readOnly = false,
}: YamlEditDialogProps) {
  const [yaml, setYaml] = useState(initialYaml)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setYaml(initialYaml)
      setError(null)
    }
  }, [open, initialYaml])

  const validateYaml = (content: string): boolean => {
    if (!showValidation) return true
    const trimmed = content.trim()
    if (!trimmed) {
      setError("YAML 内容不能为空")
      return false
    }
    try {
      parseYaml(trimmed)
      setError(null)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "YAML 格式错误")
      return false
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    const next = value ?? ""
    setYaml(next)
    if (showValidation && next.trim()) {
      validateYaml(next)
    } else {
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!yaml.trim()) {
      setError("YAML 内容不能为空")
      return
    }
    if (showValidation && !validateYaml(yaml)) return
    if (!onConfirm) return

    try {
      setIsSubmitting(true)
      setError(null)
      await onConfirm(yaml)
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setYaml(initialYaml)
    setError(null)
    onOpenChange(false)
  }

  const isProcessing = isUpdating || isSubmitting
  const hasValidYaml = yaml.trim() && (!showValidation || !error)

  return (
    <Dialog open={open} onOpenChange={!isProcessing ? onOpenChange : undefined}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogContent className="max-w-[calc(100vw-2rem)] w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] h-[calc(100vh-2rem)] p-0 gap-0">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div
              className="px-6 py-3 border-b border-border flex-shrink-0"
              style={{ backgroundColor: "#F9FBFF" }}
            >
              <div className="flex items-baseline space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <DialogTitle className="text-lg font-medium text-foreground leading-none">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-xs text-muted-foreground leading-none">
                    {description}
                  </DialogDescription>
                )}
              </div>
            </div>

            {/* Editor area */}
            <div
              className="flex-1 overflow-auto p-4"
              style={{ backgroundColor: "#EFF4F9" }}
            >
              <div className="bg-card rounded border border-border h-full flex flex-col">
                <div className="flex-1 p-4 flex flex-col space-y-4">
                  <div className="flex-1 border border-border rounded overflow-hidden">
                    <Editor
                      height="100%"
                      defaultLanguage="yaml"
                      value={yaml}
                      onChange={handleEditorChange}
                      theme="vs-dark"
                      loading={
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          加载编辑器...
                        </div>
                      }
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 13,
                        lineNumbers: "on",
                        folding: true,
                        foldingStrategy: "indentation",
                        showFoldingControls: "always",
                        wordWrap: "on",
                        automaticLayout: true,
                        readOnly: readOnly || isProcessing,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: "line",
                        scrollbar: {
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8,
                        },
                        fontFamily:
                          'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                      }}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-card flex-shrink-0">
              <DialogFooter className="flex justify-end gap-3 m-0">
                {readOnly ? (
                  <Button variant="outline" onClick={handleCancel} className="h-8">
                    关闭
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isProcessing}
                      className="h-8"
                    >
                      取消
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isProcessing || !hasValidYaml}
                      className="h-8"
                    >
                      {isProcessing ? "保存中..." : "保存"}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
