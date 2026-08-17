---
"@riseaicloud/ui": patch
---

清债两项：CollapsibleSection 换 Radix Collapsible 底座（曾是 useState+条件渲染手搓、与包内 Collapsible 原语两套并存；API 不变，aria-expanded/键盘由原语托管，data-state 可挂过渡动画）；PageHeader 返回箭头从手写内联 SVG 换 lucide ChevronLeft（对齐全包图标惯例）。另：CodeEditor 高度语义修正——height 落在外层容器、Editor 撑满，height="100%" 交由父容器决定时不再塌陷。
