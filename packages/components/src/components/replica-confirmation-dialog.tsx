import * as React from "react"
import { Info, X } from "lucide-react"
import { Button } from "@riseaicloud/ui"

export interface ReplicaConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetReplicas: number
  currentReplicas: number
  onConfirm: () => void
  onCancel: () => void
  isConfirming?: boolean
}

export function ReplicaConfirmationDialog({
  open,
  onOpenChange,
  targetReplicas,
  currentReplicas,
  onConfirm,
  onCancel,
  isConfirming = false,
}: ReplicaConfirmationDialogProps) {
  const [countdown, setCountdown] = React.useState(5)

  React.useEffect(() => {
    if (open) {
      setCountdown(5)
    }
  }, [open, targetReplicas])

  React.useEffect(() => {
    if (!open) return

    if (countdown <= 0) {
      handleConfirm()
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [open, countdown])

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel()
    onOpenChange(false)
  }

  const isIncreasing = targetReplicas > currentReplicas
  const actionText = isIncreasing ? "增加" : "减少"

  if (!open) return null

  return (
    <div
      className="fixed right-6 top-6 z-50 w-96 bg-white rounded-lg border border-border shadow-lg"
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Info className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                调整副本数量
              </h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          您确定将容器组副本数量从{" "}
          <span className="font-medium">{currentReplicas}</span> {actionText}到{" "}
          <span className="font-medium">{targetReplicas}</span> 吗？
        </p>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isConfirming}
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="bg-gray-800 hover:bg-gray-900 text-white"
            style={{ backgroundColor: "#1a2332" }}
          >
            {isConfirming ? (
              "调整中..."
            ) : countdown > 0 ? (
              `确定 (${countdown}s)`
            ) : (
              "确定"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
