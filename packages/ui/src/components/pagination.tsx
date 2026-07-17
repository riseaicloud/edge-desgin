import * as React from "react"
import { Button } from "./button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select"

export interface PaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  className?: string
  /** Page size options */
  pageSizeOptions?: number[]
}

export function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className = "",
  pageSizeOptions = [5, 10, 15, 20, 50, 100],
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
  }

  return (
    <div className={className}>
      {/* 分页条底色走 surface token（原为 inline style 硬编码 #F9FBFD，不跟主题） */}
      <div className="p-3 bg-surface-toolbar">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4 text-muted-foreground">
            {onPageSizeChange && (
              <label className="flex items-center space-x-2">
                <span>每页显示：</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => {
                    const v = Number(val)
                    if (!isNaN(v)) onPageSizeChange(v)
                  }}
                >
                  <SelectTrigger className="h-6 text-xs w-[66px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>条</span>
              </label>
            )}
            <span>总数：{totalItems}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              &lt;
            </Button>
            <span className="px-3 text-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
