import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@riseaicloud/ui"

export interface ReplicaAdjustmentCardProps {
  currentReplicas: number
  desiredReplicas: number
  onReplicaChange: (newReplicas: number) => void
  isLoading?: boolean
  minReplicas?: number
  maxReplicas?: number
}

export function ReplicaAdjustmentCard({
  currentReplicas,
  desiredReplicas,
  onReplicaChange,
  isLoading = false,
  minReplicas = 0,
  maxReplicas = 100,
}: ReplicaAdjustmentCardProps) {
  const effectiveDesired = desiredReplicas
  const progressPercentage =
    effectiveDesired > 0 ? (currentReplicas / effectiveDesired) * 100 : 0
  const clampedProgress = Math.min(Math.max(progressPercentage, 0), 100)

  const svgSize = 65
  const radius = 28
  const center = svgSize / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = `${
    (clampedProgress / 100) * circumference
  } ${circumference}`

  const handleIncrease = () => {
    const newReplicas = effectiveDesired + 1
    if (newReplicas <= maxReplicas) {
      onReplicaChange(newReplicas)
    }
  }

  const handleDecrease = () => {
    const newReplicas = effectiveDesired - 1
    if (newReplicas >= minReplicas) {
      onReplicaChange(newReplicas)
    }
  }

  return (
    <div
      className="relative p-3 rounded-lg"
      style={{
        backgroundColor: "#1a1f2e",
        width: "300px",
        height: "120px",
      }}
    >
      {/* Action buttons */}
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex flex-col space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-white hover:bg-white/20 rounded-full"
          onClick={handleIncrease}
          disabled={isLoading || effectiveDesired >= maxReplicas}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-white hover:bg-white/20 rounded-full"
          onClick={handleDecrease}
          disabled={isLoading || effectiveDesired <= minReplicas}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex items-center space-x-6 h-full">
        {/* Progress ring */}
        <div className="relative">
          <svg width={svgSize} height={svgSize} className="transform -rotate-90">
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#2a3142"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#52c41a"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className="transition-all duration-300 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {currentReplicas}/{effectiveDesired}
            </span>
          </div>
        </div>

        {/* Info area */}
        <div className="flex-1">
          <h3 className="text-white text-sm font-bold mb-2">副本</h3>
          <div className="space-y-1">
            <div className="text-xs" style={{ color: "#8b92a3" }}>
              期望副本数: {effectiveDesired}
            </div>
            <div className="text-xs" style={{ color: "#8b92a3" }}>
              当前副本数: {currentReplicas}
            </div>
            {isLoading && (
              <div className="text-xs text-orange-400">调整中...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
