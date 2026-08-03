"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import { Button } from "./button"

export interface ConfirmDeleteDialogProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Dialog title */
  title: string
  /** Description of the delete action */
  description: string
  /** List of item names to be deleted */
  itemNames: string[]
  /** Async callback when user confirms deletion */
  onConfirm: () => Promise<void>
  /** Whether a deletion is in progress */
  loading?: boolean
}

/**
 * ConfirmDeleteDialog — Danger confirmation dialog for deleting one or more items.
 *
 * Displays the list of items to be deleted with red warning styling.
 * Calls the async `onConfirm` handler and closes on success.
 *
 * For single high-value resources requiring name verification, use `ConfirmDialog`
 * with `confirmText` and `destructive` props instead.
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  itemNames,
  onConfirm,
  loading = false,
}: ConfirmDeleteDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onOpenChange(false)
    } catch {
      // error handling is caller's responsibility
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle className="text-destructive">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-left">{description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm font-medium text-foreground mb-2">将要删除的项目：</p>
          <div className="max-h-32 overflow-y-auto border rounded p-2 bg-muted">
            {itemNames.map((name, index) => (
              <div key={index} className="text-sm text-foreground py-1">
                • {name}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "删除中..." : "确认删除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
