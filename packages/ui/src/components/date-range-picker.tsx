"use client"

// Datetime-range picker built on react-day-picker (two-month range calendar) +
// date-fns. The trigger pill, presets sidebar, date/time inputs, year-jump nav
// and 确定 (buffered commit) are composed here and fully Tailwind-styled via
// `classNames` — no react-day-picker CSS import, and no portal (inline absolute
// panel), so it renders correctly even when a remote plugin mounts it through
// `SDK.components` (no react-dom dependency in the plugin bundle).
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import { format, addMonths, subMonths, addYears, subYears, startOfMonth, startOfDay, endOfDay } from "date-fns"
import { Calendar } from "lucide-react"
import { cn } from "../utils"

// ─── Types ───────────────────────────────────────────────────────────────────

/** Selected range as epoch milliseconds. */
export interface DateRange {
  start: number
  end: number
}

/** A quick-select preset: sets [now - ms, now]. */
export interface DateRangePreset {
  label: string
  ms: number
}

export interface DateRangePickerProps {
  /** Current range (epoch ms). */
  value: DateRange
  /** Commit callback (fires on 确定 / preset+确定, not on every calendar click). */
  onChange: (range: DateRange) => void
  /** Clamp the span to this many days (mirrors CAMP ValidateTimelineDuration).
   *  `0` / omitted = no limit. Also filters out presets longer than the limit. */
  maxDays?: number
  /** Left-side label. Omit for no label. */
  label?: string
  /** Quick-select presets. Pass `[]` to hide the sidebar. Defaults to a
   *  1h→3mo ladder. */
  presets?: DateRangePreset[]
  /** Show the HH:mm:ss time inputs. When false the picker is date-only and
   *  commits start-of-day / end-of-day. Default true. */
  showTime?: boolean
  /** Number of month panels. Default 2. */
  numberOfMonths?: number
  /** Allow selecting days after today. Default false (future disabled). */
  allowFuture?: boolean
  /** date-fns format for the trigger text. Defaults to `MM-dd HH:mm:ss`
   *  (or `yyyy-MM-dd` when `showTime` is false). */
  displayFormat?: string
  /** Extra classes on the outer wrapper. */
  className?: string
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_PRESETS: DateRangePreset[] = [
  { label: "前1小时", ms: 3600e3 },
  { label: "前6小时", ms: 6 * 3600e3 },
  { label: "前12小时", ms: 12 * 3600e3 },
  { label: "前1天", ms: 864e5 },
  { label: "前2天", ms: 2 * 864e5 },
  { label: "前一周", ms: 7 * 864e5 },
  { label: "前两周", ms: 14 * 864e5 },
  { label: "前一个月", ms: 30 * 864e5 },
  { label: "前三个月", ms: 90 * 864e5 },
]

const inputCls =
  "h-8 px-2 text-xs bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"

function mergeDateTime(date: Date, time: string): Date {
  const [h = 0, m = 0, s = 0] = time.split(":").map(Number)
  const d = new Date(date)
  d.setHours(h, m, s, 0)
  return d
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DateRangePicker({
  value,
  onChange,
  maxDays = 0,
  label,
  presets = DEFAULT_PRESETS,
  showTime = true,
  numberOfMonths = 2,
  allowFuture = false,
  displayFormat,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => startOfMonth(new Date(value.start)))
  const [from, setFrom] = useState<Date>(new Date(value.start))
  const [to, setTo] = useState<Date>(new Date(value.end))
  const [startTime, setStartTime] = useState(format(new Date(value.start), "HH:mm:ss"))
  const [endTime, setEndTime] = useState(format(new Date(value.end), "HH:mm:ss"))
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [open])

  const shownPresets = maxDays > 0 ? presets.filter((p) => p.ms <= maxDays * 864e5) : presets

  const openPanel = () => {
    setFrom(new Date(value.start))
    setTo(new Date(value.end))
    setStartTime(format(new Date(value.start), "HH:mm:ss"))
    setEndTime(format(new Date(value.end), "HH:mm:ss"))
    setMonth(startOfMonth(new Date(value.start)))
    setOpen(true)
  }
  const applyPreset = (ms: number) => {
    const end = new Date()
    const start = new Date(Date.now() - ms)
    setFrom(start)
    setTo(end)
    setStartTime(format(start, "HH:mm:ss"))
    setEndTime(format(end, "HH:mm:ss"))
    setMonth(startOfMonth(start))
  }
  const confirm = () => {
    const s = showTime ? mergeDateTime(from, startTime) : startOfDay(from)
    const e = showTime ? mergeDateTime(to, endTime) : endOfDay(to)
    onChange({ start: s.getTime(), end: e.getTime() })
    setOpen(false)
  }

  const trigFmt = displayFormat ?? (showTime ? "MM-dd HH:mm:ss" : "yyyy-MM-dd")
  const triggerText = `${format(new Date(value.start), trigFmt)}  至  ${format(new Date(value.end), trigFmt)}`

  // Per-month caption with «‹ ›» year/month nav (closes over month/setMonth).
  const Caption = ({ calendarMonth }: any) => {
    const d: Date = calendarMonth.date
    const NavBtn = ({ onClick, children }: any) => (
      <button
        onClick={onClick}
        className="h-6 w-6 inline-flex items-center justify-center text-gray-400 hover:text-gray-700 rounded"
      >
        {children}
      </button>
    )
    return (
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="flex gap-0.5">
          <NavBtn onClick={() => setMonth(subYears(month, 1))}>«</NavBtn>
          <NavBtn onClick={() => setMonth(subMonths(month, 1))}>‹</NavBtn>
        </div>
        <span className="text-sm font-medium text-gray-800">
          {d.getFullYear()} 年 {d.getMonth() + 1} 月
        </span>
        <div className="flex gap-0.5">
          <NavBtn onClick={() => setMonth(addMonths(month, 1))}>›</NavBtn>
          <NavBtn onClick={() => setMonth(addYears(month, 1))}>»</NavBtn>
        </div>
      </div>
    )
  }

  const DayBtn = (props: any) => {
    const { day, modifiers, className: _c, children, ...rest } = props
    // In range mode every in-range day carries `selected`; only range_start /
    // range_end are the endpoints. Circle just the endpoints; middle days keep
    // the light band (from the cell classNames) with plain text.
    const isMiddle = modifiers.range_middle
    const isEnd = !isMiddle && (modifiers.range_start || modifiers.range_end || modifiers.selected)
    return (
      <button
        {...rest}
        className={cn(
          "h-9 w-9 text-sm inline-flex items-center justify-center transition-colors",
          isEnd
            ? "bg-gray-900 text-white rounded-full font-medium"
            : isMiddle
              ? "text-gray-900"
              : modifiers.disabled
                ? "text-gray-300 cursor-not-allowed"
                : modifiers.outside
                  ? "text-gray-300"
                  : "text-gray-700 hover:bg-gray-100 rounded"
        )}
      >
        {day.date.getDate()}
      </button>
    )
  }

  return (
    <div className={cn("relative flex items-center gap-2", className)} ref={ref}>
      {label && <span className="text-xs text-gray-500 whitespace-nowrap">{label}</span>}
      <button
        onClick={() => (open ? setOpen(false) : openPanel())}
        className="h-8 pl-2.5 pr-3 inline-flex items-center gap-2 bg-background border border-border rounded text-xs text-gray-800 hover:border-gray-400"
      >
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="tabular-nums">{triggerText}</span>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 bg-background border border-border rounded shadow-lg flex"
          style={{ minWidth: numberOfMonths > 1 ? 720 : 380 }}
        >
          {shownPresets.length > 0 && (
            <div className="w-28 border-r border-gray-100 py-2 max-h-[360px] overflow-y-auto">
              {shownPresets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.ms)}
                  className="w-full text-left px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 p-3">
            {/* Date (+ optional time) inputs */}
            <div className="flex items-center gap-2 mb-2">
              <input readOnly className={`${inputCls} w-24 text-center`} value={format(from, "MM-dd")} />
              {showTime && (
                <input
                  className={`${inputCls} w-24 text-center`}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="HH:mm:ss"
                />
              )}
              <span className="text-gray-400">›</span>
              <input readOnly className={`${inputCls} w-24 text-center`} value={format(to, "MM-dd")} />
              {showTime && (
                <input
                  className={`${inputCls} w-24 text-center`}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="HH:mm:ss"
                />
              )}
            </div>

            <DayPicker
              mode="range"
              numberOfMonths={numberOfMonths}
              month={month}
              onMonthChange={setMonth}
              selected={{ from, to }}
              onSelect={(r: any) => {
                if (r?.from) {
                  setFrom(r.from)
                  setTo(r.to ?? r.from)
                }
              }}
              showOutsideDays
              hideNavigation
              weekStartsOn={0}
              {...(allowFuture ? {} : { disabled: { after: new Date() } })}
              {...(maxDays > 0 ? { max: maxDays } : {})}
              formatters={{ formatWeekdayName: (d: Date) => "日一二三四五六"[d.getDay()] }}
              components={{ MonthCaption: Caption, DayButton: DayBtn }}
              classNames={{
                months: "flex gap-6",
                month: "",
                month_grid: "border-collapse",
                weekdays: "",
                weekday: "text-xs text-gray-400 font-normal w-9 h-8 text-center",
                week: "",
                day: "p-0 text-center align-middle",
                range_middle: "bg-blue-50",
                range_start: "bg-blue-50 rounded-l-full",
                range_end: "bg-blue-50 rounded-r-full",
              }}
            />

            <div className="flex justify-end mt-2">
              <button
                onClick={confirm}
                className="h-8 px-5 text-sm rounded bg-gray-900 text-white hover:bg-gray-800"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
