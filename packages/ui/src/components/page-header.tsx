import React from 'react'

export interface PageHeaderProps {
  title: string
  icon?: React.ReactNode
  onBack?: () => void
  extra?: React.ReactNode
}

export function PageHeader({ title, icon, onBack, extra }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {onBack && (
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer mr-1 flex items-center"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <h1 className="text-lg font-medium text-gray-900">{title}</h1>
      </div>
      {extra && <div className="flex items-center gap-2">{extra}</div>}
    </div>
  )
}
