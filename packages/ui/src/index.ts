// ─── Utilities ────────────────────────────────────────────────────────────────
export * from './utils'

// ─── Layout ──────────────────────────────────────────────────────────────────
export { Separator } from './components/separator'
export { ScrollArea, ScrollBar } from './components/scroll-area'
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './components/collapsible'

export { PageHeader } from './components/page-header'
export type { PageHeaderProps } from './components/page-header'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './components/breadcrumb'

// ─── General ─────────────────────────────────────────────────────────────────
export { Button, buttonVariants } from './components/button'
export type { ButtonProps } from './components/button'

export { Badge, badgeVariants } from './components/badge'
export type { BadgeProps } from './components/badge'

export { Avatar, AvatarImage, AvatarFallback } from './components/avatar'

export { Label } from './components/label'

// ─── Data Entry ───────────────────────────────────────────────────────────────
// ── 下拉：唯一推荐入口是门面 Select（一行用，单选/多选/搜索/滚动分页全在 props）──
// SearchableSelect 已内化为门面的 combobox 引擎，不再公开导出（2026-08，当时采用数为 0）。
export { Select } from './components/select-facade'
export type { SelectProps, SelectOption } from './components/select-facade'

// ── 单选家族：值要提交 → RadioGroup（圆点）/ SegmentedControl（按钮皮）；
// 纯切视图 → Tabs；允许全不选的筛选 → ToggleGroup。
export { SegmentedControl } from './components/segmented-control'
export type { SegmentedControlProps, SegmentedOption } from './components/segmented-control'

// ── Field* = 表单布局层（label/描述/错误/选项卡片的排版）；Form* = 校验绑定层。
// 分工见 field.tsx 头注释，可嵌套组合，勿用 Field* 传值、勿用 Form* 排版。
export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from './components/field'

export { CodeEditor } from './components/code-editor'
export type { CodeEditorProps } from './components/code-editor'

export { QuantityInput } from './components/quantity-input'
export type { QuantityInputProps, QuantityUnit } from './components/quantity-input'

export { HoverCard, HoverCardTrigger, HoverCardContent } from './components/hover-card'

export { PropertyHoverCard } from './components/property-hover-card'
export type { PropertyHoverCardProps } from './components/property-hover-card'

export { UsageMeter } from './components/usage-meter'
export type { UsageMeterProps, UsageMeterDetail } from './components/usage-meter'

export { CopyButton } from './components/copy-button'
export type { CopyButtonProps } from './components/copy-button'

export { ResourceNameCell } from './components/resource-name-cell'
export type { ResourceNameCellProps } from './components/resource-name-cell'

export { DateRangePicker } from './components/date-range-picker'
export type { DateRangePickerProps, DateRange, DateRangePreset } from './components/date-range-picker'

export { Input } from './components/input'
export type { InputProps } from './components/input'

export { Textarea } from './components/textarea'
export type { TextareaProps } from './components/textarea'

// 组合式积木（深度定制逃生门）。原 `Select` 已改名 `SelectRoot`，把好名字让给门面。
export {
  SelectRoot,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './components/select'

export { Checkbox } from './components/checkbox'
export type { CheckboxProps } from './components/checkbox'

export { RadioGroup, RadioGroupItem } from './components/radio-group'
export type { RadioGroupProps, RadioGroupItemProps } from './components/radio-group'

export { Switch } from './components/switch'
export type { SwitchProps } from './components/switch'

export { Toggle, toggleVariants } from './components/toggle'

export { ToggleGroup, ToggleGroupItem } from './components/toggle-group'

export {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './components/form'

export { LabelEditor } from './components/LabelEditor'
export type { KeyValue, LabelEditorProps } from './components/LabelEditor'

// ─── Data Display ─────────────────────────────────────────────────────────────
export { DataTable } from './components/data-table'
export type { DataTableProps, ColumnDef, RowAction, DeleteConfig, ExportConfig, SearchFilter, BatchAction } from './components/data-table'

export { PropertyList } from './components/property-list'
export type { PropertyListProps, PropertyItem } from './components/property-list'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/card'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/table'

export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs'

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/tooltip'

export { EmptyState } from './components/empty-state'
export type { EmptyStateProps } from './components/empty-state'

export { NumberField } from './components/number-field'
export type { NumberFieldProps } from './components/number-field'

export { Progress } from './components/progress'

// ─── Feedback ────────────────────────────────────────────────────────────────
export { Alert, AlertTitle, AlertDescription } from './components/alert'

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/alert-dialog'

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/dialog'

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './components/sheet'
export type { SheetContentProps } from './components/sheet'

export { Spinner, Loading } from './components/spinner'

export { LoadingOverlay } from './components/loading-overlay'
export type { LoadingOverlayProps } from './components/loading-overlay'

export { Skeleton } from './components/skeleton'
export type { SkeletonProps } from './components/skeleton'

export { StatusIndicator } from './components/status-indicator'
export type { StatusIndicatorProps, StatusVariant } from './components/status-indicator'

export { ConfirmDialog } from './components/confirm-dialog'
export type { ConfirmDialogProps } from './components/confirm-dialog'

export { ConfirmDeleteDialog } from './components/confirm-delete-dialog'
export type { ConfirmDeleteDialogProps } from './components/confirm-delete-dialog'

export { NameConfirmDeleteDialog } from './components/name-confirm-delete-dialog'
export type { NameConfirmDeleteDialogProps } from './components/name-confirm-delete-dialog'

export { CreateResourceDialog } from './components/create-resource-dialog'
export type { CreateResourceDialogProps } from './components/create-resource-dialog'

export { YamlEditDialog } from './components/yaml-edit-dialog'
export type { YamlEditDialogProps } from './components/yaml-edit-dialog'

export { ProgressRing } from './components/progress-ring'
export type { ProgressRingProps } from './components/progress-ring'

export { CollapsibleSection } from './components/collapsible-section'
export type { CollapsibleSectionProps } from './components/collapsible-section'

// ─── Navigation ───────────────────────────────────────────────────────────────
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './components/dropdown-menu'

export { Pagination } from './components/pagination'
export type { PaginationProps } from './components/pagination'

// ─── Overlay ──────────────────────────────────────────────────────────────────
export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent } from './components/popover'

// ─── Charts ──────────────────────────────────────────────────────────────────
export { ChartContainer, ChartTooltip, ChartTooltipContent } from './components/chart'
export type { ChartConfig } from './components/chart'

// ─── Telemetry ───────────────────────────────────────────────────────────────
export { KPICard } from './components/kpi-card'
export type { KPICardProps } from './components/kpi-card'

export { ResourceChart } from './components/resource-chart'
export type { ResourceChartProps, ResourceChartDataPoint } from './components/resource-chart'


