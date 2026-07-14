"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'checked' | 'onCheckedChange'> {
  checked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, disabled, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement>(null)
    const inputRef = (ref || internalRef) as React.RefObject<HTMLInputElement>
    const isIndeterminate = checked === 'indeterminate'
    const isChecked = checked === true

    React.useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = isIndeterminate
    }, [isIndeterminate, inputRef])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
      props.onChange?.(e)
    }

    const handleClick = () => {
      if (disabled) return
      if (inputRef.current) {
        inputRef.current.click()
      }
    }

    return (
      <div className="relative">
        <input
          type="checkbox"
          ref={inputRef}
          className="sr-only"
          onChange={handleChange}
          checked={isChecked}
          disabled={disabled}
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "transition-colors",
            disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
            isChecked || isIndeterminate
              ? "bg-primary text-primary-foreground border-primary"
              : cn("bg-background", !disabled && "hover:bg-muted"),
            className
          )}
          onClick={handleClick}
        >
          {isChecked && (
            <div className="flex items-center justify-center text-current">
              <Check className="h-3 w-3" />
            </div>
          )}
          {isIndeterminate && (
            <div className="flex items-center justify-center text-current">
              <div className="h-0.5 w-2 bg-current" />
            </div>
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
