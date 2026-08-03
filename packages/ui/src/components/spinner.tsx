import { cn } from "../utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-foreground",
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingProps {
  text?: string
  className?: string
}

export function Loading({ text = "加载中...", className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Spinner size="lg" className="border-muted border-t-primary" />
      <p className="text-sm text-primary">{text}</p>
    </div>
  )
}
