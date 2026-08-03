---
"@riseaicloud/ui": minor
---

组件去固定色：16 个组件的硬编码 Tailwind 调色板 → 语义 token

`bg-white` / `text-gray-*` / `bg-blue-600` 这类固定色不随 `.dark` 反转，导致暗色下白底白字、
表格与弹窗整块发白。本次把 187 处（构建产物 143 处）迁到语义 token，按 shadcn 分层映射：
表面 `bg-card`、输入 `bg-background`、浮层 `bg-popover`、hover `bg-muted/50`、
危险色 `text-destructive`、主色 `text-primary`。

改动最大的是 `DataTable`（67 处）与 `DateRangePicker`（28 处）。浅色下逐值核对为近似零变化
（`--primary` 恰好等于 `blue-600`；`gray-200`→`border` 是 gray→slate 的肉眼无差替换）。

**两类有意保留的硬编码色**：
- 遮罩 `bg-black/80` —— `bg-background/80` 在浅色下是白半透明，等于没有遮罩
- 状态色相（绿/黄/红/蓝）—— 色相本身即语义，不该随品牌主题反转；仅中性态改用
  `bg-muted-foreground`（灰必须跟前景反转），并给涨跌/警戒色补 `dark:` 变体

**行为变更**：`KPICard` 的 `iconBgColor` / `iconColor` 默认值由 `'bg-blue-50'` / `'text-blue-600'`
改为 `'bg-primary/10'` / `'text-primary'`。显式传值的调用方不受影响。
