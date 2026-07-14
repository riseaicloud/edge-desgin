import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@riseaicloud/ui"

export interface ContainerStatusInfo {
  name: string
  ready: boolean
  restartCount: number
  state?: {
    running?: {
      startedAt?: string
    }
    waiting?: {
      reason?: string
      message?: string
    }
    terminated?: {
      reason?: string
      exitCode?: number
      startedAt?: string
      finishedAt?: string
    }
  }
}

export interface PodStatusInfo {
  phase?: string
  containerStatuses?: ContainerStatusInfo[]
  initContainerStatuses?: ContainerStatusInfo[]
  conditions?: Array<{
    type: string
    status: string
    reason?: string
    message?: string
  }>
  deletionTimestamp?: string
}

export interface ContainerStatusProps {
  containers?: PodStatusInfo
  className?: string
}

const translateStatus = (status: string | undefined): string => {
  if (!status) return ""

  const normalizedStatus = status.toUpperCase().replace(/-/g, "_")

  const statusMap: { [key: string]: string } = {
    RUNNING: "运行中",
    PENDING: "等待中",
    WAITING: "等待中",
    COMPLETED: "已完成",
    ERROR: "错误",
    FAILED: "失败",
    TERMINATED: "已终止",
    TERMINATING: "删除中",
    CONTAINER_CREATING: "创建容器中",
    CONTAINERCREATING: "创建容器中",
    CONTAINER_NOT_READY: "容器未就绪",
    CONTAINERS_NOT_READY: "容器未就绪",
    CONTAINERNOTREADY: "容器未就绪",
    CONTAINERSNOTREADY: "容器未就绪",
    CRASH_LOOP_BACK_OFF: "反复崩溃",
    CRASHLOOPBACKOFF: "反复崩溃",
    IMAGE_PULL_BACK_OFF: "镜像拉取失败",
    IMAGEPULLBACKOFF: "镜像拉取失败",
    ERR_IMAGE_PULL: "镜像拉取失败",
    ERRIMAGEPULL: "镜像拉取失败",
    UNSCHEDULABLE: "无法调度",
    OUT_OF_MEMORY: "内存不足",
    OUTOFMEMORY: "内存不足",
    OUT_OF_CPU: "CPU 不足",
    OUTOFCPU: "CPU 不足",
    SUCCEEDED: "已完成",
    INIT: "初始化中",
    PODINITIALIZING: "初始化中",
  }

  return statusMap[normalizedStatus] || status
}

export function ContainerStatus({
  containers,
  className = "",
}: ContainerStatusProps) {
  const StatusIcon = ({ status }: { status: string }) => {
    if (containers?.deletionTimestamp) {
      return (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )
    }
    let displayStatus = status
    if (status === "Running") {
      const containerStatuses = containers?.containerStatuses || []
      const allReady = containerStatuses.every((c: any) => c.ready)
      displayStatus = allReady ? "Running" : "Pending"
    }
    switch (displayStatus) {
      case "Running":
        return (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        )
      case "Pending":
      case "ContainerCreating":
      case "Init":
      case "PodInitializing":
        return (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
        )
      case "ImagePullBackOff":
      case "ErrImagePull":
      case "CrashLoopBackOff":
      case "ContainerNotReady":
      case "Unschedulable":
      case "OutOfMemory":
      case "OutOfCpu":
      case "Failed":
      case "Error":
        return <span className="inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      case "Succeeded":
      case "Completed":
        return <span className="inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      default:
        return <span className="inline-flex rounded-full h-2 w-2 bg-gray-400"></span>
    }
  }

  const getStatusText = (containers: PodStatusInfo) => {
    if (containers?.deletionTimestamp) {
      return "删除中"
    } else if (containers.phase === "Running") {
      return "运行中"
    } else if (containers.phase === "Pending") {
      return "等待中"
    } else if (containers.phase === "Failed" || containers.phase === "Error") {
      return "运行失败"
    } else if (containers.phase === "Succeeded" || containers.phase === "Completed") {
      return "已完成"
    }
    return translateStatus(containers.phase)
  }

  if (!containers) {
    return <span className="text-muted-foreground text-xs">无容器信息</span>
  }

  const hasConditions =
    containers.conditions && containers.conditions.length > 0

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {containers.phase && (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block cursor-pointer">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <StatusIcon status={containers.phase} />
                    <span className="border-b border-dashed border-muted-foreground transition-colors">
                      {getStatusText(containers)}
                    </span>
                  </div>
                  {containers?.containerStatuses &&
                    containers.phase === "Running" &&
                    containers.containerStatuses.length > 0 &&
                    containers.containerStatuses.filter((c: any) => c.ready === false).length >
                      0 && (
                      <div className="text-xs text-muted-foreground mt-1 cursor-pointer">
                        容器就绪数：
                        {containers.containerStatuses.filter((c: any) => c.ready)
                          .length}
                        /{containers.containerStatuses.length}
                      </div>
                    )}
                </div>
              </TooltipTrigger>
              {hasConditions && (
                <TooltipContent side="right" className="max-w-md">
                  <div className="space-y-2">
                    <div className="font-semibold text-xs mb-2">状态详情</div>
                    {containers.conditions?.map((condition, index) => (
                      <div
                        key={index}
                        className="text-xs space-y-1 border-b border-border last:border-0 pb-2 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{condition.type}:</span>
                          <span
                            className={
                              condition.status === "True"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }
                          >
                            {condition.status}
                          </span>
                        </div>
                        {condition.reason && (
                          <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">
                              reason:{" "}
                            </span>
                            {condition.reason}
                          </div>
                        )}
                        {condition.message && (
                          <div className="text-muted-foreground">
                            <span className="font-medium text-foreground">
                              message:{" "}
                            </span>
                            {condition.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
