---
"@riseaicloud/ui": patch
---

Checkbox 与 Switch 换回 shadcn/Radix 原版实现（依赖早已安装未用），清零 ui 包手搓债：Checkbox 修复键盘焦点不可见（focus-visible 写在不可聚焦 div 上），onCheckedChange 保持只回调 boolean 的旧契约；Switch 从 5-prop 受控残缺版扩为 Radix 超集（id/Label 关联、defaultChecked、forwardRef、表单 name/value 全修复），尺寸保持 h-5 w-9 不变。附带：YamlEditDialog 的 @monaco-editor/react 改为 React.lazy 动态加载（barrel 不再静态背上 monaco wrapper）并顺手 token 化一处 #EFF4F9 硬编码；CollapsibleSection 折叠头补 aria-expanded。
