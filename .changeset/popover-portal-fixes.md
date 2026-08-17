---
"@riseaicloud/ui": patch
---

浮层剪裁修复两处（与 searchable-select 引擎同一教训：不 Portal 的浮层在 overflow 容器/Dialog/表格里必被剪裁）：HoverCard Content 补 Radix Portal（对齐 shadcn 新版）；DateRangePicker 从手写 absolute 浮层 + document 外点监听整体迁到 Radix Popover（Portal 渲染、外点/Esc 关闭托管、碰撞翻转定位），对外 API 不变。另修 DateRangePicker 伪主题色：选中日期圆点与确定按钮误用 bg-foreground（固定黑）当强调色、与范围中段的 bg-primary/10 自相矛盾，统一改 primary 配对——默认经典蓝主题即蓝色，跟随 6 档主题与暗色。
