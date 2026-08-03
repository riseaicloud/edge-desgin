"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog"
import { Input } from "./input"
import { Label } from "./label"
import { Checkbox } from "./checkbox"

export interface NameConfirmDeleteDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** The identifier the user must type to confirm */
  resourceIdentifier?: string
  /** Resource type label displayed in the title and input hint */
  resourceType: string
  /** Async callback invoked when name matches and user confirms */
  onConfirm: () => Promise<void>
  /** Disables inputs and shows loading state */
  isLoading?: boolean
  /** Error message shown in a red banner */
  error?: string | null
  /** Prefix for the dialog title (e.g. "删除集群") */
  titlePrefix?: string
  /** Additional description text shown above the input */
  extraDescription?: string
  /** Whether to show a cascade-delete checkbox */
  showCascadeOption?: boolean
  /** Callback when cascade toggle changes */
  onCascadeChange?: (cascade: boolean) => void
  /** Initial value of the cascade checkbox */
  defaultCascade?: boolean
}

/**
 * NameConfirmDeleteDialog — High-protection deletion dialog that requires the
 * user to type the exact resource identifier before the confirm button becomes enabled.
 *
 * Used for irreversible, high-impact deletions (clusters, workspaces, etc.).
 * The red circular warning icon (distinct from ConfirmDeleteDialog's AlertTriangle)
 * signals maximum-danger operations.
 *
 * For simpler batch deletions, use `ConfirmDeleteDialog` instead.
 */
export function NameConfirmDeleteDialog({
  open,
  onOpenChange,
  resourceIdentifier,
  resourceType,
  onConfirm,
  isLoading = false,
  error = null,
  titlePrefix = "删除",
  extraDescription,
  showCascadeOption = false,
  onCascadeChange,
  defaultCascade = false,
}: NameConfirmDeleteDialogProps) {
  const [confirmText, setConfirmText] = useState("")
  const [cascade, setCascade] = useState(defaultCascade)

  useEffect(() => {
    if (open) {
      setConfirmText("")
      setCascade(defaultCascade)
    }
  }, [open, resourceIdentifier, defaultCascade])

  const handleCascadeChange = (checked: boolean) => {
    setCascade(checked)
    onCascadeChange?.(checked)
  }

  const handleConfirm = async () => {
    if (!resourceIdentifier || confirmText !== resourceIdentifier) return
    await onConfirm()
  }

  const handleClose = () => {
    if (!isLoading) {
      setConfirmText("")
      onOpenChange(false)
    }
  }

  const isConfirmDisabled = isLoading || !confirmText || confirmText !== resourceIdentifier

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <svg className="h-4 w-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <span>{titlePrefix}{resourceType}</span>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4 my-4">
          {extraDescription && (
            <p className="text-sm text-muted-foreground">{extraDescription}</p>
          )}

          {showCascadeOption && (
            <div className="flex items-start space-x-2 p-3 bg-muted border border-border rounded">
              <Checkbox
                id="cascade-delete"
                checked={cascade}
                onCheckedChange={(checked) => handleCascadeChange(!!checked)}
                disabled={isLoading}
              />
              <div className="flex-1">
                <Label htmlFor="cascade-delete" className="text-sm font-medium text-foreground cursor-pointer">
                  同时删除关联资源
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  勾选此项将删除所有关联的项目、成员等资源，不勾选则保留这些资源
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name-confirm-input" className="text-sm font-medium text-foreground">
              请输入{resourceType}名称{" "}
              <span className="font-mono bg-muted px-2 py-0.5 rounded">{resourceIdentifier}</span>{" "}
              以确认：
            </Label>
            <Input
              id="name-confirm-input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`请输入${resourceType}名称`}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded p-3">
              {error}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={handleClose}>
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground disabled:opacity-50"
          >
            {isLoading ? `${titlePrefix}中...` : `确认${titlePrefix}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
