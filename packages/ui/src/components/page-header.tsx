import React from 'react'
import { ChevronLeft } from 'lucide-react'

export interface PageHeaderProps {
  title: string
  icon?: React.ReactNode
  onBack?: () => void
  extra?: React.ReactNode
}

export function PageHeader({ title, icon, onBack, extra }: PageHeaderProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 flex-shrink-0 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {onBack && (
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer mr-1 flex items-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <h1 className="text-lg font-medium text-foreground">{title}</h1>
      </div>
      {extra && <div className="flex items-center gap-2">{extra}</div>}
    </div>
  )
}
